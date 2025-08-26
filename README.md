# KS-QE Platform

A sophisticated Quality Engineering platform built with React, TypeScript, and FastAPI. This platform provides AI-powered automated testing, code analysis, and comprehensive quality assessment tools.

![KS-QE Platform](https://img.shields.io/badge/Status-Active-brightgreen) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### ✨ Frontend (React + TypeScript)
- **Modern UI/UX**: Sophisticated glassmorphism design with gradient backgrounds
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Server-Sent Events for live progress tracking
- **File Management**: Drag-and-drop file uploads with ZIP and URL support
- **Interactive Dashboards**: Beautiful charts and progress indicators
- **State Management**: Zustand for global state, TanStack Query for server state
- **Code Preview**: Monaco Editor integration for syntax highlighting

### 🔧 Backend (FastAPI + Python)
- **RESTful API**: Comprehensive endpoints for all operations
- **File Processing**: ZIP extraction and URL downloading
- **Analysis Engine**: 8-step QA analysis workflow with mock agents
- **Real-time Streaming**: SSE support for live progress updates
- **Coverage Analysis**: Test coverage metrics and reporting
- **Artifact Storage**: Secure file storage and retrieval

### 📊 Quality Analysis Workflow
1. **Code Analysis** - Static code analysis and structure review
2. **User Story Generation** - Automated user story creation
3. **Gherkin Scenarios** - BDD scenario generation
4. **Test Plan Creation** - Comprehensive test planning
5. **Playwright Test Generation** - Automated E2E test creation
6. **Test Execution** - Running generated tests
7. **Coverage Analysis** - Code coverage assessment
8. **Final Report** - Consolidated quality report

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3 with custom animations
- **UI Components**: shadcn/ui with Lucide React icons
- **State Management**: Zustand + TanStack React Query
- **Routing**: React Router v6
- **Code Editor**: Monaco Editor
- **File Upload**: react-dropzone
- **Notifications**: sonner for toast messages

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **Server**: Uvicorn ASGI server
- **Data Validation**: Pydantic v2
- **File Handling**: aiofiles, python-multipart
- **HTTP Client**: requests
- **Environment**: python-dotenv
- **CORS**: Enabled for frontend integration

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Python** (v3.9 or higher)
- **pip** (Python package manager)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd QA-project-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at:
- **API Server**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will be available at:
- **Frontend**: http://localhost:5173

## 📁 Project Structure

```
QA-project-app/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── AppShell.tsx # Main layout component
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── AgentsProgress.tsx
│   │   │   ├── CoverageCard.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   ├── FileTree.tsx
│   │   │   ├── CodePreview.tsx
│   │   │   └── RunsTable.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Files.tsx
│   │   │   ├── TestCases.tsx
│   │   │   ├── Runs.tsx
│   │   │   └── RunDetail.tsx
│   │   ├── lib/             # Utilities and configuration
│   │   │   ├── api.ts       # API client functions
│   │   │   ├── store.ts     # Zustand store
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.ts
│   └── .env.example
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── models.py        # Pydantic data models
│   │   ├── storage.py       # File storage management
│   │   ├── runner.py        # Analysis workflow runner
│   │   └── notebook24_adapter.py # Analysis engine adapter
│   ├── uploads/             # File upload storage
│   ├── runs/                # Analysis run storage
│   ├── requirements.txt
│   └── README.md
├── notebook/                 # Jupyter notebooks
│   └── notebook_24.ipynb   # QA analysis notebook
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_BASE=http://localhost:8000
```

#### Backend
The backend uses environment variables for configuration. Create a `.env` file in the backend directory if needed:
```env
# Add any backend-specific environment variables here
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/upload-zip` | Upload ZIP file |
| POST | `/api/upload-url` | Upload from URL |
| GET | `/api/files` | List uploaded files |
| GET | `/api/file?path=...` | Get file content |
| POST | `/api/run` | Start QA analysis |
| GET | `/api/run/{runId}` | Get run details |
| GET | `/api/run/{runId}/stream` | Stream run progress (SSE) |
| GET | `/api/reports` | List analysis reports |

## 🎨 UI/UX Features

### Design System
- **Glassmorphism Effects**: Translucent components with backdrop blur
- **Gradient Backgrounds**: Beautiful color transitions
- **Sophisticated Shadows**: Multi-layered shadow effects
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Layout**: Mobile-first design approach
- **Dark Mode Ready**: CSS variable-based theming

### Interactive Components
- **File Tree**: Collapsible tree with tri-state checkboxes
- **Progress Stepper**: Visual workflow progress indicator
- **Coverage Charts**: Interactive coverage metrics display
- **Real-time Updates**: Live progress via Server-Sent Events
- **Toast Notifications**: User feedback for actions
- **Loading States**: Skeleton loaders for better UX

## 🧪 Development

### Frontend Development
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Backend Development
```bash
cd backend

# Activate virtual environment
source .venv/bin/activate

# Start with hot reload
uvicorn app.main:app --reload --port 8000

# Run with specific host
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --port 8000
```

## 📊 Architecture

### Frontend Architecture
- **Component-Based**: Modular React components
- **State Management**: Global state with Zustand, server state with TanStack Query
- **Type Safety**: Full TypeScript coverage
- **API Layer**: Centralized API client with error handling
- **Routing**: File-based routing with React Router

### Backend Architecture
- **Microservice Ready**: Modular FastAPI structure
- **Data Models**: Pydantic for validation and serialization
- **Storage Layer**: File system-based storage with future database support
- **Analysis Engine**: Plugin-based analysis workflow
- **Real-time Communication**: SSE for live updates

## 🔒 Security

- **CORS Configuration**: Proper cross-origin resource sharing
- **File Validation**: Secure file upload and processing
- **Path Sanitization**: Prevents directory traversal attacks
- **Error Handling**: Secure error messages without information leakage

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your static hosting service
```

### Backend Deployment
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript/Python best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all linting passes

## 📝 API Documentation

The backend provides interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐛 Troubleshooting

### Common Issues

#### CSS Not Loading
```bash
cd frontend
npm install tailwindcss-animate
rm -rf node_modules/.vite
npm run dev
```

#### Backend Import Errors
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

#### Port Already in Use
```bash
# Check what's running on port
lsof -i :5173  # Frontend
lsof -i :8000  # Backend

# Kill the process
kill -9 <PID>
```

### Development Tips
- Use browser dev tools to debug frontend issues
- Check browser console for JavaScript errors
- Monitor network tab for API request/response issues
- Use FastAPI's automatic docs for API testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **FastAPI** for the high-performance Python framework
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for beautiful, accessible components
- **Lucide** for the comprehensive icon library

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Happy Coding! 🚀**
