/*
  # Fix FAQ RLS policies for anonymous access
*/

DROP POLICY IF EXISTS "Anyone can view published FAQs" ON faq;
DROP POLICY IF EXISTS "Authenticated admins can view all FAQs" ON faq;
DROP POLICY IF EXISTS "Authenticated admins can insert FAQs" ON faq;
DROP POLICY IF EXISTS "Authenticated admins can update FAQs" ON faq;
DROP POLICY IF EXISTS "Authenticated admins can delete FAQs" ON faq;

CREATE POLICY "Public can view published FAQs"
  ON faq FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Anon can view all FAQs"
  ON faq FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert FAQs"
  ON faq FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update FAQs"
  ON faq FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete FAQs"
  ON faq FOR DELETE
  TO anon
  USING (true);