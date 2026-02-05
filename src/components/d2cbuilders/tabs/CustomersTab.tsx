import { clsx } from 'clsx';
import { Users, TrendingDown, ArrowRight } from 'lucide-react';
import {
  d2cBuildersMetrics,
  clients,
  churnRiskClients,
  clientPipeline,
} from '../../../data/d2cbuilders';
import { formatCurrency, formatPercentPlain } from '../../../utils/format';

export function D2CCustomersTab() {
  const metrics = d2cBuildersMetrics;
  const topClients = [...clients].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/20">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Client Intelligence</h2>
          <p className="text-sm text-slate-500">Client health, profitability, churn risk & pipeline</p>
        </div>
      </div>

      {/* Client Health Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-medium">Active Clients</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metrics.clients.active}</p>
          <p className="text-xs text-slate-500 mt-1">{churnRiskClients.length} at risk</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-medium">Concentration Risk</p>
          <p className={clsx('text-2xl font-bold mt-1', metrics.clients.concentration > 25 ? 'text-red-600' : metrics.clients.concentration > 20 ? 'text-amber-600' : 'text-emerald-600')}>
            {metrics.clients.concentration.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Top client share</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-medium">Avg Margin</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {formatPercentPlain(clients.reduce((s, c) => s + c.margin, 0) / clients.length)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Across all clients</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-medium">Pipeline Value</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {formatCurrency(clientPipeline.reduce((s, c) => s + c.estimatedRevenue, 0), true)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{clientPipeline.length} prospects</p>
        </div>
      </div>

      {/* Client Leaderboard */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">All Clients by Revenue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="text-left text-xs text-slate-500 font-medium pb-3 pr-4">#</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-3">Client</th>
                <th className="text-right text-xs text-slate-500 font-medium pb-3 px-3">Revenue</th>
                <th className="text-right text-xs text-slate-500 font-medium pb-3 px-3">Orders</th>
                <th className="text-right text-xs text-slate-500 font-medium pb-3 px-3">Margin</th>
                <th className="text-center text-xs text-slate-500 font-medium pb-3 px-3">Trend</th>
                <th className="text-center text-xs text-slate-500 font-medium pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((client, i) => (
                <tr key={client.id} className="border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                  <td className="py-3 pr-4 text-slate-400 font-medium">{i + 1}</td>
                  <td className="py-3">
                    <p className="font-medium text-slate-900 dark:text-white">{client.name}</p>
                    {client.pallets && (
                      <p className="text-xs text-slate-500">{client.pallets} pallets</p>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(client.revenue, true)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300">
                    {client.orders.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={clsx(
                      'font-medium',
                      client.margin >= 28 ? 'text-emerald-600' : client.margin >= 22 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {client.margin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {client.trend === 'up' && <span className="text-emerald-600">↑</span>}
                    {client.trend === 'down' && <span className="text-red-600">↓</span>}
                    {client.trend === 'flat' && <span className="text-slate-400">→</span>}
                  </td>
                  <td className="py-3 text-center">
                    <span className={clsx(
                      'inline-block px-2 py-0.5 rounded-full text-xs font-medium',
                      client.riskLevel === 'healthy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                      client.riskLevel === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    )}>
                      {client.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Churn Risk + Pipeline */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Churn Risk Clients ({churnRiskClients.length})</h3>
            </div>
            {churnRiskClients.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No clients at churn risk</p>
            ) : (
              <div className="space-y-3">
                {churnRiskClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{client.name}</p>
                      <p className="text-xs text-slate-500">{formatCurrency(client.revenue, true)}/mo • {client.margin.toFixed(1)}% margin</p>
                    </div>
                    <span className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      client.riskLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {client.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="w-5 h-5 text-blue-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Client Pipeline</h3>
            </div>
            <div className="space-y-3">
              {clientPipeline.map((prospect) => (
                <div key={prospect.name} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{prospect.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{prospect.status} • {prospect.probability}% probability</p>
                  </div>
                  <p className="font-semibold text-blue-600">{formatCurrency(prospect.estimatedRevenue, true)}/mo</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500">
                Weighted pipeline value:{' '}
                <strong className="text-slate-900 dark:text-white">
                  {formatCurrency(clientPipeline.reduce((s, c) => s + c.estimatedRevenue * c.probability / 100, 0), true)}
                </strong>/mo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
