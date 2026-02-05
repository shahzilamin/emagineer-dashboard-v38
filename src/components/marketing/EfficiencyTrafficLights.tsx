import { clsx } from 'clsx';
import { CircleCheck, CircleAlert, CircleX, Info } from 'lucide-react';
import { efficiencyTrafficLights, type TrafficLight } from '../../data/marketing-intelligence';

const statusConfig = {
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    valueText: 'text-emerald-600 dark:text-emerald-400',
    icon: CircleCheck,
    label: 'On Track',
  },
  yellow: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
    valueText: 'text-amber-600 dark:text-amber-400',
    icon: CircleAlert,
    label: 'Watch',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    text: 'text-red-700 dark:text-red-400',
    valueText: 'text-red-600 dark:text-red-400',
    icon: CircleX,
    label: 'At Risk',
  },
};

function TrafficLightCard({ light }: { light: TrafficLight }) {
  const config = statusConfig[light.status];
  const Icon = config.icon;

  return (
    <div className={clsx('rounded-xl border p-4', config.bg, config.border)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">
          {light.metric}
        </span>
        <Icon className={clsx('w-4 h-4', config.text)} />
      </div>
      <p className={clsx('text-2xl font-bold', config.valueText)}>
        {light.displayValue}
      </p>
      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-300">
        <span className="flex items-center gap-1">
          <span className={clsx('w-1.5 h-1.5 rounded-full', light.status === 'green' ? 'bg-emerald-500' : 'bg-slate-300')} />
          {light.thresholds.green}
        </span>
        <span className="flex items-center gap-1">
          <span className={clsx('w-1.5 h-1.5 rounded-full', light.status === 'yellow' ? 'bg-amber-500' : 'bg-slate-300')} />
          {light.thresholds.yellow}
        </span>
        <span className="flex items-center gap-1">
          <span className={clsx('w-1.5 h-1.5 rounded-full', light.status === 'red' ? 'bg-red-500' : 'bg-slate-300')} />
          {light.thresholds.red}
        </span>
      </div>
      <div className="flex items-start gap-1.5 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
        <Info className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{light.insight}</p>
      </div>
    </div>
  );
}

export function EfficiencyTrafficLights() {
  const greenCount = efficiencyTrafficLights.filter(l => l.status === 'green').length;
  const yellowCount = efficiencyTrafficLights.filter(l => l.status === 'yellow').length;
  const redCount = efficiencyTrafficLights.filter(l => l.status === 'red').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Ad Spend Efficiency
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">3-second health check</p>
        </div>
        <div className="flex items-center gap-2">
          {greenCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {greenCount} OK
            </span>
          )}
          {yellowCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-xs font-medium text-amber-700 dark:text-amber-400">
              {yellowCount} Watch
            </span>
          )}
          {redCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-xs font-medium text-red-700 dark:text-red-400">
              {redCount} Alert
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {efficiencyTrafficLights.map((light) => (
          <TrafficLightCard key={light.metric} light={light} />
        ))}
      </div>
    </div>
  );
}

// Compact version for Overview tab
export function EfficiencyTrafficLightsCompact() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {efficiencyTrafficLights.map((light) => {
        const config = statusConfig[light.status];
        return (
          <div
            key={light.metric}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg border',
              config.bg,
              config.border
            )}
          >
            <span className={clsx('w-2 h-2 rounded-full', config.dot)} />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {light.metric}
            </span>
            <span className={clsx('text-xs font-bold', config.valueText)}>
              {light.displayValue}
            </span>
          </div>
        );
      })}
    </div>
  );
}
