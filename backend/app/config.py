import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

    BASE_SEPOLIA_RPC_URL = os.getenv("BASE_SEPOLIA_RPC_URL", "https://sepolia.base.org")
    CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
    PRIVATE_KEY = os.getenv("PRIVATE_KEY")

    WHISPER_MODEL = "base"
    TRANSLATION_MODEL = "facebook/nllb-200-distilled-600M"
    SUMMARIZATION_MODEL = "facebook/bart-large-cnn"

    UPLOAD_DIR = "uploads"
    MAX_FILE_SIZE = 100 * 1024 * 1024
