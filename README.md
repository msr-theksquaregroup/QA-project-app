# 🚀 QA Project Application

**AI-Powered Test Automation with 8-Agent Workflow**

A comprehensive test automation platform that uses 8 specialized AI agents to analyze code, generate test cases, create BDD scenarios, and produce executable test automation artifacts. Built with modern web technologies and AI/ML integration.

![Application Status](https://img.shields.io/badge/status-production%20ready-green)
![Python](https://img.shields.io/badge/python-3.12+-blue)
![React](https://img.shields.io/badge/react-19.1.1-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-latest-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.2-purple)

## 🌟 Live Demo

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/docs
- **Agent Service**: http://localhost:8001/docs

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

### 🛠️ Technology Stack:

**Frontend:**
- **React 19.1.1** with TypeScript
- **Vite 7.1.2** for blazing fast development
- **Tailwind CSS** for utility-first styling
- **Zustand** for simple state management
- **TanStack React Query** for server state
- **WebSockets** for real-time communication
- **React Router** for navigation
- **Lucide Icons** for beautiful icons
- **Radix UI** components via shadcn/ui
- **Monaco Editor** for code preview
- **React Dropzone** for file uploads
- **Sonner** for toast notifications

**Backend:**
- **Python 3.12+** with FastAPI 0.110.0
- **LangChain & LangGraph** for AI orchestration
- **Groq LLM** for AI operations
- **WebSocket** for real-time communication
- **Playwright** integration for test execution
- **Uvicorn** ASGI server
- **Pydantic** for data validation
- **Aiofiles** for async file operations

**AI/ML Stack:**
- **LangChain Agents** for workflow orchestration
- **Groq API** for fast LLM inference
- **LangGraph** for complex agent workflows
- **Custom AI Agents** for specialized tasks

**Development Tools:**
- **TypeScript** for type safety
- **ESLint** for code linting
- **PostCSS & Autoprefixer** for CSS processing
- **Hot Module Replacement** for fast development
- **CORS** enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- **Python 3.12+** (3.11.4+ also supported)
- **Node.js 18+** (v22.15.1+ recommended)
- **npm** or **yarn**
- **Git** for version control
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/msr-theksquaregroup/QA-project-app.git
   cd QA-project-app
   ```

2. **Backend Setup**
   ```bash
   # Create and activate virtual environment
   python3 -m venv .venv
   
   # Activate virtual environment
   source .venv/bin/activate  # On macOS/Linux
   # OR on Windows:
   .venv\Scripts\activate
   
   # Upgrade pip
   pip install --upgrade pip
   
   # Install Python dependencies
   pip install -r backend/requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Configuration**
   ```bash
   # Create frontend environment file
   cd frontend
   echo "VITE_API_BASE=http://localhost:8000" > .env
   echo "VITE_AGENT_API_BASE=http://localhost:8001" >> .env
   cd ..
   ```

### 🚀 Running the Application

#### Option 1: Manual Start (Recommended for Development)

You need to run **3 services** simultaneously:

**Terminal 1 - Backend API Service:**
```bash
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
✅ Backend API will start on `http://localhost:8000`

**Terminal 2 - Agent Service:**
```bash
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
python agent_service.py
```
✅ Agent Service will start on `http://localhost:8001`

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend will start on `http://localhost:5173`

#### Option 2: Quick Start Script (if available)
```bash
python start_agents.py
```

### ✅ Verification

Check all services are running:
```bash
# Check Backend API
curl http://localhost:8000/docs

# Check Agent Service
curl http://localhost:8001/docs

# Check Frontend
curl -I http://localhost:5173
```

**Success indicators:**
- Backend API: Swagger UI loads at http://localhost:8000/docs
- Agent Service: Swagger UI loads at http://localhost:8001/docs  
- Frontend: React app loads at http://localhost:5173

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
├── agent_service.py           # AI Agent service (port 8001)
├── backend/                   # FastAPI backend (port 8000)
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── models.py         # Data models
│   │   ├── runner.py         # Test execution
│   │   └── storage.py        # File management
│   ├── requirements.txt      # Python dependencies
│   ├── runs/                 # Analysis run data
│   └── uploads/              # Uploaded files
├── frontend/                  # React application (port 5173)
│   ├── src/
│   │   ├── pages/           # React pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Files.tsx
│   │   │   ├── AgentExecution.tsx
│   │   │   └── ...
│   │   ├── components/      # Reusable components
│   │   │   ├── AppShell.tsx
│   │   │   ├── AgentsProgress.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── lib/            # Utilities and API calls
│   │   │   ├── api.ts      # API client
│   │   │   ├── store.ts    # Zustand store
│   │   │   └── utils.ts    # Utility functions
│   │   └── types.ts        # TypeScript definitions
│   ├── package.json
│   ├── vite.config.ts      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── .env               # Environment variables
├── input_files/              # Sample test files
├── agent_output/             # Generated artifacts (runtime)
│   ├── features/            # Gherkin feature files
│   ├── tests/              # Generated Playwright tests
│   ├── reports/            # Analysis reports
│   └── execution_logs/     # Test execution logs
├── notebook/                 # Jupyter notebooks
├── .venv/                   # Python virtual environment
├── .gitignore              # Git ignore rules
├── WINDOWS_SETUP.md        # Windows setup guide
└── README.md              # This file
```

## 🔧 Configuration

### 🔧 Environment Variables

**Optional - Root `.env` file:**
```bash
# AI/ML Configuration (optional)
GROQ_API_KEY=your_groq_api_key_here
```

**Required - Frontend `.env` file (frontend/.env):**
```bash
# API Endpoints
VITE_API_BASE=http://localhost:8000
VITE_AGENT_API_BASE=http://localhost:8001
```

**Note:** The frontend .env file is automatically created during installation.

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill existing processes (macOS/Linux)
   pkill -f agent_service.py
   pkill -f "npm run dev"
   pkill -f uvicorn
   lsof -ti:8000 | xargs kill -9  # Backend API
   lsof -ti:8001 | xargs kill -9  # Agent Service
   lsof -ti:5173 | xargs kill -9  # Frontend
   
   # On Windows:
   taskkill /F /IM python.exe
   taskkill /F /IM node.exe
   ```

2. **Python Virtual Environment Issues**
   ```bash
   # Recreate virtual environment
   rm -rf .venv  # On Windows: rmdir /s .venv
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install --upgrade pip
   pip install -r backend/requirements.txt
   ```

3. **Frontend Build Issues**
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   rm -rf dist
   rm -rf node_modules  # If needed
   npm install
   npm run dev
   ```

4. **Import/Cache Errors**
   ```bash
   # Clear all caches
   cd frontend
   rm -rf node_modules/.vite
   rm -rf dist
   cd ..
   find . -type d -name "__pycache__" -delete  # On Windows: use File Explorer
   ```

5. **Dependency Conflicts**
   ```bash
   # Fix Python dependency conflicts
   pip install --upgrade pydantic>=2.7.4
   pip install --upgrade langchain
   pip install --upgrade langgraph
   ```

6. **Services Not Communicating**
   - Ensure all 3 services are running
   - Check frontend/.env has correct API endpoints
   - Verify no firewall blocking ports 8000, 8001, 5173
   - Check browser console for CORS errors

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **FastAPI** - Modern, fast web framework for APIs
- **React** - A JavaScript library for building user interfaces
- **LangChain & LangGraph** - Framework for developing applications with LLMs
- **Groq** - Fast AI inference platform
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautifully designed components
- **Lucide React** - Beautiful & consistent icon toolkit
- **Zustand** - Small, fast and scalable state management
- **TanStack Query** - Powerful data synchronization for React
- **Playwright** - Reliable end-to-end testing framework

## 📞 Support

If you encounter any issues:

### ✅ Quick Checklist
1. **All 3 services running?**
   - Backend API: http://localhost:8000/docs
   - Agent Service: http://localhost:8001/docs
   - Frontend: http://localhost:5173

2. **Dependencies installed?**
   - Python: `pip list` shows all packages
   - Node.js: `npm list` in frontend/ directory

3. **Environment setup?**
   - Virtual environment activated
   - frontend/.env file exists with correct URLs

4. **Check logs:**
   - Browser console (F12) for frontend errors
   - Terminal logs for backend/agent errors
   - Network tab for API communication issues

### 🔍 Debug Commands
```bash
# Check service status
curl -s http://localhost:8000/health || echo "Backend API down"
curl -s http://localhost:8001/health || echo "Agent Service down"
curl -s http://localhost:5173 || echo "Frontend down"

# Check Python environment
which python
pip list | grep -E "fastapi|langchain|groq"

# Check Node.js environment
which node
cd frontend && npm list --depth=0
```

## 🎯 Usage Examples

### Example 1: Upload Cypress Test
```javascript
// contact_form.cy.js
describe('Contact Form', () => {
  it('should submit form successfully', () => {
    cy.visit('/contact');
    cy.get('[data-cy="name"]').type('John Doe');
    cy.get('[data-cy="email"]').type('john@example.com');
    cy.get('[data-cy="submit"]').click();
    cy.contains('Thank you').should('be.visible');
  });
});
```

### Example 2: Upload JavaScript Test
```javascript
// sample_test.js
function loginUser(username, password) {
  const loginForm = document.querySelector('#login-form');
  const usernameInput = loginForm.querySelector('#username');
  const passwordInput = loginForm.querySelector('#password');
  
  usernameInput.value = username;
  passwordInput.value = password;
  loginForm.submit();
}
```

### Generated Output Example
**Gherkin Feature:**
```gherkin
Feature: Contact Form Submission
  As a user
  I want to submit a contact form
  So that I can get in touch with the company

  Scenario: Successful form submission
    Given I am on the contact page
    When I fill in the name field with "John Doe"
    And I fill in the email field with "john@example.com"
    And I click the submit button
    Then I should see a "Thank you" message
```

**Generated Playwright Test:**
```javascript
const { test, expect } = require('@playwright/test');

test('Contact Form Submission', async ({ page }) => {
  await page.goto('/contact');
  await page.fill('[data-cy="name"]', 'John Doe');
  await page.fill('[data-cy="email"]', 'john@example.com');
  await page.click('[data-cy="submit"]');
  await expect(page.locator('text=Thank you')).toBeVisible();
});
```
