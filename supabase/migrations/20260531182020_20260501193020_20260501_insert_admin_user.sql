/*
  # Insert admin user with real credentials
*/

INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'kertous.r@gmail.com',
  extensions.crypt('reda1029', extensions.gen_salt('bf')),
  'Admin',
  'admin'
)
ON CONFLICT (email) DO NOTHING;