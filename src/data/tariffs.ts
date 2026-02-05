// Tariff & COGS Scenario Planner Data Layer
// Models WellBefore's PPE product exposure to China tariff regime (2025-2026)
// Source context: MFN (0-7.5%) + Section 301 (7.5-25%) + IEEPA (30%+) = 30-60%+ effective rates

export type TariffScenario = 'current' | 'optimistic' | 'pessimistic' | 'extreme';
export type PricingStrategy = 'premium' | 'volume' | 'dead-zone';
export type SourcingOrigin = 'china' | 'vietnam' | 'india' | 'mexico' | 'domestic';

export interface TariffLayer {
  name: string;
  rate: number; // percentage
  description: string;
}

export interface ProductTariffProfile {
  id: string;
  name: string;
  htsCode: string;
  category: string;
  revenueShare: number; // % of total revenue
  monthlyUnits: number;
  exWorksPrice: number; // per unit, USD
  sourcingOrigin: SourcingOrigin;
  tariffLayers: TariffLayer[];
  freightInsuranceRate: number; // % of product cost
  currentRetailPrice: number;
  currentLandedCost: number; // calculated
  preTariffLandedCost: number;
  targetMargin: number; // target gross margin %
  pricingStrategy: PricingStrategy;
}

export interface TariffScenarioModel {
  id: TariffScenario;
  name: string;
  description: string;
  ieepaRate: number; // IEEPA tariff rate (the variable one)
  additionalDutyRate: number; // any additional 2026 hikes
  probability: number; // estimated probability %
}

export interface MarginWaterfallItem {
  label: string;
  value: number;
  type: 'revenue' | 'cost' | 'subtotal' | 'profit';
  color: string;
  perUnit?: number;
  percentOfRevenue: number;
  previousPercentOfRevenue?: number;
  description: string;
}

export interface CashConversionMetrics {
  dio: number; // Days Inventory Outstanding
  dso: number; // Days Sales Outstanding
  dpo: number; // Days Payables Outstanding
  ccc: number; // Cash Conversion Cycle = DIO + DSO - DPO
  previousCcc: number;
  targetCcc: number;
  cashRunway: number; // months
  weeklyForecast: WeeklyCashForecast[];
  inventoryValue: number;
  monthlyBurn: number;
  tariffImpactOnCcc: number; // additional days from tariff cost increase
}

export interface WeeklyCashForecast {
  week: string;
  label: string;
  inflow: number;
  outflow: number;
  balance: number;
  projected: boolean;
}

export interface SourcingConcentration {
  origin: SourcingOrigin;
  label: string;
  percentOfCogs: number;
  tariffExposure: number; // effective tariff rate on goods from this origin
  transitionCost: number; // estimated cost to shift sourcing away
  transitionTimeline: string;
  color: string;
}

// ======================================
// Product Tariff Profiles
// ======================================

function calculateLandedCost(product: {
  exWorksPrice: number;
  tariffLayers: TariffLayer[];
  freightInsuranceRate: number;
}): number {
  const totalTariffRate = product.tariffLayers.reduce((sum, l) => sum + l.rate, 0);
  const tariffCost = product.exWorksPrice * (totalTariffRate / 100);
  const freightCost = product.exWorksPrice * (product.freightInsuranceRate / 100);
  return product.exWorksPrice + tariffCost + freightCost;
}

