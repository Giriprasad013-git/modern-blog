import { useEffect } from "react";
import { useTrackEvent } from "@/hooks/useAnalytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import FeaturedPostsCarousel from "@/components/FeaturedPostsCarousel";
import PostGrid from "@/components/PostGrid";
import NewsletterPopup from "@/components/NewsletterPopup";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";

const Index = () => {
  const { trackEvent } = useTrackEvent();
  const { theme, toggleTheme } = useTheme();
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);

  useEffect(() => {
    trackEvent('page_view', { page: 'home' });
  }, [trackEvent]);

  useEffect(() => {
    // Show newsletter popup after 30 seconds if not already subscribed or dismissed
    const hasSubscribed = localStorage.getItem('newsletter_subscribed');
    const lastDismissed = localStorage.getItem('newsletter_dismissed');
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    if (!hasSubscribed && (!lastDismissed || parseInt(lastDismissed) < oneDayAgo)) {
      const timer = setTimeout(() => {
        setShowNewsletterPopup(true);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <SEO 
        title="Modern Blog - Latest Insights on Technology, Business & Lifestyle"
        description="Discover the latest insights on technology, business, lifestyle, health, and travel. Expert articles, guides, and trends to keep you informed and inspired."
        keywords="blog, technology, business, lifestyle, health, travel, articles, insights, modern blog"
      />
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Featured Posts Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold font-roboto mb-6 text-primary-900 dark:text-white">
            Featured Posts
          </h2>
          <FeaturedPostsCarousel />
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Increased width from lg:w-2/3 to lg:w-3/4 */}
          <div className="w-full lg:w-3/4">
            <section>
              <h2 className="text-2xl font-bold font-roboto mb-6 text-primary-900 dark:text-white">
                Recent Posts
              </h2>
              <PostGrid limit={6} />
            </section>
          </div>

          {/* Sidebar - Decreased width from lg:w-1/3 to lg:w-1/4 */}
          <div className="w-full lg:w-1/4">
            <Sidebar />
          </div>
        </div>
      </main>
      
      <Footer />
      {showNewsletterPopup && (
        <NewsletterPopup onClose={() => setShowNewsletterPopup(false)} />
      )}
    </div>
  );
};

export default Index;
