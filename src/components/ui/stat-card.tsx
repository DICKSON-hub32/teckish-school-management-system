import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border/50',
  primary: 'gradient-primary text-white border-0',
  secondary: 'gradient-secondary text-white border-0',
  accent: 'bg-accent text-accent-foreground border-0',
  success: 'gradient-success text-white border-0',
  warning: 'bg-warning text-warning-foreground border-0',
};

const iconStyles = {
  default: 'bg-primary/10 text-primary',
  primary: 'bg-white/20 text-white',
  secondary: 'bg-white/20 text-white',
  accent: 'bg-white/20 text-white',
  success: 'bg-white/20 text-white',
  warning: 'bg-black/10 text-warning-foreground',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  return (
    <div
      className={cn(
        'stat-card relative overflow-hidden rounded-2xl border p-6',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            'text-sm font-medium',
            variant === 'default' ? 'text-muted-foreground' : 'text-white/80'
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold font-display">{value}</p>
          {subtitle && (
            <p className={cn(
              'text-sm',
              variant === 'default' ? 'text-muted-foreground' : 'text-white/70'
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className={cn(
                'text-xs',
                variant === 'default' ? 'text-muted-foreground' : 'text-white/60'
              )}>
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl',
          iconStyles[variant]
        )}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/5" />
    </div>
  );
};
