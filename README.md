# 🚀 QA Project Application

**AI-Powered Test Automation with 8-Agent Workflow**

A comprehensive test automation platform that uses 8 specialized AI agents to analyze code, generate test cases, create BDD scenarios, and produce executable test automation artifacts.

![Application Status](https://img.shields.io/badge/status-production%20ready-green)
![Python](https://img.shields.io/badge/python-3.12+-blue)
![React](https://img.shields.io/badge/react-18+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-green)

## 🎯 Features

- **🤖 8 AI Agents**: Specialized agents for comprehensive test automation
- **🎨 Beautiful UI**: Modern React interface with real-time updates
- **📁 File Upload**: Drag-and-drop support for test files
- **🔄 Real-time Progress**: WebSocket communication for live updates
- **📊 Comprehensive Reports**: Generated artifacts including Gherkin, Playwright tests, and coverage
- **📥 Download System**: Individual and bulk artifact downloads
- **🎉 Success Notifications**: Visual feedback for agent completion
- **🎊 Final Report Popup**: Automatic completion celebration with download options

## 🏗️ Architecture

### 8-Agent Workflow:
1. **📝 Code Analysis Agent** - Parses code structure and frameworks
2. **👤 User Story Agent** - Generates user stories from code
3. **🥒 Gherkin Agent** - Creates BDD scenarios
4. **📋 Test Plan Agent** - Develops comprehensive test plans
5. **🎭 Playwright Agent** - Generates executable test code
6. **▶️ Execution Agent** - Runs tests and captures results
7. **📊 Coverage Agent** - Analyzes code coverage
8. **📄 Final Report Agent** - Compiles comprehensive reports

### Technology Stack:

**Backend:**
- Python 3.12+ with FastAPI
- LangChain & LangGraph for AI orchestration
- Groq for LLM operations
- WebSocket for real-time communication
- Playwright integration

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Zustand for state management
- TanStack Query for data fetching

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd QA-project-app
   ```

2. **Backend Setup**
   ```bash
   # Create and activate virtual environment
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   
   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Manual Start (Recommended for Development)

**Terminal 1 - Backend:**
```bash
source .venv/bin/activate
python agent_service.py
```
✅ Backend will start on `http://localhost:8001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend will start on `http://localhost:5173`

#### Option 2: Quick Start Script
```bash
python start_agents.py  # If available
```

### Verification
```bash
# Check backend
curl http://localhost:8001/health

# Check frontend
curl -I http://localhost:5173
```

## 🎯 How to Use

1. **Access the Application**
   - Open your browser: `http://localhost:5173`

2. **Navigate to Files Page**
   - Click "Files" in the navigation menu

3. **Upload Test Files**
   - Switch to "Agent Mode" (toggle button)
   - Drag and drop test files (.js, .ts, .cy.js)
   - Or click to browse and select files

4. **Run Analysis**
   - Click "Start Analysis" button
   - Watch real-time progress of all 8 agents
   - See live messages and status updates

5. **View Results**
   - Automatic popup appears when complete
   - Or click "View Report" button
   - Download individual artifacts or all as ZIP

## 📊 Generated Artifacts

- **📝 Gherkin Features** - BDD scenarios (.feature files)
- **🎭 Playwright Tests** - Executable test code (.js files)
- **📋 Test Plans** - Comprehensive documentation (.md files)
- **👤 User Stories** - User story documentation (.md files)
- **📊 Execution Logs** - Test run results (.json files)
- **📄 Final Reports** - Complete analysis summary (.json files)

## 📁 Project Structure

```
QA-project-app/
├── agent_service.py           # Main backend service
├── requirements.txt           # Python dependencies
├── input_files/              # Sample test files
├── agent_output/             # Generated artifacts (created at runtime)
├── .venv/                    # Python virtual environment (excluded from git)
├── frontend/                 # React application
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # Reusable components
│   │   ├── lib/            # Utilities and API calls
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── .gitignore               # Git ignore rules
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root if needed:
```bash
# API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Frontend Configuration (in frontend/.env)
VITE_API_BASE=http://localhost:8000
VITE_AGENT_API_BASE=http://localhost:8001
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill existing processes
   pkill -f agent_service.py
   pkill -f "npm run dev"
   lsof -ti:8001 | xargs kill -9
   lsof -ti:5173 | xargs kill -9
   ```

2. **Python Virtual Environment Issues**
   ```bash
   # Recreate virtual environment
   rm -rf .venv
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Frontend Build Issues**
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   rm -rf dist
   npm install
   npm run dev
   ```

4. **Import Errors**
   ```bash
   # Clear all caches
   cd frontend
   rm -rf node_modules/.vite
   rm -rf dist
   cd ..
   find . -type d -name "__pycache__" -delete
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with FastAPI and React
- Powered by LangChain and Groq
- UI components inspired by shadcn/ui
- Icons from Lucide React

## 📞 Support

If you encounter any issues:
1. Check that both services are running on correct ports
2. Verify all dependencies are installed
3. Check browser console for frontend errors
4. Check terminal logs for backend errors

---

**🎉 Ready to automate your testing workflow with AI? Get started now!**