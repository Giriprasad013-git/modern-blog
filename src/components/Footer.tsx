
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "./Logo";
import { categories } from "@/data/categories";
import { usePosts } from "@/hooks/usePosts";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: posts = [] } = usePosts();
  
  // Get the 3 most recent posts
  const recentPosts = posts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);
  
  return (
    <footer className="bg-gray-50 dark:bg-slate-900 pt-16 border-t border-gray-100 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <Logo />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Fast and Facts is a modern blog focused on delivering timely, accurate information with clear and concise reporting.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                <Facebook />
              </a>
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                <Twitter />
              </a>
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                <Instagram />
              </a>
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                <Linkedin />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id}>
                  <Link 
                    to={`/category/${category.slug}`} 
                    className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Recent Posts */}
          <div>
            <h4 className="text-lg font-bold mb-4">Recent Posts</h4>
            <ul className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map(post => (
                  <li key={post.id}>
                    <Link to={`/post/${post.slug}`} className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors block">
                      <span className="block text-sm">{post.title}</span>
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">No recent posts available</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-slate-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              © {currentYear} Fast and Facts. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm">
                <li>
                  <Link to="/privacy-policy" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/sitemap" className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">Sitemap</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
