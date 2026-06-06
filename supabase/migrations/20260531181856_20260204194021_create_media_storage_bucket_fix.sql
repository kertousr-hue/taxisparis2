/*
  # Fix Media Storage Bucket Creation
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media', 
  'media', 
  true,
  52428800,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf']
)
ON CONFLICT (id) 
DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'];

DROP POLICY IF EXISTS "Allow public read access to media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete media" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to upload media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete media" ON storage.objects;
DROP POLICY IF EXISTS "Public can read media files" ON storage.objects;
DROP POLICY IF EXISTS "Anon can upload media files" ON storage.objects;
DROP POLICY IF EXISTS "Anon can update media files" ON storage.objects;
DROP POLICY IF EXISTS "Anon can delete media files" ON storage.objects;

CREATE POLICY "Public can read media files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'media');

CREATE POLICY "Anon can upload media files"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Anon can update media files"
  ON storage.objects FOR UPDATE
  TO anon
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Anon can delete media files"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'media');