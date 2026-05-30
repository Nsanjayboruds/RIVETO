import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
console.log("KEY:", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/bot', async (req, res) => {

  console.log('GEMINI KEY:', process.env.GEMINI_API_KEY); // ← add this
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
    const result = await model.generateContent(
      `You are a helpful assistant for RIVETO, a fashion e-commerce store. 
       Answer briefly and helpfully. User asked: ${message}`
    );
    const text = result.response.text();
    res.json({ reply: text });}
catch (error) {
  console.log("FULL ERROR:", error);
  
  res.status(500).json({
    error: error.message,
  });
}
});

export default router;