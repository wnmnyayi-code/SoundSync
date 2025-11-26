# Development server launcher - bypasses npm to avoid $ username issues
# Usage: powershell -ExecutionPolicy Bypass -File .\dev.ps1

Write-Host "Starting Next.js development server..." -ForegroundColor Cyan

# Set temp directories
$env:TEMP = "C:\Temp"
$env:TMP = "C:\Temp"
$env:TMPDIR = "C:\Temp"

# Ensure temp directory exists
if (-not (Test-Path "C:\Temp")) { 
    New-Item -ItemType Directory -Path "C:\Temp" -Force | Out-Null 
}

# Run Next.js dev server directly using node
& node "node_modules\next\dist\bin\next" dev -p 3008