import { Plane, Train, Euro, Clock, MapPin, Phone } from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface StationsProps {
  onNavigate: (page: string) => void;
}

export default function Stations({ onNavigate }: StationsProps) {
  const airports = [
    {
      name: 'Aéroport Roissy Charles de Gaulle',
      code: 'CDG',
      description: 'Terminal 1, 2 et 3',
      forfait: 'À partir de 55€',
      duration: '30-45 min depuis Paris'
    },
    {
      name: 'Aéroport d\'Orly',
      code: 'ORY',
      description: 'Orly 1, 2, 3 et 4',
      forfait: 'À partir de 40€',
      duration: '25-35 min depuis Paris'
    },
    {
      name: 'Aéroport de Beauvais',
      code: 'BVA',
      description: 'Beauvais-Tillé',
      forfait: 'À partir de 120€',
      duration: '1h15-1h30 depuis Paris'
    }
  ];

  const stations = [
    { name: 'Gare du Nord', lines: 'TGV, Eurostar, Thalys' },
    { name: 'Gare de l\'Est', lines: 'TGV Est Européen' },
    { name: 'Gare de Lyon', lines: 'TGV Sud-Est, Méditerranée' },
    { name: 'Gare Montparnasse', lines: 'TGV Atlantique, Bretagne' },
    { name: 'Gare Saint-Lazare', lines: 'Normandie' },
    { name: 'Gare d\'Austerlitz', lines: 'Intercités Sud-Ouest' },
    { name: 'Gare de Bercy', lines: 'Trains de nuit' }
  ];

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Gares & Aéroports - Taxi VSL Paris",
    "description": "Transferts vers tous les aéroports et gares parisiennes avec forfaits avantageux.",
    "url": "https://www.taxisparis-conventionnes.fr/taxis-gares-aeroports"
  };

  return (
    <>
      <SEOHead
        title="Transfert Gares & Aéroports Paris | Tarifs Forfaitaires - Taxi VSL"
        description="Transferts taxi et VSL vers les aéroports (CDG, Orly, Beauvais) et toutes les gares parisiennes. Tarifs forfaitaires avantageux, service 24/7."
        keywords={["transfert aéroport Paris", "taxi gare Paris", "navette CDG", "transfert Orly", "taxi gare du Nord", "transport gare Montparnasse"]}
        canonical="https://www.taxisparis-conventionnes.fr/taxis-gares-aeroports"
        jsonLD={jsonLD}
      />
      <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Gares & Aéroports
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transferts vers tous les aéroports et gares parisiennes avec forfaits avantageux
          </p>
        </div>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Plane className="text-blue-600" size={32} />
            <h2 className="text-3xl font-bold text-gray-800">Aéroports</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {airports.map((airport) => (
              <div
                key={airport.code}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6">
                  <Plane size={40} className="mb-3" />
                  <h3 className="text-2xl font-bold mb-1">{airport.code}</h3>
                  <p className="text-blue-100">{airport.name}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={18} className="text-blue-600" />
                      <span>{airport.description}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={18} className="text-blue-600" />
                      <span>{airport.duration}</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-blue-900">
                      <Euro size={20} />
                      <span className="font-bold text-xl">{airport.forfait}</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">Forfait depuis Paris centre</p>
                  </div>
                  <button
                    onClick={() => onNavigate('reservation')}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Plane size={20} />
              Informations forfaits aéroports
            </h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>✓ Prix forfaitaires garantis sans surprise</li>
              <li>✓ Suivi du vol en temps réel</li>
              <li>✓ Attente incluse en cas de retard</li>
              <li>✓ Aide aux bagages</li>
              <li>✓ Paiement à bord (CB, espèces)</li>
              <li>✓ Véhicules confortables et spacieux</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <Train className="text-blue-600" size={32} />
            <h2 className="text-3xl font-bold text-gray-800">Gares parisiennes</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stations.map((station) => (
              <div
                key={station.name}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Train className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {station.name}
                    </h3>
                    <p className="text-sm text-gray-600">{station.lines}</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('reservation')}
                  className="w-full mt-4 border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
                >
                  Réserver
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Train size={20} />
              Service gares
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Prise en charge devant toutes les gares parisiennes</li>
              <li>✓ Suivi des horaires de train</li>
              <li>✓ Tarifs au compteur selon distance</li>
              <li>✓ Aide aux bagages volumineux</li>
              <li>✓ Réservation recommandée aux heures de pointe</li>
            </ul>
          </div>
        </section>

        <section className="mt-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Besoin d'un transfert ?
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Réservez dès maintenant ou contactez-nous pour un devis personnalisé
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('airport-transfer')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2"
            >
              <Plane size={20} />
              Réserver Aéroport
            </button>
            <button
              onClick={() => onNavigate('station-transfer')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2"
            >
              <Train size={20} />
              Réserver Gare
            </button>
            <a
              href="tel:+33650366491"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition flex items-center gap-2"
            >
              <Phone size={20} />
              06 50 36 64 91
            </a>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
