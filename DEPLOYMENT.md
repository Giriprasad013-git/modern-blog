# Deployment Guide

This document provides instructions for deploying the Fast and Facts blog application using GitHub Actions and Hostinger.

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
| `APP_URL` | Your application URL (e.g., https://fastandfacts.com) |
| `APP_NAME` | Your application name (e.g., "Fast and Facts") |
| `FTP_SERVER` | Your Hostinger FTP server address |
| `FTP_USERNAME` | Your Hostinger FTP username |
| `FTP_PASSWORD` | Your Hostinger FTP password |
| `FTP_SERVER_DIR` | Your production directory on Hostinger for the main site (e.g., "/") |
| `FTP_CMS_DIR` | Your production directory on Hostinger for the CMS (e.g., "/cms/") |
| `FTP_STAGING_DIR` | Your staging directory on Hostinger for the main site (e.g., "/staging/") |
| `FTP_CMS_STAGING_DIR` | Your staging directory on Hostinger for the CMS (e.g., "/staging/cms/") |
| `STAGING_URL` | Your staging URL for the main site (e.g., https://staging.fastandfacts.com) |
| `CMS_STAGING_URL` | Your staging URL for the CMS (e.g., https://staging-cms.fastandfacts.com) |
| `SLACK_WEBHOOK_URL` | (Optional) Slack webhook URL for notifications |
| `SENTRY_DSN` | Your Sentry DSN for error tracking |

## Setting Up Hostinger

1. Create your Hostinger account and set up your domains:
   - Main site: fastandfacts.com
   - CMS: cms.fastandfacts.com

2. Set up FTP access:
   - Go to your Hostinger control panel
   - Navigate to Files > FTP Accounts
   - Create a new FTP account or use the existing one
   - Note down the FTP server address, username, and password

3. Create directories for the different deployments:
   - Main site (production): /home/u749668517/domains/fastandfacts.com/public_html/
   - CMS (production): /home/u749668517/domains/fastandfacts.com/public_html/cms/
   - Main site (staging): Create a staging subdomain and directory
   - CMS (staging): Create a staging-cms subdomain and directory

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
VITE_APP_NAME="Fast and Facts"
VITE_APP_URL=https://fastandfacts.com
VITE_APP_VERSION=0.1.0

# Error Tracking (Sentry)
VITE_SENTRY_DSN=your_sentry_dsn

# Analytics
VITE_PLAUSIBLE_DOMAIN=fastandfacts.com
```

## Deployment Process

The CI/CD workflows are configured to:

1. Run linting and build checks on every push and pull request
2. Deploy to staging when changes are pushed to the `develop` branch
3. Deploy to production when changes are pushed to the `main` branch

### Build Process

The project has separate builds for the main site and CMS:

- `npm run build` - Builds only the main site (output to `dist/`)
- `npm run build:cms` - Builds only the CMS (output to `dist-cms/`)
- `npm run build:all` - Builds both the main site and CMS

### Deployment Destinations

- Main site (production): https://fastandfacts.com
- CMS (production): https://cms.fastandfacts.com
- Main site (staging): https://staging.fastandfacts.com (or your staging URL)
- CMS (staging): https://staging-cms.fastandfacts.com (or your CMS staging URL)

### Manual Deployment

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