/*
  # Insert admin user

  Creates the admin user with the specified credentials.
  Uses pgcrypto bcrypt hashing for the password.
*/

INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'kertous.r@gmail.com',
  extensions.crypt('reda1029', extensions.gen_salt('bf')),
  'Admin',
  'admin'
);
