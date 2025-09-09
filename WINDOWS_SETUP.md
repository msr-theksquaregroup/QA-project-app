# 🪟 Windows Setup Guide - QA Project Application

## 📋 Prerequisites

### Required Software:
1. **Python 3.12+** - [Download from python.org](https://www.python.org/downloads/)
   - ✅ Make sure to check "Add Python to PATH" during installation
2. **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
   - ✅ This includes npm automatically
3. **Git** - [Download from git-scm.com](https://git-scm.com/download/win)
4. **Code Editor** - [VS Code](https://code.visualstudio.com/) (recommended)

### Verify Installation:
Open **Command Prompt** or **PowerShell** and run:
```cmd
python --version
node --version
npm --version
git --version
```

## 🚀 Installation Steps

### Step 1: Clone the Repository
```cmd
# Open Command Prompt or PowerShell
# Navigate to your desired directory (e.g., Desktop)
cd C:\Users\%USERNAME%\Desktop

# Clone the repository
git clone https://github.com/msr-theksquaregroup/QA-project-app.git
cd QA-project-app
```

### Step 2: Backend Setup

#### Option A: Using Command Prompt
```cmd
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Option B: Using PowerShell
```powershell
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# If you get execution policy error, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Frontend Setup
Open a **new** Command Prompt or PowerShell window:
```cmd
cd C:\Users\%USERNAME%\Desktop\QA-project-app
cd frontend
npm install
```

## 🎯 Running the Application

### Method 1: Manual Start (Recommended)

#### Terminal 1 - Backend:
```cmd
cd C:\Users\%USERNAME%\Desktop\QA-project-app
.venv\Scripts\activate
python agent_service.py
```
✅ Backend will start on `http://localhost:8001`

#### Terminal 2 - Frontend:
```cmd
cd C:\Users\%USERNAME%\Desktop\QA-project-app\frontend
npm run dev
```
✅ Frontend will start on `http://localhost:5173`

### Method 2: Using PowerShell
```powershell
# Terminal 1 - Backend
cd C:\Users\$env:USERNAME\Desktop\QA-project-app
.\.venv\Scripts\Activate.ps1
python agent_service.py

# Terminal 2 - Frontend (new PowerShell window)
cd C:\Users\$env:USERNAME\Desktop\QA-project-app\frontend
npm run dev
```

### Method 3: Quick Start Script (if available)
```cmd
cd C:\Users\%USERNAME%\Desktop\QA-project-app
python start_agents.py
```

## 🔧 Windows-Specific Configuration

### Environment Variables (Optional)
Create a `.env` file in the project root:
```env
# API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Windows-specific paths (if needed)
PYTHON_PATH=C:\Python312\python.exe
NODE_PATH=C:\Program Files\nodejs\node.exe
```

### Frontend Environment Variables
Create `frontend\.env`:
```env
VITE_API_BASE=http://localhost:8000
VITE_AGENT_API_BASE=http://localhost:8001
```

## ✅ Verification

### Check Services:
```cmd
# Check backend (in Command Prompt)
curl http://localhost:8001/health

# If curl is not available, use PowerShell:
Invoke-WebRequest -Uri http://localhost:8001/health

# Check frontend
# Open browser and go to: http://localhost:5173
```

## 🚨 Common Windows Issues & Solutions

### Issue 1: Python not found
**Error**: `'python' is not recognized as an internal or external command`
**Solution**: 
```cmd
# Try using py instead
py --version
py -m venv .venv

# Or add Python to PATH manually
```

### Issue 2: PowerShell Execution Policy
**Error**: `execution of scripts is disabled on this system`
**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 3: Port Already in Use
**Error**: `address already in use`
**Solution**:
```cmd
# Kill processes on specific ports
netstat -ano | findstr :8001
taskkill /PID <PID_NUMBER> /F

netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### Issue 4: Node.js/npm Issues
**Solution**:
```cmd
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
cd frontend
rmdir /s node_modules
del package-lock.json
npm install
```

### Issue 5: Virtual Environment Issues
**Solution**:
```cmd
# Remove and recreate virtual environment
rmdir /s .venv
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### Issue 6: Long Path Issues
**Error**: Path too long errors
**Solution**:
1. Enable long paths in Windows:
   - Run `gpedit.msc` as administrator
   - Navigate to: Computer Configuration > Administrative Templates > System > Filesystem
   - Enable "Enable Win32 long paths"
2. Or use shorter directory paths

## 🎯 Windows-Optimized Workflow

### Using Windows Terminal (Recommended)
1. Install [Windows Terminal](https://www.microsoft.com/store/productId/9N0DX20HK701)
2. Open Windows Terminal
3. Split panes: `Ctrl + Shift + D`
4. Run backend in one pane, frontend in another

### Using VS Code Integrated Terminal
1. Open VS Code in project folder: `code .`
2. Open terminal: `Ctrl + `` ` (backtick)
3. Split terminal: Click the split icon
4. Run services in separate terminal panes

## 📁 Windows File Paths

Your project structure on Windows:
```
C:\Users\%USERNAME%\Desktop\QA-project-app\
├── agent_service.py           # Backend service
├── requirements.txt           # Python dependencies
├── .venv\                     # Virtual environment
├── frontend\
│   ├── src\
│   ├── package.json
│   └── node_modules\
├── input_files\               # Sample test files
├── agent_output\              # Generated artifacts
└── README.md
```

## 🎊 Success!

Once both services are running:
1. **Backend**: `http://localhost:8001` ✅
2. **Frontend**: `http://localhost:5173` ✅

Navigate to the frontend URL in your browser and start using your AI-powered test automation platform!

## 💡 Pro Tips for Windows Users

1. **Use Windows Terminal** for better experience
2. **Pin to Taskbar**: Create shortcuts for quick access
3. **Use PowerShell ISE** for script editing
4. **Enable Developer Mode** in Windows Settings for better development experience
5. **Use Windows Subsystem for Linux (WSL)** if you prefer Linux-like environment

## 🆘 Need Help?

If you encounter issues:
1. Check Windows Event Viewer for detailed error logs
2. Run Command Prompt/PowerShell as Administrator if needed
3. Ensure all prerequisites are properly installed
4. Check firewall settings if services can't start
5. Verify antivirus software isn't blocking the applications

---

**🎉 Your QA Project Application is now ready to run on Windows!**

