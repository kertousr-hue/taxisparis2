import SEOHead from '../components/SEOHead';

export default function CGV() {
  return (
    <>
      <SEOHead
        title="Conditions Générales de Vente | Taxi VSL Île-de-France"
        description="Conditions générales de vente de Taxi VSL Île-de-France. Tarifs, modalités de réservation et politique d'annulation."
        canonical="https://www.taxisparis-conventionnes.fr/conditions-generales-de-vente/"
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions Générales de Vente</h1>

          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8 text-gray-700">

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Objet</h2>
              <p className="leading-relaxed">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Taxi VSL Île-de-France et ses clients dans le cadre de la fourniture de services de transport (taxi conventionné, VSL, transferts aéroport/gare).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Services proposés</h2>
              <p className="leading-relaxed">
                Taxi VSL Île-de-France propose les services suivants :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 leading-relaxed">
                <li>Taxi conventionné Assurance Maladie (prescription médicale)</li>
                <li>VSL (Véhicule Sanitaire Léger)</li>
                <li>Transferts vers aéroports parisiens (CDG, Orly, Beauvais)</li>
                <li>Transferts vers gares parisiennes</li>
                <li>Courses à la demande en Île-de-France</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Tarifs</h2>
              <p className="leading-relaxed">
                Les tarifs appliqués sont conformes à la réglementation tarifaire préfectorale en vigueur pour les taxis conventionnés. Pour les courses non conventionnées, un devis est établi sur demande. Les prix sont exprimés en euros TTC.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Réservation</h2>
              <p className="leading-relaxed">
                Les réservations peuvent être effectuées :<br /><br />
                — Par téléphone : <a href="tel:+33650366491" className="text-blue-600 hover:underline">06 50 36 64 91</a> (24h/24, 7j/7)<br />
                — Via le formulaire en ligne sur notre site<br />
                — Par email : <a href="mailto:contact@taxisparis-conventionnes.fr" className="text-blue-600 hover:underline">contact@taxisparis-conventionnes.fr</a><br /><br />
                Toute réservation confirmée engage le client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Annulation</h2>
              <p className="leading-relaxed">
                Toute annulation doit être signalée au minimum 2 heures avant l'heure de prise en charge prévue. En cas d'annulation tardive ou d'absence du client, des frais peuvent être facturés selon les conditions convenues lors de la réservation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Paiement</h2>
              <p className="leading-relaxed">
                Le règlement s'effectue à la fin de la course, en espèces ou par carte bancaire. Pour les courses conventionnées, la prise en charge par l'Assurance Maladie est effectuée sur présentation d'une prescription médicale de transport valide.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Responsabilité</h2>
              <p className="leading-relaxed">
                Taxi VSL Île-de-France est couvert par une assurance responsabilité civile professionnelle. Notre responsabilité ne saurait être engagée en cas de force majeure, conditions météorologiques exceptionnelles, ou événements indépendants de notre volonté entraînant un retard ou une impossibilité de service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Droit applicable</h2>
              <p className="leading-relaxed">
                Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux compétents de Paris seront saisis.
              </p>
            </section>

            <p className="text-sm text-gray-500 pt-4 border-t border-gray-100">
              Dernière mise à jour : mai 2026
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
