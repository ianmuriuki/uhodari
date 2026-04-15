# # backend/app/main.py - Complete working code
# from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, BackgroundTasks
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from sqlalchemy.orm import Session
# from typing import List, Optional
# import os
# import uuid
# import json

# from app.database import engine, get_db, Base
# from app.models.user import User
# from app.models.story import Story
# from app.models.transcript import Transcript
# from app.models.translation import Translation
# from app.models.blockchain_proof import BlockchainProof
# from app.schemas import *
# from app.services.ai_service import AIService
# from app.services.blockchain_service import BlockchainService
# from app.services.storage_service import StorageService

# # Create tables
# Base.metadata.create_all(bind=engine)

# # Initialize FastAPI
# app = FastAPI(title="Uhodari API", version="1.0.0")

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Services
# ai_service = AIService()
# blockchain_service = BlockchainService()
# storage_service = StorageService()

# # ============ AUTH ENDPOINTS ============
# @app.post("/api/v1/auth/register", response_model=UserResponse)
# async def register(user: UserCreate, db: Session = Depends(get_db)):
#     """Register new user"""
#     # ****** (Implementation: check existing, hash password, create user)
#     pass

# @app.post("/api/v1/auth/login")
# async def login(credentials: UserLogin, db: Session = Depends(get_db)):
#     """Login and return JWT token"""
#     # ****** (Implementation: verify credentials, generate JWT)
#     pass

# # ============ STORY ENDPOINTS ============
# @app.post("/api/v1/stories/upload")
# async def upload_story(
#     title: str,
#     description: str,
#     language: str,
#     region: str,
#     category: str,
#     is_public: bool = True,
#     file: UploadFile = File(...),
#     background_tasks: BackgroundTasks = None,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Upload audio/video story"""
#     try:
#         # Save file
#         file_ext = file.filename.split('.')[-1]
#         file_name = f"{uuid.uuid4()}.{file_ext}"
#         file_path = f"uploads/{file_name}"
        
#         content = await file.read()
#         await storage_service.save_file(file_path, content)
        
#         # Create story record
#         story = Story(
#             title=title,
#             description=description,
#             language=language,
#             region=region,
#             category=category,
#             media_url=file_path,
#             media_type=file.content_type,
#             is_public=is_public,
#             user_id=current_user.id
#         )
#         db.add(story)
#         db.commit()
#         db.refresh(story)
        
#         # Trigger AI processing in background
#         background_tasks.add_task(process_story_ai, story.id, file_path)
        
#         return {"status": "success", "story_id": story.id, "message": "Upload successful. AI processing started."}
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# async def process_story_ai(story_id: int, file_path: str):
#     """Background task for AI processing"""
#     db = SessionLocal()
#     try:
#         # Transcribe
#         transcript_result = await ai_service.transcribe_audio(file_path)
#         transcript = Transcript(
#             story_id=story_id,
#             content=transcript_result["text"],
#             confidence=transcript_result.get("confidence", 0.95)
#         )
#         db.add(transcript)
#         db.commit()
#         db.refresh(transcript)
        
#         # Translate to English
#         translation = await ai_service.translate_text(transcript.content)
#         translation_record = Translation(
#             transcript_id=transcript.id,
#             target_language="en",
#             content=translation
#         )
#         db.add(translation_record)
        
#         # Generate summary
#         summary = await ai_service.summarize_story(translation)
#         story = db.query(Story).filter(Story.id == story_id).first()
#         story.summary = summary
        
#         # Add to vector DB for chatbot
#         await ai_service.add_to_vector_db(
#             story_id=str(story_id),
#             content=translation,
#             metadata={
#                 "title": story.title,
#                 "language": story.language,
#                 "region": story.region,
#                 "category": story.category
#             }
#         )
        
#         db.commit()
        
#         # Mint blockchain proof
#         await blockchain_service.mint_proof(story_id, story.title, story.language, story.region)
        
#     except Exception as e:
#         print(f"AI Processing Error: {e}")
#     finally:
#         db.close()

# # ============ AI ENDPOINTS ============
# @app.post("/api/v1/ai/transcribe/{story_id}")
# async def transcribe_story(story_id: int, db: Session = Depends(get_db)):
#     """Transcribe story audio"""
#     story = db.query(Story).filter(Story.id == story_id).first()
#     if not story:
#         raise HTTPException(status_code=404, detail="Story not found")
    
