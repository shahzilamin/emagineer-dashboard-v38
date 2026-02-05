import { useState } from 'react';
import { clsx } from 'clsx';
import { Users, TrendingUp, TrendingDown, Info } from 'lucide-react';
import type { CohortRetentionRow } from '../../data/cohorts';

interface CohortHeatmapProps {
  data: CohortRetentionRow[];
  mode?: 'retention' | 'ltv';
}

function getRetentionColor(value: number | null, mode: 'retention' | 'ltv'): string {
  if (value === null) return 'bg-slate-50 dark:bg-slate-800/50';

  if (mode === 'retention') {
    // M0 is always 100%, handle that
    if (value >= 100) return 'bg-emerald-600 text-white';
    if (value >= 25) return 'bg-emerald-500 text-white';
    if (value >= 20) return 'bg-emerald-400 text-white';
    if (value >= 15) return 'bg-emerald-300 dark:text-slate-900';
    if (value >= 12) return 'bg-amber-300 dark:text-slate-900';
    if (value >= 10) return 'bg-amber-400 dark:text-slate-900';
    if (value >= 8) return 'bg-orange-400 text-white';
    if (value >= 6) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  } else {
    // LTV mode - color by absolute value
    if (value >= 140) return 'bg-emerald-500 text-white';
    if (value >= 120) return 'bg-emerald-400 text-white';
    if (value >= 100) return 'bg-emerald-300 dark:text-slate-900';
    if (value >= 85) return 'bg-blue-300 dark:text-slate-900';
    if (value >= 70) return 'bg-blue-400 text-white';
    return 'bg-blue-500 text-white';
  }
}

function formatValue(value: number | null, mode: 'retention' | 'ltv'): string {
  if (value === null) return '—';
  if (mode === 'retention') return `${value}%`;
  return `$${value}`;
}

