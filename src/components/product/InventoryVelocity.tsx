import { Package, AlertTriangle, Timer } from 'lucide-react';
import { clsx } from 'clsx';
import { inventoryVelocitySummary, productSKUs } from '../../data/product-intelligence';

const categoryColors = {
  fast: { bg: 'bg-emerald-500', label: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  medium: { bg: 'bg-blue-500', label: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  slow: { bg: 'bg-amber-500', label: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  dead: { bg: 'bg-red-500', label: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
};

const categoryLabels = {
  fast: '< 30 DOH',
  medium: '30-60 DOH',
  slow: '60-90 DOH',
  dead: '> 90 DOH',
};

export function InventoryVelocity() {
  const summary = inventoryVelocitySummary;

  // Products with expiration risk
  const expiringProducts = productSKUs
    .filter(p => p.daysToExpiration !== null && p.daysToExpiration <= 180)
    .sort((a, b) => (a.daysToExpiration ?? 999) - (b.daysToExpiration ?? 999));

  return (
    <div className="space-y-6">
      {/* Velocity Distribution */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5 text-slate-500" />
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Inventory Velocity</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">Cash tied up by velocity category</p>
          </div>
        </div>

        {/* Stacked bar */}
        <div className="h-8 rounded-full overflow-hidden flex mb-4">
          {(['fast', 'medium', 'slow', 'dead'] as const).map(cat => {
            const data = summary[cat];
            if (data.percent === 0) return null;
            return (
              <div
                key={cat}
                className={clsx(categoryColors[cat].bg, 'transition-all relative group')}
                style={{ width: `${data.percent}%` }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold text-white drop-shadow">{data.percent}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend + Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['fast', 'medium', 'slow', 'dead'] as const).map(cat => {
            const data = summary[cat];
            const colors = categoryColors[cat];
            const isProblematic = cat === 'slow' || cat === 'dead';
            return (
              <div key={cat} className={clsx(
                'rounded-lg p-3 border',
                isProblematic
                  ? 'border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30'
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={clsx('w-2.5 h-2.5 rounded-full', colors.dot)} />
                  <span className={clsx('text-sm font-semibold capitalize', colors.label)}>{cat}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-300">{categoryLabels[cat]}</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  ${(data.value / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {data.count} SKU{data.count !== 1 ? 's' : ''} - {data.percent}% of inventory
                </p>
              </div>
            );
          })}
        </div>

        {/* Cash Trapped Warning */}
        {summary.cashTrappedInSlowDead > 0 && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                ${(summary.cashTrappedInSlowDead / 1000).toFixed(0)}K trapped in slow + dead inventory
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Target: &lt;15% of total value. Current: {((summary.slow.percent || 0) + (summary.dead.percent || 0)).toFixed(1)}%.
                Liquidating dead stock frees ${(summary.dead.value / 1000).toFixed(0)}K in working capital.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Expiration Risk Tracker */}
      {expiringProducts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3 mb-4">
            <Timer className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Expiration Risk Tracker</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">PPE inventory approaching shelf-life limits</p>
            </div>
          </div>

          <div className="space-y-3">
            {expiringProducts.map(product => {
              const days = product.daysToExpiration ?? 0;
              const riskColor = days <= 60 ? 'red' : days <= 90 ? 'amber' : 'yellow';
              const barWidth = Math.max(5, Math.min(100, (days / 180) * 100));
              return (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-36 flex-shrink-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.shortName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">${(product.inventoryValue / 1000).toFixed(0)}K value</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full transition-all',
                          riskColor === 'red' ? 'bg-red-500' :
                          riskColor === 'amber' ? 'bg-amber-500' : 'bg-yellow-500'
                        )}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right flex-shrink-0">
                    <span className={clsx('text-sm font-bold',
                      riskColor === 'red' ? 'text-red-600 dark:text-red-400' :
                      riskColor === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                      'text-yellow-600 dark:text-yellow-400'
                    )}>
                      {days}d
                    </span>
                  </div>
                  <div className="w-20 flex-shrink-0">
                    <span className={clsx('px-2 py-0.5 rounded text-xs font-semibold',
                      product.expirationRisk === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                      product.expirationRisk === 'urgent' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    )}>
                      {product.expirationRisk?.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
