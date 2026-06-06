import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen, ChevronDown, ChevronUp, CheckCircle, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  published_at: string;
  meta_description: string;
  meta_keywords: string;
}

const DEPARTMENTS = [
  { label: 'Paris (75)', href: '/taxi-conventionne-paris-75/' },
  { label: 'Essonne (91)', href: '/taxi-conventionne-essonne-91/' },
  { label: 'Hauts-de-Seine (92)', href: '/taxi-conventionne-hauts-de-seine-92/' },
  { label: 'Seine-Saint-Denis (93)', href: '/taxi-conventionne-seine-saint-denis-93/' },
  { label: 'Val-de-Marne (94)', href: '/taxi-conventionne-val-de-marne-94/' },
];

const FAQ_ITEMS = [
  {
    question: 'Quelle est la différence entre un taxi conventionné et une ambulance ?',
    answer:
      "L'ambulance est réservée aux patients nécessitant une surveillance médicale ou un transport allongé. Le taxi conventionné convient aux patients dits « assis », capables de se déplacer sans assistance médicale particulière. Sur prescription médicale, les deux sont pris en charge par la CPAM. Le taxi conventionné est souvent prescrit pour les consultations, dialyses ou séances de chimiothérapie des patients autonomes.",
  },
  {
    question: 'Comment fonctionne le remboursement CPAM pour un taxi conventionné ?',
    answer:
      "Avec une prescription médicale de transport (formulaire Cerfa S3138) signée par votre médecin, votre taxi conventionné est pris en charge par la CPAM à 65 % du tarif conventionné, et jusqu'à 100 % pour les patients en ALD, CMU-C ou maternité. Notre service pratique la tierce payante : vous n'avancez pas les frais, la CPAM nous règle directement.",
  },
  {
    question: 'Peut-on réserver un taxi conventionné pour un trajet régulier (dialyse, chimio) ?',
    answer:
      "Oui. Une ordonnance de série établie par votre médecin permet de couvrir plusieurs séances sans renouvellement à chaque trajet. Nous planifions vos trajets récurrents à l'avance, garantissant ponctualité et disponibilité pour vos séances de dialyse, chimiothérapie ou radiothérapie.",
  },
  {
    question: 'Le service de taxi VSL est-il disponible la nuit et les week-ends ?',
    answer:
      "Notre service est disponible 24h/24, 7j/7, y compris les jours fériés. Que ce soit pour une hospitalisation programmée tôt le matin, une sortie d'hôpital le week-end ou un rendez-vous médical en soirée, nos chauffeurs conventionnés sont joignables au 06 50 36 64 91.",
  },
  {
    question: 'Quels documents dois-je préparer avant ma réservation ?',
    answer:
      "Avant de réserver, munissez-vous de votre carte Vitale, de votre prescription médicale de transport (Cerfa S3138) et, si applicable, de votre attestation d'ALD ou CMU-C. Pour les transports en série, l'ordonnance de série suffit. Si vous n'avez pas encore la prescription, vous pouvez quand même réserver : votre médecin peut l'établir avant le jour du transport.",
  },
];

const jsonLDWebPage = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Blog Taxi VSL Conventionné CPAM Île-de-France',
  description:
    'Conseils pratiques, guides et actualités sur le transport médical en taxi conventionné et VSL en Île-de-France. Tout savoir sur la prise en charge CPAM, les remboursements et les démarches.',
  url: 'https://www.taxisparis-conventionnes.fr/blog/',
  publisher: {
    '@type': 'Organization',
    name: 'Taxis Paris Conventionnés',
    url: 'https://www.taxisparis-conventionnes.fr/',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.taxisparis-conventionnes.fr/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.taxisparis-conventionnes.fr/blog/' },
    ],
  },
};

const jsonLDFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const jsonLDMedical = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Taxis Paris Conventionnés',
  url: 'https://www.taxisparis-conventionnes.fr/',
  telephone: '+33650366491',
  areaServed: ['Paris', 'Essonne', 'Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne'],
  openingHours: 'Mo-Su 00:00-23:59',
  description:
    'Service de taxi conventionné CPAM et VSL en Île-de-France. Transports médicaux remboursés pour consultations, dialyse, chimiothérapie, hospitalisations.',
};

