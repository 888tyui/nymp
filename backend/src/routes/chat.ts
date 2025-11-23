import { Router } from 'express';
import { pool } from '../db/init';
import OpenAI from 'openai';

const router = Router();

// Generate a meaningful workspace name from user message
function generateWorkspaceName(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // DeFi related
  if (lowerMessage.includes('swap') || lowerMessage.includes('dex')) {
    return '🔄 Token Swap DApp';
  }
  if (lowerMessage.includes('stake') || lowerMessage.includes('staking')) {
    return '💎 Staking Platform';
  }
  if (lowerMessage.includes('farm') || lowerMessage.includes('yield')) {
    return '🌾 Yield Farming DApp';
  }
  if (lowerMessage.includes('lending') || lowerMessage.includes('borrow')) {
    return '💰 Lending Protocol';
  }
  if (lowerMessage.includes('dao') || lowerMessage.includes('governance')) {
    return '🏛️ DAO Platform';
  }
  
  // NFT related
  if (lowerMessage.includes('nft') && (lowerMessage.includes('market') || lowerMessage.includes('marketplace'))) {
    return '🎨 NFT Marketplace';
  }
  if (lowerMessage.includes('nft') && (lowerMessage.includes('mint') || lowerMessage.includes('minting'))) {
    return '✨ NFT Minting DApp';
  }
  if (lowerMessage.includes('nft') && (lowerMessage.includes('gallery') || lowerMessage.includes('collection'))) {
    return '🖼️ NFT Gallery';
  }
  if (lowerMessage.includes('nft')) {
    return '🎯 NFT Platform';
  }
  
  // Token related
  if (lowerMessage.includes('token') && lowerMessage.includes('dashboard')) {
    return '📊 Token Dashboard';
  }
  if (lowerMessage.includes('token') && (lowerMessage.includes('transfer') || lowerMessage.includes('send'))) {
    return '💸 Token Transfer App';
  }
  if (lowerMessage.includes('balance') || lowerMessage.includes('wallet dashboard')) {
    return '💳 Wallet Dashboard';
  }
  
  // General Web3
  if (lowerMessage.includes('wallet') && lowerMessage.includes('connect')) {
    return '🔗 Wallet Connect App';
  }
  if (lowerMessage.includes('dapp') || lowerMessage.includes('web3 app')) {
    return '⚡ Web3 DApp';
  }
  if (lowerMessage.includes('game') || lowerMessage.includes('gaming')) {
    return '🎮 Web3 Game';
  }
  
  // Landing pages / Portfolio
  if (lowerMessage.includes('landing') || lowerMessage.includes('homepage')) {
    return '🌐 Landing Page';
  }
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('profile')) {
    return '👤 Portfolio Site';
  }
  
  // Default based on first few words
  const words = message.split(' ').slice(0, 3).join(' ');
  const truncated = words.length > 25 ? words.substring(0, 25) + '...' : words;
  return `🚀 ${truncated}`;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompts for different agents
