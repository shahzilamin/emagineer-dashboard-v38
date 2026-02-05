import { clsx } from 'clsx';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Target,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import type { CohortRetentionRow, ChannelCohortQuality } from '../../data/cohorts';
import { cohortSummaryMetrics } from '../../data/cohorts';

interface CohortInsightsProps {
  retentionData: CohortRetentionRow[];
  channelData: ChannelCohortQuality[];
}

interface InsightStatProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  subtext?: string;
  trend?: 'up' | 'down' | null;
  trendValue?: string;
}

function InsightStat({ icon: Icon, iconColor, iconBg, label, value, subtext, trend, trendValue }: InsightStatProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
      <div className={clsx('p-2 rounded-lg flex-shrink-0', iconBg)}>
        <Icon className={clsx('w-4 h-4', iconColor)} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-300">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
          {trend && trendValue && (
            <span className={clsx(
              'flex items-center gap-0.5 text-xs font-medium',
              trend === 'up' ? 'text-emerald-600' : 'text-red-600'
            )}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trendValue}
            </span>
          )}
        </div>
        {subtext && <p className="text-xs text-slate-500 mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}

export function CohortInsights({ retentionData, channelData }: CohortInsightsProps) {
  const metrics = cohortSummaryMetrics;

  // Calculate recent vs early cohort comparison
  const recentCohorts = retentionData.slice(-3);
  const earlyCohorts = retentionData.slice(0, 3);
  const recentAvgSize = Math.round(recentCohorts.reduce((s, r) => s + r.customers, 0) / recentCohorts.length);
  const earlyAvgSize = Math.round(earlyCohorts.reduce((s, r) => s + r.customers, 0) / earlyCohorts.length);
  const cohortGrowth = ((recentAvgSize - earlyAvgSize) / earlyAvgSize * 100).toFixed(0);

  // Best and worst paid channels by LTV
  const paidChannels = channelData.filter(c => c.cac > 0).sort((a, b) => b.ltv90 - a.ltv90);
  const bestPaid = paidChannels[0];
  const worstPaid = paidChannels[paidChannels.length - 1];

  // LTV trajectory analysis
  const latestCohortWith90d = retentionData.filter(r => r.ltv[3] !== null).slice(-1)[0];
  const earliestCohortWith90d = retentionData.filter(r => r.ltv[3] !== null)[0];
  const ltvTrend = latestCohortWith90d && earliestCohortWith90d
    ? ((latestCohortWith90d.ltv[3]! - earliestCohortWith90d.ltv[3]!) / earliestCohortWith90d.ltv[3]! * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InsightStat
          icon={Users}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          label="Avg M1 Retention"
          value={`${metrics.avgMonthlyRetentionRate}%`}
          trend={metrics.retentionTrend === 'improving' ? 'up' : metrics.retentionTrend === 'declining' ? 'down' : null}
          trendValue={`${metrics.retentionTrendPct}pp`}
          subtext="% of customers who buy again within 30 days"
        />
        <InsightStat
          icon={DollarSign}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          label="Estimated 12mo LTV"
          value={`$${metrics.ltv12Estimate}`}
          trend={ltvTrend > 0 ? 'up' : ltvTrend < 0 ? 'down' : null}
          trendValue={`${Math.abs(ltvTrend).toFixed(1)}%`}
          subtext="Blended across all channels"
        />
        <InsightStat
          icon={Clock}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
          label="Avg Payback Period"
          value={`${metrics.avgPaybackPeriod} days`}
          subtext="Days to recoup blended CAC ($18.42)"
        />
        <InsightStat
          icon={Zap}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          label="Cohort Size Growth"
          value={`+${cohortGrowth}%`}
          trend="up"
          trendValue={`${recentAvgSize.toLocaleString()} avg`}
          subtext="Recent 3mo vs first 3mo"
        />
      </div>

      {/* Actionable Insights */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-blue-600" />
          CEO Action Items from Cohort Data
        </h4>
        <div className="space-y-3">
          {/* Retention Opportunity */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                M1 retention is improving — double down
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Recent cohorts retain at {recentCohorts[recentCohorts.length - 1]?.retention[1]}% (M1) vs {earlyCohorts[0]?.retention[1]}% 
                for early cohorts. Post-purchase email flows and subscription offers are working. 
                A 3pp M1 improvement = ~${Math.round(recentAvgSize * 0.03 * 142).toLocaleString()}/mo in retained revenue.
              </p>
            </div>
          </div>

          {/* Channel Mix Optimization */}
          {bestPaid && worstPaid && (
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowUpRight className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Shift budget: {bestPaid.channel} {'>'} {worstPaid.channel}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {bestPaid.channel} produces {bestPaid.day90Retention}% 90-day retention vs {worstPaid.day90Retention}% for {worstPaid.channel}.
                  Same CAC, but ${bestPaid.ltv90 - worstPaid.ltv90} higher LTV at 90 days. 
                  Reallocating 20% of {worstPaid.channel} budget could yield {((bestPaid.ltv90 / worstPaid.ltv90 - 1) * 100).toFixed(0)}% higher customer value.
                </p>
              </div>
            </div>
          )}

          {/* Cohort Growth Signal */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ArrowUpRight className="w-3 h-3 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Retention curve flattens at month 5 — this is the 100x signal
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                After the initial drop, retention stabilizes around 10-11%. This means every customer 
                you retain past month 5 becomes a long-term buyer. The business has product-market fit
                for retained customers. The lever is converting more month-1 customers into month-5+ loyalists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
