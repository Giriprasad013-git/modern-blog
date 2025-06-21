
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-6xl font-bold text-accent mb-6">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/">Return to Home</Link>
            </Button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Looking for something specific? Try using the search feature in the header.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
