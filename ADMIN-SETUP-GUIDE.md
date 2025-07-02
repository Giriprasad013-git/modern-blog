# Admin Setup Guide

Since your `auth.users` table is empty, you need to create a new user and set them up as an admin. Follow these steps:

## Step 1: Fix the Database Triggers

First, run the `fix-signup-trigger.sql` script in the Supabase SQL Editor to ensure that new users are properly set up.

## Step 2: Create a New User Through the UI

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Navigate to your project
3. Go to Authentication > Users
4. Click "Add User"
5. Enter your email and password
6. Click "Create User"

## Step 3: Verify the User Was Created

1. In the SQL Editor, run:
   ```sql
   SELECT id, email FROM auth.users;
   ```
2. Make note of your user ID (you'll need it in the next steps)

## Step 4: Run the Setup Script

1. Open the `create-new-admin.sql` file
2. Replace all instances of `'your-email@example.com'` with your actual email
3. Replace all instances of `'YOUR_USER_ID'` with the user ID from Step 3
4. Run the modified script in the Supabase SQL Editor

## Step 5: Verify Admin Access

1. Log out of your website if you're currently logged in
2. Log in with the email and password you created
3. Navigate to https://fastandfacts.com/cms
4. You should now have access to the CMS

## Troubleshooting

If you still can't access the CMS, check:

1. That the user exists in `auth.users`:
   ```sql
   SELECT * FROM auth.users;
   ```

2. That the user has an admin role:
   ```sql
   SELECT u.email, r.role 
   FROM auth.users u
   JOIN public.user_roles r ON u.id = r.user_id;
   ```

3. That the user has entries in all required tables:
   ```sql
   SELECT 
     u.email, 
     r.role,
     d.device_id,
     p.id as preferences_id
   FROM auth.users u
   LEFT JOIN public.user_roles r ON u.id = r.user_id
   LEFT JOIN public.user_devices d ON u.id::text = d.device_id
   LEFT JOIN public.user_preferences p ON d.device_id = p.device_id;
   ```

## Additional Notes

- The first user created should automatically become an admin due to the `make_first_user_admin()` trigger
- If that doesn't work, the manual steps in this guide will ensure the user has admin privileges 