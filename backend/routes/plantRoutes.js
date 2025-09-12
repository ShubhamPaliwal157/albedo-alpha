const express = require('express');
const router = express.Router();
const PlantController = require('../controllers/PlantController');
const authMiddleware = require('../middleware/authMiddleware');
const { getPlantAIResponse } = require("../services/plantAI");

// temporary test
router.get("/", (req, res) => {
  res.json([{ _id: "1", name: "Aloe Vera" }, { _id: "2", name: "Tulsi" }]);
});

router.post("/plantAI", async (req, res) => {
  const { question } = req.body;
  const answer = await getPlantAIResponse(question); // custom function
  res.json({ answer });
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