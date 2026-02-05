import { clsx } from 'clsx';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
} from 'lucide-react';
import {
  subscriptionMetrics,
  mrrTrend,
  planDistribution,
  subscriptionSummary,
} from '../../data/subscriptions';
import { formatCurrency } from '../../utils/format';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Compact subscription strip for the Overview morning brief (V29: flattened from 4-card grid)
export function SubscriptionQuickStats() {
  const m = subscriptionMetrics;
  const churnImproving = m.monthlyChurnRate < m.previousChurnRate;
  const skipDanger = m.skipRate > 8;
  const skipRising = m.skipRate > m.previousSkipRate;

  const churnColor = m.monthlyChurnRate > 7
    ? 'text-red-300'
    : m.monthlyChurnRate > 5
      ? 'text-amber-300'
      : 'text-emerald-300';

  return (
    <div>
      <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg backdrop-blur-sm">
        <RefreshCw className="w-4 h-4 text-purple-200 flex-shrink-0" />
        <div className="flex items-center gap-4 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-blue-100">MRR</span>
            <span className="font-bold tabular-nums text-white">
              {formatCurrency(m.mrr, true)}
            </span>
            <span className="text-emerald-300 text-xs">
              +{m.mrrGrowthRate}%
            </span>
          </div>

          <div className="w-px h-4 bg-white/20 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-blue-100">Churn</span>
            <span className={clsx('font-bold tabular-nums', churnColor)}>
              {m.monthlyChurnRate.toFixed(1)}%
            </span>
            {churnImproving ? (
              <TrendingDown className="w-3 h-3 text-emerald-300" />
            ) : (
              <TrendingUp className="w-3 h-3 text-red-300" />
            )}
            <span className="text-blue-200">
              from {m.previousChurnRate.toFixed(1)}%
            </span>
          </div>

          <div className="w-px h-4 bg-white/20 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-blue-100">Net Growth</span>
            <span className="font-bold tabular-nums text-emerald-300">
              +{m.netSubscriberGrowth}
            </span>
          </div>

          <div className="w-px h-4 bg-white/20 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-blue-100">Skip Rate</span>
            <span className={clsx('font-bold tabular-nums', skipDanger ? 'text-amber-300' : 'text-white')}>
              {m.skipRate}%
            </span>
            {skipRising ? (
              <TrendingUp className="w-3 h-3 text-red-300" />
            ) : (
              <TrendingDown className="w-3 h-3 text-emerald-300" />
            )}
            <span className={clsx('text-xs', skipRising && skipDanger ? 'text-amber-200' : 'text-blue-200')}>
              from {m.previousSkipRate}%
            </span>
          </div>

          <div className="w-px h-4 bg-white/20 flex-shrink-0" />

          <span className="text-blue-200 whitespace-nowrap">
            {m.totalSubscribers.toLocaleString()} subscribers
          </span>
        </div>
      </div>
    </div>
  );
}

// Full Subscription Health panel for Financial tab
export function SubscriptionHealthPanel() {
  const m = subscriptionMetrics;
  const summary = subscriptionSummary;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/20">
          <RefreshCw className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Subscription Health</h2>
          <p className="text-sm text-slate-500">
            {m.totalSubscribers.toLocaleString()} subscribers generating {formatCurrency(summary.annualRecurringRevenue, true)} ARR
          </p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-medium">MRR</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(m.mrr, true)}</p>
          <p className="text-xs text-emerald-600 mt-1">+{m.mrrGrowthRate}% MoM</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-medium">Churn Rate</p>
          <p className={clsx('text-2xl font-bold mt-1', m.monthlyChurnRate > 7 ? 'text-red-600' : m.monthlyChurnRate > 5 ? 'text-amber-600' : 'text-emerald-600')}>
            {m.monthlyChurnRate.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Target: &lt;5%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-medium">Subscriber LTV</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(m.subscriberLtv)}</p>
          <p className="text-xs text-purple-600 mt-1">{m.ltvMultiplier}x one-time</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-medium">Revenue Share</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{m.revenueShare}%</p>
          <p className="text-xs text-slate-500 mt-1">Of total revenue</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-medium">Payback Period</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{m.paybackPeriod} mo</p>
          <p className="text-xs text-slate-500 mt-1">CAC: {formatCurrency(m.subscriberCac)}</p>
        </div>
      </div>

      {/* MRR Trend Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">MRR Growth Trend</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(m.mrr, true)}</p>
            <p className="text-sm text-emerald-600">+{((m.mrr - mrrTrend[0].mrr) / mrrTrend[0].mrr * 100).toFixed(1)}% over 12 months</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={mrrTrend} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              formatter={(value: number | undefined) => [value != null ? formatCurrency(value) : '', 'MRR']}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey="mrr"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#mrrGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Plan Distribution + Unit Economics */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Subscription Plans</h3>
            <div className="space-y-3">
              {planDistribution.map((plan) => (
                <div key={plan.plan} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300">{plan.plan}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">{plan.subscribers.toLocaleString()} subs ({plan.percentage}%)</span>
                      <span className={clsx(
                        'text-xs font-medium',
                        plan.churnRate > 6 ? 'text-red-600' : plan.churnRate > 4 ? 'text-amber-600' : 'text-emerald-600'
                      )}>
                        {plan.churnRate}% churn
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={clsx(
                          'h-full rounded-full',
                          plan.churnRate > 6 ? 'bg-red-500' : plan.churnRate > 4 ? 'bg-amber-500' : 'bg-emerald-500'
                        )}
                        style={{ width: `${plan.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(plan.avgAov)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">💡 Key insight:</strong> Annual plans have{' '}
                <strong className="text-emerald-600">1.2% churn</strong> vs monthly's{' '}
                <strong className="text-red-600">7.8%</strong> — a 51% churn reduction.
                Moving 10% of monthly to annual = ~{formatCurrency(summary.churnReduction5pctImpact / 4, true)} saved/year.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Unit Economics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Subscriber LTV</span>
                  <span className="text-lg font-bold text-purple-600">{formatCurrency(m.subscriberLtv)}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-slate-500">One-Time LTV</span>
                  <span className="text-lg font-bold text-slate-500">{formatCurrency(m.oneTimeLtv)}</span>
                </div>
                <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs text-purple-700 dark:text-purple-300 font-medium text-center">
                    Subscribers are {m.ltvMultiplier}x more valuable
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Monthly CM/Sub</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(m.monthlyContributionMargin)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-slate-500">Subscriber CAC</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(m.subscriberCac)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-slate-500">Payback Period</span>
                  <span className="font-semibold text-emerald-600">{m.paybackPeriod} months</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-slate-500">Avg Lifespan</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{m.avgSubscriberLifespan} months</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">At-Risk Revenue</span>
                </div>
                <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(summary.revenueAtRisk, true)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  From {Math.round(m.totalSubscribers * m.skipRate / 100)} skipping subscribers (3-month projection)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
