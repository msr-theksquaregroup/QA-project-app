"""
FastAPI application for the QA Analysis Platform.
"""

import os
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import json
import asyncio
from datetime import datetime

from .models import (
    UploadedSource, FileNode, Run, RunSummary, StartRunRequest, StartRunResponse,
    UploadByUrlRequest, GetFileContentRequest, ErrorResponse, SuccessResponse, generate_run_id
)
from .storage import storage_manager
from .runner import run_manager


# Create FastAPI app
app = FastAPI(
    title="QA Analysis Platform API",
    description="Backend API for the QA Analysis Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


# File upload endpoints
@app.post("/api/upload-zip")
async def upload_zip_file(file: UploadFile = File(...)):
    """
    Upload a ZIP file and extract its contents using save_zip.
    
    Returns the upload ID and file tree structure.
    """
    try:
        # Validate file type
        if not file.filename or not file.filename.lower().endswith('.zip'):
            raise HTTPException(
                status_code=400, 
                detail="Only ZIP files are allowed"
            )
        
        # Read file content
        content = await file.read()
        
        if len(content) == 0:
            raise HTTPException(
                status_code=400,
                detail="Empty file uploaded"
            )
        
        # Use save_zip function
        upload_id, file_tree = await storage_manager.save_zip(content, file.filename)
        
        return {
            "uploadId": upload_id,
            "root": file_tree.model_dump()
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.post("/api/upload-url")
async def upload_from_url(request: UploadByUrlRequest):
    """
    Upload source code from a URL using save_url.
    
    Returns the upload ID and file tree structure.
    """
    try:
        # Validate URL
        if not request.url.startswith(('http://', 'https://')):
            raise HTTPException(
                status_code=400,
                detail="Invalid URL format"
            )
        
        # Use save_url function
        upload_id, file_tree = await storage_manager.save_url(request.url)
        
        return {
            "uploadId": upload_id,
            "root": file_tree.model_dump()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL upload failed: {str(e)}")


# File management endpoints
@app.get("/api/files")
async def list_files():
    """
    Get the file tree of the latest upload.
    
    Returns the FileNode structure of the most recent upload.
    """
    try:
        # Get the most recent upload directory
        uploads_dir = storage_manager.uploads_dir
        if not uploads_dir.exists():
            raise HTTPException(
                status_code=404,
                detail="No files uploaded yet"
            )
        
        # Find the latest upload (by directory name which contains timestamp)
        upload_dirs = [d for d in uploads_dir.iterdir() if d.is_dir()]
        if not upload_dirs:
            raise HTTPException(
                status_code=404,
                detail="No uploads found"
            )
        
        # Sort by name (which contains timestamp) to get latest
        latest_upload = sorted(upload_dirs, key=lambda x: x.name)[-1]
        latest_upload_id = latest_upload.name
        
        # Build file tree for the latest upload
        file_tree = storage_manager.build_tree(latest_upload, latest_upload_id)
        
        return file_tree.model_dump()
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list files: {str(e)}")


@app.get("/api/file")
async def get_file_content(path: str = Query(..., description="File path to read")):
    """
    Get the content of a specific file.
    
    Returns the file content as a string.
    """
    try:
        content = await storage_manager.read_file(path)
        return {"content": content, "path": path}
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"File not found: {path}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read file: {str(e)}")


# QA Analysis endpoints
@app.post("/api/run")
async def start_analysis_run(request: StartRunRequest):
    """
    Start a new QA analysis run using start_run.
    
    Returns the run ID for tracking progress.
    """
    try:
        # Validate request
        if not request.paths:
            raise HTTPException(
                status_code=400,
                detail="At least one file path must be provided"
            )
        
        # Generate run ID and start the run
        run_id = generate_run_id()
        returned_run_id = run_manager.start_run(
            run_id=run_id,
            paths=request.paths,
            use_notebook=request.use_notebook
        )
        
        return {"runId": returned_run_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start run: {str(e)}")


@app.get("/api/run/{run_id}")
async def get_run_details(run_id: str):
    """
    Get detailed information about a specific run.
    
    Returns complete run information including agents, coverage, files, and artifacts.
    """
    try:
        run = await run_manager.get_run(run_id)
        
        if not run:
            raise HTTPException(status_code=404, detail="Run not found")
        
        return run.model_dump()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get run: {str(e)}")


@app.get("/api/run/{run_id}/stream")
async def stream_run_progress(run_id: str):
    """
    Stream real-time updates for a running analysis using event_stream.
    
    Returns Server-Sent Events with run progress updates.
    """
    try:
        return StreamingResponse(
            run_manager.event_stream(run_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stream run: {str(e)}")


# Reporting endpoints
@app.get("/api/reports")
async def list_reports():
    """
    List last 20 analysis runs with summary information.
    
    Returns a list of run summaries sorted by creation date (newest first).
    """
    try:
        runs = await run_manager.list_runs()
        
        # Limit to last 20 runs (already sorted by runId which contains timestamp)
        recent_runs = runs[:20]
        
        # Convert to summaries
        summaries = [
            {
                "runId": run.runId,
                "status": run.status,
                "coverage": run.coverage.model_dump() if run.coverage else None
            }
            for run in recent_runs
        ]
        
        return summaries
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list reports: {str(e)}")


@app.delete("/run/{run_id}")
async def cancel_run(run_id: str):
    """
    Cancel a running analysis.
    
    Returns success status.
    """
    try:
        success = await run_manager.cancel_run(run_id)
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail="Run not found or not cancellable"
            )
        
        return SuccessResponse(message="Run cancelled successfully")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cancel run: {str(e)}")


# Utility endpoints
@app.get("/status")
async def get_system_status():
    """Get system status and statistics."""
    try:
        active_runs = len([r for r in run_manager.active_runs.values()])
        completed_runs = len([r for r in run_manager.completed_runs.values()])
        
        return {
            "status": "operational",
            "active_runs": active_runs,
            "completed_runs": completed_runs,
            "uptime": "N/A",  # Would track actual uptime in production
            "version": "1.0.0"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}")


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors."""
    return JSONResponse(
        status_code=404,
        content=ErrorResponse(
            error="Not Found",
            message="The requested resource was not found"
        ).dict()
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Handle internal server errors."""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal Server Error",
            message="An unexpected error occurred"
        ).dict()
    )


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup."""
    print("🚀 QA Analysis Platform API starting up...")
    print(f"📁 Uploads directory: {storage_manager.uploads_dir}")
    print(f"🏃 Runs directory: {storage_manager.runs_dir}")
    print("✅ API ready to receive requests")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown."""
    print("🛑 QA Analysis Platform API shutting down...")
    
    # Cancel any active runs
    for run_id in list(run_manager.run_tasks.keys()):
        await run_manager.cancel_run(run_id)
    
    print("✅ Shutdown complete")


if __name__ == "__main__":
    import uvicorn
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
