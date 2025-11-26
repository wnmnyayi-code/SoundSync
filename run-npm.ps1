# Wrapper script to run npm commands without $ username issues
# Usage: powershell -ExecutionPolicy Bypass -File .\run-npm.ps1 run dev

# Set temp directories to avoid path issues
$env:TEMP = "C:\Temp"
$env:TMP = "C:\Temp"
$env:TMPDIR = "C:\Temp"

# Set npm cache and prefix
$env:NPM_CONFIG_CACHE = "C:\npm-cache"
$env:NPM_CONFIG_PREFIX = "C:\npm-prefix"

# Ensure directories exist
if (-not (Test-Path "C:\Temp")) { New-Item -ItemType Directory -Path "C:\Temp" -Force | Out-Null }
if (-not (Test-Path "C:\npm-cache")) { New-Item -ItemType Directory -Path "C:\npm-cache" -Force | Out-Null }
if (-not (Test-Path "C:\npm-prefix")) { New-Item -ItemType Directory -Path "C:\npm-prefix" -Force | Out-Null }

# Run npm with all arguments passed to this script
$npmArgs = $args -join " "
Write-Host "Running: npm $npmArgs" -ForegroundColor Cyan

# Execute npm command
Invoke-Expression "npm $npmArgs"