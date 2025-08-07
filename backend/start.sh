#!/bin/bash

# Start the application without migrations first
echo "Starting Autonique.ai API..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
