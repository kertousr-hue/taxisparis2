import { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Clock, Users, Luggage, Phone, Mail, CheckCircle, Gauge, Timer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AutocompleteInput from '../components/AutocompleteInput';
import { calculateRoute } from '../utils/here';
import SEOHead from '../components/SEOHead';

interface AirportTransferFormData {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse_depart: string;
  adresse_arrivee: string;
  date_trajet: string;
  heure_trajet: string;
  numero_vol?: string;
  nombre_passagers: number;
  nombre_bagages: number;
  distance_km?: number;
  duree_minutes?: number;
  informations_supplementaires?: string;
}

export default function AirportTransfer() {
  const [formData, setFormData] = useState<AirportTransferFormData>({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse_depart: '',
    adresse_arrivee: '',
    date_trajet: '',
    heure_trajet: '',
    numero_vol: '',
    nombre_passagers: 1,
    nombre_bagages: 1,
    informations_supplementaires: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [distance, setDistance] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [coordsDepart, setCoordsDepart] = useState<{lat: number, lng: number} | null>(null);
  const [coordsArrivee, setCoordsArrivee] = useState<{lat: number, lng: number} | null>(null);

  const apiKey = import.meta.env.VITE_HERE_API_KEY;

  useEffect(() => {
    const calculateDistance = async () => {
      if (coordsDepart && coordsArrivee) {
        setIsCalculating(true);
        setError('');

        try {
          const result = await calculateRoute(
            coordsDepart.lat,
            coordsDepart.lng,
            coordsArrivee.lat,
            coordsArrivee.lng,
            apiKey,
            formData.date_trajet,
            formData.heure_trajet
          );

          if (result) {
            setDistance(result.distance_km);
            setDurationMinutes(result.duree_minutes);
          } else {
            setError('Impossible de calculer la distance');
          }
        } catch (err) {
          console.error('Error calculating distance:', err);
          setError('Erreur lors du calcul de distance');
        } finally {
          setIsCalculating(false);
        }
      }
    };

    const timeoutId = setTimeout(calculateDistance, 500);
    return () => clearTimeout(timeoutId);
  }, [coordsDepart, coordsArrivee, apiKey, formData.date_trajet, formData.heure_trajet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const emailData = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        email: formData.email,
        adresse_depart: formData.adresse_depart,
        adresse_arrivee: formData.adresse_arrivee,
        date_rdv: formData.date_trajet,
        heure_rdv: formData.heure_trajet,
        nombre_passagers: formData.nombre_passagers,
        nombre_bagages: formData.nombre_bagages,
        numero_vol: formData.numero_vol || '',
        numero_train: '',
        distance_km: distance || 0,
        duree_min: durationMinutes || 0,
        message: formData.informations_supplementaires || '',
        type_trajet: 'aeroport',
      };

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-reservation-email`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la réservation');
      }

      setSubmitSuccess(true);
      setFormData({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        adresse_depart: '',
        adresse_arrivee: '',
        date_trajet: '',
        heure_trajet: '',
        numero_vol: '',
        nombre_passagers: 1,
        nombre_bagages: 1,
        informations_supplementaires: ''
      });
      setCoordsDepart(null);
      setCoordsArrivee(null);
      setDistance(null);
      setDurationMinutes(null);

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting airport transfer:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Transfert Aéroport - Taxi VSL Paris",
    "description": "Réservez votre transfert vers les aéroports de Paris (CDG, Orly, Beauvais). Service disponible 24/7.",
    "url": "https://www.taxisparis-conventionnes.fr/taxis-aeroports-parisiens"
  };

  return (
    <>
      <SEOHead
        title="Transfert Aéroport Paris | Taxi CDG, Orly, Beauvais - 24/7"
        description="Transfert taxi et VSL vers les aéroports de Paris : Charles de Gaulle (CDG), Orly et Beauvais. Réservation en ligne, tarifs forfaitaires, service 24h/24."
        keywords={["taxi aéroport CDG", "transfert Orly", "taxi Beauvais", "navette aéroport Paris", "transport aéroport Roissy"]}
        canonical="https://www.taxisparis-conventionnes.fr/taxis-aeroports-parisiens"
        jsonLD={jsonLD}
      />
      <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Plane className="text-blue-600" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Transfert Gare et Aéroport
            </h1>
            <p className="text-lg text-gray-600">
              Réservez votre transfert vers les gares et aéroports
            </p>
          </div>

          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-semibold text-green-800">Votre réservation a bien été envoyée.</p>
                <p className="text-sm text-green-700">Nous vous contacterons rapidement.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Forfaits Taxis Parisiens vers les Aéroports
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              Les tarifs forfaitaires réglementés pour les taxis parisiens varient selon la zone de départ (rive droite ou rive gauche de la Seine)
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="text-blue-600" size={24} />
                  Rive Droite
                </h3>
                <p className="text-sm text-gray-600 mb-4">Arrondissements: 1er, 2e, 3e, 4e, 8e, 9e, 10e, 11e, 12e, 16e, 17e, 18e, 19e, 20e</p>

                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Plane className="text-blue-600" size={24} />
                      <div>
                        <p className="font-semibold text-gray-800">CDG</p>
                        <p className="text-xs text-gray-500">Charles de Gaulle</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">56€</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Plane className="text-blue-600" size={24} />
                      <div>
                        <p className="font-semibold text-gray-800">Orly</p>
                        <p className="text-xs text-gray-500">Aéroport d'Orly</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">45€</p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="text-green-600" size={24} />
                  Rive Gauche
                </h3>
                <p className="text-sm text-gray-600 mb-4">Arrondissements: 5e, 6e, 7e, 13e, 14e, 15e</p>

                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Plane className="text-green-600" size={24} />
                      <div>
                        <p className="font-semibold text-gray-800">CDG</p>
                        <p className="text-xs text-gray-500">Charles de Gaulle</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-600">65€</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Plane className="text-green-600" size={24} />
                      <div>
                        <p className="font-semibold text-gray-800">Orly</p>
                        <p className="text-xs text-gray-500">Aéroport d'Orly</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-600">36€</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Plane className="text-gray-600" size={20} />
                Autres destinations
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Beauvais-Tillé:</strong> Pas de forfait - Prix au compteur (environ 120-150€)</p>
                <p><strong>Le Bourget:</strong> Pas de forfait - Prix au compteur</p>
                <p className="mt-4 pt-4 border-t border-gray-300 text-xs">
                  <strong>Note:</strong> Ces forfaits sont réglementés et incluent tous les frais. Les suppléments (bagages, 5e passager, etc.) restent applicables selon la réglementation en vigueur.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <AutocompleteInput
                label="Adresse de départ"
                value={formData.adresse_depart}
                placeholder="Ex: Aéroport Charles de Gaulle, Roissy"
                required
                apiKey={apiKey}
                onAddressSelect={(address, lat, lng) => {
                  setFormData(prev => ({ ...prev, adresse_depart: address }));
                  setCoordsDepart({ lat, lng });
                }}
                onInputChange={(value) => {
                  setFormData(prev => ({ ...prev, adresse_depart: value }));
                  setCoordsDepart(null);
                }}
                isValidated={coordsDepart !== null}
              />

              <AutocompleteInput
                label="Adresse d'arrivée"
                value={formData.adresse_arrivee}
                placeholder="Ex: 10 Rue de Rivoli, Paris"
                required
                apiKey={apiKey}
                onAddressSelect={(address, lat, lng) => {
                  setFormData(prev => ({ ...prev, adresse_arrivee: address }));
                  setCoordsArrivee({ lat, lng });
                }}
                onInputChange={(value) => {
                  setFormData(prev => ({ ...prev, adresse_arrivee: value }));
                  setCoordsArrivee(null);
                }}
                isValidated={coordsArrivee !== null}
              />
            </div>

            {distance !== null && durationMinutes !== null && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Gauge className="text-orange-600" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Informations du trajet</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 flex flex-col items-center text-center">
                    <div className="bg-blue-500 p-2 rounded-lg mb-2">
                      <Gauge className="text-white" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mb-1">{distance} km</p>
                    <p className="text-xs text-gray-600">Distance réelle</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200 flex flex-col items-center text-center">
                    <div className="bg-orange-500 p-2 rounded-lg mb-2">
                      <Timer className="text-white" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mb-1">{durationMinutes} min</p>
                    <p className="text-xs text-gray-600">Durée estimée</p>
                  </div>
                </div>
              </div>
            )}

            {isCalculating && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-600">
                Calcul de l'itinéraire en cours...
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Date du trajet *
                </label>
                <input
                  type="date"
                  name="date_trajet"
                  value={formData.date_trajet}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline mr-2" size={16} />
                  Heure du trajet *
                </label>
                <input
                  type="time"
                  name="heure_trajet"
                  value={formData.heure_trajet}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de vol
              </label>
              <input
                type="text"
                name="numero_vol"
                value={formData.numero_vol}
                onChange={handleChange}
                placeholder="Ex: AF1234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline mr-2" size={16} />
                  Nombre de passagers *
                </label>
                <input
                  type="number"
                  name="nombre_passagers"
                  value={formData.nombre_passagers}
                  onChange={handleChange}
                  required
                  min="1"
                  max="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Luggage className="inline mr-2" size={16} />
                  Nombre de bagages *
                </label>
                <input
                  type="number"
                  name="nombre_bagages"
                  value={formData.nombre_bagages}
                  onChange={handleChange}
                  required
                  min="0"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informations supplémentaires
              </label>
              <textarea
                name="informations_supplementaires"
                value={formData.informations_supplementaires}
                onChange={handleChange}
                rows={4}
                placeholder="Demandes particulières, besoins spéciaux..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Confirmer la réservation'}
            </button>
          </form>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Besoin d'aide ?</h3>
            <p className="text-blue-800 mb-4">
              Notre équipe est disponible 24h/24 pour répondre à vos questions.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+33650366491"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Phone size={18} />
                06 50 36 64 91
              </a>
              <a
                href="mailto:contact@taxisparis-conventionnes.fr"
                className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                <Mail size={18} />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
