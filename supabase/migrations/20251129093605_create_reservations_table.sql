/*
  # Create reservations table for taxi booking system

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key) - Unique identifier for each reservation
      - `nom` (text) - Last name of the customer
      - `prenom` (text) - First name of the customer
      - `telephone` (text) - Phone number
      - `email` (text) - Email address
      - `adresse_depart` (text) - Departure address
      - `adresse_arrivee` (text) - Arrival address
      - `distance_km` (numeric) - Distance in kilometers
      - `temps_trajet` (text) - Travel time
      - `date_rdv` (date) - Appointment date
      - `heure_rdv` (time) - Appointment time
      - `ald_cmu` (boolean) - ALD/CMU checkbox
      - `prescription_medicale` (boolean) - Medical prescription checkbox
      - `created_at` (timestamptz) - Timestamp of reservation creation
      - `statut` (text) - Status of reservation (pending, confirmed, completed, cancelled)

  2. Security
    - Enable RLS on `reservations` table
    - Add policy for public to insert reservations
    - Add policy for authenticated users to view all reservations
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  telephone text NOT NULL,
  email text NOT NULL,
  adresse_depart text NOT NULL,
  adresse_arrivee text NOT NULL,
  distance_km numeric,
  temps_trajet text,
  date_rdv date NOT NULL,
  heure_rdv time NOT NULL,
  ald_cmu boolean DEFAULT false,
  prescription_medicale boolean DEFAULT false,
  statut text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create reservations"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);