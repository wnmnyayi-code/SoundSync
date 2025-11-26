# Setup script to fix npm issues with $ in username
# Run this once: powershell -ExecutionPolicy Bypass -File .\setup-npm.ps1

Write-Host "Setting up npm to avoid username path issues..." -ForegroundColor Cyan

# Create necessary directories
$npmCache = "C:\npm-cache"
$npmPrefix = "C:\npm-prefix"

if (-not (Test-Path $npmCache)) {
    New-Item -ItemType Directory -Path $npmCache -Force | Out-Null
    Write-Host "Created npm cache directory: $npmCache" -ForegroundColor Green
}

if (-not (Test-Path $npmPrefix)) {
    New-Item -ItemType Directory -Path $npmPrefix -Force | Out-Null
    Write-Host "Created npm prefix directory: $npmPrefix" -ForegroundColor Green
}

# Configure npm to use these directories
npm config set cache $npmCache --global
npm config set prefix $npmPrefix --global

Write-Host "`nNPM configuration updated:" -ForegroundColor Green
npm config get cache
npm config get prefix

Write-Host "`nSetup complete! You can now use npm commands normally." -ForegroundColor Green
Write-Host "Try running: npm run dev" -ForegroundColor Yellow