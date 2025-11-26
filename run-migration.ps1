# Set temp directories to avoid path issues with $ in username
$env:TEMP = "C:\Temp"
$env:TMP = "C:\Temp"
$env:TMPDIR = "C:\Temp"

# Set npm cache and prefix to avoid username path issues
$env:NPM_CONFIG_CACHE = "C:\Temp\npm-cache"
$env:NPM_CONFIG_PREFIX = "C:\Temp\npm-prefix"

# Ensure temp directories exist
if (-not (Test-Path "C:\Temp")) { New-Item -ItemType Directory -Path "C:\Temp" -Force | Out-Null }
if (-not (Test-Path "C:\Temp\npm-cache")) { New-Item -ItemType Directory -Path "C:\Temp\npm-cache" -Force | Out-Null }
if (-not (Test-Path "C:\Temp\npm-prefix")) { New-Item -ItemType Directory -Path "C:\Temp\npm-prefix" -Force | Out-Null }

# Load .env.local file first (takes precedence)
if (Test-Path ".env.local") {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
        }
    }
}

# Load .env file as fallback
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            # Only set if not already set by .env.local
            if (-not [System.Environment]::GetEnvironmentVariable($name, [System.EnvironmentVariableTarget]::Process)) {
                [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
            }
        }
    }
}

# Explicitly set DATABASE_URL for SQLite (override any PostgreSQL URLs)
$env:DATABASE_URL = "file:./dev.db"

# Run Prisma migration using local node_modules to avoid npx cache issues
# Pass migration name as first argument, default to 'migration'
$migrationName = if ($args.Count -gt 0) { $args[0] } else { "migration" }

# Use local schema file for SQLite development
# Use local prisma binary directly to avoid npx and AppData path issues
& "node_modules\.bin\prisma.cmd" migrate dev --name $migrationName --schema prisma/schema.local.prisma