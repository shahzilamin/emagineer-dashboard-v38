import { AlertTriangle, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { organicDependency } from '../../data/marketing-intelligence';
import { organicPaidSplit } from '../../data/adspend';
import { formatCurrency } from '../../utils/format';

export function OrganicDependencyTracker() {
  const dep = organicDependency;
  const declinePoints = dep.previousOrganicPercent - dep.currentOrganicPercent;

  // Chart data
  const chartData = organicPaidSplit.map((d) => ({
    month: d.month,
    organic: d.organicPercent,
    paid: d.paidPercent,
    marketplace: d.marketplacePercent,
  }));

  // Project forward 6 months
  const lastMonth = organicPaidSplit[organicPaidSplit.length - 1];
  const months = ['Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26'];
  months.forEach((month, i) => {
    const projOrg = Math.max(15, lastMonth.organicPercent - dep.organicDeclineRate * (i + 1));
    const projMkt = Math.min(35, lastMonth.marketplacePercent + 0.4 * (i + 1));
    const projPaid = 100 - projOrg - projMkt;
    chartData.push({
      month,
      organic: Math.round(projOrg * 10) / 10,
      paid: Math.round(projPaid * 10) / 10,
      marketplace: Math.round(projMkt * 10) / 10,
    });
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Organic Dependency & Paid Tax
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Every lost organic % point costs money in paid acquisition
          </p>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Organic Now</span>
          </div>
          <p className="text-xl font-bold text-red-600">{dep.currentOrganicPercent}%</p>
          <p className="text-xs text-red-500">
            Was {dep.previousOrganicPercent}% 6mo ago (-{declinePoints.toFixed(1)}pp)
          </p>
        </div>

        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Cost per Point</span>
          </div>
          <p className="text-xl font-bold text-amber-600">{formatCurrency(dep.paidReplacementCostPerPoint, true)}</p>
          <p className="text-xs text-amber-500">to replace 1% organic</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">12mo Projection</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{dep.projectedOrganicPercent12Months}%</p>
          <p className="text-xs text-slate-500">organic at current rate</p>
        </div>

        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">12mo Paid Tax</span>
          </div>
          <p className="text-xl font-bold text-red-600">{formatCurrency(dep.projectedTax12Months, true)}</p>
          <p className="text-xs text-red-500">new ad spend to stay flat</p>
        </div>
      </div>

      {/* Revenue mix trend + projection */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="organicGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              className="text-slate-500"
              tickLine={false}
              interval={2}
            />
            <YAxis
              domain={[0, 60]}
              tick={{ fontSize: 12 }}
              className="text-slate-500"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                const isProjection = d.month.includes('26') && !d.month.includes('Jan 26') && !d.month.includes('Feb 26');
                return (
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg">
                    <p className="text-xs font-medium text-slate-500">
                      {d.month} {isProjection && '(projected)'}
                    </p>
                    <div className="space-y-1 mt-1">
                      <p className="text-xs"><span className="text-emerald-500 font-bold">●</span> Organic: {d.organic.toFixed(1)}%</p>
                      <p className="text-xs"><span className="text-blue-500 font-bold">●</span> Paid: {d.paid.toFixed(1)}%</p>
                      <p className="text-xs"><span className="text-amber-500 font-bold">●</span> Marketplace: {d.marketplace.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              }}
            />
            <ReferenceLine
              y={25}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: 'Danger: 25%', position: 'left', fill: '#ef4444', fontSize: 11 }}
            />
            {/* Vertical line separating actual from projected */}
            <ReferenceLine
              x="Feb 26"
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{ value: '→ Projected', position: 'top', fill: '#94a3b8', fontSize: 11 }}
            />
            <Area type="monotone" dataKey="organic" stroke="#22c55e" strokeWidth={2} fill="url(#organicGrad)" />
            <Area type="monotone" dataKey="paid" stroke="#3b82f6" strokeWidth={2} fill="url(#paidGrad)" />
            <Area type="monotone" dataKey="marketplace" stroke="#f59e0b" strokeWidth={2} fill="url(#mktGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 justify-center">
        <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <span className="w-3 h-0.5 bg-emerald-500 rounded" /> Organic
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <span className="w-3 h-0.5 bg-blue-500 rounded" /> Paid
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <span className="w-3 h-0.5 bg-amber-500 rounded" /> Marketplace
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-3 h-0.5 bg-slate-400 rounded border-dashed" /> Projected
        </span>
      </div>
    </div>
  );
}
