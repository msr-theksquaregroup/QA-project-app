import type { UploadedSource, FileNode, Run } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

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
  
  const response = await fetch(`${API_BASE}/upload/zip`, {
    method: 'POST',
    body: formData,
  });
  
  return handleResponse<UploadedSource>(response);
}

export async function uploadByUrl(url: string): Promise<UploadedSource> {
  const response = await fetch(`${API_BASE}/upload/url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  return handleResponse<UploadedSource>(response);
}

export async function listFiles(): Promise<FileNode> {
  const response = await fetch(`${API_BASE}/files`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<FileNode>(response);
}

export async function getFileContent(path: string): Promise<string> {
  const response = await fetch(`${API_BASE}/files/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path }),
  });
  
  return handleResponse<string>(response);
}

export async function startRun(payload: {
  paths: string[];
  use_notebook: 18 | 24;
  customTests?: string;
}): Promise<{ runId: string }> {
  const response = await fetch(`${API_BASE}/run/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  return handleResponse<{ runId: string }>(response);
}

export async function getRun(runId: string): Promise<Run> {
  const response = await fetch(`${API_BASE}/run/${runId}`, {
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
  const eventSource = new EventSource(`${API_BASE}/run/${runId}/stream`);
  
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
  const response = await fetch(`${API_BASE}/reports`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<Array<Pick<Run, 'runId' | 'status' | 'coverage'>>>(response);
}

// Export the ApiError class for use in components
export { ApiError };
