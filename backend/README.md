# QA Analysis Platform - Backend

FastAPI backend for the QA Analysis Platform.

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start Server

```bash
uvicorn app.main:app --reload --port 8000
```

The server will start on http://localhost:8000

### 3. API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### File Management
- `POST /api/upload-zip` - Upload ZIP file
- `POST /api/upload-url` - Upload from URL  
- `GET /api/files` - Get latest file tree
- `GET /api/file?path=...` - Get file content

### QA Analysis
- `POST /api/run` - Start analysis run
- `GET /api/run/{runId}` - Get run details
- `GET /api/run/{runId}/stream` - Stream run progress (SSE)

### Reporting
- `GET /api/reports` - List last 20 runs

### Health
- `GET /health` - Health check

## Features

✅ **Real-time Progress**: Server-Sent Events for live run updates  
✅ **File Upload**: ZIP files and URL downloads  
✅ **Mock QA Analysis**: 8-step agent workflow simulation  
✅ **Persistent Storage**: Run history and artifacts  
✅ **CORS Enabled**: Frontend integration ready  

## Development

The backend includes:
- Mock QA analysis with 8 agents
- Real-time event streaming
- File upload and management
- Run history and reporting
- Comprehensive error handling

All endpoints return mock data that matches frontend TypeScript types exactly.