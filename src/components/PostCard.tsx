import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Share2, Eye } from "lucide-react";
import { Post } from "@/types/post";
import ShareButtons from "./ShareButtons";
import ContentFreshness from "./ContentFreshness";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [showShareButtons, setShowShareButtons] = useState(false);
  const navigate = useNavigate();

  const handlePostClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    navigate(`/${slug}`);
  };

  return (
    <article className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg group">
      <div className="relative overflow-hidden aspect-[16/9]">
        <Link 
          to={`/${post.slug}`} 
          onClick={(e) => handlePostClick(e, post.slug)}
          aria-label={`Read article: ${post.title}`}
        >
          <img 
            src={post.image} 
            alt={`Featured image for ${post.title}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            width="800"
            height="450"
            loading="lazy"
            decoding="async"
          />
        </Link>
        <div className="absolute top-4 left-4 flex gap-2">
          <Link 
            to={`/category/${post.category.toLowerCase()}`}
            className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-accent/90 transition-colors"
            aria-label={`View all posts in category: ${post.category}`}
          >
            {post.category}
          </Link>
          <ContentFreshness 
            createdAt={post.created_at || post.date} 
            updatedAt={post.updated_at}
          />
        </div>
        {post.views && post.views > 0 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1" aria-label={`${post.views.toLocaleString()} views`}>
            <Eye className="h-3 w-3" aria-hidden="true" />
            <span>{post.views.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <Link to={`/${post.slug}`} onClick={(e) => handlePostClick(e, post.slug)}>
          <h3 className="text-xl font-bold font-roboto mb-2 text-primary-900 dark:text-white hover:text-accent dark:hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>{post.read_time} min read</span>
          </span>
          <span className="mx-2" aria-hidden="true">•</span>
          <span>{post.date}</span>
          <span className="mx-2" aria-hidden="true">•</span>
          <span>{post.author}</span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 font-merrifield line-clamp-3">
          {post.excerpt}
        </p>
        
        {/* Tags with cleaner URLs */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4" aria-label="Article tags">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                to={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-accent hover:text-white px-2 py-1 rounded-full text-xs transition-colors"
                aria-label={`See all posts tagged with ${tag}`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/${post.slug}`}
            onClick={(e) => handlePostClick(e, post.slug)}
            className="text-accent font-medium hover:underline transition-colors"
            aria-label={`Read more about ${post.title}`}
          >
            Read more
          </Link>
          
          <div className="relative">
            <button 
              className="text-gray-600 dark:text-gray-300 hover:text-accent p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Share this post"
              onClick={(e) => {
                e.preventDefault();
                setShowShareButtons(!showShareButtons);
              }}
              aria-expanded={showShareButtons}
              aria-controls="share-buttons"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
            </button>
            {showShareButtons && (
              <div 
                id="share-buttons"
                className="absolute bottom-full right-0 mb-2 z-10"
              >
                <ShareButtons url={`/${post.slug}`} title={post.title} />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
