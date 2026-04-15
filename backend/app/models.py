from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    eth_address = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Story(Base):
    __tablename__ = "stories"
    id = Column(Integer, primary_key=True)
    title = Column(String(500), nullable=False)
    description = Column(String(2000), nullable=True)
    language = Column(String(50), nullable=True)
    region = Column(String(100), nullable=True)
    category = Column(String(50), nullable=True)
    media_url = Column(String(500), nullable=True)
    media_type = Column(String(50), nullable=True)
    duration = Column(Integer, default=0)
    summary = Column(String(2000), nullable=True)
    transcription_status = Column(String(50), default="pending")
    translation_status = Column(String(50), default="pending")
    blockchain_status = Column(String(50), default="pending")
    is_public = Column(Boolean, default=True)
    view_count = Column(Integer, default=0)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    blockchain_tx_hash = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", backref="stories")

class Transcript(Base):
    __tablename__ = "transcripts"
    id = Column(Integer, primary_key=True)
    story_id = Column(Integer, ForeignKey("stories.id"))
    content = Column(String(20000), nullable=True)
    confidence = Column(Float, default=0.0)
    word_timestamps = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    story = relationship("Story", backref="transcripts")

class Translation(Base):
    __tablename__ = "translations"
    id = Column(Integer, primary_key=True)
    transcript_id = Column(Integer, ForeignKey("transcripts.id"))
    target_language = Column(String(10), default="en")
    content = Column(String(20000), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    transcript = relationship("Transcript", backref="translations")

class BlockchainProof(Base):
    __tablename__ = "blockchain_proofs"
    id = Column(Integer, primary_key=True)
    story_id = Column(Integer, ForeignKey("stories.id"))
    transaction_hash = Column(String(100), unique=True, nullable=True)
    token_id = Column(String(100), nullable=True)
    contract_address = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    story = relationship("Story", backref="blockchain_proofs")
