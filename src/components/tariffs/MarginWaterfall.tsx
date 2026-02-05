import { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { portfolioMarginWaterfall } from '../../data/tariffs';

function formatCurrency(value: number, compact = false): string {
  const abs = Math.abs(value);
  if (compact && abs >= 1000000) return `$${(abs / 1000000).toFixed(1)}M`;
  if (compact && abs >= 1000) return `$${(abs / 1000).toFixed(0)}K`;
  return `$${abs.toFixed(0)}`;
}

export function MarginWaterfall() {
  const [showDetail, setShowDetail] = useState(false);
  const items = portfolioMarginWaterfall;

  // Find the revenue item for scaling
  const revenueValue = items.find((i) => i.type === 'revenue')?.value || 1;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" />
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              Revenue-to-Profit Waterfall
            </h4>
          </div>
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {showDetail ? 'Compact' : 'Detailed'} view
            {showDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Where every dollar goes - from $847K revenue to $236K contribution profit
        </p>
      </div>

      <div className="p-4 space-y-2">
        {items.map((item) => {
          const absValue = Math.abs(item.value);
          const barWidth = (absValue / revenueValue) * 100;
          const isRevenue = item.type === 'revenue';
          const isProfit = item.type === 'profit';
          const isSubtotal = item.type === 'subtotal';
          const isTariff = item.label.includes('Tariff');
          const hasErosion = item.previousPercentOfRevenue !== undefined && 
            item.percentOfRevenue > item.previousPercentOfRevenue;

          return (
            <div key={item.label} className={`${isSubtotal || isProfit ? 'pt-2 border-t border-slate-100 dark:border-slate-700' : ''}`}>
              <div className="flex items-center gap-3">
                {/* Label */}
                <div className="w-44 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm ${
                      isRevenue || isProfit || isSubtotal
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {!isRevenue && !isSubtotal && !isProfit && '−'} {item.label}
                    </span>
                    {isTariff && <AlertTriangle className="w-3 h-3 text-red-500" />}
                  </div>
                </div>

                {/* Bar */}
                <div className="flex-1 h-7 bg-slate-100 dark:bg-slate-700 rounded-md overflow-hidden relative">
                  <div
                    className="h-full rounded-md transition-all duration-500 flex items-center"
                    style={{
                      width: `${Math.max(barWidth, 2)}%`,
                      backgroundColor: item.color,
                      opacity: isSubtotal ? 0.6 : 1,
                    }}
                  >
                    {barWidth > 12 && (
                      <span className="text-xs font-bold text-white ml-2">
                        {formatCurrency(absValue, true)}
                      </span>
                    )}
                  </div>
                  {barWidth <= 12 && (
                    <span className="absolute left-[calc(max(2%,_var(--bar-width))+4px)] top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 dark:text-slate-300"
                      style={{ '--bar-width': `${barWidth}%` } as React.CSSProperties}
                    >
                      {formatCurrency(absValue, true)}
                    </span>
                  )}
                </div>

                {/* Percentage */}
                <div className="w-20 text-right shrink-0">
                  <span className={`text-xs font-bold ${
                    isRevenue ? 'text-blue-600' :
                    isProfit ? 'text-emerald-600' :
                    isSubtotal ? 'text-slate-600 dark:text-slate-300' :
                    'text-slate-500'
                  }`}>
                    {item.percentOfRevenue.toFixed(1)}%
                  </span>
                  {hasErosion && showDetail && (
                    <span className="text-xs text-red-500 block">
                      was {item.previousPercentOfRevenue?.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Detail description */}
              {showDetail && (
                <div className="ml-44 pl-3 mt-1 mb-2">
                  <p className="text-xs text-slate-500">{item.description}</p>
                  {hasErosion && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      +{(item.percentOfRevenue - (item.previousPercentOfRevenue || 0)).toFixed(1)}pp increase vs pre-tariff
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tariff callout */}
      <div className="px-4 pb-4">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-red-700 dark:text-red-300">
              Tariffs consume 14.6% of revenue (was 5.2% pre-tariff)
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              Contribution profit dropped from 39.3% to 27.8% - a 11.5pp erosion. Tariff increases are the single largest cost driver.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
