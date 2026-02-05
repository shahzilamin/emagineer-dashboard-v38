import { clsx } from 'clsx';
import { TrendingDown, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
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
import { merTrend, currentMER, merChange } from '../../data/marketing-intelligence';

export function MERDashboard() {
  const isDecline = merChange < 0;
  const dangerZone = currentMER < 3;
  const warningZone = currentMER >= 3 && currentMER < 4;

  // Transform data for chart
  const chartData = merTrend.map((d) => ({
    month: d.month,
    mer: d.mer,
    spend: Math.round(d.totalAdSpend / 1000),
    revenue: Math.round(d.totalRevenue / 1000),
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              MER (Marketing Efficiency Ratio)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
              North Star
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
            Total Revenue / Total Ad Spend - the un-gameable metric
          </p>
        </div>
        <div className="text-right">
          <p className={clsx(
            'text-3xl font-bold',
            dangerZone ? 'text-red-600' : warningZone ? 'text-amber-600' : 'text-emerald-600'
          )}>
            {currentMER.toFixed(2)}x
          </p>
          <div className="flex items-center gap-1 justify-end mt-1">
            {isDecline ? (
              <TrendingDown className="w-3 h-3 text-red-500" />
            ) : (
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            )}
            <span className={clsx('text-xs font-medium', isDecline ? 'text-red-600' : 'text-emerald-600')}>
              {merChange >= 0 ? '+' : ''}{merChange.toFixed(2)} MoM
            </span>
          </div>
        </div>
      </div>

      {/* Warning banner if declining */}
      {warningZone && (
        <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              MER approaching danger zone
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Revenue growth (+{((merTrend[11].totalRevenue / merTrend[0].totalRevenue - 1) * 100).toFixed(0)}% since Mar) is not keeping pace with ad spend growth (+{((merTrend[11].totalAdSpend / merTrend[0].totalAdSpend - 1) * 100).toFixed(0)}%). Every month the gap widens.
            </p>
          </div>
        </div>
      )}

      {/* MER Trend Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="merGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dangerZone ? '#ef4444' : warningZone ? '#f59e0b' : '#10b981'} stopOpacity={0.2} />
                <stop offset="95%" stopColor={dangerZone ? '#ef4444' : warningZone ? '#f59e0b' : '#10b981'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              className="text-slate-500"
              tickLine={false}
            />
            <YAxis
              domain={[2.5, 5]}
              tick={{ fontSize: 12 }}
              className="text-slate-500"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tw-bg-opacity, 1)',
                borderColor: 'var(--tw-border-opacity, 1)',
                borderRadius: '0.75rem',
                padding: '12px',
              }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg">
                    <p className="text-xs font-medium text-slate-500">{d.month}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{d.mer.toFixed(2)}x MER</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span>Rev: ${d.revenue}K</span>
                      <span>Spend: ${d.spend}K</span>
                    </div>
                  </div>
                );
              }}
            />
            <ReferenceLine
              y={4}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{ value: 'Target 4:1', position: 'right', fill: '#10b981', fontSize: 11 }}
            />
            <ReferenceLine
              y={3}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: 'Danger 3:1', position: 'right', fill: '#ef4444', fontSize: 11 }}
            />
            <Area
              type="monotone"
              dataKey="mer"
              stroke={dangerZone ? '#ef4444' : warningZone ? '#f59e0b' : '#10b981'}
              strokeWidth={2.5}
              fill="url(#merGradient)"
              dot={{ r: 3, fill: 'white', strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom insight */}
      <div className="flex items-start gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Activity className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          MER dropped from {merTrend[0].mer.toFixed(1)}x to {currentMER.toFixed(1)}x over 12 months.
          Ad spend grew {((merTrend[11].totalAdSpend / merTrend[0].totalAdSpend - 1) * 100).toFixed(0)}% while revenue grew only {((merTrend[11].totalRevenue / merTrend[0].totalRevenue - 1) * 100).toFixed(0)}%.
          At this rate, MER hits the 3:1 danger zone in ~{Math.ceil((currentMER - 3) / Math.abs(merChange))} months.
        </p>
      </div>
    </div>
  );
}
