import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePostBySlug, useRelatedPosts, incrementPostView } from "@/hooks/usePosts";
import { useTrackEvent } from "@/hooks/useAnalytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import BookmarkButton from "@/components/BookmarkButton";
import ReadingListButton from "@/components/ReadingListButton";
import ShareButtons from "@/components/ShareButtons";
import ArticleRating from "@/components/ArticleRating";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import PostCard from "@/components/PostCard";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, User, Loader2 } from "lucide-react";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { trackEvent } = useTrackEvent();
  const [postSlug, setPostSlug] = useState<string | undefined>(slug);
  
  useEffect(() => {
    // Handle both old URLs (/post/slug) and new clean URLs (/slug)
    // Extract slug from URL path if not provided as a parameter
    if (!postSlug) {
      const path = window.location.pathname;
      console.log('Post component - URL path:', path);
      
      // Extract slug from path
      let extractedSlug: string | undefined;
      
      if (path.startsWith('/post/')) {
        extractedSlug = path.substring(6); // Remove '/post/'
      } else if (path !== '/') {
        extractedSlug = path.substring(1); // Remove leading '/'
      }
      
      console.log('Post component - Extracted slug:', extractedSlug);
      setPostSlug(extractedSlug);
    }
  }, [postSlug]);
  
  const { data: post, isLoading, error } = usePostBySlug(postSlug);
  const { data: relatedPosts } = useRelatedPosts(postSlug, post?.category);
  
  useEffect(() => {
    console.log('Post component - Current slug:', postSlug);
    console.log('Post component - Post data:', post);
  }, [postSlug, post]);

  // Track post view and increment view count
  useEffect(() => {
    if (post) {
      console.log('Post loaded, tracking view for:', post.slug);
      trackEvent('post_view', { 
        slug: post.slug, 
        title: post.title,
        category: post.category 
      });
      incrementPostView(post.slug);
    }
  }, [post, trackEvent]);

  // Track reading time when user leaves
  useEffect(() => {
    if (!post) return;
    
    const startTime = Date.now();
    
    return () => {
      const readingTime = Math.round((Date.now() - startTime) / 1000);
      if (readingTime > 10) { // Only track if user spent more than 10 seconds
        trackEvent('reading_time', { 
          slug: post.slug, 
          title: post.title,
          timeSpent: readingTime 
        });
      }
    };
  }, [post, trackEvent]);

  if (isLoading || !postSlug) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>Loading post...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
        <SEO 
          title="Post Not Found | Modern Blog"
          description="The requested post could not be found."
        />
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Post Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              The post you're looking for doesn't exist or has been moved.
              {error && <span className="block mt-2 text-sm">Error: {error.message}</span>}
            </p>
            <Link 
              to="/" 
              className="inline-block bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <SEO 
        post={post}
        title={post.title}
        description={post.excerpt}
        image={post.image}
        url={`/${post.slug}`}
        type="article"
        keywords={`${post.category}, ${post.tags?.join(', ')}, blog, article`}
      />
      <ReadingProgressBar />
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main className="container mx-auto px-4 py-8">
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
                <BreadcrumbLink asChild>
                  <Link to={`/${post.category?.toLowerCase()}`}>{post.category}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Article Content - Increased width from lg:w-2/3 to lg:w-3/4 */}
          <article className="w-full lg:w-3/4">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold font-roboto mb-6 text-primary-900 dark:text-white leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.read_time} min read</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views || 0} views</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Link to={`/${post.category?.toLowerCase()}`}>
                  <Badge variant="secondary" className="hover:bg-accent hover:text-white transition-colors">
                    {post.category}
                  </Badge>
                </Link>
                {post.tags?.map((tag) => (
                  <Link key={tag} to={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Badge variant="outline" className="hover:bg-accent hover:text-white hover:border-accent transition-colors">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>

              <div className="flex gap-4 mb-8">
                <BookmarkButton slug={post.slug} title={post.title} />
                <ReadingListButton slug={post.slug} title={post.title} />
                <ShareButtons 
                  url={`${window.location.origin}/${post.slug}`}
                  title={post.title}
                />
              </div>
            </header>

            {/* Featured Image */}
            {post.image && (
              <div className="mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                  loading="eager"
                />
              </div>
            )}

            {/* Article Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Article Footer */}
            <footer className="border-t pt-8">
              <ArticleRating slug={post.slug} title={post.title} />
              <ShareButtons 
                url={`${window.location.origin}/${post.slug}`}
                title={post.title}
                className="mt-6"
              />
            </footer>

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <section className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-primary-900 dark:text-white">
                  Related Posts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.slice(0, 2).map((relatedPost) => (
                    <PostCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar - Decreased width from lg:w-1/3 to lg:w-1/4 */}
          <div className="w-full lg:w-1/4">
            <Sidebar />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Post;
