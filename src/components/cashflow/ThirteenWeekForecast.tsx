import { useState } from 'react';
import { Calendar, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import {
  weeklyForecast,
  cashScenarios,
  worstCaseMin,
  worstCaseMinWeek,
} from '../../data/cashflow';

const formatK = (n: number) => {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};

const formatDollar = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function ThirteenWeekForecast() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  // Chart dimensions
  const chartWidth = 700;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 55 };
  const plotW = chartWidth - padding.left - padding.right;
  const plotH = chartHeight - padding.top - padding.bottom;

  // Determine min/max across all scenarios
  const allValues = cashScenarios.flatMap((s) => s.weeks.map((w) => w.endingBalance));
  const minVal = Math.min(...allValues) * 0.9;
  const maxVal = Math.max(...allValues) * 1.1;
  const range = maxVal - minVal;

  const xScale = (week: number) => padding.left + ((week - 1) / 12) * plotW;
  const yScale = (val: number) => padding.top + plotH - ((val - minVal) / range) * plotH;

  // Generate path for each scenario
  const scenarioPath = (weeks: { week: number; endingBalance: number }[]) =>
    weeks.map((w, i) => `${i === 0 ? 'M' : 'L'}${xScale(w.week).toFixed(1)},${yScale(w.endingBalance).toFixed(1)}`).join(' ');

  // Fill area between best and worst
  const bestPoints = cashScenarios[0].weeks.map((w) => `${xScale(w.week).toFixed(1)},${yScale(w.endingBalance).toFixed(1)}`);
  const worstPoints = cashScenarios[2].weeks.map((w) => `${xScale(w.week).toFixed(1)},${yScale(w.endingBalance).toFixed(1)}`);
  const corridorPath = `M${bestPoints.join(' L')} L${worstPoints.reverse().join(' L')} Z`;

  // Y-axis ticks
  const yTicks = Array.from({ length: 5 }, (_, i) => minVal + (range / 4) * i);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            13-Week Rolling Cash Forecast
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {cashScenarios.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Corridor Chart */}
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48">
          {/* Corridor fill */}
          <path d={corridorPath} fill="#3b82f620" stroke="none" />

          {/* Grid lines */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={yScale(tick)}
                x2={chartWidth - padding.right}
                y2={yScale(tick)}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                strokeDasharray="2,3"
              />
              <text
                x={padding.left - 6}
                y={yScale(tick) + 3}
                textAnchor="end"
                className="fill-slate-500 dark:fill-slate-400"
                fontSize="10"
              >
                {formatK(tick)}
              </text>
            </g>
          ))}

          {/* Actual/Projected divider */}
          <line
            x1={xScale(4.5)}
            y1={padding.top}
            x2={xScale(4.5)}
            y2={chartHeight - padding.bottom}
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-600"
            strokeDasharray="4,4"
          />
          <text
            x={xScale(2.5)}
            y={padding.top + 10}
            textAnchor="middle"
            className="fill-slate-400 dark:fill-slate-500"
            fontSize="9"
          >
            Actual
          </text>
          <text
            x={xScale(9)}
            y={padding.top + 10}
            textAnchor="middle"
            className="fill-slate-400 dark:fill-slate-500"
            fontSize="9"
          >
            Projected
          </text>

          {/* Scenario lines */}
          {cashScenarios.map((s) => (
            <path
              key={s.label}
              d={scenarioPath(s.weeks)}
              fill="none"
              stroke={s.color}
              strokeWidth={s.label === 'Base' ? 2.5 : 1.5}
              strokeDasharray={s.label === 'Base' ? 'none' : '4,3'}
              opacity={s.label === 'Base' ? 1 : 0.7}
            />
          ))}

          {/* Base case dots */}
          {cashScenarios[1].weeks.map((w) => (
            <circle
              key={w.week}
              cx={xScale(w.week)}
              cy={yScale(w.endingBalance)}
              r={3}
              fill={w.week <= 4 ? '#3b82f6' : '#93c5fd'}
              stroke="white"
              strokeWidth={1}
            />
          ))}

          {/* Worst case minimum marker */}
          <circle
            cx={xScale(worstCaseMinWeek)}
            cy={yScale(worstCaseMin)}
            r={5}
            fill="none"
            stroke="#ef4444"
            strokeWidth={2}
          />
          <text
            x={xScale(worstCaseMinWeek) + 8}
            y={yScale(worstCaseMin) + 3}
            className="fill-red-500"
            fontSize="9"
            fontWeight="600"
          >
            Min: {formatK(worstCaseMin)}
          </text>

          {/* X-axis labels */}
          {weeklyForecast.map((w) => (
            <text
              key={w.week}
              x={xScale(w.week)}
              y={chartHeight - 8}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400"
              fontSize="9"
            >
              {w.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Worst Case Alert */}
      {worstCaseMin < 50000 && (
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Worst-case floor: {formatDollar(worstCaseMin)}</strong> in Week {worstCaseMinWeek}.
            If revenue drops 20%, consider delaying inventory POs or securing a credit line before Week {worstCaseMinWeek}.
          </p>
        </div>
      )}

      {/* Toggle detailed table */}
      <button
        onClick={() => setShowTable(!showTable)}
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
      >
        {showTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {showTable ? 'Hide' : 'Show'} weekly detail
      </button>

      {showTable && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">Week</th>
                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">Start</th>
                <th className="text-right py-2 px-2 font-semibold text-emerald-600 dark:text-emerald-400">Cash In</th>
                <th className="text-right py-2 px-2 font-semibold text-red-600 dark:text-red-400">Cash Out</th>
                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">Net</th>
                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">End</th>
              </tr>
            </thead>
            <tbody>
              {weeklyForecast.map((w) => (
                <tr
                  key={w.week}
                  className={clsx(
                    'border-b border-slate-100 dark:border-slate-700/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30',
                    w.isProjected && 'opacity-75',
                    expandedWeek === w.week && 'bg-blue-50 dark:bg-blue-900/10'
                  )}
                  onClick={() => setExpandedWeek(expandedWeek === w.week ? null : w.week)}
                >
                  <td className="py-2 px-2 font-medium text-slate-700 dark:text-slate-200">
                    {w.label} {w.isProjected && <span className="text-slate-400 text-xs">(proj)</span>}
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums text-slate-600 dark:text-slate-300">{formatK(w.startingBalance)}</td>
                  <td className="py-2 px-2 text-right tabular-nums text-emerald-600 dark:text-emerald-400">{formatK(w.cashIn.total)}</td>
                  <td className="py-2 px-2 text-right tabular-nums text-red-600 dark:text-red-400">{formatK(w.cashOut.total)}</td>
                  <td className={clsx('py-2 px-2 text-right tabular-nums font-medium', w.netFlow >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                    {w.netFlow >= 0 ? '+' : ''}{formatK(w.netFlow)}
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums font-medium text-slate-700 dark:text-slate-200">{formatK(w.endingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CEO Insight */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>💡 CEO Insight:</strong> The P&L shows $35K monthly profit, but cash flow shows a $34.5K monthly deficit - a $69.5K gap.
          {' '}The business is profitable but cash-negative because of payout delays ($36K), Amazon reserves ($8.5K), and overlapping supplier POs ($15K).
          {' '}This is the #1 cause of "profitable but broke" in growing DTC brands.
        </p>
      </div>
    </div>
  );
}
