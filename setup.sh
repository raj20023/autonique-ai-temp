#!/bin/bash

# InstaReply Setup Script
echo "🚀 Setting up InstaReply SaaS Platform..."

# Check if required tools are installed
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
}

echo "📋 Checking prerequisites..."
check_command "node"
check_command "npm"
check_command "python3"
check_command "pip"
check_command "psql"

# Setup Backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Copy environment file
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your actual credentials"
fi

# Setup database
echo "Setting up database..."
if command -v createdb &> /dev/null; then
    createdb instareply_db 2>/dev/null || echo "Database might already exist"
fi

# Run migrations
echo "Running database migrations..."
alembic upgrade head

cd ..

# Setup Frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Copy environment file
if [ ! -f ".env.local" ]; then
    echo "Creating frontend .env.local file..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit frontend/.env.local with your actual credentials"
fi

cd ..

# Create startup scripts
echo "📝 Creating startup scripts..."

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
EOF

# Frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd frontend
npm run dev
EOF

# Make scripts executable
chmod +x start-backend.sh start-frontend.sh

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your Facebook App credentials"
echo "2. Edit frontend/.env.local with your API URLs"
echo "3. Start the backend: ./start-backend.sh"
echo "4. Start the frontend: ./start-frontend.sh"
echo "5. Visit http://localhost:3000"
echo ""
echo "📚 For detailed setup instructions, see README.md"
