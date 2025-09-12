const Plant = require('../models/Plant');
const User = require('../models/User');
const plantAI = require('../services/plantAI');

const PlantController = {
  // Create a new plant for a user
  createPlant: async (req, res) => {
    try {
      const { plantName, seedType } = req.body;
      const userId = req.user.id;
      
      // Check if user already has a plant
      const existingPlant = await Plant.findOne({ owner: userId });
      if (existingPlant) {
        return res.status(400).json({ 
          success: false, 
          message: 'You already have a plant. You can only care for one plant at a time.' 
        });
      }
      
      // Create new plant
      const newPlant = new Plant({
        name: plantName,
        type: seedType,
        owner: userId,
        growthStage: 'seed',
        age: 0,
        waterLevel: 80, // Start with some water
        health: 100,
        growthProgress: 0,
        lastInteraction: new Date(),
        lastWatered: new Date()
      });
      
      await newPlant.save();
      
      // Update user record to reference plant
      await User.findByIdAndUpdate(userId, { plant: newPlant._id });
      
      res.status(201).json({
        success: true,
        plant: newPlant
      });
    } catch (error) {
      console.error('Create plant error:', error);
      res.status(500).json({ success: false, message: 'Failed to create plant' });
    }
  },
  
  // Get plant details
  getPlantDetails: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const plant = await Plant.findOne({ owner: userId });
      if (!plant) {
        return res.status(404).json({ success: false, message: 'Plant not found' });
      }
      
      // Get owner's name for context
      const user = await User.findById(userId, 'username');
      
      res.json({
        success: true,
        plant: {
          ...plant.toObject(),
          ownerName: user.username
        }
      });
    } catch (error) {
      console.error('Get plant details error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve plant details' });
    }
  },
  
  // Update plant status
  updatePlant: async (req, res) => {
    try {
      const userId = req.user.id;
      const { waterLevel, health, growthProgress } = req.body;
      
      const plant = await Plant.findOne({ owner: userId });
      if (!plant) {
        return res.status(404).json({ success: false, message: 'Plant not found' });
      }
      
      // Update plant fields if provided
      if (waterLevel !== undefined) plant.waterLevel = waterLevel;
      if (health !== undefined) plant.health = health;
      if (growthProgress !== undefined) {
        plant.growthProgress = growthProgress;
        
        // Check if plant should advance to next growth stage
        if (plant.growthProgress >= 100) {
          // Reset growth progress
          plant.growthProgress = 0;
          
          // Advance growth stage
          const growthStages = ['seed', 'sprout', 'sapling', 'young', 'mature'];
          const currentIndex = growthStages.indexOf(plant.growthStage);
          
          if (currentIndex < growthStages.length - 1) {
            plant.growthStage = growthStages[currentIndex + 1];
          }
        }
      }
      
      // Update last interaction time
      plant.lastInteraction = new Date();
      
      await plant.save();
      
      res.json({
        success: true,
        plant: plant
      });
    } catch (error) {
      console.error('Update plant error:', error);
      res.status(500).json({ success: false, message: 'Failed to update plant' });
    }
  },
  
  // Chat with plant using GPT-4o-mini
  chatWithPlant: async (req, res) => {
    try {
      const userId = req.user.id;
      const { message } = req.body;
      
      const plant = await Plant.findOne({ owner: userId });
      if (!plant) {
        return res.status(404).json({ success: false, message: 'Plant not found' });
      }
      
      // Get user info for context
      const user = await User.findById(userId, 'username');
      
      // Get chat history for context
      const recentChats = await ChatHistory.find({ plant: plant._id })
        .sort({ timestamp: -1 })
        .limit(10);
      
      // Generate response from AI
      const aiResponse = await plantAI.generateResponse(message, {
        plantName: plant.name,
        plantType: plant.type,
        plantAge: plant.age,
        growthStage: plant.growthStage,
        plantMood: req.body.plantMood || 'neutral',
        ownerName: user.username,
        recentInteractions: recentChats
      });
      
      // Save chat to history
      await new ChatHistory({
        plant: plant._id,
        user: userId,
        userMessage: message,
        plantResponse: aiResponse.reply,
        timestamp: new Date()
      }).save();
      
      // Update last interaction time
      plant.lastInteraction = new Date();
      await plant.save();
      
      res.json({
        success: true,
        reply: aiResponse.reply,
        mood: aiResponse.mood
      });
    } catch (error) {
      console.error('Chat with plant error:', error);
      res.status(500).json({ success: false, message: 'Failed to generate response' });
    }
  },
  
  // Apply items to plant (fertilizers, pesticides, etc.)
  applyItem: async (req, res) => {
    try {
      const userId = req.user.id;
      const { itemId } = req.body;
      
      const plant = await Plant.findOne({ owner: userId });
      if (!plant) {
        return res.status(404).json({ success: false, message: 'Plant not found' });
      }
      
      // Check if user owns the item
      const userInventory = await Inventory.findOne({ user: userId });
      if (!userInventory || !userInventory.items.some(item => item.itemId.toString() === itemId)) {
        return res.status(400).json({ success: false, message: 'Item not found in your inventory' });
      }
      
      // Get item details
      const item = await ShopItem.findById(itemId);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      
      // Apply effects based on item type
      if (item.category === 'fertilizer') {
        plant.growthProgress = Math.min(100, plant.growthProgress + item.effect.growthBoost);
      } else if (item.category === 'pesticide') {
        plant.health = Math.min(100, plant.health + item.effect.healthBoost);
      } else if (item.category === 'water') {
        plant.waterLevel = Math.min(100, plant.waterLevel + item.effect.waterBoost);
        plant.lastWatered = new Date();
      }
      
      // Remove item from inventory
      userInventory.items = userInventory.items.filter(item => item.itemId.toString() !== itemId);
      await userInventory.save();
      
      // Save plant changes
      await plant.save();
      
      res.json({
        success: true,
        message: `Successfully applied ${item.name} to your plant`,
        plant: plant
      });
    } catch (error) {
      console.error('Apply item error:', error);
      res.status(500).json({ success: false, message: 'Failed to apply item to plant' });
    }
  },
  
  // Update plant customization (decorations, background)
  customizePlant: async (req, res) => {
    try {
      const userId = req.user.id;
      const { decorations, background } = req.body;
      
      const plant = await Plant.findOne({ owner: userId });
      if (!plant) {
        return res.status(404).json({ success: false, message: 'Plant not found' });
      }
      
      // Initialize customization object if it doesn't exist
      if (!plant.customization) plant.customization = {};
      
      // Update decorations if provided
      if (decorations) {
        plant.customization.decorations = decorations;
      }
      
      // Update background if provided
      if (background) {
        plant.customization.background = background;
      }
      
      await plant.save();
      
      res.json({
        success: true,
        message: 'Plant customization updated',
        plant: plant
      });
    } catch (error) {
      console.error('Customize plant error:', error);
      res.status(500).json({ success: false, message: 'Failed to update plant customization' });
    }
  }
};

module.exports = PlantController;