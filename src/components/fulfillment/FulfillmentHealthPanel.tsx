import { useState } from 'react';
import { clsx } from 'clsx';
import { Activity, TrendingDown, TrendingUp, ChevronDown, ChevronUp, Truck, Target, DollarSign, RotateCcw } from 'lucide-react';
import { fulfillmentHealthScore, costPerOrderWaterfall, fulfillmentCostSummary } from '../../data/fulfillment';

const componentIcons: Record<string, React.ElementType> = {
  Speed: Truck,
  Accuracy: Target,
  Cost: DollarSign,
  Returns: RotateCcw,
};

function ScoreGauge({ score, status }: { score: number; status: 'green' | 'yellow' | 'red' }) {
  const color = status === 'green' ? 'text-emerald-500' : status === 'yellow' ? 'text-amber-500' : 'text-red-500';
  const bgColor = status === 'green' ? 'stroke-emerald-500' : status === 'yellow' ? 'stroke-amber-500' : 'stroke-red-500';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          className={bgColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={clsx('text-3xl font-bold tabular-nums', color)}>{score}</span>
        <span className="text-xs text-slate-500 mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function WaterfallChart() {
  const [showDetail, setShowDetail] = useState(false);
  const items = costPerOrderWaterfall;
  const maxValue = items[0].amount; // Revenue

  // Calculate running total for waterfall
  let runningTotal = 0;
  const bars = items.map((item, idx) => {
    if (idx === 0) {
      runningTotal = item.amount;
      return { ...item, start: 0, end: item.amount, isPositive: true };
    }
    if (idx === items.length - 1) {
      return { ...item, start: 0, end: item.amount, isPositive: true };
    }
    const start = runningTotal + item.amount;
    const end = runningTotal;
    runningTotal = start;
    return { ...item, start: Math.min(start, end), end: Math.max(start, end), isPositive: false };
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            Cost Per Order Waterfall
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Where every dollar goes from $38.50 AOV to $10.96 contribution
          </p>
        </div>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          {showDetail ? 'Compact' : 'Detail'}
          {showDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Key insight callout */}
      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-xs text-red-800 dark:text-red-200">
          <strong>⚠️ The Hidden Gap:</strong> Dashboard shows{' '}
          <strong>{fulfillmentCostSummary.reportedGrossMargin}% gross margin</strong>, but true contribution margin is{' '}
          <strong>{fulfillmentCostSummary.actualContributionMargin}%</strong>.{' '}
          That's <strong>${fulfillmentCostSummary.gapPerOrder.toFixed(2)}/order</strong> in fulfillment costs between the two — {' '}
          <strong>${(fulfillmentCostSummary.gapPerMonth / 1000).toFixed(1)}K/mo</strong> invisible to gross margin.
        </p>
      </div>

      {/* Waterfall bars */}
      <div className="space-y-2">
        {bars.map((bar, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === bars.length - 1;
          const widthPercent = Math.abs(bar.amount) / maxValue * 100;
          const leftPercent = isFirst || isLast ? 0 : (bar.start / maxValue * 100);

          return (
            <div key={bar.category} className="flex items-center gap-2">
              <div className="w-32 flex-shrink-0 text-right">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate block">
                  {bar.category}
                </span>
              </div>
              <div className="flex-1 h-6 relative bg-slate-50 dark:bg-slate-700/30 rounded overflow-hidden">
                <div
                  className={clsx(
                    'absolute h-full rounded transition-all',
                    isFirst ? 'bg-blue-500' : '',
                    !isFirst && !isLast && 'bg-red-500',
                    isLast && 'bg-emerald-500',
                  )}
                  style={{
                    width: `${widthPercent}%`,
                    left: isFirst || isLast ? '0%' : `${leftPercent}%`,
                  }}
                />
              </div>
              <div className="w-20 flex-shrink-0 text-right">
                <span className={clsx(
                  'text-xs font-bold tabular-nums',
                  isFirst ? 'text-blue-600' : isLast ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {bar.amount > 0 && !isFirst ? '+' : ''}{bar.amount < 0 ? '-' : ''}${Math.abs(bar.amount).toFixed(2)}
                </span>
              </div>
              {showDetail && (
                <div className="w-16 flex-shrink-0 text-right">
                  <span className="text-xs text-slate-500">{bar.percentOfRevenue}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showDetail && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xs text-slate-500">Reported Gross</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{fulfillmentCostSummary.reportedGrossMargin}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">True Contribution</p>
            <p className="text-lg font-bold text-emerald-600">{fulfillmentCostSummary.actualContributionMargin}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Annual Hidden Cost</p>
            <p className="text-lg font-bold text-red-600">${(fulfillmentCostSummary.gapPerYear / 1000).toFixed(0)}K</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function FulfillmentHealthPanel() {
  const health = fulfillmentHealthScore;

  return (
    <div className="space-y-6">
      {/* Health Score Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Fulfillment Health Score
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Composite operational health: speed + accuracy + cost + returns
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            {health.trend < 0 ? (
              <TrendingDown className="w-3 h-3 text-red-500" />
            ) : (
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            )}
            <span className={clsx(
              'font-medium',
              health.trend < 0 ? 'text-red-600' : 'text-emerald-600'
            )}>
              {health.trend > 0 ? '+' : ''}{health.trend} MoM
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Gauge */}
          <div className="col-span-12 sm:col-span-4 flex flex-col items-center justify-center">
            <ScoreGauge score={health.composite} status={health.status} />
            <p className={clsx(
              'text-sm font-semibold mt-2',
              health.status === 'green' ? 'text-emerald-600' : health.status === 'yellow' ? 'text-amber-600' : 'text-red-600'
            )}>
              {health.status === 'green' ? 'Healthy' : health.status === 'yellow' ? 'Needs Attention' : 'Critical'}
            </p>
          </div>

          {/* Component Breakdown */}
          <div className="col-span-12 sm:col-span-8 space-y-3">
            {health.components.map((comp) => {
              const Icon = componentIcons[comp.label] || Activity;
              const statusColor = comp.status === 'green' ? 'bg-emerald-500' : comp.status === 'yellow' ? 'bg-amber-500' : 'bg-red-500';
              const barColor = comp.status === 'green' ? 'bg-emerald-500' : comp.status === 'yellow' ? 'bg-amber-500' : 'bg-red-500';

              return (
                <div key={comp.label} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-20 flex-shrink-0">
                    <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', statusColor)} />
                    <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{comp.label}</span>
                  </div>
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                    <div
                      className={clsx('h-full rounded-full transition-all', barColor)}
                      style={{ width: `${comp.score}%` }}
                    />
                    {/* Benchmark marker */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-slate-400"
                      style={{ left: `${comp.benchmark}%` }}
                      title={`Benchmark: ${comp.benchmark}`}
                    />
                  </div>
                  <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-300 w-8 text-right">
                    {comp.score}
                  </span>
                </div>
              );
            })}
            <p className="text-xs text-slate-500 mt-2">
              Dashed line = industry benchmark. Score below benchmark in Cost ({health.components[2].score} vs {health.components[2].benchmark}) and Returns ({health.components[3].score} vs {health.components[3].benchmark}).
            </p>
          </div>
        </div>
      </div>

      {/* Cost Per Order Waterfall */}
      <WaterfallChart />
    </div>
  );
}
