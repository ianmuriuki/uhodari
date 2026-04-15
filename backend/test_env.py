#!/usr/bin/env python3
"""
Test script to verify environment variables are loaded correctly
Run this from the backend directory: python test_env.py
"""

import os
from dotenv import load_dotenv

print("=" * 60)
print("🔍 Environment Variable Test")
print("=" * 60)

# Load .env file
load_dotenv()

# Check GROQ API Key
groq_key = os.getenv("GROQ_API_KEY")
if groq_key:
    print(f"\n✅ GROQ_API_KEY found!")
    print(f"   Value: {groq_key[:15]}...{groq_key[-5:]}")
else:
    print("\n❌ GROQ_API_KEY not found!")
    print("   Please add it to backend/.env")

# Check Redis config
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", "6379")
print(f"\n✅ Redis Configuration:")
print(f"   Host: {redis_host}")
print(f"   Port: {redis_port}")

# Check Database
db_url = os.getenv("DATABASE_URL", "sqlite:///./test.db")
print(f"\n✅ Database URL:")
print(f"   {db_url}")

# Try to import required packages
print(f"\n🔍 Checking required packages:")
try:
    import redis
    print("  ✅ redis")
except ImportError:
    print("  ❌ redis (install: pip install redis)")

try:
    from langchain_groq import ChatGroq
    print("  ✅ langchain_groq")
except ImportError:
    print("  ❌ langchain_groq (install: pip install langchain-groq)")

try:
    from dotenv import load_dotenv
    print("  ✅ python-dotenv")
except ImportError:
    print("  ❌ python-dotenv (install: pip install python-dotenv)")

try:
    import fastapi
    print("  ✅ fastapi")
except ImportError:
    print("  ❌ fastapi (install: pip install fastapi)")

print("\n" + "=" * 60)
print("Test complete!")
print("=" * 60)
