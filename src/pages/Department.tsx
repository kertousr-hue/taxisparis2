import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Calendar, CheckCircle, Clock, Shield, ArrowRight, HelpCircle, Stethoscope } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { departmentsSEO, generateBreadcrumbList, generateJsonLD } from '../utils/seoData';
import citiesData from '../data/cities.json';

interface DepartmentPageProps {
  department: string;
  onNavigate: (page: string) => void;
}

const services = [
  'Transport vers hôpitaux et cliniques',
  'Consultations médicales spécialisées',
  'Dialyse et chimiothérapie',
  'Transport ALD (Affections Longue Durée)',
  'Chirurgie ambulatoire',
  'Radiothérapie et traitements'
];

const PREPOSITION: Record<string, string> = {
  '75': 'à',
  '91': 'en',
  '92': 'dans les',
  '93': 'en',
  '94': 'dans le',
};

interface City {
  name: string;
  postalCode: string;
  slug: string;
}

interface DepartmentData {
  code: string;
  name: string;
  slug: string;
  cities: City[];
}

export default function DepartmentPage({ department, onNavigate }: DepartmentPageProps) {
  const deptData = citiesData.departments.find(d => d.code === department) as DepartmentData | undefined;
  const seo = departmentsSEO[department];

  if (!deptData || !seo) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Département non trouvé</h1>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const topCities = deptData.cities.slice(0, 10);
  const remainingCities = deptData.cities.slice(10);
  const prep = PREPOSITION[department] || 'en';

  const jsonLD = [
    generateJsonLD(department),
    generateBreadcrumbList([
      { name: 'Accueil', url: '/' },
      { name: `Taxi VSL ${deptData.name}`, url: `/${deptData.slug}/` }
    ])
  ];

  return (
    <div className="relative">
      <div className="relative z-10 bg-gray-50">
        <SEOHead
          title={seo.metaTitle}
          description={seo.metaDescription}
          keywords={seo.keywords}
          jsonLD={jsonLD}
        />

        <section className="relative min-h-[500px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {seo.h1}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                {seo.metaDescription}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/reservation-taxi-vsl/"
                  className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
                >
                  <Calendar size={20} aria-hidden="true" />
                  Réserver maintenant
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} aria-hidden="true" />
                </Link>
                <a
                  href="tel:+33650366491"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all inline-flex items-center gap-2"
                >
                  <Phone size={20} aria-hidden="true" />
                  06 50 36 64 91
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
        </section>

        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
                  <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="text-blue-600" size={28} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Agréé CPAM</h3>
                  <p className="text-sm text-gray-600">Transport 100% remboursé sur prescription</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
                  <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="text-orange-500" size={28} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Disponible 24h/24</h3>
                  <p className="text-sm text-gray-600">7j/7, jours fériés compris</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
                  <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="text-green-600" size={28} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Porte à porte</h3>
                  <p className="text-sm text-gray-600">Prise en charge à domicile</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {seo.uniqueParagraph}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                      <Stethoscope className="text-white" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Hôpitaux desservis</h2>
                  </div>
                  <ul className="space-y-3">
                    {seo.hospitals.map((hospital, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                        <span className="text-sm font-medium">{hospital}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                      <Shield className="text-white" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Nos services</h2>
                  </div>
                  <ul className="space-y-3">
                    {services.map((service, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                        <span className="font-medium">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  Villes desservies {prep} {deptData.name} ({department})
                </h2>
                <p className="text-gray-600 mb-6 text-center text-sm">
                  Cliquez sur votre ville pour plus d'informations sur nos services de taxi VSL conventionné
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {topCities.map((city, index) => (
                    <Link
                      key={index}
                      to={`/${deptData.slug}/${city.slug}/`}
                      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-gray-700 px-4 py-3 rounded-lg transition-all border border-blue-200 hover:border-blue-600 group"
                    >
                      <MapPin size={14} className="flex-shrink-0 text-blue-600 group-hover:text-white" />
                      <span className="text-sm font-medium truncate">{city.name}</span>
                    </Link>
                  ))}
                </div>
                {remainingCities.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {remainingCities.map((city, index) => (
                      <Link
                        key={index}
                        to={`/${deptData.slug}/${city.slug}/`}
                        className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-3 rounded-lg transition-all border border-gray-200 group"
                      >
                        <MapPin size={14} className="flex-shrink-0 text-gray-400 group-hover:text-blue-500" />
                        <span className="text-sm truncate">{city.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                    <HelpCircle className="text-white" size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Questions fréquentes – Taxi conventionné {prep} {deptData.name}
                  </h2>
                </div>
                <div className="space-y-6">
                  {seo.faq.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        {item.q}
                      </h3>
                      <p className="text-gray-600 leading-relaxed pl-8">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Départements voisins
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {citiesData.departments
                    .filter(d => d.code !== department)
                    .map(dept => (
                      <Link
                        key={dept.code}
                        to={`/${dept.slug}`}
                        className="inline-flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium"
                      >
                        <ArrowRight size={16} />
                        {dept.name} ({dept.code})
                      </Link>
                    ))}
                </div>
              </div>

              {department === '91' && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Notre localisation en Essonne
                  </h2>
                  <div className="w-full rounded-lg overflow-hidden shadow-md">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29813.101969137475!2d2.3407840008219627!3d48.66473972389701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671a730b6ef99%3A0x60e690c6ca8686ce!2zdGF4aSB2c2wgY29udmVudGlvbm7DqSBhZ3LDqcOpIHPDqWN1cml0w6kgc29jaWFsZQ!5e0!3m2!1sfr!2sfr!4v1776620517246!5m2!1sfr!2sfr"
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localisation Google Maps - Taxi VSL Conventionné Essonne"
                    />
                  </div>
                </div>
              )}

              {department === '94' && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Notre localisation dans le Val-de-Marne
                  </h2>
                  <div className="w-full rounded-lg overflow-hidden shadow-md">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d168280.9689252091!2d2.297381289452775!3d48.77444161404638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e67b94662e87b3%3A0x35f4c18f7871832e!2staxi%20%26%20vsl%20conventionn%C3%A9!5e0!3m2!1sfr!2sfr!4v1764499643238!5m2!1sfr!2sfr"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localisation Google Maps - Taxi VSL Conventionné Val-de-Marne"
                    />
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg p-8 text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Besoin d'un transport médical {prep} {deptData.name} ?
                </h2>
                <p className="text-xl mb-6 text-blue-100">
                  Réservez dès maintenant votre transport conventionné CPAM
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/reservation-taxi-vsl/"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2"
                  >
                    <Calendar size={20} />
                    Réserver en ligne
                  </Link>
                  <a
                    href="tel:+33650366491"
                    className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition inline-flex items-center gap-2"
                  >
                    <Phone size={20} />
                    06 50 36 64 91
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Phone className="text-blue-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Téléphone</h3>
                      <a href="tel:+33650366491" className="text-blue-600 hover:underline">
                        06 50 36 64 91
                      </a>
                      <p className="text-sm text-gray-600">Disponible 24h/24</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="text-blue-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                      <a href="mailto:contact@taxisparis-conventionnes.fr" className="text-blue-600 hover:underline">
                        contact@taxisparis-conventionnes.fr
                      </a>
                      <p className="text-sm text-gray-600">Réponse sous 24h</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Zone</h3>
                      <p className="text-gray-700">{deptData.name} ({deptData.code})</p>
                      <p className="text-sm text-gray-600">Île-de-France</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
