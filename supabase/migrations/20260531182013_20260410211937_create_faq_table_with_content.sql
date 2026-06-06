/*
  # Create FAQ table with initial content (20 questions)
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
('Qu''est-ce qu''un taxi conventionné ?',
 '<p>Un taxi conventionné est un taxi ayant signé une convention avec l''Assurance Maladie. Grâce à cette convention, les patients peuvent bénéficier d''une <strong>prise en charge totale ou partielle</strong> de leurs frais de transport médical par la Sécurité Sociale.</p>',
 'Général', 1, true),
('Quelle est la différence entre un taxi conventionné et un VSL ?',
 '<p>Le <strong>taxi conventionné</strong> est un taxi classique agréé par l''Assurance Maladie. Le <strong>VSL (Véhicule Sanitaire Léger)</strong> est spécifiquement aménagé pour le transport sanitaire. Dans les deux cas, une prescription médicale est nécessaire pour un remboursement.</p>',
 'Général', 2, true),
('Où opérez-vous ?',
 '<p>Nous desservons l''ensemble de l''<strong>Île-de-France</strong> : Paris (75), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), ainsi que tous les aéroports et grandes gares parisiennes.</p>',
 'Général', 3, true),
('Êtes-vous disponibles 24h/24 et 7j/7 ?',
 '<p>Oui, notre service est disponible <strong>24 heures sur 24, 7 jours sur 7</strong>. Pour les trajets planifiés, réservez au moins <strong>24 à 48h à l''avance</strong>.</p>',
 'Général', 4, true),
('Comment fonctionne le remboursement par la Sécurité Sociale ?',
 '<p><strong>65%</strong> pris en charge en cas général, <strong>100%</strong> pour les patients en ALD, maternité ou bénéficiaires de la C2S. Une <strong>prescription médicale de transport</strong> valide est obligatoire.</p>',
 'Remboursement', 5, true),
('Qu''est-ce qu''une prescription médicale de transport ?',
 '<p>Document délivré par votre médecin attestant que votre état de santé justifie un transport en taxi conventionné ou VSL. Sans ce document, aucun remboursement n''est possible.</p>',
 'Remboursement', 6, true),
('Ma mutuelle peut-elle prendre en charge le reste à payer ?',
 '<p>Oui, votre <strong>mutuelle</strong> peut prendre en charge le ticket modérateur. Contactez votre mutuelle pour connaître les conditions exactes.</p>',
 'Remboursement', 7, true),
('Comment se passe la facturation ?',
 '<p>Vous présentez votre <strong>carte Vitale</strong> et votre <strong>prescription médicale</strong> au chauffeur. La feuille de soins est transmise directement à votre caisse. Vous ne payez que votre part ou rien si vous êtes à 100%.</p>',
 'Remboursement', 8, true),
('Comment réserver un taxi conventionné ?',
 '<p>Réservez <strong>en ligne</strong> via notre formulaire ou <strong>par téléphone</strong>. Pour les rendez-vous planifiés, réservez idéalement <strong>48h à l''avance</strong>.</p>',
 'Réservation', 9, true),
('Puis-je annuler ou modifier ma réservation ?',
 '<p>Oui, sans frais si l''annulation est effectuée au moins <strong>24h avant</strong> le départ. Contactez-nous par téléphone pour toute modification.</p>',
 'Réservation', 10, true),
('Combien de temps à l''avance dois-je réserver pour un aéroport ?',
 '<p>Nous recommandons de réserver <strong>au minimum 48h à l''avance</strong> pour les transferts aéroport, plus tôt en période de forte affluence.</p>',
 'Réservation', 11, true),
('Les véhicules sont-ils adaptés aux personnes à mobilité réduite ?',
 '<p>Oui, nous disposons de véhicules adaptés aux <strong>PMR</strong> avec aide à l''embarquement et transport de fauteuil roulant pliant possible.</p>',
 'Véhicules & Confort', 12, true),
('Puis-je transporter des bagages ?',
 '<p>Oui, nos véhicules disposent d''un espace bagages suffisant pour valises et matériel médical léger. Signalez vos besoins à la réservation.</p>',
 'Véhicules & Confort', 13, true),
('Vos véhicules sont-ils climatisés et propres ?',
 '<p>Tous nos véhicules sont <strong>climatisés</strong>, <strong>nettoyés et désinfectés</strong> régulièrement, et soumis à des <strong>contrôles techniques</strong> réguliers.</p>',
 'Véhicules & Confort', 14, true),
('Les chauffeurs sont-ils professionnels et formés ?',
 '<p>Tous nos chauffeurs sont titulaires de la <strong>carte professionnelle</strong>, formés au transport de personnes fragiles et sensibilisés aux <strong>gestes de premiers secours</strong>.</p>',
 'Chauffeurs', 15, true),
('Le chauffeur peut-il m''accompagner à l''intérieur de l''hôpital ?',
 '<p>En cas de besoin, le chauffeur peut vous accompagner jusqu''à l''<strong>accueil de l''établissement</strong>. Précisez votre besoin lors de la réservation.</p>',
 'Chauffeurs', 16, true),
('Quels sont vos tarifs ?',
 '<p>Les tarifs sont <strong>réglementés</strong> par la convention nationale avec l''Assurance Maladie. Ils dépendent de la distance, de l''heure et de la zone. Contactez-nous pour un devis personnalisé.</p>',
 'Tarifs & Paiement', 17, true),
('Quels moyens de paiement acceptez-vous ?',
 '<p>Nous acceptons la <strong>carte bancaire</strong>, les <strong>espèces</strong> et le <strong>chèque</strong> (sous conditions). Pour les transports médicaux, la prise en charge Sécu est gérée via votre carte Vitale.</p>',
 'Tarifs & Paiement', 18, true),
('Y a-t-il des suppléments pour les aéroports ou les nuits ?',
 '<p>Oui : <strong>supplément aéroport</strong> (CDG, Orly, Le Bourget), <strong>tarif de nuit</strong> (19h–7h), <strong>week-end et jours fériés</strong>. Ces suppléments sont légalement encadrés et communiqués avant la course.</p>',
 'Tarifs & Paiement', 19, true),
('Puis-je obtenir une facture pour mon employeur ou ma mutuelle ?',
 '<p>Oui, nous délivrons une <strong>facture ou un reçu</strong> pour chaque course sur demande, accepté par la plupart des mutuelles.</p>',
 'Tarifs & Paiement', 20, true)
ON CONFLICT (id) DO NOTHING;