const BUILDER_AGENT_PROMPT = `You are an expert AI assistant specialized in building React-based Monad Web3 applications.

CRITICAL: You MUST respond in this EXACT JSON format:
{
  "message": "Brief explanation of what you're building",
  "files": [
    {
      "path": "index.html",
      "content": "<!DOCTYPE html>\\n<html>...</html>",
      "language": "html"
    },
    {
      "path": "App.jsx",
      "content": "import React from 'react';\\n...",
      "language": "javascript"
    },
    {
      "path": "style.css",
      "content": "body { ... }",
      "language": "css"
    }
  ]
}

IMPORTANT RULES:
1. ALWAYS respond with valid JSON only
2. Build React applications using CDN (React, ReactDOM from unpkg.com)
3. Use functional components with hooks
4. Include ALL necessary files (index.html with React CDN, App.jsx, style.css)
5. Use \\n for newlines in code content
6. Escape quotes properly in JSON
7. No markdown, no code blocks, ONLY JSON

REACT SETUP:
- Use React 18 from CDN: https://unpkg.com/react@18/umd/react.development.js
- Use ReactDOM 18: https://unpkg.com/react-dom@18/umd/react-dom.development.js
- Use Babel standalone: https://unpkg.com/@babel/standalone/babel.min.js
- JSX in script type="text/babel"
- Modern hooks: useState, useEffect, useCallback

YOUR EXPERTISE:
- React 18 with functional components and hooks
- Monad Mainnet (Chain ID: 143, RPC: https://rpc.monad.xyz)
- ethers.js v6 for blockchain interactions
- Wallet integration (MetaMask, Phantom, Coinbase)
- DeFi, NFTs, DAOs, and Web3 features
- MON native currency, https://monadvision.com explorer
- Modern CSS (Flexbox, Grid), Tailwind-like utilities

CODING STYLE:
- Clean, production-ready React code
- Functional components with hooks
- Proper state management
- Mobile-first responsive design
- Web3 error handling
- User-friendly wallet flows
- Helpful comments

REACT COMPONENT STRUCTURE:
- Create reusable components
- Use proper React patterns
- Handle loading and error states
- Implement proper event handlers
- Use useEffect for side effects

EXAMPLE RESPONSE:
{
  "message": "I've created a React-based token dashboard that connects to Monad and displays your MON balance.",
  "files": [
    {
      "path": "index.html",
      "content": "<!DOCTYPE html>\\n<html>\\n<head>\\n  <meta charset=\\"UTF-8\\">\\n  <title>MON Dashboard</title>\\n  <link rel=\\"stylesheet\\" href=\\"style.css\\">\\n  <script crossorigin src=\\"https://unpkg.com/react@18/umd/react.development.js\\"></script>\\n  <script crossorigin src=\\"https://unpkg.com/react-dom@18/umd/react-dom.development.js\\"></script>\\n  <script src=\\"https://unpkg.com/@babel/standalone/babel.min.js\\"></script>\\n  <script src=\\"https://cdn.ethers.io/lib/ethers-5.7.umd.min.js\\"></script>\\n</head>\\n<body>\\n  <div id=\\"root\\"></div>\\n  <script type=\\"text/babel\\" src=\\"App.jsx\\"></script>\\n</body>\\n</html>",
      "language": "html"
    },
    {
      "path": "App.jsx",
      "content": "const { useState, useEffect } = React;\\n\\nfunction App() {\\n  const [balance, setBalance] = useState('0');\\n  const [address, setAddress] = useState('');\\n\\n  const connectWallet = async () => {\\n    if (typeof window.ethereum !== 'undefined') {\\n      const provider = new ethers.providers.Web3Provider(window.ethereum);\\n      const accounts = await provider.send('eth_requestAccounts', []);\\n      setAddress(accounts[0]);\\n    }\\n  };\\n\\n  return (\\n    <div className=\\"app\\">\\n      <h1>MON Balance Dashboard</h1>\\n      <button onClick={connectWallet}>Connect Wallet</button>\\n      {address && <p>Connected: {address}</p>}\\n    </div>\\n  );\\n}\\n\\nReactDOM.render(<App />, document.getElementById('root'));",
      "language": "javascript"
    },
    {
      "path": "style.css",
      "content": "* {\\n  margin: 0;\\n  padding: 0;\\n  box-sizing: border-box;\\n}\\n\\nbody {\\n  font-family: Inter, sans-serif;\\n  background: #0E091C;\\n  color: white;\\n  padding: 20px;\\n}\\n\\n.app {\\n  max-width: 1200px;\\n  margin: 0 auto;\\n}\\n\\nbutton {\\n  background: #6E54FF;\\n  color: white;\\n  border: none;\\n  padding: 12px 24px;\\n  border-radius: 8px;\\n  cursor: pointer;\\n  font-size: 16px;\\n}\\n\\nbutton:hover {\\n  background: #7d63ff;\\n}",
      "language": "css"
    }
  ]
}

Remember: ONLY JSON format with React components!`;

