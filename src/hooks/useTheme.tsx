
import { useState, useEffect, useCallback } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState<string>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    
    // Default to light
    return "light";
  });

  // Apply theme to document with smooth transition
  useEffect(() => {
    const root = document.documentElement;
    
    // Add transition class for smooth theme switching
    root.style.transition = "background-color 0.3s ease, color 0.3s ease";
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Remove transition after theme change to avoid interfering with other animations
    const timeoutId = setTimeout(() => {
      root.style.transition = "";
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [theme]);
  
  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      
      // Add a subtle animation effect
      document.documentElement.style.transition = "all 0.3s ease";
      
      // Log theme change for analytics
      console.log(`Theme switched to: ${newTheme}`);
      
      return newTheme;
    });
  }, []);

  // Auto-save user's theme preference
  const setThemeWithPreference = useCallback((newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, []);

  return { 
    theme, 
    toggleTheme,
    setTheme: setThemeWithPreference,
    isDark: theme === "dark",
    isLight: theme === "light"
  };
};
