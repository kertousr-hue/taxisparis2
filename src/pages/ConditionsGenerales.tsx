import SEOHead from '../components/SEOHead';

export default function ConditionsGenerales() {
  return (
    <>
      <SEOHead
        title="Conditions Générales d'Utilisation | Taxi VSL Île-de-France"
        description="Conditions générales d'utilisation du site Taxi VSL Île-de-France. Accès au site, responsabilités et protection des données."
        canonical="https://www.taxisparis-conventionnes.fr/conditions-generales/"
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions Générales d'Utilisation</h1>

          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8 text-gray-700">

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptation des conditions</h2>
              <p className="leading-relaxed">
                L'accès et l'utilisation du site <strong>taxisparis-conventionnes.fr</strong> impliquent l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Accès au site</h2>
              <p className="leading-relaxed">
                Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Taxi VSL Île-de-France se réserve le droit de modifier, suspendre ou interrompre l'accès au site à tout moment, sans préavis ni indemnité.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Utilisation du site</h2>
              <p className="leading-relaxed">
                L'utilisateur s'engage à utiliser ce site conformément aux lois en vigueur et aux présentes CGU. Il est notamment interdit de :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 leading-relaxed">
                <li>Diffuser des contenus illicites, offensants ou contraires à l'ordre public</li>
                <li>Tenter d'accéder de manière non autorisée aux systèmes informatiques</li>
                <li>Utiliser le site à des fins commerciales sans autorisation préalable</li>
                <li>Reproduire ou copier les contenus sans accord écrit</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Formulaires et données collectées</h2>
              <p className="leading-relaxed">
                Les formulaires présents sur ce site (réservation, contact) collectent des données personnelles nécessaires au traitement de vos demandes (nom, prénom, téléphone, adresse, email). Ces données sont traitées conformément au RGPD et à notre politique de confidentialité. Elles ne sont pas transmises à des tiers à des fins commerciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Liens hypertextes</h2>
              <p className="leading-relaxed">
                Ce site peut contenir des liens vers des sites tiers. Taxi VSL Île-de-France n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leur disponibilité.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Protection des données personnelles</h2>
              <p className="leading-relaxed">
                Conformément au RGPD, vous disposez des droits suivants sur vos données :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 leading-relaxed">
                <li>Droit d'accès et de rectification</li>
                <li>Droit à l'effacement (droit à l'oubli)</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
              <p className="leading-relaxed mt-2">
                Pour exercer ces droits : <a href="mailto:contact@taxisparis-conventionnes.fr" className="text-blue-600 hover:underline">contact@taxisparis-conventionnes.fr</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Droit applicable</h2>
              <p className="leading-relaxed">
                Les présentes CGU sont soumises au droit français. Tout litige relatif à l'interprétation ou l'exécution des présentes sera soumis aux tribunaux compétents de Paris.
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
