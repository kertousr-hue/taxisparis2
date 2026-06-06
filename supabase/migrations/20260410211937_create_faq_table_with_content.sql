/*
  # Create FAQ table with initial content

  1. New Tables
    - `faq`
      - `id` (uuid, primary key)
      - `question` (text) - La question
      - `answer` (text) - La réponse (supporte HTML)
      - `category` (text) - Catégorie de la FAQ
      - `display_order` (integer) - Ordre d'affichage
      - `is_published` (boolean) - Visible au public
      - `created_at` / `updated_at` (timestamptz)

  2. Security
    - RLS activé
    - Le public peut lire les FAQs publiées
    - Les admins authentifiés peuvent tout gérer

  3. Content
    - 20 questions/réponses réparties en 6 catégories
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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faq' AND policyname = 'Public can view published FAQs') THEN
    CREATE POLICY "Public can view published FAQs"
      ON faq FOR SELECT TO public
      USING (is_published = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faq' AND policyname = 'Admins can view all FAQs') THEN
    CREATE POLICY "Admins can view all FAQs"
      ON faq FOR SELECT TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faq' AND policyname = 'Admins can insert FAQs') THEN
    CREATE POLICY "Admins can insert FAQs"
      ON faq FOR INSERT TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faq' AND policyname = 'Admins can update FAQs') THEN
    CREATE POLICY "Admins can update FAQs"
      ON faq FOR UPDATE TO authenticated
      USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faq' AND policyname = 'Admins can delete FAQs') THEN
    CREATE POLICY "Admins can delete FAQs"
      ON faq FOR DELETE TO authenticated
      USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
CREATE INDEX IF NOT EXISTS idx_faq_display_order ON faq(display_order);
CREATE INDEX IF NOT EXISTS idx_faq_published ON faq(is_published);

CREATE OR REPLACE FUNCTION update_faq_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_faq_updated_at ON faq;
CREATE TRIGGER update_faq_updated_at
  BEFORE UPDATE ON faq
  FOR EACH ROW
  EXECUTE FUNCTION update_faq_updated_at();

INSERT INTO faq (question, answer, category, display_order, is_published) VALUES

-- Général
('Qu''est-ce qu''un taxi conventionné ?',
 '<p>Un taxi conventionné est un taxi ayant signé une convention avec l''Assurance Maladie. Grâce à cette convention, les patients peuvent bénéficier d''une <strong>prise en charge totale ou partielle</strong> de leurs frais de transport médical par la Sécurité Sociale.</p><p>Nos chauffeurs sont agréés et respectent les tarifs réglementés fixés par la convention nationale.</p>',
 'Général', 1, true),

('Quelle est la différence entre un taxi conventionné et un VSL ?',
 '<p>Le <strong>taxi conventionné</strong> est un taxi classique agréé par l''Assurance Maladie pour le transport médical. Il peut transporter jusqu''à 3 patients.</p><p>Le <strong>VSL (Véhicule Sanitaire Léger)</strong> est un véhicule spécifiquement aménagé pour le transport sanitaire, avec du matériel médical de base. Le VSL est souvent prescrit pour des patients nécessitant une assistance particulière.</p><p>Dans les deux cas, une prescription médicale de transport est nécessaire pour un remboursement.</p>',
 'Général', 2, true),

('Où opérez-vous ?',
 '<p>Nous desservons l''ensemble de l''<strong>Île-de-France</strong> :</p><ul><li>Paris (75) – tous les arrondissements</li><li>Essonne (91)</li><li>Hauts-de-Seine (92)</li><li>Seine-Saint-Denis (93)</li><li>Val-de-Marne (94)</li></ul><p>Nous assurons également les trajets vers et depuis tous les <strong>aéroports parisiens</strong> (CDG, Orly, Le Bourget) et les <strong>grandes gares parisiennes</strong>.</p>',
 'Général', 3, true),

('Êtes-vous disponibles 24h/24 et 7j/7 ?',
 '<p>Oui, notre service est disponible <strong>24 heures sur 24, 7 jours sur 7</strong>, y compris les week-ends et jours fériés.</p><p>Pour les trajets planifiés (rendez-vous médicaux, hospitalisations programmées), nous vous recommandons de réserver au moins <strong>24 à 48h à l''avance</strong> pour garantir la disponibilité d''un véhicule.</p>',
 'Général', 4, true),

-- Remboursement
('Comment fonctionne le remboursement par la Sécurité Sociale ?',
 '<p>Le remboursement de votre transport médical dépend de votre situation :</p><ul><li><strong>65%</strong> pris en charge par l''Assurance Maladie (cas général), le reste à votre charge ou votre mutuelle</li><li><strong>100%</strong> pour les patients en ALD (Affection de Longue Durée), maternité, accident du travail, ou bénéficiaires de la C2S</li></ul><p>Pour bénéficier du remboursement, vous devez présenter une <strong>prescription médicale de transport</strong> valide.</p>',
 'Remboursement', 5, true),

('Qu''est-ce qu''une prescription médicale de transport ?',
 '<p>La prescription médicale de transport (PMT) est un document délivré par votre médecin (généraliste ou spécialiste) qui atteste que votre état de santé justifie un transport en taxi conventionné ou VSL.</p><p>Elle doit mentionner :</p><ul><li>Votre nom et prénom</li><li>Le motif médical du transport</li><li>Le type de transport préconisé (assis ou allongé)</li><li>La destination (hôpital, clinique, cabinet médical…)</li></ul><p>Sans ce document, le remboursement ne pourra pas être effectué.</p>',
 'Remboursement', 6, true),

('Ma mutuelle peut-elle prendre en charge le reste à payer ?',
 '<p>Oui, dans la majorité des cas, votre <strong>mutuelle ou complémentaire santé</strong> peut prendre en charge le ticket modérateur (la partie non remboursée par la Sécurité Sociale).</p><p>Contactez votre mutuelle pour connaître les conditions exactes de prise en charge et les documents nécessaires.</p>',
 'Remboursement', 7, true),

('Comment se passe la facturation ?',
 '<p>Pour un transport avec prise en charge Sécurité Sociale :</p><ul><li>Vous présentez votre <strong>carte Vitale</strong> et votre <strong>prescription médicale</strong> au chauffeur</li><li>La feuille de soins est transmise directement à votre caisse d''Assurance Maladie</li><li>Vous ne payez que votre part (ticket modérateur) ou rien du tout si vous êtes en 100%</li></ul><p>Pour les transports privés (aéroport, gare, sans ordonnance), un paiement direct est requis par carte bancaire ou espèces.</p>',
 'Remboursement', 8, true),

-- Réservation
('Comment réserver un taxi conventionné ?',
 '<p>Vous pouvez réserver de plusieurs façons :</p><ul><li><strong>En ligne</strong> : via notre formulaire de réservation sur le site, disponible 24h/24</li><li><strong>Par téléphone</strong> : en nous appelant directement pour une prise en charge rapide</li></ul><p>Pour les rendez-vous médicaux planifiés, réservez idéalement <strong>48h à l''avance</strong>. Pour les urgences, nous faisons notre possible pour intervenir rapidement.</p>',
 'Réservation', 9, true),

('Puis-je annuler ou modifier ma réservation ?',
 '<p>Oui, vous pouvez annuler ou modifier votre réservation :</p><ul><li><strong>Sans frais</strong> si l''annulation est effectuée au moins <strong>24h avant</strong> le départ</li><li><strong>Frais d''annulation possibles</strong> pour toute annulation tardive (moins de 24h)</li></ul><p>Pour modifier votre réservation, contactez-nous par téléphone dès que possible.</p>',
 'Réservation', 10, true),

('Combien de temps à l''avance dois-je réserver pour un aéroport ?',
 '<p>Pour les transferts aéroport, nous recommandons de réserver <strong>au minimum 48h à l''avance</strong>, idéalement plus tôt en période de forte affluence (vacances scolaires, fêtes).</p><p>Nous surveillons votre vol et adaptons l''heure de prise en charge en fonction des éventuels retards ou avances.</p>',
 'Réservation', 11, true),

-- Véhicules & Confort
('Les véhicules sont-ils adaptés aux personnes à mobilité réduite ?',
 '<p>Oui, nous disposons de véhicules adaptés aux <strong>personnes à mobilité réduite (PMR)</strong> :</p><ul><li>Véhicules spacieux facilitant l''entrée et la sortie</li><li>Aide à l''embarquement assurée par le chauffeur</li><li>Transport de fauteuil roulant pliant possible</li></ul><p>Précisez vos besoins spécifiques lors de la réservation afin que nous puissions envoyer le véhicule le plus adapté.</p>',
 'Véhicules & Confort', 12, true),

('Puis-je transporter des bagages ?',
 '<p>Oui, nos véhicules disposent d''un espace bagages suffisant pour :</p><ul><li>Valises et sacs de voyage pour les transferts aéroport/gare</li><li>Matériel médical léger (perfusion portable, bouteille d''oxygène légère…)</li></ul><p>Pour des volumes importants ou du matériel médical spécifique, merci de nous le signaler à la réservation.</p>',
 'Véhicules & Confort', 13, true),

('Vos véhicules sont-ils climatisés et propres ?',
 '<p>Tous nos véhicules sont :</p><ul><li><strong>Climatisés</strong> pour votre confort en toutes saisons</li><li><strong>Nettoyés et désinfectés</strong> régulièrement, particulièrement après chaque transport médical</li><li>Soumis à des <strong>contrôles techniques</strong> réguliers pour garantir votre sécurité</li></ul>',
 'Véhicules & Confort', 14, true),

-- Chauffeurs
('Les chauffeurs sont-ils professionnels et formés ?',
 '<p>Tous nos chauffeurs sont :</p><ul><li>Titulaires de la <strong>carte professionnelle</strong> de conducteur de taxi</li><li>Formés au <strong>transport de personnes malades ou fragiles</strong></li><li>Sensibilisés aux <strong>gestes de premiers secours</strong></li><li>Discrets et respectueux de la <strong>confidentialité médicale</strong></li></ul><p>Ils connaissent parfaitement les établissements de santé d''Île-de-France et leurs accès spécifiques.</p>',
 'Chauffeurs', 15, true),

('Le chauffeur peut-il m''accompagner à l''intérieur de l''hôpital ?',
 '<p>En cas de besoin, notre chauffeur peut vous accompagner jusqu''à l''<strong>accueil de l''établissement</strong> de santé. Cela dépend des règles internes de chaque hôpital ou clinique.</p><p>Si vous avez besoin d''une assistance particulière (fauteuil roulant, aide au déplacement), précisez-le lors de la réservation.</p>',
 'Chauffeurs', 16, true),

-- Tarifs & Paiement
('Quels sont vos tarifs ?',
 '<p>Les tarifs des taxis conventionnés sont <strong>réglementés</strong> et fixés par la convention nationale avec l''Assurance Maladie. Ils dépendent de :</p><ul><li>La distance parcourue</li><li>L''heure de prise en charge (tarif de nuit, week-end, jour férié)</li><li>La zone géographique</li></ul><p>Pour un devis personnalisé sur un trajet spécifique, contactez-nous directement.</p>',
 'Tarifs & Paiement', 17, true),

('Quels moyens de paiement acceptez-vous ?',
 '<p>Nous acceptons :</p><ul><li><strong>Carte bancaire</strong> (Visa, Mastercard)</li><li><strong>Espèces</strong></li><li><strong>Chèque</strong> (sous conditions)</li></ul><p>Pour les transports médicaux avec prescription, la prise en charge Sécurité Sociale est gérée directement via votre carte Vitale. Vous ne payez que votre part résiduelle.</p>',
 'Tarifs & Paiement', 18, true),

('Y a-t-il des suppléments pour les aéroports ou les nuits ?',
 '<p>Oui, certains suppléments peuvent s''appliquer conformément à la réglementation taxi :</p><ul><li><strong>Supplément aéroport</strong> : pour les départs et arrivées à CDG, Orly et Le Bourget</li><li><strong>Tarif de nuit</strong> : entre 19h et 7h</li><li><strong>Week-end et jours fériés</strong> : tarif majoré</li></ul><p>Ces suppléments sont légalement encadrés et transparents. Ils vous seront communiqués avant la course.</p>',
 'Tarifs & Paiement', 19, true),

('Puis-je obtenir une facture pour mon employeur ou ma mutuelle ?',
 '<p>Oui, nous délivrons une <strong>facture ou un reçu</strong> pour chaque course sur demande. Ce document est accepté par la plupart des mutuelles et complémentaires santé pour le remboursement du ticket modérateur.</p><p>Précisez votre besoin lors de la réservation ou demandez-le directement au chauffeur.</p>',
 'Tarifs & Paiement', 20, true)

ON CONFLICT (id) DO NOTHING;
