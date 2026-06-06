/*
  # CMS Admin System - Database Schema

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `name` (text)
      - `role` (text: admin, editor)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `pages`
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `title` (text)
      - `meta_description` (text)
      - `meta_keywords` (text)
      - `hero_image_url` (text)
      - `content` (jsonb)
      - `published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, foreign key to admin_users)

    - `blog_posts`
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `title` (text)
      - `excerpt` (text)
      - `content` (text)
      - `featured_image_url` (text)
      - `author_id` (uuid, foreign key to admin_users)
      - `published` (boolean)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `meta_description` (text)
      - `meta_keywords` (text)

    - `media`
      - `id` (uuid, primary key)
      - `filename` (text)
      - `url` (text)
      - `size` (integer)
      - `mime_type` (text)
      - `uploaded_by` (uuid, foreign key to admin_users)
      - `created_at` (timestamptz)

    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Admin users can manage all content
    - Public can only read published content
*/

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage themselves"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Pages Table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT '',
  hero_image_url text,
  content jsonb DEFAULT '[]'::jsonb,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published pages"
  ON pages FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Authenticated admins can manage pages"
  ON pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text DEFAULT '',
  content text NOT NULL DEFAULT '',
  featured_image_url text,
  author_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT ''
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Authenticated admins can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Media Table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  size integer DEFAULT 0,
  mime_type text NOT NULL,
  uploaded_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media"
  ON media FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admins can manage media"
  ON media FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
  ON settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admins can manage settings"
  ON settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default Google Analytics setting
INSERT INTO settings (key, value)
VALUES ('google_analytics', '{"measurement_id": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();