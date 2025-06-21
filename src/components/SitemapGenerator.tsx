import { useEffect, useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { categories } from '@/data/categories';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const SitemapGenerator = () => {
  const { data: posts, isLoading } = usePosts();
  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([]);
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://your-domain.com';

  useEffect(() => {
    if (isLoading || !posts) return;

    const entries: SitemapEntry[] = [];

    // Add home page
    entries.push({
      url: `${baseUrl}/`,
      changefreq: 'daily',
      priority: 1.0
    });

    // Add static pages
    const staticPages = [
      { path: '/about', priority: 0.8 },
      { path: '/contact', priority: 0.8 },
      { path: '/privacy', priority: 0.5 },
      { path: '/terms', priority: 0.5 },
      { path: '/archives', priority: 0.7 },
      { path: '/popular', priority: 0.8 },
      { path: '/search', priority: 0.6 },
    ];

    staticPages.forEach(page => {
      entries.push({
        url: `${baseUrl}${page.path}`,
        changefreq: 'monthly',
        priority: page.priority
      });
    });

    // Add category pages
    categories.forEach(category => {
      entries.push({
        url: `${baseUrl}/category/${category.slug}`,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Add post pages
    posts.forEach(post => {
      entries.push({
        url: `${baseUrl}/${post.slug}`,
        lastmod: post.updated_at || post.created_at,
        changefreq: 'monthly',
        priority: 0.7
      });
    });

    // Add tag pages
    const allTags = new Set<string>();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => allTags.add(tag));
      }
    });

    Array.from(allTags).forEach(tag => {
      entries.push({
        url: `${baseUrl}/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`,
        changefreq: 'weekly',
        priority: 0.6
      });
    });

    setSitemapEntries(entries);
  }, [posts, isLoading, baseUrl]);

  const generateSitemapXml = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    sitemapEntries.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${entry.url}</loc>\n`;
      if (entry.lastmod) {
        const date = new Date(entry.lastmod);
        xml += `    <lastmod>${date.toISOString().split('T')[0]}</lastmod>\n`;
      }
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
  };

  const downloadSitemap = () => {
    const sitemapXml = generateSitemapXml();
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sitemap Generator</h2>
      
      {isLoading ? (
        <p>Loading sitemap data...</p>
      ) : (
        <>
          <p>Generated {sitemapEntries.length} sitemap entries.</p>
          
          <div className="flex space-x-4">
            <button
              onClick={downloadSitemap}
              className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition-colors"
              disabled={sitemapEntries.length === 0}
            >
              Download Sitemap XML
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Preview</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-96">
              <pre className="text-xs">{generateSitemapXml()}</pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SitemapGenerator;
