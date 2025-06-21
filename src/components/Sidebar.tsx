
import { useState, useEffect } from "react";
import { Search, Bell, BellOff, Calendar, TrendingUp, Star, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useCategoryStats } from "@/hooks/useCategoryStats";
import PopularPosts from "./PopularPosts";

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const { preferences, updateNotificationSettings } = useUserPreferences();
  const { data: categoryStats = [], isLoading: categoriesLoading, refetch: refetchCategories } = useCategoryStats();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Listen for analytics updates to refresh category stats
  useEffect(() => {
    const handleAnalyticsUpdate = () => {
      refetchCategories();
    };
    
    window.addEventListener('analytics-update', handleAnalyticsUpdate);
    
    return () => {
      window.removeEventListener('analytics-update', handleAnalyticsUpdate);
    };
  }, [refetchCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNotificationToggle = async () => {
    if (!isNotificationsEnabled) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setIsNotificationsEnabled(true);
          updateNotificationSettings({
            ...preferences.notifications,
            newPosts: true,
          });
          toast({
            title: "Notifications enabled!",
            description: "You'll receive alerts for new posts in your favorite categories.",
          });
        } else {
          toast({
            title: "Notifications blocked",
            description: "Please enable notifications in your browser settings.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Notification error",
          description: "Unable to enable notifications. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setIsNotificationsEnabled(false);
      updateNotificationSettings({
        ...preferences.notifications,
        newPosts: false,
      });
      toast({
        title: "Notifications disabled",
        description: "You won't receive new post alerts anymore.",
      });
    }
  };

  const quickLinks = [
    { name: "My Bookmarks", icon: Bookmark, href: "/bookmarks" },
    { name: "Reading List", icon: Star, href: "/reading-list" },
    { name: "Popular Posts", icon: TrendingUp, href: "/popular" },
    { name: "Archives", icon: Calendar, href: "/archives" },
  ];

  return (
    <aside className="w-full space-y-6">
      {/* Enhanced Search */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-3 dark:text-white flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-500" />
          Search Articles
        </h3>
        <form onSubmit={handleSearch} className="space-y-3">
          <Input
            type="text"
            placeholder="Search for articles, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Search
          </Button>
        </form>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-3 dark:text-white">Quick Access</h3>
        <div className="space-y-1">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group w-full"
            >
              <link.icon className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors flex-shrink-0" />
              <span className="text-sm font-medium dark:text-white group-hover:text-blue-500 transition-colors">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Posts */}
      <PopularPosts limit={5} />

      {/* Notification Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-3 dark:text-white">Stay Updated</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isNotificationsEnabled ? (
                <Bell className="h-5 w-5 text-green-500" />
              ) : (
                <BellOff className="h-5 w-5 text-gray-400" />
              )}
              <span className="text-sm font-medium dark:text-white">
                Push Notifications
              </span>
            </div>
            <Button
              variant={isNotificationsEnabled ? "default" : "outline"}
              size="sm"
              onClick={handleNotificationToggle}
            >
              {isNotificationsEnabled ? "On" : "Off"}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Get notified when new articles are published in your favorite categories.
          </p>
        </div>
      </div>

      {/* Categories with cleaner URLs */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-3 dark:text-white">Browse by Category</h3>
        <div className="space-y-1">
          {categoriesLoading ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading categories...</div>
          ) : categoryStats.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">No categories available</div>
          ) : (
            categoryStats.map((category) => (
              <Link
                key={category.slug}
                to={`/${category.slug}`} // Cleaner URL without /category/ prefix
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group w-full"
              >
                <span className="text-sm font-medium dark:text-white group-hover:text-blue-500 transition-colors">
                  {category.name}
                </span>
                <span className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs flex-shrink-0">
                  {category.count}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-lg p-4 text-white">
        <h3 className="text-lg font-bold mb-2">Never Miss a Post</h3>
        <p className="text-sm mb-3 opacity-90">
          Join our newsletter for weekly insights and exclusive content.
        </p>
        <Button 
          variant="secondary" 
          className="w-full bg-white text-gray-900 hover:bg-gray-100"
          asChild
        >
          <Link to="#newsletter">Subscribe Now</Link>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
