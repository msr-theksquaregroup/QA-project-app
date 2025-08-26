import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RunsTable } from '@/components/RunsTable';
import { RunsTableSkeleton } from '@/components/SkeletonLoaders';
import { listReports } from '@/lib/api';
import { toast } from 'sonner';
import { 
  Play, 
  RefreshCw, 
  AlertCircle,
  BarChart3,
  Rocket,
  Download
} from 'lucide-react';

export default function Runs() {
  const navigate = useNavigate();
  
  const { 
    data: runs, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['reports'],
    queryFn: listReports,
    refetchInterval: 5000, // Refetch every 5 seconds to get live updates
  });

  const handleViewRun = (runId: string) => {
    navigate(`/runs/${runId}`);
  };

  const handleDownloadReport = (runId: string) => {
    // In a real app, you'd call an API endpoint to download the report
    toast.info('Downloading Report...', {
      description: `Preparing report for run ${runId.substring(0, 8)}...`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast.success('Report Downloaded!', {
        description: 'The test report has been saved to your downloads folder.',
      });
    }, 2000);
    
    console.log('Downloading report for run:', runId);
  };

  const handleStartNewRun = () => {
    navigate('/');
  };

  const completedRuns = runs?.filter(run => run.status === 'completed') || [];
  const runningRuns = runs?.filter(run => run.status === 'running') || [];
  const failedRuns = runs?.filter(run => run.status === 'failed') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Runs</h1>
          <p className="text-muted-foreground">
            View and manage your QA analysis runs
          </p>
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
          <Button onClick={handleStartNewRun}>
            <Play className="h-4 w-4 mr-2" />
            New Run
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {runs && runs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Total Runs</span>
            </div>
            <div className="text-2xl font-bold mt-2">{runs.length}</div>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Completed</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-600">{completedRuns.length}</div>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Running</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-600">{runningRuns.length}</div>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-muted-foreground">Failed</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-red-600">{failedRuns.length}</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <RunsTableSkeleton rows={6} />
      ) : error ? (
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Failed to load runs</h3>
            <p className="text-muted-foreground mb-4">
              {error.message || 'An unexpected error occurred'}
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      ) : !runs || runs.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted/20 mb-6">
              <Rocket className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-3">No test runs yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start your first QA analysis to automatically generate comprehensive test reports and track your progress
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleStartNewRun}>
                <Play className="h-4 w-4 mr-2" />
                Start Your First Run
              </Button>
              <Button variant="outline" onClick={() => navigate('/files')}>
                <Download className="h-4 w-4 mr-2" />
                Upload Files First
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <RunsTable
          runs={runs}
          onViewRun={handleViewRun}
          onDownloadReport={handleDownloadReport}
        />
      )}

      {/* Auto-refresh indicator */}
      {runs && runs.length > 0 && runningRuns.length > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
            <div className="animate-pulse h-2 w-2 bg-blue-500 rounded-full" />
            <span>Auto-refreshing every 5 seconds ({runningRuns.length} active run{runningRuns.length !== 1 ? 's' : ''})</span>
          </div>
        </div>
      )}
    </div>
  );
}
