import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  Circle,
  Zap,
  Sparkles
} from 'lucide-react';

type Status = 'idle' | 'running' | 'success' | 'warn' | 'error';

interface StatusBadgeProps {
  status: Status;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'minimal';
}

const statusConfig = {
  idle: {
    icon: Circle,
    label: 'Idle',
    colors: {
      default: 'text-slate-600 bg-slate-100 border-slate-200',
      gradient: 'text-slate-700 bg-gradient-to-r from-slate-100 to-slate-200 border-slate-300 shadow-sm',
      minimal: 'text-slate-500 bg-transparent border-slate-200'
    }
  },
  running: {
    icon: Loader2,
    label: 'Running',
    animate: true as const,
    colors: {
      default: 'text-blue-700 bg-blue-100 border-blue-200',
      gradient: 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-600 shadow-lg shadow-blue-200',
      minimal: 'text-blue-500 bg-transparent border-blue-200'
    }
  },
  success: {
    icon: CheckCircle,
    label: 'Success',
    colors: {
      default: 'text-emerald-700 bg-emerald-100 border-emerald-200',
      gradient: 'text-white bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-600 shadow-lg shadow-emerald-200',
      minimal: 'text-emerald-500 bg-transparent border-emerald-200'
    }
  },
  warn: {
    icon: AlertTriangle,
    label: 'Warning',
    colors: {
      default: 'text-amber-700 bg-amber-100 border-amber-200',
      gradient: 'text-white bg-gradient-to-r from-amber-500 to-orange-600 border-amber-600 shadow-lg shadow-amber-200',
      minimal: 'text-amber-500 bg-transparent border-amber-200'
    }
  },
  error: {
    icon: XCircle,
    label: 'Error',
    colors: {
      default: 'text-red-700 bg-red-100 border-red-200',
      gradient: 'text-white bg-gradient-to-r from-red-500 to-rose-600 border-red-600 shadow-lg shadow-red-200',
      minimal: 'text-red-500 bg-transparent border-red-200'
    }
  }
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 text-xs',
    icon: 'w-3 h-3 mr-1',
    text: 'font-medium'
  },
  md: {
    container: 'px-3 py-1.5 text-sm',
    icon: 'w-4 h-4 mr-1.5',
    text: 'font-semibold'
  },
  lg: {
    container: 'px-4 py-2 text-base',
    icon: 'w-5 h-5 mr-2',
    text: 'font-bold'
  }
};

export function StatusBadge({ 
  status, 
  className, 
  size = 'sm', 
  variant = 'default' 
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-105',
        config.colors[variant],
        sizeStyles.container,
        sizeStyles.text,
        className
      )}
    >
      <Icon 
        className={cn(
          sizeStyles.icon,
          'animate' in config && config.animate && 'animate-spin',
          variant === 'gradient' && (status === 'success' || status === 'running') && 'drop-shadow-sm'
        )} 
      />
      <span className="tracking-tight">{config.label}</span>
      
      {/* Add sparkle effect for success gradient */}
      {variant === 'gradient' && status === 'success' && (
        <Sparkles className="w-3 h-3 ml-1 animate-pulse opacity-80" />
      )}
      
      {/* Add zap effect for running gradient */}
      {variant === 'gradient' && status === 'running' && (
        <Zap className="w-3 h-3 ml-1 animate-pulse opacity-80" />
      )}
    </div>
  );
}
