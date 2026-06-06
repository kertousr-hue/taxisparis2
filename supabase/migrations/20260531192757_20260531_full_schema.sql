
/*
  # Full Schema Migration for qwsgtmzpirrbnmcbdvue
  
  Creates all tables from scratch:
  1. reservations
  2. airport_transfers
  3. station_transfers
  4. admin_users
  5. pages
  6. blog_posts
  7. media
  8. settings
  9. site_settings
  10. contacts
  11. clients
  12. hospitals
  13. departments
  14. cities
  15. faq

  All tables have RLS enabled with appropriate policies.
*/

-- ─── 1. RESERVATIONS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text NOT NULL,
  email text,
  adresse_depart text NOT NULL,
  adresse_arrivee text NOT NULL,
  distance_km numeric,
  temps_trajet text,
  date_rdv date NOT NULL,
  heure_rdv time NOT NULL,
  ald_cmu boolean DEFAULT false,
  prescription boolean DEFAULT false,
  statut text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  duree_minutes integer,
  ip_client text,
  user_agent text,
  numero_vol text,
  numero_train text,
  nombre_passagers integer,
  nombre_bagages integer,
  message text,
  type_trajet text,
  duree_min integer
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert reservations"
  ON reservations FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can select reservations"
  ON reservations FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update reservations"
  ON reservations FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- ─── 2. AIRPORT_TRANSFERS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS airport_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text NOT NULL,
  email text NOT NULL,
  type_trajet text NOT NULL CHECK (type_trajet = ANY (ARRAY['aller','retour','aller-retour'])),
  aeroport text NOT NULL,
  adresse text NOT NULL,
  date_trajet date NOT NULL,
  heure_trajet time NOT NULL,
  numero_vol text,
  nombre_passagers integer NOT NULL DEFAULT 1 CHECK (nombre_passagers > 0),
  nombre_bagages integer NOT NULL DEFAULT 0 CHECK (nombre_bagages >= 0),
  informations_supplementaires text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE airport_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert airport transfers"
  ON airport_transfers FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can select airport transfers"
  ON airport_transfers FOR SELECT TO authenticated
  USING (true);

-- ─── 3. STATION_TRANSFERS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS station_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text NOT NULL,
  email text NOT NULL,
  gare text NOT NULL,
  date_trajet date NOT NULL,
  heure_trajet time NOT NULL,
  numero_train text,
  nombre_passagers integer NOT NULL DEFAULT 1 CHECK (nombre_passagers > 0),
  nombre_bagages integer NOT NULL DEFAULT 0 CHECK (nombre_bagages >= 0),
  informations_supplementaires text,
  created_at timestamptz DEFAULT now(),
  adresse_depart text NOT NULL DEFAULT '',
  adresse_arrivee text NOT NULL DEFAULT '',
  distance_km numeric,
  duree_minutes integer
);

ALTER TABLE station_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert station transfers"
  ON station_transfers FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can select station transfers"
  ON station_transfers FOR SELECT TO authenticated
  USING (true);

-- ─── 4. ADMIN_USERS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role = ANY (ARRAY['admin','editor'])),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select admin users"
  ON admin_users FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update admin users"
  ON admin_users FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Insert default admin
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@taxisparis-conventionnes.fr',
  '$2a$10$rQnK5V9Z8mX2pL6jH4wYuOq1sN7dF3cA9bE0tI5gM8kR2vW4xP6yZ',
  'Administrateur',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- ─── 5. PAGES ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT '',
  hero_image_url text,
  content text DEFAULT '',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  hero_title text DEFAULT '',
  hero_subtitle text DEFAULT '',
  hero_button_text text DEFAULT 'Réserver maintenant',
  hero_button_link text DEFAULT '/reservation-taxi-vsl',
  meta_title text DEFAULT '',
  sections jsonb DEFAULT '[]'::jsonb,
  gallery jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select published pages"
  ON pages FOR SELECT TO anon
  USING (published = true);

CREATE POLICY "Authenticated can select all pages"
  ON pages FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert pages"
  ON pages FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update pages"
  ON pages FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Insert default pages
INSERT INTO pages (slug, title, meta_title, meta_description, published) VALUES
  ('accueil', 'Accueil', 'Taxi Conventionné Paris – VSL Île-de-France', 'Taxi conventionné et VSL en Île-de-France.', true),
  ('qui-sommes-nous', 'Qui sommes-nous', 'Qui sommes-nous – Taxis Paris Conventionnés', 'Découvrez notre équipe de chauffeurs agréés CPAM.', true),
  ('zones-desservies', 'Zones desservies', 'Zones desservies – Île-de-France', 'Toutes les zones desservies par nos taxis.', true),
  ('taxis-aeroports-parisiens', 'Taxis Aéroports Parisiens', 'Taxi Aéroports Paris – CDG, Orly, Beauvais', 'Transferts aéroport Paris disponibles 24h/24.', true),
  ('taxis-gares-parisiennes', 'Taxis Gares Parisiennes', 'Taxi Gares Paris – Gare du Nord, Saint-Lazare', 'Transferts gares parisiennes 24h/24 7j/7.', true),
  ('faq', 'FAQ', 'FAQ – Questions fréquentes sur les taxis conventionnés', 'Réponses à vos questions sur le taxi conventionné.', true)
