# Uhodari - AI Cultural Preservation Tool

Preserving Kenyan oral traditions through AI transcription, translation, and blockchain-verified ownership.

## Team Setup

### Blockchain Dev
cd blockchain
npm install
cp .env.example .env  # fill in your keys
npx hardhat compile

### Backend Dev
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000

### Frontend Dev
cd frontend
npm install
npm start
