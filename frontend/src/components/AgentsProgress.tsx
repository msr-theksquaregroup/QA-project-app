import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { AGENTS } from '@/types';
import type { AgentState } from '@/types';
import { 
  Search, 
  FileText, 
  Code2, 
  ClipboardList, 
  Play, 
  Activity, 
  PieChart, 
  FileCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AgentsProgressProps {
  agents: AgentState[];
  className?: string;
}

const agentIcons = {
  code_analysis: Search,
  user_story: FileText,
  gherkin: Code2,
  test_plan: ClipboardList,
  playwright: Play,
  execution: Activity,
  coverage: PieChart,
  final_report: FileCheck,
};

export function AgentsProgress({ agents, className }: AgentsProgressProps) {
  // Create a map for quick lookup of agent states
  const agentStateMap = new Map(agents.map(agent => [agent.key, agent]));
  const completedCount = agents.filter(a => a.state === 'success').length;
  const runningAgent = agents.find(a => a.state === 'running');
  const progressPercentage = (completedCount / AGENTS.length) * 100;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Analysis Progress</h3>
            <p className="text-slate-600 text-sm">
              {completedCount} of {AGENTS.length} agents completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
            <div className="text-xs text-slate-500 font-medium">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-blue-100 rounded-full h-3 mb-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {runningAgent && (
          <div className="flex items-center text-sm text-blue-600 font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            Currently running: {runningAgent.label}
          </div>
        )}
      </div>

      {/* Agent Steps */}
      <div className="space-y-3">
        {AGENTS.map((agentInfo, index) => {
          const agentState = agentStateMap.get(agentInfo.key);
          const status = agentState?.state || 'idle';
          const message = agentState?.message;
          const Icon = agentIcons[agentInfo.key];
          const isActive = status === 'running';
          const isCompleted = status === 'success';
          const isNext = !isCompleted && !isActive && index > 0 && agentStateMap.get(AGENTS[index - 1].key)?.state === 'success';

          return (
            <div key={agentInfo.key} className="relative">
              {/* Connector Line */}
              {index < AGENTS.length - 1 && (
                <div className={cn(
                  "absolute left-6 top-14 w-0.5 h-8 transition-all duration-300",
                  isCompleted ? "bg-gradient-to-b from-emerald-300 to-emerald-200" : "bg-gradient-to-b from-slate-200 to-slate-100"
                )}></div>
              )}
              
              <div
                className={cn(
                  'relative flex items-center space-x-4 p-5 rounded-2xl border transition-all duration-300 backdrop-blur-sm',
                  isActive && 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60 shadow-lg shadow-blue-100 scale-105',
                  isCompleted && 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/60 shadow-sm',
                  !isActive && !isCompleted && 'bg-white/60 border-slate-200/50 hover:bg-slate-50/80 hover:border-slate-300/50',
                  isNext && 'ring-2 ring-blue-200 ring-opacity-50'
                )}
              >
                {/* Agent Icon */}
                <div className={cn(
                  'relative flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-300',
                  isActive && 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-600 text-white shadow-lg',
                  isCompleted && 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-600 text-white shadow-lg',
                  !isActive && !isCompleted && 'bg-slate-100 border-slate-300 text-slate-500'
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className={cn(
                      'w-6 h-6 transition-transform duration-300',
                      isActive && 'animate-pulse scale-110'
                    )} />
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
                
                {/* Agent Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={cn(
                      'font-semibold text-base transition-colors duration-200',
                      isActive && 'text-blue-800',
                      isCompleted && 'text-emerald-800',
                      !isActive && !isCompleted && 'text-slate-700'
                    )}>
                      {agentInfo.label}
                    </h3>
                    <StatusBadge 
                      status={status} 
                      variant={isActive || isCompleted ? 'gradient' : 'default'}
                      size="sm"
                    />
                  </div>
                  
                  {message && (
                    <p className={cn(
                      'text-sm font-medium transition-colors duration-200',
                      isActive && 'text-blue-700',
                      isCompleted && 'text-emerald-700',
                      !isActive && !isCompleted && 'text-slate-500'
                    )}>
                      {message}
                    </p>
                  )}
                  
                  {/* Progress indicator for active step */}
                  {isActive && (
                    <div className="mt-3">
                      <div className="flex items-center text-xs text-blue-600 font-medium mb-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                        Processing...
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Next Arrow */}
                {isNext && (
                  <div className="flex items-center text-blue-500">
                    <ArrowRight className="w-5 h-5 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}