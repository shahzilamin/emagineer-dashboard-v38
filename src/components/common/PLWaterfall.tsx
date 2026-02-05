import { useState } from 'react';
import { clsx } from 'clsx';
import {
  BarChart3,
  Table2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Minus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WaterfallChart, type WaterfallItem } from '../charts/WaterfallChart';
import { SparklineChart } from '../charts/SparklineChart';
import { DonutChart } from '../charts/DonutChart';
import type { PnLLineItem, MonthlyPnL, CostBreakdown } from '../../data/pnl';

function formatCurrencyCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function formatCurrencyFull(value: number): string {
  const prefix = value < 0 ? '-' : '';
  return `${prefix}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// ======================================
// P&L Table (detailed income statement)
// ======================================
function PnLTable({ items, currentLabel = 'This Month', previousLabel = 'Last Month' }: {
  items: PnLLineItem[];
  currentLabel?: string;
  previousLabel?: string;
}) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 px-2 text-xs font-medium text-slate-500 uppercase tracking-wide">Line Item</th>
            <th className="text-right py-2 px-2 text-xs font-medium text-slate-500 uppercase tracking-wide">{currentLabel}</th>
            <th className="text-right py-2 px-2 text-xs font-medium text-slate-500 uppercase tracking-wide hidden sm:table-cell">{previousLabel}</th>
            <th className="text-right py-2 px-2 text-xs font-medium text-slate-500 uppercase tracking-wide">Change</th>
            <th className="text-right py-2 px-2 text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">% of Rev</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item) => {
            const isCost = item.current < 0 && !item.isSubtotal && !item.isTotal;
            const changeColor = isCost
              ? (item.changePercent > 0 ? 'text-red-600' : 'text-emerald-600')
              : (item.changePercent > 0 ? 'text-emerald-600' : 'text-red-600');

            return (
              <tr
                key={item.label}
                className={clsx(
                  'transition-colors',
                  (item.isSubtotal || item.isTotal) && 'bg-slate-50 dark:bg-slate-800/50',
                  item.isTotal && 'border-t-2 border-slate-300 dark:border-slate-600'
                )}
              >
                <td className={clsx(
                  'py-2.5 px-2',
                  item.indent && 'pl-6',
                  (item.isSubtotal || item.isTotal) ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                )}>
                  {item.label}
                </td>
                <td className={clsx(
                  'py-2.5 px-2 text-right tabular-nums',
                  (item.isSubtotal || item.isTotal) ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300',
                  item.isTotal && item.current > 0 && 'text-emerald-600 dark:text-emerald-400'
                )}>
                  {formatCurrencyFull(item.current)}
                </td>
                <td className="py-2.5 px-2 text-right tabular-nums text-slate-500 hidden sm:table-cell">
                  {formatCurrencyFull(item.previous)}
                </td>
                <td className={clsx('py-2.5 px-2 text-right tabular-nums text-xs font-medium', changeColor)}>
                  <span className="flex items-center justify-end gap-0.5">
                    {Math.abs(item.changePercent) < 0.5 ? (
                      <Minus className="w-3 h-3 text-slate-400" />
                    ) : item.changePercent > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(item.changePercent).toFixed(1)}%
                  </span>
                </td>
                <td className="py-2.5 px-2 text-right tabular-nums text-slate-500 text-xs hidden md:table-cell">
                  {item.percentOfRevenue.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ======================================
// Margin Trend Mini Chart
// ======================================
function MarginTrend({ data }: { data: MonthlyPnL[] }) {
  const grossMarginData = data.map((d) => ({ date: d.month, value: d.grossMarginPct * 100 }));
  const netMarginData = data.map((d) => ({ date: d.month, value: d.netMarginPct * 100 }));

  const latestGross = data[data.length - 1]?.grossMarginPct || 0;
  const prevGross = data[data.length - 2]?.grossMarginPct || 0;
  const latestNet = data[data.length - 1]?.netMarginPct || 0;
  const prevNet = data[data.length - 2]?.netMarginPct || 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Gross Margin</p>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-slate-900 dark:text-white">{latestGross.toFixed(1)}%</span>
            <span className={clsx(
              'text-xs',
              latestGross >= prevGross ? 'text-emerald-600' : 'text-red-600'
            )}>
              {latestGross >= prevGross ? '↑' : '↓'}
            </span>
          </div>
        </div>
        <SparklineChart data={grossMarginData} height={48} color="blue" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Net Margin</p>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-slate-900 dark:text-white">{latestNet.toFixed(1)}%</span>
            <span className={clsx(
              'text-xs',
              latestNet >= prevNet ? 'text-emerald-600' : 'text-red-600'
            )}>
              {latestNet >= prevNet ? '↑' : '↓'}
            </span>
          </div>
        </div>
        <SparklineChart data={netMarginData} height={48} color="green" />
      </div>
    </div>
  );
}

// ======================================
// Revenue vs Cost Donut
// ======================================
function CostDonut({ data }: { data: CostBreakdown[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <DonutChart
        data={data}
        height={160}
        centerValue={formatCurrencyCompact(total)}
        centerLabel="Total"
      />
      <div className="mt-3 space-y-1.5">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 dark:text-white">{formatCurrencyCompact(item.value)}</span>
              <span className="text-slate-500 w-10 text-right">{item.percentOfRevenue.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================================
// Main P&L Section Component
// ======================================
interface PLSectionProps {
  title: string;
  subtitle?: string;
  waterfallData: WaterfallItem[];
  tableData?: PnLLineItem[];
  trendData?: MonthlyPnL[];
  costBreakdown?: CostBreakdown[];
  compact?: boolean;
}

export function PLSection({
  title,
  subtitle,
  waterfallData,
  tableData,
  trendData,
  costBreakdown,
  compact = false,
}: PLSectionProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [expanded, setExpanded] = useState(!compact);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div
        className={clsx(
          'flex items-center justify-between p-4 sm:p-5',
          compact && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors'
        )}
        onClick={compact ? () => setExpanded(!expanded) : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {expanded && !compact && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('chart')}
                className={clsx(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                  viewMode === 'chart'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Visual
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={clsx(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                <Table2 className="w-3.5 h-3.5" />
                Table
              </button>
            </div>
          )}
          {compact && (
            expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-5 space-y-5">
          {/* Waterfall Chart or Table */}
          {viewMode === 'chart' ? (
            <WaterfallChart
              data={waterfallData}
              height={compact ? 240 : 320}
              showLabels
            />
          ) : (
            tableData && <PnLTable items={tableData} />
          )}

          {/* Bottom Row: Margin Trends + Cost Breakdown */}
          {!compact && (trendData || costBreakdown) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4 border-t border-slate-100 dark:border-slate-700">
              {trendData && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Margin Trend (6 months)
                  </h4>
                  <MarginTrend data={trendData} />
                </div>
              )}
              {costBreakdown && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Where Every Dollar Goes
                  </h4>
                  <CostDonut data={costBreakdown} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ======================================
// Quick P&L Summary Bar (for portfolio view)
// ======================================
interface PLSummaryBarProps {
  revenue: number;
  grossProfit: number;
  netProfit: number;
  grossMarginPct: number;
  netMarginPct: number;
}

export function PLSummaryBar({ revenue, netProfit, grossMarginPct, netMarginPct }: PLSummaryBarProps) {
  // Visual breakdown bar
  const segments = [
    { label: 'Net Profit', pct: netMarginPct, color: '#10b981' },
    { label: 'Operating Costs', pct: grossMarginPct - netMarginPct, color: '#a855f7' },
    { label: 'COGS', pct: 100 - grossMarginPct, color: '#f87171' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Revenue Breakdown</h4>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>Revenue: <strong className="text-slate-900 dark:text-white">{formatCurrencyCompact(revenue)}</strong></span>
          <ArrowRight className="w-3 h-3" />
          <span>Net: <strong className="text-emerald-600">{formatCurrencyCompact(netProfit)}</strong></span>
        </div>
      </div>

      {/* Stacked horizontal bar */}
      <div className="w-full h-6 rounded-full overflow-hidden flex">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            style={{ width: `${Math.max(seg.pct, 1)}%`, backgroundColor: seg.color }}
            title={`${seg.label}: ${seg.pct.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-slate-500">{seg.label}</span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{seg.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
