"""
Cloud AI Service - No local models, all processing via free APIs
RAM usage: ~50MB only!
"""

import httpx
import aiofiles
from typing import Dict, Any, Optional
from app.config import Config

class CloudAIService:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=120.0)
        print("☁️ Cloud AI Service initialized")
    
    async def transcribe_audio(self, audio_path: str, language: str = "sw") -> Dict[str, Any]:
        """Transcribe using Groq API"""
        if not Config.GROQ_API_KEY:
            return {
                "text": "No GROQ_API_KEY found. Please add to .env file.",
                "segments": [],
                "language": language
            }
        
        try:
            async with aiofiles.open(audio_path, "rb") as f:
                audio_data = await f.read()
            
            files = {
                "file": (audio_path, audio_data, "audio/mpeg"),
                "model": (None, "whisper-large-v3"),
                "language": (None, language),
                "response_format": (None, "json")
            }
            
            headers = {"Authorization": f"Bearer {Config.GROQ_API_KEY}"}
            
            response = await self.client.post(
                Config.GROQ_WHISPER_URL,
                files=files,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "text": data.get("text", ""),
                    "segments": data.get("segments", []),
                    "language": language
                }
            else:
                return {"text": f"API Error: {response.status_code}", "segments": [], "language": language}
                
        except Exception as e:
            return {"text": f"Error: {str(e)}", "segments": [], "language": language}
    
    async def translate_text(self, text: str, target_lang: str = "en") -> str:
        """Translate using free API"""
        if not text:
            return text
        
        try:
            response = await self.client.post(
                Config.LIBRETRANSLATE_URL,
                json={"q": text[:3000], "source": "sw", "target": target_lang, "format": "text"}
            )
            
            if response.status_code == 200:
                return response.json().get("translatedText", text)
            return text
        except Exception:
            return text
    
    async def summarize_text(self, text: str) -> str:
        """Simple summarization (no API needed for basic)"""
        if not text:
            return ""
        
        # Simple extractive summary
        sentences = text.split('.')
        if len(sentences) <= 3:
            return text
        
        summary = '. '.join(sentences[:3])
        if len(summary) > 300:
            summary = summary[:297] + "..."
        return summary
    
    async def chat_response(self, query: str, context: str) -> str:
        """Simple chat response"""
        if not Config.GROQ_API_KEY:
            return f"Thank you for asking about '{query}'. This is a traditional story from our collection. Would you like to hear more about Kenyan culture and heritage?"
        
        try:
            prompt = f"""You are a Kenyan digital historian. Answer briefly (2-3 sentences):

Context: {context[:1000]}

Question: {query}

Answer:"""
            
            response = await self.client.post(
                Config.GROQ_CHAT_URL,
                headers={"Authorization": f"Bearer {Config.GROQ_API_KEY}"},
                json={
                    "model": "mixtral-8x7b-32768",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 150,
                    "temperature": 0.7
                }
            )
            
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            else:
                return f"Let me share a story about {query} from Kenyan tradition."
                
        except Exception:
            return f"I'd love to tell you about {query}. In Kenyan culture, stories are passed down through generations."

# Singleton
cloud_ai = CloudAIService()