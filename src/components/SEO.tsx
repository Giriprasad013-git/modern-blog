import { Helmet } from 'react-helmet-async';
import { Post } from '@/types/post';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  post?: Post;
  category?: string;
  noindex?: boolean;
  canonical?: string;
}

const SEO = ({
  title = "Fast and Facts - Latest Insights on Technology, Business & Lifestyle",
  description = "Discover the latest insights on technology, business, lifestyle, health, and travel. Expert articles, guides, and trends to keep you informed and inspired.",
  keywords = "blog, technology, business, lifestyle, health, travel, articles, insights",
  image = "/placeholder.svg",
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = "website",
  post,
  category,
  noindex = false,
  canonical = typeof window !== 'undefined' ? window.location.href : '',
}: SEOProps) => {
  // Format date for structured data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  // Generate structured data based on page type
  const generateStructuredData = () => {
    // Base website structured data
    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Fast and Facts",
      "url": import.meta.env.VITE_APP_URL || "https://fastandfacts.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${import.meta.env.VITE_APP_URL || "https://fastandfacts.com"}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    // If it's a post page, add article structured data
    if (type === 'article' && post) {
      const articleData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "image": [
          post.image || image
        ],
        "datePublished": formatDate(post.date || post.created_at),
        "dateModified": formatDate(post.updated_at || post.created_at),
        "author": {
          "@type": "Person",
          "name": post.author || "Fast and Facts Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Fast and Facts",
          "logo": {
            "@type": "ImageObject",
            "url": `${import.meta.env.VITE_APP_URL || "https://fastandfacts.com"}/logo.png`
          }
        },
        "description": post.excerpt || description,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        }
      };

      // If there are tags, add keywords
      if (post.tags && post.tags.length > 0) {
        articleData["keywords"] = post.tags.join(", ");
      }

      return [websiteData, articleData];
    }

    // If it's a category page, add collectionPage structured data
    if (category) {
      const categoryData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${category} - Fast and Facts`,
        "description": `Articles about ${category} on Fast and Facts`,
        "url": url,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Fast and Facts",
          "url": import.meta.env.VITE_APP_URL || "https://fastandfacts.com"
        }
      };

      return [websiteData, categoryData];
    }

    // Default to just website data
    return [websiteData];
  };

  // Generate breadcrumbs structured data
  const generateBreadcrumbsData = () => {
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": import.meta.env.VITE_APP_URL || "https://fastandfacts.com"
        }
      ]
    };

    // Add category to breadcrumbs if available
    if (category) {
      breadcrumbList.itemListElement.push({
        "@type": "ListItem",
        "position": 2,
        "name": category,
        "item": `${import.meta.env.VITE_APP_URL || "https://fastandfacts.com"}/category/${category.toLowerCase().replace(/\s+/g, '-')}`
      });
    }

    // Add post to breadcrumbs if available
    if (post) {
      const position = category ? 3 : 2;
      breadcrumbList.itemListElement.push({
        "@type": "ListItem",
        "position": position,
        "name": post.title,
        "item": url
      });
    }

    return breadcrumbList;
  };

  const structuredData = generateStructuredData();
  const breadcrumbsData = generateBreadcrumbsData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${import.meta.env.VITE_APP_URL || "https://fastandfacts.com"}${image}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${import.meta.env.VITE_APP_URL || "https://fastandfacts.com"}${image}`} />

      {/* JSON-LD Structured Data */}
      {structuredData.map((data, index) => (
        <script key={`structured-data-${index}`} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
      
      {/* Breadcrumbs Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbsData)}
      </script>
    </Helmet>
  );
};

export default SEO;
