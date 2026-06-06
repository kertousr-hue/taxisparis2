/*
  # Configuration finale de la table reservations

  1. Modifications de la table
    - Convertir ald_cmu de text à boolean
    - Convertir prescription de text à boolean  
    - Ajouter ip_client et user_agent si manquants
    - S'assurer que tous les champs nécessaires existent

  2. Row Level Security (RLS)
    - RLS déjà activé sur la table
    - SUPPRIMER toutes les policies existantes
    - CRÉER une seule policy: Allow INSERT for anon users
    - DENY SELECT, UPDATE, DELETE pour tout le monde

  3. Résultat attendu
    - Les utilisateurs anonymes peuvent uniquement INSERT
    - Personne ne peut SELECT, UPDATE ou DELETE
    - Table sécurisée pour accepter les réservations
*/

-- Supprimer toutes les policies existantes sur reservations
DROP POLICY IF EXISTS "Anyone can insert reservations" ON reservations;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON reservations;
DROP POLICY IF EXISTS "Public can insert reservations" ON reservations;
DROP POLICY IF EXISTS "Enable insert for anon" ON reservations;
DROP POLICY IF EXISTS "Enable read access for all users" ON reservations;
DROP POLICY IF EXISTS "Allow public inserts" ON reservations;

-- Modifier les colonnes ald_cmu et prescription pour être boolean si elles sont text
DO $$
BEGIN
  -- Convertir ald_cmu en boolean si c'est text
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' 
    AND column_name = 'ald_cmu' 
    AND data_type = 'text'
  ) THEN
    ALTER TABLE reservations 
    ALTER COLUMN ald_cmu TYPE boolean 
    USING CASE 
      WHEN ald_cmu IN ('true', 'oui', 't', '1') THEN true
      ELSE false
    END;
    
    ALTER TABLE reservations 
    ALTER COLUMN ald_cmu SET DEFAULT false;
  END IF;

  -- Convertir prescription en boolean si c'est text
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' 
    AND column_name = 'prescription' 
    AND data_type = 'text'
  ) THEN
    ALTER TABLE reservations 
    ALTER COLUMN prescription TYPE boolean 
    USING CASE 
      WHEN prescription IN ('true', 'oui', 't', '1') THEN true
      ELSE false
    END;
    
    ALTER TABLE reservations 
    ALTER COLUMN prescription SET DEFAULT false;
  END IF;

  -- Ajouter ip_client si manquant
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' 
    AND column_name = 'ip_client'
  ) THEN
    ALTER TABLE reservations ADD COLUMN ip_client text;
  END IF;

  -- Ajouter user_agent si manquant
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' 
    AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE reservations ADD COLUMN user_agent text;
  END IF;

  -- Ajouter duree_minutes si manquant
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' 
    AND column_name = 'duree_minutes'
  ) THEN
    ALTER TABLE reservations ADD COLUMN duree_minutes integer;
  END IF;
END $$;

-- S'assurer que RLS est activé
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Créer la SEULE policy autorisée: INSERT pour utilisateurs anonymes
CREATE POLICY "Allow anonymous users to insert reservations"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- IMPORTANT: Aucune policy pour SELECT, UPDATE, DELETE
-- Cela signifie que personne ne peut lire, modifier ou supprimer les réservations
-- Seuls les admins via le dashboard Supabase auront accès

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reservations_date_rdv ON reservations(date_rdv);
