import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('contacts')
        .insert([{
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          message: formData.message,
        }]);

      if (insertError) throw insertError;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      try {
        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: formData.nom,
            email: formData.email,
            telephone: formData.telephone,
            message: formData.message,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Email sending failed, but contact saved');
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      setSubmitSuccess(true);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        message: ''
      });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error submitting contact:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact - Taxi VSL Conventionné",
    "description": "Contactez notre équipe de taxi conventionné disponible 24/7 pour toutes vos questions.",
    "url": "https://www.taxisparis-conventionnes.fr/contact"
  };

  return (
    <>
      <SEOHead
        title="Contact - Taxi VSL Conventionné Paris | 06 50 36 64 91"
        description="Contactez notre service de taxi conventionné et VSL en Île-de-France. Disponible 24h/24, 7j/7. Téléphone: 06 50 36 64 91. Email: contact@taxisparis-conventionnes.fr"
        keywords={["contact taxi conventionné", "téléphone taxi VSL", "contact transport médical", "taxi conventionné Paris contact"]}
        canonical="https://www.taxisparis-conventionnes.fr/contact"
        jsonLD={jsonLD}
      />
      <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 id="page-title" className="text-4xl font-bold text-gray-800 mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600">
              Notre équipe est à votre écoute pour toute question
            </p>
          </div>

          {submitSuccess && (
            <div role="alert" aria-live="polite" className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} aria-hidden="true" />
              <div>
                <p className="font-semibold text-green-800">Votre message a été envoyé avec succès.</p>
                <p className="text-green-700">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations de contact</h2>

              <div className="space-y-4">
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
                    <h3 className="font-semibold text-gray-800 mb-1">Localisation</h3>
                    <p className="text-gray-700">Paris, Île-de-France</p>
                    <p className="text-sm text-gray-600">Couvre toute la région</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Envoyez-nous un message</h2>

              <div className="space-y-4">
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
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
