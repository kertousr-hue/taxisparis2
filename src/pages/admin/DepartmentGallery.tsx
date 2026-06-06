import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload, Trash2, Image as ImageIcon, Plus } from 'lucide-react';
import MediaPicker from '../../components/admin/MediaPicker';

interface GalleryImage {
  url: string;
  alt: string;
  caption: string;
}

interface DepartmentPage {
  id: string;
  slug: string;
  title: string;
  gallery: GalleryImage[];
}

export default function DepartmentGallery() {
  const [departments, setDepartments] = useState<DepartmentPage[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept) {
      loadGallery(selectedDept);
    }
  }, [selectedDept]);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('id, slug, title, gallery')
        .in('slug', ['paris-75', 'hauts-de-seine-92', 'seine-saint-denis-93', 'val-de-marne-94', 'essonne-91'])
        .order('slug');

      if (error) throw error;

      setDepartments(data || []);
      if (data && data.length > 0) {
        setSelectedDept(data[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
      alert('Erreur lors du chargement des départements');
    } finally {
      setLoading(false);
    }
  };

  const loadGallery = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    if (dept) {
      setGallery(dept.gallery || []);
    }
  };

  const handleAddImage = () => {
    setEditingIndex(null);
    setShowMediaPicker(true);
  };

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setShowMediaPicker(true);
  };

  const handleMediaSelect = (url: string) => {
    if (editingIndex !== null) {
      const newGallery = [...gallery];
      newGallery[editingIndex].url = url;
      setGallery(newGallery);
    } else {
      setGallery([...gallery, { url, alt: '', caption: '' }]);
    }
    setShowMediaPicker(false);
    setEditingIndex(null);
  };

  const handleUpdateImage = (index: number, field: 'alt' | 'caption', value: string) => {
    const newGallery = [...gallery];
    newGallery[index][field] = value;
    setGallery(newGallery);
  };

  const handleRemoveImage = (index: number) => {
    if (confirm('Voulez-vous vraiment supprimer cette photo ?')) {
      setGallery(gallery.filter((_, i) => i !== index));
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newGallery = [...gallery];
    [newGallery[index - 1], newGallery[index]] = [newGallery[index], newGallery[index - 1]];
    setGallery(newGallery);
  };

  const handleMoveDown = (index: number) => {
    if (index === gallery.length - 1) return;
    const newGallery = [...gallery];
    [newGallery[index], newGallery[index + 1]] = [newGallery[index + 1], newGallery[index]];
    setGallery(newGallery);
  };

  const handleSave = async () => {
    if (!selectedDept) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('pages')
        .update({
          gallery: gallery,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedDept);

      if (error) throw error;

      alert('Galerie enregistrée avec succès !');
      await fetchDepartments();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la galerie');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentDept = departments.find(d => d.id === selectedDept);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Galerie Photos des Départements</h1>
        <p className="text-gray-600 mt-1">
          Ajoutez et gérez les photos qui s'affichent dans les pages de départements
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Département
          </label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.title}
              </option>
            ))}
          </select>
        </div>

        {currentDept && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Photos de {currentDept.title}
              </h2>
              <button
                onClick={handleAddImage}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                Ajouter une photo
              </button>
            </div>

            {gallery.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">Aucune photo dans la galerie</p>
                <button
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ajouter la première photo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {gallery.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.alt || 'Photo'}
                          className="w-32 h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EErreur%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            URL de l'image
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={image.url}
                              readOnly
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                            />
                            <button
                              onClick={() => handleEditImage(index)}
                              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              <Upload size={16} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Texte alternatif (important pour le SEO)
                          </label>
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(e) => handleUpdateImage(index, 'alt', e.target.value)}
                            placeholder="Description de l'image"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Légende (optionnelle)
                          </label>
                          <input
                            type="text"
                            value={image.caption}
                            onChange={(e) => handleUpdateImage(index, 'caption', e.target.value)}
                            placeholder="Légende de la photo"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                          title="Monter"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === gallery.length - 1}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                          title="Descendre"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Conseils</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ajoutez des photos représentatives du département ou des services</li>
                <li>• Le texte alternatif améliore le référencement (SEO)</li>
                <li>• Les photos s'afficheront dans l'ordre de la liste</li>
                <li>• Format recommandé : JPG ou PNG, largeur 800-1200px</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {saving ? 'Enregistrement...' : 'Enregistrer la galerie'}
              </button>
            </div>
          </>
        )}
      </div>

      {showMediaPicker && (
        <MediaPicker
          onSelect={handleMediaSelect}
          onClose={() => {
            setShowMediaPicker(false);
            setEditingIndex(null);
          }}
        />
      )}
    </div>
  );
}
