# Modern Blog

A feature-rich blog platform built with React, TypeScript, and Supabase, deployed at [fastandfacts.com](https://fastandfacts.com).

## Features

- 🔐 **Authentication** - Email/password and OAuth authentication with Supabase Auth
- 👥 **Role-based Access Control** - Admin, editor, and viewer roles with appropriate permissions
- 🔒 **Row Level Security** - Secure database access with Supabase RLS policies
- 📱 **Responsive Design** - Mobile-first UI that works on all devices
- 🎨 **Theming** - Light and dark mode support
- 🔍 **SEO Optimized** - Meta tags, JSON-LD structured data, and dynamic sitemap generation
- 📊 **Analytics** - Integration with Plausible Analytics
- 🐞 **Error Tracking** - Integration with Sentry for error monitoring
- 🚀 **CI/CD** - Automated deployment with GitHub Actions to Hostinger

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/modern-blog.git
cd modern-blog
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the environment variables in the `.env` file with your Supabase credentials and other configuration.

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

### Database Setup

1. Create a new Supabase project.

2. Run the migration files in the `supabase/migrations` directory using the Supabase CLI or the SQL Editor in the Supabase dashboard.

3. Enable the authentication providers you want to use in the Supabase dashboard.

## Deployment

The project includes GitHub Actions workflows for CI/CD:

- `ci.yml` - Runs linting and builds the project on every push and pull request
- `cd-staging.yml` - Deploys to staging when changes are pushed to the `develop` branch
- `cd-production.yml` - Deploys to production when changes are pushed to the `main` branch

To set up deployment:

1. Configure the necessary secrets in your GitHub repository:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `APP_URL`
   - `APP_NAME`
   - `FTP_SERVER`
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
   - `FTP_SERVER_DIR`
   - `FTP_STAGING_DIR`
   - `STAGING_URL`
   - `SLACK_WEBHOOK_URL` (optional)

2. Push to the `develop` or `main` branch to trigger deployments.

## Project Structure

```
/
├── .github/workflows/    # GitHub Actions workflows
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   └── integrations/     # Third-party integrations
└── supabase/
    └── migrations/       # Database migration files
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
