import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

/* ── helpers ── */
function row(label: string, value: string, highlight = false) {
  return `
    <tr>
      <td style="padding:10px 16px;width:42%;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;font-weight:600;vertical-align:top;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;color:${highlight ? '#0f172a' : '#1e293b'};font-weight:${highlight ? '700' : '400'};vertical-align:top;">${value}</td>
    </tr>`;
}

function badge(text: string, color: string, bg: string) {
  return `<span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;color:${color};background:${bg};letter-spacing:0.03em;">${text}</span>`;
}

function section(icon: string, title: string, color: string, content: string) {
  return `
    <div style="margin-bottom:20px;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <div style="background:${color};padding:10px 16px;display:flex;align-items:center;gap:8px;">
        <span style="font-size:16px;">${icon}</span>
        <span style="font-size:14px;font-weight:700;color:#fff;letter-spacing:0.02em;">${title}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;">${content}</table>
    </div>`;
}

/* ── label mappings ── */
const TRAJET_LABELS: Record<string, string> = {
  aller_simple: "Aller simple",
  aller_retour: "Aller-retour",
};
const FREQUENCE_LABELS: Record<string, string> = {
  unique: "Trajet unique",
  plusieurs: "Trajets réguliers",
};
const PRISE_EN_CHARGE_LABELS: Record<string, string> = {
  consultation: "Consultation médicale",
  hospitalisation_complete: "Hospitalisation complète",
  hospitalisation_partielle: "Hospitalisation partielle",
  hospitalisation_ambulatoire: "Hospitalisation ambulatoire",
  chimiotherapie: "Séance de chimiothérapie",
  radiotherapie: "Séance de radiothérapie",
  hemodialyse: "Séance d'hémodialyse",
  autre: "Autre motif",
};
const ALD_LABELS: Record<string, string> = {
  ald_exonerante: "ALD exonérante (100 %)",
  ald_non_exonerante: "ALD non exonérante",
  cmu: "CMU / CSS",
  pas_ald: "Pas d'ALD / CMU",
};
const BON_LABELS: Record<string, string> = {
  deja_etabli: "Déjà établi",
  a_etablir: "À établir",
  sans_bon: "Sans bon de transport",
};

/* ── parse the "message" pipe-separated string from the frontend ── */
function parseMessage(msg: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!msg) return result;
  msg.split(" | ").forEach((part) => {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) return;
    const key = part.slice(0, colonIdx).trim().toLowerCase();
    const val = part.slice(colonIdx + 1).trim();
    result[key] = val;
  });
  return result;
}

