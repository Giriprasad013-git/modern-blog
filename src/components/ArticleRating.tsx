
import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useArticleRatings } from '@/hooks/useArticleRatings';
import { useToast } from '@/hooks/use-toast';

interface ArticleRatingProps {
  slug: string;
  title: string;
}

const ArticleRating = ({ slug, title }: ArticleRatingProps) => {
  const { rateArticle, markHelpful, getArticleRating, getAverageRating } = useArticleRatings();
  const { toast } = useToast();
  const [hoveredStar, setHoveredStar] = useState(0);

  const userRating = getArticleRating(slug);
  const averageRating = getAverageRating(slug);

  const handleStarClick = (rating: number) => {
    rateArticle(slug, rating);
    toast({
      title: "Thank you for rating!",
      description: `You rated "${title}" ${rating} star${rating !== 1 ? 's' : ''}.`,
    });
  };

  const handleHelpfulClick = (helpful: boolean) => {
    markHelpful(slug, helpful);
    toast({
      title: helpful ? "Thanks for the feedback!" : "Feedback received",
      description: helpful ? "Glad you found this article helpful." : "We'll work to improve our content.",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-600">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">Rate this article</h3>
        <div className="flex justify-center items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
            >
              <Star
                className={`h-6 w-6 transition-colors duration-150 ${
                  star <= (hoveredStar || userRating?.rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>
        {userRating?.rating && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
            You rated this article {userRating.rating} star{userRating.rating !== 1 ? 's' : ''}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Average rating: {averageRating}/5 stars
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <p className="text-center text-sm font-medium mb-3 dark:text-white">
          Was this article helpful?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleHelpfulClick(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
              userRating?.helpful === true
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700'
                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border-gray-300 dark:border-gray-500'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm">Yes {userRating?.helpful === true && '✓'}</span>
          </button>
          <button
            onClick={() => handleHelpfulClick(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
              userRating?.helpful === false
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700'
                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-gray-300 dark:border-gray-500'
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="text-sm">No {userRating?.helpful === false && '✓'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleRating;
