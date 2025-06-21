
import { useState } from 'react';
import { Star, StarOff } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useTrackEvent } from '@/hooks/useAnalytics';
import { useToast } from '@/hooks/use-toast';

interface ReadingListButtonProps {
  slug: string;
  title: string;
  className?: string;
}

const ReadingListButton = ({ slug, title, className = "" }: ReadingListButtonProps) => {
  const { isInReadingList, addToReadingList, removeFromReadingList } = useUserPreferences();
  const { trackEvent } = useTrackEvent();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const inReadingList = isInReadingList(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    
    if (inReadingList) {
      removeFromReadingList(slug);
      trackEvent('reading_list_removed', { slug, title });
      toast({
        title: "Removed from reading list",
        description: `"${title}" has been removed from your reading list.`,
      });
    } else {
      addToReadingList(slug);
      trackEvent('reading_list_added', { slug, title });
      toast({
        title: "Added to reading list!",
        description: `"${title}" has been added to your reading list.`,
      });
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        inReadingList 
          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700' 
          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
      } ${isAnimating ? 'scale-110' : 'hover:scale-105'} ${className}`}
      aria-label={inReadingList ? 'Remove from reading list' : 'Add to reading list'}
    >
      {inReadingList ? (
        <StarOff className={`h-4 w-4 transition-transform duration-200 ${isAnimating ? 'rotate-12' : ''}`} />
      ) : (
        <Star className={`h-4 w-4 transition-transform duration-200 ${isAnimating ? 'rotate-12' : ''}`} />
      )}
      <span className="text-sm font-medium">
        {inReadingList ? 'In List' : 'Read Later'}
      </span>
    </button>
  );
};

export default ReadingListButton;
