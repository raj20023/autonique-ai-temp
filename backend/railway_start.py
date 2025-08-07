#!/usr/bin/env python3
"""
Railway startup script for Autonique.ai
Handles PORT environment variable properly
"""
import os
import sys
import subprocess

def main():
    # Get port from environment variable
    port = os.getenv("PORT", "8000")
    
    print(f"🚀 Starting Autonique.ai API on port {port}")
    print(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    
    # Start uvicorn with proper port
    cmd = [
        "uvicorn",
        "app.main:app",
        "--host", "0.0.0.0",
        "--port", str(port),
        "--log-level", "info"
    ]
    
    print(f"Executing: {' '.join(cmd)}")
    
    try:
        # Use exec to replace the current process
        os.execvp("uvicorn", cmd)
    except Exception as e:
        print(f"❌ Failed to start uvicorn: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