export const productTariffProfiles: ProductTariffProfile[] = [
  {
    id: 'n95-respirators',
    name: 'N95 Respirators',
    htsCode: '6307.90 / 9020.00',
    category: 'Respiratory Protection',
    revenueShare: 28.5,
    monthlyUnits: 85000,
    exWorksPrice: 1.20,
    sourcingOrigin: 'china',
    tariffLayers: [
      { name: 'MFN Duty', rate: 4.5, description: 'Normal trade relations rate' },
      { name: 'Section 301', rate: 7.5, description: 'China-specific trade duty' },
      { name: 'IEEPA Tariff', rate: 30, description: 'International Emergency Economic Powers Act' },
    ],
    freightInsuranceRate: 5,
    currentRetailPrice: 4.99,
    currentLandedCost: 0, // calculated below
    preTariffLandedCost: 1.32,
    targetMargin: 55,
    pricingStrategy: 'premium',
  },
  {
    id: 'surgical-masks',
    name: 'Surgical Masks (3-Ply)',
    htsCode: '6307.90',
    category: 'Face Coverings',
    revenueShare: 22.3,
    monthlyUnits: 320000,
    exWorksPrice: 0.15,
    sourcingOrigin: 'china',
    tariffLayers: [
      { name: 'MFN Duty', rate: 4.5, description: 'Normal trade relations rate' },
      { name: 'Section 301', rate: 7.5, description: 'China-specific trade duty' },
      { name: 'IEEPA Tariff', rate: 30, description: 'International Emergency Economic Powers Act' },
    ],
    freightInsuranceRate: 6,
    currentRetailPrice: 0.89,
    currentLandedCost: 0,
    preTariffLandedCost: 0.17,
    targetMargin: 60,
    pricingStrategy: 'volume',
  },
  {
    id: 'nitrile-gloves',
    name: 'Nitrile Exam Gloves',
    htsCode: '4015.19',
    category: 'Hand Protection',
    revenueShare: 18.7,
    monthlyUnits: 500000,
    exWorksPrice: 0.045,
    sourcingOrigin: 'china',
    tariffLayers: [
      { name: 'MFN Duty', rate: 7.5, description: 'Higher MFN for rubber products' },
      { name: 'Section 301', rate: 25, description: 'Higher rate for medical gloves' },
      { name: 'IEEPA Tariff', rate: 30, description: 'International Emergency Economic Powers Act' },
      { name: '2026 Glove Hike', rate: 25, description: 'Directed 25% increase for medical gloves 2026' },
    ],
    freightInsuranceRate: 5,
    currentRetailPrice: 0.35,
    currentLandedCost: 0,
    preTariffLandedCost: 0.053,
    targetMargin: 45,
    pricingStrategy: 'volume',
  },
  {
    id: 'hand-sanitizer',
    name: 'Hand Sanitizer (8oz)',
    htsCode: '3808.94',
    category: 'Sanitization',
    revenueShare: 12.1,
    monthlyUnits: 45000,
    exWorksPrice: 0.85,
    sourcingOrigin: 'china',
    tariffLayers: [
      { name: 'MFN Duty', rate: 3.0, description: 'Disinfectant rate' },
      { name: 'Section 301', rate: 7.5, description: 'China-specific trade duty' },
      { name: 'IEEPA Tariff', rate: 30, description: 'International Emergency Economic Powers Act' },
    ],
    freightInsuranceRate: 7,
    currentRetailPrice: 5.49,
    currentLandedCost: 0,
    preTariffLandedCost: 0.94,
    targetMargin: 65,
    pricingStrategy: 'premium',
  },
  {
    id: 'face-shields',
    name: 'Face Shields',
    htsCode: '3926.90',
    category: 'Face Protection',
    revenueShare: 8.2,
    monthlyUnits: 22000,
    exWorksPrice: 1.50,
    sourcingOrigin: 'china',
    tariffLayers: [
      { name: 'MFN Duty', rate: 3.4, description: 'Plastics rate' },
      { name: 'Section 301', rate: 25, description: 'Higher rate for plastics/protective gear' },
      { name: 'IEEPA Tariff', rate: 30, description: 'International Emergency Economic Powers Act' },
    ],
    freightInsuranceRate: 5,
    currentRetailPrice: 7.99,
    currentLandedCost: 0,
    preTariffLandedCost: 1.63,
    targetMargin: 55,
    pricingStrategy: 'premium',
  },
  {
    id: 'thermometers',
    name: 'No-Touch Thermometers',
    htsCode: '9025.19',
    category: 'Diagnostics',
    revenueShare: 6.4,
    monthlyUnits: 8000,
    exWorksPrice: 6.50,
    sourcingOrigin: 'china',
    tariffLayers: [
      { name: 'MFN Duty', rate: 1.7, description: 'Scientific instruments rate' },
      { name: 'Section 301', rate: 7.5, description: 'China-specific trade duty' },
      { name: 'IEEPA Tariff', rate: 30, description: 'International Emergency Economic Powers Act' },
    ],
    freightInsuranceRate: 4,
    currentRetailPrice: 24.99,
    currentLandedCost: 0,
    preTariffLandedCost: 7.12,
    targetMargin: 60,
    pricingStrategy: 'premium',
  },
  {
    id: 'disinfecting-wipes',
    name: 'Disinfecting Wipes (80ct)',
    htsCode: '3401.19',
    category: 'Sanitization',
    revenueShare: 3.8,
    monthlyUnits: 18000,
    exWorksPrice: 1.10,
    sourcingOrigin: 'vietnam',
    tariffLayers: [
      { name: 'MFN Duty', rate: 3.5, description: 'Soap/wipe products rate' },
      // No Section 301 or IEEPA - sourced from Vietnam
    ],
    freightInsuranceRate: 6,
    currentRetailPrice: 4.49,
    currentLandedCost: 0,
    preTariffLandedCost: 1.17,
    targetMargin: 55,
    pricingStrategy: 'premium',
  },
];

