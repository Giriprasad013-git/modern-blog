
import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useToast } from '@/hooks/use-toast';

interface BookmarkButtonProps {
  slug: string;
  title: string;
  className?: string;
}

const BookmarkButton = ({ slug, title, className = "" }: BookmarkButtonProps) => {
  const { isBookmarked, addBookmark, removeBookmark, trackEvent } = useUserPreferences();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const bookmarked = isBookmarked(slug);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    
    if (bookmarked) {
      await removeBookmark(slug);
      await trackEvent('bookmark_removed', { slug, title });
      toast({
        title: "Bookmark removed",
        description: `"${title}" has been removed from your bookmarks.`,
      });
    } else {
      await addBookmark(slug);
      await trackEvent('bookmark_added', { slug, title });
      toast({
        title: "Article bookmarked!",
        description: `"${title}" has been saved to your bookmarks.`,
      });
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        bookmarked 
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700' 
          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
      } ${isAnimating ? 'scale-110' : 'hover:scale-105'} ${className}`}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? (
        <BookmarkCheck className={`h-4 w-4 transition-transform duration-200 ${isAnimating ? 'rotate-12' : ''}`} />
      ) : (
        <Bookmark className={`h-4 w-4 transition-transform duration-200 ${isAnimating ? 'rotate-12' : ''}`} />
      )}
      <span className="text-sm font-medium">
        {bookmarked ? 'Saved' : 'Save'}
      </span>
    </button>
  );
};

export default BookmarkButton;
