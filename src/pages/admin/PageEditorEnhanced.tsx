import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, MoveUp, MoveDown, Eye } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import RichTextEditor from '../../components/admin/RichTextEditor';
import MediaPicker from '../../components/admin/MediaPicker';
import { useToast } from '../../hooks/useToast';
import { supabase } from '../../lib/supabase';

interface Section {
  id: string;
  type: 'text' | 'services' | 'features' | 'cta' | 'html';
  title: string;
  subtitle?: string;
  content: string;
  items?: string[];
}

export default function PageEditorEnhanced() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'hero' | 'sections' | 'seo'>('basic');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'hero' | 'content' | 'section'>('content');
  const [targetSectionId, setTargetSectionId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    hero_button_text: 'Réserver maintenant',
    hero_button_link: '/reservation-taxi-vsl',
    content: '',
    sections: [] as Section[],
    published: false,
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    const { data, error } = await supabase.from('pages').select('*').eq('id', id).maybeSingle();
    if (error) {
      toast.error('Erreur lors du chargement de la page');
      return;
    }
    if (data) {
      setFormData({
        ...data,
        sections: data.sections || [],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id === 'new') {
        const { error } = await supabase.from('pages').insert([formData]);
        if (error) throw error;
        toast.success('Page créée avec succès');
      } else {
        const { error } = await supabase.from('pages').update(formData).eq('id', id);
        if (error) throw error;
        toast.success('Page mise à jour avec succès');
      }
      navigate('/admin/pages');
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      type: 'text',
      title: '',
      subtitle: '',
      content: '',
      items: [],
    };
    setFormData({ ...formData, sections: [...formData.sections, newSection] });
    toast.info('Nouvelle section ajoutée');
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setFormData({
      ...formData,
      sections: formData.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s),
    });
  };

  const deleteSection = (sectionId: string) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter(s => s.id !== sectionId),
    });
    toast.success('Section supprimée');
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...formData.sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setFormData({ ...formData, sections: newSections });
  };

  const moveSectionDown = (index: number) => {
    if (index === formData.sections.length - 1) return;
    const newSections = [...formData.sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setFormData({ ...formData, sections: newSections });
  };

  const tabs = [
    { id: 'basic', label: 'Informations de base' },
    { id: 'hero', label: 'Section Hero' },
    { id: 'sections', label: 'Sections de contenu' },
    { id: 'seo', label: 'SEO & Métadonnées' },
  ];

  return (
    <AdminLayout>
      <toast.ToastContainer />
      <div>
        <button
          onClick={() => navigate('/admin/pages')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          Retour aux pages
        </button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {id === 'new' ? 'Nouvelle page' : 'Modifier la page'}
          </h1>
          {id !== 'new' && formData.slug && (
            <a
              href={`/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <Eye size={18} />
              Voir la page
            </a>
          )}
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 font-medium transition ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'basic' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Informations de base</h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la page *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Transport VSL Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: vsl-paris"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu principal (HTML)
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  onImageClick={() => {
                    setMediaPickerTarget('content');
                    setShowMediaPicker(true);
                  }}
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Publier cette page</span>
                    <p className="text-xs text-gray-500">La page sera visible sur le site</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Section Hero (Bannière principale)</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre Hero
                  </label>
                  <input
                    type="text"
                    value={formData.hero_title}
                    onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Grand titre affiché en haut de la page"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-titre Hero
                  </label>
                  <textarea
                    value={formData.hero_subtitle}
                    onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Sous-titre descriptif"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Hero
                  </label>
                  <input
                    type="url"
                    value={formData.hero_image_url}
                    onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget('hero');
                      setShowMediaPicker(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Choisir depuis la médiathèque
                  </button>
                  {formData.hero_image_url && (
                    <div className="mt-3">
                      <img
                        src={formData.hero_image_url}
                        alt="Aperçu Hero"
                        className="h-48 w-full object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texte du bouton CTA
                    </label>
                    <input
                      type="text"
                      value={formData.hero_button_text}
                      onChange={(e) => setFormData({ ...formData, hero_button_text: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Réserver maintenant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lien du bouton CTA
                    </label>
                    <input
                      type="text"
                      value={formData.hero_button_link}
                      onChange={(e) => setFormData({ ...formData, hero_button_link: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="/reservation-taxi-vsl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Sections de contenu</h2>
                <button
                  type="button"
                  onClick={addSection}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus size={18} />
                  Ajouter une section
                </button>
              </div>

              {formData.sections.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucune section. Cliquez sur "Ajouter une section" pour commencer.
                </p>
              ) : (
                <div className="space-y-6">
                  {formData.sections.map((section, index) => (
                    <div key={section.id} className="border rounded-lg p-6 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveSectionUp(index)}
                            disabled={index === 0}
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30"
                          >
                            <MoveUp size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSectionDown(index)}
                            disabled={index === formData.sections.length - 1}
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30"
                          >
                            <MoveDown size={18} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteSection(section.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de section
                          </label>
                          <select
                            value={section.type}
                            onChange={(e) => updateSection(section.id, { type: e.target.value as any })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="text">Texte simple</option>
                            <option value="services">Liste de services</option>
                            <option value="features">Caractéristiques</option>
                            <option value="cta">Appel à l'action</option>
                            <option value="html">HTML personnalisé</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre de la section
                          </label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Titre de la section"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sous-titre (optionnel)
                          </label>
                          <input
                            type="text"
                            value={section.subtitle || ''}
                            onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Sous-titre"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contenu
                          </label>
                          <RichTextEditor
                            value={section.content}
                            onChange={(value) => updateSection(section.id, { content: value })}
                            onImageClick={() => {
                              setTargetSectionId(section.id);
                              setMediaPickerTarget('section');
                              setShowMediaPicker(true);
                            }}
                            minHeight="200px"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">SEO & Métadonnées</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre SEO (Meta Title)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Titre optimisé pour les moteurs de recherche"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommandé: 50-60 caractères ({formData.meta_title.length}/60)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Description affichée dans les résultats de recherche"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommandé: 150-160 caractères ({formData.meta_description.length}/160)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="vsl, taxi, paris, transport"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold text-lg"
            >
              <Save size={20} />
              {loading ? 'Enregistrement...' : 'Enregistrer la page'}
            </button>
          </div>
        </form>
      </div>
      {showMediaPicker && (
        <MediaPicker
          onSelect={(url) => {
            if (mediaPickerTarget === 'hero') {
              setFormData({ ...formData, hero_image_url: url });
            } else if (mediaPickerTarget === 'section') {
              const section = formData.sections.find(s => s.id === targetSectionId);
              if (section) {
                updateSection(targetSectionId, {
                  content: section.content + `\n<img src="${url}" alt="Image" class="w-full rounded-lg my-4" />\n`
                });
              }
            } else {
              setFormData({ ...formData, content: formData.content + `\n<img src="${url}" alt="Image" class="w-full rounded-lg my-4" />\n` });
            }
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </AdminLayout>
  );
}
