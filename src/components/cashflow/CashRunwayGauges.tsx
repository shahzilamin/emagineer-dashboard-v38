import { Shield, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import { cashRunway, workingCapital, cashHealthComponents, cashHealthScore } from '../../data/cashflow';

const formatDollar = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function GaugeRing({ score, size = 100, color }: { score: number; size?: number; color: string }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={6} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CashRunwayGauges() {
  const runwayPct = Math.min(100, (cashRunway.runwayWeeks / 24) * 100);
  const wcPct = Math.min(100, (workingCapital.ratio / 2.5) * 100);
  const healthPct = cashHealthScore;

  const runwayColor = cashRunway.status === 'green' ? '#10b981' : cashRunway.status === 'yellow' ? '#f59e0b' : '#ef4444';
  const wcStatus = workingCapital.status as string;
  const wcColor = wcStatus === 'healthy' ? '#10b981' : wcStatus === 'adequate' ? '#f59e0b' : wcStatus === 'tight' ? '#f97316' : '#ef4444';
  const healthColor = cashHealthScore >= 80 ? '#10b981' : cashHealthScore >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Cash Health & Runway</h3>
      </div>

      {/* Three gauges in a row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Cash Runway */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <GaugeRing score={runwayPct} size={90} color={runwayColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                {cashRunway.runwayWeeks.toFixed(0)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">weeks</span>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-2">Cash Runway</p>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingDown className="w-3 h-3 text-amber-500" />
            <span className="text-xs text-amber-600 dark:text-amber-400 tabular-nums">
              was {cashRunway.previousRunwayWeeks.toFixed(0)}w
            </span>
          </div>
        </div>

        {/* Working Capital */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <GaugeRing score={wcPct} size={90} color={wcColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                {workingCapital.ratio.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">ratio</span>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-2">Working Capital</p>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingDown className="w-3 h-3 text-amber-500" />
            <span className="text-xs text-amber-600 dark:text-amber-400 tabular-nums">
              was {workingCapital.previousRatio.toFixed(2)}x
            </span>
          </div>
        </div>

        {/* Cash Health Score */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <GaugeRing score={healthPct} size={90} color={healthColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                {cashHealthScore}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/100</span>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-2">Cash Health</p>
          <span className={clsx(
            'text-xs px-1.5 py-0.5 rounded mt-0.5',
            cashHealthScore >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
            cashHealthScore >= 60 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          )}>
            {cashHealthScore >= 80 ? 'Healthy' : cashHealthScore >= 60 ? 'Adequate' : 'At Risk'}
          </span>
        </div>
      </div>

      {/* Health Component Breakdown */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Component Breakdown</p>
        {cashHealthComponents.map((c) => (
          <div key={c.name} className="flex items-center gap-3">
            <div className="w-28 text-xs text-slate-600 dark:text-slate-300 flex-shrink-0">{c.name}</div>
            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={clsx(
                  'h-full rounded-full',
                  c.status === 'green' ? 'bg-emerald-500' : c.status === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                )}
                style={{ width: `${c.score}%` }}
              />
            </div>
            <div className="w-10 text-xs font-bold tabular-nums text-right text-slate-700 dark:text-slate-200">
              {c.score}
            </div>
            <div className="w-32 text-xs text-slate-500 dark:text-slate-400 hidden lg:block truncate">{c.detail}</div>
          </div>
        ))}
      </div>

      {/* Working Capital Breakdown */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Working Capital Breakdown</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Cash</span>
            <span className="font-medium tabular-nums text-slate-700 dark:text-slate-200">{formatDollar(workingCapital.breakdown.cash)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Payables</span>
            <span className="font-medium tabular-nums text-red-600 dark:text-red-400">{formatDollar(workingCapital.breakdown.payables)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Inventory</span>
            <span className="font-medium tabular-nums text-slate-700 dark:text-slate-200">{formatDollar(workingCapital.breakdown.inventory)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Accrued Expenses</span>
            <span className="font-medium tabular-nums text-red-600 dark:text-red-400">{formatDollar(workingCapital.breakdown.accruedExpenses)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Receivables</span>
            <span className="font-medium tabular-nums text-slate-700 dark:text-slate-200">{formatDollar(workingCapital.breakdown.receivables)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Short-Term Debt</span>
            <span className="font-medium tabular-nums text-red-600 dark:text-red-400">{formatDollar(workingCapital.breakdown.shortTermDebt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">In-Transit</span>
            <span className="font-medium tabular-nums text-slate-700 dark:text-slate-200">{formatDollar(workingCapital.breakdown.inTransit)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1 mt-1">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Total Liabilities</span>
            <span className="font-bold tabular-nums text-red-600 dark:text-red-400">{formatDollar(workingCapital.currentLiabilities)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1 mt-1">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Total Assets</span>
            <span className="font-bold tabular-nums text-emerald-600">{formatDollar(workingCapital.currentAssets)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
