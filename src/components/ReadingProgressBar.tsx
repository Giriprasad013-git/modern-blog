
import { useState, useEffect } from "react";

const ReadingProgressBar = () => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const article = document.querySelector('article');
    const header = document.querySelector('header');
    const headerHeight = header?.offsetHeight || 80;
    
    const updateReadingProgress = () => {
      if (!article) return;
      
      const currentScrollPos = window.scrollY;
      const articleStart = article.offsetTop - headerHeight;
      const articleHeight = article.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // Show progress bar only when user starts reading the article
      if (currentScrollPos < articleStart) {
        setReadingProgress(0);
        setIsVisible(false);
        return;
      }
      
      setIsVisible(true);
      
      // Calculate reading progress more accurately
      const articleVisibleHeight = articleHeight - windowHeight;
      const currentProgress = currentScrollPos - articleStart;
      
      // Ensure we don't exceed 100% and have a minimum threshold
      const readingPercentage = Math.min(
        Math.max((currentProgress / articleVisibleHeight) * 100, 0), 
        100
      );
      
      setReadingProgress(readingPercentage);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateReadingProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledUpdate, { passive: true });
    window.addEventListener("resize", updateReadingProgress);
    
    // Initial calculation with a slight delay
    const timeoutId = setTimeout(updateReadingProgress, 100);
    
    return () => {
      window.removeEventListener("scroll", throttledUpdate);
      window.removeEventListener("resize", updateReadingProgress);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 z-50 transition-all duration-300 ease-out shadow-sm"
        style={{ 
          width: `${readingProgress}%`,
          opacity: isVisible ? 1 : 0
        }}
        role="progressbar"
        aria-valuenow={readingProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Reading progress: ${Math.round(readingProgress)}%`}
      />
      
      {/* Subtle glow effect */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-blue-400/30 z-40 blur-sm transition-all duration-300 ease-out"
        style={{ 
          width: `${readingProgress}%`,
          opacity: isVisible ? 0.6 : 0
        }}
      />
      
      {/* Progress indicator tooltip */}
      {readingProgress > 10 && (
        <div 
          className="fixed top-4 right-4 bg-white dark:bg-slate-800 text-xs px-3 py-1 rounded-full shadow-lg border border-gray-200 dark:border-slate-600 transition-all duration-300 z-40"
          style={{ 
            opacity: readingProgress > 90 ? 0 : 0.8,
            transform: `translateY(${readingProgress > 90 ? -10 : 0}px)`
          }}
        >
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            {Math.round(readingProgress)}% read
          </span>
        </div>
      )}
    </>
  );
};

export default ReadingProgressBar;
