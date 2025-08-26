import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Configuration Card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>

          {/* Selected Files Card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>

          {/* Run Button */}
          <div className="rounded-lg border border-border bg-card p-6">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>

        <div className="space-y-6">
          <AgentsProgressSkeleton />
          <CoverageCardSkeleton />
        </div>
      </div>
    </div>
  );
}

// Agents Progress Skeleton
export function AgentsProgressSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Coverage Card Skeleton
export function CoverageCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// File Tree Skeleton
export function FileTreeSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2" style={{ paddingLeft: `${(i % 3) * 16}px` }}>
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

// Runs Table Skeleton
export function RunsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <th key={i} className="text-left p-4">
                    <Skeleton className="h-4 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  <td className="p-4">
                    <Skeleton className="h-8 w-24" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-6 w-16" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2 justify-end">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Code Preview Skeleton
export function CodePreviewSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted/20 px-4 py-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      
      <div className="rounded-b-lg border border-border bg-muted/10 p-4 space-y-2">
        {Array.from({ length: 15 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" style={{ width: `${60 + Math.random() * 40}%` }} />
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// Generic Card Skeleton
export function CardSkeleton({ 
  title = true, 
  content = true, 
  actions = false,
  className 
}: { 
  title?: boolean;
  content?: boolean;
  actions?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-6', className)}>
      {title && <Skeleton className="h-6 w-32 mb-4" />}
      {content && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      )}
      {actions && (
        <div className="flex space-x-2 mt-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      )}
    </div>
  );
}
