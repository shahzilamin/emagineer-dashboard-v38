import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Package, AlertTriangle, Settings2 } from 'lucide-react';
import { MetricCard, MiniMetric } from '../../common/MetricCard';
import { ProgressBar, StatusBadge } from '../../common/StatusIndicator';
import { RevenueChart } from '../../charts/RevenueChart';
import { DonutChart, DonutLegend } from '../../charts/DonutChart';
import { ChannelTable, InventoryTable } from '../../charts/DataTable';
import { SKUContributionMatrix, ProductHealthTrafficLights, InventoryVelocity, ChannelArbitrage, ProductKillList } from '../../product';
import { FulfillmentHealthPanel, ThreePLDashboard, ReturnsAnalytics } from '../../fulfillment';
import {
  wellBeforeMetrics,
  dailyMetrics,
  channelPerformance,
  monthlyTargets,
  weeklyComparison,
} from '../../../data/wellbefore';
import { formatCurrency, formatNumber } from '../../../utils/format';

const sectionGroups = [
  {
    label: 'Supply Chain',
    sections: [
      { id: 'overview', label: 'Health Check' },
      { id: 'fulfillment-health', label: 'Fulfillment' },
      { id: '3pl', label: '3PL' },
      { id: 'returns', label: 'Returns' },
    ],
  },
  {
    label: 'Product & Inventory',
    sections: [
      { id: 'product-intel', label: 'Products' },
      { id: 'sku-matrix', label: 'SKU x Channel' },
      { id: 'inventory', label: 'Inventory' },
      { id: 'kill-list', label: 'Kill List' },
      { id: 'fulfillment', label: 'Order Processing' },
    ],
  },
];

// Flatten for scroll spy
const sections = sectionGroups.flatMap(g => g.sections);

