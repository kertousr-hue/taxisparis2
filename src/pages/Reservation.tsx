import { useState, useEffect } from 'react';
import {
  Calendar, Clock, Phone, Mail, User, CheckCircle, Car,
  Gauge, Timer, MessageSquare, MapPin, Shield, Star,
  ChevronDown, ChevronUp, AlertCircle, Armchair, RefreshCw,
  ClipboardList, FileText, ArrowRight,
} from 'lucide-react';
import { type Reservation } from '../lib/supabase';
import AutocompleteInput from '../components/AutocompleteInput';
import { calculateRoute } from '../utils/here';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

const DEPARTMENTS = [
  { label: 'Paris (75)', href: '/taxi-conventionne-paris-75/' },
  { label: 'Essonne (91)', href: '/taxi-conventionne-essonne-91/' },
  { label: 'Hauts-de-Seine (92)', href: '/taxi-conventionne-hauts-de-seine-92/' },
  { label: 'Seine-Saint-Denis (93)', href: '/taxi-conventionne-seine-saint-denis-93/' },
  { label: 'Val-de-Marne (94)', href: '/taxi-conventionne-val-de-marne-94/' },
];

const FAQ_ITEMS = [
  {
    question: 'Comment réserver un taxi conventionné VSL ?',
    answer: "Remplissez le formulaire ci-dessus avec vos coordonnées, vos adresses de départ et d'arrivée, la date et l'heure souhaitées. Vous recevrez une confirmation par téléphone dans les plus brefs délais.",
  },
  {
    question: 'Le transport est-il remboursé par la CPAM ?',
    answer: "Oui, sous certaines conditions : vous devez disposer d'une prescription médicale de transport et votre état de santé doit justifier l'utilisation d'un taxi. La prise en charge peut atteindre 100 % pour les patients en ALD ou en CMU.",
  },
  {
    question: 'Faut-il une prescription médicale ?',
    answer: "Oui, une prescription médicale (formulaire Cerfa S3138) est obligatoire pour un remboursement CPAM. Sans prescription, le transport reste possible mais non remboursé.",
  },
  {
    question: 'Quels départements sont couverts ?',
    answer: "Paris (75), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93) et Val-de-Marne (94). Nous assurons tous types de transports médicaux : consultations, dialyse, chimio, radio, hospitalisations.",
  },
  {
    question: 'Quel est le délai de confirmation ?',
    answer: "Nous vous contactons par téléphone dans les plus brefs délais. Réservez au minimum 24h à l'avance. Pour les urgences : 06 50 36 64 91.",
  },
];

type SituationALD = 'ald_exonerante' | 'ald_non_exonerante' | 'cmu' | 'pas_ald';
type BonTransport = 'deja_etabli' | 'a_etablir' | 'sans_bon';

type FieldErrors = {
  adresse_depart?: string;
  adresse_arrivee?: string;
  fauteuil_roulant?: string;
  type_trajet?: string;

  type_prise_en_charge?: string;
  situation_ald?: string;
  bon_transport?: string;
};

/* ─── Sub-components ─── */

function StepBadge({ n, color }: { n: number; color: string }) {
  return (
    <span className={`flex-shrink-0 w-6 h-6 rounded-full ${color} text-white text-xs font-bold flex items-center justify-center`}>
      {n}
    </span>
  );
}

function SectionCard({ step, stepColor, icon, iconBg, title, children }: {
  step: number; stepColor: string; icon: React.ReactNode; iconBg: string;
  title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className={`flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-gray-100 rounded-t-2xl ${iconBg}`}>
        <StepBadge n={step} color={stepColor} />
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-bold text-gray-800 text-sm sm:text-base">{title}</h2>
        </div>
      </div>
      <div className="px-4 sm:px-5 py-4 sm:py-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{children}</p>
  );
}

