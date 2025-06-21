import { Routes, Route, useParams } from 'react-router-dom';
import { usePostBySlug, usePosts } from '@/hooks/usePosts';
import { categories } from '@/data/categories';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy load all page components for better performance
const Index = lazy(() => import('@/pages/Index'));
const Post = lazy(() => import('@/pages/Post'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const SearchResultsPage = lazy(() => import('@/pages/SearchResultsPage'));
const BookmarksPage = lazy(() => import('@/pages/BookmarksPage'));
const ReadingListPage = lazy(() => import('@/pages/ReadingListPage'));
const PopularPage = lazy(() => import('@/pages/PopularPage'));
const ArchivesPage = lazy(() => import('@/pages/ArchivesPage'));
const TagPage = lazy(() => import('@/pages/TagPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const SitemapPage = lazy(() => import('@/pages/SitemapPage'));
const CMSPage = lazy(() => import('@/pages/CMSPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Auth pages
const SignInPage = lazy(() => import('@/pages/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="w-8 h-8 animate-spin mr-2" />
    <span>Loading page...</span>
  </div>
);

// Custom route component to handle dynamic routing for posts vs categories
const DynamicRoute = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: post, isLoading: postLoading } = usePostBySlug(slug);
  const [isRouteResolved, setIsRouteResolved] = useState(false);
  
  useEffect(() => {
    // Only set route as resolved when all data is loaded
    if (!postsLoading && !postLoading) {
      setIsRouteResolved(true);
    }
  }, [slug, post, postsLoading, postLoading]);
  
  // Check if it's a category first
  const isCategory = categories.some(cat => cat.slug === slug);
  if (isCategory) {
    return <CategoryPage />;
  }
  
  // Check if it's a post
  if (post) {
    return <Post />;
  }
  
  // Show loading state while we're fetching data
  if (postsLoading || postLoading || !isRouteResolved) {
    return <PageLoader />;
  }
  
  // Neither category nor post found
  return <NotFound />;
};

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Index />} />
        
        {/* Auth routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* CMS - Admin only */}
        <Route 
          path="/cms" 
          element={
            <ProtectedRoute requiredRole="admin">
              <CMSPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Search */}
        <Route path="/search" element={<SearchResultsPage />} />
        
        {/* User pages - Protected */}
        <Route 
          path="/bookmarks" 
          element={
            <ProtectedRoute>
              <BookmarksPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reading-list" 
          element={
            <ProtectedRoute>
              <ReadingListPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Public pages */}
        <Route path="/popular" element={<PopularPage />} />
        <Route path="/archives" element={<ArchivesPage />} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/post/:slug" element={<Post />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/tag/:tag" element={<TagPage />} />
        
        {/* Static pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        
        {/* Dynamic route for posts and categories - cleaner URLs */}
        <Route path="/:slug" element={<DynamicRoute />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
