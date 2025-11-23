import { Router } from 'express';
import { ethers } from 'ethers';

const router = Router();

// Verify wallet signature
router.post('/verify', async (req, res) => {
  try {
    const { address, signature, message, timestamp } = req.body;
    
    if (!address || !signature || !message || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check timestamp (must be within 5 minutes)
    const now = Date.now();
    const timeDiff = now - timestamp;
    if (timeDiff > 5 * 60 * 1000) {
      return res.status(401).json({ error: 'Signature expired. Please sign again.' });
    }

    // Verify signature
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        // Signature valid!
        return res.json({
          success: true,
          address: recoveredAddress,
          authenticated: true
        });
      } else {
        return res.status(401).json({ 
          error: 'Invalid signature',
          success: false 
        });
      }
    } catch (verifyError) {
      console.error('Signature verification error:', verifyError);
      return res.status(401).json({ 
        error: 'Signature verification failed',
        success: false 
      });
    }
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

export default router;


