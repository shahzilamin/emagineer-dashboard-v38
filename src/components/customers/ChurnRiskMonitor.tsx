import { clsx } from 'clsx';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { churnRiskBuckets, churnImpactModel } from '../../data/customer-intelligence';
import { formatCurrency } from '../../utils/format';

export function ChurnRiskMonitor() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Churn Risk Monitor
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
            Subscribers flagged for churn risk by time horizon
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium">
            {churnImpactModel.currentChurnRate}% monthly churn
          </span>
        </div>
      </div>

      {/* Risk Buckets */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {churnRiskBuckets.map((bucket, idx) => (
          <div
            key={bucket.period}
            className={clsx(
              'rounded-xl p-4 border',
              idx === 0
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : idx === 1
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            )}
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Next {bucket.period}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {bucket.subscribersAtRisk}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300">subscribers at risk</p>
            <div className="flex items-center gap-1 mt-2">
              <DollarSign className="w-3 h-3 text-red-500" />
              <span className="text-sm font-semibold text-red-600 dark:text-red-400 tabular-nums">
                {formatCurrency(bucket.revenueAtRisk)}/mo
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Churn Reasons (30-day window) */}
      <div className="mb-5">
        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Top Churn Drivers (30-day window)
        </h4>
        <div className="space-y-2">
          {churnRiskBuckets[0].topReasons.map((reason) => {
            const maxCount = Math.max(...churnRiskBuckets[0].topReasons.map(r => r.count));
            return (
              <div key={reason.reason} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{reason.reason}</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">{reason.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 dark:bg-red-500 rounded-full"
                      style={{ width: `${(reason.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Churn Impact Model */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
        <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">
          💰 Retention Impact Model
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Conservative (2% reduction)</p>
            <p className="text-lg font-bold text-emerald-600 tabular-nums">
              +{formatCurrency(churnImpactModel.potentialSavings.conservative.annualRevenue)}/yr
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {churnImpactModel.potentialSavings.conservative.subscribersSaved} subscribers saved/mo
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Aggressive (3% reduction)</p>
            <p className="text-lg font-bold text-emerald-600 tabular-nums">
              +{formatCurrency(churnImpactModel.potentialSavings.aggressive.annualRevenue)}/yr
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {churnImpactModel.potentialSavings.aggressive.subscribersSaved} subscribers saved/mo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
