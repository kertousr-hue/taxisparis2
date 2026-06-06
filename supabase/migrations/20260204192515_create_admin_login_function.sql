/*
  # Create admin login function

  1. Function
    - `admin_login(p_email, p_password)` - Validates admin credentials and returns user data
    
  2. Security
    - Uses pgcrypto extension for password verification
    - Returns user data without sensitive information (no password_hash)
    - Uses SECURITY DEFINER to run with elevated privileges
  
  3. Notes
    - The function checks if email and password match
    - Returns NULL if credentials are invalid
    - Uses crypt() function to verify hashed passwords
*/

CREATE OR REPLACE FUNCTION admin_login(p_email TEXT, p_password TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  role TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.name,
    au.role
  FROM admin_users au
  WHERE au.email = p_email
    AND au.password_hash = extensions.crypt(p_password, au.password_hash);
END;
$$;