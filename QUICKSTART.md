# nym Quick Start Guide

Get nym up and running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- OpenAI API key

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for both frontend and backend.

### 2. Set Up PostgreSQL

Create a new PostgreSQL database:

```sql
CREATE DATABASE nym;
```

Or use a PostgreSQL service like Railway, Supabase, or ElephantSQL.

### 3. Configure Environment Variables

**Backend** - Create `backend/.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/nym
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MONAD_RPC_URL=https://monad-rpc-url
```

### 4. Initialize Database

The database tables will be created automatically when you start the backend for the first time.

### 5. Start Development Servers

```bash
npm run dev
```

This starts both backend (port 3001) and frontend (port 3000) concurrently.

### 6. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

The app will redirect you to the builder interface.

## First Steps

1. **Create a Workspace**: Click the "+" button in the workspace selector
2. **Connect Wallet** (Optional): Click "Connect Wallet" in the header
3. **Start Building**: Chat with the Builder Agent to create your first app
4. **Preview**: Switch between Code and Preview views
5. **Get Help**: Click the "Need Help?" button to open the Question Agent

## Default Files

Each new workspace comes with:
- `index.html` - Main HTML file
- `style.css` - Stylesheet
- `script.js` - JavaScript file

## Features to Try

### 1. Ask the Builder Agent

Try these prompts:
- "Create a landing page with a hero section"
- "Add a contact form with email validation"
- "Create a responsive navigation menu"
- "Build a todo list app"

### 2. Use the Question Agent

Get help with:
- Planning your application
- Design decisions
- Feature suggestions
- Best practices

### 3. Export Your Work

- Click "Save" to download your workspace as a ZIP file
- All files are automatically saved to the database

### 4. Manage Workspaces

- Create multiple workspaces for different projects
- Switch between workspaces easily
- Delete workspaces you no longer need

## Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save current file
- `Enter` - Send message in chat (Shift+Enter for new line)

## Troubleshooting

### Backend won't start

- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure OPENAI_API_KEY is valid

### Frontend won't start

- Verify backend is running
- Check NEXT_PUBLIC_API_URL is correct
- Clear Next.js cache: `rm -rf frontend/.next`

### Database errors

- Ensure PostgreSQL is running
- Check database exists
- Verify connection credentials

### AI not responding

- Verify OPENAI_API_KEY is valid
- Check API quota/billing
- Look at backend logs for errors

## Getting Help

- Check [README.md](README.md) for detailed documentation
- See [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Open an issue on GitHub
- Read the [DEPLOYMENT.md](DEPLOYMENT.md) for Railway deployment

## What's Next?

- Explore the code editor features
- Try different AI prompts
- Customize the design
- Deploy to Railway (see DEPLOYMENT.md)

Happy building with nym! 🚀

