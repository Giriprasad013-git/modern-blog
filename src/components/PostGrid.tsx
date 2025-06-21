
import { useState } from "react";
import { usePosts, usePostsByCategory } from "@/hooks/usePosts";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/types/post";

interface PostGridProps {
  category?: string;
  limit?: number;
  posts?: Post[];
}

const PostGrid = ({ category = "all", limit, posts: providedPosts }: PostGridProps) => {
  const [visiblePosts, setVisiblePosts] = useState(limit || 6);
  
  // Always fetch from database, never use dummy data
  const { data: allPosts = [], isLoading, error } = category === "all" 
    ? usePosts()
    : usePostsByCategory(category);
  
  // Use provided posts only if explicitly passed, otherwise always use database data
  const postsToDisplay = providedPosts || allPosts;
  const displayedPosts = postsToDisplay.slice(0, visiblePosts);
  
  const loadMore = () => {
    setVisiblePosts(prev => prev + 6);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(visiblePosts)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md">
            <div className="aspect-[16/9] relative">
              <Skeleton className="w-full h-full absolute inset-0" />
            </div>
            <div className="p-5">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">Error loading posts: {error.message}</div>
        <p className="text-gray-600 dark:text-gray-300">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div>
      {displayedPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-300">
            {category === "all" ? "No posts found." : `No posts found in the ${category} category.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
      
      {!limit && visiblePosts < postsToDisplay.length && (
        <div className="mt-8 text-center">
          <Button onClick={loadMore} className="bg-primary hover:bg-primary/80 text-white">
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostGrid;
