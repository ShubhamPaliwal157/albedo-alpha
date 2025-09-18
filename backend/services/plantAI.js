const geminiAI = require('./geminiAI');

const plantAI = {
  generateResponse: async (message, plantInfo) => {
    return await geminiAI.generateResponse(message, plantInfo);
  },
  
  determineMood: (message, response) => {
    // Your existing mood determination logic if any
    return 'neutral';
  },

  generateDailyFact: async () => {
    try {
      const response = await geminiAI.generateResponse(
        "Generate a fascinating environmental fact for today.", 
        { 
          plantName: "EcoGuardian",
          plantType: "Knowledge Keeper",
          ownerName: "Friend",
          plantMood: "enthusiastic",
          growthStage: "mature"
        }
      );
      
      return {
        fact: response.reply,
        source: "Future Environmental Archives"
      };
    } catch (error) {
      console.error('Error generating daily fact:', error);
      return {
        fact: "Did you know that planting just one tree can absorb up to 48 pounds of carbon dioxide per year?",
        source: "Default fact - connection error"
      };
    }
  }
};

module.exports = plantAI;