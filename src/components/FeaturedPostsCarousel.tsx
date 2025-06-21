import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedPostsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: posts, isLoading } = usePosts();
  const navigate = useNavigate();
  const featuredPosts = posts?.slice(0, 5) || [];
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredPosts.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredPosts.length - 1 : prevIndex - 1
    );
  };
  
  useEffect(() => {
    if (featuredPosts.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentIndex, featuredPosts.length]);

  const handlePostClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    navigate(`/${slug}`);
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl">
        <Skeleton className="h-[400px] md:h-[500px] w-full" />
      </div>
    );
  }

  if (featuredPosts.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 h-[400px] md:h-[500px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No featured posts available</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl" role="region" aria-roledescription="carousel" aria-label="Featured posts">
      <div className="relative h-[400px] md:h-[500px] w-full">
        {featuredPosts.map((post, index) => (
          <div 
            key={post.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${
              index === currentIndex ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${featuredPosts.length}: ${post.title}`}
            aria-hidden={index !== currentIndex}
          >
            <div 
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${post.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                <Link to={`/${post.slug}`} onClick={(e) => handlePostClick(e, post.slug)}>
                  <div className="mb-2">
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold font-roboto mb-3 hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center mb-3 text-sm">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{post.read_time} min read</span>
                    </span>
                    <span className="mx-2" aria-hidden="true">•</span>
                    <span>{post.date}</span>
                  </div>
                  <p className="text-sm md:text-base font-merrifield line-clamp-2 md:line-clamp-3">
                    {post.excerpt}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {featuredPosts.length > 1 && (
        <>
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button 
              variant="secondary" 
              size="icon"
              className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 text-white" aria-hidden="true" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon"
              className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 text-white" aria-hidden="true" />
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2" role="tablist">
            {featuredPosts.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-accent w-6" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === currentIndex}
                role="tab"
                tabIndex={index === currentIndex ? 0 : -1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedPostsCarousel;