ON CONFLICT (slug) DO NOTHING;

-- ─── 6. BLOG_POSTS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text DEFAULT '',
  content text NOT NULL DEFAULT '',
  featured_image_url text,
  author_id uuid,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT ''
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select published blog posts"
  ON blog_posts FOR SELECT TO anon
  USING (published = true);

CREATE POLICY "Authenticated can select all blog posts"
  ON blog_posts FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert blog posts"
  ON blog_posts FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update blog posts"
  ON blog_posts FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete blog posts"
  ON blog_posts FOR DELETE TO authenticated
  USING (true);

-- ─── 7. MEDIA ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  size integer DEFAULT 0,
  mime_type text NOT NULL,
  uploaded_by uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select media"
  ON media FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert media"
  ON media FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete media"
  ON media FOR DELETE TO authenticated
  USING (true);

-- ─── 8. SETTINGS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select settings"
  ON settings FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated can insert settings"
  ON settings FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update settings"
  ON settings FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

INSERT INTO settings (key, value) VALUES
  ('site', '{"phone": "06 50 36 64 91", "email": "contact@taxisparis-conventionnes.fr"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ─── 9. SITE_SETTINGS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select site settings"
  ON site_settings FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated can insert site settings"
  ON site_settings FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update site settings"
  ON site_settings FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

INSERT INTO site_settings (key, value, description) VALUES
  ('logo_url', '', 'URL du logo du site'),
  ('phone_number', '06 50 36 64 91', 'Numéro de téléphone principal')
ON CONFLICT (key) DO NOTHING;

-- ─── 10. CONTACTS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  statut text DEFAULT 'nouveau' CHECK (statut = ANY (ARRAY['nouveau','lu','traité'])),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert contacts"
  ON contacts FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can select contacts"
  ON contacts FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update contacts"
  ON contacts FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- ─── 11. CLIENTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select clients"
  ON clients FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert clients"
  ON clients FOR INSERT TO authenticated
  WITH CHECK (true);

-- ─── 12. HOSPITALS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  alt_text text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  image_cache_buster bigint DEFAULT (EXTRACT(epoch FROM now()))::bigint
);

ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select active hospitals"
  ON hospitals FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can select all hospitals"
  ON hospitals FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert hospitals"
  ON hospitals FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update hospitals"
  ON hospitals FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete hospitals"
  ON hospitals FOR DELETE TO authenticated
  USING (true);

