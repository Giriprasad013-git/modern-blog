import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/post';

export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Map database fields to our Post interface
  return (data || []).map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    author: post.author,
    date: post.date,
    read_time: post.read_time,
    views: post.views,
    tags: post.tags || [],
    created_at: post.created_at,
    updated_at: post.updated_at
  }));
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug provided to fetchPostBySlug');
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data) {
      return null;
    }
    
    // Map database fields to our Post interface
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      image: data.image,
      category: data.category,
      author: data.author,
      date: data.date,
      read_time: data.read_time,
      views: data.views,
      tags: data.tags || [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error in fetchPostBySlug');
  }
}

export async function fetchRelatedPosts(slug: string, category: string): Promise<Post[]> {
  // Fetch posts in the same category, excluding the current post
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .neq('slug', slug)
    .limit(3);
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Map database fields to our Post interface
  return (data || []).map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    author: post.author,
    date: post.date,
    read_time: post.read_time,
    views: post.views,
    tags: post.tags || [],
    created_at: post.created_at,
    updated_at: post.updated_at
  }));
}

export async function fetchPostsByCategory(category: string): Promise<Post[]> {
  if (!category || typeof category !== 'string') {
    throw new Error('Invalid category provided to fetchPostsByCategory');
  }

  try {
    // Normalize the category slug for consistent matching
    const normalizedCategory = category.toLowerCase().trim();
    
    // First try exact match (case insensitive)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .ilike('category', normalizedCategory) // Case-insensitive match
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // If we found posts with exact category name
    if (data && data.length > 0) {
      // Map database fields to our Post interface
      return data.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        category: post.category,
        author: post.author,
        date: post.date,
        read_time: post.read_time,
        views: post.views,
        tags: post.tags || [],
        created_at: post.created_at,
        updated_at: post.updated_at
      }));
    }
    
    // If no posts found with exact match, try to find posts by comparing slugified category names
    // Get all posts to filter manually
    const { data: allPosts, error: allPostsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allPostsError) {
      throw new Error(allPostsError.message);
    }
    
    // Convert category to slug format for comparison
    const categoryAsSlug = normalizedCategory.replace(/\s+/g, '-');
    
    // Filter posts where the slugified category matches our target
    const matchingPosts = (allPosts || []).filter(post => {
      if (!post.category) return false;
      
      const postCategorySlug = post.category.toLowerCase().trim().replace(/\s+/g, '-');
      return postCategorySlug === categoryAsSlug;
    });
    
    // Map database fields to our Post interface
    return matchingPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      category: post.category,
      author: post.author,
      date: post.date,
      read_time: post.read_time,
      views: post.views,
      tags: post.tags || [],
      created_at: post.created_at,
      updated_at: post.updated_at
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error in fetchPostsByCategory');
  }
}

export async function searchPosts(query: string): Promise<Post[]> {
  if (!query || typeof query !== 'string') {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  if (normalizedQuery.length < 2) {
    return [];
  }
  
  try {
    // Get all posts to perform full-text search
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Filter posts that match the search query
    const matchingPosts = (data || []).filter(post => {
      // Search in title, content, excerpt, author, tags
      const searchFields = [
        post.title || '',
        post.content || '',
        post.excerpt || '',
        post.author || '',
        ...(post.tags || [])
      ].map(field => field.toLowerCase());
      
      return searchFields.some(field => field.includes(normalizedQuery));
    });
    
    // Map database fields to our Post interface
    return matchingPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      category: post.category,
      author: post.author,
      date: post.date,
      read_time: post.read_time,
      views: post.views,
      tags: post.tags || [],
      created_at: post.created_at,
      updated_at: post.updated_at
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error in searchPosts');
  }
}

// React Query hooks with improved caching

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes in background
  });
}

export function usePostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => slug ? fetchPostBySlug(slug) : Promise.resolve(null),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, 
    retry: 1,
  });
}

export function useRelatedPosts(slug: string | undefined, category: string | undefined) {
  return useQuery({
    queryKey: ['relatedPosts', slug, category],
    queryFn: () => (slug && category) ? fetchRelatedPosts(slug, category) : Promise.resolve([]),
    enabled: !!(slug && category),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePostsByCategory(category: string | undefined) {
  return useQuery({
    queryKey: ['posts', 'category', category],
    queryFn: () => category ? fetchPostsByCategory(category) : Promise.resolve([]),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: ['posts', 'search', query],
    queryFn: () => searchPosts(query),
    enabled: query.length > 1,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export async function incrementPostView(slug: string) {
  try {
    // First get current view count
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('views')
      .eq('slug', slug)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    const currentViews = post?.views || 0;
    
    // Then update with incremented view count
    const { error: updateError } = await supabase
      .from('posts')
      .update({ views: currentViews + 1 })
      .eq('slug', slug);
    
    if (updateError) {
      throw updateError;
    }
    
    return true;
  } catch (error) {
    // Silently fail to avoid disrupting user experience
    return false;
  }
}
