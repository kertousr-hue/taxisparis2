/*
  # Add missing columns to reservations table

  1. Changes to `reservations` table
    - Add `duree_min` (numeric) - Estimated duration in minutes
    - Add `numero_vol` (text) - Flight number for airport transfers
    - Add `numero_train` (text) - Train number for station transfers
    - Add `nombre_passagers` (integer) - Number of passengers
    - Add `nombre_bagages` (integer) - Number of luggage items
    - Add `message` (text) - Additional customer message
    - Add `type_trajet` (text) - Type of trip (vsl, aeroport, gare, autre)
    - Add `prescription` (boolean) - Alias for prescription_medicale for compatibility

  2. Notes
    - All new columns are nullable to maintain compatibility with existing data
    - type_trajet defaults to 'autre' (other)
    - These columns enable full functionality of the reservation system
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'duree_min'
  ) THEN
    ALTER TABLE reservations ADD COLUMN duree_min numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'numero_vol'
  ) THEN
    ALTER TABLE reservations ADD COLUMN numero_vol text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'numero_train'
  ) THEN
    ALTER TABLE reservations ADD COLUMN numero_train text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'nombre_passagers'
  ) THEN
    ALTER TABLE reservations ADD COLUMN nombre_passagers integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'nombre_bagages'
  ) THEN
    ALTER TABLE reservations ADD COLUMN nombre_bagages integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'message'
  ) THEN
    ALTER TABLE reservations ADD COLUMN message text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'type_trajet'
  ) THEN
    ALTER TABLE reservations ADD COLUMN type_trajet text DEFAULT 'autre';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'prescription'
  ) THEN
    ALTER TABLE reservations ADD COLUMN prescription boolean DEFAULT false;
  END IF;
END $$;