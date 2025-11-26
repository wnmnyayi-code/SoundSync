# SoundSync - GitHub Push Script
# Run this after creating your GitHub repository

Write-Host "🎵 SoundSync - GitHub Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Initializing now..." -ForegroundColor Red
    git init
    Write-Host "✅ Git initialized`n" -ForegroundColor Green
}

# Stage all files
Write-Host "📦 Staging files..." -ForegroundColor Yellow
git add .

# Show status
Write-Host "`n📊 Git Status:" -ForegroundColor Yellow
git status

# Create initial commit
Write-Host "`n💾 Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: SoundSync music streaming platform

Features:
- Complete user authentication system
- Audio upload and streaming with FFmpeg
- Live streaming with Socket.io/MediaSoup
- Commerce system with Stripe integration
- Social features (follow, messaging, notifications)
- Influencer referral system
- Admin dashboard with analytics
- AWS S3 file storage integration
- Email system with templates
- Comprehensive error handling
- Testing infrastructure

Tech Stack:
- Next.js 16 + TypeScript
- Prisma + PostgreSQL
- Stripe payments
- AWS S3 storage
- Socket.io real-time
"

Write-Host "`n✅ Commit created!`n" -ForegroundColor Green

# Instructions for GitHub
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new`n" -ForegroundColor Gray

Write-Host "2. Repository settings:" -ForegroundColor White
Write-Host "   - Name: soundsync" -ForegroundColor Gray
Write-Host "   - Description: 🎵 SoundSync - Advanced music streaming platform" -ForegroundColor Gray
Write-Host "   - Public or Private (your choice)" -ForegroundColor Gray
Write-Host "   - DO NOT initialize with README`n" -ForegroundColor Gray

Write-Host "3. After creating, run ONE of these commands:`n" -ForegroundColor White

Write-Host "   Option A - HTTPS (recommended):" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/soundsync.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main`n" -ForegroundColor Gray

Write-Host "   Option B - SSH:" -ForegroundColor Yellow
Write-Host "   git remote add origin git@github.com:YOUR_USERNAME/soundsync.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main`n" -ForegroundColor Gray

Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "📚 Documentation created:" -ForegroundColor Green
Write-Host "   ✅ README.md - Project overview" -ForegroundColor Gray
Write-Host "   ✅ GITHUB_SETUP.md - Detailed setup guide" -ForegroundColor Gray
Write-Host "   ✅ SETUP_COMPLETE.md - Full setup instructions" -ForegroundColor Gray
Write-Host "   ✅ IMPLEMENTATION_COMPLETE.md - Feature status`n" -ForegroundColor Gray

Write-Host "🚀 Ready to push to GitHub!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

# Ask if user wants to open GitHub
$openGitHub = Read-Host "Would you like to open GitHub to create the repository? (y/n)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/new"
    Write-Host "`n✅ Opening GitHub in your browser...`n" -ForegroundColor Green
}

Write-Host "💡 Tip: After pushing, set up Vercel deployment for automatic deployments!" -ForegroundColor Cyan
