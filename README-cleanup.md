# User Data Cleanup and Fix

This guide provides instructions for cleaning up user data in your Supabase database and fixing the signup issue.

## Warning

The cleanup scripts will delete ALL user-related data. Make sure you understand the consequences before running them.

## Available Scripts

1. **delete-users-only.sql** - Deletes all user data without recreating triggers
2. **cleanup-users-roles.sql** - Deletes all user data AND recreates fixed triggers
3. **fix-signup-trigger.sql** - Only fixes the triggers without deleting data

## How to Run the Scripts

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Navigate to your project (Fast Facts Theme Pro)
3. Go to the SQL Editor (left sidebar)
4. Create a new query
5. Copy and paste the SQL from the desired script
6. Click "Run" to execute the SQL

## Recommended Approach

1. First, try running just the **fix-signup-trigger.sql** script if you want to keep existing users
2. If you're still having issues, run the **cleanup-users-roles.sql** script to start fresh
3. After running either script, try signing up again - the first user will automatically become an admin

## Troubleshooting

If you encounter permission issues when trying to delete from auth.users, you may need to:

1. Go to the Authentication settings in Supabase
2. Delete users manually through the UI
3. Then run the rest of the script to clean up related tables

## After Cleanup

Once you've cleaned up the data and fixed the triggers:

1. Sign up as a new user - you'll automatically become an admin
2. Any subsequent users will be assigned the 'viewer' role
3. You can promote users to 'editor' or 'admin' roles through SQL 