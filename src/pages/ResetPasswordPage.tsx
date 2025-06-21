import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTheme } from '@/hooks/useTheme';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <SEO 
        title="Set New Password | Modern Blog"
        description="Set a new password for your Modern Blog account."
        noindex={true}
      />
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <ResetPasswordForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 