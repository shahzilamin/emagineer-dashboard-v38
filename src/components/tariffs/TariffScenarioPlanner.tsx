import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Globe,
  Calculator,
  Percent,
} from 'lucide-react';
import {
  tariffScenarios,
  scenarioImpacts,
  sourcingConcentration,
  type TariffScenario,
  type ScenarioImpact,
} from '../../data/tariffs';

function formatCurrency(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
}

// ─── Scenario Selector ───
function ScenarioSelector({
  selected,
  onSelect,
}: {
  selected: TariffScenario;
  onSelect: (s: TariffScenario) => void;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {tariffScenarios.map((s) => {
        const isActive = selected === s.id;
        const impact = scenarioImpacts.find((si) => si.scenario.id === s.id);
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`text-left p-3 rounded-xl border-2 transition-all ${
              isActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                s.id === 'optimistic' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                s.id === 'current' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                s.id === 'pessimistic' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              }`}>
                {s.probability}% likely
              </span>
            </div>
            <p className="font-semibold text-sm text-slate-900 dark:text-white">{s.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">{s.description}</p>
            {impact && (
              <p className={`text-xs font-bold mt-1.5 ${
                impact.avgMarginDelta >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {impact.avgMarginDelta >= 0 ? '+' : ''}{impact.avgMarginDelta.toFixed(1)}pp margin
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Product Impact Table ───
function ProductImpactTable({ impact }: { impact: ScenarioImpact }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-500" />
            Product-Level Impact
          </h4>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Portfolio Margin: <strong className={impact.portfolioMargin > 40 ? 'text-emerald-600' : impact.portfolioMargin > 30 ? 'text-amber-600' : 'text-red-600'}>{impact.portfolioMargin.toFixed(1)}%</strong></span>
            <span>Monthly Impact: <strong className={impact.totalMonthlyImpact <= 0 ? 'text-emerald-600' : 'text-red-600'}>{impact.totalMonthlyImpact >= 0 ? '+' : '-'}${Math.abs(Math.round(impact.totalMonthlyImpact / 1000))}K</strong></span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-slate-500 bg-slate-50 dark:bg-slate-800/50">
          <div className="col-span-3">Product</div>
          <div className="col-span-1 text-right">Rev %</div>
          <div className="col-span-2 text-right">Landed Cost</div>
          <div className="col-span-2 text-right">Margin</div>
          <div className="col-span-2 text-right">Price to Keep Target</div>
          <div className="col-span-2 text-right">$/mo Impact</div>
        </div>

        {impact.products.map((p) => {
          const isExpanded = expanded === p.product.id;
          const marginOk = p.adjustedMargin >= p.product.targetMargin;
          const isVietnam = p.product.sourcingOrigin !== 'china';

          return (
            <div key={p.product.id}>
              <button
                onClick={() => setExpanded(isExpanded ? null : p.product.id)}
                className="w-full grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors items-center"
              >
                <div className="col-span-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">{p.product.name}</span>
                    {isVietnam && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {p.product.sourcingOrigin.toUpperCase()}
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{p.product.category}</p>
                </div>
                <div className="col-span-1 text-right text-slate-600 dark:text-slate-300">
                  {p.product.revenueShare}%
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(p.adjustedLandedCost)}</span>
                  <span className="text-xs text-slate-500 ml-1">
                    ({p.adjustedLandedCost > p.product.currentLandedCost ? '+' : ''}{((p.adjustedLandedCost / p.product.currentLandedCost - 1) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className={`font-bold ${marginOk ? 'text-emerald-600' : 'text-red-600'}`}>
                    {p.adjustedMargin.toFixed(1)}%
                  </span>
                  <span className={`text-xs ml-1 ${p.marginDelta >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    ({p.marginDelta >= 0 ? '+' : ''}{p.marginDelta.toFixed(1)}pp)
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  {p.priceIncreaseNeeded > 0 ? (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {formatCurrency(p.priceToMaintainMargin)} <span className="text-xs">(+{p.priceIncreaseNeeded.toFixed(0)}%)</span>
                    </span>
                  ) : (
                    <span className="text-emerald-600">Current OK</span>
                  )}
                </div>
                <div className="col-span-2 text-right">
                  <span className={`font-bold ${p.monthlyMarginImpact <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {p.monthlyMarginImpact > 0 ? '-' : p.monthlyMarginImpact < 0 ? '+' : ''}
                    ${Math.abs(Math.round(p.monthlyMarginImpact / 1000))}K
                  </span>
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 bg-slate-50 dark:bg-slate-800/50">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Ex-Works Price</p>
                      <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.product.exWorksPrice)}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">HTS Code</p>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{p.product.htsCode}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Monthly Units</p>
                      <p className="font-bold text-slate-900 dark:text-white">{p.product.monthlyUnits.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Pricing Strategy</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.product.pricingStrategy === 'premium' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                        p.product.pricingStrategy === 'volume' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {p.product.pricingStrategy.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Tariff breakdown */}
                  <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-500 mb-2">Duty Layers (Stacked)</p>
                    <div className="space-y-1.5">
                      {p.product.tariffLayers.map((layer, idx) => {
                        const cumulativeWidth = p.product.tariffLayers.slice(0, idx + 1).reduce((s, l) => s + l.rate, 0);
                        const maxRate = p.product.tariffLayers.reduce((s, l) => s + l.rate, 0);
                        return (
                          <div key={layer.name} className="flex items-center gap-3">
                            <span className="text-xs text-slate-600 dark:text-slate-300 w-32 shrink-0">{layer.name}</span>
                            <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-600 rounded-full overflow-hidden relative">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-orange-500' : idx === 2 ? 'bg-red-500' : 'bg-red-700'
                                }`}
                                style={{ width: `${(cumulativeWidth / Math.max(maxRate * 1.2, 100)) * 100}%` }}
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-white">
                                {layer.rate}%
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 w-16 text-right">
                              +{formatCurrency(p.product.exWorksPrice * layer.rate / 100)}
                            </span>
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-3 pt-1 border-t border-slate-200 dark:border-slate-600">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 w-32">Total Duties</span>
                        <div className="flex-1" />
                        <span className="text-xs font-bold text-red-600 w-16 text-right">
                          {p.product.tariffLayers.reduce((s, l) => s + l.rate, 0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pre vs Post comparison */}
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <span className="text-slate-500">Pre-tariff landed: <strong className="text-slate-700 dark:text-slate-200">{formatCurrency(p.product.preTariffLandedCost)}</strong></span>
                    <span className="text-slate-400">→</span>
                    <span className="text-slate-500">Current landed: <strong className="text-red-600">{formatCurrency(p.product.currentLandedCost)}</strong></span>
                    <span className="text-red-500 font-bold">
                      +{((p.product.currentLandedCost / p.product.preTariffLandedCost - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sourcing Concentration Ring ───
function SourcingConcentrationPanel() {
  const total = sourcingConcentration.reduce((s, c) => s + c.percentOfCogs, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-blue-500" />
        Sourcing Concentration Risk
      </h4>

      {/* Horizontal stacked bar */}
      <div className="h-8 rounded-full overflow-hidden flex mb-4">
        {sourcingConcentration.map((s) => (
          <div
            key={s.origin}
            className="h-full flex items-center justify-center text-xs font-bold text-white transition-all"
            style={{ width: `${(s.percentOfCogs / total) * 100}%`, backgroundColor: s.color }}
          >
            {s.percentOfCogs > 5 && `${s.percentOfCogs}%`}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {sourcingConcentration.map((s) => (
          <div key={s.origin} className="flex items-start gap-2">
            <div className="w-3 h-3 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: s.color }} />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{s.label}</p>
              <p className="text-xs text-slate-500">{s.percentOfCogs}% of COGS</p>
              <p className="text-xs text-slate-500">Tariff: {s.tariffExposure}%</p>
              {s.transitionCost > 0 && (
                <p className="text-xs text-slate-500">
                  Diversify: ${(s.transitionCost / 1000).toFixed(0)}K / {s.transitionTimeline}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className="mt-4 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-medium text-red-700 dark:text-red-300">
            Critical concentration: 82.4% from China
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
            Every 10pp tariff increase costs ~${Math.round(tariffQuickStats.monthlyTariffCost / 4200)}K/month. Dual-sourcing top 3 SKUs reduces exposure to 55%.
          </p>
        </div>
      </div>
    </div>
  );
}

// Fix: reference tariff quick stats
import { tariffQuickStats } from '../../data/tariffs';

// ─── Main Scenario Planner ───
export function TariffScenarioPlanner() {
  const [selectedScenario, setSelectedScenario] = useState<TariffScenario>('current');
  const currentImpact = scenarioImpacts.find((si) => si.scenario.id === selectedScenario)!;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/20">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Tariff & COGS Scenario Planner
          </h2>
          <p className="text-sm text-slate-500">
            Model tariff impact on landed costs, margins, and pricing
          </p>
        </div>
      </div>

      {/* Scenario impact summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Percent className="w-4 h-4 text-blue-500" />
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Scenario Summary</h4>
          <span className="text-xs text-slate-500 ml-auto">
            IEEPA Rate: {currentImpact.scenario.ieepaRate}%
            {currentImpact.scenario.additionalDutyRate > 0 &&
              ` + ${currentImpact.scenario.additionalDutyRate}% additional`}
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Portfolio Margin</p>
            <p className={`text-xl font-bold ${
              currentImpact.portfolioMargin > 40 ? 'text-emerald-600' :
              currentImpact.portfolioMargin > 30 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {currentImpact.portfolioMargin.toFixed(1)}%
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Margin Impact</p>
            <p className={`text-xl font-bold flex items-center gap-1 ${
              currentImpact.avgMarginDelta >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {currentImpact.avgMarginDelta >= 0 ? '+' : ''}{currentImpact.avgMarginDelta.toFixed(1)}pp
              <TrendingDown className={`w-4 h-4 ${currentImpact.avgMarginDelta >= 0 ? 'rotate-180' : ''}`} />
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Monthly Cost Impact</p>
            <p className={`text-xl font-bold ${
              currentImpact.totalMonthlyImpact <= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {currentImpact.totalMonthlyImpact >= 0 ? '+' : '-'}${Math.abs(Math.round(currentImpact.totalMonthlyImpact / 1000))}K
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Avg Price Increase Needed</p>
            <p className={`text-xl font-bold ${
              currentImpact.avgPriceIncrease <= 0 ? 'text-emerald-600' :
              currentImpact.avgPriceIncrease < 10 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {currentImpact.avgPriceIncrease > 0 ? '+' : ''}{currentImpact.avgPriceIncrease.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Scenario selector */}
      <ScenarioSelector selected={selectedScenario} onSelect={setSelectedScenario} />

      {/* Product impact table */}
      <ProductImpactTable impact={currentImpact} />

      {/* Sourcing concentration */}
      <SourcingConcentrationPanel />
    </div>
  );
}
