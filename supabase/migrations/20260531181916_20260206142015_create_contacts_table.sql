/*
  # Add missing columns and policies to contacts table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contacts' AND column_name = 'statut'
  ) THEN
    ALTER TABLE contacts ADD COLUMN statut text DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'lu', 'traité'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contacts' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE contacts ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

DROP POLICY IF EXISTS "Allow anonymous users to insert contacts" ON contacts;
DROP POLICY IF EXISTS "Allow admins to read all contacts" ON contacts;
DROP POLICY IF EXISTS "Allow admins to update contacts" ON contacts;
DROP POLICY IF EXISTS "Allow admins to delete contacts" ON contacts;

CREATE POLICY "Allow anonymous users to insert contacts"
  ON contacts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow admins to read all contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admins to update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admins to delete contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_statut ON contacts(statut);