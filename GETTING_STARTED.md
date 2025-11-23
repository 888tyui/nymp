# Getting Started with nym

Welcome to **nym** - a Monad-based Web3 App Builder powered by AI! 🚀

## What is nym?

nym is an innovative platform that allows you to build web applications through natural conversation with AI agents. It features:

- 🤖 **Dual AI Agents**: Builder Agent for coding, Question Agent for planning
- 💻 **Web-based IDE**: Full VSCode-like editor with live preview
- 🎨 **Real-time Preview**: See your changes instantly
- 📁 **Workspace Management**: Organize multiple projects
- 🌐 **Web3 Integration**: Connect with Monad Mainnet
- 💾 **Export & Save**: Download projects as ZIP files

## Quick Setup (5 minutes)

### Step 1: Prerequisites

Make sure you have:
- [Node.js 18+](https://nodejs.org/) installed
- [PostgreSQL 14+](https://www.postgresql.org/) running
- [OpenAI API Key](https://platform.openai.com/api-keys)

### Step 2: Clone & Install

```bash
# Clone the repository (or use your existing directory)
cd nym

# Run setup script
# For Windows:
.\setup.ps1

# For Mac/Linux:
chmod +x setup.sh
./setup.sh
```

Or manually:

```bash
# Install dependencies
npm install

# Create environment files (see below)
```

### Step 3: Configure Environment

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
NEXT_PUBLIC_MONAD_RPC_URL=https://monad-mainnet-rpc-url
```

### Step 4: Create Database

```sql
CREATE DATABASE nym;
```

The database tables will be created automatically on first run.

### Step 5: Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Your First App

1. **Create a Workspace**
   - Click the "+" button next to "WORKSPACE"
   - Enter a name like "My First App"
   - Click "Create"

2. **Talk to the Builder Agent**
   - Type in the chat: "Create a landing page with a hero section and call-to-action button"
   - Watch as the AI generates your code!

3. **See It Live**
   - Click the "Preview" tab to see your app running
   - Switch to "Code" tab to edit manually

4. **Get Help Planning**
   - Click "Need Help?" button (bottom-right)
   - Ask the Question Agent about features or design

5. **Save Your Work**
   - Click "Save" in the header to download as ZIP
   - Everything is auto-saved to the database

## Key Features

### Builder Agent (Left Sidebar)
- Always available in the left panel
- Ask it to create, modify, or fix code
- Has full context of your project files
- Powered by GPT-4

**Try asking:**
- "Add a contact form with validation"
- "Make the navigation responsive"
- "Create a todo list with localStorage"
- "Add dark mode toggle"

### Question Agent (Bottom-Right)
- Click "Need Help?" to open
- Helps you plan and design
- Asks clarifying questions
- Provides suggestions

**Try asking:**
- "What features should I add to my app?"
- "How should I structure my landing page?"
- "What colors work well together?"
- "Help me plan a portfolio website"

### Code Editor
- Full Monaco editor (VSCode in browser)
- Syntax highlighting
- Auto-completion
- Save with `Ctrl/Cmd + S`

### File Explorer
- Create new files with "+"
- Click files to edit
- Delete with trash icon
- Supports HTML, CSS, JS, and more

### Live Preview
- Instant preview of your app
- Refresh button available
- Sandboxed for safety
- Real-time updates

### Workspace Management
- Multiple workspaces for different projects
- Switch easily between projects
- Delete old workspaces
- Link to your Web3 wallet

## Web3 Features

### Connect Wallet
1. Click "Connect Wallet" in header
2. Approve MetaMask connection
3. Your workspaces will be linked to your wallet

### Monad Integration
- Built for Monad Mainnet
- Wallet connection ready
- Future: Deploy directly to Monad

## Project Structure

```
nym/
├── frontend/          # Next.js React app
│   ├── src/
│   │   ├── app/      # Pages
│   │   ├── components/  # UI components
│   │   ├── lib/      # Utilities
│   │   └── store/    # State management
│   └── package.json
├── backend/          # Express API
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   └── db/       # Database
│   └── package.json
└── package.json      # Root config
```

## Tips & Tricks

### Better AI Responses
- Be specific in your requests
- Break complex features into smaller steps
- Reference existing files when asking for changes
- Ask for explanations if needed

### Keyboard Shortcuts
- `Ctrl/Cmd + S` - Save file
- `Enter` - Send chat message
- `Shift + Enter` - New line in chat

### File Organization
- Keep related code in separate files
- Use meaningful file names
- Create folders for larger projects (use path like `components/Button.html`)

### Working with the Preview
- Check browser console for errors
- Refresh preview if needed
- Test responsive design

## Common Issues

### "Database connection failed"
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Verify database exists

### "OpenAI API error"
- Check API key is valid
- Verify you have API credits
- Check OpenAI status page

### "Port already in use"
- Change PORT in backend/.env
- Update NEXT_PUBLIC_API_URL in frontend/.env.local

### Preview not updating
- Click refresh button
- Check for JavaScript errors
- Verify files are saved

## Next Steps

- 📖 Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
- 🚀 See [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to Railway
- 🤝 Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- 📚 Review [QUICKSTART.md](QUICKSTART.md) for quick reference

## Need Help?

- Check the documentation files
- Look at backend logs for API errors
- Check browser console for frontend errors
- Open an issue on GitHub

## What You Can Build

With nym, you can create:
- 🎨 Landing pages
- 📱 Web applications
- 🎮 Interactive games
- 📊 Dashboards
- 🛒 E-commerce sites
- 📝 Blogs
- 💼 Portfolios
- And much more!

## Design Philosophy

nym follows these principles:
- **AI-First**: Natural conversation over complex UIs
- **Real-time**: See changes immediately
- **Intuitive**: Easy for beginners, powerful for experts
- **Web3-Native**: Built for the decentralized web
- **Open Source**: Free to use and modify

## The nym Workflow

1. **Think** - Use Question Agent to plan
2. **Build** - Ask Builder Agent to code
3. **Preview** - See it live instantly
4. **Refine** - Iterate quickly
5. **Save** - Export when ready
6. **Deploy** - Ship to production (coming soon!)

---

**Ready to build something amazing?**

Start by asking the Builder Agent:
> "Create a beautiful landing page for my startup"

Happy building! 🎉

