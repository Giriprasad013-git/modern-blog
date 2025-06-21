
import { Link } from "react-router-dom";
import { Eye, TrendingUp } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";

interface PopularPostsProps {
  period?: 'week' | 'month' | 'all';
  limit?: number;
  showHeader?: boolean;
  variant?: 'default' | 'compact';
}

const PopularPosts = ({ 
  period = 'all', 
  limit = 5, 
  showHeader = true, 
  variant = 'default' 
}: PopularPostsProps) => {
  const { data: posts = [], isLoading, error } = usePosts();
  
  // Sort posts by views and get top posts based on limit
  const popularPosts = posts
    .filter(post => post.views > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        {showHeader && (
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Popular Posts
          </h3>
        )}
        <div className="space-y-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-16 h-12 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        {showHeader && (
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Popular Posts
          </h3>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">Unable to load popular posts</p>
      </div>
    );
  }

  if (popularPosts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        {showHeader && (
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Popular Posts
          </h3>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">No popular posts available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      {showHeader && (
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Popular Posts
        </h3>
      )}
      <div className="space-y-4">
        {popularPosts.map((post, index) => (
          <Link
            key={post.id}
            to={`/post/${post.slug}`}
            className="flex gap-3 group hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
          >
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-16 h-12 object-cover rounded"
              />
              <span className="absolute -top-2 -left-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {index + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-accent transition-colors dark:text-white">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Eye className="h-3 w-3" />
                {post.views?.toLocaleString()} views
                <span>•</span>
                <span>{post.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {variant === 'default' && (
        <div className="mt-4">
          <Link
            to="/popular"
            className="text-accent hover:underline text-sm font-medium"
          >
            View all popular posts →
          </Link>
        </div>
      )}
    </div>
  );
};

export default PopularPosts;