export default function Blog({ onNavigate: _onNavigate }: { onNavigate?: (page: string) => void }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (data) setPosts(data);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      <SEOHead
        title="Blog Taxi VSL Conventionné CPAM | Guides & Conseils Île-de-France"
        description="Conseils pratiques et guides sur le taxi conventionné et VSL remboursé CPAM en Île-de-France. Remboursements, prescriptions médicales, zones desservies. Disponible 24h/24."
        keywords={[
          'blog taxi conventionné',
          'actualités transport médical',
          'conseils VSL CPAM',
          'guide taxi conventionné Paris',
          'remboursement transport médical',
          'prescription médicale transport',
          'taxi conventionné Île-de-France',
        ]}
        canonical="https://www.taxisparis-conventionnes.fr/blog/"
        jsonLD={[jsonLDWebPage, jsonLDFAQ, jsonLDMedical]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <BookOpen size={14} aria-hidden="true" />
            Guides & conseils transport médical
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Blog Taxi VSL Conventionné<br className="hidden sm:block" /> en Île-de-France
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Tout savoir sur le transport médical remboursé CPAM : démarches, remboursements, zones desservies et conseils pratiques
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/reservation-taxi-vsl/"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-lg"
            >
              Réserver maintenant
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              href="tel:+33650366491"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-blue-600 transition"
            >
              <Phone size={16} aria-hidden="true" />
              06 50 36 64 91
            </a>
          </div>
        </div>
      </section>

      {/* ── Articles ─────────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50" aria-label="Articles du blog">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" role="status" aria-label="Chargement" />
              <p className="text-gray-600 mt-4">Chargement des articles...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
              <p className="text-gray-600 text-lg font-medium">Aucun article publié pour le moment.</p>
              <p className="text-gray-500 mt-2">Revenez bientôt pour découvrir nos nouveaux contenus !</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  {post.featured_image_url && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Article
                      </span>
                      {post.published_at && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Calendar size={13} aria-hidden="true" />
                          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                        </div>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition leading-snug">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                    )}
                    <Link
                      to={`/blog/${post.slug}/`}
                      className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
                      aria-label={`Lire l'article : ${post.title}`}
                    >
                      Lire la suite
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Section SEO 700+ mots ─────────────────────────────────────── */}
      <section className="py-12 bg-white" aria-label="Guide du transport médical conventionné">
        <div className="container mx-auto px-4 max-w-4xl">

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
            Guide complet du transport médical en taxi conventionné
          </h2>

          {/* H3.1 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-500 flex-shrink-0" aria-hidden="true" />
              Qu'est-ce qu'un taxi conventionné VSL CPAM ?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Un <strong>taxi conventionné</strong> est un véhicule agréé par la Caisse Primaire d'Assurance Maladie (CPAM) pour assurer les transports médicaux non urgents. Il s'adresse aux patients dits « assis », c'est-à-dire autonomes dans leurs déplacements et n'ayant pas besoin d'une surveillance médicale pendant le trajet. Cette catégorie se distingue du VSL (Véhicule Sanitaire Léger), conduit par un auxiliaire ambulancier, et de l'ambulance, réservée aux situations d'urgence ou de grande dépendance.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Pour qu'un transport soit qualifié de « conventionné », le chauffeur doit être titulaire d'un agrément délivré par la CPAM et respecter un tarif conventionné fixé par la Sécurité sociale. Notre entreprise est conventionnée en Île-de-France et intervient sur Paris (75), l'Essonne (91), les Hauts-de-Seine (92), la Seine-Saint-Denis (93) et le Val-de-Marne (94), 24h/24, 7j/7.
            </p>
          </div>

          {/* H3.2 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-500 flex-shrink-0" aria-hidden="true" />
              Conditions et démarches pour obtenir le remboursement CPAM
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Le remboursement de votre transport médical repose sur trois piliers : une <strong>prescription médicale de transport</strong> (formulaire Cerfa S3138) établie par votre médecin, un trajet vers un établissement de soin reconnu par l'Assurance Maladie, et une incapacité à utiliser les transports en commun justifiée médicalement. Sans prescription, le transport reste possible mais entièrement à votre charge.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Le taux de prise en charge est de 65 % du tarif conventionné pour la grande majorité des assurés. Ce taux monte à <strong>100 % pour les patients en Affection de Longue Durée (ALD)</strong>, les bénéficiaires de la Complémentaire Santé Solidaire (CSS), les femmes enceintes à partir du 6e mois, les victimes d'accident du travail et les enfants mineurs hospitalisés. La part restante (35 %) est généralement prise en charge par votre mutuelle complémentaire.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Pour les transports répétitifs (dialyse, chimiothérapie, radiothérapie), votre médecin peut établir une <strong>ordonnance de série</strong> valable plusieurs mois, évitant le renouvellement à chaque séance. Il suffit de nous transmettre ce document une seule fois lors de votre première réservation.
            </p>
          </div>

          {/* H3.3 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-500 flex-shrink-0" aria-hidden="true" />
              Types de transports médicaux pris en charge
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Notre service de taxi conventionné couvre l'ensemble des déplacements médicaux non urgents : consultations chez le médecin généraliste ou spécialiste, bilans biologiques et radiologiques, hospitalisations programmées et sorties d'établissement, séances de rééducation fonctionnelle, kinésithérapie, orthophonie et psychomotricité. Nous assurons également les <strong>transferts inter-hospitaliers</strong> entre établissements de santé d'Île-de-France.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Pour les patients en traitement lourd, nous proposons une prise en charge sur mesure : planification des séances de <strong>dialyse rénale</strong> (2 à 3 fois par semaine), accompagnement tout au long des cures de <strong>chimiothérapie et de radiothérapie</strong>, suivi des hospitalisations de jour. Nos chauffeurs sont formés à l'accueil des patients fragiles, âgés ou en situation de handicap moteur léger.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Les transports vers les aéroports de Roissy-Charles-de-Gaulle et d'Orly pour raison médicale (rapatriement sanitaire, traitement à l'étranger) sont également pris en charge sous conditions particulières. Contactez-nous pour étudier votre situation spécifique.
            </p>
          </div>

          {/* H3.4 — maillage interne vers les 5 départements */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-500 flex-shrink-0" aria-hidden="true" />
              Pourquoi lire notre blog sur le taxi conventionné ?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ce blog a pour vocation d'informer les patients, leurs proches et les professionnels de santé sur tout ce qui touche au transport médical remboursé en Île-de-France. Vous y trouverez des guides pratiques sur les démarches CPAM, des comparatifs entre les modes de transport sanitaire, des conseils pour préparer votre prise en charge et des actualités réglementaires sur les remboursements.
            </p>
            <p className="text-gray-700 leading-relaxed mb-5">
              Nos chauffeurs interviennent dans les cinq départements suivants. Consultez la page de votre département pour connaître les villes desservies et les établissements hospitaliers à proximité de chez vous :
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {DEPARTMENTS.map((dept) => (
                <Link
                  key={dept.label}
                  to={dept.href}
                  className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 hover:bg-blue-100 hover:border-blue-300 transition group"
                  aria-label={`Taxi conventionné ${dept.label}`}
                >
                  <span className="flex-shrink-0 w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                    {dept.label.match(/\d+/)?.[0]}
                  </span>
                  <span className="font-semibold text-gray-800 text-sm group-hover:text-blue-700 transition">
                    Taxi conventionné {dept.label}
                  </span>
                  <ArrowRight size={14} className="ml-auto text-blue-400 group-hover:translate-x-1 transition" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* H3.5 */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-500 flex-shrink-0" aria-hidden="true" />
              Conseils pratiques pour réserver votre taxi VSL
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Pour une réservation sans encombre, pensez à réunir vos documents avant de soumettre votre demande : carte Vitale, prescription médicale de transport (Cerfa S3138) et, le cas échéant, attestation d'ALD ou de CMU-C. Si vous bénéficiez d'une prise en charge à 100 %, indiquez-le lors de votre réservation afin que notre équipe prépare les documents de facturation directe avec la CPAM.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Réservez idéalement <strong>24 à 48 heures à l'avance</strong> pour les rendez-vous programmés, et au moins 72 heures pour les hospitalisations longue durée. Pour les transports récurrents, une seule réservation suffit : nous planifions l'ensemble des séances sur la durée de votre traitement.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Pour les situations urgentes ou non programmées, notre numéro est disponible 24h/24 au{' '}
              <a href="tel:+33650366491" className="text-blue-600 font-semibold hover:underline">
                06 50 36 64 91
              </a>
              . Nos chauffeurs s'adaptent aux imprévus et font leur possible pour intervenir dans les meilleurs délais, même en dehors des horaires habituels.
            </p>
          </div>

        </div>
      </section>

      {/* ── FAQ accordéon ────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50" aria-label="Questions fréquentes">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    aria-expanded={isOpen}
                    aria-controls={`blog-faq-answer-${index}`}
                    id={`blog-faq-question-${index}`}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    type="button"
                  >
                    <span className="font-semibold text-gray-800 text-sm sm:text-base pr-2">
                      {item.question}
                    </span>
                    <span className="flex-shrink-0 text-blue-600" aria-hidden="true">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  <div
                    id={`blog-faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`blog-faq-question-${index}`}
                    hidden={!isOpen}
                  >
                    <p className="px-5 pb-5 text-gray-700 leading-relaxed text-sm sm:text-base border-t border-gray-100 pt-3">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────── */}
      <section className="py-12 bg-white" aria-label="Réserver un transport médical">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Besoin d'un transport médical remboursé ?
          </h2>
          <p className="text-gray-600 mb-6">
            Réservez votre taxi conventionné VSL en quelques minutes. Disponible 24h/24, 7j/7 dans toute l'Île-de-France.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/reservation-taxi-vsl/"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition shadow-md"
            >
              Réserver maintenant
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              href="tel:+33650366491"
              className="inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-600 hover:text-white transition"
            >
              <Phone size={16} aria-hidden="true" />
              Appeler maintenant
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
