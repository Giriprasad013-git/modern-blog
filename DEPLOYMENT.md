# Deployment Guide

This document provides instructions for deploying the Modern Blog application using GitHub Actions and Netlify.

## Setting Up GitHub Repository

1. Create a new GitHub repository
2. Push your code to the repository:
   ```bash
   # Using the setup script
   ./setup-remote.ps1 -Username "yourusername" -RepoName "modern-blog"
   
   # Or manually
   git remote add origin https://github.com/yourusername/modern-blog.git
   git push -u origin main
   git push -u origin develop
   ```

## Setting Up GitHub Secrets

For the CI/CD workflows to work properly, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click on "New repository secret"
4. Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `APP_URL` | Your application URL (e.g., https://your-domain.com) |
| `APP_NAME` | Your application name (e.g., "Modern Blog") |
| `NETLIFY_AUTH_TOKEN` | Your Netlify authentication token |
| `NETLIFY_STAGING_SITE_ID` | Your Netlify staging site ID |
| `NETLIFY_PRODUCTION_SITE_ID` | Your Netlify production site ID |
| `PRODUCTION_DOMAIN` | Your production domain (e.g., your-domain.com) |
| `STAGING_URL` | Your staging URL (e.g., staging.your-domain.com) |
| `SLACK_WEBHOOK_URL` | (Optional) Slack webhook URL for notifications |
| `SENTRY_DSN` | Your Sentry DSN for error tracking |

## Setting Up Netlify

1. Create two sites in Netlify:
   - One for staging
   - One for production

2. Get your site IDs:
   - Go to Site settings > General > Site details
   - Copy the API ID (this is your site ID)

3. Create a Netlify authentication token:
   - Go to User settings > Applications > Personal access tokens
   - Generate a new token with appropriate permissions

## Setting Up Supabase

1. Create a new Supabase project

2. Run the migration files:
   - Go to the SQL Editor in the Supabase dashboard
   - Copy and paste the contents of `supabase/migrations/20250613000000_auth_and_rls.sql`
   - Run the SQL

3. Configure authentication providers:
   - Go to Authentication > Providers
   - Enable the providers you want to use (Email, Google, etc.)
   - Configure the providers with appropriate credentials

## Setting Up Sentry

1. Create a Sentry account and project
2. Get your DSN:
   - Go to Settings > Projects > [Your Project]
   - Navigate to Client Keys (DSN)
   - Copy the DSN

## Setting Up Plausible Analytics

1. Create a Plausible Analytics account
2. Add your site to Plausible
3. Update the `VITE_PLAUSIBLE_DOMAIN` environment variable with your domain

## Environment Variables

Create a `.env` file based on `.env.example` with the following variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME="Modern Blog"
VITE_APP_URL=https://your-domain.com
VITE_APP_VERSION=0.1.0

# Error Tracking (Sentry)
VITE_SENTRY_DSN=your_sentry_dsn

# Analytics
VITE_PLAUSIBLE_DOMAIN=your-domain.com
```

## Deployment Process

The CI/CD workflows are configured to:

1. Run linting and build checks on every push and pull request
2. Deploy to staging when changes are pushed to the `develop` branch
3. Deploy to production when changes are pushed to the `main` branch

To manually trigger a deployment:

```bash
# Deploy to staging
git checkout develop
git commit -m "Your changes"
git push origin develop

# Deploy to production
git checkout main
git merge develop
git push origin main
``` 