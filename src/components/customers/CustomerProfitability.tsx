import { clsx } from 'clsx';
import { PieChart } from 'lucide-react';
import { profitabilityTiers, crossChannelOverlap, segmentMigrations } from '../../data/customer-intelligence';
import { formatCurrency } from '../../utils/format';

export function CustomerProfitability() {
  const unprofitable = profitabilityTiers.find(t => t.tier === 'Unprofitable');

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Profitability Tiers */}
      <div className="col-span-12 lg:col-span-7 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-violet-500" />
              Customer Profitability Tiers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
              True contribution margin per customer after all costs
            </p>
          </div>
        </div>

        {/* Stacked Bar */}
        <div className="flex h-8 rounded-full overflow-hidden mb-4">
          {profitabilityTiers.map((tier) => (
            <div
              key={tier.tier}
              className="relative group transition-all hover:opacity-80"
              style={{
                width: `${tier.percentOfTotal}%`,
                backgroundColor: tier.color,
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 whitespace-nowrap bg-slate-900 text-white text-xs rounded px-2 py-1">
                {tier.tier}: {tier.count.toLocaleString()} ({tier.percentOfTotal}%)
              </div>
            </div>
          ))}
        </div>

        {/* Tier Cards */}
        <div className="space-y-3">
          {profitabilityTiers.map((tier) => (
            <div
              key={tier.tier}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                <div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{tier.tier}</span>
                  <span className="text-xs text-slate-500 ml-2">{tier.percentOfTotal}%</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Avg Revenue</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatCurrency(tier.avgRevenue)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Avg CM</p>
                  <p className={clsx(
                    'text-sm font-semibold tabular-nums',
                    tier.avgContributionMargin >= 0 ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {tier.avgContributionMargin >= 0 ? '+' : ''}{formatCurrency(tier.avgContributionMargin)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Count</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {tier.count.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {unprofitable && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-800 dark:text-red-300">
              <span className="font-semibold">⚠️ {unprofitable.percentOfTotal}% of customers are unprofitable</span> - 
              {unprofitable.count.toLocaleString()} customers generate revenue but destroy margin after returns, support, and discounts.
              Average contribution margin: {formatCurrency(unprofitable.avgContributionMargin)}/customer.
            </p>
          </div>
        )}
      </div>

      {/* Cross-Channel + Migration */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        {/* Cross-Channel Overlap */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Cross-Channel Overlap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 mb-4">
            Estimated customer overlap between sales channels
          </p>
          <div className="space-y-3">
            {crossChannelOverlap.map((overlap) => (
              <div key={`${overlap.channel1}-${overlap.channel2}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{overlap.channel1}</span>
                  <span className="text-slate-500">×</span>
                  <span className="text-slate-700 dark:text-slate-300">{overlap.channel2}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-blue-600 tabular-nums">{overlap.overlapPercent}%</span>
                  <span className="text-xs text-slate-500 ml-1.5">({overlap.overlapCustomers.toLocaleString()})</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              ~14% Shopify-Amazon overlap means you may be double-counting ~2,130 unique customers across channels.
            </p>
          </div>
        </div>

        {/* Segment Migration Highlights */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Segment Migration (MoM)
          </h3>
          <div className="space-y-2">
            {segmentMigrations
              .filter(m => m.count >= 80 || m.direction === 'downgrade' && m.from === "Can't Lose Them")
              .sort((a, b) => b.count - a.count)
              .slice(0, 6)
              .map((migration, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-slate-700 dark:text-slate-300">{migration.from}</span>
                    <span className={clsx(
                      'text-xs',
                      migration.direction === 'upgrade' ? 'text-emerald-500' : 'text-red-500'
                    )}>
                      →
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{migration.to}</span>
                  </div>
                  <span className={clsx(
                    'text-sm font-semibold tabular-nums',
                    migration.direction === 'upgrade' ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {migration.direction === 'upgrade' ? '+' : '-'}{migration.count}
                  </span>
                </div>
              ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-600 font-medium">
                ↑ {segmentMigrations.filter(m => m.direction === 'upgrade').reduce((sum, m) => sum + m.count, 0)} upgraded
              </span>
              <span className="text-red-600 font-medium">
                ↓ {segmentMigrations.filter(m => m.direction === 'downgrade').reduce((sum, m) => sum + m.count, 0)} downgraded
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
