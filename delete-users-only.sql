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