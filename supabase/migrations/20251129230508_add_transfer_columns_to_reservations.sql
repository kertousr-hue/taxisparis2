/*
  # Add transfer-specific columns to reservations table

  1. Changes
    - Add `numero_vol` (text) - Flight number for airport transfers
    - Add `numero_train` (text) - Train number for station transfers
    - Add `nombre_passagers` (integer) - Number of passengers
    - Add `nombre_bagages` (integer) - Number of luggage items
    - Add `message` (text) - Additional information/notes
    - Add `type_trajet` (text) - Type of journey (vsl, gare, aeroport)
    - Add `duree_min` (integer) - Alternative duration field name

  2. Notes
    - All new columns are optional (nullable)
    - Safe idempotent execution using IF NOT EXISTS checks
*/

-- Add numero_vol column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'numero_vol'
  ) THEN
    ALTER TABLE reservations ADD COLUMN numero_vol text;
  END IF;
END $$;

-- Add numero_train column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'numero_train'
  ) THEN
    ALTER TABLE reservations ADD COLUMN numero_train text;
  END IF;
END $$;

-- Add nombre_passagers column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'nombre_passagers'
  ) THEN
    ALTER TABLE reservations ADD COLUMN nombre_passagers integer;
  END IF;
END $$;

-- Add nombre_bagages column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'nombre_bagages'
  ) THEN
    ALTER TABLE reservations ADD COLUMN nombre_bagages integer;
  END IF;
END $$;

-- Add message column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'message'
  ) THEN
    ALTER TABLE reservations ADD COLUMN message text;
  END IF;
END $$;

-- Add type_trajet column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'type_trajet'
  ) THEN
    ALTER TABLE reservations ADD COLUMN type_trajet text;
  END IF;
END $$;

-- Add duree_min column (alternative duration field)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'duree_min'
  ) THEN
    ALTER TABLE reservations ADD COLUMN duree_min integer;
  END IF;
END $$;