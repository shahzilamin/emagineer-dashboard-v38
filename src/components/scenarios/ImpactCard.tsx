import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';

interface ImpactCardProps {
  title: string;
  currentValue: string;
  projectedValue: string;
  change: number;
  changeLabel?: string;
  icon?: LucideIcon;
  iconColor?: string;
  highlight?: boolean;
  invertColor?: boolean;
  size?: 'sm' | 'md';
}

export function ImpactCard({
  title,
  currentValue,
  projectedValue,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-blue-600',
  highlight = false,
  invertColor = false,
  size = 'md',
}: ImpactCardProps) {
  const isPositive = invertColor ? change < 0 : change > 0;
  const isNegative = invertColor ? change > 0 : change < 0;
  const isNeutral = Math.abs(change) < 0.01;

  return (
    <div
      className={clsx(
        'rounded-xl border transition-all duration-300',
        size === 'sm' ? 'p-3' : 'p-4',
        highlight
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm shadow-blue-100 dark:shadow-none'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        !isNeutral && 'ring-1',
        isPositive && 'ring-emerald-200 dark:ring-emerald-800',
        isNegative && 'ring-red-200 dark:ring-red-800',
        isNeutral && 'ring-0'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className={clsx('w-4 h-4 flex-shrink-0', iconColor)} />
            )}
            <p className="text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide truncate">
              {title}
            </p>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={clsx(
              'font-bold text-slate-900 dark:text-white tabular-nums',
              size === 'sm' ? 'text-lg' : 'text-2xl'
            )}>
              {projectedValue}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 line-through tabular-nums">
              {currentValue}
            </span>
            {!isNeutral && (
              <span
                className={clsx(
                  'flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full tabular-nums',
                  isPositive && 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
                  isNegative && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            )}
            {isNeutral && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-slate-500">
                <Minus className="w-3 h-3" /> No change
              </span>
            )}
          </div>
          {changeLabel && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{changeLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ImpactSummaryBar({
  items,
}: {
  items: { label: string; value: string; change: number; invertColor?: boolean }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      {items.map((item, i) => {
        const isPositive = item.invertColor ? item.change < 0 : item.change > 0;
        const isNegative = item.invertColor ? item.change > 0 : item.change < 0;
        const isNeutral = Math.abs(item.change) < 0.01;

        return (
          <div key={i} className="flex items-center gap-3">
            {i > 0 && <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />}
            <div>
              <p className="text-xs text-slate-500">{item.label}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {item.value}
                </span>
                {!isNeutral && (
                  <span
                    className={clsx(
                      'text-xs font-medium tabular-nums',
                      isPositive && 'text-emerald-600',
                      isNegative && 'text-red-600'
                    )}
                  >
                    {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