export function OperationsTab() {
  const metrics = wellBeforeMetrics;
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('ops-', '');
            setActiveSection(id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(`ops-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`ops-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const revenueByChannel = [
    { name: 'Shopify', value: metrics.revenue.byChannel.shopify, color: '#3b82f6' },
    { name: 'Amazon', value: metrics.revenue.byChannel.amazon, color: '#f59e0b' },
    { name: 'Wholesale', value: metrics.revenue.byChannel.wholesale, color: '#22c55e' },
    { name: 'Subscriptions', value: metrics.revenue.byChannel.subscriptions, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/20">
            <Settings2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Operations Command Center</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300">
              Fulfillment, inventory, channel performance & revenue
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Cash Position</p>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(metrics.profitability.cashPosition, true)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Runway</p>
            <p className="text-base sm:text-lg font-bold text-emerald-600">{metrics.profitability.runway} mo</p>
          </div>
        </div>
      </div>

      {/* Section Navigation (Lux: Grouped layout with category dividers) */}
      <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm -mx-1 px-1 py-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {sectionGroups.map((group, gIdx) => (
            <div key={group.label} className="flex items-center gap-1">
              {gIdx > 0 && (
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1 flex-shrink-0" />
              )}
              <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold px-1 flex-shrink-0 hidden sm:block">
                {group.label}
              </span>
              {group.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0',
                    activeSection === section.id
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  )}
                >
                  {section.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Target Progress Bar */}
      <div id="ops-overview" className="scroll-mt-16">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 overflow-x-auto">
        <div className="flex lg:grid lg:grid-cols-5 gap-4 min-w-max lg:min-w-0">
          <div className="min-w-[120px]">
            <ProgressBar
              current={monthlyTargets.revenue.current}
              target={monthlyTargets.revenue.target}
              label="Revenue"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(monthlyTargets.revenue.current, true)} / {formatCurrency(monthlyTargets.revenue.target, true)}
            </p>
          </div>
          <div className="min-w-[120px]">
            <ProgressBar
              current={monthlyTargets.orders.current}
              target={monthlyTargets.orders.target}
              label="Orders"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatNumber(monthlyTargets.orders.current)} / {formatNumber(monthlyTargets.orders.target)}
            </p>
          </div>
          <div className="min-w-[120px]">
            <ProgressBar
              current={monthlyTargets.newCustomers.current}
              target={monthlyTargets.newCustomers.target}
              label="Customers"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatNumber(monthlyTargets.newCustomers.current)} / {formatNumber(monthlyTargets.newCustomers.target)}
            </p>
          </div>
          <div className="min-w-[120px]">
            <ProgressBar
              current={monthlyTargets.grossMargin.current}
              target={monthlyTargets.grossMargin.target}
              label="Margin"
            />
            <p className="text-xs text-slate-500 mt-1">
              {monthlyTargets.grossMargin.current}% / {monthlyTargets.grossMargin.target}%
            </p>
          </div>
          <div className="min-w-[120px]">
            <ProgressBar
              current={monthlyTargets.cac.target}
              target={monthlyTargets.cac.current}
              label="CAC"
            />
            <p className="text-xs text-slate-500 mt-1">
              ${monthlyTargets.cac.current} / ${monthlyTargets.cac.target} target
            </p>
          </div>
        </div>
      </div>

      </div>

      {/* ═══════════════════════════════════════════════
          FULFILLMENT INTELLIGENCE (Nova Brief 7 - Pillar 7)
          ═══════════════════════════════════════════════ */}

      <div id="ops-fulfillment-health" className="scroll-mt-16">
        <FulfillmentHealthPanel />
      </div>

      <div id="ops-3pl" className="scroll-mt-16">
        <ThreePLDashboard />
      </div>

      <div id="ops-returns" className="scroll-mt-16">
        <ReturnsAnalytics />
      </div>

      {/* ═══════════════════════════════════════════════
          PRODUCT INTELLIGENCE (Nova Brief 4)
          ═══════════════════════════════════════════════ */}

      <div id="ops-product-intel" className="scroll-mt-16">
        <ProductHealthTrafficLights />
      </div>

      <div id="ops-sku-matrix" className="scroll-mt-16">
        <SKUContributionMatrix />
      </div>

      <div id="ops-inventory" className="scroll-mt-16 space-y-6">
        <InventoryVelocity />
        <ChannelArbitrage />
      </div>

      <div id="ops-kill-list" className="scroll-mt-16">
        <ProductKillList />
      </div>

      {/* ═══════════════════════════════════════════════
          FULFILLMENT & OPERATIONS
          ═══════════════════════════════════════════════ */}

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Top metrics row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard title="Today's Revenue" value={metrics.revenue.today} format="currency" subtitle="vs yesterday" compact />
            <MetricCard title="MTD Revenue" value={metrics.revenue.mtd} format="currency" subtitle="vs last month" compact />
            <MetricCard title="Today's Orders" value={metrics.orders.today} format="number" subtitle="vs yesterday" compact />
            <MetricCard title="AOV" value={metrics.orders.averageValue} format="currency" subtitle="vs last week" compact />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Revenue & Orders (30 Days)</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-slate-600 dark:text-slate-300">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-amber-500" />
                  <span className="text-slate-600 dark:text-slate-300">Orders</span>
                </div>
              </div>
            </div>
            <RevenueChart data={dailyMetrics} height={220} />
          </div>

          {/* Marketing Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Marketing Performance (MTD)</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">
                  Spend: {formatCurrency(metrics.marketing.spend.mtd.current, true)} / {formatCurrency(metrics.marketing.spend.budget, true)}
                </span>
                <StatusBadge
                  status={metrics.marketing.spend.pacing > 100 ? 'warning' : 'healthy'}
                  label={`${metrics.marketing.spend.pacing.toFixed(0)}% paced`}
                />
              </div>
            </div>
            <ChannelTable channels={channelPerformance} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Revenue by Channel</h3>
            <DonutChart
              data={revenueByChannel}
              height={160}
              centerValue={formatCurrency(metrics.revenue.mtd.current, true)}
              centerLabel="MTD"
            />
            <div className="mt-4">
              <DonutLegend data={revenueByChannel} />
            </div>
          </div>

          {/* Fulfillment */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Fulfillment</h3>
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700">
              <MiniMetric label="Shipped Today" value={metrics.fulfillment.shippedToday.current} change={metrics.fulfillment.shippedToday.changePercent} />
              <MiniMetric label="On-Time Rate" value={metrics.fulfillment.onTimeRate.current} change={metrics.fulfillment.onTimeRate.changePercent} format="percent" />
              <MiniMetric label="Avg Ship Time" value={metrics.fulfillment.avgShipTime.current} change={metrics.fulfillment.avgShipTime.changePercent} invertTrendColor />
              <MiniMetric label="Cost/Order" value={metrics.fulfillment.costPerOrder.current} change={metrics.fulfillment.costPerOrder.changePercent} format="currency" invertTrendColor />
            </div>
          </div>

          {/* Customer Health */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Customer Health</h3>
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700">
              <MiniMetric label="LTV" value={metrics.customers.ltv.current} change={metrics.customers.ltv.changePercent} format="currency" />
              <MiniMetric label="CAC (Blended)" value={metrics.marketing.cac.blended.current} change={metrics.marketing.cac.blended.changePercent} format="currency" invertTrendColor />
              <MiniMetric label="LTV:CAC Ratio" value={metrics.customers.ltvCacRatio.current} change={metrics.customers.ltvCacRatio.changePercent} />
              <MiniMetric label="Repeat Rate" value={metrics.customers.repeatRate.current} change={metrics.customers.repeatRate.changePercent} format="percent" />
            </div>
          </div>
        </div>

        {/* Inventory Alerts - Full Width */}
        <div id="ops-fulfillment" className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">Stockout Risk ({metrics.inventory.stockoutRisk.length})</h3>
            </div>
            <InventoryTable items={metrics.inventory.stockoutRisk} type="stockout" />
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <Package className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">Dead Stock ({metrics.inventory.deadStock.length})</h3>
              <span className="text-xs text-slate-500">
                {formatCurrency(metrics.inventory.deadStock.reduce((s, i) => s + i.value, 0), true)} tied up
              </span>
            </div>
            <InventoryTable items={metrics.inventory.deadStock} type="deadstock" />
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="col-span-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 overflow-x-auto">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Period Comparison</h3>
          <div className="flex lg:grid lg:grid-cols-5 gap-4 min-w-max lg:min-w-0">
            {['Revenue', 'Orders', 'AOV', 'Ad Spend', 'New Customers'].map((metric, i) => {
              const keys = ['revenue', 'orders', 'aov', 'adSpend', 'newCustomers'] as const;
              const key = keys[i];
              const thisWeek = weeklyComparison.thisWeek[key];
              const lastWeek = weeklyComparison.lastWeek[key];
              const lastYear = weeklyComparison.lastYear[key];
              const wowChange = ((thisWeek - lastWeek) / lastWeek) * 100;
              const yoyChange = ((thisWeek - lastYear) / lastYear) * 100;

              return (
                <div key={metric} className="text-center min-w-[80px]">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{metric === 'New Customers' ? 'New Cust' : metric}</p>
                  <p className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">
                    {metric === 'Revenue' || metric === 'Ad Spend' || metric === 'AOV'
                      ? formatCurrency(thisWeek, true)
                      : formatNumber(thisWeek)}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 mt-1">
                    <span className={clsx('text-xs font-medium', wowChange >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                      {wowChange >= 0 ? '+' : ''}{wowChange.toFixed(1)}% WoW
                    </span>
                    <span className={clsx('text-xs font-medium', yoyChange >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                      {yoyChange >= 0 ? '+' : ''}{yoyChange.toFixed(1)}% YoY
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
