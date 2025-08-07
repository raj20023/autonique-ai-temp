FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Make Python startup script executable
RUN chmod +x railway_start.py

# Use Python startup script (more reliable than shell)
CMD ["python", "railway_start.py"]
