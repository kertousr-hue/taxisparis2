import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps = {}) {
  return (
    <footer className="bg-gray-900 text-white mt-20" role="contentinfo">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-400" id="footer-title">Taxi VSL</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Service de taxi conventionné en Île-de-France. Disponible 24h/24, 7j/7.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-blue-400 text-base">Contact</h4>
            <div className="space-y-2">
              <a href="tel:+33650366491" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-2 px-1 min-h-[44px] text-sm sm:text-base" aria-label="Appeler le 06 50 36 64 91">
                <Phone size={18} aria-hidden="true" />
                <span>06 50 36 64 91</span>
              </a>
              <a href="mailto:contact@taxisparis-conventionnes.fr" className="flex items-start gap-2 text-gray-400 hover:text-white transition-colors py-2 px-1 min-h-[44px] text-sm sm:text-base" aria-label="Envoyer un email">
                <Mail size={18} aria-hidden="true" className="mt-0.5" />
                <span className="break-all">contact@taxisparis-conventionnes.fr</span>
              </a>
              <div className="flex items-start gap-2 text-gray-400 py-2 px-1 text-sm sm:text-base">
                <MapPin size={18} aria-hidden="true" className="mt-0.5 flex-shrink-0" />
                <span>Paris, Île-de-France</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-blue-400 text-base">Zones desservies</h4>
            <nav aria-label="Zones desservies">
              <ul className="space-y-1">
                {[
                  { code: '75', name: 'Paris', path: '/taxi-conventionne-paris-75/' },
                  { code: '91', name: 'Essonne', path: '/taxi-conventionne-essonne-91/' },
                  { code: '92', name: 'Hauts-de-Seine', path: '/taxi-conventionne-hauts-de-seine-92/' },
                  { code: '93', name: 'Seine-Saint-Denis', path: '/taxi-conventionne-seine-saint-denis-93/' },
                  { code: '94', name: 'Val-de-Marne', path: '/taxi-conventionne-val-de-marne-94/' },
                ].map((dept) => (
                  <li key={dept.code}>
                    <Link
                      to={dept.path}
                      className="text-gray-400 hover:text-white transition-colors text-left py-1.5 px-1 min-h-[44px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 rounded block"
                      aria-label={`Voir la zone ${dept.name} (${dept.code})`}
                    >
                      {dept.name} ({dept.code})
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-blue-400 text-base">Liens utiles</h4>
            <nav aria-label="Liens utiles">
              <ul className="space-y-1">
                <li>
                  <a
                    href="/qui-sommes-nous/"
                    className="text-gray-400 hover:text-white transition-colors block py-1.5 px-1 min-h-[44px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    Qui sommes-nous ?
                  </a>
                </li>
                <li>
                  <a
                    href="/faq/"
                    className="text-gray-400 hover:text-white transition-colors block py-1.5 px-1 min-h-[44px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/blog/"
                    className="text-gray-400 hover:text-white transition-colors block py-1.5 px-1 min-h-[44px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/contact/"
                    className="text-gray-400 hover:text-white transition-colors block py-1.5 px-1 min-h-[44px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/mentions-legales/"
                    className="text-gray-400 hover:text-white transition-colors block py-1.5 px-1 min-h-[44px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    Mentions Légales
                  </a>
                </li>
                <li>
                  <a
                    href="/conditions-generales-de-vente/"
                    className="text-gray-400 hover:text-white transition-colors block py-1.5 px-1 min-h-[44px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    Conditions Générales de Vente
                  </a>
                </li>
                <li>
                  <a
                    href="/conditions-generales/"
                    className="text-gray-400 hover:text-white transition-colors block py-1.5 px-1 min-h-[44px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    Conditions Générales
                  </a>
                </li>
              </ul>
            </nav>

            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-blue-400 text-base">Suivez-nous</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Suivez-nous sur Facebook">
                  <Facebook size={20} aria-hidden="true" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Suivez-nous sur Twitter">
                  <Twitter size={20} aria-hidden="true" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Suivez-nous sur LinkedIn">
                  <Linkedin size={20} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Taxi VSL Île-de-France. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
