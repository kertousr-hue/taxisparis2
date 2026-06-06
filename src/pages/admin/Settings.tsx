import { useState, useEffect } from 'react';
import { Save, BarChart, Globe, Mail, Phone, MapPin } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    google_analytics: '',
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('settings')
      .select('*');

    if (data) {
      const settingsMap: any = {};
      data.forEach((item: any) => {
        if (item.key === 'google_analytics' && item.value?.measurement_id) {
          settingsMap.google_analytics = item.value.measurement_id;
        } else if (item.value) {
          settingsMap[item.key] = typeof item.value === 'object' ? JSON.stringify(item.value) : item.value;
        }
      });
      setSettings(prev => ({ ...prev, ...settingsMap }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const updates = [
        { key: 'google_analytics', value: { measurement_id: settings.google_analytics } },
        { key: 'site_name', value: settings.site_name },
        { key: 'site_description', value: settings.site_description },
        { key: 'contact_email', value: settings.contact_email },
        { key: 'contact_phone', value: settings.contact_phone },
        { key: 'contact_address', value: settings.contact_address },
      ];

      for (const update of updates) {
        await supabase
          .from('settings')
          .update({ value: update.value })
          .eq('key', update.key);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Paramètres</h1>

        <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Globe className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Informations du site</h2>
              <p className="text-sm text-gray-600">Nom, description et identité du site</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                placeholder="Ex: Taxi VSL Paris"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du site
              </label>
              <textarea
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                placeholder="Description générale du site..."
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Phone className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Informations de contact</h2>
              <p className="text-sm text-gray-600">Email, téléphone et adresse</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline mr-2" size={16} />
                Email de contact
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                placeholder="contact@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline mr-2" size={16} />
                Téléphone
              </label>
              <input
                type="tel"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                placeholder="01 23 45 67 89"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline mr-2" size={16} />
                Adresse
              </label>
              <textarea
                value={settings.contact_address}
                onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                placeholder="Adresse complète..."
                rows={2}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Google Analytics</h2>
              <p className="text-sm text-gray-600">Configuration du tracking analytics</p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              Paramètres enregistrés avec succès
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Measurement ID (GA4)
              </label>
              <input
                type="text"
                value={settings.google_analytics}
                onChange={(e) => setSettings({ ...settings, google_analytics: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                Trouvez votre Measurement ID dans Google Analytics 4 → Admin → Data Streams
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              <Save size={20} />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Comment configurer ?</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
              <li>Créez un compte Google Analytics sur analytics.google.com</li>
              <li>Créez une propriété GA4 pour votre site</li>
              <li>Copiez le Measurement ID (format: G-XXXXXXXXXX)</li>
              <li>Collez-le dans le champ ci-dessus et enregistrez</li>
              <li>Le tracking sera automatiquement activé sur votre site</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold text-lg"
          >
            <Save size={24} />
            {loading ? 'Enregistrement en cours...' : 'Enregistrer tous les paramètres'}
          </button>
        </div>
        </div>
      </div>
    </AdminLayout>
  );
}
