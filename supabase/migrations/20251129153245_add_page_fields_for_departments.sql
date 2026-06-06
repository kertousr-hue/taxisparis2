/*
  # Ajouter des champs supplémentaires pour les pages

  1. Modifications de la table pages
    - Ajout du champ `hero_title` (titre principal de la section hero)
    - Ajout du champ `hero_subtitle` (sous-titre de la section hero)
    - Ajout du champ `hero_button_text` (texte du bouton CTA)
    - Ajout du champ `hero_button_link` (lien du bouton CTA)
    - Ajout du champ `sections` (JSONB pour stocker plusieurs sections de contenu)
    - Ajout du champ `meta_title` (titre SEO spécifique)
    - Modification du champ `content` pour accepter du HTML/texte simple
    
  2. Structure des sections (JSONB)
    Chaque section peut contenir:
    - type: 'text' | 'services' | 'features' | 'cta' | 'html'
    - title: string
    - subtitle: string
    - content: string
    - items: array (pour les listes)
*/

-- Ajouter les nouveaux champs à la table pages
DO $$
BEGIN
  -- Hero fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'hero_title'
  ) THEN
    ALTER TABLE pages ADD COLUMN hero_title TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'hero_subtitle'
  ) THEN
    ALTER TABLE pages ADD COLUMN hero_subtitle TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'hero_button_text'
  ) THEN
    ALTER TABLE pages ADD COLUMN hero_button_text TEXT DEFAULT 'Réserver maintenant';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'hero_button_link'
  ) THEN
    ALTER TABLE pages ADD COLUMN hero_button_link TEXT DEFAULT '/reservation-taxi-vsl';
  END IF;

  -- Meta title SEO
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'meta_title'
  ) THEN
    ALTER TABLE pages ADD COLUMN meta_title TEXT DEFAULT '';
  END IF;

  -- Sections JSONB field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'sections'
  ) THEN
    ALTER TABLE pages ADD COLUMN sections JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Modifier le type de content si c'est JSONB, le convertir en TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'content' AND data_type = 'jsonb'
  ) THEN
    ALTER TABLE pages ALTER COLUMN content TYPE TEXT USING content::text;
    ALTER TABLE pages ALTER COLUMN content SET DEFAULT '';
  END IF;
END $$;
