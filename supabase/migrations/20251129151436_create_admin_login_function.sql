/*
  # Create admin login function

  1. Function
    - `admin_login(p_email, p_password)` - Validates admin credentials and returns user data
    
  2. Security
    - Uses pgcrypto extension for password verification
    - Returns user data without sensitive information (no password_hash)
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
    AND au.password_hash = crypt(p_password, au.password_hash);
END;
$$;