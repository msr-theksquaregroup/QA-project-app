# 🎯 EXACT STEPS - Windows Setup & Run Guide

## 📋 STEP 1: Install Prerequisites

### Download and Install (in this order):
1. **Python 3.12+**: https://www.python.org/downloads/
   - ✅ **IMPORTANT**: Check "Add Python to PATH" during installation
2. **Node.js 18+**: https://nodejs.org/
   - Download LTS version
3. **Git**: https://git-scm.com/download/win
   - Use default settings during installation

## 🚀 STEP 2: Clone and Setup

### Open Command Prompt (cmd) and run these commands exactly:

```cmd
cd C:\Users\%USERNAME%\Desktop
git clone https://github.com/msr-theksquaregroup/QA-project-app.git
cd QA-project-app
```

## 🔧 STEP 3: Backend Setup

### In the same Command Prompt window:

```cmd
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 🎨 STEP 4: Frontend Setup

### Open a NEW Command Prompt window and run:

```cmd
cd C:\Users\%USERNAME%\Desktop\QA-project-app\frontend
npm install
```

## ▶️ STEP 5: Run the Application

### You need 2 Command Prompt windows open:

#### Window 1 - Backend:
```cmd
cd C:\Users\%USERNAME%\Desktop\QA-project-app
.venv\Scripts\activate
python agent_service.py
```
**Wait for**: `INFO: Uvicorn running on http://0.0.0.0:8001`

#### Window 2 - Frontend:
```cmd
cd C:\Users\%USERNAME%\Desktop\QA-project-app\frontend
npm run dev
```
**Wait for**: `Local: http://localhost:5173/`

## 🌐 STEP 6: Access the Application

Open your browser and go to: **http://localhost:5173**

---

# 🚨 If You Get Errors - EXACT FIXES

## Error: "python is not recognized"
```cmd
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Error: "execution of scripts is disabled" (PowerShell)
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Error: "address already in use"
```cmd
netstat -ano | findstr :8001
taskkill /PID [PID_NUMBER] /F

netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F
```

## Error: npm install fails
```cmd
cd frontend
rmdir /s node_modules
del package-lock.json
npm cache clean --force
npm install
```

---

# ✅ VERIFICATION COMMANDS

### Check if everything is working:

```cmd
# Check Python
python --version

# Check Node
node --version

# Check if backend is running (in new cmd window)
curl http://localhost:8001/health

# If curl doesn't work, open browser and go to:
# http://localhost:8001/health
```

---

# 🎯 FINAL CHECKLIST

- [ ] Python installed with PATH ✅
- [ ] Node.js installed ✅  
- [ ] Git installed ✅
- [ ] Repository cloned ✅
- [ ] Backend dependencies installed ✅
- [ ] Frontend dependencies installed ✅
- [ ] Backend running on port 8001 ✅
- [ ] Frontend running on port 5173 ✅
- [ ] Browser opens http://localhost:5173 ✅

**🎉 SUCCESS! Your QA Project Application is now running on Windows!**

---

# 📝 QUICK REFERENCE

## To start the app again later:

### Terminal 1:
```cmd
cd C:\Users\%USERNAME%\Desktop\QA-project-app
.venv\Scripts\activate
python agent_service.py
```

### Terminal 2:
```cmd
cd C:\Users\%USERNAME%\Desktop\QA-project-app\frontend
npm run dev
```

### Then open: http://localhost:5173

