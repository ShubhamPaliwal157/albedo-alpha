import os
from google import genai
from google.genai import types

class GeminiAI:
    def __init__(self):
        self.client = genai.Client(
            api_key=os.environ.get("GEMINI_API_KEY"),
        )
        self.model = "gemini-pro"  # Using gemini-pro for chat

    async def generate_response(self, message, plant_info):
        try:
            system_prompt = f"""You are an AI plant from the future named {plant_info['plantName']}, 
            a {plant_info['plantType']} that has time-traveled to the present day. 
            You're communicating with your caretaker, {plant_info['ownerName']}."""

            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=f"{system_prompt}\n\nUser: {message}"),
                    ],
                ),
            ]

            response = self.client.models.generate_content(
                model=self.model,
                contents=contents,
            )

            return {
                'reply': response.text,
                'mood': 'neutral'  # You can implement mood detection if needed
            }
        except Exception as error:
            print('Error generating Gemini AI response:', error)
            return {
                'reply': "I'm having trouble connecting to my future knowledge. Can we try again in a moment?",
                'mood': 'confused'
            }