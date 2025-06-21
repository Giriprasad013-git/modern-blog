import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { categories } from '@/data/categories';

export interface CategoryStat {
  name: string;
  slug: string;
  count: number;
  color: string;
}

export async function fetchCategoryStats(): Promise<CategoryStat[]> {
  try {
    console.log('Fetching category stats...');
    
    // Get all posts with their categories
    const { data: posts, error } = await supabase
      .from('posts')
      .select('category');
    
    if (error) {
      console.error('Error fetching category stats:', error);
      throw new Error(error.message);
    }
    
    // Count posts by category (case-insensitive)
    const categoryCounts: Record<string, number> = {};
    const categoryNames: Record<string, string> = {}; // To preserve original casing
    
    posts?.forEach(post => {
      if (post.category) {
        const categorySlug = post.category.toLowerCase().trim().replace(/\s+/g, '-');
        const categoryName = post.category.trim();
        
        categoryCounts[categorySlug] = (categoryCounts[categorySlug] || 0) + 1;
        categoryNames[categorySlug] = categoryName;
      }
    });
    
    // Create a map of predefined categories for quick lookup
    const categoryMap = new Map(
      categories.map(category => [category.slug.toLowerCase(), category])
    );
    
    // Combine database categories with predefined categories
    const allCategories: CategoryStat[] = [];
    
    // First add all categories from the database
    Object.entries(categoryCounts).forEach(([slug, count]) => {
      const predefinedCategory = categoryMap.get(slug);
      
      allCategories.push({
        name: predefinedCategory?.name || categoryNames[slug],
        slug: slug,
        count: count,
        color: predefinedCategory?.color || getRandomColor(slug)
      });
    });
    
    // Then add any predefined categories that don't have posts yet (with count 0)
    categories.forEach(category => {
      const slug = category.slug.toLowerCase();
      if (!categoryCounts[slug]) {
        allCategories.push({
          name: category.name,
          slug: slug,
          count: 0,
          color: category.color
        });
      }
    });
    
    // Sort by count descending
    return allCategories.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error in fetchCategoryStats:', error);
    return [];
  }
}

// Generate a consistent color based on category slug
function getRandomColor(slug: string): string {
  // Simple hash function to generate a number from a string
  const hash = Array.from(slug).reduce(
    (acc, char) => acc + char.charCodeAt(0), 0
  );
  
  // List of tailwind color classes
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-red-500', 'bg-yellow-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
  ];
  
  // Use the hash to pick a color
  return colors[hash % colors.length];
}

export function useCategoryStats() {
  return useQuery({
    queryKey: ['categoryStats'],
    queryFn: fetchCategoryStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
