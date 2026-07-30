import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { botIpLimiter } from '../middleware/rateLimiters.js';
import logger from '../config/logger.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/bot', botIpLimiter, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
    const result = await model.generateContent(
      `You are a helpful assistant for RIVETO, a fashion e-commerce store. 
       Answer briefly and helpfully. User asked: ${message}`
    );
    const text = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    logger.error('Bot request failed', { requestId: req.id, error: error.message });
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;