INSERT INTO hospitals (name, image_url, alt_text, display_order) VALUES
  ('Hôpital Cochin', 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg', 'Hôpital Cochin Paris', 1),
  ('Hôpital Necker', 'https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg', 'Hôpital Necker Paris', 2),
  ('Hôpital Lariboisière', 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg', 'Hôpital Lariboisière Paris', 3),
  ('Hôpital Saint-Louis', 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg', 'Hôpital Saint-Louis Paris', 4),
  ('Hôpital Pitié-Salpêtrière', 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg', 'Hôpital Pitié-Salpêtrière Paris', 5),
  ('Hôpital Bichat', 'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg', 'Hôpital Bichat Paris', 6),
  ('Hôpital Sainte-Anne', 'https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg', 'Hôpital Sainte-Anne Paris', 7),
  ('Hôpital Ambroise Paré', 'https://images.pexels.com/photos/127873/pexels-photo-127873.jpeg', 'Hôpital Ambroise Paré Boulogne', 8),
  ('Hôpital Antoine Béclère', 'https://images.pexels.com/photos/3376799/pexels-photo-3376799.jpeg', 'Hôpital Antoine Béclère Clamart', 9),
  ('Hôpital Paul Brousse', 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg', 'Hôpital Paul Brousse Villejuif', 10),
  ('Institut Gustave Roussy', 'https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg', 'Institut Gustave Roussy Villejuif', 11),
  ('Hôpital Henri Mondor', 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg', 'Hôpital Henri Mondor Créteil', 12),
  ('Hôpital Avicenne', 'https://images.pexels.com/photos/1350560/pexels-photo-1350560.jpeg', 'Hôpital Avicenne Bobigny', 13),
  ('Hôpital Jean Verdier', 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg', 'Hôpital Jean Verdier Bondy', 14)
ON CONFLICT DO NOTHING;

-- ─── 13. DEPARTMENTS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  h1 text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select departments"
  ON departments FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated can insert departments"
  ON departments FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update departments"
  ON departments FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- ─── 14. CITIES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id),
  name text NOT NULL,
  postal_code text NOT NULL,
  slug text NOT NULL,
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  h1 text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  nearby_cities jsonb DEFAULT '[]'::jsonb,
  nearby_hospitals jsonb DEFAULT '[]'::jsonb,
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select cities"
  ON cities FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated can insert cities"
  ON cities FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update cities"
  ON cities FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- ─── 15. FAQ ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'Général',
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select published faq"
  ON faq FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "Authenticated can select all faq"
  ON faq FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert faq"
  ON faq FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update faq"
  ON faq FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete faq"
  ON faq FOR DELETE TO authenticated
  USING (true);

INSERT INTO faq (question, answer, category, display_order) VALUES
  ('Qu''est-ce qu''un taxi conventionné ?', 'Un taxi conventionné est agréé par l''Assurance Maladie (CPAM) pour effectuer des transports médicaux remboursés.', 'Général', 1),
  ('Comment réserver un taxi conventionné ?', 'Remplissez le formulaire en ligne ou appelez le 06 50 36 64 91. Nous confirmons votre réservation par téléphone.', 'Réservation', 2),
  ('Le transport est-il remboursé par la CPAM ?', 'Oui, sous conditions : prescription médicale et état de santé justifiant le transport. Jusqu''à 100% pour les patients en ALD.', 'Remboursement', 3),
  ('Faut-il une prescription médicale ?', 'Oui, le formulaire Cerfa S3138 est obligatoire pour un remboursement. Sans prescription, le transport reste possible mais non remboursé.', 'Remboursement', 4),
  ('Quels départements sont couverts ?', 'Paris (75), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93) et Val-de-Marne (94).', 'Zones', 5),
  ('Quel est le délai de confirmation ?', 'Nous vous contactons par téléphone dans les plus brefs délais. Réservez au minimum 24h à l''avance.', 'Réservation', 6),
  ('Puis-je réserver pour aujourd''hui ?', 'Pour les urgences, appelez directement le 06 50 36 64 91. Nous faisons notre possible pour vous accueillir.', 'Réservation', 7),
  ('Acceptez-vous les patients en fauteuil roulant ?', 'Oui, nous disposons de véhicules adaptés PMR. Précisez-le lors de votre réservation.', 'Services', 8),
  ('Comment fonctionne le remboursement CPAM ?', 'Après chaque transport, nous établissons une feuille de soin. La CPAM rembourse directement selon votre situation (ALD, CSS, etc.).', 'Remboursement', 9),
  ('Êtes-vous disponibles la nuit et le week-end ?', 'Oui, notre service fonctionne 24h/24 et 7j/7 y compris les jours fériés.', 'Services', 10),
  ('Que signifie VSL ?', 'VSL signifie Véhicule Sanitaire Léger. C''est un véhicule médicalisé léger pour les patients pouvant voyager en position assise.', 'Général', 11),
  ('Quelle est la différence entre taxi et VSL ?', 'Le taxi conventionné et le VSL offrent des prestations similaires pour les patients assis. Le choix dépend de la prescription médicale.', 'Général', 12),
  ('Puis-je être accompagné ?', 'Oui, un accompagnant peut voyager avec vous. Précisez-le lors de la réservation.', 'Services', 13),
  ('Comment annuler une réservation ?', 'Appelez-nous au 06 50 36 64 91 le plus tôt possible pour annuler ou modifier votre réservation.', 'Réservation', 14),
  ('Faites-vous les transferts aéroport ?', 'Oui, nous effectuons des transferts vers CDG, Orly et Beauvais. Réservez à l''avance pour garantir votre place.', 'Services', 15),
  ('Faites-vous les transferts gare ?', 'Oui, nous desservons toutes les grandes gares parisiennes : Gare du Nord, Saint-Lazare, Montparnasse, Lyon, Est, Austerlitz.', 'Services', 16),
  ('Quel est le tarif ?', 'Les tarifs sont réglementés pour les transports conventionnés. Pour les autres trajets, contactez-nous pour un devis.', 'Tarifs', 17),
  ('Avez-vous des véhicules climatisés ?', 'Oui, tous nos véhicules sont climatisés pour votre confort.', 'Services', 18),
  ('Comment obtenir une facture ?', 'Une facture vous sera remise après chaque transport. Pour une facture électronique, contactez-nous par email.', 'Général', 19),
  ('Intervenez-vous en urgence ?', 'Pour les urgences médicales, appelez le 15 (SAMU). Pour les transports urgents non-urgences vitales, appelez le 06 50 36 64 91.', 'Services', 20)
ON CONFLICT DO NOTHING;

-- ─── FOREIGN KEYS (added after all tables exist) ───────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'blog_posts_author_id_fkey'
  ) THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_author_id_fkey
      FOREIGN KEY (author_id) REFERENCES admin_users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'pages_created_by_fkey'
  ) THEN
    ALTER TABLE pages ADD CONSTRAINT pages_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES admin_users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'media_uploaded_by_fkey'
  ) THEN
    ALTER TABLE media ADD CONSTRAINT media_uploaded_by_fkey
      FOREIGN KEY (uploaded_by) REFERENCES admin_users(id);
  END IF;
END $$;

-- ─── ADMIN LOGIN FUNCTION ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION admin_login(p_email text, p_password text)
RETURNS TABLE(id uuid, email text, name text, role text) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.name, u.role
  FROM admin_users u
  WHERE u.email = p_email
    AND u.password_hash = crypt(p_password, u.password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
