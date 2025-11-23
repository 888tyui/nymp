import { Router } from 'express';
import { pool } from '../db/init';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all workspaces
router.get('/', async (req, res) => {
  try {
    const { wallet_address } = req.query;
    
    let query = 'SELECT * FROM workspaces ORDER BY updated_at DESC';
    let params: any[] = [];
    
    if (wallet_address) {
      query = 'SELECT * FROM workspaces WHERE wallet_address = $1 ORDER BY updated_at DESC';
      params = [wallet_address];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
});

// Get single workspace
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM workspaces WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
});

// Create workspace
router.post('/', async (req, res) => {
  try {
    const { name, description, wallet_address } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Workspace name is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO workspaces (name, description, wallet_address) VALUES ($1, $2, $3) RETURNING *',
      [name, description || '', wallet_address || null]
    );
    
    // Create default files
    const workspaceId = result.rows[0].id;
    const defaultFiles = [
      { path: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>', language: 'html' },
      { path: 'style.css', content: 'body {\n  font-family: Inter, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n', language: 'css' },
      { path: 'script.js', content: 'console.log("Hello from nym!");\n', language: 'javascript' }
    ];
    
    for (const file of defaultFiles) {
      await pool.query(
        'INSERT INTO files (workspace_id, path, content, language) VALUES ($1, $2, $3, $4)',
        [workspaceId, file.path, file.content, file.language]
      );
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
});

// Update workspace
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const result = await pool.query(
      'UPDATE workspaces SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating workspace:', error);
    res.status(500).json({ error: 'Failed to update workspace' });
  }
});

// Delete workspace
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM workspaces WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    
    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    res.status(500).json({ error: 'Failed to delete workspace' });
  }
});

export default router;

