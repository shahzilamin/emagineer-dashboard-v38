import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';
import { rfmSegments, totalCustomers } from '../../data/customer-intelligence';
import { formatCurrency } from '../../utils/format';

export function RFMSegmentation() {
  // Sort by revenue contribution descending
  const sorted = [...rfmSegments].sort((a, b) => b.revenueContribution - a.revenueContribution);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            RFM Customer Segmentation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
            {totalCustomers.toLocaleString()} total customers across 8 behavioral segments
          </p>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="mb-5">
        <div className="flex items-end gap-0.5 h-20">
          {sorted.map((seg) => (
            <div
              key={seg.slug}
              className="relative group flex-1 rounded-t-md transition-all hover:opacity-80"
              style={{
                backgroundColor: seg.color,
                height: `${Math.max(8, (seg.revenueContribution / 45) * 100)}%`,
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 whitespace-nowrap bg-slate-900 text-white text-xs rounded px-2 py-1">
                {seg.name}: {seg.revenueContribution}% rev
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-0.5 mt-1">
          {sorted.map((seg) => (
            <div key={seg.slug} className="flex-1 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate block">
                {seg.revenueContribution}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Segment Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2 font-medium">Segment</th>
              <th className="text-right py-2 font-medium">Customers</th>
              <th className="text-right py-2 font-medium">% Revenue</th>
              <th className="text-right py-2 font-medium">Avg LTV</th>
              <th className="text-right py-2 font-medium">Trend</th>
              <th className="text-right py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {rfmSegments.map((seg) => (
              <tr key={seg.slug} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white text-sm">{seg.name}</span>
                      <span className="text-xs text-slate-500 ml-1.5">({seg.percentOfTotal}%)</span>
                    </div>
                  </div>
                </td>
                <td className="text-right tabular-nums text-slate-700 dark:text-slate-300 py-2.5">
                  {seg.count.toLocaleString()}
                </td>
                <td className="text-right py-2.5">
                  <span className="tabular-nums font-semibold text-slate-900 dark:text-white">
                    {seg.revenueContribution}%
                  </span>
                </td>
                <td className="text-right tabular-nums text-slate-700 dark:text-slate-300 py-2.5">
                  {formatCurrency(seg.avgLTV)}
                </td>
                <td className="text-right py-2.5">
                  <span className={clsx(
                    'inline-flex items-center gap-0.5 text-xs font-medium',
                    seg.trend === 'growing' && 'text-emerald-600',
                    seg.trend === 'shrinking' && 'text-red-600',
                    seg.trend === 'stable' && 'text-slate-500',
                  )}>
                    {seg.trend === 'growing' && <TrendingUp className="w-3 h-3" />}
                    {seg.trend === 'shrinking' && <TrendingDown className="w-3 h-3" />}
                    {seg.trend === 'stable' && <Minus className="w-3 h-3" />}
                    {seg.trendPercent > 0 ? '+' : ''}{seg.trendPercent}%
                  </span>
                </td>
                <td className="text-right py-2.5">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {seg.actionLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Insight */}
      <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-300">
          <span className="font-semibold">Key insight:</span> Top 12.8% of customers (Champions) generate 43.2% of revenue.
          The 614 "Can't Lose" customers are going dark at -3.4%/mo - this is your highest-priority retention problem.
        </p>
      </div>
    </div>
  );
}
