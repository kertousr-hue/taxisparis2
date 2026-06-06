import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import MediaPicker from '../../components/admin/MediaPicker';

export default function LogoSettings() {
  const [logoUrl, setLogoUrl] = useState('');
  const [homeLogoUrl, setHomeLogoUrl] = useState('');
  const [initialLogoUrl, setInitialLogoUrl] = useState('');
  const [initialHomeLogoUrl, setInitialHomeLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showHomeMediaPicker, setShowHomeMediaPicker] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchLogo();
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(
      logoUrl !== initialLogoUrl || homeLogoUrl !== initialHomeLogoUrl
    );
  }, [logoUrl, homeLogoUrl, initialLogoUrl, initialHomeLogoUrl]);

  const fetchLogo = async () => {
    try {
      const { data: logos, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['site_logo', 'home_logo']);

      if (error) throw error;

      logos?.forEach(item => {
        if (item.key === 'site_logo') {
          setLogoUrl(item.value || '');
          setInitialLogoUrl(item.value || '');
        } else if (item.key === 'home_logo') {
          setHomeLogoUrl(item.value || '');
          setInitialHomeLogoUrl(item.value || '');
        }
      });
    } catch (error) {
      console.error('Erreur lors du chargement des logos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Sauvegarde des logos:', { logoUrl, homeLogoUrl });

      const settingsToUpdate = [
        { key: 'site_logo', value: logoUrl, description: 'URL du logo du site' },
        { key: 'home_logo', value: homeLogoUrl, description: 'URL du logo de la page d\'accueil' }
      ];

      for (const setting of settingsToUpdate) {
        const { data: existing } = await supabase
          .from('site_settings')
          .select('id')
          .eq('key', setting.key)
          .maybeSingle();

        console.log(`Setting ${setting.key}:`, { existing, value: setting.value });

        if (existing) {
          const { error } = await supabase
            .from('site_settings')
            .update({
              value: setting.value,
              updated_at: new Date().toISOString(),
            })
            .eq('key', setting.key);
          if (error) {
            console.error(`Erreur update ${setting.key}:`, error);
            throw error;
          }
          console.log(`${setting.key} mis à jour avec succès`);
        } else {
          const { error } = await supabase
            .from('site_settings')
            .insert({
              key: setting.key,
              value: setting.value,
              description: setting.description,
            });
          if (error) {
            console.error(`Erreur insert ${setting.key}:`, error);
            throw error;
          }
          console.log(`${setting.key} inséré avec succès`);
        }
      }

      setInitialLogoUrl(logoUrl);
      setInitialHomeLogoUrl(homeLogoUrl);
      setHasUnsavedChanges(false);
      alert('Logos enregistrés avec succès ! Rechargez la page d\'accueil pour voir les changements.');
      console.log('Sauvegarde terminée avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des logos: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (url: string) => {
    setLogoUrl(url);
    setShowMediaPicker(false);
  };

  const handleHomeMediaSelect = (url: string) => {
    setHomeLogoUrl(url);
    setShowHomeMediaPicker(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Paramètres des Logos</h1>
        <p className="text-gray-600 mt-1">
          Gérez les logos du site (en-tête et page d'accueil)
        </p>
      </div>

      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-medium">
                ⚠️ Vous avez des modifications non enregistrées. N'oubliez pas de cliquer sur "Enregistrer" en bas de la page !
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Logo de l'en-tête</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL du logo
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://exemple.com/logo-header.png"
            />
            <button
              onClick={() => setShowMediaPicker(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Upload size={20} />
              Choisir
            </button>
            {logoUrl && (
              <button
                onClick={() => setLogoUrl('')}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                title="Supprimer le logo"
              >
                <Trash2 size={20} />
                Supprimer
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ce logo s'affiche dans l'en-tête du site. Si vide, le badge VSL par défaut sera affiché.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-800">
            <strong>💡 Conseil :</strong> Hauteur 40-60px, format horizontal, PNG transparent recommandé
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prévisualisation (En-tête)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center bg-gray-50">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo du site"
                className="max-h-32 max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon size={48} className="mx-auto mb-2" />
                <p>Logo par défaut (Badge VSL)</p>
              </div>
            )}
            <div
              className="hidden flex-col items-center text-gray-400"
            >
              <ImageIcon size={48} className="mb-2" />
              <p>Erreur de chargement du logo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Logo de la page d'accueil</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL du logo
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={homeLogoUrl}
              onChange={(e) => setHomeLogoUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://exemple.com/logo-accueil.png"
            />
            <button
              onClick={() => setShowHomeMediaPicker(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Upload size={20} />
              Choisir
            </button>
            {homeLogoUrl && (
              <button
                onClick={() => setHomeLogoUrl('')}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                title="Supprimer le logo"
              >
                <Trash2 size={20} />
                Supprimer
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ce logo remplace "VSL" dans le titre de la page d'accueil. Si vide, le texte "VSL" sera affiché.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prévisualisation (Page d'accueil)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center bg-gray-50">
            {homeLogoUrl ? (
              <img
                src={homeLogoUrl}
                alt="Logo de la page d'accueil"
                className="max-h-32 max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon size={48} className="mx-auto mb-2" />
                <p>Texte "VSL" par défaut</p>
              </div>
            )}
            <div
              className="hidden flex-col items-center text-gray-400"
            >
              <ImageIcon size={48} className="mb-2" />
              <p>Erreur de chargement du logo</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Format requis pour le logo d'accueil
          </h3>
          <ul className="text-sm text-blue-800 space-y-2 ml-7">
            <li className="flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span><strong>Format :</strong> PNG avec fond transparent (recommandé) ou JPG</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span><strong>Dimensions :</strong> Hauteur entre 60-100px, largeur proportionnelle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span><strong>Ratio :</strong> Format horizontal ou carré (évitez les formats trop verticaux)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span><strong>Taille :</strong> Moins de 500 KB pour un chargement rapide</span>
            </li>
            <li className="flex items-start gap-2 pt-2 border-t border-blue-200 mt-2">
              <span className="text-blue-600">ℹ️</span>
              <span className="text-blue-700 font-medium">Le logo remplacera "VSL" dans le titre : "Taxi [VOTRE LOGO] Conventionné CPAM"</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
              hasUnsavedChanges
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg animate-pulse'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } ${saving ? 'opacity-50' : ''}`}
          >
            <Save size={20} />
            {saving ? 'Enregistrement...' : hasUnsavedChanges ? '💾 Enregistrer les modifications' : 'Aucune modification'}
          </button>
        </div>
      </div>

      {showMediaPicker && (
        <MediaPicker
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaPicker(false)}
          logoMode={true}
        />
      )}

      {showHomeMediaPicker && (
        <MediaPicker
          onSelect={handleHomeMediaSelect}
          onClose={() => setShowHomeMediaPicker(false)}
          logoMode={true}
        />
      )}
    </div>
  );
}
