import { useState, useMemo, useCallback } from 'react';
import { clsx } from 'clsx';
import {
  Lightbulb,
  RotateCcw,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Megaphone,
  ShoppingCart,
  Warehouse,
  Target,
  Zap,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ScenarioSlider } from './ScenarioSlider';
import { ImpactCard, ImpactSummaryBar } from './ImpactCard';
import { SparklineChart } from '../charts/SparklineChart';
import { wellBeforeMetrics, cashFlowMetrics } from '../../data/wellbefore';
import { d2cBuildersMetrics } from '../../data/d2cbuilders';
import { useDashboard } from '../../contexts/DashboardContext';

interface WBScenario {
  adSpendChange: number;       // percentage change: -50 to +100
  priceChange: number;         // percentage: -20 to +20
  cacChange: number;           // dollar amount
  conversionRateChange: number; // percentage points
  emailFreqMultiplier: number; // 1x to 2x
  repeatRateChange: number;    // percentage points
}

interface D2CScenario {
  newClients: number;          // 0-5 new clients
  avgClientRevenue: number;    // avg monthly revenue per new client
  laborEfficiency: number;     // percentage improvement
  shippingMarginChange: number; // percentage points
  warehouseExpansion: number;  // 0 or 1 (boolean as number)
}

const WB_DEFAULTS: WBScenario = {
  adSpendChange: 0,
  priceChange: 0,
  cacChange: wellBeforeMetrics.marketing.cac.blended.current,
  conversionRateChange: 0,
  emailFreqMultiplier: 1,
  repeatRateChange: 0,
};

const D2C_DEFAULTS: D2CScenario = {
  newClients: 0,
  avgClientRevenue: 15000,
  laborEfficiency: 0,
  shippingMarginChange: 0,
  warehouseExpansion: 0,
};

// Preset scenarios
const WB_PRESETS = [
  {
    name: 'Aggressive Growth',
    icon: Zap,
    description: 'Max ad spend + price increase + email blitz',
    values: { adSpendChange: 50, priceChange: 8, cacChange: 22, conversionRateChange: 0, emailFreqMultiplier: 1.5, repeatRateChange: 2 },
  },
  {
    name: 'Efficiency Focus',
    icon: Target,
    description: 'Cut ad spend, optimize conversion, boost retention',
    values: { adSpendChange: -20, priceChange: 0, cacChange: 15, conversionRateChange: 0.5, emailFreqMultiplier: 1.3, repeatRateChange: 4 },
  },
  {
    name: 'Price Power',
    icon: DollarSign,
    description: 'Test price elasticity with small volume loss',
    values: { adSpendChange: 0, priceChange: 15, cacChange: 18.42, conversionRateChange: -0.3, emailFreqMultiplier: 1, repeatRateChange: -1 },
  },
];

const D2C_PRESETS = [
  {
    name: 'Scale Up',
    icon: TrendingUp,
    description: '3 new clients + warehouse expansion',
    values: { newClients: 3, avgClientRevenue: 18000, laborEfficiency: 5, shippingMarginChange: 0, warehouseExpansion: 1 },
  },
  {
    name: 'Optimize Margins',
    icon: BarChart3,
    description: 'No expansion, pure margin improvement',
    values: { newClients: 0, avgClientRevenue: 15000, laborEfficiency: 10, shippingMarginChange: 2, warehouseExpansion: 0 },
  },
];

