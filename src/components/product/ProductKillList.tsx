import { Skull, AlertTriangle, Timer, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import { killList } from '../../data/product-intelligence';

export function ProductKillList() {
  if (killList.length === 0) return null;

  const totalTrappedValue = killList.reduce((sum, p) => sum + p.inventoryValue, 0);
  const totalNegativeCM = killList.reduce((sum, p) => {
    return sum + Object.values(p.channels)
      .filter(ch => ch.contributionMargin < 0)
      .reduce((cs, ch) => cs + Math.abs(ch.contributionMargin), 0);
  }, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
            <Skull className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-red-700 dark:text-red-300">Product Kill List</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">SKUs recommended for liquidation or discontinuation</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-300">Capital Trapped</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">${(totalTrappedValue / 1000).toFixed(0)}K</p>
        </div>
      </div>

      <div className="space-y-3">
        {killList.map(product => {
          const worstCM = Math.min(
            product.channels.shopify.contributionMarginPercent,
            product.channels.amazon.contributionMarginPercent,
            product.channels.walmart.contributionMarginPercent,
          );
          const hasNegativeCM = worstCM < 0;
          const isExpiring = product.daysToExpiration !== null && product.daysToExpiration <= 90;
          const isDecelerating = product.velocityTrend === 'decelerating';

          return (
            <div
              key={product.id}
              className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.name}</p>
                    <span className={clsx('px-1.5 py-0.5 rounded text-xs font-semibold',
                      product.reorderRecommendation === 'discontinue'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    )}>
                      {product.reorderRecommendation.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{product.reorderReason}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">
                    ${(product.inventoryValue / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{product.totalUnits.toLocaleString()} units</p>
                </div>
              </div>

              {/* Risk Indicators */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {hasNegativeCM && (
                  <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-3 h-3" />
                    Negative CM on {worstCM < 0 ? 'some channels' : ''}
                  </span>
                )}
                {isExpiring && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <Timer className="w-3 h-3" />
                    {product.daysToExpiration}d to expiration
                  </span>
                )}
                {isDecelerating && (
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    <TrendingDown className="w-3 h-3" />
                    Decelerating velocity
                  </span>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-300">
                  DOH: {product.daysOfInventory}d
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-300">
                  {product.profitContributionPercent}% of profit
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800/50 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-300">SKUs to Kill</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{killList.length}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-300">Capital to Free</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">${(totalTrappedValue / 1000).toFixed(0)}K</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-300">Monthly Losses Avoided</p>
          <p className="text-lg font-bold text-emerald-600">+${(totalNegativeCM / 1000).toFixed(1)}K</p>
        </div>
      </div>
    </div>
  );
}
