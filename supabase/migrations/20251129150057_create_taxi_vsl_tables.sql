/*
  # Create Taxi VSL Tables

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key) - Unique identifier
      - `nom` (text) - Last name
      - `prenom` (text) - First name
      - `telephone` (text) - Phone number
      - `email` (text) - Email address
      - `date_rdv` (date) - Appointment date
      - `heure_rdv` (text) - Appointment time
      - `adresse_depart` (text) - Departure address
      - `adresse_arrivee` (text) - Arrival address
      - `created_at` (timestamptz) - Creation timestamp

    - `contacts`
      - `id` (uuid, primary key) - Unique identifier
      - `nom` (text) - Name
      - `email` (text) - Email address
      - `telephone` (text) - Phone number
      - `message` (text) - Contact message
      - `created_at` (timestamptz) - Creation timestamp

    - `clients`
      - `id` (uuid, primary key) - Unique identifier
      - `nom` (text) - Last name
      - `prenom` (text) - First name
      - `telephone` (text) - Phone number
      - `email` (text) - Email address
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Allow anonymous users to INSERT and SELECT
    - Allow only authenticated users to UPDATE and DELETE
*/

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text NOT NULL,
  email text NOT NULL,
  date_rdv date NOT NULL,
  heure_rdv text NOT NULL,
  adresse_depart text NOT NULL,
  adresse_arrivee text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reservations table
CREATE POLICY "Allow anonymous insert on reservations"
  ON reservations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on reservations"
  ON reservations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated update on reservations"
  ON reservations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on reservations"
  ON reservations FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for contacts table
CREATE POLICY "Allow anonymous insert on contacts"
  ON contacts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on contacts"
  ON contacts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated update on contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for clients table
CREATE POLICY "Allow anonymous insert on clients"
  ON clients FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on clients"
  ON clients FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated update on clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on clients"
  ON clients FOR DELETE
  TO authenticated
  USING (true);