export interface DepartmentSEO {
  code: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  content: string;
  uniqueParagraph: string;
  keywords: string[];
  cities: string[];
  hospitals: string[];
  faq: Array<{ q: string; a: string }>;
  regionName?: string;
  postalCode?: string;
}

const PHONE = '06 50 36 64 91';
const PHONE_SCHEMA = '+33650366491';

const ALL_HOSPITALS = [
  'Institut Gustave Roussy (Villejuif)',
  'Hôpital Bicêtre (Le Kremlin-Bicêtre)',
  'Hôpital Lariboisière (Paris 10e)',
  'Hôpital Saint-Louis (Paris 10e)',
  'Hôpital Pitié-Salpêtrière (Paris 13e)',
  'Hôpital Cochin (Paris 14e)',
  'Hôpital Georges Pompidou (Paris 15e)',
  'Hôpital Antoine Béclère (Clamart)',
  'Hôpital Ambroise Paré (Boulogne-Billancourt)',
  'Hôpital de Villeneuve-Saint-Georges',
];

export const departmentsSEO: Record<string, DepartmentSEO> = {
  '75': {
    code: '75',
    name: 'Paris',
    metaTitle: 'Taxi Conventionné Paris (75) | CPAM | Transport Médical 24h/24',
    metaDescription:
      'Taxi conventionné à Paris (75). Transport médical remboursé CPAM vers hôpitaux de Paris et Île-de-France. Dialyse, chimio, hospitalisation. Réservation 24h/24 : 06 50 36 64 91.',
    h1: 'Taxi Conventionné dans Paris (75)',
    uniqueParagraph: `Paris concentre les plus grands établissements hospitaliers d'Île-de-France, accessibles depuis tous les arrondissements via notre service de taxi conventionné agréé CPAM. Que vous résidiez dans le 13e pour rejoindre la Pitié-Salpêtrière, dans le 10e vers Lariboisière ou Saint-Louis, dans le 14e pour Cochin, ou dans le 15e vers Georges Pompidou, nos chauffeurs connaissent parfaitement les axes parisiens : boulevards périphériques, axes nord-sud et rues intérieures. Les transports en commun parisiens (métro, RER) ne sont pas toujours adaptés aux patients en cours de traitement lourd. Notre service porte-à-porte garantit confort et ponctualité pour vos dialyses, chimiothérapies et radiothérapies, sur prescription médicale avec tiers-payant CPAM. Disponible 24h/24, 7j/7 au ${PHONE}.`,
    content: `Notre service de taxi conventionné CPAM à Paris (75) assure vos transports médicaux prescrits vers l'ensemble des hôpitaux parisiens et franciliens. Dialyse, chimiothérapie, radiothérapie, consultations spécialisées, hospitalisations : chaque trajet est organisé avec rigueur et ponctualité.\n\nNous desservons les 20 arrondissements de Paris intra-muros. Sur prescription médicale de transport, le tiers-payant CPAM s'applique selon votre situation. Aucune avance de frais dans la plupart des cas.`,
    keywords: [
      'taxi conventionné paris 75',
      'taxi cpam paris',
      'transport médical paris',
      'taxi dialyse paris',
      'taxi chimiothérapie paris',
      'taxi hospitalisation paris',
      'transport médical remboursé paris',
      'taxi conventionné ap-hp'
    ],
    cities: [
      'Paris 1er', 'Paris 2ème', 'Paris 3ème', 'Paris 4ème', 'Paris 5ème',
      'Paris 6ème', 'Paris 7ème', 'Paris 8ème', 'Paris 9ème', 'Paris 10ème',
      'Paris 11ème', 'Paris 12ème', 'Paris 13ème', 'Paris 14ème', 'Paris 15ème',
      'Paris 16ème', 'Paris 17ème', 'Paris 18ème', 'Paris 19ème', 'Paris 20ème'
    ],
    hospitals: ALL_HOSPITALS,
    faq: [
      {
        q: 'Comment réserver un taxi conventionné à Paris ?',
        a: `Appelez-nous au ${PHONE} ou réservez en ligne sur notre formulaire. Munissez-vous de votre prescription médicale de transport (PMT) et de votre carte Vitale. Nous confirmons votre trajet sous quelques minutes.`
      },
      {
        q: 'Le transport est-il remboursé par la CPAM à Paris ?',
        a: 'Oui, sur prescription médicale de transport, la CPAM prend en charge 65% à 100% du trajet selon votre situation (ALD, maternité, accident du travail). Le tiers-payant évite toute avance de frais dans la plupart des cas.'
      },
      {
        q: 'Desservez-vous tous les arrondissements de Paris ?',
        a: 'Oui, nous desservons l\'intégralité de Paris intra-muros, des 20 arrondissements, ainsi que la banlieue parisienne pour vos rendez-vous médicaux prescrits.'
      },
      {
        q: 'Quels délais pour réserver un taxi médical à Paris ?',
        a: 'Nous recommandons de réserver 24h à 48h à l\'avance pour les rendez-vous programmés. Pour les demandes urgentes, appelez directement le 06 50 36 64 91 et nous organisons votre transport dans les meilleurs délais.'
      }
    ],
    regionName: 'Île-de-France'
  },

  '91': {
    code: '91',
    name: 'Essonne',
    metaTitle: 'Taxi Conventionné Essonne (91) | CPAM | Transport Médical 24h/24',
    metaDescription:
      'Taxi conventionné dans l\'Essonne (91). Transport médical remboursé CPAM vers hôpitaux de Paris et Île-de-France. Dialyse, chimio, hospitalisation. Réservation 24h/24 : 06 50 36 64 91.',
    h1: 'Taxi Conventionné dans l\'Essonne (91)',
    uniqueParagraph: `L'Essonne (91) bénéficie d'un accès direct à Paris via le RER B (Massy, Orsay, Gif-sur-Yvette), le RER C (Juvisy, Savigny, Viry-Châtillon) et l'A6 / Francilienne. Ces axes permettent des trajets rapides vers les grands hôpitaux parisiens : Bicêtre au Kremlin-Bicêtre, la Pitié-Salpêtrière, Cochin ou l'Institut Gustave Roussy à Villejuif. Notre service de taxi conventionné CPAM couvre l'ensemble du département, des communes du nord (Massy, Palaiseau, Athis-Mons) jusqu'au sud (Étampes, Dourdan, Milly-la-Forêt). Pour vos dialyses, chimiothérapies, radiothérapies ou consultations spécialisées, nos chauffeurs vous prennent en charge à domicile et vous déposent à l'entrée de l'établissement de soins. Service disponible 24h/24 au ${PHONE}.`,
    content: `Notre service de taxi conventionné CPAM en Essonne (91) assure vos transports médicaux prescrits vers les hôpitaux de Paris et d'Île-de-France. Dialyse, chimiothérapie, radiothérapie, consultations spécialisées, hospitalisations programmées : chaque trajet est organisé avec rigueur.\n\nNous couvrons l'ensemble des communes de l'Essonne. Sur prescription médicale de transport, le tiers-payant CPAM s'applique selon votre situation.`,
    keywords: [
      'taxi conventionné essonne 91',
      'taxi cpam essonne',
      'transport médical 91',
      'taxi dialyse essonne',
      'taxi chimiothérapie essonne',
      'taxi hospitalisation essonne',
      'transport médical remboursé essonne'
    ],
    cities: [
      'Évry-Courcouronnes', 'Corbeil-Essonnes', 'Massy', 'Savigny-sur-Orge',
      'Sainte-Geneviève-des-Bois', 'Brunoy', 'Draveil', 'Viry-Châtillon',
      'Athis-Mons', 'Juvisy-sur-Orge', 'Yerres', 'Palaiseau',
      'Chilly-Mazarin', 'Longjumeau', 'Ris-Orangis'
    ],
    hospitals: ALL_HOSPITALS,
    faq: [
      {
        q: 'Comment réserver un taxi conventionné en Essonne ?',
        a: `Appelez le ${PHONE} ou utilisez notre formulaire en ligne. Préparez votre prescription médicale de transport (PMT) et votre carte Vitale. Nous confirmons votre réservation rapidement.`
      },
      {
        q: 'Le transport est-il remboursé par la CPAM en Essonne ?',
        a: 'Oui, sur prescription médicale, la CPAM prend en charge 65% à 100% du coût du transport. Pour les patients en ALD, maternité ou accident du travail, le tiers-payant intégral s\'applique généralement.'
      },
      {
        q: 'Desservez-vous toutes les communes de l\'Essonne ?',
        a: 'Oui, nous intervenons dans l\'ensemble du département 91, du nord (Massy, Juvisy) jusqu\'au sud (Étampes, Dourdan, Milly-la-Forêt), en passant par Évry, Corbeil-Essonnes et tous les autres secteurs.'
      },
      {
        q: 'Quels délais pour un taxi médical en Essonne ?',
        a: 'Nous recommandons une réservation 24h à 48h à l\'avance. Pour les urgences ou les créneaux de dernière minute, contactez-nous directement au 06 50 36 64 91.'
      }
    ],
    regionName: 'Île-de-France'
  },

  '92': {
    code: '92',
    name: 'Hauts-de-Seine',
    metaTitle: 'Taxi Conventionné Hauts-de-Seine (92) | CPAM | Transport Médical 24h/24',
    metaDescription:
      'Taxi conventionné dans les Hauts-de-Seine (92). Transport médical remboursé CPAM vers hôpitaux de Paris et Île-de-France. Dialyse, chimio, hospitalisation. Réservation 24h/24 : 06 50 36 64 91.',
    h1: 'Taxi Conventionné dans les Hauts-de-Seine (92)',
    uniqueParagraph: `Les Hauts-de-Seine (92) jouxtent directement Paris, offrant des accès rapides vers les grands hôpitaux de l'ouest parisien : Hôpital Antoine Béclère à Clamart, Hôpital Ambroise Paré à Boulogne-Billancourt, et les établissements parisiens via l'A13, l'A86, le RER A (Boulogne, La Défense) et le RER C (Issy, Clamart, Vanves). Notre service de taxi conventionné CPAM dessert l'ensemble du département 92, des communes du nord (Asnières-sur-Seine, Colombes, Gennevilliers) jusqu'au sud (Antony, Sceaux, Bourg-la-Reine), en passant par Nanterre, Boulogne, Issy-les-Moulineaux et Neuilly-sur-Seine. Pour vos dialyses, chimiothérapies, radiothérapies et consultations spécialisées, nos chauffeurs professionnels assurent une prise en charge à domicile et une dépose directe à l'établissement. Disponible 24h/24, 7j/7 au ${PHONE}.`,
    content: `Notre service de taxi conventionné CPAM dans les Hauts-de-Seine (92) organise vos transports médicaux prescrits vers les hôpitaux de Paris et d'Île-de-France. Dialyse, chimiothérapie, radiothérapie, consultations, hospitalisations : chaque trajet est pris en charge avec ponctualité et professionnalisme.\n\nNous couvrons toutes les communes du département 92. Sur prescription médicale de transport, le tiers-payant CPAM s'applique selon votre situation.`,
    keywords: [
      'taxi conventionné hauts-de-seine 92',
      'taxi cpam 92',
      'transport médical hauts-de-seine',
      'taxi dialyse 92',
      'taxi chimiothérapie hauts-de-seine',
      'taxi hospitalisation 92',
      'transport médical remboursé 92'
    ],
    cities: [
      'Nanterre', 'Boulogne-Billancourt', 'Courbevoie', 'Colombes',
      'Rueil-Malmaison', 'Levallois-Perret', 'Issy-les-Moulineaux',
      'Neuilly-sur-Seine', 'Antony', 'Clamart'
    ],
    hospitals: ALL_HOSPITALS,
    faq: [
      {
        q: 'Comment réserver un taxi conventionné dans les Hauts-de-Seine ?',
        a: `Appelez le ${PHONE} ou réservez via notre formulaire en ligne. Préparez votre prescription médicale de transport et votre carte Vitale. Nous confirmons votre trajet rapidement.`
      },
      {
        q: 'Le transport est-il remboursé par la CPAM dans le 92 ?',
        a: 'Oui, sur prescription médicale, la CPAM prend en charge 65% à 100% du trajet. Pour les patients ALD, maternité ou accident du travail, le tiers-payant intégral s\'applique généralement — sans avance de frais.'
      },
      {
        q: 'Desservez-vous toutes les communes des Hauts-de-Seine ?',
        a: 'Oui, nous couvrons l\'intégralité du 92 : Nanterre, Boulogne, Issy, Clamart, Antony, Neuilly, Colombes, Asnières, Gennevilliers, Montrouge, et toutes les autres communes du département.'
      },
      {
        q: 'Quels délais pour un taxi médical dans les Hauts-de-Seine ?',
        a: 'Nous recommandons une réservation 24h à 48h avant votre rendez-vous. Pour les urgences, contactez-nous au 06 50 36 64 91 : nous faisons notre possible pour vous satisfaire dans les meilleurs délais.'
      }
    ],
    regionName: 'Île-de-France'
  },

  '93': {
    code: '93',
    name: 'Seine-Saint-Denis',
    metaTitle: 'Taxi Conventionné Seine-Saint-Denis (93) | CPAM | Transport Médical 24h/24',
    metaDescription:
      'Taxi conventionné en Seine-Saint-Denis (93). Transport médical remboursé CPAM vers hôpitaux de Paris et Île-de-France. Dialyse, chimio, hospitalisation. Réservation 24h/24 : 06 50 36 64 91.',
    h1: 'Taxi Conventionné en Seine-Saint-Denis (93)',
    uniqueParagraph: `La Seine-Saint-Denis (93) est desservie par de nombreux axes routiers et ferroviaires permettant d'accéder rapidement aux centres hospitaliers majeurs : l'A1 et l'A3 vers Paris, le RER B (Saint-Denis, Le Bourget, Aulnay), le RER E et les lignes de métro 5, 7, 12, 13. Depuis Saint-Denis, Montreuil, Aubervilliers ou Pantin, nos chauffeurs vous conduisent vers Lariboisière (Paris 10e), Saint-Louis (Paris 10e), la Pitié-Salpêtrière (Paris 13e) ou l'Institut Gustave Roussy (Villejuif). Notre service de taxi conventionné CPAM couvre l'ensemble du département 93, y compris les communes les plus éloignées comme Tremblay-en-France, Villepinte ou Vaujours. Pour vos dialyses, chimiothérapies, radiothérapies et toutes consultations sur prescription, nous assurons un transport médical confortable et ponctuel. Disponible 24h/24, 7j/7 au ${PHONE}.`,
    content: `Notre service de taxi conventionné CPAM en Seine-Saint-Denis (93) prend en charge vos transports médicaux prescrits vers les hôpitaux de Paris et d'Île-de-France. Dialyse, chimiothérapie, radiothérapie, consultations, hospitalisations programmées : nous organisons chaque trajet avec rigueur.\n\nNous couvrons toutes les communes du 93. Sur prescription médicale de transport, le tiers-payant CPAM s'applique selon votre situation.`,
    keywords: [
      'taxi conventionné seine-saint-denis 93',
      'taxi cpam 93',
      'transport médical seine-saint-denis',
      'taxi dialyse 93',
      'taxi chimiothérapie seine-saint-denis',
      'taxi hospitalisation 93',
      'transport médical remboursé 93'
    ],
    cities: [
      'Saint-Denis', 'Montreuil', 'Aubervilliers', 'Aulnay-sous-Bois',
      'Drancy', 'Noisy-le-Grand', 'Pantin', 'Le Blanc-Mesnil',
      'Épinay-sur-Seine', 'Bobigny'
    ],
    hospitals: ALL_HOSPITALS,
    faq: [
      {
        q: 'Comment réserver un taxi conventionné en Seine-Saint-Denis ?',
        a: `Appelez le ${PHONE} ou utilisez notre formulaire de réservation en ligne. Munissez-vous de votre prescription médicale de transport (PMT) et de votre carte Vitale. La confirmation est immédiate.`
      },
      {
        q: 'Le transport est-il remboursé par la CPAM dans le 93 ?',
        a: 'Oui, sur prescription médicale, la CPAM prend en charge 65% à 100% du coût du transport médical. Les patients en ALD, maternité ou AT bénéficient généralement du tiers-payant intégral sans avance de frais.'
      },
      {
        q: 'Desservez-vous toutes les communes de Seine-Saint-Denis ?',
        a: 'Oui, nous intervenons dans l\'ensemble du département 93 : Saint-Denis, Montreuil, Aubervilliers, Pantin, Aulnay-sous-Bois, Bobigny, Tremblay-en-France, Villepinte, et toutes les autres communes.'
      },
      {
        q: 'Quels délais pour un taxi médical en Seine-Saint-Denis ?',
        a: 'Réservez de préférence 24h à 48h à l\'avance. Pour les demandes urgentes ou de dernière minute, contactez-nous directement au 06 50 36 64 91 : nous faisons tout pour vous répondre rapidement.'
      }
    ],
    regionName: 'Île-de-France'
  },

  '94': {
    code: '94',
    name: 'Val-de-Marne',
    metaTitle: 'Taxi Conventionné Val-de-Marne (94) | CPAM | Transport Médical 24h/24',
    metaDescription:
      'Taxi conventionné dans le Val-de-Marne (94). Transport médical remboursé CPAM vers hôpitaux de Paris et Île-de-France. Dialyse, chimio, hospitalisation. Réservation 24h/24 : 06 50 36 64 91.',
    h1: 'Taxi Conventionné dans le Val-de-Marne (94)',
    uniqueParagraph: `Le Val-de-Marne (94) abrite deux établissements de référence nationale : l'Institut Gustave Roussy à Villejuif, centre de lutte contre le cancer, et l'Hôpital Bicêtre au Kremlin-Bicêtre. Notre service de taxi conventionné CPAM dessert l'ensemble du département 94, des communes bordant Paris (Ivry-sur-Seine, Charenton, Vincennes) jusqu'aux secteurs plus éloignés (Orly, Boissy-Saint-Léger, Mandres-les-Roses). Les accès sont facilités par l'A86, l'A4, l'A6 ainsi que le RER A (Vincennes, Saint-Maur), le RER B (Le Kremlin-Bicêtre) et le RER C (Choisy-le-Roi, Villeneuve-Saint-Georges). Pour vos dialyses répétées, vos cycles de chimiothérapie à Gustave Roussy, vos radiothérapies ou consultations hospitalières, nos chauffeurs professionnels assurent un transport confortable et fiable. Disponible 24h/24, 7j/7 au ${PHONE}.`,
    content: `Notre service de taxi conventionné CPAM dans le Val-de-Marne (94) prend en charge vos transports médicaux prescrits vers les hôpitaux de Paris et d'Île-de-France, dont l'Institut Gustave Roussy et l'Hôpital Bicêtre. Dialyse, chimiothérapie, radiothérapie, consultations, hospitalisations : chaque déplacement est organisé avec professionnalisme.\n\nNous couvrons l'ensemble des communes du 94. Sur prescription médicale de transport, le tiers-payant CPAM s'applique selon votre situation.`,
    keywords: [
      'taxi conventionné val-de-marne 94',
      'taxi cpam 94',
      'transport médical val-de-marne',
      'taxi dialyse 94',
      'taxi chimiothérapie 94',
      'taxi gustave roussy',
      'taxi bicetre',
      'transport médical remboursé 94'
    ],
    cities: [
      'Créteil', 'Vitry-sur-Seine', 'Champigny-sur-Marne',
      'Saint-Maur-des-Fossés', 'Ivry-sur-Seine', 'Maisons-Alfort',
      'Fontenay-sous-Bois', 'Villejuif', 'Vincennes', 'Le Kremlin-Bicêtre'
    ],
    hospitals: ALL_HOSPITALS,
    faq: [
      {
        q: 'Comment réserver un taxi conventionné dans le Val-de-Marne ?',
        a: `Appelez le ${PHONE} ou réservez en ligne sur notre site. Préparez votre prescription médicale de transport et votre carte Vitale. Nous confirmons votre trajet immédiatement.`
      },
      {
        q: 'Le transport est-il remboursé par la CPAM dans le 94 ?',
        a: 'Oui, sur prescription médicale, la CPAM prend en charge 65% à 100% du coût. Pour les patients en ALD (notamment les patients suivis à Gustave Roussy ou Bicêtre), le tiers-payant intégral s\'applique généralement.'
      },
      {
        q: 'Desservez-vous toutes les communes du Val-de-Marne ?',
        a: 'Oui, nous couvrons l\'intégralité du département 94 : Créteil, Villejuif, Ivry, Vincennes, Champigny, Saint-Maur, Nogent, Orly, Boissy-Saint-Léger et toutes les autres communes.'
      },
      {
        q: 'Quels délais pour un taxi médical dans le Val-de-Marne ?',
        a: 'Nous recommandons une réservation 24h à 48h à l\'avance, particulièrement pour les créneaux tôt le matin vers Gustave Roussy ou Bicêtre. Pour les urgences, appelez le 06 50 36 64 91 directement.'
      }
    ],
    regionName: 'Île-de-France'
  }
};

