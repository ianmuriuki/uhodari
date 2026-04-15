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

load_dotenv()

from app.config import Config
from app.database import engine, get_db, Base, SessionLocal
from app.models import User, Story, Transcript, Translation, BlockchainProof
from app.cloud_ai_service import cloud_ai
from app.services.chat_service import (
    process_chat_message,
    clear_memory,
    get_conversation_summary
)
from app.services.blockchain_service import BlockchainService

# Initialize blockchain service
try:
    blockchain_service = BlockchainService()
    print("✅ Blockchain service initialized")
except Exception as e:
    blockchain_service = None
    print(f"⚠️  Blockchain service unavailable: {e}")

# Create tables
print("📦 Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Database ready")

app = FastAPI(title="Uhodari Cultural Preservation", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(Config.UPLOAD_DIR, exist_ok=True)
os.makedirs("data", exist_ok=True)

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
        "groq_configured": bool(Config.GROQ_API_KEY),
        "blockchain_connected": blockchain_service is not None
    }

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
    file_ext = file.filename.split('.')[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(Config.UPLOAD_DIR, file_name)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

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

    background_tasks.add_task(process_story, story.id, file_path)

    return {
        "success": True,
        "story_id": story.id,
        "message": "Story uploaded successfully. Processing in background."
    }

async def process_story(story_id: int, file_path: str):
    db = SessionLocal()
    try:
        story = db.query(Story).filter(Story.id == story_id).first()
        story.transcription_status = "processing"
        db.commit()

        result = await cloud_ai.transcribe_audio(file_path)

        if result.get("text") and not result["text"].startswith("Error"):
            transcript = Transcript(
                story_id=story_id,
                content=result["text"],
                confidence=0.9
            )
            db.add(transcript)
            db.commit()
            db.refresh(transcript)

            translation = await cloud_ai.translate_text(result["text"])
            if translation and translation != result["text"]:
                translation_record = Translation(
                    transcript_id=transcript.id,
                    target_language="en",
                    content=translation
                )
                db.add(translation_record)

            summary = await cloud_ai.summarize_text(translation if translation else result["text"])
            story.summary = summary
            story.transcription_status = "completed"
            db.commit()

            # Mint blockchain proof
            if blockchain_service:
                try:
                    ipfs_hash = f"local-{story_id}-{uuid.uuid4().hex[:16]}"
                    proof_result = blockchain_service.mint_proof(
                        story_id=str(story_id),
                        title=story.title,
                        language=story.language,
                        region=story.region,
                        ipfs_hash=ipfs_hash
                    )
                    proof = BlockchainProof(
                        story_id=story_id,
                        contract_address=proof_result["contract_address"],
                        token_id=proof_result["token_id"],
                        transaction_hash=proof_result["tx_hash"]
                    )
                    db.add(proof)
                    story.blockchain_tx_hash = proof_result["tx_hash"]
                    db.commit()
                    print(f"✅ Blockchain proof minted for story {story_id}: {proof_result['tx_hash']}")
                except Exception as e:
                    print(f"⚠️  Blockchain minting failed for story {story_id}: {e}")
        else:
            story.transcription_status = "failed"
            db.commit()

        print(f"✅ Story {story_id} processed")

    except Exception as e:
        print(f"❌ Error processing story {story_id}: {e}")
        story = db.query(Story).filter(Story.id == story_id).first()
        if story:
            story.transcription_status = "failed"
            db.commit()
    finally:
        db.close()

@app.get("/api/stories")
async def get_stories(
    skip: int = 0,
    limit: int = 20,
    language: Optional[str] = None,
    region: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
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
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    story.view_count += 1
    db.commit()

    transcript = db.query(Transcript).filter(Transcript.story_id == story_id).first()
    translation = None
    if transcript:
        translation = db.query(Translation).filter(Translation.transcript_id == transcript.id).first()

    proof = db.query(BlockchainProof).filter(BlockchainProof.story_id == story_id).first()

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
        "blockchain_proof": {
            "tx_hash": proof.transaction_hash,
            "token_id": proof.token_id,
            "contract_address": proof.contract_address,
            "explorer_url": f"https://sepolia.basescan.org/tx/{proof.transaction_hash}"
        } if proof else None,
        "created_at": story.created_at.isoformat() if story.created_at else None
    }

@app.get("/api/media/{filename}")
async def get_media(filename: str):
    file_path = os.path.join(Config.UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Media not found")
    return FileResponse(file_path)

@app.post("/api/chat")
async def chat(request: dict, db: Session = Depends(get_db)):
    message = request.get("message", "").strip()
    conversation_id = request.get("conversation_id", "default")
    page = request.get("page", "unknown")
    selected_text = request.get("selectedText", "")

    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    response = await process_chat_message(
        message=message,
        conversation_id=conversation_id,
        page=page,
        selected_text=selected_text
    )

    return response

@app.post("/api/chat/clear")
async def clear_chat_memory(request: dict):
    conversation_id = request.get("conversation_id", "default")
    clear_memory(conversation_id)
    return {"status": "success", "message": "Conversation cleared"}

@app.get("/api/chat/summary/{conversation_id}")
async def chat_summary(conversation_id: str):
    summary = get_conversation_summary(conversation_id)
    return summary

@app.get("/api/stats")
async def get_stats(db: Session = Depends(get_db)):
    total = db.query(Story).count()
    completed = db.query(Story).filter(Story.transcription_status == "completed").count()
    languages = db.query(Story.language, func.count(Story.id)).group_by(Story.language).all()
    proofs = db.query(BlockchainProof).count()

    return {
        "total_stories": total,
        "completed_stories": completed,
        "blockchain_proofs": proofs,
        "languages": dict(languages),
        "total_languages": len(languages)
    }

@app.post("/api/blockchain/verify/{story_id}")
async def verify_story_blockchain(story_id: int, db: Session = Depends(get_db)):
    proof = db.query(BlockchainProof).filter(BlockchainProof.story_id == story_id).first()
    if not proof:
        raise HTTPException(status_code=404, detail="No blockchain proof found for this story")

    if blockchain_service:
        on_chain = blockchain_service.verify_proof(int(proof.token_id))
        return {
            "verified": True,
            "proof": {
                "tx_hash": proof.transaction_hash,
                "token_id": proof.token_id,
                "explorer_url": f"https://sepolia.basescan.org/tx/{proof.transaction_hash}"
            },
            "on_chain_data": on_chain
        }

    return {"verified": False, "message": "Blockchain service unavailable"}

@app.post("/api/test/create_sample")
async def create_sample_data(db: Session = Depends(get_db)):
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
