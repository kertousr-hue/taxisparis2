/*
  # Create FAQ table (correct schema)

  The frontend uses table name `faq` with column `is_published`.

  1. New Tables
    - `faq`
      - `id` (uuid, primary key)
      - `question` (text, not null)
      - `answer` (text, not null)
      - `category` (text, default 'General')
      - `display_order` (integer, default 0)
      - `is_published` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `faq` table
    - Public read for published items
    - Admin write access
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

-- Public can read published FAQ items
CREATE POLICY "Anyone can read published faq items"
  ON faq
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admin users can insert
CREATE POLICY "Admin users can insert faq"
  ON faq
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admin users can update
CREATE POLICY "Admin users can update faq"
  ON faq
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admin users can delete
CREATE POLICY "Admin users can delete faq"
  ON faq
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
