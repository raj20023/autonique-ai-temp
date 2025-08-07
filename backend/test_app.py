"""
Ultra-minimal test app
"""
import os
import sys

print("=== STARTING TEST APP ===")
print(f"Python version: {sys.version}")
print(f"PORT env var: {os.getenv('PORT', 'NOT SET')}")

try:
    from fastapi import FastAPI
    print("✅ FastAPI imported successfully")

    app = FastAPI()

    @app.get("/")
    def root():
        return {
            "status": "working",
            "port": os.getenv("PORT"),
            "env_vars": {k: v for k, v in os.environ.items() if not k.startswith("_")}
        }

    @app.get("/ping")
    def ping():
        return {"ping": "pong"}

    @app.get("/debug")
    def debug():
        return {
            "port": os.getenv("PORT"),
            "railway_env": os.getenv("RAILWAY_ENVIRONMENT"),
            "python_path": sys.path,
            "cwd": os.getcwd()
        }

    print("✅ FastAPI app created successfully")

    if __name__ == "__main__":
        import uvicorn
        port = int(os.getenv("PORT", 8000))
        print(f"🚀 Starting uvicorn on port {port}")
        uvicorn.run(app, host="0.0.0.0", port=port)

except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
