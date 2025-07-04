-- Run this SQL to verify the handle_new_user function was updated correctly
SELECT pg_get_functiondef('public.handle_new_user'::regproc);

-- Check if the trigger exists
SELECT 
  tgname AS trigger_name,
  tgrelid::regclass AS table_name,
  tgfoid::regproc AS function_name,
  tgenabled AS enabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- Check user roles table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public' AND 
  table_name = 'user_roles';

-- Check user_devices table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public' AND 
  table_name = 'user_devices';

-- Check user_preferences table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public' AND 
  table_name = 'user_preferences';

-- Check foreign key constraints
SELECT
  tc.table_schema, 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='user_preferences'; 