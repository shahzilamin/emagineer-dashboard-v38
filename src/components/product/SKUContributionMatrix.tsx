import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import { productSKUs, portfolioSummary, type ProductSKU } from '../../data/product-intelligence';

type SortKey = 'profitContributionPercent' | 'channelArbitrageOpportunity' | 'daysOfInventory';

const cmColor = (pct: number) => {
  if (pct > 25) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
  if (pct >= 15) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
  if (pct >= 0) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
  return 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40';
};

const abcBadge = (cls: string) => {
  if (cls === 'A') return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
  if (cls === 'B') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
  return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
};

const velocityIcon = (trend: string) => {
  if (trend === 'accelerating') return <TrendingUp className="w-3 h-3 text-emerald-500" />;
  if (trend === 'decelerating') return <TrendingDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-slate-400" />;
};

function ChannelDetail({ label, econ }: { label: string; econ: ProductSKU['channels']['shopify'] }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        <span className={clsx('text-sm font-bold px-2 py-0.5 rounded', cmColor(econ.contributionMarginPercent))}>
          {econ.contributionMarginPercent}% CM
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-300">Revenue</span>
          <p className="font-semibold text-slate-900 dark:text-white">${(econ.revenue / 1000).toFixed(1)}K</p>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-300">Platform</span>
          <p className="font-semibold text-red-600 dark:text-red-400">-${(econ.platformFees / 1000).toFixed(1)}K</p>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-300">Fulfillment</span>
          <p className="font-semibold text-red-600 dark:text-red-400">-${(econ.fulfillment / 1000).toFixed(1)}K</p>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-300">Ad Spend</span>
          <p className="font-semibold text-red-600 dark:text-red-400">-${(econ.adSpendAllocation / 1000).toFixed(1)}K</p>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-300">Return Rate: {(econ.returnRate * 100).toFixed(0)}%</span>
        <span className="font-bold text-slate-900 dark:text-white">
          CM: ${(econ.contributionMargin / 1000).toFixed(1)}K
        </span>
      </div>
    </div>
  );
}

export function SKUContributionMatrix() {
  const [expandedSKU, setExpandedSKU] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('profitContributionPercent');

  const sorted = [...productSKUs].sort((a, b) => {
    if (sortBy === 'daysOfInventory') return b[sortBy] - a[sortBy]; // worst first
    return b[sortBy] - a[sortBy];
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">SKU x Channel Contribution Margin</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">True per-unit profit after ALL variable costs, by channel</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort:</span>
          {[
            { key: 'profitContributionPercent' as SortKey, label: 'Profit %' },
            { key: 'channelArbitrageOpportunity' as SortKey, label: 'Arbitrage $' },
            { key: 'daysOfInventory' as SortKey, label: 'DOH' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={clsx(
                'px-2 py-1 rounded text-xs font-medium transition-colors',
                sortBy === opt.key
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-300">Portfolio CM</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{portfolioSummary.avgContributionMargin}%</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-300">Total Monthly CM</p>
          <p className="text-lg font-bold text-emerald-600">${(portfolioSummary.totalProfit / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-300">Arbitrage Opportunity</p>
          <p className="text-lg font-bold text-blue-600">+${(portfolioSummary.totalChannelArbitrage / 1000).toFixed(1)}K/mo</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-300">Active SKUs</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{portfolioSummary.totalSKUs}</p>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2 pr-3 text-xs font-medium text-slate-500 dark:text-slate-300">Product</th>
              <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 dark:text-slate-300">ABC</th>
              <th className="text-center py-2 px-2 text-xs font-medium text-blue-600 dark:text-blue-400">Shopify CM</th>
              <th className="text-center py-2 px-2 text-xs font-medium text-amber-600 dark:text-amber-400">Amazon CM</th>
              <th className="text-center py-2 px-2 text-xs font-medium text-green-600 dark:text-green-400">Walmart CM</th>
              <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 dark:text-slate-300">DOH</th>
              <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 dark:text-slate-300">Velocity</th>
              <th className="text-right py-2 pl-2 text-xs font-medium text-slate-500 dark:text-slate-300">Arbitrage</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {sorted.map(product => (
              <>
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
                  onClick={() => setExpandedSKU(expandedSKU === product.id ? null : product.id)}
                >
                  <td className="py-2.5 pr-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{product.shortName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-300">{product.sku}</p>
                    </div>
                  </td>
                  <td className="text-center py-2.5 px-2">
                    <span className={clsx('px-1.5 py-0.5 rounded text-xs font-bold', abcBadge(product.abcClass))}>
                      {product.abcClass}
                    </span>
                  </td>
                  <td className="text-center py-2.5 px-2">
                    <span className={clsx('px-2 py-0.5 rounded text-xs font-bold', cmColor(product.channels.shopify.contributionMarginPercent))}>
                      {product.channels.shopify.contributionMarginPercent}%
                    </span>
                  </td>
                  <td className="text-center py-2.5 px-2">
                    <span className={clsx('px-2 py-0.5 rounded text-xs font-bold', cmColor(product.channels.amazon.contributionMarginPercent))}>
                      {product.channels.amazon.contributionMarginPercent}%
                    </span>
                  </td>
                  <td className="text-center py-2.5 px-2">
                    <span className={clsx('px-2 py-0.5 rounded text-xs font-bold', cmColor(product.channels.walmart.contributionMarginPercent))}>
                      {product.channels.walmart.contributionMarginPercent}%
                    </span>
                  </td>
                  <td className="text-center py-2.5 px-2">
                    <span className={clsx('text-xs font-semibold',
                      product.daysOfInventory > 90 ? 'text-red-600 dark:text-red-400' :
                      product.daysOfInventory > 60 ? 'text-amber-600 dark:text-amber-400' :
                      'text-slate-600 dark:text-slate-300'
                    )}>
                      {product.daysOfInventory}d
                    </span>
                  </td>
                  <td className="text-center py-2.5 px-2">
                    <div className="flex items-center justify-center gap-1">
                      {velocityIcon(product.velocityTrend)}
                      <span className={clsx('text-xs font-medium px-1.5 py-0.5 rounded',
                        product.velocityCategory === 'fast' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' :
                        product.velocityCategory === 'medium' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                        product.velocityCategory === 'slow' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' :
                        'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      )}>
                        {product.velocityCategory}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-2.5 pl-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      +${(product.channelArbitrageOpportunity / 1000).toFixed(1)}K
                    </span>
                  </td>
                  <td className="py-2.5 pl-1">
                    {expandedSKU === product.id ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </td>
                </tr>
                {expandedSKU === product.id && (
                  <tr key={`${product.id}-detail`}>
                    <td colSpan={9} className="py-3 px-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <ChannelDetail label="Shopify DTC" econ={product.channels.shopify} />
                        <ChannelDetail label="Amazon FBA" econ={product.channels.amazon} />
                        <ChannelDetail label="Walmart" econ={product.channels.walmart} />
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Recommendation: <span className="capitalize">{product.reorderRecommendation}</span>
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{product.reorderReason}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
