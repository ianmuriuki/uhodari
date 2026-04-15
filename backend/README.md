# 🚀 Uhodari Backend - Quick Start

## Current Location: `uhodari/backend/`

Everything you need is in this directory.

---

## 1️⃣ Verify Your Setup

Run this from the backend directory:

```bash
# From: /uhodari/backend/
python run_diagnostics.py
```

This will check:
- ✅ .env file exists
- ✅ GROQ_API_KEY is set
- ✅ All required packages installed
- ✅ Environment variables loading
- ✅ LLM initializes successfully
- ✅ Redis connection works

---

## 2️⃣ What the Output Should Show

**All Good:**
```
✅ .env file exists
✅ GROQ_API_KEY configured
✅ redis package installed
✅ langchain-groq installed
✅ python-dotenv installed
✅ fastapi installed
✅ Environment loads from .env
✅ LLM initializes
✅ Redis connection
Results: ✅ 9 passed, ❌ 0 failed
🎉 All checks passed!
```

**If Something Fails:**
Follow the instructions shown next to the ❌

---

## 3️⃣ Start the Backend Server

```bash
# From: /uhodari/backend/
python run.py
```

Expected output:
```
✅ Database ready
✅ LLM initialized successfully (API key found: gsk_3ChvJ...)
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

## 4️⃣ Test the Chat API

In a new terminal:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about Kikuyu culture",
    "conversation_id": "test-1"
  }'
```

Expected response:
```json
{
  "type": "message",
  "content": "Kikuyu culture is rich with...",
  "community": "kikuyu",
  "conversation_id": "test-1"
}
```

---

## ❓ Common Issues

### ❌ "GROQ_API_KEY not configured"
**Solution:** 
1. Get key from: https://console.groq.com/keys (takes 2 min, free)
2. Edit `.env` file:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   ```
3. Rerun diagnostics

### ❌ "Redis connection failed"
**Solution:** 
Start Redis in another terminal:
```bash
redis-server
```

Or with Docker:
```bash
docker run -d -p 6379:6379 redis:latest
```

### ❌ "redis package not installed"
**Solution:**
```bash
pip install redis
```

### ❌ "LLM initializes [FAILED]"
**Solutions:**
1. Check GROQ_API_KEY is set correctly
2. Verify API key format (starts with `gsk_`)
3. Make sure you're online (needs to connect to Groq API)

---

## 📁 Project Structure

```
/uhodari/backend/
├── .env                 ← Your secrets (GROQ_API_KEY)
├── run.py              ← Start the server with: python run.py
├── run_diagnostics.py  ← Check setup with: python run_diagnostics.py
├── requirements.txt    ← Python dependencies
├── app/                ← Application code
│   ├── main.py         ← FastAPI app & endpoints
│   ├── models.py       ← Database models
│   ├── services/
│   │   └── chat_service.py  ← Chat logic with LLM
│   └── ...
└── .venv/              ← Virtual environment (already activated)
```

---

## ✅ Success Checklist

Before testing the API:
- [ ] Ran `python run_diagnostics.py`
- [ ] All checks showed ✅
- [ ] Server starts with `python run.py`
- [ ] Can reach http://localhost:8000/docs
- [ ] See message about LLM initialized

---

## 🎯 Next Steps

1. ✅ Run diagnostics
2. ✅ Fix any issues (see above)
3. ✅ Start server
4. ✅ Test API
5. 🚀 Chat is working!

---

## 📖 More Information

- Full setup guide: `../CHAT_SETUP_GUIDE.md`
- Architecture: `../ARCHITECTURE.md`
- Quick reference: `../CHAT_QUICK_START.md`
- Troubleshooting: `../ENV_TROUBLESHOOTING.md`

---

**Let's get this working!** 🚀
