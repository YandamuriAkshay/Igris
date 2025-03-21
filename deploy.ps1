# Install Vercel CLI if not already installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Vercel CLI..."
    iwr https://get.vercel.com/download.sh -useb | iex
}

# Build the application
Write-Host "Building the application..."
npm run build

# Deploy to Vercel
Write-Host "Deploying to Vercel..."
vercel deploy --prod 