export type AgentKey = 'code_analysis'|'user_story'|'gherkin'|'test_plan'|'playwright'|'execution'|'coverage'|'final_report';

export type AgentState = { 
  key: AgentKey; 
  label: string; 
  state: 'idle'|'running'|'success'|'warn'|'error'; 
  message?: string 
};

export type Coverage = { 
  overall_percentage: number; 
  statements_percentage: number; 
  functions_percentage: number; 
  branches_percentage: number; 
  coverage_collected: boolean; 
  source: 'c8'|'simulated' 
};

export type FileNode = { 
  name: string; 
  path: string; 
  isDir: boolean; 
  children?: FileNode[] 
};

export type Run = { 
  runId: string; 
  status: 'queued'|'running'|'completed'|'failed'; 
  agents: AgentState[]; 
  coverage?: Coverage; 
  files: {path: string; status: 'passed'|'warn'|'error'}[]; 
  artifacts: Record<string, string|object>; 
  errors: string[] 
};

export type UploadedSource = { 
  uploadId: string; 
  root: FileNode 
};

export const AGENTS: { key: AgentKey; label: string }[] = [
  { key: 'code_analysis', label: 'Code Analysis' },
  { key: 'user_story', label: 'User Story Generation' },
  { key: 'gherkin', label: 'Gherkin Scenarios' },
  { key: 'test_plan', label: 'Test Plan Creation' },
  { key: 'playwright', label: 'Playwright Test Generation' },
  { key: 'execution', label: 'Test Execution' },
  { key: 'coverage', label: 'Coverage Analysis' },
  { key: 'final_report', label: 'Final Report' }
];
