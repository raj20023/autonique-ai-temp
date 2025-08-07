#!/usr/bin/env python3
"""
Ultra-minimal test app with forced output
"""
import os
import sys
import time

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

print("=" * 50, flush=True)
print("🚀 AUTONIQUE.AI TEST APP STARTING", flush=True)
print("=" * 50, flush=True)
print(f"Python version: {sys.version}", flush=True)
print(f"Current working directory: {os.getcwd()}", flush=True)
print(f"PORT environment variable: {os.getenv('PORT', 'NOT SET')}", flush=True)
print(f"All environment variables:", flush=True)
for key, value in sorted(os.environ.items()):
    if not key.startswith('_'):
        print(f"  {key}={value}", flush=True)

print("\n🔄 Importing FastAPI...", flush=True)
try:
    from fastapi import FastAPI
    print("✅ FastAPI imported successfully", flush=True)
except Exception as e:
    print(f"❌ FastAPI import failed: {e}", flush=True)
    sys.exit(1)

print("🔄 Creating FastAPI app...", flush=True)
app = FastAPI(title="Autonique Test")

@app.get("/")
def root():
    print("📥 Root endpoint called", flush=True)
    return {"status": "working", "message": "Autonique.ai test app is running!"}

@app.get("/ping")
def ping():
    print("📥 Ping endpoint called", flush=True)
    return {"ping": "pong", "timestamp": time.time()}

print("✅ FastAPI app created successfully", flush=True)

if __name__ == "__main__":
    try:
        print("🔄 Importing uvicorn...", flush=True)
        import uvicorn
        print("✅ Uvicorn imported successfully", flush=True)

        port = int(os.getenv("PORT", 8000))
        print(f"🚀 Starting uvicorn server on 0.0.0.0:{port}", flush=True)
        print("=" * 50, flush=True)

        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ STARTUP ERROR: {e}", flush=True)
        import traceback
        traceback.print_exc()
        sys.exit(1)
