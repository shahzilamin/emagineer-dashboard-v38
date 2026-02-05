import { clsx } from 'clsx';
import { RotateCcw, TrendingUp, TrendingDown, Minus, AlertTriangle, Wrench } from 'lucide-react';
import { returnsSummary } from '../../data/fulfillment';

export function ReturnsAnalytics() {
  const returns = returnsSummary;
  const rateChange = returns.overallRate - returns.prevRate;
  const aboveBenchmark = returns.overallRate > returns.benchmark;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-red-500" />
            Return Rate & Cost Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Returns destroy {((returns.totalMonthlyCost / (38.50 * 5000)) * 100).toFixed(1)}% of revenue — here's where and why
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={clsx(
            'px-2.5 py-1 rounded-full text-xs font-semibold',
            aboveBenchmark ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
            'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
          )}>
            {returns.overallRate}% rate
          </div>
          <div className="flex items-center gap-0.5">
            {rateChange > 0 ? <TrendingUp className="w-3 h-3 text-red-500" /> : <TrendingDown className="w-3 h-3 text-emerald-500" />}
            <span className={clsx('text-xs font-medium', rateChange > 0 ? 'text-red-600' : 'text-emerald-600')}>
              {rateChange > 0 ? '+' : ''}{rateChange.toFixed(1)}pp
            </span>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
          <p className="text-xs text-slate-500">Monthly Returns</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{returns.totalMonthlyReturns}</p>
        </div>
        <div className="p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
          <p className="text-xs text-slate-500">Monthly Cost</p>
          <p className="text-lg font-bold text-red-600 tabular-nums">${(returns.totalMonthlyCost / 1000).toFixed(1)}K</p>
        </div>
        <div className="p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
          <p className="text-xs text-slate-500">PPE Benchmark</p>
          <p className="text-lg font-bold text-amber-600 tabular-nums">{returns.benchmark}%</p>
        </div>
        <div className="p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
          <p className="text-xs text-slate-500">Unsellable</p>
          <p className="text-lg font-bold text-red-600 tabular-nums">{returns.unsellablePercent}%</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* By Category */}
        <div className="col-span-12 lg:col-span-7">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Returns by Product Category</h4>
          <div className="space-y-2.5">
            {returns.byCategory.map((cat) => {
              const barWidth = (cat.returnRate / 20) * 100; // Scale to 20% max
              return (
                <div key={cat.category} className="flex items-center gap-2">
                  <div className="w-28 flex-shrink-0">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate block">{cat.category}</span>
                  </div>
                  <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, barWidth)}%`, backgroundColor: cat.color }}
                    />
                    {/* Benchmark marker */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-slate-900 dark:bg-white opacity-30"
                      style={{ left: `${(returns.benchmark / 20) * 100}%` }}
                      title={`Benchmark: ${returns.benchmark}%`}
                    />
                  </div>
                  <div className="flex items-center gap-2 w-36 flex-shrink-0">
                    <span className={clsx(
                      'text-xs font-bold tabular-nums w-10 text-right',
                      cat.returnRate > returns.benchmark ? 'text-red-600' : 'text-emerald-600'
                    )}>
                      {cat.returnRate}%
                    </span>
                    <span className="text-xs text-slate-500 truncate" title={cat.topReason}>
                      {cat.topReason}
                    </span>
                    {cat.trend === 'up' ? <TrendingUp className="w-3 h-3 text-red-400 flex-shrink-0" /> :
                     cat.trend === 'down' ? <TrendingDown className="w-3 h-3 text-emerald-400 flex-shrink-0" /> :
                     <Minus className="w-3 h-3 text-slate-400 flex-shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Reason */}
        <div className="col-span-12 lg:col-span-5">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Top Return Reasons</h4>
          <div className="space-y-2">
            {returns.byReason.map((reason) => (
              <div key={reason.reason} className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  {reason.fixable ? (
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Minus className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{reason.reason}</span>
                    <span className="text-xs font-bold tabular-nums text-slate-900 dark:text-white">{reason.percent}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full', reason.fixable ? 'bg-amber-500' : 'bg-slate-400')}
                      style={{ width: `${(reason.percent / 30) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-200 flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              <strong>{returns.byReason.filter(r => r.fixable).reduce((s, r) => s + r.percent, 0).toFixed(0)}%</strong> of returns are fixable — that's{' '}
              <strong>${Math.round(returns.totalMonthlyCost * returns.byReason.filter(r => r.fixable).reduce((s, r) => s + r.percent, 0) / 100).toLocaleString()}/mo</strong> recoverable.
            </p>
          </div>
        </div>
      </div>

      {/* Critical callout */}
      {returns.byCategory.some(c => c.returnRate > 15) && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-800 dark:text-red-200 flex items-start gap-1.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>🚨 Test Kits at 18.5% return rate</strong> — 2.3x the PPE benchmark.
              Top reason: "Expired on Arrival." {Math.round(185 * 0.284)} of {returns.byCategory.find(c => c.category === 'Test Kits')?.monthlyReturns} monthly returns
              are expiration-related. Audit incoming batches and reject stock with &lt;6 months remaining.
              Potential savings: <strong>${Math.round(185 * 0.284 * 11.40).toLocaleString()}/mo</strong>.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
