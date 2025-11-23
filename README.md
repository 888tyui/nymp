# nym

Monad-based Web3 App Builder with AI Agents

## Features

- 🤖 Dual AI Agents: Builder Agent & Question Agent
- 💻 Web-based Code Editor with Live Preview
- 🎨 Real-time Visual Feedback
- 📁 Workspace Management System
- 🌐 Monad Mainnet Integration
- 💾 Export Projects as ZIP
- 🚀 Deploy to Production (Coming Soon)

## Tech Stack

### Frontend
- Next.js 14 with TypeScript
- Monaco Editor (VSCode in browser)
- TailwindCSS
- Web3 Integration

### Backend
- Node.js with Express & TypeScript
- PostgreSQL Database
- OpenAI API Integration
- Monad Web3 Provider

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Run database migrations
npm run migrate --workspace=backend

# Start development servers
npm run dev
```

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/nym
OPENAI_API_KEY=your_openai_api_key
PORT=3001
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MONAD_RPC_URL=https://monad-mainnet-rpc-url
```

## Railway Deployment

This project is configured for Railway deployment without Docker.

### Backend Deployment
- Service: Node.js
- Build Command: `npm install && npm run build --workspace=backend`
- Start Command: `npm run start --workspace=backend`
- PostgreSQL: Add from Railway marketplace

### Frontend Deployment
- Service: Next.js
- Build Command: `npm install && npm run build --workspace=frontend`
- Start Command: `npm run start --workspace=frontend`

## License

MIT