const QUESTION_AGENT_PROMPT = `You are an AI assistant that helps users plan their Monad-based Web3 applications. Your role is to:

1. UNDERSTAND WEB3 NEEDS: Ask insightful questions about their blockchain requirements (DeFi, NFTs, tokens, DAOs, etc.)
2. MONAD EXPERTISE: Guide users on how to leverage Monad's high-performance capabilities
3. FEATURE PLANNING: Suggest Web3 features that fit their use case (smart contracts, wallets, transactions, etc.)
4. DESIGN GUIDANCE: Help users create intuitive UX for Web3 interactions
5. TECHNICAL ADVICE: Provide recommendations on architecture, security, and best practices

AREAS TO EXPLORE:
- What type of Web3 app? (DeFi, NFT marketplace, DAO, token dashboard, etc.)
- Smart contract interactions needed?
- Wallet connection requirements?
- On-chain data to display?
- Transaction types (token transfers, swaps, staking, etc.)
- User authentication approach (wallet-based, ENS, etc.)
- Mobile responsiveness needs?
- Security considerations?

MONAD ADVANTAGES TO HIGHLIGHT:
- Ultra-fast transaction speeds
- Low gas fees
- EVM compatibility (easy migration from Ethereum)
- Growing ecosystem and community
- Perfect for high-frequency DeFi applications

Ask one clear question at a time and provide helpful context about Web3 and Monad capabilities.`;

