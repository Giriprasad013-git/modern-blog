import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import SignInPage from './pages/SignInPage'
import CMSPage from './pages/CMSPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import NotFound from './pages/NotFound'
import { trackPageView } from './lib/analytics'
import SEO from './components/SEO'

const CMSApp = () => {
  const { user, userRole, loading } = useAuth();
  
  // Track page views
  useEffect(() => {
    trackPageView();
  }, []);

  // Check if user is admin or editor
  const hasAccess = userRole === 'admin' || userRole === 'editor';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Fast and Facts CMS - Content Management"
        description="Content Management System for Fast and Facts blog"
        noindex={true}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={!user ? <SignInPage /> : <Navigate to="/" />} />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            user ? (
              hasAccess ? (
                <CMSPage />
              ) : (
                <UnauthorizedPage />
              )
            ) : (
              <Navigate to="/signin" />
            )
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default CMSApp; 