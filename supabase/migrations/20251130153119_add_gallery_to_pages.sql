/*
  # Ajout de galerie photos pour les pages de départements

  1. Modifications
    - Ajout d'une colonne `gallery` de type JSONB pour stocker les photos de chaque page
    - La structure du JSON sera : [{ "url": "...", "alt": "...", "caption": "..." }, ...]
  
  2. Notes
    - Permet d'ajouter plusieurs photos à chaque page de département
    - Compatible avec les pages existantes (valeur par défaut: tableau vide)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'gallery'
  ) THEN
    ALTER TABLE pages ADD COLUMN gallery JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

COMMENT ON COLUMN pages.gallery IS 'Galerie de photos pour la page (tableau d''objets avec url, alt, caption)';
