#!/usr/bin/env python3
"""
Simple diagnostic script - run from anywhere in the project
Usage: python3 run_diagnostics.py
"""

import os
import sys
from pathlib import Path

# Find the uhodari backend directory
def find_backend_dir():
    current = Path.cwd()
    # Search up to 3 levels up
    for _ in range(3):
        backend_path = current / "uhodari" / "backend"
        if backend_path.exists():
            return backend_path
        backend_path = current / "backend"
        if backend_path.exists():
            return backend_path
        current = current.parent
    return None

backend_dir = find_backend_dir()
if not backend_dir:
    print("❌ Could not find backend directory")
    sys.exit(1)

# Change to backend directory
os.chdir(backend_dir)
print(f"📍 Working directory: {backend_dir}")
print("=" * 60)

# Now run checks
checks_passed = 0
checks_failed = 0

def check(name, condition, error_msg=""):
    global checks_passed, checks_failed
    if condition:
        print(f"✅ {name}")
        checks_passed += 1
    else:
        print(f"❌ {name}")
        if error_msg:
            print(f"   └─ {error_msg}")
        checks_failed += 1

# 1. .env file
check(".env file exists", Path(".env").exists(), "Create: cp .env.example .env")

# 2. GROQ_API_KEY in .env
if Path(".env").exists():
    with open(".env") as f:
        env_content = f.read()
    has_groq = "GROQ_API_KEY=gsk_" in env_content
    check("GROQ_API_KEY configured", has_groq, "Add key from https://console.groq.com")
else:
    check("GROQ_API_KEY configured", False, ".env doesn't exist")

# 3. Packages
try:
    import redis
    check("redis package installed", True)
except ImportError:
    check("redis package installed", False, "Run: pip install redis")

try:
    from langchain_groq import ChatGroq
    check("langchain-groq installed", True)
except ImportError:
    check("langchain-groq installed", False, "Run: pip install langchain-groq")

try:
    from dotenv import load_dotenv
    check("python-dotenv installed", True)
except ImportError:
    check("python-dotenv installed", False, "Run: pip install python-dotenv")

try:
    import fastapi
    check("fastapi installed", True)
except ImportError:
    check("fastapi installed", False, "Run: pip install fastapi")

# 4. Environment loading
try:
    from dotenv import load_dotenv
    load_dotenv()
    groq_key = os.getenv("GROQ_API_KEY")
    check("Environment loads from .env", groq_key is not None, "GROQ_API_KEY not found after loading")
except Exception as e:
    check("Environment loads from .env", False, str(e))

# 5. LLM initialization
try:
    # Suppress warnings
    import warnings
    warnings.filterwarnings("ignore")
    
    from app.services.chat_service import llm
    check("LLM initializes", llm is not None, "Check logs above for initialization error")
except Exception as e:
    check("LLM initializes", False, str(e))

# 6. Redis connection
try:
    import redis
    r = redis.Redis(host="localhost", port=6379, db=0)
    r.ping()
    check("Redis connection", True)
except Exception as e:
    check("Redis connection", False, "Redis not running. Start with: redis-server")

# Summary
print("=" * 60)
print(f"Results: ✅ {checks_passed} passed, ❌ {checks_failed} failed")
print("=" * 60)

if checks_failed == 0:
    print("\n🎉 All checks passed!")
    print("\nTo start the server, run:")
    print("  cd uhodari/backend && python run.py")
    sys.exit(0)
else:
    print("\n⚠️  Some checks failed. See above for instructions.")
    sys.exit(1)
