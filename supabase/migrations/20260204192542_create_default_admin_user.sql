/*
  # Create default admin user

  1. New User
    - Email: admin@example.com
    - Password: admin123 (hashed)
    - Name: Admin
    - Role: admin
    
  2. Security
    - Password is hashed using extensions.crypt()
    - Only creates user if no admin exists
    
  3. Notes
    - This user should have their password changed after first login
    - The password is hashed with bcrypt via pgcrypto
*/

DO $$
BEGIN
  -- Only insert if no admin users exist
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