import type { UploadedSource, FileNode, Run } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const AGENT_API_BASE = import.meta.env.VITE_AGENT_API_BASE || 'http://localhost:8001';

class ApiError extends Error {
  public status: number;
  public response?: any;

  constructor(status: number, message: string, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorData;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        errorMessage = await response.text() || errorMessage;
      }
    } catch {
      // If we can't parse the error response, use the default message
    }
    
    throw new ApiError(response.status, errorMessage, errorData);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  
  return response.text() as unknown as T;
}

export async function uploadZip(file: File): Promise<UploadedSource> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE}/api/upload-zip`, {
    method: 'POST',
    body: formData,
  });
  
  return handleResponse<UploadedSource>(response);
}

export async function uploadByUrl(url: string): Promise<UploadedSource> {
  const response = await fetch(`${API_BASE}/api/upload-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  return handleResponse<UploadedSource>(response);
}

export async function listFiles(): Promise<FileNode> {
  const response = await fetch(`${API_BASE}/api/files`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<FileNode>(response);
}

export async function getFileContent(path: string): Promise<string> {
  const response = await fetch(`${API_BASE}/api/file?path=${encodeURIComponent(path)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await handleResponse<{ content: string; path: string }>(response);
  return data.content;
}

export async function startRun(payload: {
  paths: string[];
  agentMode: 'all';
  customTests?: string;
}): Promise<{ runId: string }> {
  const response = await fetch(`${API_BASE}/api/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  return handleResponse<{ runId: string }>(response);
}

export async function getRun(runId: string): Promise<Run> {
  const response = await fetch(`${API_BASE}/api/run/${runId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<Run>(response);
}

export function streamRun(
  runId: string,
  onEvent: (partial: Partial<Run>) => void
): EventSource {
  const eventSource = new EventSource(`${API_BASE}/api/run/${runId}/stream`);
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onEvent(data);
    } catch (error) {
      console.error('Failed to parse SSE event data:', error);
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error);
  };
  
  return eventSource;
}

export async function listReports(): Promise<Array<Pick<Run, 'runId' | 'status' | 'coverage'>>> {
  const response = await fetch(`${API_BASE}/api/reports`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<Array<Pick<Run, 'runId' | 'status' | 'coverage'>>>(response);
}

// Agent Service API Functions
export async function startAgentAnalysis(payload: {
  code: string;
  filename: string;
  subfolder_path?: string;
}): Promise<{ run_id: string; status: string; files_count?: number }> {
  const response = await fetch(`${AGENT_API_BASE}/api/start-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  return handleResponse<{ run_id: string; status: string; files_count?: number }>(response);
}

export async function uploadFilesToAgent(files: File[]): Promise<{
  status: string;
  files_uploaded: number;
  files: Array<{ name: string; content: string; size: number }>;
}> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  
  const response = await fetch(`${AGENT_API_BASE}/api/upload-files`, {
    method: 'POST',
    body: formData,
  });
  
  return handleResponse(response);
}

export async function analyzeUploadedFiles(files: Array<{ name: string; content: string; size: number }>): Promise<{ run_id: string; status: string; files_count: number }> {
  const response = await fetch(`${AGENT_API_BASE}/api/start-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: files,
      subfolder_path: 'uploaded'
    }),
  });
  
  return handleResponse(response);
}

export async function getAgentRunStatus(runId: string): Promise<{
  run_id: string;
  status: string;
  errors: string[];
  artifacts: string[];
  analysis: any;
  user_story: string;
  processing_timestamp: string;
}> {
  const response = await fetch(`${AGENT_API_BASE}/api/run/${runId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse(response);
}

export function connectToAgentWebSocket(
  runId: string,
  onMessage: (data: any) => void,
  onError?: (error: Event) => void,
  onClose?: (event: CloseEvent) => void
): WebSocket {
  const wsUrl = `${AGENT_API_BASE.replace('http', 'ws')}/ws/${runId}`;
  const ws = new WebSocket(wsUrl);
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };
  
  ws.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
    if (onClose) onClose(event);
  };
  
  return ws;
}

// Export the ApiError class for use in components
export { ApiError };
