import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js/web',
        },
      },
    })
  : null;

export interface Reservation {
  id?: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse_depart: string;
  adresse_arrivee: string;
  distance_km?: number;
  temps_trajet?: string;
  date_rdv: string;
  heure_rdv: string;
  ald_cmu: boolean;
  prescription_medicale: boolean;
  statut?: string;
  created_at?: string;
}
