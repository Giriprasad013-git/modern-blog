import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTheme } from '@/hooks/useTheme';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <SEO 
        title="Unauthorized Access | Modern Blog"
        description="You don't have permission to access this page."
        noindex={true}
      />
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900 dark:text-white">
            Unauthorized Access
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/"
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Back to Home
            </Link>
            
            <Link 
              to="/signin"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Sign In as Different User
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 