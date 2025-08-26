#!/bin/bash

# KS-QE Platform Setup Script
# This script automates the setup process for the development environment

set -e  # Exit on any error

echo "🚀 KS-QE Platform Setup"
echo "======================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js v18 or higher."
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm."
        exit 1
    fi
    
    # Check Python
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python found: $PYTHON_VERSION"
    else
        print_error "Python 3 not found. Please install Python 3.9 or higher."
        exit 1
    fi
    
    # Check pip
    if command -v pip3 &> /dev/null; then
        PIP_VERSION=$(pip3 --version)
        print_success "pip found: $PIP_VERSION"
    else
        print_error "pip not found. Please install pip."
        exit 1
    fi
    
    echo ""
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Create virtual environment
    print_status "Creating Python virtual environment..."
    python3 -m venv .venv
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source .venv/bin/activate
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    print_success "Backend setup completed!"
    
    cd ..
    echo ""
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    # Create environment file
    if [ ! -f .env ]; then
        print_status "Creating environment file..."
        cp .env.example .env
        print_success "Environment file created from .env.example"
    else
        print_warning "Environment file already exists"
    fi
    
    print_success "Frontend setup completed!"
    
    cd ..
    echo ""
}

# Create directories
create_directories() {
    print_status "Creating required directories..."
    
    mkdir -p backend/uploads
    mkdir -p backend/runs
    
    print_success "Directories created!"
    echo ""
}

# Start services
start_services() {
    print_status "Starting services..."
    echo ""
    
    # Start backend in background
    print_status "Starting backend server..."
    cd backend
    source .venv/bin/activate
    uvicorn app.main:app --reload --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 3
    
    # Check if backend is running
    if curl -s http://localhost:8000/health > /dev/null; then
        print_success "Backend server started at http://localhost:8000"
        print_status "API Documentation: http://localhost:8000/docs"
    else
        print_error "Backend server failed to start"
        exit 1
    fi
    
    echo ""
    
    # Start frontend
    print_status "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for frontend to start
    sleep 5
    
    # Check if frontend is running
    if curl -s http://localhost:5173 > /dev/null; then
        print_success "Frontend server started at http://localhost:5173"
    else
        print_warning "Frontend server might still be starting..."
    fi
    
    echo ""
    print_success "🎉 Setup completed successfully!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend:  http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo ""
    echo "🛑 To stop the servers:"
    echo "   kill $BACKEND_PID $FRONTEND_PID"
    echo ""
    echo "💡 Press Ctrl+C to stop this script and keep servers running"
    
    # Keep script running
    wait
}

# Main execution
main() {
    check_prerequisites
    create_directories
    setup_backend
    setup_frontend
    
    # Ask if user wants to start services
    echo "Would you like to start the development servers now? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        start_services
    else
        print_success "Setup completed! You can start the servers manually:"
        echo ""
        echo "Backend:"
        echo "  cd backend"
        echo "  source .venv/bin/activate"
        echo "  uvicorn app.main:app --reload --port 8000"
        echo ""
        echo "Frontend:"
        echo "  cd frontend"
        echo "  npm run dev"
    fi
}

# Run main function
main