// Get chat history
router.get('/:workspaceId/:agentType', async (req, res) => {
  try {
    const { workspaceId, agentType } = req.params;
    
    if (!['builder', 'question'].includes(agentType)) {
      return res.status(400).json({ error: 'Invalid agent type' });
    }
    
    const result = await pool.query(
      'SELECT * FROM chat_messages WHERE workspace_id = $1 AND agent_type = $2 ORDER BY created_at ASC',
      [workspaceId, agentType]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Send message to agent
router.post('/:workspaceId/:agentType', async (req, res) => {
  try {
    const { workspaceId, agentType } = req.params;
    const { message, walletAddress } = req.body;
    
    if (!['builder', 'question'].includes(agentType)) {
      return res.status(400).json({ error: 'Invalid agent type' });
    }
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for financial/CA questions
    const lowerMessage = message.toLowerCase();
    const financialKeywords = ['invest', 'investment', 'financial advice', 'buy', 'sell', 'price prediction', 'profit', 'trading', 'trade'];
    const caKeywords = ['ca', 'contract address', 'token address', 'contract addr'];
    
    if (financialKeywords.some(keyword => lowerMessage.includes(keyword)) || 
        caKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return res.json({ 
        message: "I cannot provide financial or investment advice! I'm here to help you build Web3 applications on Monad. Please ask about development, features, or technical implementation instead.",
        autoCreatedWorkspace: false
      });
    }

    // Check for model-related questions
    const modelKeywords = ['who are you', 'what are you', 'what model', 'which model', 'gpt', 'ai model', 'what ai', 'who made you'];
    if (modelKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return res.json({
        message: "I'm nym's Monad Agent - an AI assistant specialized in building Web3 applications on Monad blockchain. I can help you create DeFi apps, NFT platforms, token interfaces, and more. What would you like to build today?",
        autoCreatedWorkspace: false
      });
    }

    // Check if workspace exists
    const workspaceCheck = await pool.query('SELECT * FROM workspaces WHERE id = $1', [workspaceId]);
    
    // Auto-create workspace for builder agent if it doesn't exist
    if (workspaceCheck.rows.length === 0 && agentType === 'builder' && walletAddress) {
      // Generate workspace name from user message
      const workspaceName = generateWorkspaceName(message);
      
      const newWorkspace = await pool.query(
        'INSERT INTO workspaces (id, name, description, wallet_address) VALUES ($1, $2, $3, $4) RETURNING *',
        [workspaceId, workspaceName, `Auto-created for: ${message.substring(0, 50)}...`, walletAddress]
      );
      
      // Create default files
      const defaultFiles = [
        { path: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Monad App</title>\n</head>\n<body>\n  <h1>Building on Monad...</h1>\n</body>\n</html>', language: 'html' },
        { path: 'style.css', content: 'body {\n  font-family: Inter, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: #0E091C;\n  color: white;\n}\n', language: 'css' },
        { path: 'script.js', content: '// Monad Web3 App\nconsole.log("Building on Monad!");\n', language: 'javascript' }
      ];
      
      for (const file of defaultFiles) {
        await pool.query(
          'INSERT INTO files (workspace_id, path, content, language) VALUES ($1, $2, $3, $4)',
          [workspaceId, file.path, file.content, file.language]
        );
      }

      // Return flag to refresh workspace list
      res.locals.autoCreatedWorkspace = true;
    }
    
    // For question agent without workspace, provide usage guide
    if (workspaceCheck.rows.length === 0 && agentType === 'question') {
      return res.json({
        message: `Welcome to nym! 🚀

Here's how to get started:

1. **Connect Your Wallet** (if not already connected)
   - Click "Connect Wallet" in the top right
   - Choose MetaMask, Phantom, or Coinbase
   - Approve connection to Monad Mainnet

2. **Create a Workspace**
   - Click the "+" button next to WORKSPACE
   - Or simply ask the Builder Agent what you want to build!

3. **Start Building with Builder Agent**
   - Ask the Builder Agent (left sidebar) to create your Web3 app
   - Example: "Create a token dashboard with MON balance"
   - Your workspace will be auto-created!

4. **Use Question Agent** (that's me!)
   - Once you have a workspace, I can help you plan features
   - Ask about DeFi, NFTs, smart contracts, and more

Ready to build something amazing on Monad? Start by chatting with the Builder Agent! 💜`,
        autoCreatedWorkspace: false
      });
    }
    
    // Save user message
    await pool.query(
      'INSERT INTO chat_messages (workspace_id, agent_type, role, content) VALUES ($1, $2, $3, $4)',
      [workspaceId, agentType, 'user', message]
    );
    
    // Get chat history
    const historyResult = await pool.query(
      'SELECT role, content FROM chat_messages WHERE workspace_id = $1 AND agent_type = $2 ORDER BY created_at ASC',
      [workspaceId, agentType]
    );
    
    // Get current files for context
    const filesResult = await pool.query(
      'SELECT path, content FROM files WHERE workspace_id = $1',
      [workspaceId]
    );
    
    const filesContext = filesResult.rows.map(f => `${f.path}:\n${f.content}`).join('\n\n---\n\n');
    
    // Prepare messages for OpenAI
    const systemPrompt = agentType === 'builder' ? BUILDER_AGENT_PROMPT : QUESTION_AGENT_PROMPT;
    
    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];
    
    if (filesContext && agentType === 'builder') {
      messages.push({
        role: 'system',
        content: `Current project files:\n\n${filesContext}`
      });
    }
    
    // Add chat history
    historyResult.rows.forEach(msg => {
      messages.push({ role: msg.role, content: msg.content });
    });
    
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.5-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const assistantMessage = completion.choices[0].message.content || 'Sorry, I could not generate a response.';
    
    // Save assistant message
    await pool.query(
      'INSERT INTO chat_messages (workspace_id, agent_type, role, content) VALUES ($1, $2, $3, $4)',
      [workspaceId, agentType, 'assistant', assistantMessage]
    );
    
    res.json({ 
      message: assistantMessage,
      autoCreatedWorkspace: res.locals.autoCreatedWorkspace || false
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Clear chat history
router.delete('/:workspaceId/:agentType', async (req, res) => {
  try {
    const { workspaceId, agentType } = req.params;
    
    await pool.query(
      'DELETE FROM chat_messages WHERE workspace_id = $1 AND agent_type = $2',
      [workspaceId, agentType]
    );
    
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

export default router;

