import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/post';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching tags:', error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function fetchPostsByTag(tagSlug: string): Promise<Post[]> {
  if (!tagSlug) {
    console.log('No tag slug provided');
    return [];
  }

  console.log('Fetching posts for tag slug:', tagSlug);
  
  try {
    // Normalize the tag slug
    const normalizedTagSlug = tagSlug.toLowerCase().trim();
    
    // First try to get the tag by slug from the tags table
    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', normalizedTagSlug)
      .maybeSingle();

    if (tagError && tagError.code !== 'PGRST116') {
      console.error(`Error fetching tag with slug ${normalizedTagSlug}:`, tagError);
      throw new Error(tagError.message);
    }

    // If we found the tag in the tags table
    if (tagData) {
      console.log(`Found tag with ID ${tagData.id} for slug ${normalizedTagSlug}`);
      
      // Get posts associated with this tag from the post_tags junction table
      const { data, error } = await supabase
        .from('post_tags')
        .select(`
          posts (
            id,
            title,
            slug,
            excerpt,
            content,
            image,
            category,
            author,
            date,
            read_time,
            views,
            tags,
            created_at,
            updated_at
          )
        `)
        .eq('tag_id', tagData.id);
      
      if (error) {
        console.error(`Error fetching posts for tag ${normalizedTagSlug}:`, error);
        throw new Error(error.message);
      }
      
      const posts = (data || []).map(item => item.posts).filter(Boolean);
      console.log(`Found ${posts.length} posts via post_tags table for tag ${normalizedTagSlug}`);
      return posts;
    }
    
    // If tag not found in tags table, try to find posts with this tag in their tags array
    console.log(`Tag ${normalizedTagSlug} not found in tags table, searching in posts.tags array`);
    
    // Search for posts that have this tag in their tags array
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*');
    
    if (postsError) {
      console.error(`Error fetching posts for tag search ${normalizedTagSlug}:`, postsError);
      throw new Error(postsError.message);
    }
    
    // Filter posts that contain the tag in their tags array (case-insensitive)
    const matchingPosts = (postsData || []).filter(post => {
      if (!post.tags || !Array.isArray(post.tags)) return false;
      
      return post.tags.some(tag => {
        // Convert tag to slug format for comparison
        const tagAsSlug = tag.toLowerCase().trim().replace(/\s+/g, '-');
        return tagAsSlug === normalizedTagSlug;
      });
    });
    
    console.log(`Found ${matchingPosts.length} posts via tags array for tag ${normalizedTagSlug}`);
    return matchingPosts;
  } catch (error) {
    console.error(`Error in fetchPostsByTag for ${tagSlug}:`, error);
    throw error;
  }
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });
}

export function usePostsByTag(tagSlug: string | undefined) {
  return useQuery({
    queryKey: ['posts', 'tag', tagSlug],
    queryFn: () => tagSlug ? fetchPostsByTag(tagSlug) : Promise.resolve([]),
    enabled: !!tagSlug,
  });
}
