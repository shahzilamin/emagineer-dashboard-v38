import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Activity,
  Package,
  Truck,
  Wallet,
} from 'lucide-react';
import { clsx } from 'clsx';
import { HealthScore } from '../../common/StatusIndicator';
import { PillarCard } from '../../common/PillarCard';
import { CashFlowCard, CashFlowForecast } from '../../common/CashFlowCard';
import { DecisionHub } from '../../decisions';
import { InsightCard } from '../../common/InsightCard';
import { SubscriptionQuickStats } from '../../subscriptions';
import { subscriptionMetrics as subData } from '../../../data/subscriptions';
import { ChannelCorrelationsBadge } from '../../marketing';
import { wellBeforeMetrics, monthlyTargets, cashFlowMetrics, dailyMetrics } from '../../../data/wellbefore';
import { wellBeforeInsights } from '../../../data/insights';
import { wellBeforeDecisions, type Decision } from '../../../data/decisions';
import { adSpendSummary } from '../../../data/adspend';
import { tariffQuickStats } from '../../../data/tariffs';
import { tariffDecision } from '../../../data/tariffs';
import { productDecision } from '../../../data/product-intelligence';
import { fulfillmentDecisionForHub } from '../../../data/fulfillment';
import { cashFlowDecisionForHub } from '../../../data/cashflow';
import { currentMER, merChange } from '../../../data/marketing-intelligence';
import { productHealthIndicators, portfolioSummary } from '../../../data/product-intelligence';
import { fulfillmentQuickStats } from '../../../data/fulfillment';
import { cashRunway, workingCapital, cashHealthScore, totalInTransit, cashConversionCycle } from '../../../data/cashflow';

// Trajectory classification helper for 3-month trends
function classifyTrajectory(twoMonthAgo: number, lastMonth: number, current: number, higherIsBetter: boolean): 'accelerating-decline' | 'stable-fluctuation' | 'recovery-correction' | 'steady-improvement' | 'accelerating-improvement' {
  const d1 = lastMonth - twoMonthAgo; // first delta
  const d2 = current - lastMonth;     // second delta
  if (higherIsBetter) {
    if (d2 > 0 && d1 > 0) return d2 > d1 ? 'accelerating-improvement' : 'steady-improvement';
    if (d2 < 0 && d1 < 0) return Math.abs(d2) > Math.abs(d1) ? 'accelerating-decline' : 'accelerating-decline';
    if (d2 < 0 && d1 > 0) return 'recovery-correction';
    if (d2 > 0 && d1 < 0) return 'steady-improvement';
    return 'stable-fluctuation';
  } else {
    // inverted (e.g., for CCC or costs where lower is better)
    if (d2 < 0 && d1 < 0) return Math.abs(d2) > Math.abs(d1) ? 'accelerating-improvement' : 'steady-improvement';
    if (d2 > 0 && d1 > 0) return Math.abs(d2) > Math.abs(d1) ? 'accelerating-decline' : 'accelerating-decline';
    if (d2 > 0 && d1 < 0) return 'recovery-correction';
    if (d2 < 0 && d1 > 0) return 'steady-improvement';
    return 'stable-fluctuation';
  }
}
import { formatCurrency, formatPercentPlain } from '../../../utils/format';
import {
  DollarSign,
  Target,
  Users,
} from 'lucide-react';

