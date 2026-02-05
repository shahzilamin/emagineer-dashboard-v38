import { clsx } from 'clsx';
import { DollarSign, ArrowRight } from 'lucide-react';
import { PLSection } from '../../common/PLWaterfall';
import { MiniMetric } from '../../common/MetricCard';
import { DonutChart, DonutLegend } from '../../charts/DonutChart';
import { SparklineChart } from '../../charts/SparklineChart';
import {
  d2cBuildersMetrics,
  clientsByProfitability,
} from '../../../data/d2cbuilders';
import { d2cBuildersPnL } from '../../../data/pnl';
import { formatCurrency, formatPercentPlain } from '../../../utils/format';

export function D2CFinancialTab() {
  const metrics = d2cBuildersMetrics;

  const revenueByStream = [
    { name: 'Shipping', value: metrics.revenue.byStream.shipping, color: '#3b82f6' },
    { name: 'Pick & Pack', value: metrics.revenue.byStream.pickPack, color: '#22c55e' },
    { name: 'Storage', value: metrics.revenue.byStream.storage, color: '#f59e0b' },
    { name: 'Hourly', value: metrics.revenue.byStream.hourly, color: '#8b5cf6' },
  ];

  const topClients = [...clientsByProfitability].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Financial Overview</h2>
          <p className="text-sm text-slate-500">P&L, revenue streams, and client profitability</p>
        </div>
      </div>

      {/* Profitability Quick Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
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
              label="Net Profit (MTD)"
              value={metrics.profitability.netProfit.current}
              change={metrics.profitability.netProfit.changePercent}
              format="currency"
            />
          </div>
          <div className="space-y-1">
            <MiniMetric
              label="EBITDA"
              value={metrics.profitability.ebitda.current}
              change={metrics.profitability.ebitda.changePercent}
              format="currency"
            />
          </div>
          <div className="space-y-1">
            <MiniMetric
              label="Labor Cost/Order"
              value={metrics.costs.laborCostPerOrder.current}
              change={metrics.costs.laborCostPerOrder.changePercent}
              format="currency"
              invertTrendColor
            />
          </div>
        </div>
      </div>

      {/* P&L Waterfall */}
      <PLSection
        title="P&L Waterfall — D2C Builders"
        subtitle="Monthly income statement (MTD)"
        waterfallData={d2cBuildersPnL}
        compact
      />

      {/* Revenue by Stream + Client Revenue */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Revenue by Stream</h3>
            <DonutChart
              data={revenueByStream}
              height={200}
              centerValue={formatCurrency(metrics.revenue.mtd.current, true)}
              centerLabel="MTD Revenue"
            />
            <div className="mt-4">
              <DonutLegend data={revenueByStream} />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Top Clients by Revenue</h3>
            <div className="space-y-3">
              {topClients.map((client, i) => (
                <div key={client.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{client.name}</p>
                      <p className="text-xs text-slate-500">{client.orders.toLocaleString()} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(client.revenue, true)}
                    </p>
                    <p className={clsx(
                      'text-xs font-medium',
                      client.margin >= 28 ? 'text-emerald-600' : client.margin >= 22 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {formatPercentPlain(client.margin)} margin
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
              View all clients <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Revenue Trend (30 Days)</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(metrics.revenue.mtd.current, true)}
            </p>
            <p className="text-sm text-emerald-600">
              +{metrics.revenue.mtd.changePercent.toFixed(1)}% MTD
            </p>
          </div>
        </div>
        <SparklineChart
          data={metrics.revenue.trend}
          height={120}
          color="green"
          showTooltip
        />
      </div>

      {/* Costs & Margins */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Costs & Margins</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <MiniMetric
              label="Labor Cost (MTD)"
              value={metrics.costs.laborCost.current}
              change={metrics.costs.laborCost.changePercent}
              format="currency"
              invertTrendColor
            />
          </div>
          <div className="space-y-1">
            <MiniMetric
              label="Shipping Margin"
              value={metrics.costs.shippingMargin.current}
              change={metrics.costs.shippingMargin.changePercent}
              format="percent"
            />
          </div>
          <div className="space-y-1">
            <MiniMetric
              label="Revenue/Sq Ft"
              value={metrics.warehouse.revenuePerSqFt.current}
              change={metrics.warehouse.revenuePerSqFt.changePercent}
              format="currency"
            />
          </div>
          <div className="space-y-1">
            <MiniMetric
              label="Overhead (MTD)"
              value={metrics.costs.overhead}
              change={0}
              format="currency"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
