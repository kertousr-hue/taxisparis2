import { Shield, Users, Award, Heart, CheckCircle, Phone, MapPin, Clock, Star, ChevronDown, ChevronUp, CalendarCheck, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { generateJsonLD, generateBreadcrumbList } from '../utils/seoData';

const FAQ_ITEMS = [
  {
    question: 'Qui peut bénéficier d\'un taxi conventionné VSL ?',
    answer: 'Tout patient dont l\'état de santé nécessite un transport individuel peut bénéficier d\'un taxi conventionné. C\'est notamment le cas des patients atteints d\'une Affection de Longue Durée (ALD), des personnes hospitalisées, de celles qui suivent des traitements réguliers (dialyse, chimiothérapie, radiothérapie) ou qui présentent une incapacité temporaire rendant impossible l\'utilisation des transports en commun.',
  },
  {
    question: 'Le transport en taxi conventionné est-il remboursé par la Sécurité sociale ?',
    answer: 'Oui. Avec une prescription médicale de transport (formulaire Cerfa S3138) établie par votre médecin, l\'Assurance Maladie prend en charge une partie ou la totalité du coût du trajet. Pour les patients en ALD ou bénéficiaires de la Complémentaire Santé Solidaire, le remboursement peut atteindre 100 % grâce au tiers-payant, sans avance de frais.',
  },
  {
    question: 'Comment réserver un VSL ou un taxi conventionné ?',
    answer: 'Vous pouvez réserver directement en ligne via notre formulaire de réservation sur ce site, ou par téléphone au 06 50 36 64 91. Nous vous recommandons de réserver au moins 24 heures à l\'avance pour garantir la disponibilité. Pour les transports urgents, appelez-nous directement.',
  },
  {
    question: 'Quels départements d\'Île-de-France êtes-vous couverts ?',
    answer: 'Nous intervenons dans les cinq départements de l\'Île-de-France : Paris (75), l\'Essonne (91), les Hauts-de-Seine (92), la Seine-Saint-Denis (93) et le Val-de-Marne (94). Nous desservons l\'ensemble des grands hôpitaux et cliniques de la région parisienne.',
  },
];

const TRUST_ITEMS = [
  { icon: <Shield size={18} className="text-blue-600" />, label: 'Chauffeurs agréés CPAM et conventionnés' },
  { icon: <CheckCircle size={18} className="text-blue-600" />, label: 'Transport sécurisé, confortable et ponctuel' },
  { icon: <Clock size={18} className="text-blue-600" />, label: 'Disponible 24h/24 – 7j/7, urgences incluses' },
  { icon: <Star size={18} className="text-blue-600" />, label: 'Service fiable utilisé par des patients en Île-de-France' },
  { icon: <Award size={18} className="text-blue-600" />, label: 'Véhicules conformes aux normes sanitaires en vigueur' },
  { icon: <Users size={18} className="text-blue-600" />, label: 'Tiers-payant accepté – sans avance de frais' },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <SEOHead
        title="Taxi Conventionné VSL Île-de-France | À propos de notre service"
        description="Découvrez notre service de taxi conventionné VSL en Île-de-France (75, 91, 92, 93, 94). Agréés CPAM, disponibles 24h/24, tiers-payant accepté. Réservation rapide au 06 50 36 64 91."
        keywords={[
          'taxi conventionné Paris',
          'VSL conventionné Île-de-France',
          'transport médical Paris',
          'transport sanitaire Île-de-France',
          'taxi CPAM Paris',
          'qui sommes-nous taxi VSL',
          'transport médical 75 91 92 93 94',
          'taxi médical agréé',
          'tiers payant transport médical',
        ]}
        canonical="https://www.taxisparis-conventionnes.fr/qui-sommes-nous/"
        jsonLD={[
          generateJsonLD(),
          generateBreadcrumbList([
            { name: 'Accueil', url: '/' },
            { name: 'Qui sommes-nous', url: '/qui-sommes-nous/' },
          ]),
          faqLD,
        ]}
      />

      {/* Bandeau CTA haut */}
      <div className="bg-blue-700 text-white py-3">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm sm:text-base">
          <span className="font-medium">Service fiable utilisé par des patients en Île-de-France</span>
          <a
            href="tel:+33650366491"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Appeler maintenant le 06 50 36 64 91"
          >
            <Phone size={15} aria-hidden="true" />
            Appeler : 06 50 36 64 91
          </a>
        </div>
      </div>

      <div className="py-8 sm:py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">

            {/* ─── HERO ─────────────────────────────────────────────── */}
            <section className="text-center mb-10" aria-labelledby="about-h1">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
                <Shield size={14} aria-hidden="true" />
                Agréé CPAM – Tiers-payant accepté
              </div>
              <h1 id="about-h1" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                Taxi conventionné VSL en Île-de-France – Qui sommes-nous ?
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                Votre partenaire de confiance pour tous vos transports médicaux en Île-de-France, remboursés par la CPAM.
              </p>
              {/* Preuve sociale */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" aria-hidden="true" />
                  ))}
                  <span className="ml-1.5 font-medium text-gray-700">Service utilisé par des patients en Île-de-France</span>
                </div>
                <span className="hidden sm:block text-gray-300">|</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-500" aria-hidden="true" />
                  <span>Disponible 24h/24 – 7j/7</span>
                </div>
              </div>
            </section>

            {/* ─── INTRO ────────────────────────────────────────────── */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8" aria-labelledby="intro-title">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                Notre service de <strong className="text-blue-600">taxi conventionné VSL</strong> est spécialisé dans le transport médical assis en Île-de-France. Agréés par la Caisse Primaire d'Assurance Maladie (CPAM), nous assurons le transport de patients vers tous les établissements de santé de Paris et de la région parisienne, dans les départements 75, 91, 92, 93 et 94.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                Nos solutions de transport médical couvrent les consultations, hospitalisations programmées, séances de chimiothérapie, dialyse, radiothérapie, examens médicaux (IRM, scanner, radiologie) et la prise en charge des patients en Affection Longue Durée (ALD). Notre conventionnement CPAM permet à nos patients de bénéficier du tiers-payant sur prescription médicale de transport.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Disponibles 24h/24 et 7j/7, nos chauffeurs professionnels formés au transport sanitaire garantissent ponctualité, sécurité et accompagnement personnalisé pour chaque trajet médical.
              </p>
            </section>

            {/* ─── VALEURS ──────────────────────────────────────────── */}
            <section className="mb-10" aria-labelledby="values-title">
              <h2 id="values-title" className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
                Nos valeurs
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { Icon: Shield, color: 'blue', title: 'Sécurité', desc: 'Chauffeurs expérimentés et véhicules régulièrement contrôlés' },
                  { Icon: Users, color: 'blue', title: 'Service', desc: 'Écoute, courtoisie et assistance pour chaque patient' },
                  { Icon: Award, color: 'blue', title: 'Excellence', desc: 'Standards de qualité élevés pour votre satisfaction' },
                  { Icon: Heart, color: 'blue', title: 'Engagement', desc: 'Dévoués à votre confort et votre bien-être' },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="text-blue-600" size={26} aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base mb-1.5">{title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── CONTENU SEO ──────────────────────────────────────── */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8 space-y-8" aria-labelledby="seo-content-title">
              <h2 id="seo-content-title" className="text-2xl sm:text-3xl font-bold text-gray-800">
                Spécialiste du transport médical conventionné
              </h2>

              <div>
                <p className="text-gray-700 leading-relaxed">
                  Notre service de taxi conventionné VSL est dédié au transport médical assis en Île-de-France. Nous accompagnons quotidiennement des patients vers les hôpitaux, cliniques, centres médicaux et cabinets spécialisés, avec une prise en charge adaptée à chaque situation médicale. Qu'il s'agisse d'un rendez-vous de routine chez le médecin, d'une hospitalisation programmée ou d'une séance de traitement lourd, notre équipe s'engage à assurer votre trajet dans les meilleures conditions.
                </p>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  Nous desservons l'ensemble des établissements du réseau AP-HP ainsi que les cliniques privées et les centres de soins de la région parisienne : Pitié-Salpêtrière, Necker, Cochin, Lariboisière, Saint-Louis, Tenon, Georges Pompidou, Robert Debré, Institut Curie et bien d'autres.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Transport agréé CPAM – Remboursement Assurance Maladie</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous sommes conventionnés par la CPAM, ce qui permet une <strong>prise en charge partielle ou totale</strong> de vos trajets médicaux selon votre situation. Pour les patients en ALD (Affection de Longue Durée), hospitalisés ou suivant un traitement régulier, le remboursement peut atteindre 100 % grâce au tiers-payant – sans avance de frais de votre part. Il vous suffit de présenter une prescription médicale de transport établie par votre médecin.
                </p>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  Notre équipe administrative gère toutes les formalités avec la CPAM à votre place, ce qui vous évite toute démarche administrative complexe. Nous acceptons également les prises en charge des mutuelles complémentaires pour couvrir le ticket modérateur restant à votre charge.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Une équipe professionnelle à votre service</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nos chauffeurs sont rigoureusement sélectionnés, formés au transport sanitaire et à l'accompagnement de personnes vulnérables. Titulaires de l'agrément CPAM et de la carte professionnelle de chauffeur de taxi, ils connaissent parfaitement le réseau hospitalier et routier de l'Île-de-France.
                </p>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  Nous mettons un point d'honneur à assurer un transport <strong>sécurisé, ponctuel et confortable</strong>. Nos véhicules sont régulièrement entretenus, conformes aux normes sanitaires en vigueur, et équipés pour accueillir des personnes à mobilité réduite selon les besoins. Chaque chauffeur veille à accompagner le patient depuis son domicile jusqu'à la salle d'attente et à assurer le retour en toute sérénité.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Disponibilité 24h/24 et 7j/7</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous assurons vos déplacements médicaux à toute heure, y compris les urgences et les rendez-vous programmés très tôt le matin ou tard le soir. Notre centrale de réservation est joignable en permanence pour prendre en charge votre demande et affecter le chauffeur disponible le plus proche.
                </p>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  Pour réserver votre transport, utilisez notre <Link to="/reservation-taxi-vsl/" className="text-blue-600 hover:underline font-medium">formulaire de réservation en ligne</Link> ou appelez directement le <a href="tel:+33650366491" className="text-blue-600 hover:underline font-medium">06 50 36 64 91</a>. Nous intervenons dans les 5 départements de notre <Link to="/zones-desservies/" className="text-blue-600 hover:underline font-medium">zone d'intervention</Link> en Île-de-France.
                </p>
              </div>
            </section>

            {/* ─── POURQUOI NOUS FAIRE CONFIANCE ───────────────────── */}
            <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 mb-8" aria-labelledby="trust-title">
              <h2 id="trust-title" className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                Pourquoi nous faire confiance ?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TRUST_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                    <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                    <span className="text-gray-700 text-sm sm:text-base font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── CERTIFICATIONS ───────────────────────────────────── */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8" aria-labelledby="certif-title">
              <h2 id="certif-title" className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
                Nos certifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { title: 'Licence de taxi', desc: 'Agréé Préfecture de Police de Paris' },
                  { title: 'Conventionnement CPAM', desc: 'Transport médical assis professionnalisé' },
                  { title: 'Assurance professionnelle', desc: 'Couverture complète passagers et bagages' },
                  { title: 'Carte professionnelle', desc: 'Chauffeurs diplômés et certifiés' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-0.5">{title}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── MAILLAGE INTERNE ─────────────────────────────────── */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8" aria-labelledby="zones-title">
              <h2 id="zones-title" className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <MapPin size={22} className="text-blue-600" aria-hidden="true" />
                Nos zones d'intervention
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Paris (75)', href: '/taxi-conventionne-paris-75/' },
                  { label: 'Essonne (91)', href: '/taxi-conventionne-essonne-91/' },
                  { label: 'Hauts-de-Seine (92)', href: '/taxi-conventionne-hauts-de-seine-92/' },
                  { label: 'Seine-Saint-Denis (93)', href: '/taxi-conventionne-seine-saint-denis-93/' },
                  { label: 'Val-de-Marne (94)', href: '/taxi-conventionne-val-de-marne-94/' },
                  { label: 'Toutes les zones desservies', href: '/zones-desservies/' },
                ].map(dep => (
                  <Link
                    key={dep.href}
                    to={dep.href}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg px-4 py-3 text-blue-700 font-semibold text-sm transition-colors"
                  >
                    <MapPin size={13} aria-hidden="true" />
                    Taxi conventionné – {dep.label}
                  </Link>
                ))}
              </div>
            </section>

            {/* ─── FAQ ──────────────────────────────────────────────── */}
            <section className="mb-10" aria-labelledby="faq-title">
              <div className="text-center mb-6">
                <h2 id="faq-title" className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Questions fréquentes sur notre service
                </h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">Tout ce qu'il faut savoir sur le taxi conventionné VSL en Île-de-France.</p>
              </div>
              <div className="space-y-3">
                {FAQ_ITEMS.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                      aria-expanded={openFaq === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">{item.question}</span>
                      {openFaq === index
                        ? <ChevronUp size={18} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
                        : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
                      }
                    </button>
                    {openFaq === index && (
                      <div
                        id={`faq-answer-${index}`}
                        className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100"
                      >
                        <p className="mt-3">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ─── CTA FINAL ────────────────────────────────────────── */}
            <div className="bg-blue-700 text-white rounded-2xl p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Besoin d'un transport médical en Île-de-France ?</h2>
              <p className="text-blue-100 text-sm sm:text-base mb-6">Réservez en ligne ou appelez-nous directement. Disponible 24h/24 – 7j/7.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/reservation-taxi-vsl/"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <CalendarCheck size={18} aria-hidden="true" />
                  Réserver maintenant
                </Link>
                <a
                  href="tel:+33650366491"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Phone size={18} aria-hidden="true" />
                  Appeler : 06 50 36 64 91
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
