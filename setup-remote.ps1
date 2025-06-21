param (
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

# Set the remote URL
$remoteUrl = "https://github.com/$Username/$RepoName.git"

# Add the remote
Write-Host "Setting up remote repository: $remoteUrl"
git remote add origin $remoteUrl

# Push both branches
Write-Host "Pushing main branch..."
git checkout main
git push -u origin main

Write-Host "Pushing develop branch..."
git checkout develop
git push -u origin develop

Write-Host "Repository setup complete!"
Write-Host "Main repository URL: $remoteUrl"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Set up GitHub repository secrets for CI/CD"
Write-Host "2. Configure Supabase with the RLS policies"
Write-Host "3. Set up Sentry and Plausible Analytics accounts"
Write-Host "4. Update the environment variables in your deployment platform" 