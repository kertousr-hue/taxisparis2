/*
  # Update station_transfers table structure

  1. Changes
    - Remove type_trajet column
    - Remove adresse column
    - Add adresse_depart column (text, not null)
    - Add adresse_arrivee column (text, not null)
    - Add distance_km column (numeric)
    - Add duree_minutes column (integer)
  
  2. Notes
    - These changes optimize the form for better user experience
    - Distance and duration are now stored for each transfer
    - Separate departure and arrival addresses for clarity
*/

DO $$ 
BEGIN
  -- Remove old columns if they exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'station_transfers' AND column_name = 'type_trajet'
  ) THEN
    ALTER TABLE station_transfers DROP COLUMN type_trajet;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'station_transfers' AND column_name = 'adresse'
  ) THEN
    ALTER TABLE station_transfers DROP COLUMN adresse;
  END IF;

  -- Add new columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'station_transfers' AND column_name = 'adresse_depart'
  ) THEN
    ALTER TABLE station_transfers ADD COLUMN adresse_depart text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'station_transfers' AND column_name = 'adresse_arrivee'
  ) THEN
    ALTER TABLE station_transfers ADD COLUMN adresse_arrivee text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'station_transfers' AND column_name = 'distance_km'
  ) THEN
    ALTER TABLE station_transfers ADD COLUMN distance_km numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'station_transfers' AND column_name = 'duree_minutes'
  ) THEN
    ALTER TABLE station_transfers ADD COLUMN duree_minutes integer;
  END IF;
END $$;
