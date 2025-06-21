import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePostsByCategory } from "@/hooks/usePosts";
import { categories } from "@/data/categories";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostGrid from "@/components/PostGrid";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const [categorySlug, setCategorySlug] = useState<string | undefined>(category);
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    // Extract category from URL if not available in params
    if (!categorySlug) {
      const path = location.pathname;
      
      // Extract category from path
      let extractedCategory: string | undefined;
      
      if (path.startsWith('/category/')) {
        extractedCategory = path.substring(10); // Remove '/category/'
      } else if (path !== '/') {
        extractedCategory = path.substring(1); // Remove leading '/'
      }
      
      setCategorySlug(extractedCategory);
    }
  }, [categorySlug, location.pathname]);
  
  const { data: posts, isLoading, error } = usePostsByCategory(categorySlug);
  const categoryData = categories.find(cat => cat.slug === categorySlug);

  // Show loading skeleton
  if (isLoading || !categorySlug) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-6 w-48 mb-4" />
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-3/4">
              <Skeleton className="h-10 w-64 mb-4" />
              <Skeleton className="h-6 w-full max-w-lg mb-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-5">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/4">
              <Skeleton className="h-72 w-full rounded-lg" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <SEO 
          title="Category Not Found | Modern Blog"
          description="The requested category could not be found."
          noindex={true}
        />
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold text-red-500 mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              The category "{categorySlug}" doesn't exist.
            </p>
            <Link 
              to="/" 
              className="inline-block bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <SEO 
          title={`Error | ${categoryData.name}`}
          description="There was an error loading this category."
          noindex={true}
        />
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold text-red-500 mb-4">
              Error Loading Category
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              There was an error loading posts for "{categoryData.name}".
              <span className="block mt-2 text-sm">Please try again later or contact support if the problem persists.</span>
            </p>
            <Link 
              to="/" 
              className="inline-block bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Canonical URL for SEO
  const canonicalUrl = `/category/${categorySlug}`;

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <SEO 
        title={`${categoryData.name} Articles | Modern Blog`}
        description={`Explore our latest ${categoryData.name.toLowerCase()} articles and insights. ${categoryData.description}`}
        keywords={`${categoryData.name.toLowerCase()}, articles, blog, insights, ${categoryData.slug}`}
        category={categoryData.name}
        canonical={canonicalUrl}
        url={canonicalUrl}
      />
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
                <BreadcrumbPage>{categoryData.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Increased width to match other pages */}
          <div className="w-full lg:w-3/4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold font-roboto mb-4 text-primary-900 dark:text-white">
                {categoryData.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {categoryData.description}
              </p>
            </div>

            {!posts || posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300">
                  No posts found in this category yet. Check back soon for new content!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  Found {posts.length} {posts.length === 1 ? 'post' : 'posts'} in {categoryData.name}
                </div>
                <PostGrid posts={posts} />
              </>
            )}
          </div>

          {/* Sidebar - Smaller width to match other pages */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-primary-900 dark:text-white">
                About {categoryData.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {categoryData.description}
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