// Calculate landed costs
productTariffProfiles.forEach((p) => {
  p.currentLandedCost = calculateLandedCost(p);
});

// ======================================
// Tariff Scenarios
// ======================================

export const tariffScenarios: TariffScenarioModel[] = [
  {
    id: 'optimistic',
    name: 'Tariff Reduction',
    description: 'Trade deal reduces IEEPA to 10%, Section 301 stays',
    ieepaRate: 10,
    additionalDutyRate: 0,
    probability: 15,
  },
  {
    id: 'current',
    name: 'Status Quo',
    description: 'Current tariff rates maintained through 2026',
    ieepaRate: 30,
    additionalDutyRate: 0,
    probability: 45,
  },
  {
    id: 'pessimistic',
    name: 'Escalation',
    description: 'IEEPA increases to 45%, new product-specific duties',
    ieepaRate: 45,
    additionalDutyRate: 10,
    probability: 30,
  },
  {
    id: 'extreme',
    name: 'Full Decoupling',
    description: 'IEEPA hits 60%, all PPE categories get additional duties',
    ieepaRate: 60,
    additionalDutyRate: 20,
    probability: 10,
  },
];

// ======================================
// Calculate scenario impact per product
// ======================================

export interface ScenarioImpact {
  scenario: TariffScenarioModel;
  products: {
    product: ProductTariffProfile;
    adjustedLandedCost: number;
    adjustedMargin: number;
    currentMargin: number;
    marginDelta: number;
    priceToMaintainMargin: number;
    priceIncreaseNeeded: number; // %
    monthlyMarginImpact: number; // $ impact per month
  }[];
  totalMonthlyImpact: number;
  avgMarginDelta: number;
  avgPriceIncrease: number;
  portfolioMargin: number;
}

export function calculateScenarioImpact(scenario: TariffScenarioModel): ScenarioImpact {
  const products = productTariffProfiles.map((product) => {
    // Recalculate tariff layers with scenario rates
    const adjustedLayers = product.tariffLayers.map((layer) => {
      if (layer.name === 'IEEPA Tariff') {
        return { ...layer, rate: scenario.ieepaRate };
      }
      return layer;
    });

    // Add additional duty if scenario calls for it
    if (scenario.additionalDutyRate > 0 && product.sourcingOrigin === 'china') {
      adjustedLayers.push({
        name: 'Additional 2026 Duty',
        rate: scenario.additionalDutyRate,
        description: 'Scenario-projected additional duty',
      });
    }

    const totalTariffRate = adjustedLayers.reduce((sum, l) => sum + l.rate, 0);
    const adjustedLandedCost =
      product.exWorksPrice * (1 + totalTariffRate / 100 + product.freightInsuranceRate / 100);

    const currentMargin =
      ((product.currentRetailPrice - product.currentLandedCost) / product.currentRetailPrice) * 100;
    const adjustedMargin =
      ((product.currentRetailPrice - adjustedLandedCost) / product.currentRetailPrice) * 100;
    const marginDelta = adjustedMargin - currentMargin;

    // Price needed to maintain target margin
    const priceToMaintainMargin = adjustedLandedCost / (1 - product.targetMargin / 100);
    const priceIncreaseNeeded =
      ((priceToMaintainMargin - product.currentRetailPrice) / product.currentRetailPrice) * 100;

    const monthlyMarginImpact =
      (adjustedLandedCost - product.currentLandedCost) * product.monthlyUnits;

    return {
      product,
      adjustedLandedCost,
      adjustedMargin,
      currentMargin,
      marginDelta,
      priceToMaintainMargin,
      priceIncreaseNeeded: Math.max(0, priceIncreaseNeeded),
      monthlyMarginImpact,
    };
  });

  const totalMonthlyImpact = products.reduce((sum, p) => sum + p.monthlyMarginImpact, 0);

  // Weighted average margin delta by revenue share
  const avgMarginDelta =
    products.reduce((sum, p) => sum + p.marginDelta * p.product.revenueShare, 0) /
    products.reduce((sum, p) => sum + p.product.revenueShare, 0);

  // Weighted average price increase needed
  const avgPriceIncrease =
    products.reduce((sum, p) => sum + p.priceIncreaseNeeded * p.product.revenueShare, 0) /
    products.reduce((sum, p) => sum + p.product.revenueShare, 0);

  // Portfolio weighted margin under scenario
  const portfolioMargin =
    products.reduce((sum, p) => sum + p.adjustedMargin * p.product.revenueShare, 0) /
    products.reduce((sum, p) => sum + p.product.revenueShare, 0);

  return {
    scenario,
    products,
    totalMonthlyImpact,
    avgMarginDelta,
    avgPriceIncrease,
    portfolioMargin,
  };
}

