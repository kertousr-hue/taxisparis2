import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu, X, Phone, Mail,
  Home, CalendarCheck, MapPin, TrainFront, Users, BookOpen, ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

const menuItems = [
  { id: '/',                         label: 'Accueil',      Icon: Home },
  { id: '/reservation-taxi-vsl/',    label: 'Réservation',  Icon: CalendarCheck },
  { id: '/zones-desservies/',        label: 'Zones',        Icon: MapPin },
  { id: '/taxis-gares-parisiennes/', label: 'Gares',        Icon: TrainFront },
  { id: '/qui-sommes-nous/',         label: 'À propos',     Icon: Users },
  { id: '/blog/',                    label: 'Blog',         Icon: BookOpen },
];

export default function Header({ onNavigate }: HeaderProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (id: string) => location.pathname === id;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">

      {/* ── Topbar — masquée sur mobile, visible dès sm ───────────── */}
      <div className="hidden sm:block bg-blue-700 text-white">
        <div className="container mx-auto px-4 h-9 flex justify-end items-center gap-4 text-sm">
          <a
            href="tel:+33650366491"
            className="flex items-center gap-1.5 font-semibold hover:text-blue-200 transition-colors"
            aria-label="Appeler le 06 50 36 64 91"
          >
            <Phone size={13} aria-hidden="true" />
            06 50 36 64 91
          </a>
          <span className="text-blue-500" aria-hidden="true">|</span>
          <a
            href="mailto:contact@taxisparis-conventionnes.fr"
            className="flex items-center gap-1.5 font-semibold hover:text-blue-200 transition-colors"
            aria-label="Envoyer un email"
          >
            <Mail size={13} aria-hidden="true" />
            contact@taxisparis-conventionnes.fr
          </a>
        </div>
      </div>

      {/* ── Main bar ──────────────────────────────────────────────── */}
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-18 gap-2 sm:gap-3">

          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            aria-label="Retour à l'accueil"
          >
            <img
              src="/taxi-logopng.png"
              alt=""
              className="h-9 sm:h-13 w-auto"
            />
          </Link>

          {/* ── Desktop nav ────────────────────────────────────────── */}
          <nav
            className="hidden md:flex items-center gap-1.5 lg:gap-2"
            role="navigation"
            aria-label="Navigation principale"
          >
            {menuItems.map(({ id, label, Icon }) => (
              <Link
                key={id}
                to={id}
                aria-label={`Aller à ${label}`}
                aria-current={isActive(id) ? 'page' : undefined}
                className={[
                  'inline-flex items-center gap-1.5',
                  'font-bold text-sm lg:text-[0.9rem]',
                  'border-2 rounded-xl',
                  'px-3 lg:px-3.5 py-2',
                  'whitespace-nowrap',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                  isActive(id)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-900 border-blue-300 shadow-sm hover:bg-blue-50 hover:border-blue-500 hover:shadow-md',
                ].join(' ')}
              >
                <Icon size={14} aria-hidden="true" className="flex-shrink-0" />
                {label}
              </Link>
            ))}

            {/* CTA Réserver mis en valeur */}
            <a
              href="tel:+33650366491"
              className="inline-flex items-center gap-1.5 ml-1 font-bold text-sm bg-blue-600 text-white border-2 border-blue-600 rounded-xl px-3 lg:px-3.5 py-2 whitespace-nowrap shadow-sm hover:bg-blue-700 hover:border-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              aria-label="Appeler le 06 50 36 64 91"
            >
              <Phone size={14} aria-hidden="true" />
              <span className="hidden lg:inline">06 50 36 64 91</span>
              <span className="lg:hidden">Appeler</span>
            </a>
          </nav>

          {/* ── Mobile : réserver + appel + burger ─────────────────── */}
          <div className="md:hidden flex items-center gap-1.5">
            <Link
              to="/reservation-taxi-vsl/"
              className="flex items-center gap-1 bg-white text-blue-600 font-bold text-xs border-2 border-blue-500 rounded-xl px-2.5 h-10 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
              aria-label="Réserver un taxi"
            >
              <ArrowRight size={13} aria-hidden="true" />
              Réserver
            </Link>
            <a
              href="tel:+33650366491"
              className="flex items-center gap-1 bg-blue-600 text-white font-bold text-xs rounded-xl px-2.5 h-10 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
              aria-label="Appeler le 06 50 36 64 91"
            >
              <Phone size={13} aria-hidden="true" />
              Appeler
            </a>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              {isMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────── */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-gray-50">
          <nav
            id="mobile-menu"
            className="container mx-auto px-4 py-3 grid grid-cols-2 gap-2"
            role="navigation"
            aria-label="Menu mobile"
          >
            {menuItems.map(({ id, label, Icon }) => (
              <Link
                key={id}
                to={id}
                onClick={() => setIsMenuOpen(false)}
                aria-label={`Aller à ${label}`}
                aria-current={isActive(id) ? 'page' : undefined}
                className={[
                  'flex items-center gap-2',
                  'font-bold text-sm',
                  'border-2 rounded-xl px-3 py-3',
                  'min-h-[48px]',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isActive(id)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-900 border-blue-300 shadow-sm hover:bg-blue-50 hover:border-blue-500',
                ].join(' ')}
              >
                <Icon size={15} aria-hidden="true" className="flex-shrink-0" />
                {label}
              </Link>
            ))}

            {/* Bloc appel pleine largeur en bas du menu mobile */}
            <a
              href="tel:+33650366491"
              className="col-span-2 flex items-center justify-center gap-2 font-bold text-sm bg-blue-600 text-white border-2 border-blue-600 rounded-xl px-3 py-3 min-h-[48px] shadow-md hover:bg-blue-700 transition-colors"
              aria-label="Appeler le 06 50 36 64 91"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={16} aria-hidden="true" />
              Appeler maintenant – 06 50 36 64 91
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
