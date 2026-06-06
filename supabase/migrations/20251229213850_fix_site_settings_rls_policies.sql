/*
  # Fix site_settings RLS policies for anonymous access

  1. Changes
    - Drop existing public view policy
    - Create new policies for both anon and authenticated roles
    - Ensure anonymous users can read site_settings

  2. Security
    - Anonymous users can only SELECT from site_settings
    - Authenticated admins retain full access
*/

-- Drop the existing public policy
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;

-- Create policy for anonymous users (anon role)
CREATE POLICY "Anonymous users can view site settings"
  ON site_settings
  FOR SELECT
  TO anon
  USING (true);

-- Also allow authenticated non-admin users to view settings
CREATE POLICY "Authenticated users can view site settings"
  ON site_settings
  FOR SELECT
  TO authenticated
  USING (true);
