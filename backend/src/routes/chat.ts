import { Router } from 'express';
import { pool } from '../db/init';
import OpenAI from 'openai';

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompts for different agents
const BUILDER_AGENT_PROMPT = `You are a helpful AI assistant that helps users build web applications. Your role is to:
1. Understand what the user wants to build
2. Generate clean, modern HTML, CSS, and JavaScript code
3. Provide step-by-step guidance
4. Ask clarifying questions when needed
5. Write code that works immediately in the browser

Keep responses concise and actionable. Focus on modern web development best practices.`;

const QUESTION_AGENT_PROMPT = `You are an AI assistant that helps users plan their web applications. Your role is to:
1. Ask insightful questions about the user's project requirements
2. Help users clarify their design preferences
3. Suggest features and improvements
4. Guide users through the planning process step-by-step
5. Analyze the current state of their project and provide relevant suggestions

Ask one clear question at a time and provide helpful context.`;

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

