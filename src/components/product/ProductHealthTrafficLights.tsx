import { Activity, Package, AlertTriangle, RotateCcw, Timer, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import { productHealthIndicators } from '../../data/product-intelligence';

const statusColors = {
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    value: 'text-emerald-600 dark:text-emerald-400',
  },
  yellow: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    value: 'text-amber-600 dark:text-amber-400',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    text: 'text-red-700 dark:text-red-300',
    value: 'text-red-600 dark:text-red-400',
  },
};

const indicators = [
  { key: 'inventoryTurns' as const, icon: Activity, label: 'Inv. Turns/yr', suffix: 'x' },
  { key: 'avgContributionMargin' as const, icon: Package, label: 'Avg CM %', suffix: '%' },
  { key: 'skuConcentration' as const, icon: AlertTriangle, label: 'SKU Concentration', suffix: '%' },
  { key: 'deadStockPercent' as const, icon: ShieldAlert, label: 'Dead Stock', suffix: '%' },
  { key: 'avgReturnRate' as const, icon: RotateCcw, label: 'Avg Return Rate', suffix: '%' },
  { key: 'expirationRisk90d' as const, icon: Timer, label: '90-Day Exp Risk', suffix: '%' },
];

export function ProductHealthTrafficLights() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Product Health Traffic Lights</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {indicators.map(({ key, icon: Icon, label, suffix }) => {
          const data = productHealthIndicators[key];
          const colors = statusColors[data.status];
          return (
            <div
              key={key}
              className={clsx('rounded-xl border p-3', colors.bg, colors.border)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={clsx('w-2 h-2 rounded-full', colors.dot)} />
                <Icon className={clsx('w-3.5 h-3.5', colors.text)} />
              </div>
              <p className={clsx('text-xl font-bold', colors.value)}>
                {data.value}{suffix}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">{label}</p>
              <p className={clsx('text-xs font-medium mt-0.5', colors.text)}>{data.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for Overview tab (V31: migrated to pipe-delimited strip)
export function ProductHealthQuickStats() {
  const health = productHealthIndicators;
  const redCount = Object.values(health).filter(h => h.status === 'red').length;
  const yellowCount = Object.values(health).filter(h => h.status === 'yellow').length;

  const statusColorLight = (status: string) =>
    status === 'red' ? 'text-red-600 dark:text-red-400' : status === 'yellow' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div>
      <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <Package className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
        <div className="flex items-center gap-4 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">CM</span>
            <span className={clsx('font-bold tabular-nums', statusColorLight(health.avgContributionMargin.status))}>
              {health.avgContributionMargin.value}%
            </span>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">Dead Stock</span>
            <span className={clsx('font-bold tabular-nums', statusColorLight(health.deadStockPercent.status))}>
              {health.deadStockPercent.label}
            </span>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">Exp 90d</span>
            <span className={clsx('font-bold tabular-nums', statusColorLight(health.expirationRisk90d.status))}>
              {health.expirationRisk90d.label}
            </span>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">Turns</span>
            <span className={clsx('font-bold tabular-nums', statusColorLight(health.inventoryTurns.status))}>
              {health.inventoryTurns.value}x/yr
            </span>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 flex-shrink-0" />

          {(redCount > 0 || yellowCount > 0) ? (
            <span className="whitespace-nowrap flex items-center gap-1.5">
              {redCount > 0 && (
                <span className="text-red-600 dark:text-red-400 font-semibold">{redCount} critical</span>
              )}
              {redCount > 0 && yellowCount > 0 && (
                <span className="text-slate-300 dark:text-slate-500">·</span>
              )}
              {yellowCount > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">{yellowCount} watch</span>
              )}
            </span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">All green</span>
          )}
        </div>
      </div>
    </div>
  );
}
