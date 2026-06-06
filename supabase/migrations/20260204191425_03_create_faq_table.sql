/*
  # Create FAQ table

  1. New Tables
    - `faq`
      - `id` (uuid, primary key) - Unique identifier for each FAQ item
      - `question` (text) - The FAQ question
      - `answer` (text) - The FAQ answer (supports HTML)
      - `category` (text) - Category of the FAQ (e.g., "Général", "Remboursement", etc.)
      - `display_order` (integer) - Order in which FAQs should be displayed
      - `is_published` (boolean) - Whether the FAQ is visible to public
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `faq` table
    - Anyone can view published FAQs
    - Authenticated admins can manage all FAQs
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

INSERT INTO faq (question, answer, category, display_order, is_published) VALUES
('Qu''est-ce qu''un taxi conventionné ?', 'Un taxi conventionné est un taxi qui a signé une convention avec l''Assurance Maladie. Cela permet aux patients de bénéficier d''une prise en charge de leurs frais de transport pour des raisons médicales.', 'Général', 1, true),
('Comment se faire rembourser par la Sécurité Sociale ?', 'Pour être remboursé, vous devez avoir une prescription médicale de transport délivrée par votre médecin. Le taux de remboursement est de 65% dans la plupart des cas, et 100% pour les patients en ALD (Affection de Longue Durée) ou bénéficiaires de la CMU.', 'Remboursement', 2, true),
('Quels documents dois-je fournir ?', 'Vous devez fournir : une prescription médicale de transport, votre carte Vitale, votre attestation de droits, et éventuellement votre attestation ALD ou CMU.', 'Documents', 3, true),
('Comment réserver un taxi conventionné ?', 'Vous pouvez réserver directement sur notre site via le formulaire de réservation, ou nous appeler. Il est recommandé de réserver à l''avance, surtout pour les rendez-vous médicaux planifiés.', 'Réservation', 4, true),
('Quelles sont les zones desservies ?', 'Nous desservons toute l''Île-de-France : Paris (75), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), et Val-de-Marne (94). Nous assurons également les transferts vers les aéroports et gares parisiennes.', 'Zones', 5, true),
('Puis-je annuler ma réservation ?', 'Oui, vous pouvez annuler votre réservation. Merci de nous prévenir au moins 24h à l''avance pour les annulations sans frais. Pour toute annulation tardive, des frais peuvent s''appliquer.', 'Réservation', 6, true),
('Quels types de véhicules proposez-vous ?', 'Nous proposons des taxis conventionnés et des VSL (Véhicules Sanitaires Légers). Tous nos véhicules sont adaptés au transport de personnes à mobilité réduite et équipés pour assurer votre confort.', 'Véhicules', 7, true),
('Les chauffeurs sont-ils formés ?', 'Tous nos chauffeurs sont des professionnels agréés et formés au transport de personnes. Ils sont également sensibilisés aux besoins spécifiques des patients et respectent les normes d''hygiène et de sécurité.', 'Chauffeurs', 8, true)
ON CONFLICT (id) DO NOTHING;