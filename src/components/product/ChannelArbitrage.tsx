import { ArrowRightLeft, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { arbitrageOpportunities, portfolioSummary } from '../../data/product-intelligence';

const channelColors = {
  shopify: 'text-blue-600 dark:text-blue-400',
  amazon: 'text-amber-600 dark:text-amber-400',
  walmart: 'text-green-600 dark:text-green-400',
};

const channelLabels = {
  shopify: 'Shopify DTC',
  amazon: 'Amazon FBA',
  walmart: 'Walmart',
};

export function ChannelArbitrage() {
  const totalArbitrage = portfolioSummary.totalChannelArbitrage;
  const annualized = totalArbitrage * 12;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Channel Margin Arbitrage</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">Margin gained by shifting volume from worst to best channel</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-300">Total Opportunity</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">+${(totalArbitrage / 1000).toFixed(1)}K/mo</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">${(annualized / 1000).toFixed(0)}K/yr</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-3">
        {arbitrageOpportunities.slice(0, 8).map(product => {
          const maxArbitrage = arbitrageOpportunities[0].channelArbitrageOpportunity;
          const barWidth = Math.max(8, (product.channelArbitrageOpportunity / maxArbitrage) * 100);

          return (
            <div key={product.id} className="group">
              <div className="flex items-center gap-3">
                <div className="w-32 flex-shrink-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{product.shortName}</p>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <span className={clsx('text-xs font-medium', channelColors[product.worstChannel])}>
                    {channelLabels[product.worstChannel]}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className={clsx('text-xs font-medium', channelColors[product.bestChannel])}>
                    {channelLabels[product.bestChannel]}
                  </span>
                </div>
                <div className="w-48 flex-shrink-0">
                  <div className="h-5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all flex items-center justify-end pr-2"
                      style={{ width: `${barWidth}%` }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow">
                        +${(product.channelArbitrageOpportunity / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Hover detail */}
              <div className="hidden group-hover:flex items-center gap-2 mt-1 ml-36 text-xs text-slate-500 dark:text-slate-300">
                <span>{channelLabels[product.worstChannel]}: {product.channels[product.worstChannel].contributionMarginPercent}% CM</span>
                <span>→</span>
                <span>{channelLabels[product.bestChannel]}: {product.channels[product.bestChannel].contributionMarginPercent}% CM</span>
                <span className="text-blue-500 font-medium">
                  (Δ {(product.channels[product.bestChannel].contributionMarginPercent - product.channels[product.worstChannel].contributionMarginPercent).toFixed(1)}pp)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CEO Insight */}
      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>CEO Insight:</strong> Shifting just 30% of worst-channel volume to best-channel
          for top 5 SKUs captures <strong>~${Math.round(totalArbitrage * 0.3 / 1000 * 5 / arbitrageOpportunities.length)}K/mo</strong> in additional margin
          from the same products and same volume - only the channel mix changes.
          Every product is most profitable on Shopify DTC.
        </p>
      </div>
    </div>
  );
}
