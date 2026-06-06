import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Clock, Shield, Star, MapPin, CheckCircle, Phone, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { supabase } from '../lib/supabase';
import { generateJsonLD } from '../utils/seoData';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [homeLogoUrl, setHomeLogoUrl] = useState('');

  useEffect(() => {
    if (!supabase) return;

    const fetchHomeLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'home_logo')
          .maybeSingle();

        if (!error && data) {
          setHomeLogoUrl(data.value || '');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du logo d\'accueil:', err);
      }
    };

    fetchHomeLogo();

    const subscription = supabase
      .channel('home_logo_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'key=eq.home_logo',
        },
        (payload) => {
          if (payload.new && 'value' in payload.new) {
            setHomeLogoUrl((payload.new as { value: string }).value || '');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <SEOHead
        title="Taxi conventionne CPAM & VSL Paris Ile-de-France | Reservation 24h/24"
        description="Taxi conventionne CPAM et VSL a Paris et en Ile-de-France (75, 91, 92, 93, 94). Transport medical assis sur prescription vers consultations, dialyse, chimiotherapie, radiotherapie et hospitalisations. Reservation 24h/24, 7j/7."
        jsonLD={[generateJsonLD()]}
      />

      <div className="relative">
        <section className="relative flex items-center py-10 sm:py-20 sm:min-h-[600px] overflow-hidden" aria-label="Bannière principale">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600" aria-hidden="true" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />

          <div className="container mx-auto px-4 relative z-10 w-full">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-block mb-4 sm:mb-6 px-4 sm:px-6 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-xs sm:text-sm font-medium">Service disponible 24h/24, 7j/7</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 leading-tight">
                Taxi Conventionné &amp; VSL à Paris et en Île-de-France
              </h1>

              <p className="text-sm sm:text-lg md:text-xl mb-5 sm:mb-10 text-white/90 leading-relaxed max-w-3xl mx-auto">
                <span className="sm:hidden">Transport médical agréé CPAM — Paris, 91, 92, 93, 94. Remboursé sur prescription.</span>
                <span className="hidden sm:inline">Transport médical assis agréé Sécurité sociale pour tous les rendez-vous médicaux : consultations, dialyse, chimiothérapie, radiothérapie et hospitalisations. Intervention rapide sur Paris (75), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93) et Val-de-Marne (94).</span>
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                <Link
                  to="/reservation-taxi-vsl/"
                  className="group w-full sm:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 min-h-[48px]"
                  aria-label="Réserver un taxi VSL maintenant"
                >
                  Réserver maintenant
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} aria-hidden="true" />
                </Link>

                <a
                  href="tel:0650366491"
                  className="w-full sm:w-auto bg-white/15 backdrop-blur-sm border-2 border-white text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-white/50 min-h-[48px]"
                  aria-label="Appeler le 06 50 36 64 91"
                >
                  <Phone size={18} aria-hidden="true" />
                  06 50 36 64 91
                </a>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-gray-50 to-transparent" aria-hidden="true" />

        </section>

        <section className="py-12 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4 leading-tight">
                Transport médical en Taxi Conventionné &amp; VSL
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Des solutions fiables et confortables pour vos déplacements de santé en Île-de-France.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Car className="text-blue-500" size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Taxi Conventionné</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Véhicules agréés CPAM pour tous vos déplacements médicaux sur prescription.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Shield className="text-blue-500" size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Prise en Charge CPAM</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Tiers payant disponible. Nous gérons directement avec votre caisse d'assurance maladie.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Clock className="text-blue-500" size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Disponible 24/7</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Service d'urgence et rendez-vous programmés. Nous sommes là quand vous avez besoin de nous.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Star className="text-blue-500" size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Chauffeurs Formés</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Professionnels expérimentés dans le transport médical, à votre écoute et bienveillants.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
                Nos Services de Transport Médical
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Un service complet pour tous vos besoins de déplacements médicaux
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-blue-500 flex-shrink-0" size={24} />
                  <h3 className="text-lg font-bold text-gray-800">Consultations Médicales</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Transport vers vos rendez-vous médicaux, examens de routine, consultations spécialisées.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-blue-500 flex-shrink-0" size={24} />
                  <h3 className="text-lg font-bold text-gray-800">Dialyse</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Trajets réguliers vers votre centre de dialyse avec ponctualité et confort garantis.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-blue-500 flex-shrink-0" size={24} />
                  <h3 className="text-lg font-bold text-gray-800">Chimiothérapie</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Transport adapté et sécurisé pour vos séances de chimiothérapie en toute sérénité.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-blue-500 flex-shrink-0" size={24} />
                  <h3 className="text-lg font-bold text-gray-800">Radiothérapie</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Accompagnement régulier pour vos séances de radiothérapie avec respect et discrétion.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-blue-500 flex-shrink-0" size={24} />
                  <h3 className="text-lg font-bold text-gray-800">Hospitalisations</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Transport sécurisé pour vos admissions, sorties d'hôpital et transferts entre établissements.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-blue-500 flex-shrink-0" size={24} />
                  <h3 className="text-lg font-bold text-gray-800">Examens & Analyses</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Déplacements pour vos examens médicaux, IRM, scanner, radiographies et prises de sang.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
                Pourquoi Choisir Notre Service ?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Des garanties solides pour votre tranquillité d'esprit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-blue-500 mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Agrément CPAM</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Nos véhicules et chauffeurs sont agréés par l'Assurance Maladie pour le transport médical conventionné.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-blue-500 mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Ponctualité Garantie</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Nous comprenons l'importance de vos rendez-vous médicaux. Arrivée à l'heure à chaque fois.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-blue-500 mb-4">
                  <Star size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Véhicules Confortables</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Flotte récente, climatisée et régulièrement entretenue pour votre confort et sécurité.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-blue-500 mb-4">
                  <MapPin size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Couverture Complète</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Service disponible sur 193 villes d'Île-de-France : Paris (75), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94).
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-blue-500 mb-4">
                  <Clock size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Disponibilité 24/7</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Réservation et service d'urgence 24 heures sur 24, 7 jours sur 7, week-ends et jours fériés inclus.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-blue-500 mb-4">
                  <Phone size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Réservation Simple</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Réservez en ligne ou par téléphone. Confirmation immédiate et suivi en temps réel de votre course.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
                193 Villes Desservies en Île-de-France
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Une couverture complète pour votre tranquillité
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Link
                to="/taxi-conventionne-paris-75/"
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-xl transition-all group"
              >
                <MapPin className="mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-xl font-bold mb-2">Paris (75)</h3>
                <p className="text-sm text-blue-100 mb-3">20 arrondissements</p>
                <span className="text-sm font-medium flex items-center justify-center gap-2">
                  Voir les arrondissements
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                to="/taxi-conventionne-essonne-91/"
                className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-xl transition-all group"
              >
                <MapPin className="mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-xl font-bold mb-2">Essonne (91)</h3>
                <p className="text-sm text-green-100 mb-3">50 villes</p>
                <span className="text-sm font-medium flex items-center justify-center gap-2">
                  Voir les villes
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                to="/taxi-conventionne-hauts-de-seine-92/"
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-xl transition-all group"
              >
                <MapPin className="mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-xl font-bold mb-2">Hauts-de-Seine (92)</h3>
                <p className="text-sm text-purple-100 mb-3">36 communes</p>
                <span className="text-sm font-medium flex items-center justify-center gap-2">
                  Voir les communes
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                to="/taxi-conventionne-seine-saint-denis-93/"
                className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl hover:shadow-xl transition-all group"
              >
                <MapPin className="mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-xl font-bold mb-2">Seine-Saint-Denis (93)</h3>
                <p className="text-sm text-orange-100 mb-3">40 communes</p>
                <span className="text-sm font-medium flex items-center justify-center gap-2">
                  Voir les communes
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                to="/taxi-conventionne-val-de-marne-94/"
                className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl hover:shadow-xl transition-all group"
              >
                <MapPin className="mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-xl font-bold mb-2">Val-de-Marne (94)</h3>
                <p className="text-sm text-red-100 mb-3">47 communes</p>
                <span className="text-sm font-medium flex items-center justify-center gap-2">
                  Voir les communes
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            <div className="text-center mt-10">
              <Link
                to="/zones-desservies/"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <span>Voir toutes les villes desservies</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
                Questions Fréquentes
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur nos services
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              <details className="bg-white rounded-xl p-6 shadow-md group">
                <summary className="font-bold text-gray-800 cursor-pointer list-none flex items-center justify-between">
                  <span>Comment réserver un taxi conventionné ?</span>
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Vous pouvez réserver en ligne via notre formulaire de réservation ou par téléphone au 06 50 36 64 91.
                  Nous vous demanderons votre prescription médicale, votre carte Vitale et les détails de votre rendez-vous.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-md group">
                <summary className="font-bold text-gray-800 cursor-pointer list-none flex items-center justify-between">
                  <span>Quels documents dois-je fournir ?</span>
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Vous aurez besoin d'une prescription médicale de transport (ordonnance), votre carte Vitale à jour,
                  et éventuellement votre carte de mutuelle. Le chauffeur vérifiera ces documents avant le départ.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-md group">
                <summary className="font-bold text-gray-800 cursor-pointer list-none flex items-center justify-between">
                  <span>Le tiers payant est-il disponible ?</span>
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Oui, nous proposons le tiers payant. Vous n'avez pas à avancer les frais, nous nous chargeons
                  directement du remboursement avec votre caisse d'assurance maladie et votre mutuelle.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-md group">
                <summary className="font-bold text-gray-800 cursor-pointer list-none flex items-center justify-between">
                  <span>Puis-je réserver pour un proche ?</span>
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Absolument. Vous pouvez réserver un transport pour un membre de votre famille ou un proche.
                  Assurez-vous simplement d'avoir toutes les informations nécessaires (prescription, carte Vitale du patient).
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-md group">
                <summary className="font-bold text-gray-800 cursor-pointer list-none flex items-center justify-between">
                  <span>Combien de temps à l'avance dois-je réserver ?</span>
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Pour les rendez-vous programmés, nous recommandons de réserver 24 à 48 heures à l'avance.
                  Pour les urgences, nous faisons notre maximum pour intervenir dans les plus brefs délais.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 shadow-md group">
                <summary className="font-bold text-gray-800 cursor-pointer list-none flex items-center justify-between">
                  <span>Couvrez-vous les trajets vers les aéroports et gares ?</span>
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Oui, nous assurons les transferts médicaux vers tous les aéroports parisiens (CDG, Orly, Beauvais)
                  et toutes les gares (Gare du Nord, Gare de Lyon, Gare Montparnasse, etc.) dans le cadre de déplacements médicaux prescrits.
                </p>
              </details>
            </div>

            <div className="text-center mt-10">
              <Link
                to="/faq/"
                className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
              >
                <span>Voir toutes les questions</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Besoin d'un Transport Médical ?
              </h2>
              <p className="text-base sm:text-xl mb-8 sm:mb-10 text-blue-50">
                Réservez dès maintenant votre taxi conventionné ou appelez-nous pour toute question.
                Notre équipe est à votre écoute 24h/24 et 7j/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/reservation-taxi-vsl/"
                  className="bg-white text-blue-500 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Réserver en ligne</span>
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="tel:0650366491"
                  className="bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-300 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  <span>06 50 36 64 91</span>
                </a>
              </div>

              <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock size={24} />
                    <h3 className="font-bold text-lg">Disponibilité</h3>
                  </div>
                  <p className="text-blue-50">24h/24, 7j/7, jours fériés inclus</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin size={24} />
                    <h3 className="font-bold text-lg">Zone Couverte</h3>
                  </div>
                  <p className="text-blue-50">193 villes en Île-de-France</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield size={24} />
                    <h3 className="font-bold text-lg">Agréments</h3>
                  </div>
                  <p className="text-blue-50">CPAM, tiers payant disponible</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