function formatDate(d: string) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  return `${day}/${m}/${y}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) throw new Error("Supabase credentials not configured");
    if (!resendApiKey) throw new Error("RESEND_API_KEY is not configured");
    if (!body.nom || !body.prenom || !body.telephone || !body.adresse_depart || !body.adresse_arrivee || !body.date_rdv || !body.heure_rdv) {
      throw new Error("Champs obligatoires manquants");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const reservationData = {
      nom: body.nom,
      prenom: body.prenom,
      telephone: body.telephone,
      email: body.email,
      adresse_depart: body.adresse_depart,
      adresse_arrivee: body.adresse_arrivee,
      distance_km: body.distance_km || null,
      duree_min: body.duree_min || null,
      date_rdv: body.date_rdv,
      heure_rdv: body.heure_rdv,
      nombre_passagers: body.nombre_passagers || null,
      message: body.message || null,
      type_trajet: body.type_trajet || "autre",
      ald_cmu: body.ald_cmu || false,
      prescription: body.prescription_medicale || false,
      statut: "pending",
    };

    const { data: insertedData, error: insertError } = await supabase
      .from("reservations")
      .insert(reservationData)
      .select()
      .single();

    if (insertError) {
      console.error("Database error:", insertError);
      throw new Error(`Erreur base de données: ${insertError.message}`);
    }

    /* ── parse extra fields from message ── */
    const parsed = parseMessage(body.message || "");
    const fauteuilRoulant = parsed["fauteuil roulant"] || parsed["fauteuil_roulant"] || "";
    const typeTrajetVal = parsed["type trajet"] || parsed["type_trajet"] || "";
    const frequenceVal = parsed["fréquence"] || parsed["frequence"] || "";
    const ageVal = parsed["âge"] || parsed["age"] || "";
    const priseEnChargeVal = parsed["prise en charge"] || parsed["prise_en_charge"] || "";
    const aldVal = parsed["ald"] || parsed["situation_ald"] || "";
    const bonVal = parsed["bon transport"] || parsed["bon_transport"] || "";
    const noteVal = parsed["note"] || "";

    const reservationId = insertedData.id.substring(0, 8).toUpperCase();
    const dateFormatted = formatDate(body.date_rdv);
    const heureFormatted = body.heure_rdv || "—";

    /* ── urgency badge ── */
    const urgentToday = body.date_rdv === new Date().toISOString().split("T")[0];
    const urgentBadge = urgentToday ? badge("AUJOURD'HUI", "#fff", "#ef4444") + " " : "";

    const emailHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Nouvelle Réservation #${reservationId}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;">

      <!-- HEADER -->
      <tr>
        <td style="background:linear-gradient(135deg,#1d4ed8 0%,#2563eb 60%,#0ea5e9 100%);border-radius:14px 14px 0 0;padding:32px 32px 28px;text-align:center;">
          <div style="font-size:28px;margin-bottom:6px;">🚖</div>
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Nouvelle Réservation</h1>
          <p style="margin:6px 0 0;font-size:13px;color:#bfdbfe;font-weight:500;">Taxi VSL Conventionné – Île-de-France</p>
          <div style="margin-top:14px;display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:20px;padding:5px 18px;">
            <span style="font-size:13px;color:#fff;font-weight:700;letter-spacing:0.05em;">Réf. #${reservationId}</span>
          </div>
        </td>
      </tr>

      <!-- DATE BANNER -->
      <tr>
        <td style="background:#0f172a;padding:13px 24px;text-align:center;">
          <span style="font-size:14px;color:#94a3b8;font-weight:500;">📅 Rendez-vous le </span>
          <span style="font-size:15px;color:#fff;font-weight:800;">${urgentBadge}${dateFormatted}</span>
          <span style="font-size:14px;color:#94a3b8;"> à </span>
          <span style="font-size:15px;color:#38bdf8;font-weight:800;">${heureFormatted}</span>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="background:#f8fafc;padding:20px 20px 8px;">

          <!-- 1. Client -->
          ${section("👤", "Informations client", "#1e40af",
            row("Nom complet", `<strong>${body.prenom} ${body.nom}</strong>`, true) +
            row("Téléphone", `<a href="tel:${body.telephone}" style="color:#2563eb;text-decoration:none;font-weight:600;">📞 ${body.telephone}</a>`) +
            (body.email ? row("Email", `<a href="mailto:${body.email}" style="color:#2563eb;text-decoration:none;">✉️ ${body.email}</a>`) : "")
          )}

          <!-- 2. Trajet -->
          ${section("🗺️", "Trajet", "#0f766e",
            row("Adresse de départ",
              `<div style="display:flex;align-items:flex-start;gap:6px;"><span style="color:#ef4444;font-size:16px;line-height:1;">📍</span><span style="font-weight:600;">${body.adresse_depart}</span></div>`) +
            row("Adresse d'arrivée",
              `<div style="display:flex;align-items:flex-start;gap:6px;"><span style="color:#22c55e;font-size:16px;line-height:1;">📍</span><span style="font-weight:600;">${body.adresse_arrivee}</span></div>`) +
            (body.distance_km ? row("Distance estimée",
              `<span style="font-weight:700;color:#0f766e;">🛣️ ${body.distance_km} km</span>`) : "") +
            (body.duree_min ? row("Durée estimée",
              `<span style="font-weight:700;color:#d97706;">⏱️ ${body.duree_min} minutes</span>`) : "")
          )}

          <!-- 3. Type de trajet -->
          ${section("🔄", "Type de trajet", "#7c3aed",
            row("Type de trajet",
              typeTrajetVal ? badge(TRAJET_LABELS[typeTrajetVal] || typeTrajetVal, "#fff", "#7c3aed") : "—") +
            row("Fauteuil roulant (PMR)",
              fauteuilRoulant.toLowerCase() === "oui"
                ? badge("Oui — Fauteuil requis", "#fff", "#dc2626")
                : badge("Non", "#fff", "#16a34a"))
          )}

          <!-- 4. Patient -->
          ${section("🏥", "Informations patient", "#dc2626",
            row("Âge du patient", ageVal ? `${ageVal}` : "—") +
            row("Type de prise en charge",
              priseEnChargeVal
                ? badge(PRISE_EN_CHARGE_LABELS[priseEnChargeVal] || priseEnChargeVal, "#fff", "#b45309")
                : "—") +
            row("Situation ALD / CMU",
              aldVal
                ? badge(ALD_LABELS[aldVal] || aldVal, "#fff",
                    aldVal === "ald_exonerante" ? "#16a34a" :
                    aldVal === "cmu" ? "#0891b2" :
                    aldVal === "pas_ald" ? "#64748b" : "#d97706")
                : "—") +
            row("Bon de transport",
              bonVal
                ? badge(BON_LABELS[bonVal] || bonVal, "#fff",
                    bonVal === "deja_etabli" ? "#16a34a" :
                    bonVal === "a_etablir" ? "#d97706" : "#64748b")
                : "—")
          )}

          ${noteVal ? section("📝", "Note complémentaire", "#475569",
            `<tr><td colspan="2" style="padding:14px 16px;font-size:13px;color:#334155;line-height:1.6;background:#f8fafc;font-style:italic;">${noteVal}</td></tr>`
          ) : ""}

        </td>
      </tr>

      <!-- ACTION BUTTON -->
      <tr>
        <td style="background:#f8fafc;padding:0 20px 20px;text-align:center;">
          <a href="tel:${body.telephone}"
            style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0ea5e9);color:#fff;font-weight:800;font-size:15px;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.02em;box-shadow:0 4px 12px rgba(37,99,235,0.35);">
            📞 Rappeler le client
          </a>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#0f172a;border-radius:0 0 14px 14px;padding:18px 24px;text-align:center;">
          <p style="margin:0 0 4px;font-size:13px;color:#94a3b8;font-weight:600;">Taxis Paris Conventionnés</p>
          <p style="margin:0;font-size:12px;color:#475569;">
            <a href="mailto:contact@taxisparis-conventionnes.fr" style="color:#38bdf8;text-decoration:none;">contact@taxisparis-conventionnes.fr</a>
            &nbsp;·&nbsp;
            <a href="tel:+33650366491" style="color:#38bdf8;text-decoration:none;">06 50 36 64 91</a>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#334155;">Réf. interne : ${insertedData.id}</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "kertous.r@gmail.com",
        subject: `🚖 Réservation #${reservationId} — ${dateFormatted} à ${heureFormatted} | ${body.prenom} ${body.nom}`,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Erreur envoi email: ${resendResponse.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Réservation enregistrée et email envoyé", reservationId: insertedData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Une erreur est survenue";
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
