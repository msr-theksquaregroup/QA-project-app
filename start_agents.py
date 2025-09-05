#!/usr/bin/env python3
"""
Startup script for the Universal Test Automation Agent System
Runs the agent service and provides instructions for the frontend
"""

import subprocess
import sys
import os
import time
import signal
import threading
from pathlib import Path

def print_banner():
    print("=" * 80)
    print("🚀 UNIVERSAL TEST AUTOMATION AGENT SYSTEM")
    print("=" * 80)
    print("🤖 Based on ALL Agent.ipynb - 8 Agent Workflow")
    print("🔄 Real-time WebSocket communication")
    print("📊 Live coverage analysis and reporting")
    print("🎯 Frontend integration ready")
    print("=" * 80)

def check_dependencies():
    """Check if required dependencies are available"""
    print("📋 Checking dependencies...")
    
    # Check Python packages
    required_packages = [
        'fastapi', 'uvicorn', 'websockets', 'langchain', 
        'langchain-groq', 'langgraph', 'matplotlib', 'seaborn'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"⚠️  Missing Python packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        for package in missing_packages:
            try:
                subprocess.run([sys.executable, '-m', 'pip', 'install', package], 
                             check=True, capture_output=True)
                print(f"✅ Installed {package}")
            except subprocess.CalledProcessError:
                print(f"❌ Failed to install {package}")
    else:
        print("✅ All Python dependencies are available")
    
    # Check Node.js for frontend
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js available: {result.stdout.strip()}")
        else:
            print("⚠️  Node.js not found - frontend needs to be started manually")
    except FileNotFoundError:
        print("⚠️  Node.js not found - frontend needs to be started manually")

def start_agent_service():
    """Start the agent service"""
    print("\n🔧 Starting Agent Service...")
    
    # Set environment variables
    env = os.environ.copy()
    if not env.get('GROQ_API_KEY'):
        print("⚠️  GROQ_API_KEY not set - using fallback mode")
        env['GROQ_API_KEY'] = 'demo_key'
    
    try:
        # Start the agent service
        agent_process = subprocess.Popen([
            sys.executable, 'agent_service.py'
        ], env=env)
        
        print("✅ Agent Service started on http://localhost:8001")
        return agent_process
    
    except Exception as e:
        print(f"❌ Failed to start Agent Service: {e}")
        return None

def print_instructions():
    """Print setup and usage instructions"""
    print("\n" + "=" * 80)
    print("📋 SETUP INSTRUCTIONS")
    print("=" * 80)
    
    print("\n1️⃣ AGENT SERVICE:")
    print("   ✅ Running on http://localhost:8001")
    print("   📡 WebSocket endpoint: ws://localhost:8001/ws/{run_id}")
    print("   🔗 API endpoint: http://localhost:8001/api/start-analysis")
    
    print("\n2️⃣ FRONTEND SETUP:")
    print("   📁 Navigate to the frontend directory:")
    print("      cd frontend")
    print("   📦 Install dependencies (if not done already):")
    print("      npm install")
    print("   🚀 Start the frontend development server:")
    print("      npm run dev")
    print("   🌐 Frontend will be available at: http://localhost:5173")
    
    print("\n3️⃣ ENVIRONMENT VARIABLES (Optional):")
    print("   🔑 Set GROQ_API_KEY for real LLM integration:")
    print("      export GROQ_API_KEY='your_groq_api_key_here'")
    print("   🎯 Set VITE_AGENT_API_BASE in frontend/.env:")
    print("      VITE_AGENT_API_BASE=http://localhost:8001")
    
    print("\n4️⃣ USAGE:")
    print("   📄 Upload code files through the frontend")
    print("   🔍 Select a file for preview")
    print("   🤖 Click 'Analyze with Agents' to start the workflow")
    print("   📊 Watch real-time progress of all 8 agents")
    print("   📋 View generated artifacts (User Stories, Gherkin, Tests, etc.)")
    print("   📈 See coverage analysis and reports")
    
    print("\n5️⃣ FEATURES:")
    print("   🔄 Real-time WebSocket updates")
    print("   🎯 8-agent workflow execution")
    print("   📊 Live coverage visualization")
    print("   📋 Artifact generation and download")
    print("   🚀 Playwright test generation")
    print("   📈 Coverage analysis with c8")
    
    print("\n" + "=" * 80)
    print("🎉 READY TO USE!")
    print("=" * 80)

def main():
    print_banner()
    check_dependencies()
    
    # Start agent service
    agent_process = start_agent_service()
    
    if not agent_process:
        print("❌ Failed to start services")
        sys.exit(1)
    
    # Wait a moment for service to start
    time.sleep(2)
    
    # Print instructions
    print_instructions()
    
    # Handle shutdown gracefully
    def signal_handler(signum, frame):
        print(f"\n🛑 Received signal {signum}, shutting down...")
        if agent_process:
            agent_process.terminate()
            try:
                agent_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                agent_process.kill()
        print("✅ Services stopped")
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        # Keep the script running
        print("\n⏳ Services running... Press Ctrl+C to stop")
        agent_process.wait()
    except KeyboardInterrupt:
        signal_handler(signal.SIGINT, None)

if __name__ == "__main__":
    main()
