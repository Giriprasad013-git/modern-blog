-- This script creates an admin user manually
-- Replace 'YOUR_USER_ID' with the actual user ID from Supabase Auth dashboard
-- Replace 'YOUR_EMAIL' with your email address

-- Insert into user_devices
INSERT INTO public.user_devices (device_id, email, is_subscribed)
VALUES ('YOUR_USER_ID', 'YOUR_EMAIL', false)
ON CONFLICT (device_id) DO NOTHING;

-- Insert into user_preferences
INSERT INTO public.user_preferences (device_id)
VALUES ('YOUR_USER_ID')
ON CONFLICT (device_id) DO NOTHING;

-- Set admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verify the user was created correctly
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
WHERE u.id = 'YOUR_USER_ID'; 