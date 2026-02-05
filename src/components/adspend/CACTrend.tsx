import { TrendingUp, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { TimeSeriesPoint } from '../../types';
import { formatCurrency } from '../../utils/format';

interface CACTrendProps {
  data: TimeSeriesPoint[];
  currentCac: number;
  previousCac: number;
  targetCac?: number;
}

export function CACTrend({ data, currentCac, previousCac, targetCac = 18 }: CACTrendProps) {
  const cacChange = currentCac - previousCac;
  const cacChangePercent = ((cacChange) / previousCac * 100);
  const isRising = cacChange > 0;
  const isAboveTarget = currentCac > targetCac;

  const chartData = data.map((d) => ({
    week: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cac: d.value,
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Blended CAC Trend
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Cost to acquire a customer - 12 week view
          </p>
        </div>
        {isAboveTarget && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              Above ${targetCac} target
            </span>
          </div>
        )}
      </div>

      {/* Current vs Target */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3">
          <p className="text-xs text-slate-500 font-medium">Current</p>
          <p className={`text-2xl font-bold mt-1 ${isAboveTarget ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
            {formatCurrency(currentCac)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className={`w-3 h-3 ${isRising ? 'text-red-500' : 'text-emerald-500'}`} />
            <span className={`text-xs ${isRising ? 'text-red-600' : 'text-emerald-600'}`}>
              {cacChange >= 0 ? '+' : ''}{formatCurrency(cacChange)} ({cacChangePercent >= 0 ? '+' : ''}{cacChangePercent.toFixed(1)}%)
            </span>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3">
          <p className="text-xs text-slate-500 font-medium">Target</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(targetCac)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Monthly target</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3">
          <p className="text-xs text-slate-500 font-medium">Gap</p>
          <p className={`text-2xl font-bold mt-1 ${isAboveTarget ? 'text-red-600' : 'text-emerald-600'}`}>
            {isAboveTarget ? '+' : ''}{formatCurrency(currentCac - targetCac)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {isAboveTarget ? 'over target' : 'under target'}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="cacGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isAboveTarget ? '#ef4444' : '#3b82f6'} stopOpacity={0.1} />
                <stop offset="100%" stopColor={isAboveTarget ? '#ef4444' : '#3b82f6'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v}`}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <ReferenceLine
              y={targetCac}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#e2e8f0',
              }}
              formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'Blended CAC']}
            />
            <Line
              type="monotone"
              dataKey="cac"
              stroke={isAboveTarget ? '#ef4444' : '#3b82f6'}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Annotation */}
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-0.5 bg-emerald-500" style={{ borderTop: '2px dashed #10b981' }} />
          <span className="text-xs text-slate-500">Target (${targetCac})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-8 h-0.5 ${isAboveTarget ? 'bg-red-500' : 'bg-blue-500'}`} />
          <span className="text-xs text-slate-500">Actual CAC</span>
        </div>
      </div>
    </div>
  );
}
