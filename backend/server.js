require('dotenv').config();
const express = require('express');
const cors = require('cors');
const plantAI = require('./services/plantAI');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept']
}));
app.use(express.json());

// PlantAI Route
app.post('/api/plantAI', async (req, res) => {
  try {
    const { question, plantInfo } = req.body;
    const response = await plantAI.generateResponse(question, plantInfo);
    
    res.json({
      answer: response.reply,
      mood: response.mood
    });
  } catch (error) {
    console.error('Error in plantAI route:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`GEMINI_API_KEY loaded: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});