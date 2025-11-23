# nym Architecture

## Overview

nym is a Monad-based Web3 App Builder that allows users to create web applications through AI-powered conversations. The application features dual AI agents, a web-based code editor, live preview, and workspace management.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Builder     │  │    Code      │  │    Live      │     │
│  │  Agent Chat  │  │   Editor     │  │   Preview    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Question    │  │    File      │  │  Workspace   │     │
│  │  Agent Chat  │  │  Explorer    │  │  Manager     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ REST API
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Express + TypeScript)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Workspace   │  │    Files     │  │     Chat     │     │
│  │    Routes    │  │   Routes     │  │    Routes    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            ↓                                │
│                  ┌──────────────────┐                       │
│                  │   OpenAI API     │                       │
│                  └──────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  workspaces  │  │    files     │  │chat_messages │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Web3 Integration                          │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   MetaMask   │  │    Monad     │                        │
│  │  Connection  │  │   Mainnet    │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Web3**: ethers.js v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: PostgreSQL with pg driver
- **AI**: OpenAI GPT-4
- **File Handling**: Archiver (ZIP export)

### Infrastructure
- **Deployment**: Railway (no Docker)
- **Database**: PostgreSQL on Railway
- **Web3 Network**: Monad Mainnet

## Core Features

### 1. Dual AI Agents

#### Builder Agent
- **Location**: Left sidebar (always visible)
- **Purpose**: Main coding assistant
- **Capabilities**:
  - Understands user requirements
  - Generates HTML, CSS, JavaScript code
  - Provides step-by-step guidance
  - Has context of current project files

#### Question Agent
- **Location**: Bottom-right floating panel
- **Purpose**: Planning and design consultation
- **Capabilities**:
  - Asks clarifying questions
  - Helps with feature planning
  - Provides design suggestions
  - Step-by-step requirement gathering

### 2. Code Editor & File Management

- **Monaco Editor**: Full VSCode-like editing experience
- **File Explorer**: Tree view with create/delete operations
- **Auto-save**: Ctrl/Cmd + S to save changes
- **Language Support**: HTML, CSS, JavaScript, TypeScript, JSON, etc.

### 3. Live Preview

- **Real-time Updates**: Automatically refreshes when files change
- **Sandboxed**: Runs in isolated iframe
- **Full Web Support**: HTML, CSS, JavaScript all rendered

### 4. Workspace Management

- **Multiple Workspaces**: Organize different projects
- **Persistent Storage**: All work saved to PostgreSQL
- **Export**: Download workspace as ZIP file
- **Wallet Association**: Link workspaces to Web3 wallet

### 5. Web3 Integration

- **Wallet Connection**: MetaMask integration
- **Monad Network**: Built for Monad Mainnet
- **Wallet-based Storage**: Associate projects with wallet address

## Database Schema

### workspaces
```sql
id UUID PRIMARY KEY
name VARCHAR(255) NOT NULL
description TEXT
wallet_address VARCHAR(42)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### files
```sql
id UUID PRIMARY KEY
workspace_id UUID REFERENCES workspaces(id)
path VARCHAR(500) NOT NULL
content TEXT
language VARCHAR(50)
created_at TIMESTAMP
updated_at TIMESTAMP
UNIQUE(workspace_id, path)
```

### chat_messages
```sql
id UUID PRIMARY KEY
workspace_id UUID REFERENCES workspaces(id)
agent_type VARCHAR(20) CHECK (agent_type IN ('builder', 'question'))
role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system'))
content TEXT NOT NULL
metadata JSONB
created_at TIMESTAMP
```

## API Endpoints

### Workspace APIs
- `GET /api/workspace` - List all workspaces
- `GET /api/workspace/:id` - Get workspace details
- `POST /api/workspace` - Create new workspace
- `PUT /api/workspace/:id` - Update workspace
- `DELETE /api/workspace/:id` - Delete workspace

### Files APIs
- `GET /api/files/:workspaceId` - List all files
- `GET /api/files/:workspaceId/:fileId` - Get file content
- `POST /api/files/:workspaceId` - Create/update file
- `DELETE /api/files/:workspaceId/:fileId` - Delete file
- `GET /api/files/:workspaceId/export` - Export as ZIP

### Chat APIs
- `GET /api/chat/:workspaceId/:agentType` - Get chat history
- `POST /api/chat/:workspaceId/:agentType` - Send message
- `DELETE /api/chat/:workspaceId/:agentType` - Clear history

## Design System

### Colors
- **Primary**: #6E54FF (Purple)
- **Primary Light**: #DDD7FE (Light Purple)
- **Dark Background**: #0E091C (Very Dark Purple)
- **Black**: #000000
- **White**: #FFFFFF

### Typography
- **Sans Serif**: Inter (UI text)
- **Monospace**: Roboto Mono (Code)
- **Letter Spacing**: -0.03em (Tight)

### Layout
- **Left Panel**: 320px (Builder Agent + File Explorer)
- **Right Panel**: Flexible (Code Editor / Preview)
- **Header**: 64px fixed height

## Security Considerations

1. **API Key Security**: OpenAI API key stored securely in environment variables
2. **Database Security**: PostgreSQL with SSL in production
3. **CORS**: Configured to only allow frontend domain
4. **Input Validation**: All user inputs validated before processing
5. **Sandbox**: Live preview runs in sandboxed iframe

## Performance Optimizations

1. **Code Splitting**: Next.js automatic code splitting
2. **Lazy Loading**: Monaco Editor loaded on demand
3. **Debounced Updates**: Preview updates debounced to reduce rerenders
4. **Database Indexing**: Indexes on workspace_id for faster queries
5. **Connection Pooling**: PostgreSQL connection pool for efficiency

## Future Enhancements

1. **Deployment Integration**: Automated deployment to hosting platforms
2. **Collaborative Editing**: Real-time collaboration features
3. **Templates**: Pre-built templates for common use cases
4. **Version Control**: Git-like version history
5. **AI Code Review**: Automated code quality suggestions
6. **Smart Contract Integration**: Deploy and interact with Monad smart contracts
7. **Component Library**: Reusable component marketplace
8. **Advanced Analytics**: Usage tracking and insights

