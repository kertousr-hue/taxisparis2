import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GoogleAnalytics from './components/GoogleAnalytics';
import Home from './pages/Home';
import Reservation from './pages/Reservation';
import Zones from './pages/Zones';
import ZoneDetail from './pages/ZoneDetail';
import Stations from './pages/Stations';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Department from './pages/Department';
import City from './pages/City';
import AirportTransfer from './pages/AirportTransfer';
import StationTransfer from './pages/StationTransfer';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import PagesManager from './pages/admin/PagesManager';
import PageEditorEnhanced from './pages/admin/PageEditorEnhanced';
import BlogManager from './pages/admin/BlogManager';
import BlogEditor from './pages/admin/BlogEditor';
import Settings from './pages/admin/Settings';
import MediaManagerEnhanced from './pages/admin/MediaManagerEnhanced';
import Analytics from './pages/admin/Analytics';
import LogoSettings from './pages/admin/LogoSettings';
import DepartmentGallery from './pages/admin/DepartmentGallery';
import FAQManager from './pages/admin/FAQManager';
import FAQ from './pages/FAQ';
import MentionsLegales from './pages/MentionsLegales';
import CGV from './pages/CGV';
import ConditionsGenerales from './pages/ConditionsGenerales';
import NotFound from './pages/NotFound';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import { supabase } from './lib/supabase';

