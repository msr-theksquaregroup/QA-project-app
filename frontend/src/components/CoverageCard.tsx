import { cn } from '@/lib/utils';
import type { Coverage } from '@/types';
import { PieChart, TrendingUp, Activity, GitBranch, Target, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface CoverageCardProps {
  coverage: Coverage;
  className?: string;
}

interface CoverageTileProps {
  label: string;
  percentage: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  isMain?: boolean;
}

function CoverageTile({ label, percentage, icon: Icon, color, bgColor, borderColor, isMain = false }: CoverageTileProps) {
  const getStatusIcon = (percentage: number) => {
    if (percentage >= 80) return CheckCircle2;
    if (percentage >= 60) return AlertTriangle;
    return XCircle;
  };

  const StatusIcon = getStatusIcon(percentage);

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg',
      isMain ? 'p-6 shadow-lg' : 'p-5 shadow-sm',
      bgColor,
      borderColor
    )}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-2 rounded-xl transition-all duration-200',
              isMain ? 'bg-white/30 shadow-sm' : 'bg-white/20'
            )}>
              <Icon className={cn('h-5 w-5', color)} />
            </div>
            <div>
              <span className={cn(
                'font-semibold transition-colors duration-200',
                isMain ? 'text-base' : 'text-sm',
                color
              )}>
                {label}
              </span>
              {isMain && (
                <p className="text-xs text-slate-600 font-medium">Test Coverage</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <StatusIcon className={cn('h-4 w-4', color)} />
            <span className={cn(
              'font-bold transition-colors duration-200',
              isMain ? 'text-3xl' : 'text-2xl',
              color
            )}>
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* Enhanced Progress bar */}
        <div className="relative">
          <div className={cn(
            'overflow-hidden rounded-full bg-white/30 backdrop-blur-sm',
            isMain ? 'h-3' : 'h-2.5'
          )}>
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700 ease-out shadow-sm',
                color.replace('text-', 'bg-gradient-to-r from-').replace('-600', '-500 to-').replace('to-', '').concat('-600')
              )}
              style={{ 
                width: `${Math.min(percentage, 100)}%`,
                transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>
          
          {/* Progress indicator */}
          {isMain && (
            <div className="flex justify-between text-xs font-medium mt-2 text-slate-600">
              <span>0%</span>
              <span className={cn('font-bold', color)}>{percentage.toFixed(1)}%</span>
              <span>100%</span>
            </div>
          )}
        </div>
        
        {/* Quality indicator */}
        <div className="mt-3 flex items-center justify-between">
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            percentage >= 80 ? 'bg-emerald-100 text-emerald-700' :
            percentage >= 60 ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          )}>
            {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Needs Work'}
          </span>
          
          {isMain && (
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-300',
                    i < Math.floor(percentage / 20) ? color.replace('text-', 'bg-') : 'bg-white/30'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CoverageCard({ coverage, className }: CoverageCardProps) {
  const getColorClasses = (percentage: number) => {
    if (percentage >= 80) return {
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50/80 to-teal-50/80',
      borderColor: 'border-emerald-200/60'
    };
    if (percentage >= 60) return {
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50/80 to-orange-50/80',
      borderColor: 'border-amber-200/60'
    };
    return {
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50/80 to-rose-50/80',
      borderColor: 'border-red-200/60'
    };
  };

  const overallClasses = getColorClasses(coverage.overall_percentage);

  const tiles = [
    {
      label: 'Overall Coverage',
      percentage: coverage.overall_percentage,
      icon: Target,
      ...overallClasses,
      isMain: true,
    },
    {
      label: 'Statements',
      percentage: coverage.statements_percentage,
      icon: TrendingUp,
      ...getColorClasses(coverage.statements_percentage),
    },
    {
      label: 'Functions',
      percentage: coverage.functions_percentage,
      icon: Activity,
      ...getColorClasses(coverage.functions_percentage),
    },
    {
      label: 'Branches',
      percentage: coverage.branches_percentage,
      icon: GitBranch,
      ...getColorClasses(coverage.branches_percentage),
    },
  ];

  const averageCoverage = (
    coverage.statements_percentage + 
    coverage.functions_percentage + 
    coverage.branches_percentage
  ) / 3;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Test Coverage Analysis</h3>
          <p className="text-slate-600 text-sm">Code coverage metrics and quality assessment</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm text-slate-500 font-medium">Source</div>
            <div className={cn(
              'text-xs font-mono px-2 py-1 rounded-lg border',
              coverage.source === 'c8' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
            )}>
              {coverage.source}
            </div>
          </div>
          
          {coverage.coverage_collected && (
            <div className="flex items-center space-x-1 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Collected</span>
            </div>
          )}
        </div>
      </div>

      {/* Coverage Summary */}
      <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 border border-slate-200/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800 mb-1">{coverage.overall_percentage.toFixed(1)}%</div>
            <div className="text-sm text-slate-600 font-medium">Overall</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{averageCoverage.toFixed(1)}%</div>
            <div className="text-sm text-slate-600 font-medium">Average</div>
          </div>
          <div className="text-center">
            <div className={cn(
              'text-2xl font-bold mb-1',
              coverage.overall_percentage >= 80 ? 'text-emerald-600' : 
              coverage.overall_percentage >= 60 ? 'text-amber-600' : 'text-red-600'
            )}>
              {coverage.overall_percentage >= 80 ? 'A+' : 
               coverage.overall_percentage >= 70 ? 'A' :
               coverage.overall_percentage >= 60 ? 'B' : 'C'}
            </div>
            <div className="text-sm text-slate-600 font-medium">Grade</div>
          </div>
        </div>
      </div>
      
      {/* Coverage Tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Main overall tile spans 2 columns on larger screens */}
        <div className="sm:col-span-2">
          <CoverageTile {...tiles[0]} />
        </div>
        
        {/* Other tiles in a row */}
        {tiles.slice(1).map((tile) => (
          <CoverageTile key={tile.label} {...tile} />
        ))}
      </div>

      {/* Insights */}
      <div className="bg-white/60 border border-slate-200/50 rounded-2xl p-5 backdrop-blur-sm">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
          <PieChart className="h-4 w-4 mr-2 text-slate-500" />
          Coverage Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Highest Coverage:</span>
              <span className="font-semibold text-slate-800">
                {Math.max(coverage.statements_percentage, coverage.functions_percentage, coverage.branches_percentage).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Lowest Coverage:</span>
              <span className="font-semibold text-slate-800">
                {Math.min(coverage.statements_percentage, coverage.functions_percentage, coverage.branches_percentage).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Coverage Spread:</span>
              <span className="font-semibold text-slate-800">
                {(Math.max(coverage.statements_percentage, coverage.functions_percentage, coverage.branches_percentage) - 
                  Math.min(coverage.statements_percentage, coverage.functions_percentage, coverage.branches_percentage)).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status:</span>
              <span className={cn(
                'font-semibold',
                coverage.overall_percentage >= 80 ? 'text-emerald-600' : 
                coverage.overall_percentage >= 60 ? 'text-amber-600' : 'text-red-600'
              )}>
                {coverage.overall_percentage >= 80 ? 'Excellent' : 
                 coverage.overall_percentage >= 60 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}