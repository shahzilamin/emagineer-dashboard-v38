import { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { clsx } from 'clsx';
import { AdSpendCommandCenter } from '../../adspend';
import { MERDashboard, MarginalROAS, CACPayback, EfficiencyTrafficLights, OrganicDependencyTracker, BudgetReallocator, ChannelCorrelations } from '../../marketing';
import { DonutChart, DonutLegend } from '../../charts/DonutChart';
import { wellBeforeMetrics } from '../../../data/wellbefore';
import { formatCurrency } from '../../../utils/format';

const sections = [
  { id: 'mer', label: 'MER & Efficiency' },
  { id: 'marginal', label: 'Marginal ROAS' },
  { id: 'cac-payback', label: 'CAC Payback' },
  { id: 'organic', label: 'Organic & Paid' },
  { id: 'budget', label: 'Budget Realloc' },
  { id: 'correlations', label: 'Cross-Channel' },
  { id: 'command', label: 'Command Center' },
  { id: 'revenue', label: 'Revenue Mix' },
];

export function MarketingTab() {
  const metrics = wellBeforeMetrics;
  const [activeSection, setActiveSection] = useState('mer');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('mkt-', '');
            setActiveSection(id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(`mkt-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`mkt-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const revenueByChannel = [
    { name: 'Shopify', value: metrics.revenue.byChannel.shopify, color: '#3b82f6' },
    { name: 'Amazon', value: metrics.revenue.byChannel.amazon, color: '#f59e0b' },
    { name: 'Wholesale', value: metrics.revenue.byChannel.wholesale, color: '#22c55e' },
    { name: 'Subscriptions', value: metrics.revenue.byChannel.subscriptions, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Marketing Spend Intelligence</h2>
          <p className="text-sm text-slate-500">MER, marginal ROAS, CAC payback, channel ROI, and revenue breakdown</p>
        </div>
      </div>

      {/* Section Navigation (Lux: Marketing tab needs jump links + scroll spy) */}
      <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm -mx-1 px-1 py-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                activeSection === s.id
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* MER North Star + Efficiency Traffic Lights */}
      <div id="mkt-mer" className="scroll-mt-16 space-y-6">
        <MERDashboard />
        <EfficiencyTrafficLights />
      </div>

      {/* Marginal ROAS - Diminishing Returns */}
      <div id="mkt-marginal" className="scroll-mt-16">
        <MarginalROAS />
      </div>

      {/* CAC Payback by Channel */}
      <div id="mkt-cac-payback" className="scroll-mt-16">
        <CACPayback />
      </div>

      {/* Organic Dependency Tracker */}
      <div id="mkt-organic" className="scroll-mt-16">
        <OrganicDependencyTracker />
      </div>

      {/* Budget Reallocation Recommendations */}
      <div id="mkt-budget" className="scroll-mt-16">
        <BudgetReallocator />
      </div>

      {/* Cross-Channel Amplification */}
      <div id="mkt-correlations" className="scroll-mt-16">
        <ChannelCorrelations />
      </div>

      {/* Full Ad Spend Command Center */}
      <div id="mkt-command" className="scroll-mt-16">
        <AdSpendCommandCenter />
      </div>

      {/* Revenue Breakdown by Channel */}
      <div id="mkt-revenue" className="scroll-mt-16 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Revenue by Channel</h3>
            <DonutChart
              data={revenueByChannel}
              height={220}
              centerValue={formatCurrency(metrics.revenue.mtd.current, true)}
              centerLabel="MTD Revenue"
            />
            <div className="mt-4">
              <DonutLegend data={revenueByChannel} />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Channel ROAS Comparison</h3>
            <div className="space-y-4">
              {[
                { name: 'Email', roas: metrics.marketing.roas.byChannel.email, color: 'bg-emerald-500' },
                { name: 'Google', roas: metrics.marketing.roas.byChannel.google, color: 'bg-blue-500' },
                { name: 'Meta', roas: metrics.marketing.roas.byChannel.meta, color: 'bg-indigo-500' },
              ].sort((a, b) => b.roas - a.roas).map((channel) => (
                <div key={channel.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{channel.name}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{channel.roas.toFixed(1)}x</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${channel.color} rounded-full transition-all`}
                      style={{ width: `${Math.min(100, (channel.roas / 8) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Blended ROAS</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {metrics.marketing.roas.blended.current.toFixed(1)}x
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-500">Total Ad Spend (MTD)</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatCurrency(metrics.marketing.spend.mtd.current, true)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
