import { Settings2 } from 'lucide-react';
import { MiniMetric } from '../../common/MetricCard';
import { ProgressBar } from '../../common/StatusIndicator';
import {
  d2cBuildersMetrics,
  monthlyTargets,
  weeklyOperations,
  laborEfficiencyByDay,
  storageByClient,
} from '../../../data/d2cbuilders';
import { formatNumber } from '../../../utils/format';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export function D2COperationsTab() {
  const metrics = d2cBuildersMetrics;

  const operationsData = Object.entries(weeklyOperations).map(([day, data]) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    orders: data.orders,
    errors: data.errors,
    efficiency: (data.orders / data.laborHours).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/20">
          <Settings2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Operations</h2>
          <p className="text-sm text-slate-500">Fulfillment, warehouse, labor efficiency & targets</p>
        </div>
      </div>

      {/* Target Progress */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Monthly Targets</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <ProgressBar current={monthlyTargets.orders.current} target={monthlyTargets.orders.target} label="Orders" />
            <p className="text-xs text-slate-500 mt-1">{formatNumber(monthlyTargets.orders.current)} / {formatNumber(monthlyTargets.orders.target)}</p>
          </div>
          <div>
            <ProgressBar current={monthlyTargets.onTimeRate.current} target={monthlyTargets.onTimeRate.target} label="On-Time Rate" />
            <p className="text-xs text-slate-500 mt-1">{monthlyTargets.onTimeRate.current}% / {monthlyTargets.onTimeRate.target}%</p>
          </div>
          <div>
            <ProgressBar current={monthlyTargets.errorRate.target} target={monthlyTargets.errorRate.current} label="Error Rate" />
            <p className="text-xs text-slate-500 mt-1">{monthlyTargets.errorRate.current}% / {monthlyTargets.errorRate.target}% target</p>
          </div>
          <div>
            <ProgressBar current={monthlyTargets.grossMargin.current} target={monthlyTargets.grossMargin.target} label="Margin" />
            <p className="text-xs text-slate-500 mt-1">{monthlyTargets.grossMargin.current}% / {monthlyTargets.grossMargin.target}%</p>
          </div>
          <div>
            <ProgressBar current={monthlyTargets.revenue.current} target={monthlyTargets.revenue.target} label="Revenue" />
            <p className="text-xs text-slate-500 mt-1">{monthlyTargets.revenue.percentComplete.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Operations Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <MiniMetric label="Orders Today" value={metrics.operations.ordersToday.current} change={metrics.operations.ordersToday.changePercent} />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <MiniMetric label="Orders MTD" value={metrics.operations.ordersMtd.current} change={metrics.operations.ordersMtd.changePercent} />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <MiniMetric label="Orders/Labor Hr" value={metrics.operations.ordersPerLaborHour.current} change={metrics.operations.ordersPerLaborHour.changePercent} />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <MiniMetric label="Error Rate" value={metrics.operations.errorRate.current} change={metrics.operations.errorRate.changePercent} format="percent" invertTrendColor />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <MiniMetric label="On-Time Rate" value={metrics.operations.onTimeRate.current} change={metrics.operations.onTimeRate.changePercent} format="percent" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <MiniMetric label="Avg Ship Time" value={metrics.operations.avgShipTime.current} change={metrics.operations.avgShipTime.changePercent} invertTrendColor />
        </div>
      </div>

      {/* Weekly Orders + Labor Efficiency */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Weekly Order Volume</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={operationsData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Labor Efficiency by Day</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={laborEfficiencyByDay} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[10, 16]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <ReferenceLine y={12} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Target', fill: '#ef4444', fontSize: 10 }} />
                <Bar dataKey="ordersPerHour" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Warehouse */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Warehouse</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <MiniMetric label="Utilization" value={metrics.warehouse.utilization.current} change={metrics.warehouse.utilization.changePercent} format="percent" />
              </div>
              <div>
                <MiniMetric label="Rev/Sq Ft" value={metrics.warehouse.revenuePerSqFt.current} change={metrics.warehouse.revenuePerSqFt.changePercent} format="currency" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-sm text-slate-500">
                <strong className="text-slate-900 dark:text-white">{metrics.warehouse.palletsStored}</strong> pallets stored
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Storage by Client</h3>
            <div className="space-y-2">
              {storageByClient.sort((a, b) => b.pallets - a.pallets).slice(0, 6).map((item) => (
                <div key={item.client} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{item.client}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{item.pallets}p</span>
                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(item.pallets / metrics.warehouse.palletsStored) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
