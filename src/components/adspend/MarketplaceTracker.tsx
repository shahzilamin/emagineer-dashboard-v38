import { TrendingUp, ShoppingBag } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import type { MarketplaceChannel } from '../../data/adspend';
import { formatCurrency } from '../../utils/format';

interface MarketplaceTrackerProps {
  channels: MarketplaceChannel[];
}

export function MarketplaceTracker({ channels }: MarketplaceTrackerProps) {
  const totalRevenue = channels.reduce((sum, c) => sum + c.revenue, 0);
  const totalPrevious = channels.reduce((sum, c) => sum + c.previousRevenue, 0);
  const totalGrowth = ((totalRevenue - totalPrevious) / totalPrevious) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            Marketplace Revenue
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {formatCurrency(totalRevenue, true)} total ·{' '}
            <span className="text-emerald-600">+{totalGrowth.toFixed(1)}% MoM</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {channels.map((channel) => {
          const trendData = channel.monthlyTrend.map((p) => ({
            date: p.date,
            value: p.value,
          }));

          return (
            <div
              key={channel.name}
              className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: channel.color }}
                  >
                    {channel.name[0]}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {channel.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">
                        +{channel.changePercent.toFixed(1)}% MoM
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(channel.revenue, true)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {channel.orders.toLocaleString()} orders
                  </p>
                </div>
              </div>

              {/* Mini Trend Chart */}
              <div className="h-12 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient
                        id={`mp-${channel.name}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={channel.color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={channel.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={channel.color}
                      fill={`url(#mp-${channel.name})`}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: '#e2e8f0',
                      }}
                      formatter={(value: number | undefined) => [`$${((value ?? 0) / 1000).toFixed(0)}K`, 'Revenue']}
                      labelFormatter={() => ''}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Key Metrics Row */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <p className="text-xs text-slate-500">Fees</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {channel.feePercent}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Net Margin</p>
                  <p className="text-sm font-medium text-emerald-600">
                    {channel.netMargin.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Ad Spend</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {formatCurrency(channel.adSpend, true)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Ad ROAS</p>
                  <p className="text-sm font-medium text-blue-600">
                    {channel.adRoas.toFixed(1)}x
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Combined Marketplace Insight */}
      <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
        <p className="text-sm text-emerald-800 dark:text-emerald-300">
          <span className="font-medium">📈 Growth Signal:</span> Marketplace revenue growing at{' '}
          {totalGrowth.toFixed(0)}% MoM blended. TikTok Shop is the fastest grower (+50%) with
          the lowest fee structure (5%). Walmart is the volume opportunity (+25.2% growth,
          underserved vs Amazon).
        </p>
      </div>
    </div>
  );
}
