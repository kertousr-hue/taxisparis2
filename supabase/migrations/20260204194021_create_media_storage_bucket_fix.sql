/*
  # Fix Media Storage Bucket Creation

  1. Storage Setup
    - Create 'media' bucket for file uploads
    - Set bucket as public for easy media access
    - Configure storage policies for uploads and access
  
  2. Security Policies
    - Public read access to all media files
    - Anonymous users can upload (for admin interface)
    - Anonymous users can update/delete media
    
  3. Notes
    - Public bucket enables direct image URLs without signed URLs
    - Admin interface uses anonymous (anon) key for operations
    - Application-level auth protects admin routes
*/

-- Create the media bucket (force creation)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media', 
  'media', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf']
)
ON CONFLICT (id) 
DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'];

-- Drop all existing policies on storage.objects for media bucket
DROP POLICY IF EXISTS "Allow public read access to media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete media" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to upload media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete media" ON storage.objects;

-- Create comprehensive policies for the media bucket

-- Allow public read access (anyone can view)
CREATE POLICY "Public can read media files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'media');

-- Allow anonymous users (admin interface) to upload
CREATE POLICY "Anon can upload media files"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'media');

-- Allow anonymous users to update media metadata
CREATE POLICY "Anon can update media files"
  ON storage.objects FOR UPDATE
  TO anon
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

-- Allow anonymous users to delete media
CREATE POLICY "Anon can delete media files"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'media');