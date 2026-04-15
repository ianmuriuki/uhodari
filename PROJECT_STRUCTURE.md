# 🗂️ Project Structure & How to Navigate

## Your Project Layout

```
/home/mntel/Desktop/projects/uhodari/
├── uhodari/                          ← 👈 THE ACTUAL PROJECT
│   ├── .vscode/
│   │   ├── settings.json
│   │   └── launch.json
│   ├── backend/                      ← 👈 START HERE
│   │   ├── .env                      ← Your secrets
│   │   ├── run.py                    ← Start server
│   │   ├── run_diagnostics.py        ← Check setup
│   │   ├── requirements.txt
│   │   └── app/
│   │       ├── main.py
│   │       ├── services/
│   │       │   └── chat_service.py
│   │       └── ...
│   ├── frontend/
│   ├── blockchain/
│   ├── CHAT_QUICK_START.md
│   ├── CHAT_SETUP_GUIDE.md
│   └── ...
├── verify_setup.sh                   ← For testing from root
└── README.md (in root)
```

---

## 🎯 Where To Be & What To Run

### ❌ DON'T run commands from here:
```bash
/home/mntel/Desktop/projects/uhodari
```

### ✅ DO navigate here:
```bash
cd /home/mntel/Desktop/projects/uhodari/uhodari/backend
```

Or use relative path:
```bash
cd uhodari/backend
```

---

## 📋 Step-by-Step: Get Chat Working

### Step 1: Navigate to Backend
```bash
cd uhodari/backend

# Verify you're in the right place:
pwd
# Should show: /home/mntel/Desktop/projects/uhodari/uhodari/backend

# Should see these files:
ls -la
# .env, run.py, run_diagnostics.py, requirements.txt, app/, etc.
```

### Step 2: Verify Setup
```bash
python run_diagnostics.py
```

**Expected:**
```
✅ .env file exists
✅ GROQ_API_KEY configured
✅ redis package installed
...
Result: ✅ 9 passed, ❌ 0 failed
🎉 All checks passed!
```

**If any ❌:**
Follow the instructions shown in the output.

### Step 3: Start Redis (in another terminal)
```bash
# Terminal 2
redis-server
```

Or with Docker:
```bash
docker run -d -p 6379:6379 redis:latest
```

### Step 4: Start Backend Server
```bash
# Terminal 3 (in same backend directory)
python run.py
```

**Expected:**
```
✅ Database ready
✅ LLM initialized successfully (API key found: gsk_3ChvJ...)
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 5: Test Chat API (new terminal)
```bash
# Terminal 4
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Kikuyu", "conversation_id": "test"}'
```

---

## Correct Directory Paths

| Action | Command | Result |
|--------|---------|--------|
| Check .env exists | `ls -la .env` | Shows file in backend dir |
| Run diagnostics | `python run_diagnostics.py` | Checks all setup |
| Start server | `python run.py` | Server on 8000 |
| View logs | `python -u run.py` | Unbuffered output |
| Test env loads | `python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('GROQ_API_KEY', 'NOT FOUND'))"` | Prints API key |

---

## If You Get Lost

```bash
# Find where you are
pwd

# Navigate to backend
cd /home/mntel/Desktop/projects/uhodari/uhodari/backend

# Or from anywhere with git
cd $(git rev-parse --show-toplevel)/uhodari/backend

# Verify correct location
test -f run.py && echo "✅ Correct!" || echo "❌ Wrong directory"
```

---

## Terminal Setup

### Terminal 1: Redis
```bash
redis-server
# Stays running in background
```

### Terminal 2: Backend Server
```bash
cd /home/mntel/Desktop/projects/uhodari/uhodari/backend
python run.py
# Stays running
```

### Terminal 3: Testing
```bash
# Test the API
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## Quick Fixes by Symptom

### Symptom: "No such file or directory: .env"

**Your current directory is wrong!**

```bash
# Check where you are
pwd
# If it shows: .../uhodari (not .../uhodari/backend)
# Then: cd backend
```

### Symptom: ❌ All checks failed in verify_setup.sh

**Run from correct location:**

```bash
# FROM PROJECT ROOT:
cd /home/mntel/Desktop/projects/uhodari

# Then run:
bash verify_setup.sh

# Or just navigate to backend and run diagnostics:
cd uhodari/backend
python run_diagnostics.py
```

### Symptom: "ModuleNotFoundError: No module named 'app'"

**You're not in the backend directory!**

```bash
# Should be in: .../uhodari/backend/
# Because: the code does `from app.services...`
# And: app/ folder is in .../uhodari/backend/app/

pwd  # Check
cd uhodari/backend  # Navigate
python run.py  # Try again
```

---

## Environment Variables

Your `.env` is here:
```
/home/mntel/Desktop/projects/uhodari/uhodari/backend/.env
```

When Python loads, it:
1. `load_dotenv()` reads the `.env` file in current directory
2. `os.getenv("GROQ_API_KEY")` gets the value
3. LLM initializes with the key

---

## Verification Commands

**Are you in the right directory?**
```bash
test -f run.py && echo "✅ Yes!" || echo "❌ No - navigate to backend/"
```

**Is .env readable?**
```bash
test -f .env && echo "✅ Yes!" || echo "❌ No - create/check .env"
```

**Does .env have GROQ key?**
```bash
grep "GROQ_API_KEY=gsk_" .env && echo "✅ Yes!" || echo "❌ No - add to .env"
```

**Can Python find modules?**
```bash
python -c "from app.services.chat_service import llm; print('✅ Yes!' if llm else '❌ No!')"
```

---

## Success Sequence

```
✅ cd uhodari/backend
✅ ls .env
✅ python run_diagnostics.py
✅ See all ✅ checks
✅ Start redis-server
✅ python run.py
✅ See LLM initialized message
✅ curl to test API
✅ Chat works!
```

---

## If Something Still Doesn't Work

1. **Check directory:**
   ```bash
   pwd
   # Must end with: .../uhodari/backend
   ```

2. **Run diagnostics:**
   ```bash
   python run_diagnostics.py
   # See which check fails
   ```

3. **Check logs:**
   ```bash
   python -u run.py
   # Shows detailed error messages
   ```

4. **Read documentation:**
   - `backend/README.md` - Quick start
   - `../CHAT_SETUP_GUIDE.md` - Full setup
   - `../ENV_TROUBLESHOOTING.md` - Troubleshooting

---

**You've got this! Just make sure you're in the right directory.** 🚀
