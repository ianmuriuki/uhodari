# ⚠️ Model Availability Issue

Groq's available models change frequently. When you see a model decommissioned error, you need to update the model name in `.env`.

## 🔍 Find Currently Available Models

### Option 1: Use the Python Script (Requires Internet)
```bash
cd backend
source .venv/bin/activate
python check_groq_models.py
```

This will print all available models and tell you which to use.

### Option 2: Check Manually Online
Visit: https://console.groq.com/docs/models

This shows the current list of available models.

---

## 🔧 Update Your .env

Once you find an available model, update `backend/.env`:

```dotenv
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL_NAME=<available-model-name>
```

**Common models that are usually available:**
- `mixtral-8x7b-32768` - Mixture of Experts (good general purpose)
- `llama2-70b-4k` - Meta's Llama (good for long conversations)

---

## 🔄 Restart After Changing Model

After updating `.env`, restart the server:

```bash
# Kill old server
pkill -f "python.*run.py"

# Start new server
python run.py
```

---

## 📝 Error Examples & Solutions

### ❌ "The model `X` has been decommissioned"
**Solution:** Model no longer available. Find a new one using steps above.

### ❌ "The model `X` does not exist"
**Solution:** Typo in model name. Check the name carefully.

### ❌ "The model `X` has not been released"
**Solution:** Model is not available in your region or plan.

---

## 🎯 Quick Test After Changing Model

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "conversation_id": "test"}'
```

If it works, you'll see a JSON response starting with `{"type":"message",...`

---

## 💡 Pro Tips

1. **Check for 70B models** - They're usually most powerful and stable
2. **Avoid latest models at first** - Newer models might have issues
3. **Keep this file handy** - You may need to update models periodically
4. **Test after each change** - Ensure the model actually works

---

Found a good model? Update `.env` and restart! 🚀
