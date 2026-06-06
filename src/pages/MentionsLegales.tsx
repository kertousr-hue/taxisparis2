import SEOHead from '../components/SEOHead';

export default function MentionsLegales() {
  return (
    <>
      <SEOHead
        title="Mentions Légales | Taxi VSL Île-de-France"
        description="Mentions légales de Taxi VSL Île-de-France. Informations sur l'éditeur, l'hébergement et les responsabilités."
        canonical="https://www.taxisparis-conventionnes.fr/mentions-legales/"
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8 text-gray-700">

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Éditeur du site</h2>
              <p className="leading-relaxed">
                Le présent site est édité par :<br /><br />
                <strong>Taxi VSL Île-de-France</strong><br />
                Siège social : Paris, Île-de-France<br />
                Téléphone : <a href="tel:+33650366491" className="text-blue-600 hover:underline">06 50 36 64 91</a><br />
                Email : <a href="mailto:contact@taxisparis-conventionnes.fr" className="text-blue-600 hover:underline">contact@taxisparis-conventionnes.fr</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Directeur de la publication</h2>
              <p className="leading-relaxed">
                Le directeur de la publication est le représentant légal de la société Taxi VSL Île-de-France.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Hébergement</h2>
              <p className="leading-relaxed">
                Ce site est hébergé par :<br /><br />
                <strong>OVH SAS</strong><br />
                2 rue Kellermann – 59100 Roubaix – France<br />
                Téléphone : 1007<br />
                <a href="https://www.ovh.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.ovh.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Propriété intellectuelle</h2>
              <p className="leading-relaxed">
                L'ensemble des contenus présents sur ce site (textes, images, graphismes, logos) est la propriété exclusive de Taxi VSL Île-de-France, sauf mentions contraires. Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Données personnelles</h2>
              <p className="leading-relaxed">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@taxisparis-conventionnes.fr" className="text-blue-600 hover:underline">contact@taxisparis-conventionnes.fr</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Cookies</h2>
              <p className="leading-relaxed">
                Ce site utilise des cookies à des fins d'analyse d'audience (Google Analytics). Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation de responsabilité</h2>
              <p className="leading-relaxed">
                Taxi VSL Île-de-France s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, nous déclinons toute responsabilité pour les erreurs ou omissions dans le contenu du site, ainsi que pour tout dommage résultant de l'utilisation de ce site.
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
