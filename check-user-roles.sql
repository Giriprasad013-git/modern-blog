-- Script to check user roles and fix any issues

-- Check all users and their roles
SELECT 
  u.id, 
  u.email, 
  r.role,
  r.created_at
FROM auth.users u
LEFT JOIN public.user_roles r ON u.id = r.user_id
ORDER BY u.created_at;

-- Check if any users are missing from user_roles table
SELECT 
  u.id, 
  u.email, 
  'missing' as status
FROM auth.users u
LEFT JOIN public.user_roles r ON u.id = r.user_id
WHERE r.id IS NULL;

-- Fix missing user roles (assigns viewer role to users without a role)
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'viewer'
FROM auth.users u
LEFT JOIN public.user_roles r ON u.id = r.user_id
WHERE r.id IS NULL;

-- Make the first user an admin if no admin exists
DO $$
DECLARE
  admin_exists BOOLEAN;
  first_user_id UUID;
BEGIN
  -- Check if any admin exists
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) INTO admin_exists;
  
  -- If no admin exists, make the first user an admin
  IF NOT admin_exists THEN
    SELECT id INTO first_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
      UPDATE public.user_roles 
      SET role = 'admin' 
      WHERE user_id = first_user_id;
      
      RAISE NOTICE 'Made user % an admin', first_user_id;
    END IF;
  END IF;
END $$; 