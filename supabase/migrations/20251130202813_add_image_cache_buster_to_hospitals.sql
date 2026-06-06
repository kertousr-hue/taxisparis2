/*
  # Ajouter un cache buster pour les images d'hôpitaux

  1. Modifications
    - Ajoute une colonne `image_cache_buster` à la table `hospitals`
    - Cette colonne stocke un timestamp qui change à chaque mise à jour d'image
    - Permet de forcer le rechargement des images même si l'URL reste la même
*/

ALTER TABLE hospitals 
ADD COLUMN IF NOT EXISTS image_cache_buster bigint DEFAULT extract(epoch from now())::bigint;

-- Mettre à jour tous les hôpitaux existants avec un cache buster
UPDATE hospitals 
SET image_cache_buster = extract(epoch from now())::bigint 
WHERE image_cache_buster IS NULL;
