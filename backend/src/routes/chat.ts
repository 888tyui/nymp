import { Router } from 'express';
import { pool } from '../db/init';
import OpenAI from 'openai';

const router = Router();

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
    const { message } = req.body;
    
    if (!['builder', 'question'].includes(agentType)) {
      return res.status(400).json({ error: 'Invalid agent type' });
    }
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
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
    
    res.json({ message: assistantMessage });
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