// Mini sparkline SVG component - no dependencies needed
function RevenueSparkline({ data, paceTarget }: { data: { date: string; revenue: number }[]; paceTarget: number }) {
  const width = 280;
  const height = 48;
  const padding = { top: 4, bottom: 4, left: 2, right: 2 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const revenues = data.map(d => d.revenue);
  const maxVal = Math.max(...revenues, paceTarget) * 1.05;
  const minVal = Math.min(...revenues) * 0.95;

  const points = revenues.map((v, i) => {
    const x = padding.left + (i / (revenues.length - 1)) * chartW;
    const y = padding.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;
    return `${x},${y}`;
  }).join(' ');

  const paceY = padding.top + chartH - ((paceTarget - minVal) / (maxVal - minVal)) * chartH;
  const latestRevenue = revenues[revenues.length - 1];
  const abovePace = latestRevenue >= paceTarget;

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <line
        x1={padding.left} y1={paceY}
        x2={width - padding.right} y2={paceY}
        stroke={abovePace ? 'rgba(52,211,153,0.4)' : 'rgba(251,191,36,0.4)'}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <polyline
        points={points}
        fill="none"
        stroke={abovePace ? '#6ee7b7' : '#fbbf24'}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={padding.left + chartW}
        cy={padding.top + chartH - ((latestRevenue - minVal) / (maxVal - minVal)) * chartH}
        r={2.5}
        fill={abovePace ? '#6ee7b7' : '#fbbf24'}
      />
    </svg>
  );
}

