/*
  # Update reservations table

  1. Changes
    - Add missing columns: duree_minutes, ip_client, user_agent
    - Modify ald_cmu and prescription_medicale to text type
    - Update column types to match requirements
  
  2. Security
    - RLS is already enabled
    - Will add INSERT policy for anon and authenticated users
*/

-- Add missing columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'duree_minutes'
  ) THEN
    ALTER TABLE reservations ADD COLUMN duree_minutes integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'ip_client'
  ) THEN
    ALTER TABLE reservations ADD COLUMN ip_client text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE reservations ADD COLUMN user_agent text;
  END IF;
END $$;

-- Modify ald_cmu to text if it's boolean
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' 
    AND column_name = 'ald_cmu' 
    AND data_type = 'boolean'
  ) THEN
    ALTER TABLE reservations ALTER COLUMN ald_cmu TYPE text USING 
      CASE WHEN ald_cmu THEN 'oui' ELSE 'non' END;
  END IF;
END $$;

-- Rename prescription_medicale to prescription if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'prescription_medicale'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'reservations' AND column_name = 'prescription_medicale'
      AND data_type = 'boolean'
    ) THEN
      ALTER TABLE reservations ALTER COLUMN prescription_medicale TYPE text USING 
        CASE WHEN prescription_medicale THEN 'oui' ELSE 'non' END;
    END IF;
    ALTER TABLE reservations RENAME COLUMN prescription_medicale TO prescription;
  END IF;
END $$;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "allow_insert" ON reservations;
DROP POLICY IF EXISTS "Users can view own profile" ON reservations;
DROP POLICY IF EXISTS "Users can insert own data" ON reservations;

-- Create the INSERT policy for anon and authenticated users
CREATE POLICY "allow_insert" ON reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);