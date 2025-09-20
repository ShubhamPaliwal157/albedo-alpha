const geminiAI = require('./geminiAI');

const plantAI = {
  generateResponse: async (message, plantInfo) => {
    return await geminiAI.generateResponse(message, plantInfo);
  },
  
  determineMood: (message, response) => {
    const msg = message.toLowerCase();
    const resp = (response?.reply || '').toLowerCase();
    if (msg.includes('water') || resp.includes('thirsty')) return 'thirsty';
    if (msg.includes('grow') || msg.includes('progress') || resp.includes('growing')) return 'growing';
    if (msg.includes('happy') || resp.includes('happy') || resp.includes('yay')) return 'happy';
    if (msg.includes('excited') || resp.includes('excited') || resp.includes('energy')) return 'excited';
    if (msg.includes('thank') || resp.includes('thank')) return 'grateful';
    if (msg.includes('alone') || msg.includes('lonely') || resp.includes('lonely')) return 'lonely';
    if (msg.includes('worried') || resp.includes('worried') || msg.includes('sick')) return 'worried';
    if (msg.includes('joke') || msg.includes('pun') || resp.includes('joke')) return 'playful';
    if (msg.includes('wise') || resp.includes('advice')) return 'wise';
    return 'happy'; // Default mood
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