export function OverviewTab() {
  const [decisionsExpanded, setDecisionsExpanded] = useState(false);
  const metrics = wellBeforeMetrics;
  const insights = wellBeforeInsights;
  const summary = adSpendSummary;
  const allDecisions: Decision[] = [...wellBeforeDecisions, tariffDecision as Decision, productDecision as Decision, fulfillmentDecisionForHub as Decision, cashFlowDecisionForHub as Decision];
  const cacRising = summary.blendedCac > summary.previousBlendedCac;

  const criticalInsights = insights.filter((i) => i.type === 'critical');

  // MER status
  const merStatusColor = currentMER > 4 ? 'text-emerald-600' : currentMER >= 3 ? 'text-amber-600' : 'text-red-600';
  const merIsDecline = merChange < 0;

  // Daily pace target for sparkline
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dailyPaceTarget = monthlyTargets.revenue.target / daysInMonth;

  // ── Business Pillar data (moved above health score for dependency) ──
  const health = productHealthIndicators;
  const redCount = Object.values(health).filter(h => h.status === 'red').length;
  const yellowCount = Object.values(health).filter(h => h.status === 'yellow').length;
  const productStatus: 'green' | 'yellow' | 'red' = redCount > 0 ? 'red' : yellowCount > 0 ? 'yellow' : 'green';
  const productAlert = redCount > 0 || yellowCount > 0
    ? `${redCount > 0 ? `${redCount} critical` : ''}${redCount > 0 && yellowCount > 0 ? ' · ' : ''}${yellowCount > 0 ? `${yellowCount} watch` : ''}`
    : undefined;

  const fStats = fulfillmentQuickStats;
  const fulfillmentStatus: 'green' | 'yellow' | 'red' =
    fStats.healthScore >= 80 ? 'green' : fStats.healthScore >= 60 ? 'yellow' : 'red';

  const runwayMonths = Math.round(cashRunway.runwayWeeks / 4.33);
  const prevRunwayMonths = Math.round(cashRunway.previousRunwayWeeks / 4.33);
  const twoMonthAgoRunwayMonths = Math.round(cashRunway.twoMonthAgoRunwayWeeks / 4.33);
  const cashStatus: 'green' | 'yellow' | 'red' =
    cashRunway.runwayWeeks < 6 ? 'red'
      : cashRunway.runwayWeeks < 12 ? 'yellow'
      : cashRunway.trend === 'declining' ? 'yellow'
      : 'green';
  const cashAlert = cashRunway.trend === 'declining'
    ? `Declining (${prevRunwayMonths}mo → ${runwayMonths}mo)`
    : undefined;

  // ── Health Score - Recalibrated (Sol Hero V36) ──
  // Sub-scores capped at 100 to prevent inflation
  const revenueScore = Math.min(100, Math.round(monthlyTargets.revenue.percentComplete));
  const marginScore = Math.min(100, Math.round(monthlyTargets.grossMargin.percentComplete));
  const efficiencyScore = Math.min(100, Math.round(100 - Math.min(100, (metrics.marketing.cac.blended.current / monthlyTargets.cac.target) * 100 - 100)));
  const opsScore = Math.min(100, Math.round(metrics.fulfillment.onTimeRate.current));

  // Base weighted score
  let healthScore = Math.round(
    (revenueScore * 0.3 +
      marginScore * 0.25 +
      efficiencyScore * 0.25 +
      opsScore * 0.2)
  );

  // Trajectory penalty: 2+ declining pillars → cap at 85 (can't be "green" while broadly deteriorating)
  const decliningPillars = [
    health.avgContributionMargin.value < portfolioSummary.previousContributionMargin,
    fStats.healthScore < fStats.previousHealthScore,
    cashRunway.trend === 'declining',
  ].filter(Boolean).length;
  if (decliningPillars >= 2) {
    healthScore = Math.min(healthScore, 85);
  }

  // Risk penalty: -3 per critical alert, -2 per fire-flagged metric
  // Sol QW3: Dynamic fire threshold — improving metrics within DTC benchmarks don't count as fire
  const criticalAlertPenalty = criticalInsights.length * 3;
  const churnIsFire = subData.monthlyChurnRate > 5 && !(subData.monthlyChurnRate < subData.previousChurnRate && subData.monthlyChurnRate <= 8);
  const skipIsFire = subData.skipRate > 8 && !(subData.skipRate < subData.previousSkipRate && subData.skipRate <= 12);
  const fireMetrics = [churnIsFire, skipIsFire].filter(Boolean).length;
  healthScore = Math.max(0, healthScore - criticalAlertPenalty - (fireMetrics * 2));

  // Benchmark miss penalty: -2 each when significantly above target/benchmark (>20%)
  if (fStats.returnRate > fStats.returnBenchmark * 1.2) healthScore = Math.max(0, healthScore - 2);
  if (fStats.costPerOrder > fStats.costPerOrderBenchmark * 1.2) healthScore = Math.max(0, healthScore - 2);

  // Decision urgency counts for button label (Sol QW2)
  const thisWeekDecisions = allDecisions.filter(d => d.urgency === 'this-week' || d.urgency === 'today').length;
  const thisMonthDecisions = allDecisions.filter(d => d.urgency === 'this-month').length;

  // ── Business Pillar composite summary (Lux Hero V36) ──
  const pillarTrends = [
    { name: 'Product', declining: health.avgContributionMargin.value < portfolioSummary.previousContributionMargin },
    { name: 'Fulfillment', declining: fStats.healthScore < fStats.previousHealthScore },
    { name: 'Cash Flow', declining: runwayMonths < prevRunwayMonths },
  ];
  const decliningCount = pillarTrends.filter(p => p.declining).length;
  const decliningNames = pillarTrends.filter(p => p.declining).map(p => p.name);

  const pillarSummary = decliningCount === 0
    ? 'All pillars stable or improving'
    : decliningCount === 3
      ? 'All 3 pillars declining — investigate immediately'
      : `${decliningCount} of 3 declining · ${decliningNames.join(' & ')} need${decliningCount === 1 ? 's' : ''} attention`;

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════
          SECTION 1: Morning Brief / Summary Header
          ═══════════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Good morning, Shahzil</h1>
            <p className="text-blue-100 mt-1">Here's your WellBefore executive summary</p>
          </div>
          {/* Health Score - now shows number prominently (Sol QW3) */}
          <div className="text-right relative group">
            <p className="text-blue-100 text-sm">Overall Health</p>
            <div className="flex items-center gap-2 mt-1 cursor-help">
              <HealthScore score={healthScore} size="sm" />
            </div>
            {/* Decomposition Tooltip (Lux QW3: text-slate-400 → text-slate-300) */}
            <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50 text-left shadow-xl">
              <p className="text-xs font-semibold text-white mb-2">Score Breakdown</p>
              <div className="space-y-1.5">
                {[
                  { label: 'Revenue', score: revenueScore, weight: '30%' },
                  { label: 'Margins', score: marginScore, weight: '25%' },
                  { label: 'Efficiency', score: efficiencyScore, weight: '25%' },
                  { label: 'Operations', score: opsScore, weight: '20%' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 w-16">{s.label}</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full', s.score >= 80 ? 'bg-emerald-400' : s.score >= 60 ? 'bg-amber-400' : 'bg-red-400')}
                        style={{ width: `${Math.min(s.score, 100)}%` }}
                      />
                    </div>
                    <span className={clsx('text-xs font-bold tabular-nums w-8 text-right', s.score >= 80 ? 'text-emerald-300' : s.score >= 60 ? 'text-amber-300' : 'text-red-300')}>
                      {s.score}
                    </span>
                  </div>
                ))}
              </div>
              {/* Penalty Deductions (Lux QW3 V37) */}
              {(decliningPillars >= 2 || criticalInsights.length > 0 || fireMetrics > 0 || fStats.returnRate > fStats.returnBenchmark * 1.2 || fStats.costPerOrder > fStats.costPerOrderBenchmark * 1.2) && (
                <div className="mt-2 pt-1.5 border-t border-white/10 space-y-1">
                  <p className="text-xs font-semibold text-slate-400 mb-1">Adjustments</p>
                  {decliningPillars >= 2 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400">{decliningPillars} pillars declining</span>
                      <span className="text-xs font-bold text-amber-400">cap 85</span>
                    </div>
                  )}
                  {criticalInsights.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-red-400">{criticalInsights.length} critical alert{criticalInsights.length > 1 ? 's' : ''}</span>
                      <span className="text-xs font-bold text-red-400">−{criticalInsights.length * 3}</span>
                    </div>
                  )}
                  {fireMetrics > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-red-400">{fireMetrics} fire metric{fireMetrics > 1 ? 's' : ''}</span>
                      <span className="text-xs font-bold text-red-400">−{fireMetrics * 2}</span>
                    </div>
                  )}
                  {fStats.returnRate > fStats.returnBenchmark * 1.2 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400">Returns &gt; benchmark</span>
                      <span className="text-xs font-bold text-amber-400">−2</span>
                    </div>
                  )}
                  {fStats.costPerOrder > fStats.costPerOrderBenchmark * 1.2 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400">Cost/order &gt; benchmark</span>
                      <span className="text-xs font-bold text-amber-400">−2</span>
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2 border-t border-white/10 pt-1.5">Weighted avg {Math.round(revenueScore * 0.3 + marginScore * 0.25 + efficiencyScore * 0.25 + opsScore * 0.2)} → adjusted {healthScore}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
          <div>
            <p className="text-blue-100 text-xs sm:text-sm">Today's Revenue</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tabular-nums mt-1">{formatCurrency(metrics.revenue.today.current)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
              <span className="text-emerald-300 font-semibold">
                +{metrics.revenue.today.yoyChangePercent}% vs Feb '25
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs">
              <span className={metrics.revenue.today.trend === 'up' ? 'text-blue-200' : 'text-red-300'}>
                {metrics.revenue.today.changePercent >= 0 ? '+' : ''}{metrics.revenue.today.changePercent.toFixed(1)}% vs yesterday
              </span>
            </div>
          </div>
          <div>
            <p className="text-blue-100 text-xs sm:text-sm">MTD Progress</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tabular-nums mt-1">{formatCurrency(metrics.revenue.mtd.current, true)}</p>
            <div className="mt-2">
              <div className="w-full h-1.5 sm:h-2 bg-blue-400/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${monthlyTargets.revenue.percentComplete}%` }}
                />
              </div>
              <p className="text-xs text-blue-100 mt-1">
                {monthlyTargets.revenue.percentComplete.toFixed(0)}% to {formatCurrency(monthlyTargets.revenue.target, true)}
              </p>
              <p className="text-xs text-emerald-300 mt-0.5">
                +{metrics.revenue.mtd.yoyChangePercent}% vs Feb '25 ({formatCurrency(metrics.revenue.mtd.yoyValue ?? 0, true)} at this point)
              </p>
            </div>
          </div>
          <div>
            <p className="text-blue-100 text-xs sm:text-sm">365d LTV:CAC</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tabular-nums mt-1">{metrics.customers.ltvCacRatio.current.toFixed(1)}:1</p>
            <p className="text-xs sm:text-sm text-emerald-300 mt-1">
              Above 3:1 target
              <span className="text-blue-100 hidden lg:inline"> · Subs {subData.revenueShare}% of rev</span>
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-xs sm:text-sm">Gross Margin</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tabular-nums mt-1">{formatPercentPlain(metrics.profitability.grossMargin.current)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
              <span className="text-amber-300">
                {metrics.profitability.grossMargin.changePercent.toFixed(1)}%
              </span>
              <span className="text-blue-100 hidden sm:inline">
                · tariff {tariffQuickStats.avgEffectiveTariffRate}%, stable
              </span>
            </div>
          </div>
        </div>

        {/* 30-Day Revenue Trend Sparkline */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-blue-100" />
              <span className="text-xs text-blue-100">30d Revenue Trend</span>
            </div>
            <RevenueSparkline data={dailyMetrics} paceTarget={dailyPaceTarget} />
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-4 h-px bg-emerald-300 inline-block" style={{ borderTop: '1.5px dashed rgba(52,211,153,0.5)' }} />
                <span className="text-blue-100">Pace</span>
              </span>
            </div>
          </div>
        </div>

        {/* Critical Alert Teaser - compact, no duplication (Lux QW1) */}
        {criticalInsights.length > 0 && (
          <div className="mt-4 flex items-center gap-3 px-3 py-2 bg-red-500/20 rounded-lg border border-red-400/30">
            <AlertCircle className="w-4 h-4 text-red-200 flex-shrink-0 animate-pulse" />
            <span className="text-xs font-bold text-red-100 whitespace-nowrap">
              {criticalInsights.length} Alert{criticalInsights.length > 1 ? 's' : ''} — scroll for details
            </span>
          </div>
        )}

        {/* Subscription Health (stays in gradient) */}
        <div className="mt-3">
          <SubscriptionQuickStats />
        </div>

      </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 2: Decision Intelligence (Lux Hero V37: full array with displayLimit)
          ═══════════════════════════════════════════════ */}
      <div>
        {decisionsExpanded ? (
          <>
            <DecisionHub decisions={allDecisions} companyName="WellBefore" criticalAlertCount={criticalInsights.length} />
            <button
              onClick={() => setDecisionsExpanded(false)}
              className="flex items-center gap-1.5 mt-3 mx-auto text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
              Collapse decisions
            </button>
          </>
        ) : (
          <DecisionHub decisions={allDecisions} displayLimit={2} companyName="WellBefore" criticalAlertCount={criticalInsights.length} />
        )}
        {!decisionsExpanded && allDecisions.length > 2 && (
          <button
            onClick={() => setDecisionsExpanded(true)}
            className="flex items-center gap-1.5 mt-3 mx-auto px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            View all {allDecisions.length} decisions ({thisWeekDecisions} this week · {thisMonthDecisions} this month)
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 3: Business Pillars - 3-Column Card Grid (Lux Hero)
          ═══════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Business Pillars
            </h2>
            <p className={clsx('text-sm', decliningCount >= 3 ? 'text-red-600 dark:text-red-400 font-medium' : decliningCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400')}>
              {pillarSummary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PillarCard
            icon={Package}
            iconColor="text-green-600 dark:text-green-400"
            title="Product"
            status={productStatus}
            heroValue={`${health.avgContributionMargin.value}%`}
            heroLabel="Contribution Margin"
            alertText={productAlert}
            heroTrend={{
              direction: health.avgContributionMargin.value < portfolioSummary.previousContributionMargin ? 'down' : health.avgContributionMargin.value > portfolioSummary.previousContributionMargin ? 'up' : 'flat',
              label: `from ${portfolioSummary.previousContributionMargin}% last month`,
              sentiment: health.avgContributionMargin.value < portfolioSummary.previousContributionMargin ? 'bad' : 'good',
            }}
            trendHistory={{
              points: [
                `${portfolioSummary.twoMonthAgoContributionMargin}%`,
                `${portfolioSummary.previousContributionMargin}%`,
                `${health.avgContributionMargin.value}%`,
              ],
              trajectory: classifyTrajectory(portfolioSummary.twoMonthAgoContributionMargin, portfolioSummary.previousContributionMargin, health.avgContributionMargin.value, true),
            }}
            stats={[
              { label: 'Dead Stock', value: health.deadStockPercent.label, color: health.deadStockPercent.status === 'red' ? 'text-red-600 dark:text-red-400' : 'text-amber-700 dark:text-amber-400' },
              { label: 'Exp 90d', value: health.expirationRisk90d.label, color: health.expirationRisk90d.status === 'red' ? 'text-red-600 dark:text-red-400' : 'text-amber-700 dark:text-amber-400' },
              { label: 'Turns', value: `${health.inventoryTurns.value}x/yr`, color: health.inventoryTurns.status === 'green' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400' },
            ]}
          />
          <PillarCard
            icon={Truck}
            iconColor="text-orange-600 dark:text-orange-400"
            title="Fulfillment"
            status={fulfillmentStatus}
            heroValue={`${fStats.healthScore}/100`}
            heroLabel="Health Score"
            heroTrend={{
              direction: fStats.healthScore > fStats.previousHealthScore ? 'up' : fStats.healthScore < fStats.previousHealthScore ? 'down' : 'flat',
              label: `from ${fStats.previousHealthScore} last month`,
              sentiment: fStats.healthScore > fStats.previousHealthScore ? 'good' : fStats.healthScore < fStats.previousHealthScore ? 'bad' : 'neutral',
            }}
            trendHistory={{
              points: [
                `${fStats.twoMonthAgoHealthScore}`,
                `${fStats.previousHealthScore}`,
                `${fStats.healthScore}`,
              ],
              trajectory: classifyTrajectory(fStats.twoMonthAgoHealthScore, fStats.previousHealthScore, fStats.healthScore, true),
            }}
            stats={[
              { label: 'Cost/Order', value: `$${fStats.costPerOrder} vs $${fStats.costPerOrderBenchmark}`, color: fStats.costPerOrder > fStats.costPerOrderBenchmark ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Same-Day', value: `${fStats.sameDayRate}%`, color: fStats.sameDayRate >= fStats.sameDayBenchmark ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400' },
              { label: 'Returns', value: `${fStats.returnRate}% vs ${fStats.returnBenchmark}%`, color: fStats.returnRate > fStats.returnBenchmark ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400' },
              ...(fStats.hiddenCostGap > 10000 ? [{ label: 'Hidden Cost', value: `$${(fStats.hiddenCostGap / 1000).toFixed(1)}K/mo`, color: 'text-red-600 dark:text-red-400' }] : []),
            ]}
          />
          <PillarCard
            icon={Wallet}
            iconColor="text-blue-600 dark:text-blue-400"
            title="Cash Flow"
            status={cashStatus}
            heroValue={`${runwayMonths} mo`}
            heroLabel="Op Runway"
            alertText={cashAlert}
            heroTrend={{
              direction: runwayMonths < prevRunwayMonths ? 'down' : runwayMonths > prevRunwayMonths ? 'up' : 'flat',
              label: `from ${prevRunwayMonths} mo`,
              sentiment: runwayMonths < prevRunwayMonths ? 'bad' : 'good',
            }}
            trendHistory={{
              points: [
                `${twoMonthAgoRunwayMonths}mo`,
                `${prevRunwayMonths}mo`,
                `${runwayMonths}mo`,
              ],
              trajectory: classifyTrajectory(twoMonthAgoRunwayMonths, prevRunwayMonths, runwayMonths, true),
            }}
            stats={[
              { label: 'Health', value: `${cashHealthScore}/100`, color: cashHealthScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : cashHealthScore >= 60 ? 'text-amber-700 dark:text-amber-400' : 'text-red-600 dark:text-red-400' },
              { label: 'WC Ratio', value: `${workingCapital.ratio.toFixed(2)}x`, color: workingCapital.ratio >= 2.0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400' },
              { label: 'CCC', value: `${cashConversionCycle.current.ccc}d`, color: 'text-amber-700 dark:text-amber-400' },
              { label: 'In-Transit', value: `$${(totalInTransit / 1000).toFixed(1)}K` },
            ]}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 4: Critical Alerts - Full Detail (deduplicated from gradient teaser)
          ═══════════════════════════════════════════════ */}
      {criticalInsights.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl p-5">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 animate-pulse" />
            Critical - Requires Immediate Action ({criticalInsights.length})
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
            ✓ No critical alerts - all systems operational
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION 5: Ad Spend Overview (Lux QW1 V37: contained card, QW2: orange gradient)
          ═══════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/20 dark:shadow-orange-900/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Ad Spend & ROAS
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Blended efficiency metrics
            </p>
          </div>
        </div>

        {/* 4 Essential Metrics — inner cards use bg-slate-50 to nest inside white container */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* MER - North Star */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">MER</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold">★</span>
            </div>
            <p className={clsx('text-xl font-bold tabular-nums', merStatusColor)}>{currentMER.toFixed(1)}x</p>
            <div className="flex items-center gap-1 mt-0.5">
              {merIsDecline ? (
                <TrendingDown className="w-3 h-3 text-red-500" />
              ) : (
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              )}
              <span className={clsx('text-xs', merIsDecline ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>
                {merChange >= 0 ? '+' : ''}{merChange.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Blended CAC */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className={`w-3.5 h-3.5 ${cacRising ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Blended CAC</span>
            </div>
            <p className={clsx('text-xl font-bold tabular-nums', cacRising ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white')}>
              {formatCurrency(summary.blendedCac)}
            </p>
            <p className={clsx('text-xs mt-0.5', cacRising ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>
              {cacRising ? '↑' : '↓'} {Math.abs(Math.round(((summary.blendedCac - summary.previousBlendedCac) / summary.previousBlendedCac) * 100))}% from {formatCurrency(summary.previousBlendedCac)}
            </p>
          </div>

          {/* Avg 365d LTV */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg 365d LTV</span>
            </div>
            <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(summary.avgLtv365)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              LTV:CAC {(summary.avgLtv365 / summary.blendedCac).toFixed(1)}:1
            </p>
          </div>

          {/* CAC Payback */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">CAC Payback</span>
            </div>
            <p className={clsx(
              'text-xl font-bold tabular-nums',
              (summary.blendedCac / (summary.avgLtv365 / 12)) <= 3 ? 'text-emerald-600' : 'text-amber-600'
            )}>
              {(summary.blendedCac / (summary.avgLtv365 / 12)).toFixed(1)} mo
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Target: &lt;3 mo
            </p>
          </div>
        </div>

        <ChannelCorrelationsBadge />

        <div className="text-center">
          <button className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            See channel breakdown in Marketing tab
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 6: Cash Flow Snapshot
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <CashFlowCard metrics={cashFlowMetrics} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <CashFlowForecast metrics={cashFlowMetrics} />
        </div>
      </div>
    </div>
  );
}
