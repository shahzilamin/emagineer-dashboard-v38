import { clsx } from 'clsx';
import { Heart, TrendingDown } from 'lucide-react';
import {
  subscriberHealthDistribution,
  totalSubscribers,
  avgHealthScore,
  healthScoreTrend,
  subscriberRiskBreakdown,
} from '../../data/customer-intelligence';

const healthBands = [
  { label: 'Advocate', range: '90-100', count: subscriberHealthDistribution.advocate, color: '#10b981', bgLight: 'bg-emerald-100', bgDark: 'dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
  { label: 'Healthy', range: '75-89', count: subscriberHealthDistribution.healthy, color: '#3b82f6', bgLight: 'bg-blue-100', bgDark: 'dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  { label: 'Monitor', range: '50-74', count: subscriberHealthDistribution.monitor, color: '#f59e0b', bgLight: 'bg-amber-100', bgDark: 'dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  { label: 'At Risk', range: '25-49', count: subscriberHealthDistribution.atRisk, color: '#f97316', bgLight: 'bg-orange-100', bgDark: 'dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
  { label: 'Critical', range: '0-24', count: subscriberHealthDistribution.critical, color: '#ef4444', bgLight: 'bg-red-100', bgDark: 'dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
];

const riskCards = [
  {
    label: 'Payment Risk',
    metric: `${subscriberRiskBreakdown.payment.failedPaymentRate}% failed`,
    detail: `${subscriberRiskBreakdown.payment.retrySuccessRate}% retry success`,
    status: subscriberRiskBreakdown.payment.status,
  },
  {
    label: 'Engagement Risk',
    metric: `${subscriberRiskBreakdown.engagement.skipRate}% skip rate`,
    detail: `${subscriberRiskBreakdown.engagement.consecutiveSkippers} consecutive skippers`,
    status: subscriberRiskBreakdown.engagement.status,
  },
  {
    label: 'Value Risk',
    metric: `${subscriberRiskBreakdown.value.discountDependencyRate}% discount-dependent`,
    detail: `${subscriberRiskBreakdown.value.decliningAOVPercent}% declining AOV`,
    status: subscriberRiskBreakdown.value.status,
  },
  {
    label: 'Tenure Risk',
    metric: `${subscriberRiskBreakdown.tenure.approaching90DayCliff} near 90d cliff`,
    detail: `${subscriberRiskBreakdown.tenure.approaching6MonthPlateau} near 6mo plateau`,
    status: subscriberRiskBreakdown.tenure.status,
  },
];

export function SubscriberHealthScore() {
  const greenPercent = ((subscriberHealthDistribution.advocate + subscriberHealthDistribution.healthy) / totalSubscribers * 100).toFixed(0);
  const yellowPercent = (subscriberHealthDistribution.monitor / totalSubscribers * 100).toFixed(0);
  const redPercent = ((subscriberHealthDistribution.atRisk + subscriberHealthDistribution.critical) / totalSubscribers * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Subscriber Health Score
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
              {totalSubscribers.toLocaleString()} active subscribers scored 0-100
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">{avgHealthScore}</span>
              <span className="text-sm text-slate-500">/100</span>
            </div>
            <span className="text-xs text-red-500 flex items-center gap-0.5 justify-end">
              <TrendingDown className="w-3 h-3" />
              {healthScoreTrend}% MoM
            </span>
          </div>
        </div>

        {/* Health Distribution Bar */}
        <div className="mb-4">
          <div className="flex h-5 rounded-full overflow-hidden">
            {healthBands.map((band) => (
              <div
                key={band.label}
                className="relative group transition-all hover:opacity-80"
                style={{
                  width: `${(band.count / totalSubscribers) * 100}%`,
                  backgroundColor: band.color,
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 whitespace-nowrap bg-slate-900 text-white text-xs rounded px-2 py-1">
                  {band.label}: {band.count.toLocaleString()} ({((band.count / totalSubscribers) * 100).toFixed(0)}%)
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-emerald-600 font-medium">{greenPercent}% Healthy</span>
            <span className="text-amber-600 font-medium">{yellowPercent}% Monitor</span>
            <span className="text-red-600 font-medium">{redPercent}% At Risk</span>
          </div>
        </div>

        {/* Band Breakdown */}
        <div className="grid grid-cols-5 gap-2">
          {healthBands.map((band) => (
            <div key={band.label} className={clsx('rounded-lg p-2.5 text-center', band.bgLight, band.bgDark)}>
              <p className={clsx('text-lg font-bold tabular-nums', band.text)}>
                {band.count.toLocaleString()}
              </p>
              <p className={clsx('text-xs font-medium', band.text)}>{band.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{band.range}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Breakdown Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {riskCards.map((card) => (
          <div
            key={card.label}
            className={clsx(
              'bg-white dark:bg-slate-800 rounded-xl border p-4',
              card.status === 'warning'
                ? 'border-amber-200 dark:border-amber-800'
                : 'border-slate-200 dark:border-slate-700'
            )}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <div className={clsx(
                'w-2 h-2 rounded-full',
                card.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
              )} />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{card.metric}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">{card.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
