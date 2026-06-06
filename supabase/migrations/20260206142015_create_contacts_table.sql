/*
  # Create Contacts Table

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `nom` (text, required) - Name
      - `email` (text, required) - Email address
      - `telephone` (text, required) - Phone number
      - `message` (text, required) - Contact message
      - `statut` (text, default 'nouveau') - Status (nouveau, lu, traité)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Update timestamp
  
  2. Security
    - Enable RLS on `contacts` table
    - Allow anonymous users to insert contact messages
    - Allow authenticated admin users to read all contacts
    - Allow authenticated admin users to update contact status
*/

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  message text NOT NULL,
  statut text DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'lu', 'traité')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous users to insert contacts" ON contacts;
DROP POLICY IF EXISTS "Allow admins to read all contacts" ON contacts;
DROP POLICY IF EXISTS "Allow admins to update contacts" ON contacts;
DROP POLICY IF EXISTS "Allow admins to delete contacts" ON contacts;

-- Allow anonymous users to submit contact messages
CREATE POLICY "Allow anonymous users to insert contacts"
  ON contacts FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated admin users to read all contacts
CREATE POLICY "Allow admins to read all contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated admin users to update contact status
CREATE POLICY "Allow admins to update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated admin users to delete contacts
CREATE POLICY "Allow admins to delete contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_statut ON contacts(statut);