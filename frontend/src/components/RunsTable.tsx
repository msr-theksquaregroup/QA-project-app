import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import type { Run } from '@/types';
import { 
  Eye, 
  Download, 
  Calendar, 
  Clock,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface RunsTableProps {
  runs: Array<Pick<Run, 'runId' | 'status' | 'coverage'>>;
  onViewRun?: (runId: string) => void;
  onDownloadReport?: (runId: string) => void;
  className?: string;
}

type SortField = 'runId' | 'status' | 'coverage';
type SortDirection = 'asc' | 'desc';

export function RunsTable({ 
  runs, 
  onViewRun, 
  onDownloadReport, 
  className 
}: RunsTableProps) {
  const [sortField, setSortField] = useState<SortField>('runId');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedRuns = [...runs].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'runId':
        aValue = a.runId;
        bValue = b.runId;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'coverage':
        aValue = a.coverage?.overall_percentage || 0;
        bValue = b.coverage?.overall_percentage || 0;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const formatRunId = (runId: string) => {
    // Extract timestamp if runId contains it, otherwise just show first 8 chars
    if (runId.includes('-')) {
      const parts = runId.split('-');
      const timestamp = parts[parts.length - 1];
      if (/^\d{8,}$/.test(timestamp)) {
        const date = new Date(parseInt(timestamp));
        if (!isNaN(date.getTime())) {
          return {
            short: runId.substring(0, 8),
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
      }
    }
    return {
      short: runId.substring(0, 8),
      date: 'Unknown',
      time: 'Unknown'
    };
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Test Runs</h3>
        <span className="text-sm text-muted-foreground">
          {runs.length} {runs.length === 1 ? 'run' : 'runs'}
        </span>
      </div>

      {runs.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No test runs found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start your first test run to see results here
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('runId')}
                      className="flex items-center space-x-2 font-medium hover:text-foreground"
                    >
                      <span>Run ID</span>
                      <SortIcon field="runId" />
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center space-x-2 font-medium hover:text-foreground"
                    >
                      <span>Status</span>
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('coverage')}
                      className="flex items-center space-x-2 font-medium hover:text-foreground"
                    >
                      <span>Coverage</span>
                      <SortIcon field="coverage" />
                    </button>
                  </th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedRuns.map((run) => {
                  const runInfo = formatRunId(run.runId);
                  const coveragePercentage = run.coverage?.overall_percentage;
                  
                  return (
                    <tr
                      key={run.runId}
                      className="border-b border-border last:border-b-0 hover:bg-muted/20"
                    >
                      <td className="p-4">
                        <div>
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {runInfo.short}...
                          </code>
                          <p className="text-xs text-muted-foreground mt-1">
                            {run.runId}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={run.status as any} />
                      </td>
                      <td className="p-4">
                        {coveragePercentage !== undefined ? (
                          <div className="flex items-center space-x-2">
                            <span className={cn(
                              'font-medium',
                              coveragePercentage >= 80 && 'text-green-600',
                              coveragePercentage >= 60 && coveragePercentage < 80 && 'text-yellow-600',
                              coveragePercentage < 60 && 'text-red-600'
                            )}>
                              {coveragePercentage.toFixed(1)}%
                            </span>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  'h-full transition-all duration-300',
                                  coveragePercentage >= 80 && 'bg-green-600',
                                  coveragePercentage >= 60 && coveragePercentage < 80 && 'bg-yellow-600',
                                  coveragePercentage < 60 && 'bg-red-600'
                                )}
                                style={{ width: `${Math.min(coveragePercentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{runInfo.date}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{runInfo.time}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewRun?.(run.runId)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {run.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDownloadReport?.(run.runId)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Report
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
