/*
  # Ajouter politique d'upload pour utilisateurs anonymes
  
  1. Modifications
    - Ajoute une politique permettant aux utilisateurs anonymes (anon key) d'uploader des médias
    - Permet l'upload via l'interface admin sans authentification complète
  
  2. Sécurité
    - Permet INSERT pour le rôle 'anon' sur le bucket 'media'
    - Les autres opérations (UPDATE, DELETE) restent limitées aux utilisateurs authentifiés
*/

-- Supprimer la politique si elle existe déjà
DROP POLICY IF EXISTS "Anonymous users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can read media" ON storage.objects;

-- Ajouter politique d'upload pour les utilisateurs anonymes
CREATE POLICY "Anonymous users can upload media"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'media');

-- Ajouter politique de lecture pour les utilisateurs anonymes
CREATE POLICY "Anonymous users can read media"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'media');
