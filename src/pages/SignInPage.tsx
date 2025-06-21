import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTheme } from '@/hooks/useTheme';
import SignInForm from '@/components/auth/SignInForm';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInPage() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to home
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <SEO 
        title="Sign In | Modern Blog"
        description="Sign in to your Modern Blog account to access personalized features."
        noindex={true}
      />
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <SignInForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 