// Pre-calculate all scenarios
export const scenarioImpacts: ScenarioImpact[] = tariffScenarios.map(calculateScenarioImpact);

// ======================================
// Sourcing Concentration
// ======================================

export const sourcingConcentration: SourcingConcentration[] = [
  {
    origin: 'china',
    label: 'China',
    percentOfCogs: 82.4,
    tariffExposure: 42,
    transitionCost: 350000,
    transitionTimeline: '8-14 months',
    color: '#ef4444',
  },
  {
    origin: 'vietnam',
    label: 'Vietnam',
    percentOfCogs: 9.8,
    tariffExposure: 3.5,
    transitionCost: 0,
    transitionTimeline: 'Existing supplier',
    color: '#22c55e',
  },
  {
    origin: 'india',
    label: 'India',
    percentOfCogs: 4.2,
    tariffExposure: 5.0,
    transitionCost: 120000,
    transitionTimeline: '6-10 months',
    color: '#f59e0b',
  },
  {
    origin: 'domestic',
    label: 'US Domestic',
    percentOfCogs: 3.6,
    tariffExposure: 0,
    transitionCost: 0,
    transitionTimeline: 'Existing supplier',
    color: '#3b82f6',
  },
];

// ======================================
// Margin Waterfall (Per-unit for N95 as example, also portfolio-level)
// ======================================

export const portfolioMarginWaterfall: MarginWaterfallItem[] = [
  {
    label: 'Revenue',
    value: 847000,
    type: 'revenue',
    color: '#3b82f6',
    percentOfRevenue: 100,
    description: 'Monthly revenue from all channels',
  },
  {
    label: 'Product Cost (Ex-Works)',
    value: -295000,
    type: 'cost',
    color: '#94a3b8',
    percentOfRevenue: 34.8,
    previousPercentOfRevenue: 34.8,
    description: 'Raw product cost from manufacturers',
  },
  {
    label: 'Tariffs & Duties',
    value: -124000,
    type: 'cost',
    color: '#ef4444',
    percentOfRevenue: 14.6,
    previousPercentOfRevenue: 5.2,
    description: 'MFN + Section 301 + IEEPA tariffs (was 5.2% pre-tariff)',
  },
  {
    label: 'Freight & Insurance',
    value: -25400,
    type: 'cost',
    color: '#f59e0b',
    percentOfRevenue: 3.0,
    previousPercentOfRevenue: 2.1,
    description: 'Inbound shipping, insurance, customs clearance',
  },
  {
    label: 'Landed COGS',
    value: -444400,
    type: 'subtotal',
    color: '#dc2626',
    percentOfRevenue: 52.5,
    previousPercentOfRevenue: 42.1,
    description: 'Total cost of goods delivered to warehouse',
  },
  {
    label: 'Fulfillment',
    value: -60300,
    type: 'cost',
    color: '#8b5cf6',
    percentOfRevenue: 7.1,
    previousPercentOfRevenue: 7.1,
    description: 'Pick, pack, ship, warehouse costs',
  },
  {
    label: 'Payment Processing',
    value: -25400,
    type: 'cost',
    color: '#6366f1',
    percentOfRevenue: 3.0,
    previousPercentOfRevenue: 3.0,
    description: 'Stripe/Shopify Payments fees (~3%)',
  },
  {
    label: 'Marketing / CAC',
    value: -81200,
    type: 'cost',
    color: '#ec4899',
    percentOfRevenue: 9.6,
    previousPercentOfRevenue: 8.5,
    description: 'Paid ads, affiliate, influencer spend',
  },
  {
    label: 'Contribution Profit',
    value: 235700,
    type: 'profit',
    color: '#10b981',
    percentOfRevenue: 27.8,
    previousPercentOfRevenue: 39.3,
    description: 'Revenue minus all variable costs',
  },
];

