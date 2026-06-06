/*
  # Create admin login function
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