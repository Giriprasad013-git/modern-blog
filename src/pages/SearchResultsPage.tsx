import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { useTheme } from "@/hooks/useTheme";
import { useSearchPosts } from "@/hooks/usePosts";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const { theme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Only enable search if query has at least 2 characters
  const isValidQuery = query && query.trim().length >= 2;
  const { data: searchResults = [], isLoading, error } = useSearchPosts(isValidQuery ? query : "");
  
  useEffect(() => {
    // Reset to first page when the search query changes
    setCurrentPage(1);
    
    // Log search query for analytics
    if (isValidQuery) {
      console.log('Searching for:', query);
    }
  }, [query, isValidQuery]);
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchResults.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(searchResults.length / postsPerPage);

  // Handle invalid search query
  if (!isValidQuery) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <ReadingProgressBar />
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        
        <div className="bg-primary-900 dark:bg-slate-800 text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold font-roboto mb-4">
              Search
            </h1>
            <p className="text-white/80">
              Please enter a search term with at least 2 characters
            </p>
          </div>
        </div>
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 mt-6">
            <div className="w-full lg:w-2/3">
              <div className="text-center py-16">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h2 className="text-2xl font-bold mb-4">Search term too short</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Please enter a search term with at least 2 characters to find content.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
            <Sidebar />
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <ReadingProgressBar />
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      {/* Search Header */}
      <div className="bg-primary-900 dark:bg-slate-800 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold font-roboto mb-4">
            Search Results for "{query}"
          </h1>
          {!isLoading && (
            <p className="text-white/80">
              Found {searchResults.length} results
            </p>
          )}
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <div className="w-full lg:w-2/3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                <p>Searching for "{query}"...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error searching posts: {error.message}
                </AlertDescription>
              </Alert>
            ) : searchResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination>
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(prev => prev - 1)} 
                              className="cursor-pointer"
                            />
                          </PaginationItem>
                        )}
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink 
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(prev => prev + 1)}
                              className="cursor-pointer" 
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">No results found</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  No posts match your search for "{query}". Try using different keywords or check your spelling.
                </p>
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
