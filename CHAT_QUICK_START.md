# 🎯 Quick Start - Chat System Setup

## 3-Minute Quick Setup

### 1️⃣ Get Free API Key (2 min)
```
1. Visit: https://console.groq.com/keys
2. Sign up (Google/GitHub/Email)
3. Create API key
4. Copy it (starts with "gsk_")
```

### 2️⃣ Configure Backend (1 min)
```bash
cd backend
nano .env
```

Add these 2 lines:
```env
GROQ_API_KEY=gsk_your_key_here
REDIS_HOST=localhost
```

### 3️⃣ Start Services
```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start Backend
cd backend
python run.py
```

## Testing

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about Kikuyu culture",
    "conversation_id": "test-1"
  }'
```

## Expected Response
```json
{
  "type": "message",
  "content": "Kikuyu culture is rich with... [full response]",
  "community": "kikuyu",
  "conversation_id": "test-1"
}
```

---

## Environment Variables Needed

| Variable | Value | Source | Required? |
|----------|-------|--------|-----------|
| `GROQ_API_KEY` | `gsk_xxx` | https://console.groq.com | ✅ YES |
| `REDIS_HOST` | `localhost` | Redis instance | Can skip locally |
| `REDIS_PORT` | `6379` | Redis default | Can skip locally |
| `DATABASE_URL` | `sqlite:///./test.db` | Local SQLite | Can skip locally |

---

## Supported Communities (Auto-Detected)

The chat will automatically detect when users ask about:

```
✓ Kikuyu      ✓ Maasai      ✓ Luo
✓ Kalenjin    ✓ Luhya       ✓ Kisii
✓ Kamba       ✓ Meru        ✓ Embu
✓ Turkana     ✓ Somali      ✓ Swahili
```

Example: "Tell me about Maasai traditions" → Auto-detected "maasai"

---

## How It Works

```
User Types Message
        ↓
Frontend sends to /api/chat
        ↓
Backend processes:
  1. Detects community (if mentioned)
  2. Searches for context (vector DB - optional)
  3. Gets conversation history (Redis)
  4. Calls Groq LLM with system prompt
  5. Saves response to memory
        ↓
Returns response to frontend
```

---

## Features

✅ **Conversation Memory** - Remembers previous messages (last 20)  
✅ **Community Detection** - Identifies which community user is interested in  
✅ **Context Retrieval** - Can pull relevant stories (when vector DB is setup)  
✅ **Multi-turn Chat** - Maintains context across multiple messages  
✅ **Rate Limited** - Groq free tier (30 req/min) - plenty for users  

---

## Common Issues & Fixes

### ❌ "GROQ_API_KEY not found"
```bash
# Add to .env
echo "GROQ_API_KEY=gsk_your_key_here" >> backend/.env
```

### ❌ "Redis connection refused"
```bash
# Start Redis
redis-server

# OR with Docker
docker run -d -p 6379:6379 redis:latest
```

### ❌ "Chat returns empty response"
1. Check backend logs
2. Verify API key at https://console.groq.com
3. Check rate limits

---

## API Endpoints

```
POST /api/chat
  - Send message to digital historian

POST /api/chat/clear
  - Clear conversation memory

GET /api/chat/summary/{conversation_id}
  - Get conversation history summary
```

---

## What's Included

✅ Django code implemented in FastAPI  
✅ Redis-based conversation memory  
✅ Community detection for Kenyan cultures  
✅ LangChain + Groq LLM integration  
✅ System prompt tailored for Uhodari  
✅ Frontend already integrated  

---

## Next: Advanced Setup

📘 Full guide: Read `CHAT_SETUP_GUIDE.md` for:
- Vector database integration
- Production deployment
- Alternative LLM providers
- Rate limiting & scaling

---

## Questions?

**For Groq:** https://console.groq.com/docs  
**For API:** http://localhost:8000/docs (after running)  
**For LangChain:** https://python.langchain.com
