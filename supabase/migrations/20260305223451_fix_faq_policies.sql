/*
  # Correction des politiques RLS de la table FAQ

  1. Suppression
    - Supprime toutes les politiques existantes pour éviter les doublons

  2. Recréation
    - Une seule politique SELECT publique pour les FAQ publiées
    - Politiques admin pour INSERT/UPDATE/DELETE

  3. Sécurité
    - Lecture publique (anon + authenticated) des FAQ publiées uniquement
    - Modification réservée aux admins authentifiés
*/

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Anyone can read published FAQ" ON faq;
DROP POLICY IF EXISTS "Anyone can view published FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated admins can delete FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated admins can insert FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated admins can update FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated users can delete FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated users can insert FAQ" ON faq;
DROP POLICY IF EXISTS "Authenticated users can update FAQ" ON faq;

-- Créer une politique SELECT publique (anon + authenticated)
CREATE POLICY "Public can view published FAQ"
  ON faq FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Politiques admin pour modification
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