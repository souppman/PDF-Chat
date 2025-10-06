import express from 'express';
import { chatService } from '../services/chatService';
import { ChatRequest } from '../types';

const router = express.Router();

/**
 * POST /api/chat
 * Send a message and get AI response
 */
router.post('/', async (req, res) => {
  try {
    const chatRequest: ChatRequest = req.body;

    // Validate request
    if (!chatRequest.message || !chatRequest.documentId) {
      return res.status(400).json({ 
        error: 'Missing required fields: message and documentId' 
      });
    }

    // Get chat response
    const response = await chatService.chat(chatRequest);

    res.json(response);
  } catch (error) {
    console.error('Error in chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat request';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;

