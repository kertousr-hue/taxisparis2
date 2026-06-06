/*
  # Create Airport and Station Transfer Tables

  ## New Tables
  
  ### `airport_transfers`
  - `id` (uuid, primary key) - Unique identifier
  - `nom` (text) - Last name
  - `prenom` (text) - First name
  - `telephone` (text) - Phone number
  - `email` (text) - Email address
  - `type_trajet` (text) - Trip type (aller/retour/aller-retour)
  - `aeroport` (text) - Airport code
  - `adresse` (text) - Pickup/dropoff address
  - `date_trajet` (date) - Trip date
  - `heure_trajet` (time) - Trip time
  - `numero_vol` (text, optional) - Flight number
  - `nombre_passagers` (integer) - Number of passengers
  - `nombre_bagages` (integer) - Number of luggage
  - `informations_supplementaires` (text, optional) - Additional information
  - `created_at` (timestamptz) - Record creation timestamp

  ### `station_transfers`
  - `id` (uuid, primary key) - Unique identifier
  - `nom` (text) - Last name
  - `prenom` (text) - First name
  - `telephone` (text) - Phone number
  - `email` (text) - Email address
  - `type_trajet` (text) - Trip type (aller/retour/aller-retour)
  - `gare` (text) - Station code
  - `adresse` (text) - Pickup/dropoff address
  - `date_trajet` (date) - Trip date
  - `heure_trajet` (time) - Trip time
  - `numero_train` (text, optional) - Train number
  - `nombre_passagers` (integer) - Number of passengers
  - `nombre_bagages` (integer) - Number of luggage
  - `informations_supplementaires` (text, optional) - Additional information
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Add policies for authenticated users to insert their own transfers
  - Public can insert (for booking forms)
*/

-- Create airport_transfers table
CREATE TABLE IF NOT EXISTS airport_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text NOT NULL,
  email text NOT NULL,
  type_trajet text NOT NULL CHECK (type_trajet IN ('aller', 'retour', 'aller-retour')),
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

-- Create station_transfers table
CREATE TABLE IF NOT EXISTS station_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text NOT NULL,
  email text NOT NULL,
  type_trajet text NOT NULL CHECK (type_trajet IN ('aller', 'retour', 'aller-retour')),
  gare text NOT NULL,
  adresse text NOT NULL,
  date_trajet date NOT NULL,
  heure_trajet time NOT NULL,
  numero_train text,
  nombre_passagers integer NOT NULL DEFAULT 1 CHECK (nombre_passagers > 0),
  nombre_bagages integer NOT NULL DEFAULT 0 CHECK (nombre_bagages >= 0),
  informations_supplementaires text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE airport_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_transfers ENABLE ROW LEVEL SECURITY;

-- Policies for airport_transfers
CREATE POLICY "Anyone can insert airport transfers"
  ON airport_transfers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own airport transfers"
  ON airport_transfers
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Policies for station_transfers
CREATE POLICY "Anyone can insert station transfers"
  ON station_transfers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own station transfers"
  ON station_transfers
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
