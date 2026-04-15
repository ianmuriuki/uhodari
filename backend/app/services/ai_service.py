# backend/app/services/ai_service.py
import os
import whisper
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer
import chromadb

class AIService:
    def __init__(self):
        self.whisper_model = whisper.load_model("base")
        self.translator = pipeline(
            "translation",
            model="facebook/nllb-200-distilled-600M",
            tokenizer="facebook/nllb-200-distilled-600M",
            src_lang="swh_Latn",  # Swahili
            tgt_lang="eng_Latn"   # English
        )
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.chroma_client = chromadb.PersistentClient(path="./vector_db")
        self.collection = self.chroma_client.get_or_create_collection("stories")
    
    async def transcribe_audio(self, audio_path: str, language: str = "sw"):
        result = self.whisper_model.transcribe(audio_path, language=language)
        return {
            "text": result["text"],
            "segments": result["segments"],
            "language": result["language"]
        }
    
    async def translate_text(self, text: str, target_lang: str = "en"):
        result = self.translator(text)
        return result[0]["translation_text"]
    
    async def summarize_story(self, text: str, max_length: int = 200):
        summary = self.summarizer(text, max_length=max_length, min_length=50)
        return summary[0]["summary_text"]
    
    async def create_embedding(self, text: str):
        return self.embedder.encode(text).tolist()
    
    async def add_to_vector_db(self, story_id: str, content: str, metadata: dict):
        embedding = await self.create_embedding(content)
        self.collection.add(
            ids=[story_id],
            embeddings=[embedding],
            metadatas=[metadata],
            documents=[content]
        )
    
    async def semantic_search(self, query: str, n_results: int = 5):
        query_embedding = await self.create_embedding(query)
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        return results