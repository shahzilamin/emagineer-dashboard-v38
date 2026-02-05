import { Megaphone } from 'lucide-react';
import { DonutChart, DonutLegend } from '../../charts/DonutChart';
import { SparklineChart } from '../../charts/SparklineChart';
import {
  d2cBuildersMetrics,
  revenueByStreamTrend,
  clients,
} from '../../../data/d2cbuilders';
import { formatCurrency, formatPercentPlain } from '../../../utils/format';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export function D2CMarketingTab() {
  const metrics = d2cBuildersMetrics;

  const revenueByStream = [
    { name: 'Shipping', value: metrics.revenue.byStream.shipping, color: '#3b82f6' },
    { name: 'Pick & Pack', value: metrics.revenue.byStream.pickPack, color: '#22c55e' },
    { name: 'Storage', value: metrics.revenue.byStream.storage, color: '#f59e0b' },
    { name: 'Hourly', value: metrics.revenue.byStream.hourly, color: '#8b5cf6' },
  ];

  // For a 3PL, "marketing" is really about client revenue growth and diversification
  const clientRevenueRanked = [...clients].sort((a, b) => b.revenue - a.revenue);
  const totalRevenue = clientRevenueRanked.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Revenue Growth & Diversification</h2>
          <p className="text-sm text-slate-500">Revenue streams, client growth, and service mix analysis</p>
        </div>
      </div>

      {/* Revenue Stream Trend */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Revenue by Stream (6 Months)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueByStreamTrend} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              formatter={(value: number | undefined) => [value != null ? formatCurrency(value) : '', '']}
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Legend iconType="circle" />
            <Bar dataKey="shipping" name="Shipping" fill="#3b82f6" radius={[2, 2, 0, 0]} stackId="revenue" />
            <Bar dataKey="pickPack" name="Pick & Pack" fill="#22c55e" radius={[2, 2, 0, 0]} stackId="revenue" />
            <Bar dataKey="storage" name="Storage" fill="#f59e0b" radius={[2, 2, 0, 0]} stackId="revenue" />
            <Bar dataKey="hourly" name="Hourly" fill="#8b5cf6" radius={[2, 2, 0, 0]} stackId="revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Current Mix + Revenue Trend */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Current Revenue Mix</h3>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Daily Revenue Trend (30 Days)</h3>
              <p className="text-lg font-bold text-emerald-600">+{metrics.revenue.mtd.changePercent.toFixed(1)}%</p>
            </div>
            <SparklineChart
              data={metrics.revenue.trend}
              height={180}
              color="green"
              showTooltip
            />
          </div>
        </div>
      </div>

      {/* Client Revenue Distribution */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Client Revenue Share</h3>
        <div className="space-y-3">
          {clientRevenueRanked.map((client) => {
            const share = (client.revenue / totalRevenue) * 100;
            return (
              <div key={client.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{client.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(client.revenue, true)}</span>
                    <span className="text-xs text-slate-500 w-12 text-right">{share.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${share > 20 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${share}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500">
            {metrics.clients.concentration > 20 ? (
              <>⚠️ Top client concentration at <strong className="text-amber-600">{metrics.clients.concentration.toFixed(1)}%</strong> — target is under 20% for healthy diversification.</>
            ) : (
              <>✅ Client concentration at <strong className="text-emerald-600">{metrics.clients.concentration.toFixed(1)}%</strong> — well diversified.</>
            )}
          </p>
        </div>
      </div>

      {/* Service Profitability */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Service Profitability by Client (Top 6)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="text-left text-xs text-slate-500 font-medium pb-3">Client</th>
                <th className="text-right text-xs text-slate-500 font-medium pb-3 px-3">Revenue</th>
                <th className="text-right text-xs text-slate-500 font-medium pb-3 px-3">Orders</th>
                <th className="text-right text-xs text-slate-500 font-medium pb-3 px-3">Margin</th>
                <th className="text-right text-xs text-slate-500 font-medium pb-3 px-3">Rev/Order</th>
                <th className="text-center text-xs text-slate-500 font-medium pb-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {clientRevenueRanked.slice(0, 6).map((client) => (
                <tr key={client.id} className="border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                  <td className="py-3 font-medium text-slate-900 dark:text-white">{client.name}</td>
                  <td className="py-3 px-3 text-right">{formatCurrency(client.revenue, true)}</td>
                  <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300">{client.orders.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={client.margin >= 28 ? 'text-emerald-600 font-medium' : client.margin >= 22 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium'}>
                      {formatPercentPlain(client.margin)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300">
                    {formatCurrency(client.revenue / client.orders)}
                  </td>
                  <td className="py-3 text-center">
                    {client.trend === 'up' && <span className="text-emerald-600">↑</span>}
                    {client.trend === 'down' && <span className="text-red-600">↓</span>}
                    {client.trend === 'flat' && <span className="text-slate-400">→</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
