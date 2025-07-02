# Fix for Signup 500 Error

The signup process is failing because of a database trigger issue. The `handle_new_user()` function tries to insert into `user_preferences` before inserting into `user_devices`, which violates a foreign key constraint.

## How to Fix

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Navigate to your project (Fast Facts Theme Pro)
3. Go to the SQL Editor (left sidebar)
4. Create a new query
5. Copy and paste the SQL from the `fix-signup-trigger.sql` file
6. Click "Run" to execute the SQL

## What This Fix Does

1. Updates the `handle_new_user()` function to:
   - Insert into `user_roles` with conflict handling
   - Insert into `user_devices` first
   - Then insert into `user_preferences`
   - All with proper conflict handling

2. Recreates the trigger to use the updated function

## After Applying the Fix

Once you've applied this fix, the signup process should work correctly. The first user to sign up will automatically become an admin, and subsequent users will be assigned the 'viewer' role.

## Verifying the Fix

After applying the fix, try signing up again. If you still encounter issues, you can check the Supabase logs for more details. 