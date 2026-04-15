# 🔧 Environment Configuration Troubleshooting

## Issue: "LLM not initialized. Check GROQ_API_KEY"

This happens when the Python code can't find your API key. Here's how to fix it:

---

## ✅ Solution 1: Verify `.env` File Exists

Your `.env` file should be in the `backend/` directory:

```bash
# Check if .env exists
ls -la backend/.env

# Should show something like:
# -rw-r--r-- 1 user group 123 Apr 15 12:34 backend/.env
```

If it doesn't exist, create it:
```bash
cd backend
cp .env.example .env
nano .env  # Add your GROQ_API_KEY
```

---

## ✅ Solution 2: Verify GROQ_API_KEY is in `.env`

Edit `backend/.env` and check it has:

```env
GROQ_API_KEY=gsk_your_key_here
```

Make sure:
- The value starts with `gsk_`
- There's no extra whitespace
- It's on its own line
- The file is saved

---

## ✅ Solution 3: Enable VS Code Environment Loading

The warning you see:
```
An environment file is configured but terminal environment injection is disabled. 
Enable "python.terminal.useEnvFile" to use environment variables from .env files in terminals.
```

Is already fixed! We created `.vscode/settings.json` which enables this. Just:

1. **Restart VS Code completely** (Cmd+Q / Ctrl+Alt+F4)
2. **Reopen the project**
3. **Open a new terminal**

The `.vscode/settings.json` file now has:
```json
{
  "python.terminal.useEnvFile": true
}
```

---

## ✅ Solution 4: Test Environment Loading

Run this from the `backend/` directory:

```bash
cd backend
python test_env.py
```

Expected output:
```
✅ GROQ_API_KEY found!
   Value: gsk_3ChvJ...pTxssyI
✅ Redis Configuration:
   Host: localhost
   Port: 6379
✅ Database URL:
   sqlite:///./test.db
```

If you see ❌ instead of ✅, the `.env` isn't being loaded.

---

## ✅ Solution 5: Restart Everything

1. **Close all terminals**
2. **Restart VS Code**
3. **Open a new terminal in VS Code**
4. **Make sure you're in `backend/` directory**
5. **Activate virtual environment:**
   ```bash
   source backend/.venv/bin/activate
   ```
6. **Run the server:**
   ```bash
   cd backend && python run.py
   ```

You should now see:
```
✅ LLM initialized successfully (API key found: gsk_3ChvJ...)
```

---

## 🔍 Debugging: Check What Python Sees

Run this quick test:

```bash
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('GROQ_API_KEY', 'NOT FOUND'))"
```

Should print your API key (or "NOT FOUND" if there's an issue).

---

## 🚨 Common Issues & Fixes

### Issue: "No such file or directory: .env"

**Fix**: Make sure you're in the `backend/` directory:
```bash
pwd  # Should show: /path/to/uhodari/backend
ls -la .env  # Should list the .env file
```

---

### Issue: "GROQ_API_KEY=gsk_..." but still says "not found"

**Fix**: Make sure there's NO SPACE around the `=`:
```
❌ GROQ_API_KEY = gsk_xxx      (wrong - has spaces)
✅ GROQ_API_KEY=gsk_xxx         (correct - no spaces)
```

---

### Issue: "Couldn't parse the given python module"

**Fix**: Make sure `run.py` exists and has a proper app initialization:
```bash
cd backend
ls -la run.py  # Should exist
python run.py  # Should start server
```

---

### Issue: Can't see the error message

**Fix**: Run with unbuffered output:
```bash
cd backend
python -u run.py
```

---

## 📋 Checklist Before Asking for Help

- [ ] `.env` file exists in `backend/` directory
- [ ] `.env` has `GROQ_API_KEY=gsk_xxxx` (no spaces around `=`)
- [ ] API key is valid (from https://console.groq.com/keys)
- [ ] VS Code restarted after creating `.env` and `.vscode/settings.json`
- [ ] Ran `test_env.py` and saw ✅ for GROQ_API_KEY
- [ ] Using a new terminal (not an old one from before creating `.env`)
- [ ] In the `backend/` directory when running commands
- [ ] Virtual environment activated

---

## ❓ If Still Stuck

Run this diagnostic script:

```bash
cd backend

echo "=== Environment Check ==="
echo "1. Current directory:"
pwd

echo -e "\n2. .env file exists:"
test -f .env && echo "✅ YES" || echo "❌ NO"

echo -e "\n3. .env contains GROQ_API_KEY:"
grep -q "GROQ_API_KEY" .env && echo "✅ YES" || echo "❌ NO"

echo -e "\n4. Python can read GROQ_API_KEY:"
python -c "import os; from dotenv import load_dotenv; load_dotenv(); key = os.getenv('GROQ_API_KEY'); print('✅ Found' if key else '❌ Not found')"

echo -e "\n5. .vscode/settings.json exists:"
test -f ../.vscode/settings.json && echo "✅ YES" || echo "❌ NO"

echo -e "\n6. Test if LLM initializes:"
python -c "
from app.services.chat_service import llm
if llm:
    print('✅ LLM initialized successfully')
else:
    print('❌ LLM failed to initialize')
"
```

Run this and share the output if you need help!

---

## 📞 Get Help

If you're still having issues:

1. Share output from `test_env.py`
2. Share output from the diagnostic script above
3. Check: https://console.groq.com/docs
4. Double-check your `.env` file has the right format

Good luck! 🚀
