"""
Pydantic models for the QA platform API.
These models match the frontend TypeScript types exactly.
"""

from typing import Dict, List, Optional, Union, Literal, Any
from pydantic import BaseModel, Field
from datetime import datetime
import uuid


# AgentKey type matching frontend
AgentKey = Literal[
    "code_analysis", "user_story", "gherkin", 
    "test_plan", "playwright", "execution", 
    "coverage", "final_report"
]


class AgentState(BaseModel):
    """Represents the state of a single QA agent."""
    key: AgentKey
    label: str
    state: Literal["idle", "running", "success", "warn", "error"]
    message: Optional[str] = None


class Coverage(BaseModel):
    """Test coverage information."""
    overall_percentage: float
    statements_percentage: float
    functions_percentage: float
    branches_percentage: float
    coverage_collected: bool
    source: Literal["c8", "simulated"]


class FileNode(BaseModel):
    """Represents a file or directory in the project structure."""
    name: str
    path: str
    isDir: bool
    children: Optional[List["FileNode"]] = None


class FileStatus(BaseModel):
    """Status of a file in a test run - matches frontend files array item."""
    path: str
    status: Literal["passed", "warn", "error"]


class Run(BaseModel):
    """Complete test run information - matches frontend Run type exactly."""
    runId: str
    status: Literal["queued", "running", "completed", "failed"]
    agents: List[AgentState] = Field(default_factory=list)
    coverage: Optional[Coverage] = None
    files: List[FileStatus] = Field(default_factory=list)
    artifacts: Dict[str, Union[str, Any]] = Field(default_factory=dict)  # object -> Any for flexibility
    errors: List[str] = Field(default_factory=list)


class UploadedSource(BaseModel):
    """Information about uploaded source code."""
    uploadId: str
    root: FileNode


# AGENTS constant matching frontend
AGENTS = [
    {"key": "code_analysis", "label": "Code Analysis"},
    {"key": "user_story", "label": "User Story Generation"},
    {"key": "gherkin", "label": "Gherkin Scenarios"},
    {"key": "test_plan", "label": "Test Plan Creation"},
    {"key": "playwright", "label": "Playwright Test Generation"},
    {"key": "execution", "label": "Test Execution"},
    {"key": "coverage", "label": "Coverage Analysis"},
    {"key": "final_report", "label": "Final Report"},
]


# Request Models

class UploadByUrlRequest(BaseModel):
    """Request to upload source code from a URL."""
    url: str


class StartRunRequest(BaseModel):
    """Request to start a new QA analysis run."""
    paths: List[str]
    use_notebook: Literal[18, 24] = 24
    customTests: Optional[str] = None


class GetFileContentRequest(BaseModel):
    """Request to get the content of a specific file."""
    path: str


# Response Models

class StartRunResponse(BaseModel):
    """Response when starting a new run."""
    runId: str


class RunSummary(BaseModel):
    """Summary information for listing runs - for /reports endpoint."""
    runId: str
    status: Literal["queued", "running", "completed", "failed"]
    coverage: Optional[Coverage] = None


class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str
    message: str
    details: Optional[Dict] = None


class SuccessResponse(BaseModel):
    """Standard success response."""
    message: str
    data: Optional[Dict] = None


# Utility functions
def generate_run_id() -> str:
    """Generate a unique run ID with timestamp."""
    timestamp = int(datetime.utcnow().timestamp() * 1000)  # milliseconds
    unique_id = str(uuid.uuid4())[:8]
    return f"run-{unique_id}-{timestamp}"


def generate_upload_id() -> str:
    """Generate a unique upload ID."""
    timestamp = int(datetime.utcnow().timestamp() * 1000)  # milliseconds
    unique_id = str(uuid.uuid4())[:8]
    return f"upload-{unique_id}-{timestamp}"
