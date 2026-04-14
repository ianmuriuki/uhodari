from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class BlockchainProof(Base):
    __tablename__ = "blockchain_proofs"
    id = Column(Integer, primary_key=True)
    story_id = Column(Integer, ForeignKey("stories.id"))
    chain_id = Column(Integer)
    contract_address = Column(String(100))
    token_id = Column(String(100))
    transaction_hash = Column(String(100), unique=True)
    block_number = Column(Integer)
    metadata_uri = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
