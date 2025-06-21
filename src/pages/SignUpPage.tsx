import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTheme } from '@/hooks/useTheme';
import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpPage() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <SEO 
        title="Create Account | Modern Blog"
        description="Sign up for a Modern Blog account to access personalized features and save your favorite content."
        noindex={true}
      />
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <SignUpForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 