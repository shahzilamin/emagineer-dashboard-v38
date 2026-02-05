import { clsx } from 'clsx';
import { Warehouse, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { threePLSummary } from '../../data/fulfillment';

function UtilizationGauge({ percent }: { percent: number }) {
  const color = percent >= 90 ? 'text-red-500' : percent >= 70 ? 'text-emerald-500' : 'text-amber-500';
  const barColor = percent >= 90 ? 'bg-red-500' : percent >= 70 ? 'bg-emerald-500' : 'bg-amber-500';
  const label = percent >= 90 ? 'Near Capacity' : percent >= 70 ? 'Optimal' : 'Underutilized';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500">Warehouse Utilization</span>
          <span className={clsx('text-xs font-semibold', color)}>{label}</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
          <div className={clsx('h-full rounded-full transition-all', barColor)} style={{ width: `${percent}%` }} />
          {/* Optimal zone markers */}
          <div className="absolute top-0 h-full w-0.5 bg-slate-300" style={{ left: '85%' }} title="85% optimal max" />
          <div className="absolute top-0 h-full w-0.5 bg-slate-300" style={{ left: '70%' }} title="70% optimal min" />
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-slate-400">0%</span>
          <span className="text-xs text-slate-400">Optimal: 70-85%</span>
          <span className="text-xs text-slate-400">100%</span>
        </div>
      </div>
      <span className={clsx('text-2xl font-bold tabular-nums', color)}>{percent}%</span>
    </div>
  );
}

export function ThreePLDashboard() {
  const summary = threePLSummary;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-purple-500" />
            3PL Business P&L
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            External fulfillment revenue vs cost — is the 3PL business making money?
          </p>
        </div>
        <div className={clsx(
          'px-3 py-1 rounded-full text-xs font-semibold',
          summary.netMarginPercent >= 15 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
          summary.netMarginPercent >= 8 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        )}>
          {summary.netMarginPercent}% Net Margin
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Revenue</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">${(summary.totalRevenue / 1000).toFixed(1)}K</p>
          <p className="text-xs text-slate-500">/month</p>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Costs</p>
          <p className="text-lg font-bold text-red-600 tabular-nums">${(summary.totalCost / 1000).toFixed(1)}K</p>
          <p className="text-xs text-slate-500">/month</p>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Net Profit</p>
          <p className="text-lg font-bold text-emerald-600 tabular-nums">${(summary.netMargin / 1000).toFixed(1)}K</p>
          <p className="text-xs text-slate-500">/month</p>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Clients</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{summary.clients.length}</p>
          <p className="text-xs text-slate-500">active</p>
        </div>
      </div>

      {/* Utilization */}
      <div className="mb-5">
        <UtilizationGauge percent={summary.utilizationPercent} />
      </div>

      {/* Client Profitability Table */}
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2 px-2 font-medium">Client</th>
              <th className="text-right py-2 px-2 font-medium">Revenue</th>
              <th className="text-right py-2 px-2 font-medium">Cost</th>
              <th className="text-right py-2 px-2 font-medium">Margin</th>
              <th className="text-right py-2 px-2 font-medium">Margin %</th>
              <th className="text-center py-2 px-2 font-medium">Orders</th>
              <th className="text-center py-2 px-2 font-medium">SKUs</th>
              <th className="text-center py-2 px-2 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {summary.clients.map((client) => (
              <tr key={client.name} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <div className={clsx(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      client.status === 'profitable' ? 'bg-emerald-500' :
                      client.status === 'marginal' ? 'bg-amber-500' : 'bg-red-500'
                    )} />
                    <span className="font-medium text-slate-900 dark:text-white text-xs">{client.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-2 text-right tabular-nums font-medium text-slate-700 dark:text-slate-300">
                  ${(client.monthlyRevenue / 1000).toFixed(1)}K
                </td>
                <td className="py-2.5 px-2 text-right tabular-nums text-slate-600 dark:text-slate-400">
                  ${(client.monthlyCost / 1000).toFixed(1)}K
                </td>
                <td className="py-2.5 px-2 text-right tabular-nums font-semibold text-emerald-600">
                  ${(client.margin / 1000).toFixed(1)}K
                </td>
                <td className="py-2.5 px-2 text-right">
                  <span className={clsx(
                    'tabular-nums font-semibold text-xs px-1.5 py-0.5 rounded',
                    client.marginPercent >= 18 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                    client.marginPercent >= 12 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  )}>
                    {client.marginPercent}%
                  </span>
                </td>
                <td className="py-2.5 px-2 text-center tabular-nums text-slate-600 dark:text-slate-400">
                  {client.ordersPerMonth.toLocaleString()}
                </td>
                <td className="py-2.5 px-2 text-center tabular-nums text-slate-600 dark:text-slate-400">
                  {client.skuCount}
                </td>
                <td className="py-2.5 px-2 text-center">
                  {client.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto" /> :
                   client.trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-500 mx-auto" /> :
                   <Minus className="w-4 h-4 text-slate-400 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 dark:border-slate-600 font-semibold">
              <td className="py-2.5 px-2 text-xs text-slate-900 dark:text-white">Total</td>
              <td className="py-2.5 px-2 text-right tabular-nums text-slate-900 dark:text-white">${(summary.totalRevenue / 1000).toFixed(1)}K</td>
              <td className="py-2.5 px-2 text-right tabular-nums text-slate-600 dark:text-slate-400">${(summary.totalCost / 1000).toFixed(1)}K</td>
              <td className="py-2.5 px-2 text-right tabular-nums text-emerald-600">${(summary.netMargin / 1000).toFixed(1)}K</td>
              <td className="py-2.5 px-2 text-right tabular-nums text-emerald-600">{summary.netMarginPercent}%</td>
              <td className="py-2.5 px-2 text-center tabular-nums text-slate-600 dark:text-slate-400">
                {summary.clients.reduce((s, c) => s + c.ordersPerMonth, 0).toLocaleString()}
              </td>
              <td className="py-2.5 px-2 text-center tabular-nums text-slate-600 dark:text-slate-400">
                {summary.clients.reduce((s, c) => s + c.skuCount, 0)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Insight */}
      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <p className="text-xs text-purple-800 dark:text-purple-200">
          <strong>💡 CEO Insight:</strong> 3PL business generates{' '}
          <strong>${(summary.netMargin / 1000).toFixed(1)}K/mo</strong> at {summary.netMarginPercent}% net margin — within the 8-15% industry target.
          Warehouse at {summary.utilizationPercent}% — {summary.utilizationPercent < 85 ?
            `room for ${Math.round((85 - summary.utilizationPercent) / summary.utilizationPercent * summary.clients.reduce((s, c) => s + c.ordersPerMonth, 0))} more orders/month before capacity concern.` :
            'approaching capacity, consider restricting new client onboarding.'
          }
          {' '}{summary.clients.find(c => c.status === 'marginal') &&
            `Watch ${summary.clients.find(c => c.status === 'marginal')!.name} — ${summary.clients.find(c => c.status === 'marginal')!.skuCount} SKUs at ${summary.clients.find(c => c.status === 'marginal')!.marginPercent}% margin suggests complexity is eating profit.`
          }
        </p>
      </div>
    </div>
  );
}
