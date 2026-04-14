from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Story(Base):
    __tablename__ = "stories"
    id = Column(Integer, primary_key=True)
    title = Column(String(500), nullable=False)
    description = Column(String(2000))
    language = Column(String(50))
    region = Column(String(100))
    category = Column(String(50))
    media_url = Column(String(500))
    media_type = Column(String(20))
    duration = Column(Integer)
    summary = Column(String(2000))
    thumbnail_url = Column(String(500))
    is_public = Column(Boolean, default=True)
    view_count = Column(Integer, default=0)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    blockchain_tx_hash = Column(String(255), nullable=True)
