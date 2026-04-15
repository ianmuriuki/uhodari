#!/usr/bin/env python3
"""
Check what models are currently available on Groq
Usage: python check_groq_models.py
"""

import os
from dotenv import load_dotenv

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

if not groq_api_key:
    print("❌ GROQ_API_KEY not found. Add it to .env first.")
    exit(1)

try:
    from groq import Groq
    client = Groq(api_key=groq_api_key)
    
    print("🔍 Checking available Groq models...")
    print("=" * 60)
    
    models = client.models.list()
    
    available_models = []
    for model in models.data:
        available_models.append(model.id)
        print(f"✅ {model.id}")
    
    print("=" * 60)
    print(f"\n📋 Found {len(available_models)} available models")
    print("\n💡 To use a model, set in .env:")
    print(f"   GROQ_MODEL_NAME={available_models[0] if available_models else 'model-name'}")
    
    if available_models:
        print(f"\n✨ Recommended (first available):")
        print(f"   GROQ_MODEL_NAME={available_models[0]}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n💡 Alternative: Check manually at:")
    print("   https://console.groq.com/docs/models")
