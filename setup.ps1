# nym Setup Script for Windows
# This script helps you set up nym for local development

Write-Host "🚀 Setting up nym - Monad Web3 App Builder" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
    
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 18) {
        Write-Host "❌ Node.js version 18 or higher is required. Current version: $nodeVersion" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18 or higher." -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is installed
try {
    psql --version | Out-Null
    Write-Host "✅ PostgreSQL detected" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostgreSQL not found. Please ensure PostgreSQL is installed and running." -ForegroundColor Yellow
    Write-Host "   You can also use a cloud PostgreSQL service." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "⚙️  Setting up environment variables..." -ForegroundColor Cyan

# Backend .env
if (-not (Test-Path "backend\.env")) {
    Write-Host ""
    Write-Host "Creating backend\.env file..." -ForegroundColor Cyan
    $dbUrl = Read-Host "Enter your PostgreSQL DATABASE_URL (e.g., postgresql://user:pass@localhost:5432/nym)"
    $openaiKey = Read-Host "Enter your OpenAI API Key"
    
    @"
DATABASE_URL=$dbUrl
OPENAI_API_KEY=$openaiKey
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
"@ | Out-File -FilePath "backend\.env" -Encoding UTF8
    
    Write-Host "✅ Backend .env created" -ForegroundColor Green
} else {
    Write-Host "✅ backend\.env already exists" -ForegroundColor Green
}

# Frontend .env.local
if (-not (Test-Path "frontend\.env.local")) {
    Write-Host ""
    Write-Host "Creating frontend\.env.local file..." -ForegroundColor Cyan
    
    @"
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MONAD_RPC_URL=https://monad-mainnet-rpc-url
"@ | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    
    Write-Host "✅ Frontend .env.local created" -ForegroundColor Green
} else {
    Write-Host "✅ frontend\.env.local already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start development servers, run:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see QUICKSTART.md" -ForegroundColor Cyan
Write-Host ""


