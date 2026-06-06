import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Phone, MapPin, ShieldCheck, Stethoscope, Activity, Building2, Clock, CreditCard, Shield, Car, Brain as Train, Plane, Users, Calendar } from 'lucide-react'
import citiesData from '../data/cities.json'
import SEOHead from '../components/SEOHead'

/* =========================================================
   UTILITAIRES STABLES (anti duplicate Google)
========================================================= */

function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return Math.abs(h)
}

function pickStable<T>(arr: T[], seed: number, count = 1) {
  const out: T[] = []
  let s = seed
  while (out.length < count && arr.length > 0) {
    const index = s % arr.length
    out.push(arr[index])
    s = Math.imul(33, s + 7)
  }
  return out
}

/* =========================================================
   GÉNÉRATEUR INTELLIGENT ULTRA PREMIUM - CONTENU UNIQUE
========================================================= */

function generateLocalContent(city: any, department: any) {
  const seed = hash(city.slug + department.slug + city.postalCode)
  const hasStations = city.nearStations && city.nearStations.length > 0
  const hasAirports = city.nearAirports && city.nearAirports.length > 0
  const hasHospitals = city.nearHospitals && city.nearHospitals.length > 0

  const careTypes = [
    'consultations spécialisées',
    'IRM et scanner',
    'séances de dialyse',
    'radiothérapie',
    'chimiothérapie',
    'hospitalisations programmées',
    'rééducation médicale',
    'examens médicaux',
    'soins oncologiques'
  ]

  const logistics = [
    'ponctualité rigoureuse',
    'respect strict des prescriptions médicales',
    'accompagnement personnalisé',
    'coordination avec les établissements de santé',
    'gestion anticipée des horaires',
    'suivi en temps réel',
    'chauffeurs formés au transport médical'
  ]

  const additionalCareDetails = [
    'Notre service médical conventionné accompagne quotidiennement les patients nécessitant des soins réguliers. Les trajets de dialyse, chimiothérapie ou radiothérapie requièrent une ponctualité absolue que nous garantissons systématiquement.',
    'Spécialisés dans le transport sanitaire, nos chauffeurs connaissent les protocoles médicaux et adaptent leur conduite à votre état de santé. Chaque véhicule est désinfecté après chaque transport.',
    'La coordination avec les services hospitaliers fait partie intégrante de notre métier. Nous vérifions les horaires de rendez-vous et anticipons les temps de stationnement dans les centres médicaux.',
    'Pour les patients en traitement longue durée, nous proposons un service de transport récurrent avec le même chauffeur pour créer une relation de confiance et assurer un suivi personnalisé.',
    'Les examens d\'imagerie médicale (IRM, scanner, radiographie) nécessitent souvent un transport adapté. Nos véhicules spacieux permettent de voyager confortablement même après des examens fatigants.',
    'Notre expérience du transport médical nous permet d\'anticiper les besoins spécifiques : aide à la mobilité, temps supplémentaire pour la marche, accompagnement jusqu\'à la salle d\'attente.'
  ]

  const contextualParagraphs = [
    `La commune de ${city.name}, située dans le ${department.name} en région Île-de-France, bénéficie d'un accès privilégié à notre réseau de transport médical conventionné. Les résidents peuvent compter sur un service de qualité pour tous leurs déplacements de santé prescrits.`,
    `Au cœur du ${department.name}, ${city.name} est parfaitement desservie par notre flotte de taxis conventionnés et VSL. La proximité des grands axes routiers franciliens nous permet de vous conduire rapidement vers n'importe quel établissement de santé de la région.`,
    `${city.name} fait partie intégrante de notre zone d'intervention prioritaire dans le ${department.name}. Nos chauffeurs connaissent parfaitement les spécificités locales de circulation et les meilleurs itinéraires vers les centres hospitaliers.`,
    `Implanté en Île-de-France, notre service dessert quotidiennement ${city.name} et l'ensemble du ${department.name}. Cette proximité géographique nous permet d'assurer des délais d'intervention courts et une grande réactivité.`,
    `${city.name}, comme l'ensemble des communes du ${department.name}, bénéficie de notre expertise en transport médical. Située en région Île-de-France, la ville profite d'un accès direct aux meilleurs établissements hospitaliers.`
  ]

  const introVariants = [
    `Notre service de taxi conventionné CPAM à ${city.name} assure vos déplacements médicaux vers l'ensemble des hôpitaux et cliniques d'Île-de-France. Installés localement, nous connaissons parfaitement les itinéraires optimaux depuis ${city.name} pour vous garantir un transport ponctuel et sécurisé. Chaque trajet médical est organisé avec rigueur pour respecter vos horaires de consultation.`,
    `Depuis ${city.name}, nos chauffeurs professionnels organisent quotidiennement des trajets sanitaires en taxi conventionné et VSL sur prescription médicale. Spécialisés dans le transport médical, nous accompagnons les patients de ${city.name} vers leurs rendez-vous hospitaliers avec un service adapté à chaque situation de santé. La prise en charge CPAM simplifie vos démarches administratives.`,
    `Notre équipe de transport médical intervient spécifiquement à ${city.name} pour l'ensemble de vos rendez-vous médicaux prescrits. Que vous résidiez en centre-ville de ${city.name} ou dans les quartiers périphériques, nous assurons une prise en charge à domicile pour tous vos déplacements de santé. Le service conventionné vous permet de voyager sans avancer de frais.`,
    `Taxi conventionné et VSL à ${city.name} : un service de transport médical agréé Sécurité sociale pour vos consultations spécialisées et soins réguliers. Les habitants de ${city.name} bénéficient d'un accompagnement personnalisé lors de leurs trajets vers les centres hospitaliers franciliens. Notre flotte sanitaire est équipée pour garantir votre confort durant le transport.`,
    `Le service de taxi médical conventionné à ${city.name} facilite vos déplacements de santé dans toute l'Île-de-France. Actifs sur le secteur de ${city.name} depuis de nombreuses années, nous connaissons les spécificités locales et les meilleurs accès aux établissements de soins. Votre prescription médicale de transport suffit pour bénéficier du tiers-payant.`,
    `Implanté à ${city.name} (${department.name}), notre service de transport sanitaire assure l'ensemble des trajets médicaux prescrits par votre médecin traitant. Les patients de ${city.name} profitent d'une disponibilité étendue et d'une réactivité optimale pour leurs rendez-vous médicaux urgents ou programmés. Nous coordonnons chaque trajet avec les services hospitaliers.`,
    `Notre service de transport sanitaire conventionné dessert l'ensemble du territoire de ${city.name} et rayonne sur toute l'Île-de-France pour vos rendez-vous médicaux. Spécialisés dans le transport de personnes nécessitant des soins réguliers, nous sommes le partenaire santé des résidents de ${city.name}. La facturation directe avec la CPAM vous évite toute avance de frais.`,
    `Transport médical agréé CPAM depuis ${city.name} vers l'ensemble des centres hospitaliers et cliniques franciliens. Notre connaissance approfondie du réseau de santé et des itinéraires depuis ${city.name} nous permet d'optimiser chaque trajet médical. Nous intervenons pour tous types de consultations, examens et traitements prescrits.`
  ]

  const serviceVariants = [
    'Notre service de taxi conventionné',
    'Nos chauffeurs professionnels',
    'Notre flotte de véhicules agréés',
    'Notre équipe spécialisée',
    'Nos taxis médicaux',
    'Notre entreprise de transport sanitaire',
    'Nos conducteurs qualifiés'
  ]

  const intro = pickStable(introVariants, seed, 1)[0]
  const serviceType = pickStable(serviceVariants, seed + 2, 1)[0]
  const selectedCare = pickStable(careTypes, seed + 4, 4).join(', ')
  const selectedLogistics = pickStable(logistics, seed + 9, 3).join(', ')
  const additionalDetail = pickStable(additionalCareDetails, seed + 50, 1)[0]
  const contextParagraph = pickStable(contextualParagraphs, seed + 60, 1)[0]

  const organizationIntros = [
    `Le transport médical depuis ${city.name} nécessite une organisation rigoureuse pour garantir le respect de vos horaires de rendez-vous. Notre équipe basée localement connaît parfaitement les spécificités de circulation à ${city.name} et anticipe les temps de trajet pour vous assurer une arrivée ponctuelle à vos consultations médicales.`,
    `Nous planifions méticuleusement chaque trajet médical au départ de ${city.name} pour assurer votre ponctualité absolue. Grâce à notre expérience du secteur de ${city.name}, nous calculons précisément les délais nécessaires et optimisons les itinéraires vers chaque établissement hospitalier francilien.`,
    `Votre confort et votre sérénité sont prioritaires lors de vos déplacements médicaux depuis ${city.name}. Nos chauffeurs formés au transport sanitaire adaptent leur conduite à votre état de santé et veillent à rendre chaque trajet depuis ${city.name} aussi agréable que possible, quelle que soit la distance.`,
    `Chaque transport sanitaire depuis ${city.name} est coordonné avec précision pour respecter vos contraintes horaires médicales. Nous synchronisons nos départs de ${city.name} avec vos rendez-vous hospitaliers et maintenons un contact permanent pour garantir votre tranquillité d'esprit durant tout le parcours.`,
    `La fiabilité de nos services de taxi conventionné à ${city.name} repose sur une préparation minutieuse de chaque trajet médical. En amont de votre prise en charge à ${city.name}, nous vérifions les conditions de circulation et sélectionnons le meilleur itinéraire pour vous conduire sereinement vers votre destination de soins.`
  ]

  const organizationIntro = pickStable(organizationIntros, seed + 12, 1)[0]

  const benefitsList = [
    [
      'Prise en charge directe à votre domicile',
      'Véhicules sanitaires confortables et équipés',
      'Chauffeurs expérimentés et à l\'écoute',
      'Tiers-payant CPAM selon votre situation'
    ],
    [
      'Service disponible 7 jours sur 7',
      'Respect strict des horaires médicaux',
      'Assistance personnalisée durant le trajet',
      'Aucune avance de frais dans la plupart des cas'
    ],
    [
      'Trajets directs sans détour inutile',
      'Coordination avec les services hospitaliers',
      'Véhicules régulièrement contrôlés',
      'Prise en charge par la Sécurité sociale'
    ],
    [
      'Réservation simple et rapide',
      'Confirmation systématique de rendez-vous',
      'Suivi personnalisé de votre dossier',
      'Facturation directe avec la CPAM'
    ]
  ]

  const benefits = pickStable(benefitsList, seed + 18, 1)[0]

  const paragraph = `
${intro}

${serviceType} prend en charge : ${selectedCare}.
Chaque trajet est organisé avec ${selectedLogistics}.

${additionalDetail}

${contextParagraph}

Sur prescription médicale de transport, le tiers-payant CPAM est appliqué selon votre éligibilité. Vous n'avez généralement aucun frais à avancer pour vos trajets médicaux conventionnés. Le transport médical conventionné depuis ${city.name} couvre l'intégralité du territoire francilien.
`

  const organizationText = `
${organizationIntro}

${serviceType} assure :
• ${benefits.join('\n• ')}

Que vous ayez besoin d'un trajet vers ${hasHospitals ? city.nearHospitals[0] : 'un établissement hospitalier'} ou tout autre centre médical francilien, nous vous garantissons un service professionnel et ponctuel.
`

  const faq = [
    {
      q: `Comment réserver un taxi conventionné à ${city.name} ?`,
      a: `Appelez-nous au 06 50 36 64 91 ou réservez en ligne sur notre formulaire. Munissez-vous de votre prescription médicale de transport (PMT) et de votre carte Vitale. Nous confirmons votre trajet sous quelques minutes.`
    },
    {
      q: `Le trajet est-il remboursé par la CPAM ?`,
      a: `Oui, sur prescription médicale de transport, la CPAM prend en charge 65% à 100% du trajet selon votre situation (ALD, maternité, accident du travail). Le tiers-payant évite toute avance de frais dans la plupart des cas.`
    },
    {
      q: `Quels transports médicaux proposez-vous depuis ${city.name} ?`,
      a: `Nous assurons tous les transports prescrits : dialyse, chimiothérapie, radiothérapie, consultations spécialisées, examens (IRM, scanner), hospitalisations programmées et sorties d'hôpital. Service disponible 24h/24, 7j/7.`
    },
    {
      q: `Vers quels hôpitaux pouvez-vous m'emmener depuis ${city.name} ?`,
      a: `Nous desservons l'ensemble des hôpitaux d'Île-de-France, notamment l'Institut Gustave Roussy (Villejuif), Hôpital Bicêtre (Le Kremlin-Bicêtre), Pitié-Salpêtrière (Paris 13e), Lariboisière (Paris 10e), Cochin (Paris 14e), Georges Pompidou (Paris 15e) et tous les autres établissements sur prescription.`
    }
  ]

  const tripDescriptions = [
    'Trajets réguliers pour consultations spécialisées',
    'Transport pour examens et imagerie médicale',
    'Déplacements pour soins oncologiques',
    'Accès aux services d\'urgences et consultations',
    'Trajets pour dialyse et traitements réguliers',
    'Transport vers services de cardiologie',
    'Accès aux consultations de médecine interne',
    'Déplacements pour radiothérapie et chimiothérapie'
  ]

  const frequentTrips = hasHospitals
    ? city.nearHospitals.slice(0, 4).map((hospital: string, idx: number) => ({
        from: city.name,
        to: hospital,
        description: pickStable(tripDescriptions, seed + idx + 100, 1)[0]
      }))
    : [
        { from: city.name, to: 'Institut Gustave Roussy', description: pickStable(tripDescriptions, seed + 100, 1)[0] },
        { from: city.name, to: 'Hôpital Bicêtre', description: pickStable(tripDescriptions, seed + 101, 1)[0] },
        { from: city.name, to: 'Hôpital Cochin', description: pickStable(tripDescriptions, seed + 102, 1)[0] },
        { from: city.name, to: 'Pitié-Salpêtrière', description: pickStable(tripDescriptions, seed + 103, 1)[0] }
      ]

  const whyChooseVariants = [
    [
      'Agrément CPAM valide et à jour',
      'Flotte de véhicules confortables et récents',
      'Chauffeurs formés au transport de personnes à mobilité réduite',
      'Service client réactif et disponible',
      'Tarifs conventionnés transparents'
    ],
    [
      'Plus de 10 ans d\'expérience dans le transport médical',
      'Connaissance parfaite des hôpitaux franciliens',
      'Respect strict des protocoles sanitaires',
      'Ponctualité garantie pour vos rendez-vous',
      'Accompagnement personnalisé selon vos besoins'
    ],
    [
      'Service de qualité reconnu par nos patients',
      'Véhicules adaptés à tous types de pathologies',
      'Prise en charge douce et sécurisée',
      'Gestion administrative simplifiée',
      'Disponibilité 7j/7 pour urgences et rendez-vous programmés'
    ]
  ]

  const whyChoose = pickStable(whyChooseVariants, seed + 25, 1)[0]

  const additionalSections = {
    accessibility: [
      `L'accessibilité de nos services à ${city.name} constitue une priorité absolue. Nos véhicules sont équipés pour accueillir les personnes à mobilité réduite, avec des systèmes d'aide à l'embarquement et des espaces adaptés pour les fauteuils roulants pliants.`,
      `À ${city.name}, nous adaptons chaque transport aux besoins spécifiques des patients. Que vous nécessitiez une assistance particulière ou un accompagnement renforcé, nos chauffeurs formés sont à votre écoute pour garantir votre confort et votre sécurité.`,
      `Notre flotte de taxis conventionnés desservant ${city.name} comprend des véhicules spacieux permettant le transport de matériel médical (déambulateur, bouteilles d'oxygène) tout en assurant votre confort durant le trajet.`,
      `Les patients de ${city.name} bénéficient d'un service personnalisé tenant compte de leur mobilité. Nos chauffeurs prennent le temps nécessaire pour l'installation en toute sécurité et n'hésitent pas à apporter leur aide jusqu'au service hospitalier.`
    ],
    coverage: [
      `Le service de taxi conventionné à ${city.name} couvre l'ensemble du territoire francilien. Depuis ${city.name}, nous organisons des trajets vers Paris et toutes les communes d'Île-de-France disposant d'établissements de santé. Notre connaissance du réseau routier régional garantit l'optimisation de chaque trajet.`,
      `Implanté dans le ${department.name}, notre service rayonne naturellement sur ${city.name} et ses environs. Cette implantation locale nous permet de connaître parfaitement les spécificités de circulation à ${city.name} et d'anticiper les temps de trajet avec précision.`,
      `${city.name} se situe dans une zone géographique stratégique de l'Île-de-France. Cette position facilite l'accès aux principaux centres hospitaliers parisiens et régionaux. Nos chauffeurs utilisent les axes rapides pour minimiser vos temps de transport.`,
      `Notre couverture géographique depuis ${city.name} englobe les cinq départements de la petite couronne ainsi que Paris intra-muros. Quel que soit l'emplacement de votre établissement de santé, nous vous y conduisons dans les meilleures conditions.`
    ],
    booking: [
      `Réserver un transport médical depuis ${city.name} s'effectue simplement par téléphone ou via notre plateforme en ligne. Indiquez-nous votre adresse à ${city.name}, votre destination médicale et l'horaire souhaité. Nous confirmons immédiatement la disponibilité et planifions votre trajet.`,
      `Pour vos trajets réguliers depuis ${city.name} (dialyse, chimiothérapie), nous proposons la mise en place de créneaux récurrents. Cette organisation systématique vous libère de la contrainte de réservation et assure la continuité de vos soins.`,
      `La réservation anticipée depuis ${city.name} reste recommandée, particulièrement pour les rendez-vous matinaux ou les trajets vers des établissements éloignés. Toutefois, notre réactivité nous permet d'honorer des demandes à court délai selon les disponibilités.`,
      `Lors de votre réservation au départ de ${city.name}, munissez-vous de votre prescription médicale de transport et des coordonnées précises de l'établissement de destination. Ces informations nous permettent d'optimiser l'organisation de votre trajet médical.`
    ]
  }

  const selectedAccessibility = pickStable(additionalSections.accessibility, seed + 70, 1)[0]
  const selectedCoverage = pickStable(additionalSections.coverage, seed + 80, 1)[0]
  const selectedBooking = pickStable(additionalSections.booking, seed + 90, 1)[0]

  return {
    paragraph,
    organizationText,
    faq,
    frequentTrips,
    whyChoose,
    selectedAccessibility,
    selectedCoverage,
    selectedBooking
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CityPage() {
  const { departmentSlug, citySlug } = useParams()

  const department = citiesData.departments.find(
    (d: any) => d.slug === departmentSlug
  )

  const city = department?.cities.find(
    (c: any) => c.slug === citySlug
  )

  if (!department || !city) {
    return <div className="text-center py-20">Ville non trouvée</div>
  }

  const baseUrl = `https://www.taxisparis-conventionnes.fr/${departmentSlug}/${citySlug}/`

  const seed = hash(city.slug + city.postalCode)

  const seoTitle = `Taxi Conventionné ${city.name} (${city.postalCode}) | CPAM | Transport Médical 24h/24`
  const h1Text = `Taxi Conventionné à ${city.name} (${city.postalCode})`
  const Icon = ShieldCheck

  const {
    paragraph,
    organizationText,
    faq,
    frequentTrips,
    whyChoose,
    selectedAccessibility,
    selectedCoverage,
    selectedBooking
  } = useMemo(
    () => generateLocalContent(city, department),
    [city, department]
  )

  const metaDescription = `Taxi conventionné à ${city.name} (${city.postalCode}). Transport médical remboursé CPAM vers hôpitaux de Paris et Île-de-France. Dialyse, chimio, hospitalisation. Réservation 24h/24 : 06 50 36 64 91.`

  const nearbyCities = city.nearCities
    ? department.cities.filter((c: any) => city.nearCities.includes(c.slug))
    : department.cities.filter((c: any) => c.slug !== citySlug).slice(0, 5)

  const allNearbyCities = department.cities
    .filter((c: any) => c.slug !== citySlug)
    .slice(0, 8)

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService", "MedicalBusiness"],
    "name": `Taxi Conventionné CPAM ${city.name}`,
    "alternateName": `Transport Médical ${city.name}`,
    "description": `Service de taxi conventionné et VSL à ${city.name} (${city.postalCode}) dans le ${department.name}, Île-de-France. Transport médical agréé Sécurité sociale pour consultations, dialyse, chimiothérapie, radiothérapie. Tiers-payant CPAM. Transferts hôpitaux, gares et aéroports.`,
    "url": baseUrl,
    "telephone": "+33650366491",
    "priceRange": "Tiers-payant CPAM (65% à 100% pris en charge)",
    "currenciesAccepted": "EUR",
    "paymentAccepted": "Tiers-payant CPAM, Carte bancaire, Mutuelle",
    "areaServed": [
      {
        "@type": "City",
        "name": city.name,
        "postalCode": city.postalCode,
        "addressRegion": department.name,
        "addressCountry": "FR"
      },
      {
        "@type": "State",
        "name": "Île-de-France",
        "addressCountry": "FR"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city.name,
      "postalCode": city.postalCode,
      "addressRegion": department.name,
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "addressCountry": "FR"
    },
    "serviceType": ["Transport médical conventionné CPAM", "Taxi conventionné", "VSL", "Transport sanitaire"],
    "availableService": [
      {
        "@type": "Service",
        "name": "Taxi conventionné CPAM",
        "description": "Transport médical individuel avec tiers-payant selon prescription",
        "provider": {
          "@type": "TaxiService",
          "name": `Taxi Conventionné ${city.name}`
        }
      },
      {
        "@type": "Service",
        "name": "VSL (Véhicule Sanitaire Léger)",
        "description": "Transport sanitaire assis professionnalisé pour 3 patients maximum",
        "provider": {
          "@type": "MedicalBusiness",
          "name": `VSL ${city.name}`
        }
      },
      {
        "@type": "Service",
        "name": "Transport pour dialyse",
        "description": "Trajets réguliers pour séances de dialyse avec tiers-payant CPAM"
      },
      {
        "@type": "Service",
        "name": "Transport pour chimiothérapie",
        "description": "Accompagnement pour traitements de chimiothérapie"
      },
      {
        "@type": "Service",
        "name": "Transfert gare et aéroport médical",
        "description": "Transferts vers gares parisiennes et aéroports sur prescription médicale"
      }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.taxisparis-conventionnes.fr"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={metaDescription}
        canonical={baseUrl}
        jsonLD={jsonLD}
      />

      <div className="bg-white">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              {h1Text}
            </h1>
            <h2 className="text-2xl text-blue-100">
              Transport médical remboursé CPAM | Dialyse, Chimio, Hospitalisation
            </h2>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">

            {/* BOUTONS MOBILE - Visible uniquement sur mobile */}
            <div className="lg:hidden bg-blue-900 text-white p-6 rounded-2xl text-center shadow-xl">
              <h4 className="text-lg font-bold mb-3">
                Réservation à {city.name}
              </h4>
              <p className="text-blue-200 text-sm mb-4">
                Service disponible 7j/7
              </p>
              <a
                href="tel:+33650366491"
                className="bg-white text-blue-900 font-bold py-4 px-6 rounded-xl inline-flex items-center gap-2 hover:bg-blue-50 transition shadow-lg hover:shadow-xl mb-3 w-full justify-center"
              >
                <Phone className="w-5 h-5" />
                06 50 36 64 91
              </a>
              <Link
                to="/reservation-taxi-vsl/"
                className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition w-full justify-center"
              >
                <Calendar className="w-5 h-5" />
                Réserver en ligne
              </Link>
            </div>

            <section>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl mb-6">
                <p className="text-sm text-gray-700">
                  <Link to={`/${departmentSlug}/`} className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                    {department.name}
                  </Link>
                  {' '}&gt;{' '}
                  <span className="text-gray-900 font-semibold">{city.name}</span>
                  {' '}&bull;{' '}
                  <Link to="/zones-desservies/" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Toutes nos zones
                  </Link>
                </p>
              </div>

              <h3 className="text-3xl font-bold flex items-center gap-3 mb-6">
                <Icon className="text-blue-600 w-8 h-8" />
                Transport médical conventionné à {city.name}
              </h3>
              <div className="prose prose-lg whitespace-pre-line text-gray-700">
                {paragraph}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <Activity className="text-blue-600" />
                Organisation des trajets médicaux depuis {city.name}
              </h3>
              <div className="prose prose-lg whitespace-pre-line text-gray-700">
                {organizationText}
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-700">
                  Notre service de taxi conventionné couvre l'ensemble du{' '}
                  <Link to={`/${departmentSlug}/`} className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                    {department.name}
                  </Link>
                  {' '}et toute{' '}
                  <Link to="/zones-desservies/" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                    l'Île-de-France
                  </Link>
                  .{' '}
                  <Link to="/reservation-taxi-vsl/" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                    Réservez votre transport médical
                  </Link>
                  {' '}en quelques clics.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <MapPin className="text-blue-600" />
                Trajets médicaux fréquents depuis {city.name}
              </h3>
              <p className="text-gray-700 mb-6">
                Les patients de {city.name} nous font confiance pour leurs déplacements médicaux réguliers. Voici les trajets les plus fréquemment effectués depuis {city.name} vers les grands centres hospitaliers franciliens :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {frequentTrips.map((trip: any, i: number) => (
                  <div key={i} className="border-l-4 border-blue-600 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 font-semibold text-gray-900 mb-1">
                      <span>{trip.from}</span>
                      <span className="text-blue-600">→</span>
                      <span>{trip.to}</span>
                    </div>
                    <p className="text-sm text-gray-600">{trip.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-blue-200 rounded-xl p-5">
                <p className="text-gray-700 mb-3">
                  Que vous habitiez le centre de {city.name} ou ses quartiers périphériques, nous organisons vos trajets médicaux vers l'ensemble des hôpitaux et cliniques d'Île-de-France. Chaque déplacement depuis {city.name} est pris en charge sur prescription médicale avec le tiers-payant CPAM.
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link
                    to="/taxis-aeroports-parisiens/"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    <Plane className="w-4 h-4" />
                    Transferts aéroports
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to="/taxis-gares-parisiennes/"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    <Train className="w-4 h-4" />
                    Transferts gares
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to="/reservation-taxi-vsl/"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    <Calendar className="w-4 h-4" />
                    Réserver maintenant
                  </Link>
                </div>
              </div>
            </section>

            {city.nearHospitals && city.nearHospitals.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                  <Building2 className="text-blue-600" />
                  Hôpitaux desservis depuis {city.name}
                </h3>
                <p className="text-gray-700 mb-6">
                  Notre service de taxi conventionné à {city.name} vous conduit vers les principaux établissements hospitaliers de la région. Ces centres de santé sont régulièrement desservis par nos chauffeurs au départ de {city.name} :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {city.nearHospitals.map((hospital: string, i: number) => (
                    <div key={i} className="border rounded-xl p-4 flex items-center gap-3 hover:border-blue-600 hover:bg-blue-50 transition">
                      <Stethoscope className="text-blue-500 w-5 h-5 flex-shrink-0" />
                      <span className="text-gray-700">{hospital}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 mt-4">
                  Depuis {city.name}, nous assurons également le transport médical conventionné CPAM vers tous les autres établissements de santé d'Île-de-France selon votre prescription médicale.
                </p>
              </section>
            )}

            <section>
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <ShieldCheck className="text-blue-600" />
                Pourquoi choisir notre taxi conventionné à {city.name} ?
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <ul className="space-y-3">
                  {whyChoose.map((reason: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <Users className="text-blue-600" />
                Accessibilité et adaptation à {city.name}
              </h3>
              <div className="prose prose-lg text-gray-700">
                <p>{selectedAccessibility}</p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <MapPin className="text-blue-600" />
                Couverture géographique depuis {city.name}
              </h3>
              <div className="prose prose-lg text-gray-700">
                <p>{selectedCoverage}</p>
                <p className="mt-4">
                  Le {department.name}, dont fait partie {city.name}, est idéalement situé en région Île-de-France.
                  Cette localisation centrale facilite les trajets médicaux vers l'ensemble des établissements hospitaliers
                  de la région parisienne. Notre connaissance approfondie du réseau routier francilien et de ses particularités
                  de circulation nous permet d'optimiser chaque déplacement depuis {city.name}.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <Calendar className="text-blue-600" />
                Comment réserver votre taxi conventionné à {city.name}
              </h3>
              <div className="prose prose-lg text-gray-700">
                <p>{selectedBooking}</p>
                <p className="mt-4">
                  Habitants de {city.name} dans le {department.name}, vous pouvez nous contacter 7 jours sur 7 pour organiser
                  vos déplacements médicaux. Notre équipe connaît parfaitement le secteur de {city.name} et saura vous conseiller
                  sur les meilleurs horaires de départ pour respecter vos rendez-vous hospitaliers. Le service client reste
                  disponible pour répondre à toutes vos questions sur le transport médical conventionné CPAM depuis {city.name}.
                </p>
              </div>
            </section>

            <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">
                Réservez votre transport médical depuis {city.name}
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Service disponible 24h/24 et 7j/7 pour vos déplacements médicaux prescrits
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+33650366491"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold transition shadow-lg hover:shadow-xl text-lg w-full sm:w-auto"
                >
                  <Phone className="w-6 h-6" />
                  <span className="flex flex-col items-start">
                    <span className="text-xs font-normal text-blue-500">Appelez-nous</span>
                    <span>06 50 36 64 91</span>
                  </span>
                </a>
                <Link
                  to="/reservation-taxi-vsl/"
                  className="inline-flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg hover:shadow-xl text-lg border-2 border-blue-300 w-full sm:w-auto"
                >
                  <Calendar className="w-6 h-6" />
                  Réserver en ligne
                </Link>
              </div>
              <p className="text-blue-200 text-sm mt-6">
                Munissez-vous de votre prescription médicale de transport
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4">
                Questions fréquentes à {city.name}
              </h3>

              <div className="space-y-4">
                {faq.map((f, i) => (
                  <div key={i} className="border rounded-xl p-4">
                    <p className="font-semibold">{f.q}</p>
                    <p className="text-gray-600 mt-2">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="text-blue-600" />
                  Taxis conventionnés dans les villes voisines
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+33650366491"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
                  >
                    <Phone className="w-5 h-5" />
                    06 50 36 64 91
                  </a>
                  <Link
                    to="/reservation-taxi-vsl/"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    Réserver
                  </Link>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Notre service de taxi conventionné dessert également les communes proches de {city.name}.
                Découvrez nos services dans les villes voisines du {department.name}.
              </p>

              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-4 text-gray-900">
                  Communes proches desservies par notre service
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {nearbyCities.map((neighbor: any) => (
                    <Link
                      key={neighbor.slug}
                      to={`/${departmentSlug}/${neighbor.slug}/`}
                      className="bg-white border-2 border-gray-200 px-4 py-4 rounded-xl hover:border-blue-600 hover:shadow-lg transition group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 group-hover:text-blue-600">
                          {neighbor.name}
                        </span>
                        <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Taxi conventionné CPAM
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-4 text-gray-900">
                  Autres villes du {department.name}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allNearbyCities.map((neighbor: any) => (
                    <Link
                      key={neighbor.slug}
                      to={`/${departmentSlug}/${neighbor.slug}/`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {neighbor.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-300 pt-6 mt-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-2">
                        Toutes nos destinations dans le {department.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Découvrez l'ensemble des villes desservies par notre service de taxi conventionné
                      </p>
                    </div>
                    <Link
                      to={`/${departmentSlug}/`}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl whitespace-nowrap"
                    >
                      <MapPin className="w-5 h-5" />
                      Voir toutes les villes
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t pt-8">
              <h3 className="text-2xl font-bold mb-4">
                Services complémentaires
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/taxis-gares-parisiennes/"
                  className="border rounded-xl p-5 hover:border-blue-600 hover:shadow-lg transition"
                >
                  <Train className="text-blue-600 w-6 h-6 mb-2" />
                  <h4 className="font-bold mb-1">Taxis Gares Parisiennes</h4>
                  <p className="text-sm text-gray-600">Transferts vers toutes les gares de Paris</p>
                </Link>
                <Link
                  to="/taxis-aeroports-parisiens/"
                  className="border rounded-xl p-5 hover:border-blue-600 hover:shadow-lg transition"
                >
                  <Plane className="text-blue-600 w-6 h-6 mb-2" />
                  <h4 className="font-bold mb-1">Taxis Aéroports Parisiens</h4>
                  <p className="text-sm text-gray-600">CDG, Orly, Beauvais pour raisons médicales</p>
                </Link>
                <Link
                  to="/reservation-taxi-vsl/"
                  className="border rounded-xl p-5 hover:border-blue-600 hover:shadow-lg transition bg-blue-50"
                >
                  <Car className="text-blue-600 w-6 h-6 mb-2" />
                  <h4 className="font-bold mb-1">Réserver un taxi VSL</h4>
                  <p className="text-sm text-gray-600">Réservation en ligne rapide et simple</p>
                </Link>
                <Link
                  to="/faq/"
                  className="border rounded-xl p-5 hover:border-blue-600 hover:shadow-lg transition"
                >
                  <Shield className="text-blue-600 w-6 h-6 mb-2" />
                  <h4 className="font-bold mb-1">Questions fréquentes</h4>
                  <p className="text-sm text-gray-600">Toutes les réponses sur le transport CPAM</p>
                </Link>
              </div>
            </section>

          </div>

          {/* SIDEBAR DESKTOP - Visible uniquement sur desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-blue-900 text-white p-8 rounded-3xl text-center shadow-2xl">
                <h4 className="text-xl font-bold mb-4">
                  Réservation à {city.name}
                </h4>
                <p className="text-blue-200 text-sm mb-6">
                  Service disponible 7j/7
                </p>
                <a
                  href="tel:+33650366491"
                  className="bg-white text-blue-900 font-bold py-4 px-6 rounded-xl inline-flex items-center gap-2 hover:bg-blue-50 transition shadow-lg hover:shadow-xl mb-4 w-full justify-center"
                >
                  <Phone className="w-5 h-5" />
                  06 50 36 64 91
                </a>
                <Link
                  to="/reservation-taxi-vsl/"
                  className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition w-full justify-center"
                >
                  <Calendar className="w-5 h-5" />
                  Réserver en ligne
                </Link>
              </div>

              <div className="bg-white border-2 border-blue-200 p-6 rounded-2xl shadow-lg">
                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="text-blue-600 w-5 h-5" />
                  Zones desservies
                </h5>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    <Link
                      to={`/${departmentSlug}/`}
                      className="hover:text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {department.name}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/zones-desservies/"
                      className="hover:text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      Toute l'Île-de-France
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/taxis-aeroports-parisiens/"
                      className="hover:text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      Aéroports parisiens
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/taxis-gares-parisiennes/"
                      className="hover:text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      Gares parisiennes
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
