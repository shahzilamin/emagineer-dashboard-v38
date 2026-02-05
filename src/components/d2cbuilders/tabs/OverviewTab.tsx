import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import { HealthScore } from '../../common/StatusIndicator';
import { DecisionHub } from '../../decisions';
import { InsightCard } from '../../common/InsightCard';
import {
  d2cBuildersMetrics,
  monthlyTargets,
} from '../../../data/d2cbuilders';
import { d2cBuildersInsights } from '../../../data/insights';
import { d2cBuildersDecisions } from '../../../data/decisions';
import { formatCurrency, formatNumber, formatPercentPlain } from '../../../utils/format';

export function D2COverviewTab() {
  const metrics = d2cBuildersMetrics;
  const insights = d2cBuildersInsights;

  const healthScore = Math.round(
    (monthlyTargets.revenue.percentComplete * 0.3 +
      monthlyTargets.onTimeRate.percentComplete * 0.25 +
      monthlyTargets.grossMargin.percentComplete * 0.25 +
      monthlyTargets.errorRate.percentComplete * 0.2)
  );

  const criticalInsights = insights.filter((i) => i.type === 'critical');

  return (
    <div className="space-y-6">
      {/* SECTION 1: Executive Summary Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Good morning, Shahzil</h1>
            <p className="text-emerald-100 mt-1">D2C Builders executive summary</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-200 text-sm">Overall Health</p>
            <div className="flex items-center gap-2 mt-1">
              <HealthScore score={healthScore} size="sm" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
          <div>
            <p className="text-emerald-200 text-xs sm:text-sm">Today's Revenue</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">{formatCurrency(metrics.revenue.today.current)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
              {metrics.revenue.today.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-300" />
              )}
              <span className={metrics.revenue.today.trend === 'up' ? 'text-emerald-300' : 'text-red-300'}>
                {metrics.revenue.today.changePercent >= 0 ? '+' : ''}{metrics.revenue.today.changePercent.toFixed(1)}%
              </span>
              <span className="text-emerald-200 hidden sm:inline">vs yesterday</span>
            </div>
          </div>
          <div>
            <p className="text-emerald-200 text-xs sm:text-sm">MTD Progress</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">{formatCurrency(metrics.revenue.mtd.current, true)}</p>
            <div className="mt-2">
              <div className="w-full h-1.5 sm:h-2 bg-emerald-400/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${monthlyTargets.revenue.percentComplete}%` }}
                />
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                {monthlyTargets.revenue.percentComplete.toFixed(0)}% to {formatCurrency(monthlyTargets.revenue.target, true)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-emerald-200 text-xs sm:text-sm">Orders Today</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">{formatNumber(metrics.operations.ordersToday.current)}</p>
            <p className="text-xs sm:text-sm text-emerald-300 mt-1">
              {formatPercentPlain(metrics.operations.onTimeRate.current)} on-time
            </p>
          </div>
          <div>
            <p className="text-emerald-200 text-xs sm:text-sm">Gross Margin</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">{formatPercentPlain(metrics.profitability.grossMargin.current)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
              <span className="text-amber-300">
                {metrics.profitability.grossMargin.changePercent.toFixed(1)}%
              </span>
              <span className="text-emerald-200 hidden sm:inline">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Decision Intelligence Hub */}
      <DecisionHub decisions={d2cBuildersDecisions} companyName="D2C Builders" />

      {/* SECTION 3: Key Operations Metrics (D2C equivalent of Ad Spend - their #1 concern) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Operations Snapshot</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase">Orders/Labor Hr</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {metrics.operations.ordersPerLaborHour.current.toFixed(1)}
            </p>
            <p className={`text-xs ${metrics.operations.ordersPerLaborHour.changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {metrics.operations.ordersPerLaborHour.changePercent >= 0 ? '+' : ''}{metrics.operations.ordersPerLaborHour.changePercent.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase">Error Rate</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatPercentPlain(metrics.operations.errorRate.current)}
            </p>
            <p className={`text-xs ${metrics.operations.errorRate.changePercent <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {metrics.operations.errorRate.changePercent >= 0 ? '+' : ''}{metrics.operations.errorRate.changePercent.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase">On-Time Rate</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatPercentPlain(metrics.operations.onTimeRate.current)}
            </p>
            <p className={`text-xs ${metrics.operations.onTimeRate.changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {metrics.operations.onTimeRate.changePercent >= 0 ? '+' : ''}{metrics.operations.onTimeRate.changePercent.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase">Warehouse Util</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatPercentPlain(metrics.warehouse.utilization.current)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase">Active Clients</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {metrics.clients.active}
            </p>
            <p className="text-xs text-slate-500">{metrics.clients.concentration.toFixed(1)}% concentration</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: P&L Snapshot (compact) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Financial Snapshot</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500">MTD Revenue</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(metrics.revenue.mtd.current, true)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Gross Margin</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{formatPercentPlain(metrics.profitability.grossMargin.current)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Net Profit</p>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(metrics.profitability.netProfit.current, true)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">EBITDA</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(metrics.profitability.ebitda.current, true)}</p>
          </div>
        </div>
      </div>

      {/* SECTION 5: Critical Alerts Only */}
      {criticalInsights.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Critical — Requires Immediate Action ({criticalInsights.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {criticalInsights.length === 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-4 text-center">
          <p className="text-emerald-700 dark:text-emerald-300 font-medium">
            ✓ No critical alerts — all systems operational
          </p>
        </div>
      )}
    </div>
  );
}
