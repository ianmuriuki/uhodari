# 🚀 Uhodari Chat System - Setup & Configuration Guide

## Overview

The chat system in Uhodari enables users to have meaningful conversations with a "Digital Historian" that can:
- Answer questions about cultural stories and traditions
- Provide context about specific Kenyan communities
- Retrieve relevant stories based on user queries
- Maintain conversation memory across sessions
- Detect which community a user is interested in

## Architecture

```
Frontend (React) 
    ↓↑ HTTP POST /api/chat
Backend (FastAPI)
    ├─ Chat Service
    │   ├─ Memory (Redis)
    │   ├─ Community Detection
    │   ├─ Vector DB Search
    │   └─ LLM Call
    ├─ Database (PostgreSQL/SQLite)
    └─ External Services
```

## Step 1: Install Required Dependencies

The project already has most dependencies in `requirements.txt`. Ensure you have:

```bash
pip install -r backend/requirements.txt
```

Key packages for chat:
- `langchain-groq` - LLM integration
- `redis` - Conversation memory
- `chromadb` - Vector database (for future enhancement)

If not already installed:
```bash
pip install langchain-groq redis
```

## Step 2: Get API Keys

### Required: GROQ API Key (Free & Recommended)

Groq provides free API access to powerful open-source LLMs like Llama 3.1 70B, perfect for cultural conversations.

**Steps:**
1. Go to https://console.groq.com/keys
2. Sign up with Google, GitHub, or email
3. Create a new API key
4. Copy the key to your `.env` file

**Why Groq?**
- Free tier: 30+ requests/minute
- Fast inference (best for chat)
- No credit card required initially
- Multiple open-source models (Llama, Mixtral, Gemma, etc.)

### Optional: Other LLM Providers

If you prefer alternatives, the code is structured to support:

**OpenAI (GPT-4/GPT-3.5)**
```
Cost: $0.003-0.03 per 1K tokens
1. Get key from https://platform.openai.com/api-keys
2. Set OPENAI_API_KEY in .env
```

**Anthropic Claude**
```
Cost: $0.003-0.03 per 1K tokens
1. Get key from https://console.anthropic.com/
2. Set ANTHROPIC_API_KEY in .env
```

## Step 3: Set Up Redis

Redis stores conversation memory so users' chat history is maintained.

### Option A: Docker (Recommended)

```bash
docker run -d -p 6379:6379 redis:latest
```

### Option B: Local Installation

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install redis-server
sudo service redis-server start
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Windows:**
Download from: https://github.com/microsoftarchive/redis/releases

### Verify Redis is Running

```bash
redis-cli ping
# Should return: PONG
```

## Step 4: Configure Environment Variables

1. Create a `.env` file in `backend/` directory:

```bash
cd backend
cp .env.example .env
nano .env  # or use your preferred editor
```

2. Update with your configuration:

```env
# ===== ESSENTIAL =====

# LLM Configuration (only one is needed)
GROQ_API_KEY=gsk_your_key_here_from_console_groq_com

# Redis (local development)
REDIS_HOST=localhost
REDIS_PORT=6379

# Database (use SQLite for easy local development)
DATABASE_URL=sqlite:///./uhodari.db

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

3. For development, these defaults will work:
   - Uses Groq's free API (no cost)
   - Uses local Redis (requires running separately)
   - Uses SQLite database (no PostgreSQL needed)

## Step 5: Test the Chat Endpoint

### Using cURL

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about Kikuyu traditions",
    "conversation_id": "user-123",
    "page": "stories"
  }'
```

### Using Python

```python
import requests
import json

response = requests.post(
    "http://localhost:8000/api/chat",
    json={
        "message": "What is the significance of Mount Kenya in Kikuyu culture?",
        "conversation_id": "test-conversation",
        "page": "stories",
        "selectedText": ""
    }
)

print(json.dumps(response.json(), indent=2))
```

### Expected Response

```json
{
  "type": "message",
  "content": "Mount Kenya, known as 'Kirinyaga' in Kikuyu...",
  "community": "kikuyu",
  "conversation_id": "test-conversation",
  "has_context": false
}
```

## Step 6: Frontend Integration

The frontend already sends requests to `/api/chat`. The endpoint expects:

