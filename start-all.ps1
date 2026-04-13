# ALTEREGO OS - one-click local launcher
# Usage: right-click start-all.ps1 -> "Run with PowerShell"
#    or: powershell -ExecutionPolicy Bypass -File .\start-all.ps1

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

function Write-Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Yellow
}

function Write-Ok($msg)    { Write-Host "    $msg" -ForegroundColor Green }
function Write-Info($msg)  { Write-Host "    $msg" -ForegroundColor Gray  }

$Host.UI.RawUI.WindowTitle = "ALTEREGO OS - HIVE Check-In"

Write-Host ""
Write-Host "  ALTEREGO OS - HIVE Check-In" -ForegroundColor White
Write-Host "  Local launcher" -ForegroundColor DarkGray
Write-Host ""

# 1) Node / npm check
Write-Step "Checking Node.js and npm"
try {
    $nodeVer = node --version
    $npmVer  = npm --version
    Write-Ok "Node $nodeVer, npm $npmVer"
} catch {
    Write-Host "    ERROR: Node.js is not installed or not on PATH." -ForegroundColor Red
    Write-Host "    Install from https://nodejs.org (LTS)." -ForegroundColor Red
    Read-Host "    Press Enter to exit"
    exit 1
}

# 2) .env.local
Write-Step "Checking environment file"
if (-not (Test-Path ".env.local")) {
    if (Test-Path ".env.local.example") {
        Copy-Item ".env.local.example" ".env.local"
        Write-Ok "Created .env.local from example"
    } else {
        Write-Host "    WARNING: .env.local.example missing" -ForegroundColor Red
    }
} else {
    Write-Ok ".env.local present"
}

# Prisma CLI reads .env (not .env.local). Mirror it so schema push works.
if (-not (Test-Path ".env")) {
    Copy-Item ".env.local" ".env"
    Write-Info "Mirrored .env.local -> .env for Prisma CLI"
}

# 3) Dependencies
Write-Step "Checking dependencies"
if (-not (Test-Path "node_modules")) {
    Write-Info "First run - installing packages (this takes ~1-2 min)..."
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    Write-Ok "Dependencies installed"
} else {
    Write-Ok "node_modules exists"
}

# 4) Prisma client + database
Write-Step "Preparing database"
if (-not (Test-Path "node_modules\.prisma\client\index.js")) {
    Write-Info "Generating Prisma client..."
    npx --yes prisma generate | Out-Null
}
if (-not (Test-Path "prisma\dev.db")) {
    Write-Info "Creating SQLite database..."
    npx --yes prisma db push --skip-generate | Out-Null
    Write-Ok "Database ready at prisma\dev.db"
} else {
    Write-Ok "Database ready"
}

# 5) Ask Me key hint (non-blocking)
$envContent = Get-Content ".env.local" -Raw
if ($envContent -notmatch 'ANTHROPIC_API_KEY="[^"]+"') {
    Write-Host ""
    Write-Host "    Note: ANTHROPIC_API_KEY is not set in .env.local." -ForegroundColor DarkYellow
    Write-Host "    The 'Ask Me' widget will show a fallback message until you add one." -ForegroundColor DarkYellow
}

# 6) Start dev server + open browser
Write-Step "Starting dev server on http://localhost:3000"
Write-Info "Press Ctrl+C in this window to stop the server."
Write-Host ""

# Open the browser after a short delay once the server is ready
Start-Job -Name "open-browser" -ScriptBlock {
    param($url)
    for ($i = 0; $i -lt 40; $i++) {
        try {
            $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 1
            if ($r.StatusCode -eq 200) { break }
        } catch { Start-Sleep -Milliseconds 500 }
    }
    Start-Process $url
} -ArgumentList "http://localhost:3000" | Out-Null

# Run in foreground so logs stream here and Ctrl+C stops it cleanly
npm run dev
