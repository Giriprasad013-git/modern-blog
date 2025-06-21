
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkX, Calendar, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePosts } from '@/hooks/usePosts';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import ContentFreshness from '@/components/ContentFreshness';

const BookmarksPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { data: allPosts = [], isLoading } = usePosts();
  const { preferences, removeBookmark } = useUserPreferences();

  // Filter posts that are bookmarked
  const bookmarkedPosts = allPosts.filter(post => 
    preferences.bookmarkedPosts.includes(post.slug)
  );

  const handleRemoveBookmark = (slug: string) => {
    removeBookmark(slug);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "dark" : ""}`}>
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
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
            <Bookmark className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              My Bookmarks
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your saved articles for later reading ({bookmarkedPosts.length} items)
          </p>
        </div>

        {bookmarkedPosts.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start bookmarking articles you want to read later.
            </p>
            <Button asChild>
              <Link to="/">Browse Articles</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarkedPosts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row gap-6 p-6">
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
                      <div className="flex items-center gap-2">
                        <ContentFreshness 
                          createdAt={post.created_at} 
                          updatedAt={post.updated_at}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveBookmark(post.slug)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <BookmarkX className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

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
                      <span className="text-xs text-gray-400">
                        {post.read_time} min read
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BookmarksPage;
