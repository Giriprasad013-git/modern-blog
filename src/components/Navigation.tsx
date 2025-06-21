
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
  mobile?: boolean;
  onClose?: () => void;
}

const Navigation = ({ mobile = false, onClose }: NavigationProps) => {
  const location = useLocation();
  
  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "Technology", path: "/category/technology" },
    { label: "Business", path: "/category/business" },
    { label: "Lifestyle", path: "/category/lifestyle" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const handleClick = () => {
    if (mobile && onClose) {
      onClose();
    }
  };

  return (
    <nav className={`${mobile ? "flex flex-col space-y-4" : "flex space-x-6"}`}>
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`font-roboto transition-colors duration-200 ${
            location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path)) 
              ? "text-accent font-medium" 
              : "text-primary-900 dark:text-white hover:text-accent"
          }`}
          onClick={handleClick}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
