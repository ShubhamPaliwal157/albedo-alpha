const express = require('express');
const router = express.Router();
const plantAI = require('../services/plantAI');

router.post('/plantAI', async (req, res) => {
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

module.exports = router;