-- Script to create a new admin user directly
-- This is a more direct approach when auth.users is empty

-- Step 1: Create a user in auth.users
-- NOTE: This requires admin privileges in Supabase
-- Replace 'your-email@example.com' and 'your-secure-password' with your actual values
-- The password should be a bcrypt hash, but you'll need to create the user through the UI instead

-- IMPORTANT: You cannot directly insert into auth.users with SQL
-- You must use the Supabase Authentication UI to create the user

-- After creating the user through the UI, run these steps:

-- Step 2: Find your user ID
-- Run this after creating the user through the UI
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Step 3: Insert into user_devices
-- Replace 'YOUR_USER_ID' with the ID from Step 2
INSERT INTO public.user_devices (device_id, email, is_subscribed)
VALUES ('YOUR_USER_ID', 'your-email@example.com', false)
ON CONFLICT (device_id) DO NOTHING;

-- Step 4: Insert into user_preferences
-- Replace 'YOUR_USER_ID' with the ID from Step 2
INSERT INTO public.user_preferences (device_id)
VALUES ('YOUR_USER_ID')
ON CONFLICT (device_id) DO NOTHING;

-- Step 5: Insert into user_roles with admin role
-- Replace 'YOUR_USER_ID' with the ID from Step 2
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Step 6: Verify the user was created correctly
SELECT 
  u.id, 
  u.email, 
  r.role,
  d.device_id,
  p.id as preferences_id
FROM auth.users u
LEFT JOIN public.user_roles r ON u.id = r.user_id
LEFT JOIN public.user_devices d ON u.id::text = d.device_id
LEFT JOIN public.user_preferences p ON d.device_id = p.device_id
WHERE u.email = 'your-email@example.com'; 