import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import Toast from '../../components/admin/Toast';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function FAQManager() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Général',
    is_published: true,
  });

  useEffect(() => {
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFaqItems(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors du chargement de la FAQ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('faq')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        showToast('Question mise à jour avec succès', 'success');
      } else {
        const maxOrder = Math.max(...faqItems.map(item => item.display_order), 0);
        const { error } = await supabase
          .from('faq')
          .insert([{
            ...formData,
            display_order: maxOrder + 1,
          }]);

        if (error) throw error;
        showToast('Question ajoutée avec succès', 'success');
      }

      resetForm();
      fetchFAQ();
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleEdit = (item: FAQItem) => {
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
      is_published: item.is_published,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return;

    try {
      const { error } = await supabase
        .from('faq')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Question supprimée avec succès', 'success');
      fetchFAQ();
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('faq')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      showToast(
        !currentStatus ? 'Question publiée' : 'Question dépubliée',
        'success'
      );
      fetchFAQ();
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors de la modification', 'error');
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const index = faqItems.findIndex(item => item.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === faqItems.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const item1 = faqItems[index];
    const item2 = faqItems[newIndex];

    try {
      const { error: error1 } = await supabase
        .from('faq')
        .update({ display_order: item2.display_order })
        .eq('id', item1.id);

      const { error: error2 } = await supabase
        .from('faq')
        .update({ display_order: item1.display_order })
        .eq('id', item2.id);

      if (error1 || error2) throw error1 || error2;
      fetchFAQ();
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors du déplacement', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'Général',
      is_published: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de la FAQ</h1>
            <p className="text-gray-600 mt-2">
              Gérez les questions fréquentes affichées sur votre site
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? 'Annuler' : 'Nouvelle Question'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Modifier la question' : 'Nouvelle question'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Général, Tarifs, Réservation..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Quelle est votre question ?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Réponse
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder="La réponse à la question..."
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                  Publier cette question
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Save size={20} />
                  {editingId ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : faqItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Aucune question pour le moment</p>
            <p className="text-gray-400 mt-2">Cliquez sur "Nouvelle Question" pour commencer</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryItems = faqItems.filter(item => item.category === category);
              return (
                <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b">
                    <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                  </div>
                  <div className="divide-y">
                    {categoryItems.map((item, index) => (
                      <div key={item.id} className="p-6 hover:bg-gray-50 transition">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {!item.is_published && (
                                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded">
                                  Non publié
                                </span>
                              )}
                              <h4 className="text-lg font-semibold text-gray-900">
                                {item.question}
                              </h4>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{item.answer}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => moveItem(item.id, 'up')}
                              disabled={index === 0}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                              title="Monter"
                            >
                              <ArrowUp size={18} />
                            </button>
                            <button
                              onClick={() => moveItem(item.id, 'down')}
                              disabled={index === categoryItems.length - 1}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                              title="Descendre"
                            >
                              <ArrowDown size={18} />
                            </button>
                            <button
                              onClick={() => togglePublish(item.id, item.is_published)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title={item.is_published ? 'Dépublier' : 'Publier'}
                            >
                              {item.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
}
