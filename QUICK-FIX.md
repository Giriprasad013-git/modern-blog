# Quick Fix Guide

Since your `auth.users` table is empty, the simplest solution is to:

1. Fix the database triggers
2. Sign up normally through the website

## Step 1: Fix the Database Triggers

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Navigate to your project
3. Go to the SQL Editor
4. Copy and paste the contents of `fix-signup-trigger.sql`
5. Click "Run"

## Step 2: Sign Up Through the Website

1. Go to https://fastandfacts.com/signup
2. Create a new account with your email and password
3. Since this will be the first user, you should automatically become an admin

## Step 3: Verify Admin Access

1. After signing up, try accessing https://fastandfacts.com/cms
2. You should now have access to the CMS

## If That Doesn't Work

If you still can't access the CMS after signing up, follow the more detailed instructions in `ADMIN-SETUP-GUIDE.md` to manually set up an admin user. 