import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Image as ImageIcon, AlignLeft, Copy } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import MediaPicker from '../../components/admin/MediaPicker';
import { supabase } from '../../lib/supabase';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'featured' | 'content'>('content');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    meta_description: '',
    meta_keywords: '',
    published: false,
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single();
    if (data) setFormData(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData };
      if (formData.published && !formData.published) {
        (payload as any).published_at = new Date().toISOString();
      }

      if (id === 'new') {
        await supabase.from('blog_posts').insert([payload]);
      } else {
        await supabase.from('blog_posts').update(payload).eq('id', id);
      }
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <button
          onClick={() => navigate('/admin/blog')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          Retour au blog
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {id === 'new' ? 'Nouvel article' : 'Modifier l\'article'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Informations de base</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Les avantages du transport VSL"
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
                  placeholder="Ex: avantages-transport-vsl"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="inline mr-2" size={16} />
                Image mise en avant
              </label>
              <input
                type="url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('featured');
                    setShowMediaPicker(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  <ImageIcon size={16} />
                  Choisir depuis la médiathèque
                </button>
              </div>
              {formData.featured_image_url && (
                <div className="mt-3">
                  <img
                    src={formData.featured_image_url}
                    alt="Aperçu"
                    className="h-48 w-full object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extrait (résumé)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Court résumé de l'article..."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Contenu de l'article</h2>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contenu *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.querySelector('textarea[rows="20"]') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = formData.content;
                        const before = text.substring(0, start);
                        const selected = text.substring(start, end);
                        const after = text.substring(end);
                        setFormData({ ...formData, content: before + '<strong>' + selected + '</strong>' + after });
                      }
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    title="Gras"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.querySelector('textarea[rows="20"]') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = formData.content;
                        const before = text.substring(0, start);
                        const selected = text.substring(start, end);
                        const after = text.substring(end);
                        setFormData({ ...formData, content: before + '<em>' + selected + '</em>' + after });
                      }
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded italic"
                    title="Italique"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, content: formData.content + '\n<h2>Titre</h2>\n' });
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    title="Ajouter H2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, content: formData.content + '\n<h3>Sous-titre</h3>\n' });
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    title="Ajouter H3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, content: formData.content + '\n<p>Paragraphe</p>\n' });
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1"
                    title="Ajouter paragraphe"
                  >
                    <AlignLeft size={12} /> P
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, content: formData.content + '\n<ul>\n  <li>Élément 1</li>\n  <li>Élément 2</li>\n</ul>\n' });
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    title="Ajouter liste"
                  >
                    UL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget('content');
                      setShowMediaPicker(true);
                    }}
                    className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded flex items-center gap-1 font-medium"
                    title="Ajouter image depuis la médiathèque"
                  >
                    <ImageIcon size={12} /> MEDIA
                  </button>
                </div>
              </div>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={20}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Contenu de l'article en HTML..."
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Vous pouvez utiliser du HTML pour formater le contenu (balises: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, etc.)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(formData.content);
                    alert('Contenu copié dans le presse-papier');
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700"
                >
                  <Copy size={12} /> Copier
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">SEO & Métadonnées</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Description pour les moteurs de recherche"
                />
                <p className="text-xs text-gray-500 mt-1">Recommandé: 150-160 caractères</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
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

            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer p-4 bg-blue-50 rounded-lg border border-blue-200">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Publier cet article</span>
                  <p className="text-xs text-gray-500">L'article sera visible sur le site</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                <Save size={20} />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              {id !== 'new' && (
                <a
                  href={`/blog/${formData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Eye size={20} />
                  Aperçu
                </a>
              )}
            </div>
          </div>
        </form>
      </div>
      {showMediaPicker && (
        <MediaPicker
          onSelect={(url) => {
            if (mediaPickerTarget === 'featured') {
              setFormData({ ...formData, featured_image_url: url });
            } else {
              setFormData({ ...formData, content: formData.content + `\n<img src="${url}" alt="Image" class="w-full rounded-lg my-4" />\n` });
            }
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </AdminLayout>
  );
}
