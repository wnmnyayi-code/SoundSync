# Set temp directories to avoid path issues with $ in username
$env:TEMP = "C:\Temp"
$env:TMP = "C:\Temp"
$env:TMPDIR = "C:\Temp"

# Load .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"')
        [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
    }
}

# Run Prisma migration
npx prisma migrate dev --name init_user_model