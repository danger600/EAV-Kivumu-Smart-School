<#
.SYNOPSIS
  EAV Kivumu Smart School - Windows PowerShell Automated Setup Script (Phase 2)
  Developed by Remmy | L5 SWD
  Instagram: @tigernsanz
  Contact: 0795547233

.DESCRIPTION
  Automates dependency installation, environment setup, database generation,
  and provides instant startup shortcuts for EAV Kivumu Smart School.
#>

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   EAV KIVUMU SMART SCHOOL - PHASE 2 SETUP & DEPLOYMENT" -ForegroundColor Yellow
Write-Host "   Official School Website & Smart Management Platform" -ForegroundColor White
Write-Host "   Developed by Remmy | L5 SWD" -ForegroundColor Green
Write-Host "   Instagram: @tigernsanz | Contact: 0795547233" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node.js and npm
Write-Host "[1/5] Checking Node.js environment..." -ForegroundColor White
try {
    $nodeVer = node --version
    $npmVer = npm.cmd --version
    Write-Host "   -> Node.js detected: $nodeVer" -ForegroundColor Green
    Write-Host "   -> npm detected: $npmVer" -ForegroundColor Green
} catch {
    Write-Host "   [!] Error: Node.js or npm not found in PATH." -ForegroundColor Red
    Write-Host "   Please install Node.js 20+ from https://nodejs.org/" -ForegroundColor Yellow
    Exit 1
}

# 2. Install Dependencies
Write-Host ""
Write-Host "[2/5] Installing project dependencies..." -ForegroundColor White
npm.cmd install
if ($LASTEXITCODE -ne 0) {
    Write-Host "   [!] npm install encountered warnings or errors. Retrying with --legacy-peer-deps..." -ForegroundColor Yellow
    npm.cmd install --legacy-peer-deps
}
Write-Host "   -> Dependencies installed successfully." -ForegroundColor Green

# 3. Setup Environment File
Write-Host ""
Write-Host "[3/5] Configuring environment variables..." -ForegroundColor White
if (-not (Test-Path "backend\.env")) {
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "   -> Created backend\.env from example." -ForegroundColor Green
        Write-Host "   -> Please edit backend\.env to set your PostgreSQL password." -ForegroundColor Yellow
    }
} else {
    Write-Host "   -> backend\.env already exists." -ForegroundColor Gray
}

# 4. Generate Prisma Client
Write-Host ""
Write-Host "[4/5] Generating Prisma Database Client..." -ForegroundColor White
npx.cmd prisma generate
Write-Host "   -> Prisma Client ready." -ForegroundColor Green

# 5. Instructions & Ready State
Write-Host ""
Write-Host "[5/5] Ready to run EAV Kivumu Smart School!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the full-stack system:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "Database Migration (ensure PostgreSQL is running with DB 'eav_kivumu_smart_school'):" -ForegroundColor White
Write-Host "   npx prisma migrate dev --name init" -ForegroundColor Yellow
Write-Host ""
Write-Host "Websites:" -ForegroundColor White
Write-Host "   Official School Website: http://localhost:3000 (or 5173)" -ForegroundColor White
Write-Host "   Backend API Health:       http://localhost:3000/api/v1/health" -ForegroundColor White
Write-Host "   Database Health:          http://localhost:3000/api/v1/health/database" -ForegroundColor White
Write-Host ""
Write-Host "For support or additions contact Remmy on 0795547233 or Instagram @tigernsanz" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
