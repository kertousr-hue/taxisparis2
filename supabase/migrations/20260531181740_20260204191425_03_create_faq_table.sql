/*
  # Create FAQ table with initial content
*/

CREATE TABLE IF NOT EXISTS faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'Général',
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published FAQs"
  ON faq
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated admins can view all FAQs"
  ON faq
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can insert FAQs"
  ON faq
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update FAQs"
  ON faq
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete FAQs"
  ON faq
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
CREATE INDEX IF NOT EXISTS idx_faq_display_order ON faq(display_order);
CREATE INDEX IF NOT EXISTS idx_faq_published ON faq(is_published);

DROP TRIGGER IF EXISTS update_faq_updated_at ON faq;
CREATE TRIGGER update_faq_updated_at
  BEFORE UPDATE ON faq
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();