#     result = await ai_service.transcribe_audio(story.media_url)
    
#     # Save transcript
#     transcript = Transcript(
#         story_id=story_id,
#         content=result["text"],
#         word_timestamps=result.get("segments", [])
#     )
#     db.add(transcript)
#     db.commit()
    
#     return result

# @app.post("/api/v1/ai/translate/{transcript_id}")
# async def translate_transcript(transcript_id: int, target_lang: str = "en", db: Session = Depends(get_db)):
#     """Translate transcript"""
#     transcript = db.query(Transcript).filter(Transcript.id == transcript_id).first()
#     if not transcript:
#         raise HTTPException(status_code=404, detail="Transcript not found")
    
#     translated_text = await ai_service.translate_text(transcript.content)
    
#     translation = Translation(
#         transcript_id=transcript_id,
#         target_language=target_lang,
#         content=translated_text
#     )
#     db.add(translation)
#     db.commit()
    
#     return {"original": transcript.content, "translated": translated_text}

# @app.post("/api/v1/ai/summarize/{story_id}")
# async def summarize_story_endpoint(story_id: int, db: Session = Depends(get_db)):
#     """Generate story summary"""
#     transcript = db.query(Transcript).filter(Transcript.story_id == story_id).first()
#     if not transcript:
#         raise HTTPException(status_code=404, detail="Transcript not found")
    
#     summary = await ai_service.summarize_story(transcript.content)
    
#     story = db.query(Story).filter(Story.id == story_id).first()
#     story.summary = summary
#     db.commit()
    
#     return {"summary": summary}

# # ============ BLOCKCHAIN ENDPOINTS ============
# @app.post("/api/v1/blockchain/mint/{story_id}")
# async def mint_story_proof(story_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     """Mint blockchain proof for story"""
#     story = db.query(Story).filter(Story.id == story_id).first()
#     if not story:
#         raise HTTPException(status_code=404, detail="Story not found")
    
#     # Mint on Base chain
#     result = await blockchain_service.mint_proof(
#         story_id=str(story_id),
#         title=story.title,
#         language=story.language,
#         region=story.region,
#         contributor_address=current_user.eth_address
#     )
    
#     # Save proof record
#     proof = BlockchainProof(
#         story_id=story_id,
#         chain_id=8453,  # Base Mainnet
#         contract_address=result["contract_address"],
#         token_id=result["token_id"],
#         transaction_hash=result["tx_hash"],
#         metadata_uri=result["metadata_uri"]
#     )
#     db.add(proof)
#     story.blockchain_tx_hash = result["tx_hash"]
#     db.commit()
    
#     return result

# @app.get("/api/v1/blockchain/verify/{story_id}")
# async def verify_story_proof(story_id: int, db: Session = Depends(get_db)):
#     """Verify blockchain proof"""
#     proof = db.query(BlockchainProof).filter(BlockchainProof.story_id == story_id).first()
#     if not proof:
#         raise HTTPException(status_code=404, detail="No blockchain proof found")
    
#     verification = await blockchain_service.verify_proof(proof.token_id)
#     return verification

# # ============ CHAT ENDPOINTS ============
# @app.post("/api/v1/chat")
# async def chat_with_historian(request: ChatRequest, db: Session = Depends(get_db)):
#     """Chat with AI historian"""
#     # Search relevant stories
#     search_results = await ai_service.semantic_search(request.message, n_results=3)
    
#     # Build context
#     context = ""
#     for i, doc in enumerate(search_results['documents'][0]):
#         context += f"\nStory {i+1}: {doc}\n"
    
#     # Generate response using LLM
#     prompt = f"""You are Uhodari, a Kenyan digital historian preserving cultural heritage. 
#     Answer based on these traditional stories:
#     {context}
    
#     Question: {request.message}
    
#     Respond warmly, mention the source if relevant, and add cultural context."""
    
#     # ****** (Implementation: call LLM like Llama/Mistral via Groq/Replicate)
#     response = "This is where LLM response would be generated based on the context..."
    
#     return {"response": response, "sources": search_results['metadatas'][0]}

# # ============ ADMIN ENDPOINTS ============
# @app.get("/api/v1/admin/stats")
# async def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
#     """Get platform statistics"""
#     total_stories = db.query(Story).count()
#     total_users = db.query(User).count()
#     total_transcripts = db.query(Transcript).count()
#     total_blockchain_proofs = db.query(BlockchainProof).count()
    
