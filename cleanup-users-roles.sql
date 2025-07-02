-- WARNING: This script will delete ALL user-related data
-- Make sure you understand the consequences before running it

-- First, disable the triggers to prevent cascading issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_first_user_created ON auth.users;

-- Delete all data from user_preferences
TRUNCATE public.user_preferences CASCADE;

-- Delete all data from user_devices
TRUNCATE public.user_devices CASCADE;

-- Delete all data from user_roles
TRUNCATE public.user_roles CASCADE;

-- Delete all data from user_analytics if it exists
TRUNCATE public.user_analytics CASCADE;

-- Delete all users from auth.users
-- NOTE: This requires admin privileges in Supabase
DELETE FROM auth.users;

-- Now recreate the fixed trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new user role record with default 'viewer' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- First, create the user_devices entry
  INSERT INTO public.user_devices (device_id, email, is_subscribed)
  VALUES (NEW.id::text, NEW.email, false)
  ON CONFLICT (device_id) DO NOTHING;
  
  -- Then create user preferences
  INSERT INTO public.user_preferences (device_id)
  VALUES (NEW.id::text)
  ON CONFLICT (device_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the first user admin function
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  -- If this is the first user, make them an admin
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_first_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.make_first_user_admin(); 