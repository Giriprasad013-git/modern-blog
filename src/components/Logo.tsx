
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

const Logo = () => {
  const { theme } = useTheme();

  return (
    <Link 
      to="/" 
      className="flex items-center group transition-all duration-300 hover:scale-105"
      aria-label="fastandfacts.com - Return to homepage"
    >
      <div className="relative">
        <span className="text-2xl font-bold tracking-tight transition-all duration-300">
          <span className={`${
            theme === "dark" 
              ? "text-blue-400 group-hover:text-blue-300" 
              : "text-blue-600 group-hover:text-blue-700"
            } transition-colors duration-300`}>
            fast
          </span>
          <span className={`${
            theme === "dark" 
              ? "text-white group-hover:text-gray-100" 
              : "text-gray-800 group-hover:text-gray-900"
            } transition-colors duration-300`}>
            and
          </span>
          <span className={`${
            theme === "dark" 
              ? "text-blue-400 group-hover:text-blue-300" 
              : "text-blue-600 group-hover:text-blue-700"
            } transition-colors duration-300`}>
            facts
          </span>
          <span className={`text-xs ${
            theme === "dark" 
              ? "text-gray-400 group-hover:text-gray-300" 
              : "text-gray-500 group-hover:text-gray-600"
            } ml-1 transition-colors duration-300`}>
            .com
          </span>
        </span>
        
        {/* Subtle underline animation */}
        <div className={`absolute -bottom-1 left-0 h-0.5 w-0 ${
          theme === "dark" ? "bg-blue-400" : "bg-blue-600"
        } transition-all duration-300 group-hover:w-full`}></div>
      </div>
    </Link>
  );
};

export default Logo;
