/*
  # Création des tables pour le SEO ville par ville
  
  1. Nouvelles Tables
    - `departments` - Départements d'Île-de-France
      - `id` (uuid, primary key)
      - `code` (text, unique) - Code département (75, 91, 92, 93, 94)
      - `name` (text) - Nom du département
      - `slug` (text, unique) - Slug pour URL
      - `meta_title` (text) - Title SEO
      - `meta_description` (text) - Description SEO
      - `h1` (text) - Titre H1
      - `content` (text) - Contenu principal
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `cities` - Villes d'Île-de-France
      - `id` (uuid, primary key)
      - `department_id` (uuid, foreign key)
      - `name` (text) - Nom de la ville
      - `postal_code` (text) - Code postal
      - `slug` (text) - Slug pour URL
      - `meta_title` (text) - Title SEO unique
      - `meta_description` (text) - Description SEO unique
      - `h1` (text) - Titre H1 unique
      - `content` (text) - Contenu principal (500+ mots)
      - `nearby_cities` (jsonb) - Villes voisines
      - `nearby_hospitals` (jsonb) - Hôpitaux/cliniques proches
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Sécurité
    - Enable RLS sur `departments` et `cities`
    - Lecture publique (pour le site)
    - Écriture admin uniquement
*/

-- Table des départements
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  meta_title text NOT NULL,
  meta_description text NOT NULL,
  h1 text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des villes
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  postal_code text NOT NULL,
  slug text NOT NULL,
  meta_title text NOT NULL,
  meta_description text NOT NULL,
  h1 text NOT NULL,
  content text NOT NULL,
  nearby_cities jsonb DEFAULT '[]'::jsonb,
  nearby_hospitals jsonb DEFAULT '[]'::jsonb,
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(department_id, slug)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_cities_department ON cities(department_id);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_departments_slug ON departments(slug);

-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Policies pour lecture publique
CREATE POLICY "Departments are viewable by everyone"
  ON departments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Cities are viewable by everyone"
  ON cities FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policies pour écriture admin
CREATE POLICY "Admins can insert departments"
  ON departments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@taxivsl.fr'
    )
  );

CREATE POLICY "Admins can update departments"
  ON departments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@taxivsl.fr'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@taxivsl.fr'
    )
  );

CREATE POLICY "Admins can insert cities"
  ON cities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@taxivsl.fr'
    )
  );

CREATE POLICY "Admins can update cities"
  ON cities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@taxivsl.fr'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@taxivsl.fr'
    )
  );
