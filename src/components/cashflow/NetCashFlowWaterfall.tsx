import { useState } from 'react';
import { BarChart3, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { cashFlowWaterfall, plVsCash } from '../../data/cashflow';

const formatDollar = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const formatK = (n: number) => {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};

export function NetCashFlowWaterfall() {
  const [showGapDetail, setShowGapDetail] = useState(false);

  // Build running total for waterfall positioning
  const items: Array<{
    label: string;
    value: number;
    type: string;
    runningTop: number;
    barHeight: number;
    isPositive: boolean;
  }> = [];

  let runningTotal = 0;
  for (const item of cashFlowWaterfall) {
    if (item.type === 'start') {
      items.push({
        label: item.label,
        value: item.value,
        type: item.type,
        runningTop: 0,
        barHeight: item.value,
        isPositive: true,
      });
      runningTotal = item.value;
    } else if (item.type === 'end') {
      items.push({
        label: item.label,
        value: item.value,
        type: item.type,
        runningTop: 0,
        barHeight: item.value,
        isPositive: true,
      });
    } else if (item.type === 'inflow') {
      items.push({
        label: item.label,
        value: item.value,
        type: item.type,
        runningTop: runningTotal,
        barHeight: item.value,
        isPositive: true,
      });
      runningTotal += item.value;
    } else {
      // outflow
      runningTotal += item.value; // value is negative
      items.push({
        label: item.label,
        value: item.value,
        type: item.type,
        runningTop: runningTotal,
        barHeight: Math.abs(item.value),
        isPositive: false,
      });
    }
  }

  // Scale factor
  const chartMax = Math.max(runningTotal, cashFlowWaterfall[0].value) * 1.15;
  const barHeightScale = (val: number) => (val / chartMax) * 180;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Net Cash Flow Waterfall (Monthly)</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Cash movement, not accounting profit</p>
      </div>

      {/* Waterfall bars */}
      <div className="overflow-x-auto">
        <div className="flex items-end gap-1 min-w-[600px]" style={{ height: '220px' }}>
          {items.map((item, i) => {
            const isStart = item.type === 'start';
            const isEnd = item.type === 'end';
            const barH = barHeightScale(item.barHeight);
            const bottomPos = isStart || isEnd ? 0 : barHeightScale(item.runningTop);

            return (
              <div key={i} className="flex-1 flex flex-col items-center relative" style={{ height: '220px' }}>
                {/* Value label */}
                <div
                  className="absolute text-xs font-bold tabular-nums text-center w-full"
                  style={{
                    bottom: `${bottomPos + barH + 4}px`,
                  }}
                >
                  <span className={clsx(
                    item.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                    (isStart || isEnd) && 'text-blue-600 dark:text-blue-400'
                  )}>
                    {item.value >= 0 ? '' : '-'}{formatK(Math.abs(item.value))}
                  </span>
                </div>

                {/* Bar */}
                <div
                  className={clsx(
                    'w-full rounded-t transition-all',
                    isStart || isEnd ? 'bg-blue-500' :
                    item.isPositive ? 'bg-emerald-500' : 'bg-red-500'
                  )}
                  style={{
                    position: 'absolute',
                    bottom: `${bottomPos}px`,
                    height: `${barH}px`,
                    opacity: isStart || isEnd ? 1 : 0.85,
                  }}
                />

                {/* Label */}
                <div className="absolute bottom-0 transform translate-y-full pt-1 text-center w-full">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-tight" style={{ fontSize: '10px' }}>
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* P&L vs Cash Gap */}
      <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">⚠️ P&L vs Cash Reality</h4>
          <button
            onClick={() => setShowGapDetail(!showGapDetail)}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium"
          >
            {showGapDetail ? 'Hide' : 'Show'} breakdown
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">P&L Says</p>
            <p className="text-lg font-bold text-emerald-600">+{formatDollar(plVsCash.plProfit)}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Cash Says</p>
            <p className="text-lg font-bold text-red-600">{formatDollar(plVsCash.cashChange)}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Gap</p>
            <p className="text-lg font-bold text-red-600">{formatDollar(plVsCash.gap)}</p>
          </div>
        </div>

        {showGapDetail && (
          <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800 space-y-1.5">
            <p className="text-xs font-semibold text-red-700 dark:text-red-300">Where the {formatDollar(plVsCash.gap)} goes:</p>
            {plVsCash.gapBreakdown.map((item) => (
              <div key={item.reason} className="flex items-center justify-between text-xs">
                <span className="text-red-700 dark:text-red-300">{item.reason}</span>
                <span className="font-bold tabular-nums text-red-800 dark:text-red-200">{formatDollar(item.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
