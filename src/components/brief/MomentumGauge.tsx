import { clsx } from 'clsx';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';
import { momentumMetrics, type MomentumMetric } from '../../data/activity';
import { formatCurrency } from '../../utils/format';

function formatMetricValue(metric: MomentumMetric): string {
  if (metric.format === 'currency') return formatCurrency(metric.currentValue, metric.currentValue >= 1000);
  if (metric.format === 'percent') return `${metric.currentValue.toFixed(1)}%`;
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(metric.currentValue);
}

function MomentumIcon({ momentum }: { momentum: MomentumMetric['momentum'] }) {
  switch (momentum) {
    case 'accelerating':
      return <ArrowUpRight className="w-4 h-4" />;
    case 'decelerating':
      return <ArrowDownRight className="w-4 h-4" />;
    case 'steady':
      return <Minus className="w-4 h-4" />;
  }
}

function MomentumBar({ metric }: { metric: MomentumMetric }) {
  // Determine if acceleration is "good" based on the metric
  // For CAC, acceleration is bad. For Revenue, Repeat Rate, LTV - it's good.
  const invertedMetrics = ['CAC'];
  const isInverted = invertedMetrics.includes(metric.label);
  const isGood = isInverted
    ? metric.momentum === 'decelerating'
    : metric.momentum === 'accelerating';
  const isBad = isInverted
    ? metric.momentum === 'accelerating'
    : metric.momentum === 'decelerating';

  const barColor = isGood
    ? 'bg-emerald-500'
    : isBad
      ? 'bg-red-500'
      : 'bg-blue-500';

  const textColor = isGood
    ? 'text-emerald-600 dark:text-emerald-400'
    : isBad
      ? 'text-red-600 dark:text-red-400'
      : 'text-blue-600 dark:text-blue-400';

  const bgColor = isGood
    ? 'bg-emerald-50 dark:bg-emerald-900/20'
    : isBad
      ? 'bg-red-50 dark:bg-red-900/20'
      : 'bg-blue-50 dark:bg-blue-900/20';

  // Normalize velocity for visual bar (0-100 scale)
  const maxVelocity = 15;
  const barWidth = Math.min(Math.abs(metric.currentVelocity) / maxVelocity * 100, 100);

  return (
    <div className={clsx(
      'rounded-xl p-4 transition-all hover:shadow-md',
      bgColor,
      'border border-transparent',
      isBad && 'border-red-200 dark:border-red-800/50'
    )}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-300 uppercase tracking-wide font-medium">
            {metric.label}
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {formatMetricValue(metric)}
          </p>
        </div>
        <div className={clsx(
          'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg',
          textColor, bgColor
        )}>
          <MomentumIcon momentum={metric.momentum} />
          <span className="capitalize">{metric.momentum}</span>
        </div>
      </div>

      {/* Velocity bar */}
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Growth rate: {metric.currentVelocity > 0 ? '+' : ''}{metric.currentVelocity.toFixed(1)}% {metric.period}</span>
          <span className={textColor}>
            Δ {metric.acceleration > 0 ? '+' : ''}{metric.acceleration.toFixed(1)}pp
          </span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-700', barColor)}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
          <span>Prev: {metric.previousVelocity > 0 ? '+' : ''}{metric.previousVelocity.toFixed(1)}%</span>
          <span>
            {metric.company === 'wellbefore' ? 'WB' : metric.company === 'd2cbuilders' ? 'D2C' : 'Portfolio'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function MomentumDashboard() {
  const accelerating = momentumMetrics.filter(m => m.momentum === 'accelerating');
  const decelerating = momentumMetrics.filter(m => m.momentum === 'decelerating');

  // Separate truly good acceleration from bad (like CAC accelerating = bad)
  const invertedMetrics = ['CAC'];
  const goodAccelerating = accelerating.filter(m => !invertedMetrics.includes(m.label));
  const badAccelerating = accelerating.filter(m => invertedMetrics.includes(m.label));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Metric Momentum</h3>
        </div>
        <p className="text-xs text-slate-500">
          Not just where you are - where you're <span className="font-semibold">headed</span>
        </p>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-300 mb-4">
        Velocity shows growth rate. Acceleration shows if growth is speeding up or slowing down. 
        Think of it as the "second derivative" - the trend of the trend.
      </p>

      {/* Summary badges */}
      <div className="flex items-center gap-3 mb-4">
        {goodAccelerating.length > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {goodAccelerating.length} accelerating
          </span>
        )}
        {decelerating.length > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-full">
            <TrendingDown className="w-3 h-3" />
            {decelerating.length} decelerating
          </span>
        )}
        {badAccelerating.length > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            {badAccelerating.length} cost rising
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {momentumMetrics.map(metric => (
          <MomentumBar key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