function formatPct(v: number): string {
  return `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;
}

function formatDollars(v: number, compact = false): string {
  if (compact && Math.abs(v) >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (compact && Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function ScenarioPlanner() {
  const { company } = useDashboard();
  const [activeTab, setActiveTab] = useState<'wellbefore' | 'd2cbuilders'>(
    company === 'd2cbuilders' ? 'd2cbuilders' : 'wellbefore'
  );
  const [wb, setWB] = useState<WBScenario>(WB_DEFAULTS);
  const [d2c, setD2C] = useState<D2CScenario>(D2C_DEFAULTS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const resetWB = useCallback(() => setWB(WB_DEFAULTS), []);
  const resetD2C = useCallback(() => setD2C(D2C_DEFAULTS), []);

  // --- WellBefore Projections ---
  const wbProjections = useMemo(() => {
    const m = wellBeforeMetrics;
    const cf = cashFlowMetrics;

    // Current monthly baseline
    const currentMonthlyRevenue = 920000; // target
    const currentAdSpend = m.marketing.spend.budget; // 95000
    const currentConvRate = 2.8; // percent
    const currentGrossMargin = m.profitability.grossMargin.current / 100;
    const currentEmailRevenue = 84000;

    // Adjusted values
    const newAdSpend = currentAdSpend * (1 + wb.adSpendChange / 100);
    const newCAC = wb.cacChange;

    // Price change affects AOV and volume
    const priceElasticity = -0.8; // 1% price increase = 0.8% volume decrease
    const volumeImpact = 1 + (wb.priceChange * priceElasticity / 100);

    // Email revenue change
    const newEmailRevenue = currentEmailRevenue * wb.emailFreqMultiplier * 0.85; // diminishing returns

    // Simplified projection: scale from current
    const adSpendRevenueRatio = currentAdSpend > 0 ? (m.marketing.roas.blended.current * currentAdSpend) : 0;
    const newPaidRevenue = newAdSpend * m.marketing.roas.blended.current * (m.marketing.cac.blended.current / newCAC) * volumeImpact;
    const emailDelta = newEmailRevenue - currentEmailRevenue;
    const priceRevenueImpact = currentMonthlyRevenue * (wb.priceChange / 100) * (1 + priceElasticity * wb.priceChange / 100);
    const repeatRevenueImpact = currentMonthlyRevenue * (wb.repeatRateChange / 100) * 0.3;
    const conversionRevenueImpact = currentMonthlyRevenue * (wb.conversionRateChange / currentConvRate);

    const projectedMonthlyRevenue = Math.max(0,
      currentMonthlyRevenue
      + (newPaidRevenue - adSpendRevenueRatio)
      + emailDelta
      + priceRevenueImpact
      + repeatRevenueImpact
      + conversionRevenueImpact
    );

    // Margin: price increases improve margin, volume changes don't affect it much
    const marginImpact = wb.priceChange > 0
      ? currentGrossMargin + (wb.priceChange / 100) * 0.7 // 70% of price increase flows to margin
      : currentGrossMargin + (wb.priceChange / 100) * 0.4; // price cuts hit margin harder

    const projectedGrossMargin = Math.max(0.1, Math.min(0.8, marginImpact));
    const projectedGrossProfit = projectedMonthlyRevenue * projectedGrossMargin;

    // Operating costs
    const currentOpCosts = currentMonthlyRevenue * (m.profitability.operatingExpenseRatio.current / 100);
    const projectedOpCosts = currentOpCosts * (1 + (projectedMonthlyRevenue - currentMonthlyRevenue) / currentMonthlyRevenue * 0.3); // 30% variable

    const projectedNetProfit = projectedGrossProfit - newAdSpend - projectedOpCosts;
    const currentNetProfit = currentMonthlyRevenue * currentGrossMargin - currentAdSpend - currentOpCosts;

    // Annual projections
    const projectedAnnualRevenue = projectedMonthlyRevenue * 12;
    const currentAnnualRevenue = currentMonthlyRevenue * 12;

    // Cash impact over 12 months
    const projectedCashPosition = cf.currentCash + (projectedNetProfit - currentNetProfit) * 12;

    // ROAS
    const projectedROAS = newAdSpend > 0 ? projectedMonthlyRevenue * 0.65 / newAdSpend : Infinity; // paid revenue / ad spend

    // LTV:CAC
    const projectedLTV = m.customers.ltv.current * (1 + wb.priceChange / 100) * (1 + wb.repeatRateChange / 100 * 0.5);
    const projectedLTVCAC = newCAC > 0 ? projectedLTV / newCAC : Infinity;

    // 12-month forecast
    const forecast = Array.from({ length: 12 }, (_, i) => {
      const growthFactor = 1 + (i * 0.005); // slight compound growth
      return {
        date: `Month ${i + 1}`,
        value: Math.round(projectedMonthlyRevenue * growthFactor),
      };
    });

    const currentForecast = Array.from({ length: 12 }, (_, i) => ({
      date: `Month ${i + 1}`,
      value: Math.round(currentMonthlyRevenue * (1 + i * 0.003)),
    }));

    return {
      revenue: { current: currentMonthlyRevenue, projected: projectedMonthlyRevenue },
      annualRevenue: { current: currentAnnualRevenue, projected: projectedAnnualRevenue },
      grossMargin: { current: currentGrossMargin * 100, projected: projectedGrossMargin * 100 },
      netProfit: { current: currentNetProfit, projected: projectedNetProfit },
      adSpend: { current: currentAdSpend, projected: newAdSpend },
      roas: { current: m.marketing.roas.blended.current, projected: projectedROAS },
      ltvCac: { current: m.customers.ltvCacRatio.current, projected: projectedLTVCAC },
      cashPosition: { current: cf.currentCash, projected: projectedCashPosition },
      forecast,
      currentForecast,
    };
  }, [wb]);

  // --- D2C Builders Projections ---
  const d2cProjections = useMemo(() => {
    const m = d2cBuildersMetrics;
    const currentMonthlyRevenue = 180000; // target
    const currentGrossMargin = m.profitability.grossMargin.current / 100;
    const currentNetProfit = m.profitability.netProfit.current;
    const currentLaborCost = m.costs.laborCost.current;
    const currentOverhead = m.costs.overhead;

    // New client revenue
    const newClientRevenue = d2c.newClients * d2c.avgClientRevenue;

    // Labor efficiency savings
    const laborSavings = currentLaborCost * (d2c.laborEfficiency / 100);

    // Shipping margin improvement
    const shippingRevenue = m.revenue.byStream.shipping;
    const shippingMarginImpact = shippingRevenue * (d2c.shippingMarginChange / 100);

    // Warehouse expansion cost
    const expansionCost = d2c.warehouseExpansion ? 15000 : 0; // monthly lease increase

    // Projected revenue
    const projectedMonthlyRevenue = currentMonthlyRevenue + newClientRevenue;

    // Projected costs
    const newClientLaborCost = newClientRevenue * 0.35; // 35% labor cost for new clients
    const projectedLaborCost = currentLaborCost - laborSavings + newClientLaborCost;
    const projectedOverhead = currentOverhead + expansionCost;

    // Projected margin
    const projectedGrossProfit = projectedMonthlyRevenue * currentGrossMargin
      + newClientRevenue * 0.05 // slightly better margin on new clients (optimistic)
      + laborSavings
      + shippingMarginImpact
      - expansionCost * 0.3; // some expansion cost hits gross margin

    const projectedGrossMargin = projectedMonthlyRevenue > 0
      ? (projectedGrossProfit / projectedMonthlyRevenue) * 100
      : 0;

    const projectedNetProfit = projectedGrossProfit - projectedOverhead * 0.3;
    
    // Utilization
    const currentUtilization = m.warehouse.utilization.current;
    const newClientPallets = d2c.newClients * 20; // avg 20 pallets per client
    const totalPallets = m.warehouse.palletsStored + newClientPallets;
    const maxPallets = m.warehouse.palletsStored / (currentUtilization / 100);
    const expandedMaxPallets = d2c.warehouseExpansion ? maxPallets * 1.4 : maxPallets;
    const projectedUtilization = Math.min(100, (totalPallets / expandedMaxPallets) * 100);

    // Client concentration
    const topClientRevenue = 38500; // FitGear Pro
    const projectedConcentration = (topClientRevenue / projectedMonthlyRevenue) * 100;

    // Forecast
    const forecast = Array.from({ length: 12 }, (_, i) => {
      // New clients ramp up over 3 months
      const rampFactor = Math.min(1, (i + 1) / 3);
      const monthRevenue = currentMonthlyRevenue + newClientRevenue * rampFactor;
      return {
        date: `Month ${i + 1}`,
        value: Math.round(monthRevenue),
      };
    });

    return {
      revenue: { current: currentMonthlyRevenue, projected: projectedMonthlyRevenue },
      annualRevenue: { current: currentMonthlyRevenue * 12, projected: projectedMonthlyRevenue * 12 },
      grossMargin: { current: currentGrossMargin * 100, projected: projectedGrossMargin },
      netProfit: { current: currentNetProfit, projected: projectedNetProfit },
      utilization: { current: currentUtilization, projected: projectedUtilization },
      concentration: { current: m.clients.concentration, projected: projectedConcentration },
      laborCost: { current: currentLaborCost, projected: projectedLaborCost },
      forecast,
    };
  }, [d2c]);

  const hasWBChanges = JSON.stringify(wb) !== JSON.stringify(WB_DEFAULTS);
  const hasD2CChanges = JSON.stringify(d2c) !== JSON.stringify(D2C_DEFAULTS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-6 h-6 text-amber-300" />
              <h1 className="text-2xl font-bold">What-If Scenario Planner</h1>
            </div>
            <p className="text-violet-200 mt-1">
              Model business decisions before you make them. Drag the sliders to see projected impact.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setActiveTab('wellbefore')}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              activeTab === 'wellbefore'
                ? 'bg-white/20 text-white'
                : 'text-violet-200 hover:text-white hover:bg-white/10'
            )}
          >
            WellBefore ($10M DTC)
          </button>
          <button
            onClick={() => setActiveTab('d2cbuilders')}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              activeTab === 'd2cbuilders'
                ? 'bg-white/20 text-white'
                : 'text-violet-200 hover:text-white hover:bg-white/10'
            )}
          >
            D2C Builders ($2M 3PL)
          </button>
        </div>
      </div>

      {/* WellBefore Scenario */}
      {activeTab === 'wellbefore' && (
        <>
          {/* Presets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {WB_PRESETS.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.name}
                  onClick={() => setWB({ ...WB_DEFAULTS, ...preset.values })}
                  className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all text-left group"
                >
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50 transition-colors">
                    <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{preset.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{preset.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Impact Summary Bar */}
          <ImpactSummaryBar
            items={[
              {
                label: 'Monthly Revenue',
                value: formatDollars(wbProjections.revenue.projected, true),
                change: ((wbProjections.revenue.projected - wbProjections.revenue.current) / wbProjections.revenue.current) * 100,
              },
              {
                label: 'Annual Revenue',
                value: formatDollars(wbProjections.annualRevenue.projected, true),
                change: ((wbProjections.annualRevenue.projected - wbProjections.annualRevenue.current) / wbProjections.annualRevenue.current) * 100,
              },
              {
                label: 'Gross Margin',
                value: `${wbProjections.grossMargin.projected.toFixed(1)}%`,
                change: wbProjections.grossMargin.projected - wbProjections.grossMargin.current,
              },
              {
                label: 'Net Profit/mo',
                value: formatDollars(wbProjections.netProfit.projected, true),
                change: wbProjections.netProfit.current !== 0
                  ? ((wbProjections.netProfit.projected - wbProjections.netProfit.current) / Math.abs(wbProjections.netProfit.current)) * 100
                  : 0,
              },
            ]}
          />

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Sliders */}
            <div className="col-span-12 lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-blue-500" />
                    Marketing Levers
                  </h3>
                  {hasWBChanges && (
                    <button
                      onClick={resetWB}
                      className="text-xs text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <ScenarioSlider
                    label="Ad Spend Change"
                    value={wb.adSpendChange}
                    min={-50}
                    max={100}
                    step={5}
                    unit="%"
                    description={`Current: ${formatDollars(95000)}/mo → ${formatDollars(95000 * (1 + wb.adSpendChange / 100))}/mo`}
                    onChange={(v) => setWB((p) => ({ ...p, adSpendChange: v }))}
                    baselineValue={0}
                    formatValue={(v) => `${v > 0 ? '+' : ''}${v}%`}
                  />

                  <ScenarioSlider
                    label="Customer Acquisition Cost"
                    value={wb.cacChange}
                    min={10}
                    max={40}
                    step={0.5}
                    prefix="$"
                    description="Lower CAC = more efficient marketing spend"
                    onChange={(v) => setWB((p) => ({ ...p, cacChange: v }))}
                    baselineValue={WB_DEFAULTS.cacChange}
                    invertColor
                    formatValue={(v) => `$${v.toFixed(2)}`}
                  />

                  <ScenarioSlider
                    label="Email Frequency"
                    value={wb.emailFreqMultiplier}
                    min={1}
                    max={2}
                    step={0.1}
                    unit="x"
                    description="Increase Klaviyo sends (diminishing returns above 1.5x)"
                    onChange={(v) => setWB((p) => ({ ...p, emailFreqMultiplier: v }))}
                    baselineValue={1}
                    formatValue={(v) => `${v.toFixed(1)}x`}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
                  <ShoppingCart className="w-5 h-5 text-emerald-500" />
                  Revenue Levers
                </h3>

                <div className="space-y-6">
                  <ScenarioSlider
                    label="Price Adjustment"
                    value={wb.priceChange}
                    min={-20}
                    max={20}
                    step={1}
                    unit="%"
                    description="Price elasticity: ~0.8% volume loss per 1% price increase"
                    onChange={(v) => setWB((p) => ({ ...p, priceChange: v }))}
                    baselineValue={0}
                    formatValue={(v) => `${v > 0 ? '+' : ''}${v}%`}
                  />

                  <ScenarioSlider
                    label="Repeat Rate Change"
                    value={wb.repeatRateChange}
                    min={-5}
                    max={10}
                    step={0.5}
                    description={`Current: ${wellBeforeMetrics.customers.repeatRate.current}% → ${(wellBeforeMetrics.customers.repeatRate.current + wb.repeatRateChange).toFixed(1)}%`}
                    onChange={(v) => setWB((p) => ({ ...p, repeatRateChange: v }))}
                    baselineValue={0}
                    formatValue={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}pp`}
                  />
                </div>
              </div>

              {/* Advanced */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showAdvanced ? 'Hide' : 'Show'} Advanced Levers
              </button>

              {showAdvanced && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
                    <Target className="w-5 h-5 text-amber-500" />
                    Conversion & Retention
                  </h3>
                  <ScenarioSlider
                    label="Conversion Rate Change"
                    value={wb.conversionRateChange}
                    min={-1}
                    max={2}
                    step={0.1}
                    description={`Current: 2.8% → ${(2.8 + wb.conversionRateChange).toFixed(1)}%`}
                    onChange={(v) => setWB((p) => ({ ...p, conversionRateChange: v }))}
                    baselineValue={0}
                    formatValue={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}pp`}
                  />
                </div>
              )}
            </div>

            {/* Right: Impact */}
            <div className="col-span-12 lg:col-span-7 space-y-4">
              {/* Impact Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                <ImpactCard
                  title="Monthly Revenue"
                  currentValue={formatDollars(wbProjections.revenue.current, true)}
                  projectedValue={formatDollars(wbProjections.revenue.projected, true)}
                  change={((wbProjections.revenue.projected - wbProjections.revenue.current) / wbProjections.revenue.current) * 100}
                  icon={DollarSign}
                  iconColor="text-blue-600"
                  highlight
                />
                <ImpactCard
                  title="Annual Revenue"
                  currentValue={formatDollars(wbProjections.annualRevenue.current, true)}
                  projectedValue={formatDollars(wbProjections.annualRevenue.projected, true)}
                  change={((wbProjections.annualRevenue.projected - wbProjections.annualRevenue.current) / wbProjections.annualRevenue.current) * 100}
                  icon={TrendingUp}
                  iconColor="text-emerald-600"
                />
                <ImpactCard
                  title="Gross Margin"
                  currentValue={`${wbProjections.grossMargin.current.toFixed(1)}%`}
                  projectedValue={`${wbProjections.grossMargin.projected.toFixed(1)}%`}
                  change={wbProjections.grossMargin.projected - wbProjections.grossMargin.current}
                  icon={Package}
                  iconColor="text-amber-600"
                />
                <ImpactCard
                  title="Net Profit / Month"
                  currentValue={formatDollars(wbProjections.netProfit.current, true)}
                  projectedValue={formatDollars(wbProjections.netProfit.projected, true)}
                  change={wbProjections.netProfit.current !== 0
                    ? ((wbProjections.netProfit.projected - wbProjections.netProfit.current) / Math.abs(wbProjections.netProfit.current)) * 100
                    : 0}
                  icon={DollarSign}
                  iconColor="text-emerald-600"
                />
                <ImpactCard
                  title="ROAS (Blended)"
                  currentValue={`${wbProjections.roas.current.toFixed(1)}x`}
                  projectedValue={wbProjections.roas.projected === Infinity ? '∞' : `${wbProjections.roas.projected.toFixed(1)}x`}
                  change={wbProjections.roas.projected !== Infinity
                    ? ((wbProjections.roas.projected - wbProjections.roas.current) / wbProjections.roas.current) * 100
                    : 100}
                  icon={Megaphone}
                  iconColor="text-purple-600"
                  size="sm"
                />
                <ImpactCard
                  title="LTV:CAC Ratio"
                  currentValue={`${wbProjections.ltvCac.current.toFixed(1)}:1`}
                  projectedValue={wbProjections.ltvCac.projected === Infinity ? '∞' : `${wbProjections.ltvCac.projected.toFixed(1)}:1`}
                  change={wbProjections.ltvCac.projected !== Infinity
                    ? ((wbProjections.ltvCac.projected - wbProjections.ltvCac.current) / wbProjections.ltvCac.current) * 100
                    : 100}
                  icon={Users}
                  iconColor="text-blue-600"
                  size="sm"
                />
              </div>

              {/* Revenue Forecast Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">12-Month Revenue Projection</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Projected: {formatDollars(wbProjections.annualRevenue.projected, true)}/yr
                      {' '}({formatDollars(wbProjections.annualRevenue.projected - wbProjections.annualRevenue.current, true)} delta)
                    </p>
                  </div>
                </div>
                <SparklineChart
                  data={wbProjections.forecast}
                  height={140}
                  color="purple"
                  showTooltip
                />
              </div>

              {/* Key Decision Insight */}
              {hasWBChanges && (
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-800 p-5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-violet-900 dark:text-violet-200">Decision Insight</h4>
                      <p className="text-sm text-violet-700 dark:text-violet-300 mt-1">
                        {wbProjections.revenue.projected > wbProjections.revenue.current * 1.1
                          ? `This scenario projects ${formatPct(((wbProjections.revenue.projected - wbProjections.revenue.current) / wbProjections.revenue.current) * 100)} revenue growth. ${
                              wbProjections.netProfit.projected > wbProjections.netProfit.current
                                ? 'Profitability improves - strong signal to proceed.'
                                : 'But net profit decreases - growth at the cost of margins. Proceed carefully.'
                            }`
                          : wbProjections.netProfit.projected > wbProjections.netProfit.current * 1.1
                          ? `Revenue growth is modest, but profit improves by ${formatDollars(wbProjections.netProfit.projected - wbProjections.netProfit.current, true)}/mo. Efficiency play - worth pursuing.`
                          : wbProjections.revenue.projected < wbProjections.revenue.current
                          ? 'This scenario shows revenue decline. Consider if the margin improvement justifies the trade-off.'
                          : 'Minimal impact from these changes. Consider bolder moves or combining multiple levers.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* D2C Builders Scenario */}
      {activeTab === 'd2cbuilders' && (
        <>
          {/* Presets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {D2C_PRESETS.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.name}
                  onClick={() => setD2C({ ...D2C_DEFAULTS, ...preset.values })}
                  className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all text-left group"
                >
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{preset.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{preset.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Impact Summary */}
          <ImpactSummaryBar
            items={[
              {
                label: 'Monthly Revenue',
                value: formatDollars(d2cProjections.revenue.projected, true),
                change: ((d2cProjections.revenue.projected - d2cProjections.revenue.current) / d2cProjections.revenue.current) * 100,
              },
              {
                label: 'Gross Margin',
                value: `${d2cProjections.grossMargin.projected.toFixed(1)}%`,
                change: d2cProjections.grossMargin.projected - d2cProjections.grossMargin.current,
              },
              {
                label: 'Utilization',
                value: `${d2cProjections.utilization.projected.toFixed(0)}%`,
                change: d2cProjections.utilization.projected - d2cProjections.utilization.current,
              },
              {
                label: 'Concentration',
                value: `${d2cProjections.concentration.projected.toFixed(1)}%`,
                change: d2cProjections.concentration.projected - d2cProjections.concentration.current,
                invertColor: true,
              },
            ]}
          />

          <div className="grid grid-cols-12 gap-6">
            {/* Left: Sliders */}
            <div className="col-span-12 lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-500" />
                    Growth Levers
                  </h3>
                  {hasD2CChanges && (
                    <button
                      onClick={resetD2C}
                      className="text-xs text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <ScenarioSlider
                    label="New Clients"
                    value={d2c.newClients}
                    min={0}
                    max={5}
                    step={1}
                    description="New 3PL clients onboarded (3-month ramp)"
                    onChange={(v) => setD2C((p) => ({ ...p, newClients: v }))}
                    baselineValue={0}
                    formatValue={(v) => `${v} client${v !== 1 ? 's' : ''}`}
                  />

                  <ScenarioSlider
                    label="Avg Revenue / New Client"
                    value={d2c.avgClientRevenue}
                    min={5000}
                    max={35000}
                    step={1000}
                    prefix="$"
                    description="Monthly revenue per new client"
                    onChange={(v) => setD2C((p) => ({ ...p, avgClientRevenue: v }))}
                    baselineValue={15000}
                    formatValue={(v) => formatDollars(v, true)}
                  />

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Warehouse Expansion</p>
                      <p className="text-xs text-slate-500">+40% capacity, +$15K/mo lease</p>
                    </div>
                    <button
                      onClick={() => setD2C((p) => ({ ...p, warehouseExpansion: p.warehouseExpansion ? 0 : 1 }))}
                      className={clsx(
                        'relative w-12 h-7 rounded-full transition-colors',
                        d2c.warehouseExpansion ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                      )}
                    >
                      <div
                        className={clsx(
                          'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform',
                          d2c.warehouseExpansion ? 'translate-x-5' : 'translate-x-0.5'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
                  <Warehouse className="w-5 h-5 text-blue-500" />
                  Efficiency Levers
                </h3>

                <div className="space-y-6">
                  <ScenarioSlider
                    label="Labor Efficiency Improvement"
                    value={d2c.laborEfficiency}
                    min={0}
                    max={20}
                    step={1}
                    unit="%"
                    description={`Save ${formatDollars(d2cBuildersMetrics.costs.laborCost.current * d2c.laborEfficiency / 100, true)}/mo on labor`}
                    onChange={(v) => setD2C((p) => ({ ...p, laborEfficiency: v }))}
                    baselineValue={0}
                    formatValue={(v) => `+${v}%`}
                  />

                  <ScenarioSlider
                    label="Shipping Margin Recovery"
                    value={d2c.shippingMarginChange}
                    min={0}
                    max={5}
                    step={0.5}
                    description="Pass through carrier rate increases to clients"
                    onChange={(v) => setD2C((p) => ({ ...p, shippingMarginChange: v }))}
                    baselineValue={0}
                    formatValue={(v) => `+${v.toFixed(1)}pp`}
                  />
                </div>
              </div>
            </div>

            {/* Right: Impact */}
            <div className="col-span-12 lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <ImpactCard
                  title="Monthly Revenue"
                  currentValue={formatDollars(d2cProjections.revenue.current, true)}
                  projectedValue={formatDollars(d2cProjections.revenue.projected, true)}
                  change={((d2cProjections.revenue.projected - d2cProjections.revenue.current) / d2cProjections.revenue.current) * 100}
                  icon={DollarSign}
                  iconColor="text-emerald-600"
                  highlight
                />
                <ImpactCard
                  title="Gross Margin"
                  currentValue={`${d2cProjections.grossMargin.current.toFixed(1)}%`}
                  projectedValue={`${d2cProjections.grossMargin.projected.toFixed(1)}%`}
                  change={d2cProjections.grossMargin.projected - d2cProjections.grossMargin.current}
                  icon={TrendingUp}
                  iconColor="text-blue-600"
                />
                <ImpactCard
                  title="Warehouse Utilization"
                  currentValue={`${d2cProjections.utilization.current.toFixed(0)}%`}
                  projectedValue={`${d2cProjections.utilization.projected.toFixed(0)}%`}
                  change={d2cProjections.utilization.projected - d2cProjections.utilization.current}
                  icon={Warehouse}
                  iconColor="text-amber-600"
                  size="sm"
                />
                <ImpactCard
                  title="Client Concentration"
                  currentValue={`${d2cProjections.concentration.current.toFixed(1)}%`}
                  projectedValue={`${d2cProjections.concentration.projected.toFixed(1)}%`}
                  change={d2cProjections.concentration.projected - d2cProjections.concentration.current}
                  invertColor
                  icon={Users}
                  iconColor="text-purple-600"
                  size="sm"
                />
              </div>

              {/* Revenue Forecast Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">12-Month Revenue Projection</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {d2c.newClients > 0
                        ? `${d2c.newClients} new client${d2c.newClients > 1 ? 's' : ''} ramping over 3 months`
                        : 'Adjust sliders to see projection'}
                    </p>
                  </div>
                </div>
                <SparklineChart
                  data={d2cProjections.forecast}
                  height={140}
                  color="green"
                  showTooltip
                />
              </div>

              {/* Decision Insight */}
              {hasD2CChanges && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-emerald-900 dark:text-emerald-200">Decision Insight</h4>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                        {d2c.newClients > 0 && d2cProjections.utilization.projected > 90
                          ? `Adding ${d2c.newClients} clients pushes utilization to ${d2cProjections.utilization.projected.toFixed(0)}% - ${d2c.warehouseExpansion ? 'warehouse expansion handles the capacity.' : 'you need warehouse expansion or risk service degradation.'}`
                          : d2c.newClients > 0
                          ? `${d2c.newClients} new clients add ${formatDollars(d2c.newClients * d2c.avgClientRevenue, true)}/mo at full ramp. Concentration drops to ${d2cProjections.concentration.projected.toFixed(1)}% - healthier risk profile.`
                          : d2c.laborEfficiency > 5
                          ? `${d2c.laborEfficiency}% labor efficiency saves ${formatDollars(d2cBuildersMetrics.costs.laborCost.current * d2c.laborEfficiency / 100, true)}/mo - pure margin improvement without growth risk.`
                          : 'Modest adjustments. Consider combining levers for stronger impact.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
