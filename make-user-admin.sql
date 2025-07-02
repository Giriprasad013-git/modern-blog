-- Script to make your current user an admin
-- Replace 'YOUR_EMAIL' with the email you used to sign up

-- First, find your user ID
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL';

-- Then update your role to admin
-- Replace 'YOUR_USER_ID' with the ID from the previous query
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = 'YOUR_USER_ID';

-- Verify the change
SELECT 
  u.id, 
  u.email, 
  r.role
FROM auth.users u
JOIN public.user_roles r ON u.id = r.user_id
WHERE u.email = 'YOUR_EMAIL'; 