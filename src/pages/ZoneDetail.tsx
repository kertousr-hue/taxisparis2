import { MapPin, CheckCircle, Phone } from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface ZoneDetailProps {
  zone: string;
  onNavigate: (page: string) => void;
}

const zoneData: Record<string, {
  name: string;
  description: string;
  cities: string[];
  features: string[];
}> = {
  '75': {
    name: 'Paris',
    description: 'Service de taxi dans tous les arrondissements de Paris, 24h/24 et 7j/7',
    cities: [
      '1er arrondissement - Louvre',
      '2e arrondissement - Bourse',
      '3e arrondissement - Temple',
      '4e arrondissement - Hôtel-de-Ville',
      '5e arrondissement - Panthéon',
      '6e arrondissement - Luxembourg',
      '7e arrondissement - Palais-Bourbon',
      '8e arrondissement - Élysée',
      '9e arrondissement - Opéra',
      '10e arrondissement - Entrepôt',
      '11e arrondissement - Popincourt',
      '12e arrondissement - Reuilly',
      '13e arrondissement - Gobelins',
      '14e arrondissement - Observatoire',
      '15e arrondissement - Vaugirard',
      '16e arrondissement - Passy',
      '17e arrondissement - Batignolles-Monceau',
      '18e arrondissement - Butte-Montmartre',
      '19e arrondissement - Buttes-Chaumont',
      '20e arrondissement - Ménilmontant'
    ],
    features: [
      'Service 24h/24, 7j/7',
      'Tous les hôpitaux parisiens',
      'Gares et monuments',
      'Quartiers d\'affaires'
    ]
  },
  '91': {
    name: 'Essonne',
    description: 'Transport taxi dans tout le département de l\'Essonne',
    cities: [
      'Évry-Courcouronnes',
      'Corbeil-Essonnes',
      'Massy',
      'Savigny-sur-Orge',
      'Sainte-Geneviève-des-Bois',
      'Palaiseau',
      'Athis-Mons',
      'Viry-Châtillon',
      'Yerres',
      'Draveil',
      'Ris-Orangis',
      'Grigny',
      'Brunoy',
      'Les Ulis',
      'Montgeron'
    ],
    features: [
      'Connexion avec Paris',
      'Aéroport d\'Orly',
      'Zones d\'activités',
      'Hôpitaux du département'
    ]
  },
  '92': {
    name: 'Hauts-de-Seine',
    description: 'Service taxi professionnel dans les Hauts-de-Seine',
    cities: [
      'Nanterre',
      'Boulogne-Billancourt',
      'Courbevoie',
      'Colombes',
      'Asnières-sur-Seine',
      'Rueil-Malmaison',
      'Levallois-Perret',
      'Issy-les-Moulineaux',
      'Antony',
      'Neuilly-sur-Seine',
      'Clamart',
      'Clichy',
      'Suresnes',
      'Puteaux',
      'Montrouge'
    ],
    features: [
      'La Défense',
      'Zones d\'affaires',
      'Connexions Paris-Ouest',
      'Hôpitaux et cliniques'
    ]
  },
  '93': {
    name: 'Seine-Saint-Denis',
    description: 'Taxi disponible dans toute la Seine-Saint-Denis',
    cities: [
      'Saint-Denis',
      'Montreuil',
      'Aubervilliers',
      'Aulnay-sous-Bois',
      'Drancy',
      'Noisy-le-Grand',
      'Pantin',
      'Le Blanc-Mesnil',
      'Sevran',
      'Épinay-sur-Seine',
      'Bobigny',
      'Bondy',
      'Livry-Gargan',
      'Rosny-sous-Bois',
      'Gagny'
    ],
    features: [
      'Aéroport CDG proche',
      'Stade de France',
      'Connexions Paris-Nord',
      'Centres hospitaliers'
    ]
  },
  '94': {
    name: 'Val-de-Marne',
    description: 'Service de taxi dans le Val-de-Marne',
    cities: [
      'Créteil',
      'Vitry-sur-Seine',
      'Saint-Maur-des-Fossés',
      'Champigny-sur-Marne',
      'Ivry-sur-Seine',
      'Maisons-Alfort',
      'Fontenay-sous-Bois',
      'Villejuif',
      'Vincennes',
      'Alfortville',
      'Le Perreux-sur-Marne',
      'Nogent-sur-Marne',
      'Choisy-le-Roi',
      'Thiais',
      'Cachan'
    ],
    features: [
      'Connexions Paris-Est',
      'Aéroport d\'Orly',
      'CHU et hôpitaux',
      'Zones commerciales'
    ]
  }
};

export default function ZoneDetail({ zone, onNavigate }: ZoneDetailProps) {
  const data = zoneData[zone];

  if (!data) {
    return (
      <>
        <SEOHead
          title="Zone non trouvée - Taxi VSL Conventionné"
          description="Cette zone n'existe pas dans notre système."
          robots="noindex, nofollow"
        />
        <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Zone non trouvée</h1>
          <button
            onClick={() => onNavigate('zones')}
            className="text-blue-600 hover:underline"
          >
            Retour aux zones
          </button>
        </div>
      </div>
      </>
    );
  }

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Taxi VSL ${data.name}`,
    "description": data.description,
    "url": `https://www.taxisparis-conventionnes.fr/zone/${zone}`
  };

  return (
    <>
      <SEOHead
        title={`Taxi VSL Conventionné ${data.name} - Transport Médical`}
        description={data.description}
        keywords={[`taxi ${data.name}`, `VSL ${data.name}`, `transport médical ${data.name}`, `taxi conventionné ${zone}`]}
        canonical={`https://www.taxisparis-conventionnes.fr/zone/${zone}`}
        jsonLD={jsonLD}
      />
      <div className="py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => onNavigate('zones')}
          className="text-blue-600 hover:underline mb-6 flex items-center gap-2"
        >
          ← Retour aux zones
        </button>

        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <MapPin size={48} />
              <div>
                <div className="text-5xl font-bold">{zone}</div>
                <h1 className="text-3xl font-bold">{data.name}</h1>
              </div>
            </div>
            <p className="text-xl text-blue-100">{data.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Nos atouts
              </h2>
              <ul className="space-y-3">
                {data.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Contact
              </h2>
              <p className="text-gray-600 mb-4">
                Réservez votre course dès maintenant
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+33123456789"
                  className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <Phone size={20} />
                  <span className="font-semibold">06 50 36 64 91</span>
                </a>
                <button
                  onClick={() => onNavigate('reservation')}
                  className="w-full border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
                >
                  Réserver en ligne
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Principales villes desservies
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              {data.cities.map((city, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded"
                >
                  <MapPin size={16} className="text-blue-600" />
                  <span>{city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
