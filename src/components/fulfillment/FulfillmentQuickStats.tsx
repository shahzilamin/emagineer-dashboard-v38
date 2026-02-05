import { clsx } from 'clsx';
import { Truck, AlertTriangle } from 'lucide-react';
import { fulfillmentQuickStats } from '../../data/fulfillment';

export function FulfillmentQuickStats() {
  const stats = fulfillmentQuickStats;
  const healthColor = stats.healthStatus === 'green' ? 'text-emerald-600 dark:text-emerald-400' : stats.healthStatus === 'yellow' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
      <div className="flex items-center gap-4 overflow-x-auto text-xs">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-slate-500 dark:text-slate-400">Health</span>
          <span className={clsx('font-bold', healthColor)}>{stats.healthScore}/100</span>
        </div>
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-slate-500 dark:text-slate-400">Cost/Order</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">${stats.costPerOrder}</span>
          <span className="text-slate-400 dark:text-slate-500">vs ${stats.costPerOrderBenchmark}</span>
        </div>
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-slate-500 dark:text-slate-400">Same-Day</span>
          <span className={clsx('font-bold', stats.sameDayRate >= stats.sameDayBenchmark ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400')}>
            {stats.sameDayRate}%
          </span>
        </div>
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-slate-500 dark:text-slate-400">Returns</span>
          <span className={clsx('font-bold', stats.returnRate <= stats.returnBenchmark ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
            {stats.returnRate}%
          </span>
          <span className="text-slate-400 dark:text-slate-500">vs {stats.returnBenchmark}%</span>
        </div>
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-slate-500 dark:text-slate-400">3PL</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.threePLMargin}%</span>
          <span className="text-slate-400 dark:text-slate-500">margin</span>
        </div>
        {stats.hiddenCostGap > 10000 && (
          <>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />
            <div className="flex items-center gap-1 whitespace-nowrap text-red-600 dark:text-red-400">
              <AlertTriangle className="w-3 h-3" />
              <span className="font-medium">${(stats.hiddenCostGap / 1000).toFixed(1)}K/mo hidden</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