function TrailingSlashRedirect() {
  const location = useLocation();
  const path = location.pathname;
  if (!path.endsWith('/')) {
    return <Navigate to={`${path}/${location.search}${location.hash}`} replace />;
  }
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// Composant pour remonter en haut de page à chaque changement d'URL
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [measurementId, setMeasurementId] = useState('');

  useEffect(() => {
    // On essaie de récupérer l'ID depuis l'environnement ou Supabase
    // Mais ce n'est plus bloquant car on a mis un ID par défaut dans le composant
    const envMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

    if (envMeasurementId && envMeasurementId.trim() !== '') {
      setMeasurementId(envMeasurementId);
    } else {
      const fetchAnalyticsId = async () => {
        const { data } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'google_analytics')
          .single();

        if (data?.value?.measurement_id) {
          setMeasurementId(data.value.measurement_id);
        }
      };
      fetchAnalyticsId();
    }
  }, []);

  const handleNavigate = (page: string) => {
    navigate(page);
  };

  return (
    <>
      {/* CORRECTION ICI : On affiche le composant tout le temps */}
      {/* Il utilisera l'ID G-3780TKJD8H par défaut si measurementId est vide */}
      <GoogleAnalytics measurementId={measurementId} />
      
      <ScrollToTop />

      <a href="#main-content" className="skip-to-main">
        Aller au contenu principal
      </a>
      
      <div className={`min-h-screen bg-gray-50 flex flex-col ${location.pathname === '/' ? 'app-background-home' : ''}`}>
        {!location.pathname.startsWith('/admin') && <Header onNavigate={handleNavigate} />}
        <main id="main-content" className="flex-grow" role="main">
          <Routes>
            {/* Page d'accueil */}
            <Route path="/" element={<Home onNavigate={handleNavigate} />} />

            {/* Admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/pages" element={<ProtectedRoute><PagesManager /></ProtectedRoute>} />
            <Route path="/admin/pages/:id" element={<ProtectedRoute><PageEditorEnhanced /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<ProtectedRoute><BlogManager /></ProtectedRoute>} />
            <Route path="/admin/blog/:id" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
            <Route path="/admin/department-gallery" element={<ProtectedRoute><DepartmentGallery /></ProtectedRoute>} />
            <Route path="/admin/media" element={<ProtectedRoute><MediaManagerEnhanced /></ProtectedRoute>} />
            <Route path="/admin/logo" element={<ProtectedRoute><LogoSettings /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/admin/faq" element={<ProtectedRoute><FAQManager /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Service routes – with and without trailing slash */}
            <Route path="/reservation-taxi-vsl" element={<Navigate to="/reservation-taxi-vsl/" replace />} />
            <Route path="/reservation-taxi-vsl/" element={<Reservation />} />
            <Route path="/zones-desservies" element={<Navigate to="/zones-desservies/" replace />} />
            <Route path="/zones-desservies/" element={<Zones onNavigate={handleNavigate} />} />
            <Route path="/taxis-aeroports-parisiens" element={<Navigate to="/taxis-aeroports-parisiens/" replace />} />
            <Route path="/taxis-aeroports-parisiens/" element={<AirportTransfer />} />
            <Route path="/taxis-gares-parisiennes" element={<Navigate to="/taxis-gares-parisiennes/" replace />} />
            <Route path="/taxis-gares-parisiennes/" element={<StationTransfer />} />
            <Route path="/qui-sommes-nous" element={<Navigate to="/qui-sommes-nous/" replace />} />
            <Route path="/qui-sommes-nous/" element={<About />} />
            <Route path="/blog" element={<Navigate to="/blog/" replace />} />
            <Route path="/blog/" element={<Blog onNavigate={handleNavigate} />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<Navigate to="/faq/" replace />} />
            <Route path="/faq/" element={<FAQ />} />
            <Route path="/contact" element={<Navigate to="/contact/" replace />} />
            <Route path="/contact/" element={<Contact />} />

            {/* Routes des Départements (SEO) */}
            <Route path="/taxi-conventionne-paris-75" element={<Navigate to="/taxi-conventionne-paris-75/" replace />} />
            <Route path="/taxi-conventionne-paris-75/" element={<Department department="75" onNavigate={handleNavigate} />} />
            <Route path="/taxi-conventionne-essonne-91" element={<Navigate to="/taxi-conventionne-essonne-91/" replace />} />
            <Route path="/taxi-conventionne-essonne-91/" element={<Department department="91" onNavigate={handleNavigate} />} />
            <Route path="/taxi-conventionne-hauts-de-seine-92" element={<Navigate to="/taxi-conventionne-hauts-de-seine-92/" replace />} />
            <Route path="/taxi-conventionne-hauts-de-seine-92/" element={<Department department="92" onNavigate={handleNavigate} />} />
            <Route path="/taxi-conventionne-seine-saint-denis-93" element={<Navigate to="/taxi-conventionne-seine-saint-denis-93/" replace />} />
            <Route path="/taxi-conventionne-seine-saint-denis-93/" element={<Department department="93" onNavigate={handleNavigate} />} />
            <Route path="/taxi-conventionne-val-de-marne-94" element={<Navigate to="/taxi-conventionne-val-de-marne-94/" replace />} />
            <Route path="/taxi-conventionne-val-de-marne-94/" element={<Department department="94" onNavigate={handleNavigate} />} />

            {/* ROUTE DYNAMIQUE SEO POUR LES VILLES */}
            <Route path="/:departmentSlug/:citySlug/" element={<City />} />
            <Route path="/:departmentSlug/:citySlug" element={<TrailingSlashRedirect />} />

            {/* Pages légales */}
            <Route path="/mentions-legales" element={<Navigate to="/mentions-legales/" replace />} />
            <Route path="/mentions-legales/" element={<MentionsLegales />} />
            <Route path="/conditions-generales-de-vente" element={<Navigate to="/conditions-generales-de-vente/" replace />} />
            <Route path="/conditions-generales-de-vente/" element={<CGV />} />
            <Route path="/conditions-generales" element={<Navigate to="/conditions-generales/" replace />} />
            <Route path="/conditions-generales/" element={<ConditionsGenerales />} />

            {/* Anciennes routes */}
            <Route path="/zones/:zone" element={<ZoneDetail zone="" onNavigate={handleNavigate} />} />
            <Route path="/stations" element={<Stations onNavigate={handleNavigate} />} />

            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!location.pathname.startsWith('/admin') && <Footer onNavigate={handleNavigate} />}
      </div>
    </>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <AppContent />
    </AdminAuthProvider>
  );
}

export default App;