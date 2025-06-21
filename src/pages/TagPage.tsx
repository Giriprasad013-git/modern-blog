import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import { useTheme } from "@/hooks/useTheme";
import { usePostsByTag } from "@/hooks/useTags";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const TagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const location = useLocation();
  const [tagSlug, setTagSlug] = useState<string | undefined>(tag);
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    // Extract tag from URL if not available in params
    if (!tagSlug) {
      const path = location.pathname;
      console.log('TagPage - URL path:', path);
      
      // Extract tag from path
      let extractedTag: string | undefined;
      
      if (path.startsWith('/tag/')) {
        extractedTag = path.substring(5); // Remove '/tag/'
      }
      
      console.log('TagPage - Extracted tag:', extractedTag);
      setTagSlug(extractedTag);
    }
  }, [tagSlug, location.pathname]);
  
  const { data: posts = [], isLoading, error } = usePostsByTag(tagSlug);
  
  // Format tag name for display (convert from slug to readable format)
  const tagName = tagSlug ? 
    tagSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    '';
  
  useEffect(() => {
    console.log('TagPage - Current tag slug:', tagSlug);
    console.log('TagPage - Posts data:', posts);
  }, [tagSlug, posts]);

  if (isLoading || !tagSlug) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <span>Loading posts for tag "{tagName}"...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Error Loading Tag</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              There was an error loading posts for tag "{tagName}".
              <span className="block mt-2 text-sm">Error: {error.message}</span>
            </p>
            <Link 
              to="/" 
              className="inline-block bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If no posts found for this tag, show a proper message
  if (!posts || posts.length === 0) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tag: {tagName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold font-roboto mb-4 text-primary-900 dark:text-white">
              Posts tagged with "{tagName}"
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              No posts found with this tag
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="text-center py-10">
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                  No posts found with the tag "{tagName}".
                </p>
                <Link 
                  to="/" 
                  className="text-accent hover:underline"
                >
                  Browse all posts
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/3">
              <Sidebar />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tag: {tagName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold font-roboto mb-4 text-primary-900 dark:text-white">
            Posts tagged with "{tagName}"
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TagPage;