```typescript
interface ChatRequest {
  message: string;           // Required: User's message
  conversation_id: string;   // Optional: Unique conversation ID
  page: string;             // Optional: Current page (stories, home, etc)
  selectedText: string;     // Optional: Any selected text on page
}
```

The response will be:

```typescript
interface ChatResponse {
  type: "message" | "error";
  content: string;
  community?: string;        // Detected community (e.g., "kikuyu", "maasai")
  conversation_id?: string;
  has_context?: boolean;
  error?: string;            // Only if type is "error"
}
```

## Step 7: Conversation Memory Endpoints

### Clear Conversation History

```bash
curl -X POST http://localhost:8000/api/chat/clear \
  -H "Content-Type: application/json" \
  -d '{"conversation_id": "user-123"}'
```

### Get Conversation Summary

```bash
curl http://localhost:8000/api/chat/summary/user-123
```

Response:
```json
{
  "conversation_id": "user-123",
  "message_count": 5,
  "active_community": "kikuyu",
  "recent_messages": [...]
}
```

## Step 8: Advanced - Vector Database Context (Optional)

For better responses, integrate a vector database to search stories:

```python
# In chat_service.py, update get_vector_context()

from langchain.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbeddings

def get_vector_context(query, community=None, k=5):
    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = Chroma(persist_directory="./data/chroma", embedding_function=embeddings)
    
    # Search for similar stories
    results = vectorstore.similarity_search(query, k=k)
    
    context_list = [doc.page_content for doc in results]
    return context_list
```

Install chromadb:
```bash
pip install chromadb
```

## Step 9: Production Deployment

### Environment Variables in Production

**Do NOT hardcode API keys!** Use your hosting platform's secrets management:

**Heroku:**
```bash
heroku config:set GROQ_API_KEY=gsk_your_key_here
```

**AWS/Lambda:**
Use AWS Secrets Manager or environment variables in your Lambda function configuration

**Docker/Kubernetes:**
```yaml
env:
  - name: GROQ_API_KEY
    valueFrom:
      secretKeyRef:
        name: uhodari-secrets
        key: groq-api-key
```

## Troubleshooting

### Issue: "GROQ_API_KEY not found"

**Solution:**
```bash
# Check if .env file exists
ls -la backend/.env

# Verify GROQ_API_KEY is set
cat backend/.env | grep GROQ_API_KEY

# If not set, add it
echo "GROQ_API_KEY=gsk_your_key_here" >> backend/.env
```

### Issue: Redis connection refused

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# If not, start Redis
redis-server

# Or start with Docker
docker run -d -p 6379:6379 redis:latest
```

### Issue: Chat returns empty responses

**Solution:**
1. Check backend logs: `python -u run.py`
2. Verify API key is valid at https://console.groq.com
3. Check rate limits (Groq free tier has limits)
4. Ensure conversation_id is unique per user

### Issue: LLM initialization error

**Solution:**
```bash
# Reinstall langchain-groq
pip install --upgrade langchain-groq

# Verify Groq API key format (starts with "gsk_")
```

## Community Detection

The system automatically detects which Kenyan community a user is interested in:

**Supported Communities:**
- Kikuyu ("Kikuyu traditions", "Mount Kenya")
- Maasai ("Maasai herding", "Maasai culture")
- Luo ("Lake Victoria", "Luo fishing")
- Kalenjin, Luhya, Kisii, Kamba, Meru, Embu, Turkana, Somali and others

When detected, the system:
1. Stores the community preference
2. Filters story context to that community
3. Tailors responses to cultural specifics

## API Rate Limits

**Groq Free Tier:**
- 30 requests/minute
- Perfect for development and small-scale applications
- Upgrade to higher tiers for production

If you hit rate limits, add backoff logic:

```python
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def process_chat_message(*args, **kwargs):
    # Your chat logic here
    pass
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Get Groq API key
3. ✅ Configure Redis
4. ✅ Set up .env file
5. ✅ Test the endpoint
6. 🚀 Deploy to production

## Support & Resources

- **Groq Console:** https://console.groq.com
- **Groq Docs:** https://console.groq.com/docs
- **FastAPI Docs:** http://localhost:8000/docs (when running locally)
- **LangChain Docs:** https://python.langchain.com

---

**Made with ❤️ for cultural preservation**
