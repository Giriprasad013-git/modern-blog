
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Eye, Calendar, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePosts } from '@/hooks/usePosts';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import ContentFreshness from '@/components/ContentFreshness';
import BookmarkButton from '@/components/BookmarkButton';

const PopularPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { data: allPosts = [], isLoading } = usePosts();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Sort posts by views and filter by time period
  const getFilteredPosts = () => {
    let filtered = [...allPosts];
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }
    
    // Sort by views (descending)
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    
    return filtered;
  };

  const filteredPosts = getFilteredPosts();
  const categories = [...new Set(allPosts.map(post => post.category))];

  if (isLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "dark" : ""}`}>
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="flex gap-6">
                  <Skeleton className="w-48 h-32 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "dark" : ""}`}>
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Popular Articles
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover the most read and engaging content from our community
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>
          
          <Select value={timeFilter} onValueChange={(value: 'week' | 'month' | 'all') => setTimeFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
            <article key={post.id} className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row gap-6 p-6">
                {/* Ranking Badge */}
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  #{index + 1}
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="flex-shrink-0 w-full md:w-48 h-32 rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <Link to={`/post/${post.slug}`} className="group">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    <ContentFreshness 
                      createdAt={post.created_at} 
                      updatedAt={post.updated_at}
                    />
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views?.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs">
                        {post.category}
                      </span>
                    </div>
                    
                    <BookmarkButton slug={post.slug} title={post.title} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No popular posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PopularPage;
