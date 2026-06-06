/*
  # Create Media Storage Bucket

  1. Storage Setup
    - Create 'media' bucket for file uploads
    - Set bucket as public for easy access
    - Configure storage policies for uploads and access
  
  2. Security Policies
    - Allow anonymous users to read files (public bucket)
    - Allow authenticated users to upload files
    - Allow authenticated users to delete their uploads
*/

-- Create the media bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete media" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to upload media" ON storage.objects;

-- Allow anyone to read files from the media bucket
CREATE POLICY "Allow public read access to media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Allow anyone (including anonymous) to upload files to media bucket
CREATE POLICY "Allow anonymous users to upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media');

-- Allow anyone (including anonymous) to update files in media bucket
CREATE POLICY "Allow users to update media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

-- Allow anyone to delete files from media bucket
CREATE POLICY "Allow users to delete media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media');
