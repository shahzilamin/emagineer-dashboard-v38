import { useState } from 'react';
import { clsx } from 'clsx';
import { Award, Clock, Sparkles, LayoutGrid, Table2 } from 'lucide-react';
import type { ChannelCohortQuality } from '../../data/cohorts';

interface ChannelQualityProps {
  data: ChannelCohortQuality[];
}

function QualityBar({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-blue-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all', color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-8 text-right">{score}</span>
    </div>
  );
}

function RetentionDots({ values, labels }: { values: number[]; labels: string[] }) {
  return (
    <div className="flex items-end gap-1">
      {values.map((val, i) => {
        const height = Math.max(8, (val / 40) * 32);
        const color = val >= 25 ? 'bg-emerald-400' : val >= 15 ? 'bg-blue-400' : val >= 10 ? 'bg-amber-400' : 'bg-red-400';
        return (
          <div key={i} className="flex flex-col items-center gap-0.5" title={`${labels[i]}: ${val}%`}>
            <div className={clsx('w-3.5 rounded-sm transition-all', color)} style={{ height: `${height}px` }} />
            <span className="text-xs text-slate-500">{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ChannelQuality({ data }: ChannelQualityProps) {
  const sortedData = [...data].sort((a, b) => b.qualityScore - a.qualityScore);
  const bestChannel = sortedData[0];
  const worstPaidChannel = sortedData.filter(c => c.cac > 0).slice(-1)[0];
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Channel Acquisition Quality
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Not all customers are equal — which channels produce the stickiest buyers?
          </p>
        </div>
        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('table')}
            className={clsx(
              'px-2 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1',
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <Table2 className="w-3 h-3" /> Compare
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={clsx(
              'px-2 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1',
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <LayoutGrid className="w-3 h-3" /> Cards
          </button>
        </div>
      </div>

      {/* Compact Table View */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-2 font-medium">Channel</th>
                <th className="text-right py-2 px-2 font-medium">CAC</th>
                <th className="text-right py-2 px-2 font-medium">Payback</th>
                <th className="text-right py-2 px-2 font-medium">LTV 90d</th>
                <th className="text-right py-2 px-2 font-medium">LTV 365d</th>
                <th className="text-right py-2 px-2 font-medium">90d Ret.</th>
                <th className="text-center py-2 px-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((ch, idx) => (
                <tr
                  key={ch.channel}
                  className={clsx(
                    'border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30',
                    idx === 0 && 'bg-emerald-50/50 dark:bg-emerald-900/10'
                  )}
                >
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ch.color }} />
                      <span className="font-medium text-slate-900 dark:text-white">{ch.channel}</span>
                      {idx === 0 && (
                        <Sparkles className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums font-medium text-slate-700 dark:text-slate-300">
                    {ch.cac > 0 ? `$${ch.cac.toFixed(0)}` : <span className="text-emerald-600">Free</span>}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-slate-600 dark:text-slate-400">
                    {ch.paybackDays === 0 ? '—' : `${ch.paybackDays}d`}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums font-semibold text-slate-900 dark:text-white">
                    ${ch.ltv90}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {ch.ltv365 !== null ? `$${ch.ltv365}` : '—'}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className={clsx(
                      'tabular-nums font-semibold',
                      ch.day90Retention >= 20 ? 'text-emerald-600' :
                      ch.day90Retention >= 12 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {ch.day90Retention}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="w-20 mx-auto">
                      <QualityBar score={ch.qualityScore} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card View (existing layout) */
        <div className="space-y-3">
          {sortedData.map((ch, idx) => (
            <div
              key={ch.channel}
              className={clsx(
                'rounded-lg border p-4 transition-colors',
                idx === 0
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10'
                  : 'border-slate-200 dark:border-slate-700'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ch.color }} />
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">{ch.channel}</span>
                  {idx === 0 && (
                    <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" /> Best
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Quality Score</span>
                  <div className="w-24 mt-0.5">
                    <QualityBar score={ch.qualityScore} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Retention Curve</p>
                  <RetentionDots
                    values={[ch.day30Retention, ch.day60Retention, ch.day90Retention, ch.day180Retention]}
                    labels={['30d', '60d', '90d', '180d']}
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">CAC & Payback</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {ch.cac > 0 ? `$${ch.cac.toFixed(2)}` : 'Free'}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">
                      {ch.paybackDays === 0 ? 'Instant' : `${ch.paybackDays}d payback`}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">LTV (90d / 365d)</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    ${ch.ltv90} / {ch.ltv365 !== null ? `$${ch.ltv365}` : '—'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {ch.cac > 0 ? `${(ch.ltv90 / ch.cac).toFixed(1)}x ROI at 90d` : '∞ ROI'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">90d Retention</p>
                  <p className={clsx(
                    'text-sm font-bold',
                    ch.day90Retention >= 20 ? 'text-emerald-600' :
                    ch.day90Retention >= 12 ? 'text-amber-600' : 'text-red-600'
                  )}>
                    {ch.day90Retention}%
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {Math.round(ch.customers * ch.day90Retention / 100)} still active
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insight - enhanced callout in table mode (Lux QW3) */}
      <div className={clsx(
        'mt-4 rounded-lg border',
        viewMode === 'table'
          ? 'p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-sm'
          : 'p-3 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      )}>
        <p className={clsx(
          'text-blue-800 dark:text-blue-200',
          viewMode === 'table' ? 'text-sm' : 'text-xs'
        )}>
          <strong>💡 Insight:</strong> {bestChannel.channel} customers have{' '}
          <strong>{(bestChannel.day90Retention / worstPaidChannel.day90Retention).toFixed(1)}x</strong> higher 90-day retention
          than {worstPaidChannel.channel}. Shifting $5K/mo from paid ads to {bestChannel.channel.toLowerCase()} retention
          could generate <strong>${Math.round((bestChannel.ltv90 - worstPaidChannel.ltv90) * 100 * 0.3).toLocaleString()}</strong> in
          incremental LTV over 90 days.
        </p>
      </div>
    </div>
  );
}
