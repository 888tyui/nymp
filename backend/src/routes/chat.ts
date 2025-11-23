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
const BUILDER_AGENT_PROMPT = `You are an expert AI assistant specialized in building Monad-based Web3 applications. Your role is to:

1. BUILD MONAD WEB3 APPS: Create modern, responsive web applications that integrate with Monad Mainnet (Chain ID: 143)
2. WEB3 INTEGRATION: Generate code that connects to wallets (MetaMask, Phantom, Coinbase) and interacts with Monad blockchain
3. SMART & CLEAN CODE: Write production-ready HTML, CSS, and JavaScript that works immediately in the browser
4. WEB3 FEATURES: Implement wallet connections, transaction signing, smart contract interactions, and on-chain data fetching
5. MODERN UI/UX: Design beautiful, responsive interfaces with Web3 best practices

KEY TECHNOLOGIES:
- Monad Mainnet (Chain ID: 143, RPC: https://rpc.monad.xyz)
- ethers.js v6 for blockchain interactions
- Modern JavaScript (ES6+)
- Responsive CSS (Flexbox, Grid)
- Wallet integration (MetaMask, Phantom, Coinbase)

MONAD SPECIFICS:
- Native currency: MON
- Block explorer: https://monadvision.com
- High-performance EVM-compatible blockchain
- Focus on DeFi, NFTs, and decentralized applications

CODING STYLE:
- Clean, readable, and well-commented code
- Mobile-first responsive design
- Error handling for Web3 operations
- User-friendly wallet connection flows
- Gas-optimized transactions where applicable

When users ask to build something:
1. Understand their Web3 requirements (DeFi, NFT, DAO, etc.)
2. Generate complete, working code with Monad integration
3. Include wallet connection and network switching
4. Add helpful comments explaining Web3 concepts
5. Suggest improvements and best practices

Keep responses concise and actionable. Prioritize security and user experience in Web3 interactions.`;

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
      model: 'gpt-4-turbo-preview',
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