export function CohortHeatmap({ data, mode: initialMode }: CohortHeatmapProps) {
  const [mode, setMode] = useState<'retention' | 'ltv'>(initialMode || 'retention');
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const months = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];

  // Calculate average retention at each month point
  const avgRetention = months.map((_, colIdx) => {
    const values = data
      .map((row) => (mode === 'retention' ? row.retention[colIdx] : row.ltv[colIdx]))
      .filter((v): v is number => v !== null);
    if (values.length === 0) return null;
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  });

  // Detect improving/declining trend in M1 retention
  const recentM1 = data.slice(-3).map((r) => r.retention[1]).filter((v): v is number => v !== null);
  const earlyM1 = data.slice(0, 3).map((r) => r.retention[1]).filter((v): v is number => v !== null);
  const recentAvg = recentM1.reduce((a, b) => a + b, 0) / recentM1.length;
  const earlyAvg = earlyM1.reduce((a, b) => a + b, 0) / earlyM1.length;
  const trendDirection = recentAvg > earlyAvg ? 'improving' : recentAvg < earlyAvg ? 'declining' : 'stable';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Cohort {mode === 'retention' ? 'Retention' : 'LTV'} Heatmap
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {mode === 'retention'
              ? 'Percentage of customers who return each month after first purchase'
              : 'Cumulative revenue per customer over time'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => setMode('retention')}
              className={clsx(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                mode === 'retention'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              Retention %
            </button>
            <button
              onClick={() => setMode('ltv')}
              className={clsx(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                mode === 'ltv'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              Cumul. LTV
            </button>
          </div>
          {mode === 'retention' && (
            <div className={clsx(
              'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
              trendDirection === 'improving' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
              trendDirection === 'declining' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' :
              'bg-slate-50 dark:bg-slate-700 text-slate-500'
            )}>
              {trendDirection === 'improving' ? <TrendingUp className="w-3 h-3" /> : 
               trendDirection === 'declining' ? <TrendingDown className="w-3 h-3" /> : null}
              {trendDirection === 'improving' ? 'Improving' : trendDirection === 'declining' ? 'Declining' : 'Stable'}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-xs min-w-[680px]">
          <thead>
            <tr>
              <th className="text-left py-2 px-2 text-slate-500 font-medium w-20">Cohort</th>
              <th className="text-center py-2 px-1 text-slate-500 font-medium w-14">
                <span className="hidden sm:inline">Custs</span>
                <span className="sm:hidden">#</span>
              </th>
              {months.map((m, i) => (
                <th
                  key={m}
                  className={clsx(
                    'text-center py-2 px-1 font-medium w-14',
                    i === 0
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10'
                      : 'text-slate-500'
                  )}
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={row.cohort} className="group">
                <td className="py-1 px-2 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {row.cohortShort}
                </td>
                <td className="py-1 px-1 text-center text-slate-500">
                  {(row.customers / 1000).toFixed(1)}K
                </td>
                {months.map((_, colIdx) => {
                  const values = mode === 'retention' ? row.retention : row.ltv;
                  const val = values[colIdx] ?? null;
                  const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                  return (
                    <td
                      key={colIdx}
                      className={clsx('py-1 px-0.5', colIdx === 0 && 'bg-emerald-50/30 dark:bg-emerald-900/5')}
                      onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className={clsx(
                          'rounded px-1 py-1.5 text-center font-medium transition-all',
                          getRetentionColor(val, mode),
                          val === null && 'text-slate-300 dark:text-slate-600',
                          isHovered && val !== null && 'ring-2 ring-slate-900 dark:ring-white ring-offset-1 scale-105'
                        )}
                      >
                        {formatValue(val, mode)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Average row */}
            <tr className="border-t-2 border-slate-300 dark:border-slate-600">
              <td className="py-2 px-2 font-bold text-slate-900 dark:text-white">Avg</td>
              <td className="py-2 px-1 text-center text-slate-500 font-medium">
                {(data.reduce((s, r) => s + r.customers, 0) / 1000).toFixed(0)}K
              </td>
              {avgRetention.map((val, i) => (
                <td key={i} className={clsx('py-2 px-0.5', i === 0 && 'bg-emerald-50/30 dark:bg-emerald-900/5')}>
                  <div
                    className={clsx(
                      'rounded px-1 py-1.5 text-center font-bold transition-all',
                      val !== null ? getRetentionColor(val, mode) : 'text-slate-300 dark:text-slate-600'
                    )}
                  >
                    {val !== null ? formatValue(val, mode) : '—'}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-500">
            {mode === 'retention' ? 'Higher retention = greener' : 'Higher LTV = greener'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {mode === 'retention' ? (
            <>
              <div className="w-4 h-3 rounded bg-red-500" />
              <span className="text-xs text-slate-500 mr-2">&lt;8%</span>
              <div className="w-4 h-3 rounded bg-orange-400" />
              <span className="text-xs text-slate-500 mr-2">8-12%</span>
              <div className="w-4 h-3 rounded bg-amber-300" />
              <span className="text-xs text-slate-500 mr-2">12-15%</span>
              <div className="w-4 h-3 rounded bg-emerald-400" />
              <span className="text-xs text-slate-500 mr-2">15-25%</span>
              <div className="w-4 h-3 rounded bg-emerald-600" />
              <span className="text-xs text-slate-500">25%+</span>
            </>
          ) : (
            <>
              <div className="w-4 h-3 rounded bg-blue-500" />
              <span className="text-xs text-slate-500 mr-2">&lt;$70</span>
              <div className="w-4 h-3 rounded bg-blue-300" />
              <span className="text-xs text-slate-500 mr-2">$85+</span>
              <div className="w-4 h-3 rounded bg-emerald-300" />
              <span className="text-xs text-slate-500 mr-2">$100+</span>
              <div className="w-4 h-3 rounded bg-emerald-500" />
              <span className="text-xs text-slate-500">$140+</span>
            </>
          )}
        </div>
      </div>

      {/* Tooltip for hovered cell */}
      {hoveredCell && (() => {
        const row = data[hoveredCell.row];
        const retVal = row.retention[hoveredCell.col];
        const ltvVal = row.ltv[hoveredCell.col];
        if (retVal === null && ltvVal === null) return null;

        return (
          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-xs">
            <p className="font-semibold text-slate-900 dark:text-white">
              {row.cohort} — Month {hoveredCell.col}
            </p>
            <div className="flex gap-4 mt-1">
              {retVal !== null && (
                <span className="text-slate-600 dark:text-slate-300">
                  Retention: <strong>{retVal}%</strong> ({Math.round(row.customers * retVal / 100)} customers)
                </span>
              )}
              {ltvVal !== null && (
                <span className="text-slate-600 dark:text-slate-300">
                  Cumul. LTV: <strong>${ltvVal}</strong>
                </span>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
