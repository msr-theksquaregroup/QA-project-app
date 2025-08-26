
import { Button } from '@/components/ui/button';
import { AgentsProgress } from '@/components/AgentsProgress';
import { CoverageCard } from '@/components/CoverageCard';

import { useAppStore } from '@/lib/store';
import { startRun } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Play, 
  Settings, 
  FileText, 
  CheckCircle,
  Upload,
  Zap,
  TrendingUp,
  Clock,
  Target,
  Star,
  ArrowRight,
  Sparkles,
  BarChart3,
  Activity
} from 'lucide-react';
import type { AgentState, Coverage } from '@/types';

// Placeholder data for demo
const placeholderAgents: AgentState[] = [
  { key: 'code_analysis', label: 'Code Analysis', state: 'idle' },
  { key: 'user_story', label: 'User Story Generation', state: 'idle' },
  { key: 'gherkin', label: 'Gherkin Scenarios', state: 'idle' },
  { key: 'test_plan', label: 'Test Plan Creation', state: 'idle' },
  { key: 'playwright', label: 'Playwright Test Generation', state: 'idle' },
  { key: 'execution', label: 'Test Execution', state: 'idle' },
  { key: 'coverage', label: 'Coverage Analysis', state: 'idle' },
  { key: 'final_report', label: 'Final Report', state: 'idle' },
];

const placeholderCoverage: Coverage = {
  overall_percentage: 0,
  statements_percentage: 0,
  functions_percentage: 0,
  branches_percentage: 0,
  coverage_collected: false,
  source: 'simulated'
};

export default function Dashboard() {
  const { 
    selectedPaths, 
    useNotebook, 
    setUseNotebook, 
    lastRunId, 
    setLastRunId 
  } = useAppStore();

  const startRunMutation = useMutation({
    mutationFn: startRun,
    onSuccess: (data) => {
      setLastRunId(data.runId);
      toast.success('QA Analysis started successfully!', {
        description: `Run ID: ${data.runId.slice(-8)}`,
      });
    },
    onError: (error) => {
      toast.error('Failed to start QA analysis', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    },
  });

  const handleStartRun = () => {
    if (selectedPaths.length === 0) {
      toast.error('No files selected', {
        description: 'Please select files to analyze first.',
      });
      return;
    }

    startRunMutation.mutate({
      paths: selectedPaths,
      use_notebook: useNotebook,
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl"></div>
        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Welcome to Quality Engineering
                  </h1>
                  <p className="text-slate-600 font-medium">Intelligent automated testing and analysis platform</p>
                </div>
              </div>
              <p className="text-slate-500 text-lg max-w-2xl">
                Transform your codebase with AI-powered quality analysis. Upload your files, run comprehensive tests, 
                and get detailed insights to improve your code quality.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                onClick={handleStartRun}
                disabled={selectedPaths.length === 0 || startRunMutation.isPending}
              >
                {startRunMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start QA Analysis
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-200 hover:bg-slate-50 px-8"
              >
                <Settings className="h-5 w-5 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{selectedPaths.length}</p>
              <p className="text-slate-500 text-sm font-medium">Selected Files</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">87.5%</p>
              <p className="text-slate-500 text-sm font-medium">Last Coverage</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <Star className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">24</p>
              <p className="text-slate-500 text-sm font-medium">Total Runs</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <Target className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">2.4m</p>
              <p className="text-slate-500 text-sm font-medium">Avg Runtime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Analysis Configuration</h2>
            <p className="text-slate-500">Configure your QA analysis settings and preferences</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notebook Version Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700">Notebook Version</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUseNotebook(18)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  useNotebook === 18
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">18</div>
                  <div className="text-sm font-medium">Classic</div>
                </div>
                {useNotebook === 18 && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
              
              <button
                onClick={() => setUseNotebook(24)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  useNotebook === 24
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">24</div>
                  <div className="text-sm font-medium">Enhanced</div>
                </div>
                {useNotebook === 24 && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Selected Files Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700">Selected Files</h3>
            {selectedPaths.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedPaths.slice(0, 5).map((path, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-600 truncate">{path}</span>
                  </div>
                ))}
                {selectedPaths.length > 5 && (
                  <div className="text-sm text-slate-500 text-center py-2">
                    And {selectedPaths.length - 5} more files...
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Upload className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="font-medium">No files selected</p>
                <p className="text-sm">Go to Files tab to upload and select files for analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Progress and Results */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Agents Progress */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Analysis Progress</h2>
              <p className="text-slate-500">Real-time status of QA analysis agents</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
          <AgentsProgress agents={placeholderAgents} />
        </div>

        {/* Coverage Results */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Coverage Analysis</h2>
              <p className="text-slate-500">Test coverage metrics and insights</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <CoverageCard coverage={placeholderCoverage} />
        </div>
      </div>

      {/* Quick Actions */}
      {lastRunId && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">Latest Run Available</h3>
              <p className="text-slate-600">
                Run ID: <span className="font-mono text-sm bg-white px-2 py-1 rounded">{lastRunId.slice(-12)}</span>
              </p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => window.location.href = `/runs/${lastRunId}`}
            >
              View Results
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}