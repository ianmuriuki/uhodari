#!/usr/bin/env python
"""Start Uhodari server"""

import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    import uvicorn
    print("🌍 Uhodari Server Starting...")
    print("📖 API Docs: http://localhost:8000/docs")
    print("🛑 Press Ctrl+C to stop\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )