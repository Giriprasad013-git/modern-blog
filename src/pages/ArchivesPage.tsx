
import { Link } from 'react-router-dom';
import { Archive, Calendar, Eye, FolderOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePosts } from '@/hooks/usePosts';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import ContentFreshness from '@/components/ContentFreshness';

const ArchivesPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { data: allPosts = [], isLoading } = usePosts();

  // Group posts by year and month
  const groupedPosts = allPosts.reduce((acc, post) => {
    const date = new Date(post.created_at || post.date);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    
    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    acc[year][month].push(post);
    return acc;
  }, {} as Record<number, Record<string, typeof allPosts>>);

  const years = Object.keys(groupedPosts).map(Number).sort((a, b) => b - a);

  if (isLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "dark" : ""}`}>
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                  ))}
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
            <Archive className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Archives
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Browse our content organized by publication date ({allPosts.length} total articles)
          </p>
        </div>

        {years.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No archived content
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back later for archived articles.
            </p>
            <Button asChild>
              <Link to="/">Browse Latest Articles</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {years.map((year) => (
              <div key={year} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-500" />
                  {year}
                </h2>
                
                <div className="space-y-6">
                  {Object.entries(groupedPosts[year]).map(([month, posts]) => (
                    <div key={month} className="border-l-2 border-blue-200 dark:border-blue-800 pl-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        {month} ({posts.length} articles)
                      </h3>
                      
                      <div className="space-y-3">
                        {posts.map((post) => (
                          <article key={post.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group">
                            <div className="flex-shrink-0 w-16 h-12 rounded overflow-hidden">
                              <img 
                                src={post.image} 
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <Link to={`/post/${post.slug}`} className="block">
                                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                                  {post.title}
                                </h4>
                              </Link>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{post.views?.toLocaleString()} views</span>
                                </div>
                                <span className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                                  {post.category}
                                </span>
                                <span className="text-xs">
                                  {post.read_time} min read
                                </span>
                                <ContentFreshness 
                                  createdAt={post.created_at} 
                                  updatedAt={post.updated_at}
                                  className="text-xs"
                                />
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ArchivesPage;
