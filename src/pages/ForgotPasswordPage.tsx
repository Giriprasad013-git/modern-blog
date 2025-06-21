import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTheme } from '@/hooks/useTheme';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
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
        title="Reset Password | Modern Blog"
        description="Reset your Modern Blog account password."
        noindex={true}
      />
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <ForgotPasswordForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 