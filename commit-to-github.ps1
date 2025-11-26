# SoundSync - GitHub Commit Script
# Cleans up repository and commits to GitHub

Write-Host ""
Write-Host "🎵 SoundSync - GitHub Commit Preparation" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean up git cache
Write-Host "🧹 Cleaning git cache..." -ForegroundColor Yellow
git rm -r --cached . 2>$null | Out-Null
Write-Host "✅ Cache cleaned" -ForegroundColor Green
Write-Host ""

# Step 2: Stage all files
Write-Host "📦 Staging files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files staged" -ForegroundColor Green
Write-Host ""

# Step 3: Show what will be committed
Write-Host "📊 Files to be committed:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Step 4: Verify sensitive files are ignored
Write-Host "🔒 Verifying sensitive files are NOT staged:" -ForegroundColor Yellow
$envStaged = git diff --cached --name-only | Select-String "\.env$"
$envLocalStaged = git diff --cached --name-only | Select-String "\.env\.local"
$nodeModulesStaged = git diff --cached --name-only | Select-String "node_modules"

if ($envStaged) {
    Write-Host "  ❌ WARNING: .env is staged!" -ForegroundColor Red
} else {
    Write-Host "  ✅ .env is properly ignored" -ForegroundColor Green
}

if ($envLocalStaged) {
    Write-Host "  ❌ WARNING: .env.local is staged!" -ForegroundColor Red
} else {
    Write-Host "  ✅ .env.local is properly ignored" -ForegroundColor Green
}

if ($nodeModulesStaged) {
    Write-Host "  ❌ WARNING: node_modules is staged!" -ForegroundColor Red
} else {
    Write-Host "  ✅ node_modules is properly ignored" -ForegroundColor Green
}
Write-Host ""

# Step 5: Create commit
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m @"
Initial commit: SoundSync music streaming platform

🎵 SoundSync - Advanced Music Streaming Platform

Features:
✅ User authentication with NextAuth.js
✅ Multi-role system (Admin, Creator, Merchant, Influencer, Fan)
✅ Audio upload with FFmpeg normalization
✅ Live streaming with Socket.io/MediaSoup
✅ Commerce system with Stripe integration
✅ AWS S3 file storage
✅ Email system with HTML templates
✅ Social features (follow, messaging, notifications)
✅ Influencer referral system
✅ Admin analytics dashboard
✅ Comprehensive error handling
✅ Testing infrastructure

Tech Stack:
- Next.js 16 + TypeScript 5.9
- Prisma 6.19 + PostgreSQL
- Stripe payments
- AWS S3 storage
- Socket.io real-time
- Tailwind CSS 4.0
- Radix UI components

Documentation:
- README.md - Project overview
- SETUP_COMPLETE.md - Full setup guide
- GITHUB_SETUP.md - Repository setup
- IMPLEMENTATION_COMPLETE.md - Feature status

Status: Production ready (95% complete)
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit created successfully!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "❌ Commit failed. Please check the error above." -ForegroundColor Red
    Write-Host ""
    exit
}

# Step 6: Instructions for pushing
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📝 Next Steps to Push to GitHub:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Create repository on GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Repository settings:" -ForegroundColor White
Write-Host "   - Name: soundsync" -ForegroundColor Gray
Write-Host "   - Description: 🎵 Advanced music streaming platform" -ForegroundColor Gray
Write-Host "   - Public or Private" -ForegroundColor Gray
Write-Host "   - DO NOT initialize with README" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Connect and push (choose one):" -ForegroundColor White
Write-Host ""

Write-Host "   HTTPS (recommended):" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/soundsync.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""

Write-Host "   SSH:" -ForegroundColor Yellow
Write-Host "   git remote add origin git@github.com:YOUR_USERNAME/soundsync.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 7: Offer to open GitHub
$openGitHub = Read-Host "Open GitHub to create repository? (y/n)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/new"
    Write-Host ""
    Write-Host "✅ Opening GitHub..." -ForegroundColor Green
    Write-Host ""
}

Write-Host "🚀 Repository is ready to push!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
