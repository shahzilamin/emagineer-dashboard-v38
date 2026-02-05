import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { clsx } from 'clsx';
import { CashFlowCard, CashFlowForecast, UpcomingExpenses, ARAPSummary } from '../../common/CashFlowCard';
import { GoalTrajectoryGrid } from '../../common/GoalTrajectory';
import { PLSection } from '../../common/PLWaterfall';
import { MiniMetric } from '../../common/MetricCard';
import { SubscriptionHealthPanel } from '../../subscriptions';
import { TariffScenarioPlanner, MarginWaterfall, CashConversionCycle } from '../../tariffs';
import { ThirteenWeekForecast, CashRunwayGauges, CashInTransitPanel, NetCashFlowWaterfall, SupplierTermsTracker } from '../../cashflow';
import { wellBeforeMetrics, cashFlowMetrics } from '../../../data/wellbefore';
import { wellBeforePnL, wellBeforePnLTable, monthlyPnLTrend, wellBeforeCostBreakdown } from '../../../data/pnl';
import { formatCurrency } from '../../../utils/format';

const sections = [
  { id: 'profitability', label: 'Profitability' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'tariffs', label: 'Tariffs & COGS' },
  { id: 'waterfall', label: 'Waterfall' },
  { id: 'cash-intel', label: 'Cash Intelligence' },
  { id: 'cash', label: 'Cash & CCC' },
  { id: 'pnl', label: 'P&L' },
  { id: 'goals', label: 'Goals' },
];

export function FinancialTab() {
  const metrics = wellBeforeMetrics;
  const [activeSection, setActiveSection] = useState('profitability');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('fin-', '');
            setActiveSection(id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(`fin-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`fin-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Financial Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">P&L, cash flow, AR/AP, and goal tracking</p>
        </div>
      </div>

      {/* Section Navigation (Lux: Financial tab needs jump links) */}
      <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm -mx-1 px-1 py-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                activeSection === s.id
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profitability Quick Stats */}
      <div id="fin-profitability" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 scroll-mt-16">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Profitability Summary</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <MiniMetric
              label="Gross Margin"
              value={metrics.profitability.grossMargin.current}
              change={metrics.profitability.grossMargin.changePercent}
              format="percent"
            />
          </div>
          <div className="space-y-1">
            <MiniMetric
              label="Contribution Margin"
              value={metrics.profitability.contributionMargin.current}
              change={metrics.profitability.contributionMargin.changePercent}
              format="percent"
            />
          </div>
          <div className="space-y-1">
            <MiniMetric
              label="Net Profit (MTD)"
              value={metrics.profitability.netProfit.current}
              change={metrics.profitability.netProfit.changePercent}
              format="currency"
            />
          </div>
          <div className="space-y-1">
            <MiniMetric
              label="OpEx Ratio"
              value={metrics.profitability.operatingExpenseRatio.current}
              change={metrics.profitability.operatingExpenseRatio.changePercent}
              format="percent"
              invertTrendColor
            />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-6 text-sm">
          <span className="text-slate-500">Cash Position: <strong className="text-slate-900 dark:text-white">{formatCurrency(metrics.profitability.cashPosition, true)}</strong></span>
          <span className="text-slate-500">Runway: <strong className="text-emerald-600">{metrics.profitability.runway} months</strong></span>
        </div>
      </div>

      {/* Subscription Health */}
      <div id="fin-subscriptions" className="scroll-mt-16">
        <SubscriptionHealthPanel />
      </div>

      {/* Tariff & COGS Scenario Planner */}
      <div id="fin-tariffs" className="scroll-mt-16">
        <TariffScenarioPlanner />
      </div>

      {/* Revenue-to-Profit Margin Waterfall */}
      <div id="fin-waterfall" className="scroll-mt-16">
        <MarginWaterfall />
      </div>

      {/* ═══════════════════════════════════════════════
          CASH FLOW INTELLIGENCE - Nova Pillar 9
          The Survival Layer
          ═══════════════════════════════════════════════ */}
      <div id="fin-cash-intel" className="scroll-mt-16 space-y-6">
        {/* 13-Week Rolling Cash Forecast (centerpiece) */}
        <ThirteenWeekForecast />

        {/* Cash Runway & Working Capital Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CashRunwayGauges />
          <CashInTransitPanel />
        </div>

        {/* Net Cash Flow Waterfall (Monthly) */}
        <NetCashFlowWaterfall />

        {/* Supplier Terms & CCC Optimization */}
        <SupplierTermsTracker />
      </div>

      {/* Cash Conversion Cycle (existing V22) */}
      <div id="fin-cash" className="scroll-mt-16">
        <CashConversionCycle />
      </div>

      {/* P&L Waterfall */}
      <div id="fin-pnl" className="scroll-mt-16">
      <PLSection
        title="P&L Waterfall — Where Every Dollar Goes"
        subtitle="Monthly income statement visualization (MTD)"
        waterfallData={wellBeforePnL}
        tableData={wellBeforePnLTable}
        trendData={monthlyPnLTrend}
        costBreakdown={wellBeforeCostBreakdown}
      />

      </div>

      {/* Cash Flow Detail */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <CashFlowCard metrics={cashFlowMetrics} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <CashFlowForecast metrics={cashFlowMetrics} />
        </div>
      </div>

      {/* AR/AP + Upcoming Expenses */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6">
          <ARAPSummary metrics={cashFlowMetrics} />
        </div>
        <div className="col-span-12 md:col-span-6">
          <UpcomingExpenses expenses={cashFlowMetrics.upcomingExpenses} />
        </div>
      </div>

      {/* Goal Trajectory Grid */}
      <div id="fin-goals" className="scroll-mt-16">
        <GoalTrajectoryGrid />
      </div>
    </div>
  );
}
