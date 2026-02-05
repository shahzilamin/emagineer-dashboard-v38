import { Wallet, TrendingDown, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { cashRunway, workingCapital, cashHealthScore, totalInTransit, cashConversionCycle } from '../../data/cashflow';

const formatK = (n: number) => `$${(n / 1000).toFixed(1)}K`;

export function CashFlowQuickStats() {
  const runwayMonths = Math.round(cashRunway.runwayWeeks / 4.33);
  const prevRunwayMonths = Math.round(cashRunway.previousRunwayWeeks / 4.33);

  const runwayColor =
    cashRunway.runwayWeeks >= 12
      ? 'text-emerald-600 dark:text-emerald-400'
      : cashRunway.runwayWeeks >= 6
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400';

  const healthColor =
    cashHealthScore >= 80
      ? 'text-emerald-600 dark:text-emerald-400'
      : cashHealthScore >= 60
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400';

  const wcColor =
    workingCapital.ratio >= 2.0
      ? 'text-emerald-600 dark:text-emerald-400'
      : workingCapital.ratio >= 1.5
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400';

  return (
    <div>
      <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <div className="flex items-center gap-4 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">Runway</span>
            <span className={clsx('font-bold tabular-nums', runwayColor)}>
              {runwayMonths}mo
            </span>
            {cashRunway.trend === 'declining' && (
              <TrendingDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">Health</span>
            <span className={clsx('font-bold tabular-nums', healthColor)}>
              {cashHealthScore}/100
            </span>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">WC Ratio</span>
            <span className={clsx('font-bold tabular-nums', wcColor)}>
              {workingCapital.ratio.toFixed(2)}x
            </span>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">CCC</span>
            <span className="font-bold tabular-nums text-amber-600 dark:text-amber-400">
              {cashConversionCycle.current.ccc}d
            </span>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">In-Transit</span>
            <span className="font-bold tabular-nums text-amber-600 dark:text-amber-400">
              {formatK(totalInTransit)}
            </span>
          </div>

          {cashRunway.trend === 'declining' && (
            <>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />
              <span className="text-amber-600 dark:text-amber-400 whitespace-nowrap flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span className="font-medium">Runway declining ({prevRunwayMonths}mo → {runwayMonths}mo)</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
