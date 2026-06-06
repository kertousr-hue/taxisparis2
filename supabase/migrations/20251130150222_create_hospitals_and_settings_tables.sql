/*
  # Création des tables pour la gestion des hôpitaux et du logo

  1. Nouvelle table `hospitals`
    - `id` (uuid, primary key)
    - `name` (text) - Nom de l'hôpital
    - `image_url` (text) - URL de l'image
    - `alt_text` (text) - Texte alternatif pour l'image
    - `display_order` (integer) - Ordre d'affichage
    - `is_active` (boolean) - Si l'hôpital est visible
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  2. Nouvelle table `site_settings`
    - `id` (uuid, primary key)
    - `key` (text, unique) - Clé du paramètre (ex: "site_logo")
    - `value` (text) - Valeur du paramètre
    - `description` (text) - Description du paramètre
    - `updated_at` (timestamptz)

  3. Sécurité
    - Enable RLS sur les deux tables
    - Policies pour lecture publique
    - Policies pour modification par admin uniquement
*/

-- Table hospitals
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  alt_text text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour l'ordre d'affichage
CREATE INDEX IF NOT EXISTS idx_hospitals_display_order ON hospitals(display_order);
CREATE INDEX IF NOT EXISTS idx_hospitals_active ON hospitals(is_active);

-- Table site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- RLS pour hospitals
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les hôpitaux actifs
CREATE POLICY "Public can view active hospitals"
  ON hospitals FOR SELECT
  TO public
  USING (is_active = true);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all hospitals"
  ON hospitals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Les admins peuvent insérer
CREATE POLICY "Admins can insert hospitals"
  ON hospitals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Les admins peuvent modifier
CREATE POLICY "Admins can update hospitals"
  ON hospitals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Les admins peuvent supprimer
CREATE POLICY "Admins can delete hospitals"
  ON hospitals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- RLS pour site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les paramètres
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all settings"
  ON site_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Les admins peuvent insérer
CREATE POLICY "Admins can insert settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Les admins peuvent modifier
CREATE POLICY "Admins can update settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Insérer les hôpitaux existants
INSERT INTO hospitals (name, image_url, alt_text, display_order, is_active) VALUES
  ('Hôpital de la Pitié-Salpêtrière', 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=600', 'Transport médical VSL vers l''Hôpital de la Pitié-Salpêtrière Paris 13ème - Service taxi conventionné CPAM', 1, true),
  ('Hôpital Cochin', 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=600', 'Taxi VSL conventionné vers Hôpital Cochin Paris 14ème - Transport sanitaire Assurance Maladie', 2, true),
  ('Hôpital Saint-Louis', 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=600', 'Service VSL Hôpital Saint-Louis Paris 10ème - Transport médical conventionné pour chimiothérapie', 3, true),
  ('Hôpital Necker', 'https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg?auto=compress&cs=tinysrgb&w=600', 'Transport VSL Hôpital Necker-Enfants Malades Paris 15ème - Taxi conventionné pédiatrie', 4, true),
  ('Hôpital Georges Pompidou', 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=600', 'VSL Hôpital Européen Georges Pompidou Paris 15ème - Transport sanitaire conventionné', 5, true),
  ('Hôpital Bichat', 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=600', 'Taxi conventionné Hôpital Bichat-Claude Bernard Paris 18ème - Transport médical VSL', 6, true),
  ('Hôpital Tenon', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=600', 'Service VSL Hôpital Tenon Paris 20ème - Transport sanitaire conventionné CPAM', 7, true),
  ('Hôpital Lariboisière', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=600', 'Transport médical Hôpital Lariboisière Paris 10ème - Taxi VSL conventionné urgences', 8, true),
  ('Hôpital Saint-Antoine', 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=600', 'VSL conventionné Hôpital Saint-Antoine Paris 12ème - Transport sanitaire Assurance Maladie', 9, true),
  ('Hôpital Hôtel-Dieu', 'https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg?auto=compress&cs=tinysrgb&w=600', 'Taxi VSL Hôpital Hôtel-Dieu Paris centre - Transport médical conventionné historique', 10, true),
  ('Institut Curie', 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=600', 'Transport VSL Institut Curie Paris - Taxi conventionné pour oncologie et radiothérapie', 11, true),
  ('Hôpital Robert Debré', 'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=600', 'Service VSL Hôpital Robert Debré Paris 19ème - Transport pédiatrique conventionné CPAM', 12, true),
  ('Hôpital Trousseau', 'https://images.pexels.com/photos/4386465/pexels-photo-4386465.jpeg?auto=compress&cs=tinysrgb&w=600', 'Taxi conventionné Hôpital Trousseau Paris 12ème - Transport sanitaire enfants VSL', 13, true),
  ('Institut Gustave Roussy', 'https://images.pexels.com/photos/8460335/pexels-photo-8460335.jpeg?auto=compress&cs=tinysrgb&w=600', 'Transport VSL Institut Gustave Roussy Villejuif - Taxi conventionné centre anti-cancer', 14, true)
ON CONFLICT DO NOTHING;

-- Insérer les paramètres des logos
INSERT INTO site_settings (key, value, description) VALUES
  ('site_logo', '', 'URL du logo du site'),
  ('home_logo', '', 'URL du logo de la page d''accueil')
ON CONFLICT (key) DO NOTHING;