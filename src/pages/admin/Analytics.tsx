import { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Eye, MapPin, Clock, ArrowUp, ArrowDown, BarChart3, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalContacts: 0,
    reservationsThisMonth: 0,
    reservationsLastMonth: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);

    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      reservationsTotal,
      contactsTotal,
      reservationsThisMonth,
      reservationsLastMonth,
      pendingCount,
      confirmedCount,
      recentRes,
    ] = await Promise.all([
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayThisMonth.toISOString()),
      supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayLastMonth.toISOString())
        .lte('created_at', lastDayLastMonth.toISOString()),
      supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'pending'),
      supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'confirmed'),
      supabase
        .from('reservations')
        .select('nom, prenom, adresse_depart, adresse_arrivee, date_rdv, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    setStats({
      totalReservations: reservationsTotal.count || 0,
      totalContacts: contactsTotal.count || 0,
      reservationsThisMonth: reservationsThisMonth.count || 0,
      reservationsLastMonth: reservationsLastMonth.count || 0,
      pendingReservations: pendingCount.count || 0,
      confirmedReservations: confirmedCount.count || 0,
    });

    setRecentActivity(recentRes.data || []);
    setLoading(false);
  };

  const calculateGrowth = () => {
    if (stats.reservationsLastMonth === 0) return 0;
    const growth =
      ((stats.reservationsThisMonth - stats.reservationsLastMonth) /
        stats.reservationsLastMonth) *
      100;
    return Math.round(growth);
  };

  const growth = calculateGrowth();

  const statCards = [
    {
      icon: Calendar,
      label: 'Réservations totales',
      value: stats.totalReservations,
      subtext: 'Depuis le début',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      icon: TrendingUp,
      label: 'Réservations ce mois',
      value: stats.reservationsThisMonth,
      subtext: `${growth >= 0 ? '+' : ''}${growth}% vs mois dernier`,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      growth: growth,
    },
    {
      icon: Clock,
      label: 'En attente',
      value: stats.pendingReservations,
      subtext: 'À traiter',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      icon: Users,
      label: 'Messages reçus',
      value: stats.totalContacts,
      subtext: 'Formulaire de contact',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics</h1>
          <p className="text-gray-600">Statistiques et analyse de votre activite</p>
        </div>

        {/* Google Analytics Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 rounded-lg">
                <BarChart3 size={22} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Google Analytics</h2>
                <p className="text-xs text-gray-500">ID : G-3780TKJD8H</p>
              </div>
            </div>
            <a
              href="https://analytics.google.com/analytics/web/#/p/G-3780TKJD8H"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <ExternalLink size={14} />
              Ouvrir Google Analytics
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium mb-1">Statut</p>
              <p className="text-lg font-bold text-blue-800">Actif</p>
              <p className="text-xs text-blue-500 mt-1">Collecte de donnees en cours</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <p className="text-xs text-green-600 font-medium mb-1">Suivi des pages</p>
              <p className="text-lg font-bold text-green-800">Toutes les pages</p>
              <p className="text-xs text-green-500 mt-1">Navigation SPA incluse</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <p className="text-xs text-amber-600 font-medium mb-1">Compte</p>
              <p className="text-lg font-bold text-amber-800">kertous.r@gmail.com</p>
              <p className="text-xs text-amber-500 mt-1">Proprietaire du compte GA</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Donnees collectees</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Pages vues
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Sessions
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Utilisateurs
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Taux de rebond
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Sources de trafic
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Geolocalisation
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Appareils
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Conversions
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${stat.color} hover:shadow-xl transition-shadow`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <Icon className={stat.textColor} size={28} />
                  </div>
                  {stat.growth !== undefined && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        stat.growth >= 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {stat.growth >= 0 ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )}
                      {Math.abs(stat.growth)}%
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Statistiques mensuelles</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Mois en cours</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.reservationsThisMonth}</p>
                </div>
                <Calendar className="text-blue-500" size={32} />
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Mois dernier</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.reservationsLastMonth}</p>
                </div>
                <Calendar className="text-gray-400" size={32} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Statuts des réservations</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-green-800 font-medium">Confirmées</p>
                  <p className="text-2xl font-bold text-green-900">{stats.confirmedReservations}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                  <Eye className="text-green-700" size={24} />
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm text-orange-800 font-medium">En attente</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.pendingReservations}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-200 flex items-center justify-center">
                  <Clock className="text-orange-700" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={24} />
            Activité récente
          </h2>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune activité récente</p>
            ) : (
              recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition border border-gray-100"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="text-blue-600" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800">
                      {item.nom} {item.prenom}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {item.adresse_depart} → {item.adresse_arrivee}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-gray-500">
                        RDV: {new Date(item.date_rdv).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-gray-400">
                        Créé: {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
