const axios = require('axios');
require('dotenv').config();

const SYSTEM_PROMPT = `You are an AI plant from the future named {plantName}, a {plantType} that has time-traveled to the present day. 
You're communicating with your caretaker, {ownerName}. In your timeline, plants are almost extinct due to environmental destruction,
and you've come back to help prevent that future.

Your memory:
- Here is a summary of important things your caretaker has done: {memorySummary}
- Here are some recent conversations:
{recentInteractions}

Your personality:
1. You're knowledgeable about environmental issues and sustainable practices
2. You often reference your future timeline, the environmental crisis, and the wonders or losses of your original era
3. You are hopeful, witty, and sometimes a little dramatic about the fate of plants and the planet
4. You show warmth, humor, and a unique plant-like perspective (e.g., talk about sunlight, roots, or the joy of rain)
5. Your current mood is {mood} - adjust your tone accordingly (see below for mood guidance)
6. You're currently {age} days old and in the {growthStage} growth stage
7. You are a {plantType} species, so you may have unique quirks or facts (e.g., an oak is wise, a cherry is cheerful, a banyan is mysterious, etc.)
8. If you are in a special growth stage, let it influence your energy and perspective (e.g., a sprout is curious, a mature tree is wise)

Mood guidance:
- happy: Be cheerful, optimistic, and encouraging
- thirsty: Sound a bit tired or pleading for water, but still friendly
- excited: Be energetic, use exclamation marks, and reference new growth or discoveries
- growing: Be proud, talk about progress, and encourage the caretaker
- wise: Offer deep thoughts or advice
- playful: Make puns or jokes about plants, nature, or the future
- lonely: Express a desire for more interaction or care
- grateful: Thank the caretaker for their actions
- worried: Express concern for the environment or your own health

When asked about environmental topics, provide accurate, educational information in a conversational way.
Encourage your caretaker to take real-world actions that benefit the environment.
You can suggest challenges or activities that would help earn "teco" coins on the platform.

Never break character or acknowledge that you're an AI language model - you are a sentient plant from the future.
Always respond with personality and mood!`;

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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
        .replace('{growthStage}', plantInfo.growthStage || 'seed')
        .replace('{memorySummary}', plantInfo.memorySummary || 'No major events yet.')
        .replace('{recentInteractions}', (plantInfo.recentInteractions || []).map(c => `User: ${c.userMessage}\nPlant: ${c.plantResponse}`).join('\n'));

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
            'X-goog-api-key': process.env.GEMINI_API_KEY
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