// ======================================
// Cash Conversion Cycle
// ======================================

export const cashConversionMetrics: CashConversionMetrics = {
  dio: 52, // 52 days of inventory
  dso: 2, // DTC = near-instant payment
  dpo: 38, // 38 days to pay suppliers
  ccc: 16, // 52 + 2 - 38 = 16 days
  previousCcc: 12,
  targetCcc: 20, // healthy for PPE/health products
  cashRunway: 8.2,
  tariffImpactOnCcc: 4, // tariffs added ~4 days to CCC (higher per-unit cost = more cash in inventory)
  inventoryValue: 1420000,
  monthlyBurn: 173000,
  weeklyForecast: [
    { week: 'W1', label: 'Jan 27', inflow: 198000, outflow: 172000, balance: 1845000, projected: false },
    { week: 'W2', label: 'Feb 3', inflow: 205000, outflow: 189000, balance: 1861000, projected: false },
    { week: 'W3', label: 'Feb 10', inflow: 195000, outflow: 215000, balance: 1841000, projected: true },
    { week: 'W4', label: 'Feb 17', inflow: 210000, outflow: 178000, balance: 1873000, projected: true },
    { week: 'W5', label: 'Feb 24', inflow: 202000, outflow: 195000, balance: 1880000, projected: true },
    { week: 'W6', label: 'Mar 3', inflow: 208000, outflow: 202000, balance: 1886000, projected: true },
    { week: 'W7', label: 'Mar 10', inflow: 215000, outflow: 198000, balance: 1903000, projected: true },
    { week: 'W8', label: 'Mar 17', inflow: 212000, outflow: 205000, balance: 1910000, projected: true },
    { week: 'W9', label: 'Mar 24', inflow: 220000, outflow: 210000, balance: 1920000, projected: true },
    { week: 'W10', label: 'Mar 31', inflow: 218000, outflow: 215000, balance: 1923000, projected: true },
    { week: 'W11', label: 'Apr 7', inflow: 225000, outflow: 208000, balance: 1940000, projected: true },
    { week: 'W12', label: 'Apr 14', inflow: 222000, outflow: 212000, balance: 1950000, projected: true },
    { week: 'W13', label: 'Apr 21', inflow: 230000, outflow: 220000, balance: 1960000, projected: true },
  ],
};

// ======================================
// Tariff Quick Stats (for Morning Brief header)
// ======================================

export interface TariffQuickStatsData {
  avgEffectiveTariffRate: number; // weighted average across all products
  marginErosion: number; // pp lost vs pre-tariff
  monthlyTariffCost: number; // total tariff $ per month
  sourcingRisk: 'low' | 'medium' | 'high' | 'critical'; // China concentration level
  mostVulnerableProduct: string;
  mostVulnerableMarginDelta: number;
}

