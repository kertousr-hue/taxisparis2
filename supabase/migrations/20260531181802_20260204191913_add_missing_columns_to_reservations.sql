/*
  # Add missing columns to reservations table
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