#     stories_by_language = db.query(Story.language, func.count(Story.id)).group_by(Story.language).all()
    
#     return {
#         "total_stories": total_stories,
#         "total_users": total_users,
#         "total_transcripts": total_transcripts,
#         "total_blockchain_proofs": total_blockchain_proofs,
#         "stories_by_language": dict(stories_by_language)
#     }

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.config import Config
from app.database import engine, get_db, Base
from app.models import User, Story, Transcript, Translation, BlockchainProof
from app.cloud_ai_service import cloud_ai
from app.services.chat_service import (
    process_chat_message,
    clear_memory,
    get_conversation_summary
)

# Create tables
print("📦 Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Database ready")

app = FastAPI(title="Uhodari Cultural Preservation", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
os.makedirs(Config.UPLOAD_DIR, exist_ok=True)
os.makedirs("data", exist_ok=True)

# ============ HEALTH CHECK ============
@app.get("/")
async def root():
    return {
        "name": "Uhodari - Cultural Preservation Tool",
        "version": "1.0.0",
        "status": "running",
        "endpoints": ["/health", "/api/stories", "/api/stories/upload", "/api/chat"]
    }

@app.get("/health")
async def health():
    import psutil
    return {
        "status": "healthy",
        "memory_percent": psutil.virtual_memory().percent,
        "memory_available_gb": round(psutil.virtual_memory().available / (1024**3), 1),
        "groq_configured": bool(Config.GROQ_API_KEY)
    }

# ============ STORY UPLOAD ============
@app.post("/api/stories/upload")
async def upload_story(
    title: str = Form(...),
    description: str = Form(...),
    language: str = Form(...),
    region: str = Form(...),
    category: str = Form(...),
    is_public: bool = Form(True),
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db)
):
    """Upload a story for preservation"""
    
    # Save file
    file_ext = file.filename.split('.')[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(Config.UPLOAD_DIR, file_name)
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Create story record
    story = Story(
        title=title,
        description=description,
        language=language,
        region=region,
        category=category,
        media_url=file_path,
        media_type=file.content_type,
        is_public=is_public,
        transcription_status="pending"
    )
    db.add(story)
    db.commit()
    db.refresh(story)
    
    # Process in background
    background_tasks.add_task(process_story, story.id, file_path)
    
    return {
        "success": True,
        "story_id": story.id,
        "message": "Story uploaded successfully. Processing in background."
    }

async def process_story(story_id: int, file_path: str):
    """Background processing"""
    from app.database import SessionLocal
    
    db = SessionLocal()
    try:
        story = db.query(Story).filter(Story.id == story_id).first()
        story.transcription_status = "processing"
        db.commit()
        
        # Transcribe
        result = await cloud_ai.transcribe_audio(file_path)
        
        if result.get("text") and not result["text"].startswith("Error"):
            transcript = Transcript(
                story_id=story_id,
                content=result["text"],
                confidence=0.9
            )
            db.add(transcript)
            
            # Translate
            translation = await cloud_ai.translate_text(result["text"])
            if translation and translation != result["text"]:
                translation_record = Translation(
                    transcript_id=transcript.id,
                    target_language="en",
                    content=translation
                )
                db.add(translation_record)
            
            # Summarize
            summary = await cloud_ai.summarize_text(translation if translation else result["text"])
            story.summary = summary
            story.transcription_status = "completed"
        else:
            story.transcription_status = "failed"
        
        db.commit()
        print(f"✅ Story {story_id} processed")
        
    except Exception as e:
        print(f"❌ Error processing story {story_id}: {e}")
        if db:
            story = db.query(Story).filter(Story.id == story_id).first()
            if story:
                story.transcription_status = "failed"
                db.commit()
    finally:
        db.close()

# ============ STORY RETRIEVAL ============
@app.get("/api/stories")
async def get_stories(
    skip: int = 0,
    limit: int = 20,
    language: Optional[str] = None,
    region: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of stories"""
    query = db.query(Story).filter(Story.is_public == True)
    
    if language:
        query = query.filter(Story.language == language)
    if region:
        query = query.filter(Story.region == region)
    if category:
        query = query.filter(Story.category == category)
    
    total = query.count()
    stories = query.order_by(Story.created_at.desc()).offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "stories": [
            {
                "id": s.id,
                "title": s.title,
                "description": s.description,
                "language": s.language,
                "region": s.region,
                "category": s.category,
                "summary": s.summary,
                "view_count": s.view_count,
                "created_at": s.created_at.isoformat() if s.created_at else None
            }
            for s in stories
        ]
    }

@app.get("/api/stories/{story_id}")
async def get_story(story_id: int, db: Session = Depends(get_db)):
    """Get single story details"""
    print("Hello, uploading")
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    story.view_count += 1
    db.commit()
    
    transcript = db.query(Transcript).filter(Transcript.story_id == story_id).first()
    translation = None
    if transcript:
        translation = db.query(Translation).filter(Translation.transcript_id == transcript.id).first()
    
    return {
        "id": story.id,
        "title": story.title,
        "description": story.description,
        "language": story.language,
        "region": story.region,
        "category": story.category,
        "media_url": f"/api/media/{os.path.basename(story.media_url)}" if story.media_url else None,
        "summary": story.summary,
        "view_count": story.view_count,
        "transcript": transcript.content if transcript else None,
        "translation": translation.content if translation else None,
        "created_at": story.created_at.isoformat() if story.created_at else None
    }

@app.get("/api/media/{filename}")
async def get_media(filename: str):
    """Serve media files"""
    file_path = os.path.join(Config.UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Media not found")
    return FileResponse(file_path)

# ============ CHAT ============
@app.post("/api/chat")
async def chat(request: dict, db: Session = Depends(get_db)):
    """
    Chat with the Digital Historian
    
    Request body:
    {
        "message": "Your question here",
        "conversation_id": "unique-id-per-conversation",
        "page": "stories",  # Optional: current page
        "selectedText": "any selected text"  # Optional
    }
    """
    message = request.get("message", "").strip()
    conversation_id = request.get("conversation_id", "default")
    page = request.get("page", "unknown")
    selected_text = request.get("selectedText", "")
    
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    # Process chat message through service
    response = await process_chat_message(
        message=message,
        conversation_id=conversation_id,
        page=page,
        selected_text=selected_text
    )
    
    return response


@app.post("/api/chat/clear")
async def clear_chat_memory(request: dict):
    """Clear conversation history"""
    conversation_id = request.get("conversation_id", "default")
    clear_memory(conversation_id)
    return {"status": "success", "message": "Conversation cleared"}


@app.get("/api/chat/summary/{conversation_id}")
async def chat_summary(conversation_id: str):
    """Get conversation metadata and summary"""
    summary = get_conversation_summary(conversation_id)
    return summary

# ============ STATS ============
@app.get("/api/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Get statistics"""
    total = db.query(Story).count()
    completed = db.query(Story).filter(Story.transcription_status == "completed").count()
    languages = db.query(Story.language, func.count(Story.id)).group_by(Story.language).all()
    
    return {
        "total_stories": total,
        "completed_stories": completed,
        "languages": dict(languages),
        "total_languages": len(languages)
    }

# ============ CREATE TEST DATA ============
@app.post("/api/test/create_sample")
async def create_sample_data(db: Session = Depends(get_db)):
    """Create sample stories for testing"""
    
    sample_stories = [
        {
            "title": "The Talking Drum",
            "description": "A traditional story from the Swahili coast",
            "language": "Swahili",
            "region": "Mombasa",
            "category": "Folktale",
            "summary": "A magical drum that could speak and warn the village of danger.",
            "is_public": True
        },
        {
            "title": "Gikuyu and Mumbi",
            "description": "The origin story of the Kikuyu people",
            "language": "Kikuyu",
            "region": "Nyeri",
            "category": "Origin Story",
            "summary": "How the nine clans of the Kikuyu came to be.",
            "is_public": True
        },
        {
            "title": "Lake Victoria Legend",
            "description": "A Luo legend about the great lake",
            "language": "Luo",
            "region": "Kisumu",
            "category": "Origin Story",
            "summary": "The story of how Lake Victoria was formed.",
            "is_public": True
        }
    ]
    
    for story_data in sample_stories:
        story = Story(**story_data, transcription_status="completed")
        db.add(story)
    
    db.commit()
    
    return {"message": f"Created {len(sample_stories)} sample stories"}

# ============ RUN ============
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)