import { TrendingDown, AlertTriangle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { OrganicPaidSplit as OrganicPaidSplitData } from '../../data/adspend';

interface OrganicPaidSplitProps {
  data: OrganicPaidSplitData[];
}

export function OrganicPaidSplit({ data }: OrganicPaidSplitProps) {
  const latest = data[data.length - 1];
  const earliest = data[0];
  const organicDrop = earliest.organicPercent - latest.organicPercent;
  const marketplaceGain = latest.marketplacePercent - earliest.marketplacePercent;

  // Transform data for stacked area chart
  const chartData = data.map((d) => ({
    month: d.month,
    Organic: d.organic,
    Paid: d.paid,
    Marketplace: d.marketplace,
    organicPct: d.organicPercent,
    paidPct: d.paidPercent,
    marketplacePct: d.marketplacePercent,
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Revenue Mix Shift
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Organic vs Paid vs Marketplace - 12 month trend
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
            Organic declining
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Organic</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            {latest.organicPercent.toFixed(1)}%
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-red-500" />
            <span className="text-xs text-red-600">
              -{organicDrop.toFixed(1)}pp
            </span>
            <span className="text-xs text-slate-500">12mo</span>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Paid Ads</p>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-1">
            {latest.paidPercent.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            +{(latest.paidPercent - earliest.paidPercent).toFixed(1)}pp growth
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Marketplace</p>
          <p className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-1">
            {latest.marketplacePercent.toFixed(1)}%
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            +{marketplaceGain.toFixed(1)}pp growth
          </p>
        </div>
      </div>

      {/* Stacked Area Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="organicGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="marketplaceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#e2e8f0',
              }}
              formatter={(value: number | undefined, name: string | undefined) => [
                `$${((value ?? 0) / 1000).toFixed(0)}K`,
                name ?? '',
              ]}
            />
            <Area
              type="monotone"
              dataKey="Marketplace"
              stackId="1"
              stroke="#f59e0b"
              fill="url(#marketplaceGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Paid"
              stackId="1"
              stroke="#3b82f6"
              fill="url(#paidGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Organic"
              stackId="1"
              stroke="#22c55e"
              fill="url(#organicGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* CEO Callout */}
      <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <span className="font-medium">⚠️ Dependency Alert:</span> Organic dropped from{' '}
          {earliest.organicPercent.toFixed(0)}% → {latest.organicPercent.toFixed(0)}% of revenue in 12
          months. Paid + marketplace now make up {(latest.paidPercent + latest.marketplacePercent).toFixed(0)}% of
          revenue. Each ROAS point decline costs more at this scale. SEO recovery is critical.
        </p>
      </div>
    </div>
  );
}
