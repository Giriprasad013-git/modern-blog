
-- First, let's check if RLS is enabled and create proper policies for the posts table
-- Since this appears to be a CMS without authentication, we need to allow public access

-- Disable RLS on posts table to allow public access (since this is a public blog)
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled, we can create a policy that allows all operations
-- Uncomment the lines below instead of the disable command above:
-- ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
-- 
-- -- Create a policy that allows all operations for everyone (since this is a public blog CMS)
-- CREATE POLICY "Allow all operations on posts" ON public.posts
--   FOR ALL
--   TO anon, authenticated
--   USING (true)
--   WITH CHECK (true);
