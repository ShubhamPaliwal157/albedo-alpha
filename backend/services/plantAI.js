import axios from 'axios';

// This service handles communication with the GPT-4o-mini API
// for the AI plant's personality and responses

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

const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const plantAI = {
    generateResponse: async (message, plantInfo) => {
    try {
      const customSystemPrompt = SYSTEM_PROMPT
        .replace('{plantName}', plantInfo.plantName)
        // ... other replacements

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: customSystemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      // Process response
      return {
        reply: response.choices[0].message.content,
        mood: determineMood(message, response.choices[0].message.content)
      };
    } catch (error) {
      console.error('Error generating plant AI response:', error);
      return {
        reply: "I'm having trouble connecting to my future knowledge. Can we try again in a moment?",
        mood: 'confused'
      };
    }
  },
  // ... other methods
  // Generate a response from the AI plant based on user input
  generateResponse: async (message, plantInfo) => {
    try {
      const customSystemPrompt = SYSTEM_PROMPT
        .replace('{plantName}', plantInfo.plantName)
        .replace('{plantType}', plantInfo.plantType)
        .replace('{ownerName}', plantInfo.ownerName)
        .replace('{mood}', plantInfo.plantMood)
        .replace('{age}', plantInfo.plantAge)
        .replace('{growthStage}', plantInfo.growthStage);
      
      // Call to your backend service that interfaces with GPT-4o-mini
      const response = await axios.post('/api/ai/chat', {
        systemPrompt: customSystemPrompt,
        userMessage: message,
        plantHistory: plantInfo.recentInteractions || []
      });
      
      // Analyze sentiment to determine plant mood
      let newMood = plantInfo.plantMood;
      
      if (response.data.sentiment) {
        const sentiment = response.data.sentiment;
        
        if (sentiment > 0.5) newMood = 'happy';
        else if (sentiment < -0.3) newMood = 'sad';
        else newMood = 'neutral';
      }
      
      return {
        reply: response.data.reply,
        mood: newMood
      };
    } catch (error) {
      console.error('Error generating plant AI response:', error);
      return {
        reply: "I'm having trouble connecting to my future knowledge. Can we try again in a moment?",
        mood: 'confused'
      };
    }
  },
  
  // Generate the daily environmental fact
  generateDailyFact: async () => {
    try {
      const response = await axios.post('/api/ai/dailyFact');
      return {
        fact: response.data.fact,
        source: response.data.source
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

export default plantAI;