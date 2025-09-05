import { create } from 'zustand';

interface AppStore {
  // Selected paths state
  selectedPaths: string[];
  addPath: (path: string) => void;
  removePath: (path: string) => void;
  togglePath: (path: string) => void;
  clearPaths: () => void;
  
  // Agent workflow mode (always ALL agents)
  agentMode: 'all';
  setAgentMode: (mode: 'all') => void;
  
  // Last run ID state
  lastRunId?: string;
  setLastRunId: (runId: string | undefined) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Selected paths initial state and actions
  selectedPaths: [],
  
  addPath: (path: string) => set((state) => ({
    selectedPaths: state.selectedPaths.includes(path) 
      ? state.selectedPaths 
      : [...state.selectedPaths, path]
  })),
  
  removePath: (path: string) => set((state) => ({
    selectedPaths: state.selectedPaths.filter(p => p !== path)
  })),
  
  togglePath: (path: string) => set((state) => ({
    selectedPaths: state.selectedPaths.includes(path)
      ? state.selectedPaths.filter(p => p !== path)
      : [...state.selectedPaths, path]
  })),
  
  clearPaths: () => set({ selectedPaths: [] }),
  
  // Agent workflow mode initial state and actions
  agentMode: 'all',
  
  setAgentMode: (mode: 'all') => set({ agentMode: mode }),
  
  // Last run ID initial state and actions
  lastRunId: undefined,
  
  setLastRunId: (runId: string | undefined) => set({ lastRunId: runId }),
}));
