
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/useTheme";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { categories } from "@/data/categories";

const SitemapPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Sitemap</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-roboto mb-8 text-primary-900 dark:text-white">
            Sitemap
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Pages */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Main Pages</h2>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-accent hover:underline">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="text-accent hover:underline">About</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-accent hover:underline">Contact</Link>
                </li>
                <li>
                  <Link to="/search" className="text-accent hover:underline">Search</Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <Link 
                      to={`/category/${category.slug}`} 
                      className="text-accent hover:underline"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Pages */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Legal</h2>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-accent hover:underline">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SitemapPage;
