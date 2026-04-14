from sqlalchemy import Column, Integer, String, DateTime, Float, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Transcript(Base):
    __tablename__ = "transcripts"
    id = Column(Integer, primary_key=True)
    story_id = Column(Integer, ForeignKey("stories.id"))
    content = Column(String(10000), nullable=False)
    confidence = Column(Float)
    word_timestamps = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
