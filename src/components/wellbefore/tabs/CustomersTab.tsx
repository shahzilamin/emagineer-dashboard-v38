import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { clsx } from 'clsx';
import { CohortAnalytics } from '../../cohorts';
import { MetricCard, MiniMetric } from '../../common/MetricCard';
import { SubscriptionDeepDive } from '../../subscriptions';
import { RFMSegmentation, SubscriberHealthScore, ChurnRiskMonitor, CustomerProfitability } from '../../customers';
import { wellBeforeMetrics, monthlyTargets } from '../../../data/wellbefore';
import { formatCurrency, formatNumber } from '../../../utils/format';

const sections = [
  { id: 'health', label: 'Health Metrics' },
  { id: 'rfm', label: 'RFM Segments' },
  { id: 'subscriber-health', label: 'Health Scores' },
  { id: 'churn', label: 'Churn Risk' },
  { id: 'profitability', label: 'Profitability' },
  { id: 'subscription', label: 'Subscription Deep Dive' },
  { id: 'cohort', label: 'Cohort Analytics' },
];

export function CustomersTab() {
  const metrics = wellBeforeMetrics;
  const [activeSection, setActiveSection] = useState('health');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('cust-', '');
            setActiveSection(id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(`cust-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`cust-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Intelligence</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">RFM segmentation, health scores, churn prediction & cohort analytics</p>
        </div>
      </div>

      {/* Section Navigation - Blue accent (Lux: completes tab color system) */}
      <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm -mx-1 px-1 py-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                activeSection === s.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Health Metrics (Hero KPIs) */}
      <div id="cust-health" className="scroll-mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Customer LTV"
            value={metrics.customers.ltv}
            format="currency"
            subtitle="vs last month"
            showStatus
          />
          <MetricCard
            title="LTV:CAC Ratio"
            value={metrics.customers.ltvCacRatio}
            subtitle="vs last month"
            showStatus
          />
          <MetricCard
            title="Repeat Rate"
            value={metrics.customers.repeatRate}
            format="percent"
            subtitle="vs last month"
            showStatus
          />
          <MetricCard
            title="Blended CAC"
            value={metrics.marketing.cac.blended}
            format="currency"
            subtitle="vs last month"
            showStatus
            invertTrendColor
          />
        </div>

        {/* Customer Details Row */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* Customer Acquisition & Health */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Customer Health Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <MiniMetric
                    label="New Customers (MTD)"
                    value={monthlyTargets.newCustomers.current}
                    change={((monthlyTargets.newCustomers.current / monthlyTargets.newCustomers.target) * 100 - 100)}
                  />
                </div>
                <div className="space-y-1">
                  <MiniMetric
                    label="Churn Risk"
                    value={metrics.customers.churnRisk}
                    change={0}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-300">New vs Returning</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-blue-600">{metrics.orders.newVsReturning.new}%</span>
                      <span className="text-xs text-slate-500">/</span>
                      <span className="text-sm font-semibold text-emerald-600">{metrics.orders.newVsReturning.returning}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <MiniMetric
                    label="CAC (Meta)"
                    value={metrics.marketing.cac.byChannel.meta}
                    change={0}
                    format="currency"
                  />
                </div>
                <div className="space-y-1">
                  <MiniMetric
                    label="CAC (Google)"
                    value={metrics.marketing.cac.byChannel.google}
                    change={0}
                    format="currency"
                  />
                </div>
                <div className="space-y-1">
                  <MiniMetric
                    label="CAC (Email)"
                    value={metrics.marketing.cac.byChannel.email}
                    change={0}
                    format="currency"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Acquisition Summary */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Acquisition Snapshot</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500">New Customers MTD</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {formatNumber(monthlyTargets.newCustomers.current)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, (monthlyTargets.newCustomers.current / monthlyTargets.newCustomers.target) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {((monthlyTargets.newCustomers.current / monthlyTargets.newCustomers.target) * 100).toFixed(0)}% to {formatNumber(monthlyTargets.newCustomers.target)} target
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500">Avg LTV</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {formatCurrency(metrics.customers.ltv.current)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Repeat Purchase Rate</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {metrics.customers.repeatRate.current}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: RFM Customer Segmentation (Nova Pillar 6) */}
      <div id="cust-rfm" className="scroll-mt-16">
        <RFMSegmentation />
      </div>

      {/* NEW: Subscriber Health Score (Nova Pillar 6) */}
      <div id="cust-subscriber-health" className="scroll-mt-16">
        <SubscriberHealthScore />
      </div>

      {/* NEW: Churn Risk Monitor (Nova Pillar 6) */}
      <div id="cust-churn" className="scroll-mt-16">
        <ChurnRiskMonitor />
      </div>

      {/* NEW: Customer Profitability + Cross-Channel + Migration (Nova Pillar 6) */}
      <div id="cust-profitability" className="scroll-mt-16">
        <CustomerProfitability />
      </div>

      {/* Subscription Deep Dive */}
      <div id="cust-subscription" className="scroll-mt-16">
        <SubscriptionDeepDive />
      </div>

      {/* Cohort Analytics - Full Width */}
      <div id="cust-cohort" className="scroll-mt-16">
        <CohortAnalytics />
      </div>
    </div>
  );
}
