import { create } from 'zustand';

interface AppStore {
  // Selected paths state
  selectedPaths: string[];
  addPath: (path: string) => void;
  removePath: (path: string) => void;
  togglePath: (path: string) => void;
  clearPaths: () => void;
  
  // Notebook version state
  useNotebook: 18 | 24;
  setUseNotebook: (version: 18 | 24) => void;
  
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
  
  // Notebook version initial state and actions
  useNotebook: 24,
  
  setUseNotebook: (version: 18 | 24) => set({ useNotebook: version }),
  
  // Last run ID initial state and actions
  lastRunId: undefined,
  
  setLastRunId: (runId: string | undefined) => set({ lastRunId: runId }),
}));
