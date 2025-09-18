const express = require('express');
const router = express.Router();
const PlantController = require('../controllers/PlantController');
const authMiddleware = require('../middleware/authMiddleware');
const { getPlantAIResponse } = require("../services/plantAI");
const plantAI = require('../services/plantAI');

// temporary test
router.get("/", (req, res) => {
  res.json([{ _id: "1", name: "Aloe Vera" }, { _id: "2", name: "Tulsi" }]);
});

router.post("/plantAI", async (req, res) => {
  try {
    const { question, plantInfo } = req.body;
    const response = await plantAI.generateResponse(question, {
      plantName: plantInfo.name || "Future Plant",
      plantType: plantInfo.type || "Time-traveling Flora",
      ownerName: plantInfo.ownerName || "Caretaker",
      plantMood: plantInfo.mood || "neutral",
      plantAge: plantInfo.age || "0",
      growthStage: plantInfo.growthStage || "seed"
    });
    
    res.json({ answer: response.reply, mood: response.mood });
  } catch (error) {
    console.error('Error in plantAI route:', error);
    res.status(500).json({ 
      error: "Failed to generate response",
      message: error.message 
    });
  }
});

module.exports = router;

// All routes require authentication
router.use(authMiddleware);

// Create a new plant for the user
router.post('/create', PlantController.createPlant);

// Get the user's plant details
router.get('/details', PlantController.getPlantDetails);

// Update plant status (water, growth, health)
router.post('/update', PlantController.updatePlant);

// Chat with the plant (GPT-4o-mini integration)
router.post('/chat', PlantController.chatWithPlant);

// Apply items to plant (fertilizers, pesticides, etc.)
router.post('/apply-item', PlantController.applyItem);

// Update plant customization (decorations, background)
router.post('/customize', PlantController.customizePlant);

module.exports = router;