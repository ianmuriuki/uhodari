from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Translation(Base):
    __tablename__ = "translations"
    id = Column(Integer, primary_key=True)
    transcript_id = Column(Integer, ForeignKey("transcripts.id"))
    target_language = Column(String(10))
    content = Column(String(10000), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