export function generateCityKeywords(department: string): string[] {
  const data = departmentsSEO[department];
  if (!data) return [];
  return [...new Set(
    data.cities.flatMap(city => [
      `taxi conventionné ${city}`,
      `taxi cpam ${city}`,
      `transport médical ${city}`,
      `taxi dialyse ${city}`,
      `taxi chimiothérapie ${city}`
    ])
  )];
}

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' et ')
    .replace(/['']/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateJsonLD(department?: string) {
  const baseUrl = 'https://www.taxisparis-conventionnes.fr';
  const deptData = department ? departmentsSEO[department] : null;

  if (department && deptData) {
    const deptSlug = `taxi-conventionne-${slugify(deptData.name)}-${department}`;
    return {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'MedicalBusiness'],
      '@id': `${baseUrl}/${deptSlug}/#service`,
      'name': `Taxi Conventionné CPAM ${deptData.name} (${department})`,
      'url': `${baseUrl}/${deptSlug}/`,
      'telephone': PHONE_SCHEMA,
      'email': 'contact@taxisparis-conventionnes.fr',
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        'opens': '00:00',
        'closes': '23:59'
      },
      'areaServed': {
        '@type': 'AdministrativeArea',
        'name': `${deptData.name} (${department})`,
        'addressCountry': 'FR'
      },
      'address': {
        '@type': 'PostalAddress',
        'addressRegion': deptData.name,
        'addressCountry': 'FR'
      },
      'priceRange': 'Tiers-payant CPAM',
      'medicalSpecialty': 'Transport sanitaire conventionné'
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MedicalBusiness'],
    '@id': `${baseUrl}/#taxiservice`,
    'name': 'Taxi Conventionné CPAM Île-de-France',
    'url': baseUrl,
    'telephone': PHONE_SCHEMA,
    'areaServed': {
      '@type': 'AdministrativeArea',
      'name': 'Île-de-France',
      'addressCountry': 'FR'
    }
  };
}

export function generateBreadcrumbList(items: Array<{ name: string; url: string }>) {
  const baseUrl = 'https://www.taxisparis-conventionnes.fr';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${baseUrl}${item.url.endsWith('/') ? item.url : item.url + '/'}`
    }))
  };
}
