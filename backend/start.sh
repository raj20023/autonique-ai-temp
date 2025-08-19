#!/bin/bash

echo "🚀 Starting AutoniqueAI API..."
echo "PORT environment variable: ${PORT:-8000}"

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
