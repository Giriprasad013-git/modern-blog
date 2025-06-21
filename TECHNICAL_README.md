
# Fast and Facts - Technical Documentation

## Project Overview
Fast and Facts is a modern blog application built with React, TypeScript, and Tailwind CSS. This is **NOT** a WordPress site - it's a custom React application with a modern tech stack.

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality React component library
- **React Router DOM** - Client-side routing
- **Lucide React** - Modern icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service (PostgreSQL database, authentication, real-time)
- **@supabase/supabase-js** - JavaScript client for Supabase

### State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management and caching
- **React Context** - Local state management

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript Compiler** - Type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/UI components
│   ├── Header.tsx      # Site header with navigation
│   ├── Footer.tsx      # Site footer
│   ├── Logo.tsx        # Centralized logo component
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── data/               # Static data and configurations
├── integrations/       # Third-party service integrations
├── lib/                # Utility functions and configurations
└── types/              # TypeScript type definitions
```

## WordPress Compatibility

**This project is NOT WordPress compatible.** It's a completely different technology:

- WordPress is PHP-based with a MySQL database
- This project is React/TypeScript-based with Supabase (PostgreSQL)
- Content management is handled through Supabase, not WordPress admin
- Themes and plugins from WordPress cannot be used here

If you need WordPress compatibility, you would need to:
1. Rebuild as a WordPress theme
2. Convert React components to PHP templates
3. Replace Supabase with WordPress database calls

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account (for backend services)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd fast-facts-theme-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env.local` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

### Posts Table
- `id` - Primary key
- `title` - Post title
- `slug` - URL slug
- `content` - Post content (markdown/HTML)
- `excerpt` - Short description
- `featured_image` - Image URL
- `published` - Boolean status
- `created_at` - Timestamp
- `updated_at` - Timestamp
- `author_id` - Foreign key to authors
- `category_id` - Foreign key to categories

### Categories Table
- `id` - Primary key
- `name` - Category name
- `slug` - URL slug
- `description` - Category description

### Tags Table
- `id` - Primary key
- `name` - Tag name
- `slug` - URL slug

### Post_Tags Table (Many-to-many relationship)
- `post_id` - Foreign key to posts
- `tag_id` - Foreign key to tags

## Key Features

### Theme System
- Light/Dark mode toggle
- Automatic system preference detection
- Persistent theme selection (localStorage)

### SEO Optimization
- Meta tags for all pages
- Open Graph tags
- Sitemap generation
- Structured data

### Performance
- Code splitting with React.lazy
- Image optimization
- Query caching with TanStack Query
- Responsive design

### Content Management
- Dynamic post loading from Supabase
- Category and tag filtering
- Search functionality
- Newsletter subscription

## Deployment

### Build Process
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Hosting Options
- **Recommended**: Netlify, Vercel, or Cloudflare Pages
- Static hosting compatible (SPA mode)
- Requires environment variables for Supabase

## Security Considerations

- API keys are exposed on frontend (use Supabase RLS)
- Implement Row Level Security (RLS) in Supabase
- Content sanitization for user-generated content
- Rate limiting for API calls

## Performance Monitoring

- Bundle size analysis with `npm run build`
- Lighthouse scores for performance metrics
- Core Web Vitals monitoring
- Error tracking (consider Sentry integration)

## Contributing

1. Follow TypeScript best practices
2. Use ESLint configurations
3. Write responsive components
4. Test on both light and dark themes
5. Ensure accessibility (ARIA labels, semantic HTML)

## Common Issues

### Build Errors
- Check TypeScript type errors
- Verify all imports exist
- Ensure environment variables are set

### Supabase Connection
- Verify environment variables
- Check Supabase service status
- Review RLS policies

### Styling Issues
- Tailwind classes not applying: Check build process
- Dark mode not working: Verify theme context
- Responsive issues: Test on multiple devices
