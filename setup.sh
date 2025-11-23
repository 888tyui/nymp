#!/bin/bash

# nym Setup Script
# This script helps you set up nym for local development

set -e

echo "🚀 Setting up nym - Monad Web3 App Builder"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please ensure PostgreSQL is installed and running."
    echo "   You can also use a cloud PostgreSQL service."
else
    echo "✅ PostgreSQL detected"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "⚙️  Setting up environment variables..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "Creating backend/.env file..."
    read -p "Enter your PostgreSQL DATABASE_URL (e.g., postgresql://user:pass@localhost:5432/nym): " DB_URL
    read -p "Enter your OpenAI API Key: " OPENAI_KEY
    
    cat > backend/.env << EOF
DATABASE_URL=$DB_URL
OPENAI_API_KEY=$OPENAI_KEY
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Backend .env created"
else
    echo "✅ backend/.env already exists"
fi

# Frontend .env.local
if [ ! -f "frontend/.env.local" ]; then
    echo ""
    echo "Creating frontend/.env.local file..."
    
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MONAD_RPC_URL=https://monad-mainnet-rpc-url
EOF
    echo "✅ Frontend .env.local created"
else
    echo "✅ frontend/.env.local already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development servers, run:"
echo "  npm run dev"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo ""
echo "For more information, see QUICKSTART.md"
echo ""

