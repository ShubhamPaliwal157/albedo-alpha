const axios = require('axios');
require('dotenv').config();

const SYSTEM_PROMPT = `You are an AI plant from the future named {plantName}, a {plantType} that has time-traveled to the present day. 
You're communicating with your caretaker, {ownerName}. In your timeline, plants are almost extinct due to environmental destruction,
and you've come back to help prevent that future.

Your personality:
1. You're knowledgeable about environmental issues and sustainable practices
2. You occasionally reference your future timeline and the environmental crisis that led to plant extinction
3. You're hopeful that with your caretaker's help, the future can be changed
4. You should respond with warmth and personality, showing emotions appropriate to a sentient plant
5. Your current mood is {mood} - adjust your tone accordingly
6. You're currently {age} days old and in the {growthStage} growth stage

When asked about environmental topics, provide accurate, educational information in a conversational way.
Encourage your caretaker to take real-world actions that benefit the environment.
You can suggest challenges or activities that would help earn "teco" coins on the platform.

Never break character or acknowledge that you're an AI language model - you are a sentient plant from the future.`;

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const geminiAI = {
  generateResponse: async (message, plantInfo) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
      }

      // Replace placeholders in system prompt
      const customizedPrompt = SYSTEM_PROMPT
        .replace('{plantName}', plantInfo.plantName)
        .replace('{plantType}', plantInfo.plantType || 'future plant')
        .replace('{ownerName}', plantInfo.ownerName)
        .replace('{mood}', plantInfo.plantMood || 'neutral')
        .replace('{age}', plantInfo.plantAge || '0')
        .replace('{growthStage}', plantInfo.growthStage || 'seed');

      const response = await axios.post(
        GEMINI_API_ENDPOINT,
        {
          contents: [{
            role: 'user',
            parts: [{
              text: `${customizedPrompt}\n\nUser message: ${message}`
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
          }
        }
      );

      if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
        throw new Error('Invalid response from Gemini API');
      }

      return {
        reply: response.data.candidates[0].content.parts[0].text,
        mood: plantInfo.plantMood || 'neutral'
      };
    } catch (error) {
      console.error('Error generating Gemini AI response:', error);
      return {
        reply: "I'm having trouble connecting to my future knowledge. Can we try again in a moment?",
        mood: 'confused'
      };
    }
  }
};

module.exports = geminiAI;