
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchOverlay from "./SearchOverlay";
import Navigation from "./Navigation";
import Logo from "./Logo";

interface HeaderProps {
  toggleTheme: () => void;
  currentTheme: string;
}

const Header = ({ toggleTheme, currentTheme }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${
          isScrolled 
            ? "bg-white dark:bg-slate-900 shadow-md" 
            : "bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <Logo />
            </div>
            
            <div className="hidden lg:block">
              <Navigation />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="focus:ring-2 focus:ring-primary/20"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                aria-label={currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="focus:ring-2 focus:ring-primary/20"
              >
                {currentTheme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                </span>
              </Button>
              
              <div className="block lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                  className="focus:ring-2 focus:ring-primary/20"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {mobileMenuOpen ? "Close menu" : "Open menu"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div 
          id="mobile-menu"
          className={`lg:hidden bg-white dark:bg-slate-900 shadow-md overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <Navigation mobile onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      </header>
      
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      
      {/* Spacer to push content below fixed header */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Header;
