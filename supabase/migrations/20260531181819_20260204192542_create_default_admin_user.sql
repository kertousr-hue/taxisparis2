/*
  # Create default admin user
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users LIMIT 1) THEN
    INSERT INTO admin_users (email, password_hash, name, role)
    VALUES (
      'admin@example.com',
      extensions.crypt('admin123', extensions.gen_salt('bf')),
      'Admin',
      'admin'
    );
  END IF;
END $$;