export const tariffQuickStats: TariffQuickStatsData = (() => {
  // Weighted average effective tariff rate (weighted by revenue share)
  const avgRate =
    productTariffProfiles.reduce((sum, p) => {
      const totalRate = p.tariffLayers.reduce((s, l) => s + l.rate, 0);
      return sum + totalRate * p.revenueShare;
    }, 0) /
    productTariffProfiles.reduce((sum, p) => sum + p.revenueShare, 0);

  // Find most vulnerable product (highest margin erosion)
  const chinaProducts = productTariffProfiles.filter((p) => p.sourcingOrigin === 'china');
  const vulnerable = chinaProducts.reduce((worst, p) => {
    const currentMargin = ((p.currentRetailPrice - p.currentLandedCost) / p.currentRetailPrice) * 100;
    const preTariffMargin = ((p.currentRetailPrice - p.preTariffLandedCost) / p.currentRetailPrice) * 100;
    const delta = currentMargin - preTariffMargin;
    const worstCurrentMargin = ((worst.currentRetailPrice - worst.currentLandedCost) / worst.currentRetailPrice) * 100;
    const worstPreMargin = ((worst.currentRetailPrice - worst.preTariffLandedCost) / worst.currentRetailPrice) * 100;
    const worstDelta = worstCurrentMargin - worstPreMargin;
    return delta < worstDelta ? p : worst;
  }, chinaProducts[0]);

  const vulnCurrentMargin = ((vulnerable.currentRetailPrice - vulnerable.currentLandedCost) / vulnerable.currentRetailPrice) * 100;
  const vulnPreMargin = ((vulnerable.currentRetailPrice - vulnerable.preTariffLandedCost) / vulnerable.currentRetailPrice) * 100;

  // Monthly tariff cost
  const monthlyTariffCost = productTariffProfiles.reduce((sum, p) => {
    const tariffPerUnit = p.tariffLayers.reduce((s, l) => s + p.exWorksPrice * (l.rate / 100), 0);
    return sum + tariffPerUnit * p.monthlyUnits;
  }, 0);

  // Average margin erosion vs pre-tariff
  const marginErosion =
    productTariffProfiles.reduce((sum, p) => {
      const currentMargin = ((p.currentRetailPrice - p.currentLandedCost) / p.currentRetailPrice) * 100;
      const preTariffMargin = ((p.currentRetailPrice - p.preTariffLandedCost) / p.currentRetailPrice) * 100;
      return sum + (preTariffMargin - currentMargin) * p.revenueShare;
    }, 0) /
    productTariffProfiles.reduce((sum, p) => sum + p.revenueShare, 0);

  const chinaPercent = sourcingConcentration.find((s) => s.origin === 'china')?.percentOfCogs || 0;
  const risk: TariffQuickStatsData['sourcingRisk'] =
    chinaPercent > 75 ? 'critical' : chinaPercent > 50 ? 'high' : chinaPercent > 25 ? 'medium' : 'low';

  return {
    avgEffectiveTariffRate: Math.round(avgRate * 10) / 10,
    marginErosion: Math.round(marginErosion * 10) / 10,
    monthlyTariffCost: Math.round(monthlyTariffCost),
    sourcingRisk: risk,
    mostVulnerableProduct: vulnerable.name,
    mostVulnerableMarginDelta: Math.round((vulnCurrentMargin - vulnPreMargin) * 10) / 10,
  };
})();

// ======================================
// Tariff Decision for Decision Hub
// ======================================

export const tariffDecision = {
  id: 'wb-tariff-1',
  question: 'Should you begin sourcing diversification away from China for top 3 SKUs?',
  context: `82.4% of COGS sourced from China, facing 30-60%+ effective tariff rates. Tariffs cost $${Math.round(tariffQuickStats.monthlyTariffCost / 1000)}K/month and erode ${tariffQuickStats.marginErosion}pp of gross margin. Nitrile gloves face 87.5% combined duties - the highest in the portfolio.`,
  category: 'risk' as const,
  urgency: 'this-week' as const,
  confidence: 72,
  impact: {
    upside: 'Reduce tariff exposure by 40-60%, protect margins against further escalation, $180K+ annual savings at current rates',
    downside: '$350K transition cost, 8-14 month timeline, potential quality/supply disruption during transition',
  },
  recommendation: 'Start with nitrile gloves (highest tariff rate at 87.5%). Vietnam and India have established glove manufacturing. Run a dual-source pilot - 30% volume to new supplier while maintaining China backup.',
  recommendedAction: 'Initiate dual-source pilot for nitrile gloves',
  supportingMetrics: [
    { label: 'China COGS %', value: '82.4%', trend: 'up' as const, good: false },
    { label: 'Monthly Tariff Cost', value: `$${Math.round(tariffQuickStats.monthlyTariffCost / 1000)}K`, trend: 'up' as const, good: false },
    { label: 'Glove Tariff Rate', value: '87.5%', trend: 'up' as const, good: false },
    { label: 'Vietnam Alt. Rate', value: '3.5%', trend: 'flat' as const, good: true },
  ],
  options: [
    { label: 'Full dual-sourcing for top 3 SKUs', impact: '60% tariff reduction in 12 months', risk: 'medium' as const },
    { label: 'Pilot one SKU (gloves) first', impact: '20% tariff reduction in 8 months', risk: 'low' as const },
    { label: 'Hold and absorb - wait for trade deal', impact: 'No transition cost, full tariff exposure', risk: 'high' as const },
  ],
  owner: 'Procurement / Supply Chain',
};
