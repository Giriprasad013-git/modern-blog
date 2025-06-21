
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface SearchOverlayProps {
  onClose: () => void;
}

const SearchOverlay = ({ onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus the input when the overlay appears
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Add escape key listener
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-start justify-center pt-20 md:pt-32 px-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-xl md:text-2xl font-bold">Search</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-accent transition-colors"
            aria-label="Close search"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles..."
              className="w-full p-4 bg-white/10 border border-white/20 text-white text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="absolute right-4 top-4 text-white hover:text-accent transition-colors"
              aria-label="Submit search"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchOverlay;
