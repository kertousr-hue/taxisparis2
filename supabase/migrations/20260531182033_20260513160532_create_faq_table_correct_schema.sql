/*
  # Create FAQ table (correct schema — final)
*/

CREATE TABLE IF NOT EXISTS faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'Général',
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published faq items" ON faq;
DROP POLICY IF EXISTS "Admin users can insert faq" ON faq;
DROP POLICY IF EXISTS "Admin users can update faq" ON faq;
DROP POLICY IF EXISTS "Admin users can delete faq" ON faq;

CREATE POLICY "Anyone can read published faq items"
  ON faq
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admin users can insert faq"
  ON faq
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update faq"
  ON faq
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin users can delete faq"
  ON faq
  FOR DELETE
  TO authenticated
  USING (true);