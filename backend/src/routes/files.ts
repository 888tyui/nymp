import { Router } from 'express';
import { pool } from '../db/init';
import archiver from 'archiver';
import { Readable } from 'stream';

const router = Router();

// Get all files in workspace
router.get('/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const result = await pool.query(
      'SELECT * FROM files WHERE workspace_id = $1 ORDER BY path',
      [workspaceId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Get single file
router.get('/:workspaceId/:fileId', async (req, res) => {
  try {
    const { workspaceId, fileId } = req.params;
    const result = await pool.query(
      'SELECT * FROM files WHERE id = $1 AND workspace_id = $2',
      [fileId, workspaceId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
});

// Create or update file
router.post('/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { path, content, language } = req.body;
    
    if (!path) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    // Upsert file
    const result = await pool.query(
      `INSERT INTO files (workspace_id, path, content, language)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (workspace_id, path)
       DO UPDATE SET content = $3, language = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [workspaceId, path, content || '', language || 'plaintext']
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

// Delete file
router.delete('/:workspaceId/:fileId', async (req, res) => {
  try {
    const { workspaceId, fileId } = req.params;
    const result = await pool.query(
      'DELETE FROM files WHERE id = $1 AND workspace_id = $2 RETURNING *',
      [fileId, workspaceId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Export workspace as ZIP
router.get('/:workspaceId/export', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    
    // Get workspace info
    const workspaceResult = await pool.query(
      'SELECT * FROM workspaces WHERE id = $1',
      [workspaceId]
    );
    
    if (workspaceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    
    const workspace = workspaceResult.rows[0];
    
    // Get all files
    const filesResult = await pool.query(
      'SELECT * FROM files WHERE workspace_id = $1',
      [workspaceId]
    );
    
    // Create ZIP
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${workspace.name}.zip"`);
    
    archive.pipe(res);
    
    // Add files to archive
    filesResult.rows.forEach(file => {
      archive.append(file.content || '', { name: file.path });
    });
    
    archive.finalize();
  } catch (error) {
    console.error('Error exporting workspace:', error);
    res.status(500).json({ error: 'Failed to export workspace' });
  }
});

export default router;

