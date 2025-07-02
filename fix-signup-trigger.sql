-- Fix the handle_new_user function to properly handle foreign key constraints
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new user role record with default 'viewer' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- First, create the user_devices entry
  INSERT INTO public.user_devices (device_id, email)
  VALUES (NEW.id::text, NEW.email)
  ON CONFLICT (device_id) DO NOTHING;
  
  -- Then create user preferences
  INSERT INTO public.user_preferences (device_id)
  VALUES (NEW.id::text)
  ON CONFLICT (device_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 