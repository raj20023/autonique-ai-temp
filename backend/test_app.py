"""
Minimal FastAPI app for testing Railway deployment
"""
from fastapi import FastAPI
import os

app = FastAPI(title="Test App")

@app.get("/")
def root():
    return {"message": "Test app is running", "port": os.getenv("PORT", "8000")}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/ping")
def ping():
    return {"ping": "pong"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
