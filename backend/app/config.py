# import os
# from dotenv import load_dotenv

# load_dotenv()

# class Config:
#     # App
#     SECRET_KEY = os.getenv("SECRET_KEY", "dev-key-change-in-prod")
#     DATABASE_URL = "sqlite:///./data/uhodari.db"
    
#     # === FREE API KEYS (Get for free) ===
#     # Groq - Sign up at https://console.groq.com (free, gives API key)
#     GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    
#     # AssemblyAI - https://www.assemblyai.com/ (free 5 hours/month)
#     ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY", "")
    
#     # HuggingFace - https://huggingface.co/settings/tokens (free)
#     HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
    
#     # === API Endpoints (Free) ===
#     # Transcription (multiple fallbacks)
#     GROQ_WHISPER_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
#     ASSEMBLYAI_URL = "https://api.assemblyai.com/v2/transcript"
    
#     # Translation (completely free, no key)
#     LIBRETRANSLATE_URL = "https://libretranslate.com/translate"
#     MYMEMORY_URL = "https://api.mymemory.translated.net/get"
    
#     # Summarization (free via Groq)
#     GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"
    
#     # Embeddings (free via HuggingFace)
#     HF_EMBEDDING_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    
#     # Storage
#     UPLOAD_DIR = "uploads"
#     MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB (API limits)

import os
from dotenv import load_dotenv

# Load .env from parent directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(env_path)

class Config:
    # App
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-key-change-in-prod")
    DATABASE_URL = "sqlite:///./data/uhodari.db"
    
    # === FREE API KEYS ===
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY", "")
    HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
    
    # === API Endpoints ===
    GROQ_WHISPER_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
    GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"
    LIBRETRANSLATE_URL = "https://libretranslate.com/translate"
    MYMEMORY_URL = "https://api.mymemory.translated.net/get"
    
    # Storage
    UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
    MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB