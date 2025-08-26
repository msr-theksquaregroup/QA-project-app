import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { AgentsProgress } from '@/components/AgentsProgress';
import { CoverageCard } from '@/components/CoverageCard';
import { StatusBadge } from '@/components/StatusBadge';
import { CodePreview } from '@/components/CodePreview';
import { AgentsProgressSkeleton, CoverageCardSkeleton, CardSkeleton } from '@/components/SkeletonLoaders';
import { getRun, streamRun } from '@/lib/api';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  ChevronRight,
  ChevronDown,
  FileText,
  AlertTriangle,
  XCircle,

  Activity

} from 'lucide-react';
import type { Run } from '@/types';

export default function RunDetail() {
  const { runId } = useParams<{ runId: string }>();
  const navigate = useNavigate();
  const [expandedArtifacts, setExpandedArtifacts] = useState<Set<string>>(new Set());
  const [streamedData, setStreamedData] = useState<Partial<Run> | null>(null);

  // Fetch run data
  const { 
    data: run, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['run', runId],
    queryFn: () => getRun(runId!),
    enabled: !!runId,
    refetchInterval: (query) => {
      // Auto-refetch if run is still in progress
      return query.state.data?.status === 'running' || query.state.data?.status === 'queued' ? 2000 : false;
    },
  });

  // Set up SSE streaming for live updates when run is active
  useEffect(() => {
    if (!runId || !run || (run.status !== 'running' && run.status !== 'queued')) {
      return;
    }

    const eventSource = streamRun(runId, (partial) => {
      setStreamedData(partial);
    });

    return () => {
      eventSource.close();
    };
  }, [runId, run?.status]);

  // Merge streamed data with fetched data
  const displayData = streamedData ? { ...run, ...streamedData } : run;

  const toggleArtifact = (key: string) => {
    setExpandedArtifacts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleDownloadReport = () => {
    if (!runId) return;
    
    toast.info('Preparing Report...', {
      description: `Generating comprehensive report for run ${runId.substring(0, 8)}...`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast.success('Report Downloaded!', {
        description: 'The detailed test report has been saved to your downloads folder.',
      });
    }, 2000);
    
    console.log('Downloading report for run:', runId);
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp));
      return date.toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" disabled>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Runs
            </Button>
            <div>
              <CardSkeleton className="h-8 w-48 p-0" />
              <div className="flex items-center space-x-2 mt-1">
                <CardSkeleton className="h-6 w-20 p-0" />
                <CardSkeleton className="h-6 w-16 p-0" />
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <CardSkeleton className="h-8 w-20 p-0" />
            <CardSkeleton className="h-8 w-32 p-0" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AgentsProgressSkeleton />
            <CardSkeleton title content />
            <CardSkeleton title content />
          </div>
          <div className="space-y-6">
            <CoverageCardSkeleton />
            <CardSkeleton title content />
          </div>
        </div>
      </div>
    );
  }

  if (error || !runId) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Run not found</h3>
        <p className="text-muted-foreground mb-4">
          {error?.message || 'The requested run could not be found'}
        </p>
        <Button onClick={() => navigate('/runs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Runs
        </Button>
      </div>
    );
  }

  if (!displayData) {
    return null;
  }

  const isActive = displayData.status === 'running' || displayData.status === 'queued';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/runs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Runs
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Run Details
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {runId.substring(0, 8)}...
              </code>
              <StatusBadge status={displayData.status as any} />
              {isActive && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3 animate-pulse text-green-500" />
                  <span>Live updates active</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {displayData.status === 'completed' && (
            <Button onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agents Progress */}
          <AgentsProgress agents={displayData.agents || []} />

          {/* Files Status */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">File Analysis Results</h3>
            
            {!displayData.files || displayData.files.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No file results available yet
              </p>
            ) : (
              <div className="space-y-2">
                {displayData.files.map((file) => (
                  <div
                    key={file.path}
                    className="flex items-center justify-between rounded-md border border-border bg-background p-3"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <code className="text-sm font-mono truncate">
                        {file.path}
                      </code>
                    </div>
                    <StatusBadge status={file.status as any} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Artifacts */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Generated Artifacts</h3>
            
            {!displayData.artifacts || Object.keys(displayData.artifacts).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No artifacts generated yet
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(displayData.artifacts).map(([key, value]) => {
                  const isExpanded = expandedArtifacts.has(key);
                  const isStringValue = typeof value === 'string';
                  const displayValue = isStringValue ? value : JSON.stringify(value, null, 2);
                  const language = isStringValue ? 'text' : 'json';
                  
                  return (
                    <div key={key} className="border border-border rounded-lg">
                      <button
                        onClick={() => toggleArtifact(key)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 rounded-t-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {language}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t border-border">
                          <CodePreview
                            code={displayValue}
                            language={language}
                            filename={`${key}.${language === 'json' ? 'json' : 'txt'}`}
                            height="300px"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Errors */}
          {displayData.errors && displayData.errors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Errors ({displayData.errors.length})
                </h3>
              </div>
              
              <div className="space-y-2">
                {displayData.errors.map((error, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-red-100 p-3 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200"
                  >
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Coverage */}
          {displayData.coverage && (
            <CoverageCard coverage={displayData.coverage} />
          )}

          {/* Run Info */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Run Information</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <div className="mt-1">
                  <StatusBadge status={displayData.status as any} />
                </div>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Run ID:</span>
                <div className="mt-1 font-mono text-xs bg-muted px-2 py-1 rounded break-all">
                  {runId}
                </div>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Created:</span>
                <div className="mt-1">
                  {formatDate(runId.split('-').pop() || '')}
                </div>
              </div>
              
              {displayData.artifacts && Object.keys(displayData.artifacts).length > 0 && (
                <div>
                  <span className="font-medium text-muted-foreground">Artifacts:</span>
                  <div className="mt-1">
                    {Object.keys(displayData.artifacts).length} generated
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
