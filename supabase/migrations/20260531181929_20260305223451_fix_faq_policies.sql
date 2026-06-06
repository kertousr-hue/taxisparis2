/*
  # Correction des politiques RLS de la table FAQ
*/

DROP POLICY IF EXISTS "Anyone can read published FAQ" ON faq;
DROP POLICY IF EXISTS "Anyone can view published FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated admins can delete FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated admins can insert FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated admins can update FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated users can delete FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated users can insert FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated users can update FAQ" ON faq;
DROP POLICY IF EXISTS "Public can view published FAQs" ON faq;
DROP POLICY IF EXISTS "Anon can view all FAQs" ON faq;
DROP POLICY IF EXISTS "Anon can insert FAQs" ON faq;
DROP POLICY IF EXISTS "Anon can update FAQs" ON faq;
DROP POLICY IF EXISTS "Anon can delete FAQs" ON faq;

CREATE POLICY "Public can view published FAQ"
  ON faq FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can insert FAQ"
  ON faq FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update FAQ"
  ON faq FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete FAQ"
  ON faq FOR DELETE
  TO authenticated
  USING (true);