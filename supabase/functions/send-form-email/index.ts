import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const isVSL = body.type === 'vsl';
    const emailSubject = isVSL ? "Nouvelle Réservation Taxi VSL Conventionné" : "Nouvelle Réservation Transfert Gare/Aéroport";

    let emailHtml = '';

    if (isVSL) {
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .section h2 { color: #1e40af; margin-top: 0; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .info-label { font-weight: bold; color: #6b7280; }
            .info-value { color: #111827; }
            .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nouvelle Réservation Taxi VSL</h1>
              <p>Taxi Conventionné CPAM</p>
            </div>
            <div class="content">
              <div class="section">
                <h2>👤 Informations Client</h2>
                <div class="info-row">
                  <span class="info-label">Nom :</span>
                  <span class="info-value">${body.nom || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Prénom :</span>
                  <span class="info-value">${body.prenom || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Téléphone :</span>
                  <span class="info-value">${body.telephone || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email :</span>
                  <span class="info-value">${body.email || 'N/A'}</span>
                </div>
              </div>
              <div class="section">
                <h2>🚗 Détails du Trajet</h2>
                <div class="info-row">
                  <span class="info-label">Départ :</span>
                  <span class="info-value">${body.adresse_depart || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Arrivée :</span>
                  <span class="info-value">${body.adresse_arrivee || 'N/A'}</span>
                </div>
                ${body.distance_km ? `
                <div class="info-row">
                  <span class="info-label">Distance :</span>
                  <span class="info-value">${body.distance_km} km</span>
                </div>
                ` : ''}
                ${body.duree_minutes ? `
                <div class="info-row">
                  <span class="info-label">Durée estimée :</span>
                  <span class="info-value">${body.duree_minutes} minutes</span>
                </div>
                ` : ''}
              </div>
              <div class="section">
                <h2>📅 Date et Heure</h2>
                <div class="info-row">
                  <span class="info-label">Date du rendez-vous :</span>
                  <span class="info-value">${body.date_rdv || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Heure du rendez-vous :</span>
                  <span class="info-value">${body.heure_rdv || 'N/A'}</span>
                </div>
              </div>
              <div class="section">
                <h2>🏥 Informations Médicales</h2>
                <div class="info-row">
                  <span class="info-label">ALD/CMU :</span>
                  <span class="info-value">${body.ald_cmu ? 'Oui ✓' : 'Non'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Prescription médicale :</span>
                  <span class="info-value">${body.prescription_medicale ? 'Oui ✓' : 'Non'}</span>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>Taxis Paris Conventionnés</p>
              <p>contact@taxisparis-conventionnes.fr</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .section h2 { color: #059669; margin-top: 0; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .info-label { font-weight: bold; color: #6b7280; }
            .info-value { color: #111827; }
            .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✈️ Transfert Gare/Aéroport</h1>
              <p>Nouvelle Réservation</p>
            </div>
            <div class="content">
              <div class="section">
                <h2>👤 Informations Client</h2>
                <div class="info-row">
                  <span class="info-label">Nom :</span>
                  <span class="info-value">${body.nom || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Prénom :</span>
                  <span class="info-value">${body.prenom || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Téléphone :</span>
                  <span class="info-value">${body.telephone || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email :</span>
                  <span class="info-value">${body.email || 'N/A'}</span>
                </div>
              </div>
              <div class="section">
                <h2>🚗 Détails du Trajet</h2>
                <div class="info-row">
                  <span class="info-label">Départ :</span>
                  <span class="info-value">${body.adresse_depart || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Arrivée :</span>
                  <span class="info-value">${body.adresse_arrivee || 'N/A'}</span>
                </div>
                ${body.distance_km ? `
                <div class="info-row">
                  <span class="info-label">Distance :</span>
                  <span class="info-value">${body.distance_km} km</span>
                </div>
                ` : ''}
                ${body.duree_minutes ? `
                <div class="info-row">
                  <span class="info-label">Durée estimée :</span>
                  <span class="info-value">${body.duree_minutes} minutes</span>
                </div>
                ` : ''}
              </div>
              <div class="section">
                <h2>📅 Date et Heure</h2>
                <div class="info-row">
                  <span class="info-label">Date :</span>
                  <span class="info-value">${body.date_trajet || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Heure de prise en charge :</span>
                  <span class="info-value">${body.heure_trajet || 'N/A'}</span>
                </div>
              </div>
              <div class="section">
                <h2>✈️ Détails Transport</h2>
                ${body.numero_train ? `
                <div class="info-row">
                  <span class="info-label">Numéro de train :</span>
                  <span class="info-value">${body.numero_train}</span>
                </div>
                ` : ''}
                ${body.numero_vol ? `
                <div class="info-row">
                  <span class="info-label">Numéro de vol :</span>
                  <span class="info-value">${body.numero_vol}</span>
                </div>
                ` : ''}
                <div class="info-row">
                  <span class="info-label">Nombre de passagers :</span>
                  <span class="info-value">${body.nombre_passagers || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Nombre de bagages :</span>
                  <span class="info-value">${body.nombre_bagages || 'N/A'}</span>
                </div>
                ${body.informations_supplementaires ? `
                <div class="info-row">
                  <span class="info-label">Informations supplémentaires :</span>
                  <span class="info-value">${body.informations_supplementaires}</span>
                </div>
                ` : ''}
              </div>
            </div>
            <div class="footer">
              <p>Taxis Paris Conventionnés</p>
              <p>contact@taxisparis-conventionnes.fr</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "contact@taxisparis-conventionnes.fr",
        to: "kertous.r@gmail.com",
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Erreur lors de l'envoi de l'email: ${resendResponse.status}`);
    }

    const resendData = await resendResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Votre réservation a bien été envoyée. Nous vous contacterons rapidement.",
        emailId: resendData.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Une erreur est survenue",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});