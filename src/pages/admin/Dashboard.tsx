import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Eye, Phone, Mail, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

interface Reservation {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse_depart: string;
  adresse_arrivee: string;
  date_rdv: string;
  heure_rdv: string;
  statut: string;
  created_at: string;
  message?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ blogPosts: 0, reservations: 0, reservationsToday: 0 });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const today = new Date().toISOString().split('T')[0];

    const [postsCount, reservationsCount, todayCount, resData, postsData] = await Promise.all([
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('blog_posts').select('id, title, published, updated_at').order('updated_at', { ascending: false }).limit(5),
    ]);

    setStats({
      blogPosts: postsCount.count || 0,
      reservations: reservationsCount.count || 0,
      reservationsToday: todayCount.count || 0,
    });
    setReservations(resData.data || []);
    setRecentPosts(postsData.data || []);
  };

  const updateStatus = async (id: string, statut: string) => {
    await supabase.from('reservations').update({ statut }).eq('id', id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, statut } : r));
  };

  const deleteAllReservations = async () => {
    if (!window.confirm('Supprimer TOUTES les reservations ? Cette action est irreversible.')) return;
    await supabase.from('reservations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setReservations([]);
    setStats(prev => ({ ...prev, reservations: 0, reservationsToday: 0 }));
  };

  const filteredReservations = filter === 'all'
    ? reservations
    : reservations.filter(r => r.statut === filter);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'confirmed': return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700"><CheckCircle size={12} />Confirmee</span>;
      case 'cancelled': return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700"><XCircle size={12} />Annulee</span>;
      default: return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700"><AlertCircle size={12} />En attente</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de votre activite</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
            <Eye size={16} /> Voir le site
          </a>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 rounded-lg"><Calendar size={20} className="text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.reservations}</p>
                <p className="text-xs text-gray-500">Reservations totales</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-50 rounded-lg"><Clock size={20} className="text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.reservationsToday}</p>
                <p className="text-xs text-gray-500">Aujourd'hui</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg"><BookOpen size={20} className="text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.blogPosts}</p>
                <p className="text-xs text-gray-500">Articles de blog</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reservations section */}
        <div id="reservations" className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-bold text-gray-900">Reservations</h2>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {f === 'all' ? 'Toutes' : f === 'pending' ? 'En attente' : f === 'confirmed' ? 'Confirmees' : 'Annulees'}
                    </button>
                  ))}
                </div>
                {reservations.length > 0 && (
                  <button onClick={deleteAllReservations}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    <Trash2 size={13} /> Tout supprimer
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredReservations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">Aucune reservation</div>
            ) : (
              filteredReservations.map(r => (
                <div key={r.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-gray-900">{r.prenom} {r.nom}</span>
                        {getStatusBadge(r.statut)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Phone size={11} />{r.telephone}</span>
                        {r.email && <span className="flex items-center gap-1"><Mail size={11} />{r.email}</span>}
                        <span className="flex items-center gap-1"><Calendar size={11} />{r.date_rdv} a {r.heure_rdv}</span>
                      </div>
                      <div className="flex items-start gap-1 text-xs text-gray-600">
                        <MapPin size={11} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span className="truncate">{r.adresse_depart} → {r.adresse_arrivee}</span>
                      </div>
                      {r.message && (
                        <p className="text-xs text-gray-400 italic truncate">{r.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {r.statut !== 'confirmed' && (
                        <button onClick={() => updateStatus(r.id, 'confirmed')}
                          className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                          Confirmer
                        </button>
                      )}
                      {r.statut !== 'cancelled' && (
                        <button onClick={() => updateStatus(r.id, 'cancelled')}
                          className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent blog posts */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Articles recents</h2>
            <button onClick={() => navigate('/admin/blog')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir tout
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPosts.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">Aucun article</div>
            ) : (
              recentPosts.map(post => (
                <div key={post.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate(`/admin/blog/edit/${post.id}`)}>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(post.updated_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {post.published ? 'Publie' : 'Brouillon'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
