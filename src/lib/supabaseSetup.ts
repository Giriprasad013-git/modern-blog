
/**
 * Supabase Database Schema Setup
 * 
 * To set up your Supabase database for this blog application, run the following SQL queries:
 * 
 * 1. Create the posts table:
 * 
 * CREATE TABLE posts (
 *   id SERIAL PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   slug TEXT NOT NULL UNIQUE,
 *   excerpt TEXT NOT NULL,
 *   content TEXT NOT NULL,
 *   image TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   author TEXT NOT NULL,
 *   date TEXT NOT NULL,
 *   read_time INTEGER NOT NULL,
 *   views INTEGER NOT NULL DEFAULT 0,
 *   tags TEXT[] DEFAULT '{}',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * 2. Set up Row Level Security (RLS) policies:
 * 
 * ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
 * 
 * -- Allow anonymous read access
 * CREATE POLICY "Allow anonymous read access" ON posts
 *   FOR SELECT
 *   TO anon
 *   USING (true);
 * 
 * -- Allow authenticated users to insert
 * CREATE POLICY "Allow authenticated insert" ON posts
 *   FOR INSERT
 *   TO authenticated
 *   WITH CHECK (true);
 * 
 * -- Allow authenticated users to update their own posts
 * CREATE POLICY "Allow authenticated update" ON posts
 *   FOR UPDATE
 *   TO authenticated
 *   USING (auth.uid() = created_by);
 * 
 * 3. Add sample data:
 * 
 * INSERT INTO posts (title, slug, excerpt, content, image, category, author, date, read_time, views, tags)
 * VALUES
 *   ('Getting Started with React', 'getting-started-with-react', 'Learn the basics of React in this comprehensive guide', '<h2>Introduction to React</h2><p>React is a JavaScript library for building user interfaces...</p>', 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2', 'Technology', 'John Doe', 'May 15, 2025', 8, 1250, ARRAY['React', 'JavaScript', 'Frontend']),
 *   ('10 Tips for Better SEO', '10-tips-for-better-seo', 'Improve your website ranking with these essential SEO tips', '<h2>Why SEO Matters</h2><p>Search engine optimization is crucial for online visibility...</p>', 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1', 'Business', 'Jane Smith', 'May 10, 2025', 5, 2300, ARRAY['SEO', 'Marketing', 'Business']),
 *   ('Healthy Lifestyle Habits', 'healthy-lifestyle-habits', 'Develop these daily habits for a healthier and more balanced life', '<h2>Building Healthy Routines</h2><p>Establishing consistent habits is key to long-term health...</p>', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', 'Lifestyle', 'Mark Johnson', 'May 5, 2025', 6, 1890, ARRAY['Health', 'Wellness', 'Lifestyle']);
 * 
 */

// This file is for documentation purposes only
export {};
