import { clsx } from 'clsx';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  SkipForward,
} from 'lucide-react';
import {
  subscriptionMetrics,
  subscriptionCohorts,
  churnReasons,
  topSubscriptionProducts,
  subscriptionSummary,
} from '../../data/subscriptions';
import { formatCurrency } from '../../utils/format';

// Retention color based on percentage
function retentionColor(value: number | null): string {
  if (value === null) return 'bg-slate-100 dark:bg-slate-800 text-slate-400';
  if (value >= 70) return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300';
  if (value >= 50) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
  if (value >= 40) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
  return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
}

export function SubscriptionDeepDive() {
  const m = subscriptionMetrics;
  const summary = subscriptionSummary;
  const months = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/20">
          <SkipForward className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Subscription Deep Dive</h2>
          <p className="text-sm text-slate-500">Retention curves, churn analysis, and early warning indicators</p>
        </div>
      </div>

      {/* Leading Indicators - Skip Rate + 90-day churn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={clsx(
          'rounded-xl border p-5',
          m.skipRate > 8
            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        )}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className={clsx('w-5 h-5', m.skipRate > 8 ? 'text-amber-600' : 'text-slate-400')} />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Skip Rate (Leading Indicator)</h3>
          </div>
          <p className={clsx('text-4xl font-bold', m.skipRate > 8 ? 'text-amber-600' : 'text-slate-900 dark:text-white')}>
            {m.skipRate}%
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            {Math.round(m.totalSubscribers * m.skipRate / 100).toLocaleString()} subscribers skipped their last order
          </p>
          <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/50">
            <p className="text-xs text-slate-500">
              Industry data: 39% of subscribers who skip go on to cancel. This represents{' '}
              <strong className="text-amber-700 dark:text-amber-400">{formatCurrency(summary.revenueAtRisk, true)}</strong> in at-risk revenue over 3 months.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">90-Day Churn Window</h3>
          </div>
          <p className="text-4xl font-bold text-red-600">{summary.first90DayChurnRate}%</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            of all cancellations happen in the first 90 days
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500">
              Industry average is 44%. WellBefore is performing better at {summary.first90DayChurnRate}%, but this is still the #1 intervention window.
              Focus retention efforts on Month 1-3 subscribers.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Retention Heatmap */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 overflow-x-auto">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Subscription Retention by Cohort</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-3 whitespace-nowrap">Cohort</th>
              <th className="text-center text-xs text-slate-500 font-medium pb-2 px-1 whitespace-nowrap">Started</th>
              {months.map((m) => (
                <th key={m} className="text-center text-xs text-slate-500 font-medium pb-2 px-1">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscriptionCohorts.map((cohort) => {
              const retentionValues = [
                cohort.month1, cohort.month2, cohort.month3, cohort.month4,
                cohort.month5, cohort.month6, cohort.month7, cohort.month8,
                cohort.month9, cohort.month10, cohort.month11, cohort.month12,
              ];
              return (
                <tr key={cohort.month}>
                  <td className="text-xs font-medium text-slate-700 dark:text-slate-300 pr-3 py-1 whitespace-nowrap">
                    {cohort.month}
                  </td>
                  <td className="text-center text-xs text-slate-500 px-1 py-1">
                    {cohort.started.toLocaleString()}
                  </td>
                  {retentionValues.map((val, i) => (
                    <td key={i} className="px-0.5 py-1">
                      <div className={clsx(
                        'text-center text-xs font-medium rounded py-1 px-1',
                        retentionColor(val)
                      )}>
                        {val !== null ? `${val}%` : '-'}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center gap-4 mt-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200" />
            70%+
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-200" />
            50-69%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-200" />
            40-49%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-200" />
            &lt;40%
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          💡 Trend: Recent cohorts (Jul-Dec 25) show improving M1 retention (86-89% vs 81-83% earlier), suggesting acquisition quality is improving.
        </p>
      </div>

      {/* Churn Reasons + Top Products */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Why Subscribers Cancel</h3>
            <div className="space-y-3">
              {churnReasons.map((reason) => (
                <div key={reason.reason}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{reason.reason}</span>
                      {reason.trend === 'up' && <TrendingUp className="w-3 h-3 text-red-500" />}
                      {reason.trend === 'down' && <TrendingDown className="w-3 h-3 text-emerald-500" />}
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {reason.percentage}% <span className="text-xs text-slate-500">({reason.count})</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        'h-full rounded-full',
                        reason.trend === 'up' ? 'bg-red-500' : reason.trend === 'down' ? 'bg-emerald-500' : 'bg-slate-400'
                      )}
                      style={{ width: `${reason.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500">
                ⚠️ "Too expensive" trending up ({churnReasons[0].percentage}%) — consider tiered pricing or smaller pack sizes for price-sensitive subscribers.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Top Subscription Products</h3>
            <div className="space-y-3">
              {topSubscriptionProducts.map((product) => (
                <div key={product.name} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.subscribers.toLocaleString()} subscribers</p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(product.mrr, true)}</p>
                    <p className={clsx(
                      'text-xs font-medium',
                      product.churnRate > 7 ? 'text-red-600' : product.churnRate > 5 ? 'text-amber-600' : 'text-emerald-600'
                    )}>
                      {product.churnRate}% churn
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500">
                💡 N95 Respirators have the lowest churn ({topSubscriptionProducts[1].churnRate}%) and highest MRR.
                Consider promoting N95 subscriptions to reduce overall churn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