function TextInput({ id, name, type = 'text', value, onChange, required, placeholder, hasError }: {
  id: string; name: string; type?: string; value: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>; required?: boolean;
  placeholder?: string; hasError?: boolean;
}) {
  return (
    <input
      type={type} id={id} name={name} value={value ?? ''} onChange={onChange}
      required={required} placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
    />
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1"><AlertCircle size={11} />{msg}</p>;
}

function RadioPill({ name, value, checked, onChange, label, sublabel, required }: {
  name: string; value: string; checked: boolean; onChange: () => void;
  label: string; sublabel?: string; required?: boolean;
}) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl border-2 transition-all duration-150 select-none active:scale-[0.98]
      ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30'}`}>
      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
        ${checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}>
        {checked && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} required={required} className="sr-only" />
      <div className="flex-1 min-w-0">
        <span className={`block text-sm font-semibold leading-tight ${checked ? 'text-blue-800' : 'text-gray-700'}`}>{label}</span>
        {sublabel && <span className="block text-xs text-gray-400 mt-0.5 leading-tight">{sublabel}</span>}
      </div>
      {checked && <CheckCircle size={15} className="text-blue-500 flex-shrink-0" />}
    </label>
  );
}

/* ─── Page ─── */

export default function ReservationPage() {
  const [formData, setFormData] = useState<Partial<Reservation>>({
    nom: '', prenom: '', telephone: '', email: '',
    adresse_depart: '', adresse_arrivee: '',
    date_rdv: '', heure_rdv: '', informations_supplementaires: '',
  });

  const [fauteuilRoulant, setFauteuilRoulant] = useState<boolean | null>(null);
  const [typeTrajet, setTypeTrajet] = useState<'aller_simple' | 'aller_retour' | null>(null);

  const [typePriseEnCharge, setTypePriseEnCharge] = useState<string | null>(null);
  const [situationALD, setSituationALD] = useState<SituationALD | null>(null);
  const [bonTransport, setBonTransport] = useState<BonTransport | null>(null);

  const [distance, setDistance] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [coordsDepart, setCoordsDepart] = useState<{ lat: number; lng: number } | null>(null);
  const [coordsArrivee, setCoordsArrivee] = useState<{ lat: number; lng: number } | null>(null);

  const apiKey = import.meta.env.VITE_HERE_API_KEY;

  useEffect(() => {
    if (!coordsDepart || !coordsArrivee) return;
    const id = setTimeout(async () => {
      setIsCalculating(true);
      try {
        const result = await calculateRoute(
          coordsDepart.lat, coordsDepart.lng,
          coordsArrivee.lat, coordsArrivee.lng,
          apiKey, formData.date_rdv, formData.heure_rdv,
        );
        if (result) { setDistance(result.distance_km); setDurationMinutes(result.duree_minutes); }
      } catch { /* silent */ } finally { setIsCalculating(false); }
    }, 500);
    return () => clearTimeout(id);
  }, [coordsDepart, coordsArrivee, apiKey, formData.date_rdv, formData.heure_rdv]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearErr = (k: keyof FieldErrors) => setFieldErrors(prev => ({ ...prev, [k]: undefined }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const errs: FieldErrors = {};
    if (!formData.adresse_depart || formData.adresse_depart.trim().length < 5)
      errs.adresse_depart = 'Veuillez renseigner l\'adresse de départ';
    else if (!coordsDepart)
      errs.adresse_depart = 'Sélectionnez une adresse dans les suggestions';
    if (!formData.adresse_arrivee || formData.adresse_arrivee.trim().length < 5)
      errs.adresse_arrivee = 'Veuillez renseigner l\'adresse d\'arrivée';
    else if (!coordsArrivee)
      errs.adresse_arrivee = 'Sélectionnez une adresse dans les suggestions';
    if (fauteuilRoulant === null) errs.fauteuil_roulant = 'Veuillez indiquer si le patient est en fauteuil roulant';
    if (!typeTrajet) errs.type_trajet = 'Veuillez choisir le type de trajet (aller simple ou aller-retour)';

    if (!typePriseEnCharge) errs.type_prise_en_charge = 'Veuillez sélectionner le type de prise en charge';
    if (!situationALD) errs.situation_ald = 'Veuillez indiquer votre situation ALD / CMU';
    if (!bonTransport) errs.bon_transport = 'Veuillez indiquer l\'état de votre bon de transport';

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setIsSubmitting(false);
      const firstErrorKey = Object.keys(errs)[0];
      const fieldIdMap: Record<string, string> = {
        adresse_depart: 'field-adresse_depart',
        adresse_arrivee: 'field-adresse_arrivee',
        fauteuil_roulant: 'field-fauteuil_roulant',
        type_trajet: 'field-type_trajet',
        type_prise_en_charge: 'field-type_prise_en_charge',
        situation_ald: 'field-situation_ald',
        bon_transport: 'field-bon_transport',
      };
      const targetId = fieldIdMap[firstErrorKey] || 'form-error-summary';
      setTimeout(() => {
        const el = document.getElementById(targetId) || document.getElementById('form-error-summary');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    setFieldErrors({});

    try {
      const emailData = {
        nom: formData.nom, prenom: formData.prenom,
        telephone: formData.telephone, email: formData.email,
        adresse_depart: formData.adresse_depart, adresse_arrivee: formData.adresse_arrivee,
        date_rdv: formData.date_rdv, heure_rdv: formData.heure_rdv,
        ald_cmu: situationALD !== 'pas_ald',
        prescription_medicale: bonTransport === 'deja_etabli',
        numero_vol: '', numero_train: '', nombre_passagers: 1, nombre_bagages: 0,
        distance_km: distance || 0, duree_min: durationMinutes || 0,
        message: [
          `Fauteuil roulant: ${fauteuilRoulant ? 'Oui' : 'Non'}`,
          `Type trajet: ${typeTrajet}`,
          `Prise en charge: ${typePriseEnCharge}`,
          `ALD: ${situationALD}`, `Bon transport: ${bonTransport}`,
          formData.informations_supplementaires ? `Note: ${formData.informations_supplementaires}` : '',
        ].filter(Boolean).join(' | '),
        type_trajet: 'vsl',
      };

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-reservation-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify(emailData),
      });
      if (!resp.ok) throw new Error("Erreur lors de l'envoi");

      setSubmitSuccess(true);
      setFormData({ nom: '', prenom: '', telephone: '', email: '', adresse_depart: '', adresse_arrivee: '', date_rdv: '', heure_rdv: '', informations_supplementaires: '' });
      setDistance(null); setDurationMinutes(null); setCoordsDepart(null); setCoordsArrivee(null);
      setFauteuilRoulant(null); setTypeTrajet(null);
      setTypePriseEnCharge(null); setSituationALD(null); setBonTransport(null);
      setTimeout(() => setSubmitSuccess(false), 7000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const webPageLD = { "@context": "https://schema.org", "@type": "WebPage", "name": "Réservation Taxi Conventionné VSL CPAM | Île-de-France 24/7", "url": "https://www.taxisparis-conventionnes.fr/reservation-taxi-vsl/" };
  const faqLD = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": FAQ_ITEMS.map(i => ({ "@type": "Question", "name": i.question, "acceptedAnswer": { "@type": "Answer", "text": i.answer } })) };
  const serviceLD = { "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "Taxis Paris Conventionnés – Réservation VSL", "url": "https://www.taxisparis-conventionnes.fr/reservation-taxi-vsl/", "telephone": "+33650366491" };

  const hasErrors = Object.keys(fieldErrors).length > 0 || !!error;

  return (
    <>
      <SEOHead
        title="Réservation Taxi Conventionné VSL CPAM | Île-de-France 24/7"
        description="Réservez votre taxi conventionné ou VSL en ligne. Transport médical remboursé CPAM. Service 24/7 en Île-de-France (75, 91, 92, 93, 94)."
        keywords={["réservation taxi conventionné", "réserver VSL", "transport médical réservation", "taxi CPAM en ligne"]}
        canonical="https://www.taxisparis-conventionnes.fr/reservation-taxi-vsl/"
        jsonLD={[webPageLD, faqLD, serviceLD]}
      />

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-40 bg-blue-700 text-white py-2.5 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between gap-3 text-sm">
          <span className="font-medium hidden sm:block">Confirmation rapide par téléphone</span>
          <a href="tel:+33650366491"
            className="flex items-center gap-2 bg-white text-blue-700 font-bold px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors text-xs sm:text-sm mx-auto sm:mx-0">
            <Phone size={14} /> 06 50 36 64 91
          </a>
        </div>
      </div>

      <div className="bg-gradient-to-b from-blue-50 via-white to-gray-50 min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
          <div className="max-w-2xl mx-auto">

            {/* ── Hero ── */}
            <div className="text-center mb-6 sm:mb-8 px-1">
              <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wide">
                <Shield size={12} /> Transport remboursé CPAM
              </div>
              <h1 id="page-title" className="text-xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                Réservation taxi conventionné VSL
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                Service 24h/24 – 7j/7 en Île-de-France (75, 91, 92, 93, 94)
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-yellow-400" />)}
                  <span className="text-gray-500 ml-1">Patients Île-de-France</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={11} /><span className="text-gray-500">Chauffeurs agréés CPAM</span>
                </div>
              </div>
            </div>

            {/* ── Success ── */}
            {submitSuccess && (
              <div role="alert" className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-bold text-green-800 text-sm">Réservation envoyée !</p>
                  <p className="text-green-700 text-xs mt-0.5">Nous vous contacterons rapidement pour confirmer votre transport.</p>
                </div>
              </div>
            )}

            {/* ── Error summary ── */}
            {hasErrors && (
              <div id="form-error-summary" role="alert" className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-red-500 flex-shrink-0" size={16} />
                  <p className="font-bold text-red-800 text-sm">Veuillez corriger les erreurs</p>
                </div>
                <ul className="space-y-1 ml-5">
                  {Object.values(fieldErrors).filter(Boolean).map((msg, i) => (
                    <li key={i} className="text-xs text-red-700 list-disc">{msg}</li>
                  ))}
                  {error && !Object.keys(fieldErrors).length && (
                    <li className="text-xs text-red-700 list-disc">{error}</li>
                  )}
                </ul>
              </div>
            )}

            {/* ══════════ FORM ══════════ */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" aria-labelledby="page-title">

              {/* 1 – Coordonnées */}
              <SectionCard step={1} stepColor="bg-blue-600" icon={<User size={16} className="text-blue-600" />} iconBg="bg-blue-50" title="Vos coordonnées">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Nom *</FieldLabel>
                    <TextInput id="nom" name="nom" value={formData.nom} onChange={handleChange} required placeholder="Nom" />
                  </div>
                  <div>
                    <FieldLabel>Prénom *</FieldLabel>
                    <TextInput id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} required placeholder="Prénom" />
                  </div>
                  <div>
                    <FieldLabel>Téléphone *</FieldLabel>
                    <TextInput id="telephone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} required placeholder="06 12 34 56 78" />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <TextInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email (facultatif)" />
                  </div>
                </div>
              </SectionCard>

              {/* 2 – Trajet */}
              <SectionCard step={2} stepColor="bg-green-600" icon={<MapPin size={16} className="text-green-600" />} iconBg="bg-green-50" title="Trajet">
                <div className="space-y-3">
                  <div id="field-adresse_depart">
                    <AutocompleteInput
                      label="Adresse de départ" value={formData.adresse_depart || ''}
                      placeholder="Ex : Hôpital Cochin, Paris" required apiKey={apiKey}
                      onAddressSelect={(addr, lat, lng) => { setFormData(p => ({ ...p, adresse_depart: addr })); setCoordsDepart({ lat, lng }); clearErr('adresse_depart'); }}
                      onInputChange={v => { setFormData(p => ({ ...p, adresse_depart: v })); setCoordsDepart(null); clearErr('adresse_depart'); }}
                      isValidated={!!coordsDepart} hasError={!!fieldErrors.adresse_depart}
                    />
                    <ErrorMsg msg={fieldErrors.adresse_depart} />
                  </div>
                  <div id="field-adresse_arrivee">
                    <AutocompleteInput
                      label="Adresse d'arrivée" value={formData.adresse_arrivee || ''}
                      placeholder="Ex : Hôpital Necker, Paris" required apiKey={apiKey}
                      onAddressSelect={(addr, lat, lng) => { setFormData(p => ({ ...p, adresse_arrivee: addr })); setCoordsArrivee({ lat, lng }); clearErr('adresse_arrivee'); }}
                      onInputChange={v => { setFormData(p => ({ ...p, adresse_arrivee: v })); setCoordsArrivee(null); clearErr('adresse_arrivee'); }}
                      isValidated={!!coordsArrivee} hasError={!!fieldErrors.adresse_arrivee}
                    />
                    <ErrorMsg msg={fieldErrors.adresse_arrivee} />
                  </div>

                  {isCalculating && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Calcul en cours…
                    </div>
                  )}
                  {distance !== null && durationMinutes !== null && !isCalculating && (
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                        <div className="bg-blue-100 p-1.5 rounded-lg"><Gauge size={14} className="text-blue-600" /></div>
                        <div><p className="text-xs text-gray-400">Distance</p><p className="font-bold text-gray-800 text-sm">{distance} km</p></div>
                      </div>
                      <div className="flex items-center gap-2.5 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2.5">
                        <div className="bg-orange-100 p-1.5 rounded-lg"><Timer size={14} className="text-orange-600" /></div>
                        <div><p className="text-xs text-gray-400">Durée</p><p className="font-bold text-gray-800 text-sm">{durationMinutes} min</p></div>
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* 3 – Date & Heure */}
              <SectionCard step={3} stepColor="bg-blue-600" icon={<Calendar size={16} className="text-blue-600" />} iconBg="bg-blue-50" title="Date & Heure">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Date *</FieldLabel>
                    <TextInput id="date_rdv" name="date_rdv" type="date" value={formData.date_rdv} onChange={handleChange} required />
                  </div>
                  <div>
                    <FieldLabel>Heure de prise en charge *</FieldLabel>
                    <TextInput id="heure_rdv" name="heure_rdv" type="time" value={formData.heure_rdv} onChange={handleChange} required />
                  </div>
                </div>
              </SectionCard>

              {/* 4 – Véhicule & PMR */}
              <SectionCard step={4} stepColor="bg-blue-600" icon={<Car size={16} className="text-blue-600" />} iconBg="bg-blue-50" title="Véhicule & Mobilité">
                {/* Type véhicule – fixed Taxi/VSL */}
                <div className="mb-4">
                  <FieldLabel>Type de véhicule</FieldLabel>
                  <div className="flex items-center gap-3 px-4 py-3 border-2 border-blue-400 bg-blue-50 rounded-xl">
                    <div className="bg-blue-100 p-1.5 rounded-lg"><Car size={15} className="text-blue-600" /></div>
                    <div className="flex-1">
                      <p className="font-bold text-blue-800 text-sm">Taxi / VSL</p>
                      <p className="text-xs text-blue-500 flex items-center gap-1 mt-0.5"><Armchair size={11} /> Position assise</p>
                    </div>
                    <CheckCircle size={16} className="text-blue-500" />
                  </div>
                </div>

                {/* PMR */}
                <div id="field-fauteuil_roulant">
                  <FieldLabel>Fauteuil roulant (PMR) *</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <RadioPill name="fauteuil_roulant" value="non" checked={fauteuilRoulant === false}
                      onChange={() => { setFauteuilRoulant(false); clearErr('fauteuil_roulant'); }}
                      label="Non" required />
                    <RadioPill name="fauteuil_roulant" value="oui" checked={fauteuilRoulant === true}
                      onChange={() => { setFauteuilRoulant(true); clearErr('fauteuil_roulant'); }}
                      label="Oui" sublabel="Patient en fauteuil" required />
                  </div>
                  <ErrorMsg msg={fieldErrors.fauteuil_roulant} />
                </div>
              </SectionCard>

              {/* 5 – Type de trajet */}
              <SectionCard step={5} stepColor="bg-teal-600" icon={<RefreshCw size={16} className="text-teal-600" />} iconBg="bg-teal-50" title="Type de trajet">
                <div id="field-type_trajet">
                  <FieldLabel>Type de trajet *</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <RadioPill name="type_trajet" value="aller_simple" checked={typeTrajet === 'aller_simple'}
                      onChange={() => { setTypeTrajet('aller_simple'); clearErr('type_trajet'); }}
                      label="Aller simple" required />
                    <RadioPill name="type_trajet" value="aller_retour" checked={typeTrajet === 'aller_retour'}
                      onChange={() => { setTypeTrajet('aller_retour'); clearErr('type_trajet'); }}
                      label="Aller-retour" required />
                  </div>
                  <ErrorMsg msg={fieldErrors.type_trajet} />
                </div>
              </SectionCard>

              {/* 6 – Prise en charge */}
              <SectionCard step={7} stepColor="bg-red-500" icon={<ClipboardList size={16} className="text-red-500" />} iconBg="bg-red-50" title="Type de prise en charge">
                <div id="field-type_prise_en_charge" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { value: 'consultation', label: 'Consultation médicale' },
                    { value: 'hospitalisation_complete', label: 'Hospitalisation complète' },
                    { value: 'hospitalisation_partielle', label: 'Hospitalisation partielle' },
                    { value: 'hospitalisation_ambulatoire', label: 'Hospitalisation ambulatoire' },
                    { value: 'chimiotherapie', label: 'Chimiothérapie' },
                    { value: 'radiotherapie', label: 'Radiothérapie' },
                    { value: 'hemodialyse', label: 'Hémodialyse' },
                    { value: 'autre', label: 'Autre motif' },
                  ].map(opt => (
                    <RadioPill key={opt.value} name="type_prise_en_charge" value={opt.value}
                      checked={typePriseEnCharge === opt.value}
                      onChange={() => { setTypePriseEnCharge(opt.value); clearErr('type_prise_en_charge'); }}
                      label={opt.label} required />
                  ))}
                </div>
                <ErrorMsg msg={fieldErrors.type_prise_en_charge} />
              </SectionCard>

              {/* 8 – Situation ALD / CMU */}
              <SectionCard step={8} stepColor="bg-blue-600" icon={<Shield size={16} className="text-blue-600" />} iconBg="bg-blue-50" title="Situation ALD / CMU">
                <div id="field-situation_ald" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <RadioPill name="situation_ald" value="ald_exonerante" checked={situationALD === 'ald_exonerante'}
                    onChange={() => { setSituationALD('ald_exonerante'); clearErr('situation_ald'); }}
                    label="ALD exonérante" sublabel="Prise en charge à 100 %" required />
                  <RadioPill name="situation_ald" value="ald_non_exonerante" checked={situationALD === 'ald_non_exonerante'}
                    onChange={() => { setSituationALD('ald_non_exonerante'); clearErr('situation_ald'); }}
                    label="ALD non exonérante" sublabel="Prise en charge partielle" required />
                  <RadioPill name="situation_ald" value="cmu" checked={situationALD === 'cmu'}
                    onChange={() => { setSituationALD('cmu'); clearErr('situation_ald'); }}
                    label="CMU / CSS" sublabel="Complémentaire santé solidaire" required />
                  <RadioPill name="situation_ald" value="pas_ald" checked={situationALD === 'pas_ald'}
                    onChange={() => { setSituationALD('pas_ald'); clearErr('situation_ald'); }}
                    label="Pas d'ALD / CMU" sublabel="Sans dispositif particulier" required />
                </div>
                <ErrorMsg msg={fieldErrors.situation_ald} />
                <p className="mt-3 text-xs text-gray-400 flex items-start gap-1.5">
                  <AlertCircle size={11} className="mt-0.5 flex-shrink-0" />
                  En cas de doute, consultez votre médecin traitant.
                </p>
              </SectionCard>

              {/* 9 – Bon de transport */}
              <SectionCard step={9} stepColor="bg-gray-600" icon={<FileText size={16} className="text-gray-600" />} iconBg="bg-gray-50" title="Bon de transport médical">
                <div id="field-bon_transport" className="space-y-2">
                  <RadioPill name="bon_transport" value="deja_etabli" checked={bonTransport === 'deja_etabli'}
                    onChange={() => { setBonTransport('deja_etabli'); clearErr('bon_transport'); }}
                    label="Déjà établi" sublabel="Votre bon est prêt" required />
                  <RadioPill name="bon_transport" value="a_etablir" checked={bonTransport === 'a_etablir'}
                    onChange={() => { setBonTransport('a_etablir'); clearErr('bon_transport'); }}
                    label="À établir" sublabel="À demander à votre médecin" required />
                  <RadioPill name="bon_transport" value="sans_bon" checked={bonTransport === 'sans_bon'}
                    onChange={() => { setBonTransport('sans_bon'); clearErr('bon_transport'); }}
                    label="Sans bon de transport" sublabel="Transport non remboursé" required />
                </div>
                <ErrorMsg msg={fieldErrors.bon_transport} />
              </SectionCard>

              {/* 10 – Infos sup */}
              <SectionCard step={10} stepColor="bg-gray-500" icon={<MessageSquare size={16} className="text-gray-500" />} iconBg="bg-gray-50" title="Informations complémentaires">
                <textarea
                  name="informations_supplementaires" value={formData.informations_supplementaires}
                  onChange={handleChange} rows={3}
                  placeholder="Accompagnant, accès difficile, besoins spécifiques…"
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 focus:bg-white rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </SectionCard>

              {/* ── Submit ── */}
              <div className="pt-1 pb-4">
                <p className="text-center text-xs text-gray-400 mb-3 flex items-center justify-center gap-1">
                  <CheckCircle size={11} className="text-green-500" />
                  Tous les champs sont obligatoires
                </p>
                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-4 rounded-2xl font-bold text-base transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Envoi en cours…</>
                  ) : (
                    <>Confirmer ma réservation <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            </form>

            {/* ── Contact ── */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-bold text-blue-900 text-sm">Besoin d'une réponse immédiate ?</p>
                  <p className="text-blue-600 text-xs mt-0.5">Disponible 24h/24 – 7j/7</p>
                </div>
                <div className="flex gap-2">
                  <a href="tel:+33650366491" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-xs sm:text-sm">
                    <Phone size={13} /> Appeler
                  </a>
                  <a href="mailto:contact@taxisparis-conventionnes.fr" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-blue-700 border border-blue-300 font-medium px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors text-xs sm:text-sm">
                    <Mail size={13} /> Email
                  </a>
                </div>
              </div>
            </div>

            {/* ── SEO content ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5">
                Taxi conventionné VSL en Île-de-France
              </h2>
              <div className="space-y-5 text-gray-600 text-sm leading-relaxed">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Qu'est-ce qu'un taxi conventionné VSL ?</h3>
                  <p>Un <strong>taxi conventionné</strong> est agréé par l'Assurance Maladie (CPAM) pour des transports médicaux remboursés. Il permet aux patients de se rendre à l'hôpital, en séance de dialyse, chimiothérapie ou radiothérapie, avec une prise en charge partielle ou totale.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Conditions de remboursement</h3>
                  <ul className="space-y-1.5">
                    {["Prescription médicale de transport (Cerfa S3138)", "ALD, CSS (ex-CMU-C) ou incapacité justifiée", "Trajet lié à des soins pris en charge par la Sécu"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <nav aria-label="Départements desservis" className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {DEPARTMENTS.map(dep => (
                    <Link key={dep.href} to={dep.href}
                      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-3 py-2.5 text-blue-700 font-semibold text-xs transition-colors">
                      <MapPin size={12} /> Taxi – {dep.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Questions fréquentes</h2>
              <div className="space-y-2">
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                      aria-expanded={openFaq === i}>
                      <span className="font-semibold text-gray-800 text-sm">{item.question}</span>
                      {openFaq === i
                        ? <ChevronUp size={15} className="text-blue-600 flex-shrink-0" />
                        : <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-gray-600 text-xs leading-relaxed border-t border-gray-100">
                        <p className="mt-3">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── CTA final ── */}
            <div className="bg-blue-700 text-white rounded-2xl p-5 sm:p-8 text-center">
              <h2 className="text-lg sm:text-xl font-bold mb-1.5">Prêt à réserver ?</h2>
              <p className="text-blue-100 mb-4 text-xs sm:text-sm">Service 24h/24 – 7j/7 en Île-de-France.</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a href="tel:+33650366491"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                  <Phone size={15} /> 06 50 36 64 91
                </a>
                <button type="button"
                  onClick={() => document.getElementById('page-title')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-5 py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm">
                  Remplir le formulaire
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
