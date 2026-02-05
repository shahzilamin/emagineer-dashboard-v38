// Product & Inventory Intelligence Data Layer
// Nova Brief 4 (03:00): SKU-level contribution margin by channel, inventory velocity, ABC classification

export interface SKUChannelEconomics {
  revenue: number;
  cogs: number;
  platformFees: number;
  fulfillment: number;
  paymentProcessing: number;
  returnsAllocation: number;
  adSpendAllocation: number;
  storageInventory: number;
  contributionMargin: number;
  contributionMarginPercent: number;
  returnRate: number;
}

export interface ProductSKU {
  id: string;
  name: string;
  shortName: string;
  category: 'masks' | 'gloves' | 'sanitizer' | 'wipes' | 'thermometer' | 'ppe-kit' | 'test-kit';
  sku: string;
  unitPrice: number;
  unitCogs: number;
  grossMarginPercent: number;
  channels: {
    shopify: SKUChannelEconomics;
    amazon: SKUChannelEconomics;
    walmart: SKUChannelEconomics;
  };
  bestChannel: 'shopify' | 'amazon' | 'walmart';
  worstChannel: 'shopify' | 'amazon' | 'walmart';
  channelArbitrageOpportunity: number; // $/month by shifting volume
  // Inventory
  totalUnits: number;
  monthlyVelocity: number; // units/month
  daysOfInventory: number;
  velocityCategory: 'fast' | 'medium' | 'slow' | 'dead';
  inventoryValue: number;
  // ABC Classification (by contribution margin)
  abcClass: 'A' | 'B' | 'C';
  profitContributionPercent: number; // % of total portfolio profit
  revenueContributionPercent: number; // % of total portfolio revenue
  // PPE-specific
  expirationDate: string | null;
  daysToExpiration: number | null;
  expirationRisk: 'safe' | 'watch' | 'urgent' | 'critical' | null;
  // Reorder recommendation
  reorderRecommendation: 'restock' | 'hold' | 'liquidate' | 'monitor' | 'discontinue';
  reorderReason: string;
  // Subscription component
  subscriptionPercent: number; // % of sales that are subscription
  // Trends
  velocityTrend: 'accelerating' | 'steady' | 'decelerating';
  marginTrend: 'improving' | 'stable' | 'eroding';
}

export interface ProductHealthIndicators {
  inventoryTurns: { value: number; status: 'green' | 'yellow' | 'red'; label: string };
  avgContributionMargin: { value: number; status: 'green' | 'yellow' | 'red'; label: string };
  skuConcentration: { value: number; status: 'green' | 'yellow' | 'red'; label: string };
  deadStockPercent: { value: number; status: 'green' | 'yellow' | 'red'; label: string };
  avgReturnRate: { value: number; status: 'green' | 'yellow' | 'red'; label: string };
  expirationRisk90d: { value: number; status: 'green' | 'yellow' | 'red'; label: string };
}

export interface InventoryVelocitySummary {
  fast: { count: number; value: number; percent: number };
  medium: { count: number; value: number; percent: number };
  slow: { count: number; value: number; percent: number };
  dead: { count: number; value: number; percent: number };
  totalValue: number;
  cashTrappedInSlowDead: number;
}

// ─── Product Data ──────────────────────────────────────────────────

function computeChannelEcon(
  units: number, price: number, cogs: number,
  platformFeeRate: number, fulfillmentPerUnit: number, paymentRate: number,
  returnRate: number, adCostPerUnit: number, storagePerUnit: number
): SKUChannelEconomics {
  const revenue = units * price;
  const cogsTotal = units * cogs;
  const platformFees = revenue * platformFeeRate;
  const fulfillment = units * fulfillmentPerUnit;
  const paymentProcessing = revenue * paymentRate;
  const returnsAllocation = revenue * returnRate * 0.5; // return cost = 50% of revenue on returned items
  const adSpendAllocation = units * adCostPerUnit;
  const storageInventory = units * storagePerUnit;
  const cm = revenue - cogsTotal - platformFees - fulfillment - paymentProcessing - returnsAllocation - adSpendAllocation - storageInventory;
  return {
    revenue: Math.round(revenue),
    cogs: Math.round(cogsTotal),
    platformFees: Math.round(platformFees),
    fulfillment: Math.round(fulfillment),
    paymentProcessing: Math.round(paymentProcessing),
    returnsAllocation: Math.round(returnsAllocation),
    adSpendAllocation: Math.round(adSpendAllocation),
    storageInventory: Math.round(storageInventory),
    contributionMargin: Math.round(cm),
    contributionMarginPercent: Math.round((cm / revenue) * 1000) / 10,
    returnRate,
  };
}

const today = new Date();
const daysFrom = (d: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split('T')[0];
};

export const productSKUs: ProductSKU[] = [
  {
    id: 'sku-001',
    name: 'KN95 Respirator Mask (50-Pack)',
    shortName: 'KN95 50-Pack',
    category: 'masks',
    sku: 'WB-KN95-50',
    unitPrice: 24.99,
    unitCogs: 8.20,
    grossMarginPercent: 67.2,
    channels: {
      shopify: computeChannelEcon(2800, 24.99, 8.20, 0.08, 3.20, 0.03, 0.08, 1.80, 0.25),
      amazon: computeChannelEcon(4200, 24.99, 8.20, 0.15, 5.10, 0.00, 0.12, 3.40, 0.75),
      walmart: computeChannelEcon(1400, 24.99, 8.20, 0.12, 3.60, 0.00, 0.09, 2.20, 0.35),
    },
    bestChannel: 'shopify',
    worstChannel: 'amazon',
    channelArbitrageOpportunity: 4200,
    totalUnits: 18500,
    monthlyVelocity: 8400,
    daysOfInventory: 66,
    velocityCategory: 'medium',
    inventoryValue: 151700,
    abcClass: 'A',
    profitContributionPercent: 28.4,
    revenueContributionPercent: 24.1,
    expirationDate: daysFrom(420),
    daysToExpiration: 420,
    expirationRisk: 'safe',
    reorderRecommendation: 'restock',
    reorderReason: 'Top contributor, healthy velocity. Shift volume to Shopify DTC for +$4.2K/mo margin gain.',
    subscriptionPercent: 34,
    velocityTrend: 'steady',
    marginTrend: 'eroding',
  },
  {
    id: 'sku-002',
    name: 'Nitrile Exam Gloves (100ct)',
    shortName: 'Nitrile Gloves 100ct',
    category: 'gloves',
    sku: 'WB-NIT-100',
    unitPrice: 14.99,
    unitCogs: 6.80,
    grossMarginPercent: 54.6,
    channels: {
      shopify: computeChannelEcon(1600, 14.99, 6.80, 0.08, 2.80, 0.03, 0.06, 1.20, 0.20),
      amazon: computeChannelEcon(5800, 14.99, 6.80, 0.15, 4.60, 0.00, 0.10, 3.80, 0.80),
      walmart: computeChannelEcon(2200, 14.99, 6.80, 0.12, 3.20, 0.00, 0.07, 2.00, 0.30),
    },
    bestChannel: 'shopify',
    worstChannel: 'amazon',
    channelArbitrageOpportunity: 6800,
    totalUnits: 32000,
    monthlyVelocity: 9600,
    daysOfInventory: 100,
    velocityCategory: 'slow',
    inventoryValue: 217600,
    abcClass: 'A',
    profitContributionPercent: 19.2,
    revenueContributionPercent: 17.4,
    expirationDate: daysFrom(280),
    daysToExpiration: 280,
    expirationRisk: 'safe',
    reorderRecommendation: 'hold',
    reorderReason: '100 DOH with 87.5% tariff. High inventory, slow turn. Focus on liquidating Amazon FBA stock before aged fees escalate.',
    subscriptionPercent: 22,
    velocityTrend: 'decelerating',
    marginTrend: 'eroding',
  },
  {
    id: 'sku-003',
    name: 'Surgical Mask (50-Pack)',
    shortName: 'Surgical Mask 50pk',
    category: 'masks',
    sku: 'WB-SURG-50',
    unitPrice: 12.99,
    unitCogs: 3.40,
    grossMarginPercent: 73.8,
    channels: {
      shopify: computeChannelEcon(3200, 12.99, 3.40, 0.08, 2.40, 0.03, 0.05, 0.90, 0.15),
      amazon: computeChannelEcon(6400, 12.99, 3.40, 0.15, 4.20, 0.00, 0.08, 2.80, 0.60),
      walmart: computeChannelEcon(2800, 12.99, 3.40, 0.12, 2.80, 0.00, 0.06, 1.60, 0.25),
    },
    bestChannel: 'shopify',
    worstChannel: 'amazon',
    channelArbitrageOpportunity: 8900,
    totalUnits: 45000,
    monthlyVelocity: 12400,
    daysOfInventory: 109,
    velocityCategory: 'slow',
    inventoryValue: 153000,
    abcClass: 'A',
    profitContributionPercent: 22.8,
    revenueContributionPercent: 19.3,
    expirationDate: daysFrom(180),
    daysToExpiration: 180,
    expirationRisk: 'watch',
    reorderRecommendation: 'monitor',
    reorderReason: '109 DOH but high velocity channel mismatch. 50% of volume on Amazon at thin margins. Push DTC promotion to reduce inventory faster.',
    subscriptionPercent: 41,
    velocityTrend: 'steady',
    marginTrend: 'stable',
  },
  {
    id: 'sku-004',
    name: 'Hand Sanitizer Gel 16oz',
    shortName: 'Sanitizer 16oz',
    category: 'sanitizer',
    sku: 'WB-SAN-16',
    unitPrice: 8.99,
    unitCogs: 2.10,
    grossMarginPercent: 76.6,
    channels: {
      shopify: computeChannelEcon(1800, 8.99, 2.10, 0.08, 2.20, 0.03, 0.04, 0.70, 0.12),
      amazon: computeChannelEcon(3600, 8.99, 2.10, 0.15, 3.80, 0.00, 0.07, 2.40, 0.55),
      walmart: computeChannelEcon(1200, 8.99, 2.10, 0.12, 2.60, 0.00, 0.05, 1.40, 0.22),
    },
    bestChannel: 'shopify',
    worstChannel: 'amazon',
    channelArbitrageOpportunity: 3100,
    totalUnits: 22000,
    monthlyVelocity: 6600,
    daysOfInventory: 100,
    velocityCategory: 'slow',
    inventoryValue: 46200,
    abcClass: 'B',
    profitContributionPercent: 11.3,
    revenueContributionPercent: 7.1,
    expirationDate: daysFrom(90),
    daysToExpiration: 90,
    expirationRisk: 'urgent',
    reorderRecommendation: 'liquidate',
    reorderReason: '90 days to expiration, 100 DOH. Will not sell through before expiry at current velocity. Flash sale or donate for tax write-off.',
    subscriptionPercent: 28,
    velocityTrend: 'decelerating',
    marginTrend: 'eroding',
  },
  {
    id: 'sku-005',
    name: 'Disinfecting Wipes (80ct)',
    shortName: 'Wipes 80ct',
    category: 'wipes',
    sku: 'WB-WIP-80',
    unitPrice: 6.99,
    unitCogs: 1.80,
    grossMarginPercent: 74.2,
    channels: {
      shopify: computeChannelEcon(900, 6.99, 1.80, 0.08, 1.80, 0.03, 0.03, 0.50, 0.10),
      amazon: computeChannelEcon(2400, 6.99, 1.80, 0.15, 3.40, 0.00, 0.06, 2.10, 0.50),
      walmart: computeChannelEcon(600, 6.99, 1.80, 0.12, 2.20, 0.00, 0.04, 1.20, 0.18),
    },
    bestChannel: 'shopify',
    worstChannel: 'amazon',
    channelArbitrageOpportunity: 1800,
    totalUnits: 15000,
    monthlyVelocity: 3900,
    daysOfInventory: 115,
    velocityCategory: 'slow',
    inventoryValue: 27000,
    abcClass: 'C',
    profitContributionPercent: 4.8,
    revenueContributionPercent: 3.3,
    expirationDate: daysFrom(60),
    daysToExpiration: 60,
    expirationRisk: 'critical',
    reorderRecommendation: 'discontinue',
    reorderReason: '60 days to expiration, negative CM on Amazon, low margin everywhere. Liquidate remaining and discontinue SKU.',
    subscriptionPercent: 8,
    velocityTrend: 'decelerating',
    marginTrend: 'eroding',
  },
  {
    id: 'sku-006',
    name: 'N95 NIOSH-Approved Respirator (20pk)',
    shortName: 'N95 NIOSH 20pk',
    category: 'masks',
    sku: 'WB-N95-20',
    unitPrice: 39.99,
    unitCogs: 14.50,
    grossMarginPercent: 63.7,
    channels: {
      shopify: computeChannelEcon(1200, 39.99, 14.50, 0.08, 3.80, 0.03, 0.10, 2.40, 0.30),
      amazon: computeChannelEcon(2800, 39.99, 14.50, 0.15, 5.80, 0.00, 0.14, 4.20, 0.90),
      walmart: computeChannelEcon(800, 39.99, 14.50, 0.12, 4.20, 0.00, 0.11, 2.80, 0.40),
    },
    bestChannel: 'shopify',
    worstChannel: 'amazon',
    channelArbitrageOpportunity: 5600,
    totalUnits: 8500,
    monthlyVelocity: 4800,
    daysOfInventory: 53,
    velocityCategory: 'medium',
    inventoryValue: 123250,
    abcClass: 'A',
    profitContributionPercent: 15.6,
    revenueContributionPercent: 23.0,
    expirationDate: daysFrom(540),
    daysToExpiration: 540,
    expirationRisk: 'safe',
    reorderRecommendation: 'restock',
    reorderReason: 'Premium product, strong margins on Shopify (22.6% CM). 53 DOH is healthy. Increase DTC marketing spend.',
    subscriptionPercent: 18,
    velocityTrend: 'accelerating',
    marginTrend: 'stable',
  },
  {
    id: 'sku-007',
    name: 'Infrared Thermometer',
    shortName: 'IR Thermometer',
    category: 'thermometer',
    sku: 'WB-THERM-IR',
    unitPrice: 19.99,
    unitCogs: 7.20,
    grossMarginPercent: 64.0,
    channels: {
      shopify: computeChannelEcon(400, 19.99, 7.20, 0.08, 3.00, 0.03, 0.15, 1.60, 0.20),
      amazon: computeChannelEcon(1200, 19.99, 7.20, 0.15, 4.80, 0.00, 0.22, 3.60, 0.70),
      walmart: computeChannelEcon(300, 19.99, 7.20, 0.12, 3.40, 0.00, 0.18, 2.40, 0.30),
    },
    bestChannel: 'shopify',
    worstChannel: 'amazon',
    channelArbitrageOpportunity: 1900,
    totalUnits: 4800,
    monthlyVelocity: 1900,
    daysOfInventory: 76,
    velocityCategory: 'medium',
    inventoryValue: 34560,
    abcClass: 'B',
    profitContributionPercent: 5.4,
    revenueContributionPercent: 4.6,
    expirationDate: null,
    daysToExpiration: null,
    expirationRisk: null,
    reorderRecommendation: 'hold',
    reorderReason: 'Moderate velocity, decent margins. High return rate (22% on Amazon) is killing CM. Investigate return reasons.',
    subscriptionPercent: 0,
    velocityTrend: 'steady',
    marginTrend: 'stable',
  },
  {
    id: 'sku-008',
    name: 'PPE Bundle Kit (Mask + Gloves + Sanitizer)',
    shortName: 'PPE Bundle Kit',
    category: 'ppe-kit',
    sku: 'WB-KIT-PPE',
    unitPrice: 34.99,
    unitCogs: 11.80,
    grossMarginPercent: 66.3,
    channels: {
      shopify: computeChannelEcon(1400, 34.99, 11.80, 0.08, 4.20, 0.03, 0.06, 2.00, 0.28),
      amazon: computeChannelEcon(800, 34.99, 11.80, 0.15, 6.40, 0.00, 0.09, 3.80, 0.85),
      walmart: computeChannelEcon(400, 34.99, 11.80, 0.12, 4.80, 0.00, 0.07, 2.60, 0.38),
    },
    bestChannel: 'shopify',
    worstChannel: 'amazon',
    channelArbitrageOpportunity: 2400,
    totalUnits: 5200,
    monthlyVelocity: 2600,
    daysOfInventory: 60,
    velocityCategory: 'medium',
    inventoryValue: 61360,
    abcClass: 'B',
    profitContributionPercent: 8.2,
    revenueContributionPercent: 10.9,
    expirationDate: daysFrom(350),
    daysToExpiration: 350,
    expirationRisk: 'safe',
    reorderRecommendation: 'restock',
    reorderReason: 'Bundle = higher AOV + lower return rate. Strong DTC margins. Push subscription bundles for recurring revenue.',
    subscriptionPercent: 52,
    velocityTrend: 'accelerating',
    marginTrend: 'improving',
  },
  {
    id: 'sku-009',
    name: 'COVID-19 Rapid Test Kit (2-Pack)',
    shortName: 'Rapid Test 2pk',
    category: 'test-kit',
    sku: 'WB-TEST-2',
    unitPrice: 15.99,
    unitCogs: 5.60,
    grossMarginPercent: 65.0,
    channels: {
      shopify: computeChannelEcon(600, 15.99, 5.60, 0.08, 2.60, 0.03, 0.04, 1.00, 0.15),
      amazon: computeChannelEcon(1800, 15.99, 5.60, 0.15, 4.40, 0.00, 0.06, 3.20, 0.65),
      walmart: computeChannelEcon(400, 15.99, 5.60, 0.12, 3.00, 0.00, 0.05, 1.80, 0.25),
    },
    bestChannel: 'shopify',
    worstChannel: 'amazon',
    channelArbitrageOpportunity: 2100,
    totalUnits: 12000,
    monthlyVelocity: 2800,
    daysOfInventory: 129,
    velocityCategory: 'dead',
    inventoryValue: 67200,
    abcClass: 'C',
    profitContributionPercent: 3.1,
    revenueContributionPercent: 5.4,
    expirationDate: daysFrom(45),
    daysToExpiration: 45,
    expirationRisk: 'critical',
    reorderRecommendation: 'liquidate',
    reorderReason: '45 days to expiration, 129 DOH. Dead stock. Write off or donate immediately. Do NOT reorder.',
    subscriptionPercent: 0,
    velocityTrend: 'decelerating',
    marginTrend: 'eroding',
  },
  {
    id: 'sku-010',
    name: 'Latex-Free Vinyl Gloves (100ct)',
    shortName: 'Vinyl Gloves 100ct',
    category: 'gloves',
    sku: 'WB-VIN-100',
    unitPrice: 9.99,
    unitCogs: 3.20,
    grossMarginPercent: 68.0,
    channels: {
      shopify: computeChannelEcon(500, 9.99, 3.20, 0.08, 2.00, 0.03, 0.05, 0.80, 0.12),
      amazon: computeChannelEcon(1400, 9.99, 3.20, 0.15, 3.60, 0.00, 0.08, 2.60, 0.55),
      walmart: computeChannelEcon(300, 9.99, 3.20, 0.12, 2.40, 0.00, 0.06, 1.40, 0.20),
    },
    bestChannel: 'shopify',
    worstChannel: 'amazon',
    channelArbitrageOpportunity: 980,
    totalUnits: 8000,
    monthlyVelocity: 2200,
    daysOfInventory: 109,
    velocityCategory: 'slow',
    inventoryValue: 25600,
    abcClass: 'C',
    profitContributionPercent: 2.4,
    revenueContributionPercent: 2.6,
    expirationDate: daysFrom(200),
    daysToExpiration: 200,
    expirationRisk: 'safe',
    reorderRecommendation: 'discontinue',
    reorderReason: 'Low volume, slow velocity, <3% profit contribution. Cannibalizes Nitrile Gloves sales. Consolidate to single glove SKU.',
    subscriptionPercent: 5,
    velocityTrend: 'decelerating',
    marginTrend: 'eroding',
  },
];

// ─── Computed Aggregates ──────────────────────────────────────────

const totalPortfolioProfit = productSKUs.reduce((sum, p) => {
  return sum + Object.values(p.channels).reduce((cs, ch) => cs + ch.contributionMargin, 0);
}, 0);

const totalPortfolioRevenue = productSKUs.reduce((sum, p) => {
  return sum + Object.values(p.channels).reduce((cs, ch) => cs + ch.revenue, 0);
}, 0);

const totalInventoryValue = productSKUs.reduce((sum, p) => sum + p.inventoryValue, 0);

const aClassProducts = productSKUs.filter(p => p.abcClass === 'A');
const aClassProfitPercent = aClassProducts.reduce((sum, p) => sum + p.profitContributionPercent, 0);

const deadProducts = productSKUs.filter(p => p.velocityCategory === 'dead');
const slowProducts = productSKUs.filter(p => p.velocityCategory === 'slow');
const deadStockValue = deadProducts.reduce((sum, p) => sum + p.inventoryValue, 0);
const slowStockValue = slowProducts.reduce((sum, p) => sum + p.inventoryValue, 0);

const avgReturnRate = productSKUs.reduce((sum, p) => {
  const channels = Object.values(p.channels);
  return sum + channels.reduce((cs, ch) => cs + ch.returnRate, 0) / channels.length;
}, 0) / productSKUs.length;

const expiringIn90d = productSKUs.filter(p => p.daysToExpiration !== null && p.daysToExpiration <= 90);
const expiringIn90dValue = expiringIn90d.reduce((sum, p) => sum + p.inventoryValue, 0);

const avgCM = totalPortfolioProfit / totalPortfolioRevenue * 100;

export const portfolioSummary = {
  totalRevenue: totalPortfolioRevenue,
  totalProfit: totalPortfolioProfit,
  avgContributionMargin: Math.round(avgCM * 10) / 10,
  previousContributionMargin: 12.1, // Last month's avg CM for trend comparison
  twoMonthAgoContributionMargin: 14.0, // Two months ago CM for 3-month trajectory
  totalInventoryValue,
  totalSKUs: productSKUs.length,
  avgInventoryTurns: Math.round((totalPortfolioRevenue * 12 / totalInventoryValue) * 10) / 10,
  avgReturnRate: Math.round(avgReturnRate * 1000) / 10,
  totalChannelArbitrage: productSKUs.reduce((sum, p) => sum + p.channelArbitrageOpportunity, 0),
};

export const productHealthIndicators: ProductHealthIndicators = {
  inventoryTurns: {
    value: portfolioSummary.avgInventoryTurns,
    status: portfolioSummary.avgInventoryTurns > 8 ? 'green' : portfolioSummary.avgInventoryTurns >= 4 ? 'yellow' : 'red',
    label: portfolioSummary.avgInventoryTurns > 8 ? 'Healthy' : portfolioSummary.avgInventoryTurns >= 4 ? 'Moderate' : 'Cash trapped',
  },
  avgContributionMargin: {
    value: portfolioSummary.avgContributionMargin,
    status: portfolioSummary.avgContributionMargin > 25 ? 'green' : portfolioSummary.avgContributionMargin >= 15 ? 'yellow' : 'red',
    label: portfolioSummary.avgContributionMargin > 25 ? 'Strong' : portfolioSummary.avgContributionMargin >= 15 ? 'Acceptable' : 'Critical',
  },
  skuConcentration: {
    value: Math.round(aClassProfitPercent),
    status: aClassProfitPercent < 60 ? 'green' : aClassProfitPercent <= 80 ? 'yellow' : 'red',
    label: `Top ${aClassProducts.length} SKUs = ${Math.round(aClassProfitPercent)}% profit`,
  },
  deadStockPercent: {
    value: Math.round((deadStockValue / totalInventoryValue) * 1000) / 10,
    status: (deadStockValue / totalInventoryValue) < 0.05 ? 'green' : (deadStockValue / totalInventoryValue) <= 0.15 ? 'yellow' : 'red',
    label: `$${Math.round(deadStockValue / 1000)}K trapped`,
  },
  avgReturnRate: {
    value: portfolioSummary.avgReturnRate,
    status: portfolioSummary.avgReturnRate < 10 ? 'green' : portfolioSummary.avgReturnRate <= 20 ? 'yellow' : 'red',
    label: portfolioSummary.avgReturnRate < 10 ? 'Low' : portfolioSummary.avgReturnRate <= 20 ? 'Moderate' : 'High',
  },
  expirationRisk90d: {
    value: Math.round((expiringIn90dValue / totalInventoryValue) * 1000) / 10,
    status: (expiringIn90dValue / totalInventoryValue) < 0.03 ? 'green' : (expiringIn90dValue / totalInventoryValue) <= 0.08 ? 'yellow' : 'red',
    label: `$${Math.round(expiringIn90dValue / 1000)}K at risk`,
  },
};

export const inventoryVelocitySummary: InventoryVelocitySummary = {
  fast: {
    count: productSKUs.filter(p => p.velocityCategory === 'fast').length,
    value: productSKUs.filter(p => p.velocityCategory === 'fast').reduce((s, p) => s + p.inventoryValue, 0),
    percent: 0,
  },
  medium: {
    count: productSKUs.filter(p => p.velocityCategory === 'medium').length,
    value: productSKUs.filter(p => p.velocityCategory === 'medium').reduce((s, p) => s + p.inventoryValue, 0),
    percent: 0,
  },
  slow: {
    count: productSKUs.filter(p => p.velocityCategory === 'slow').length,
    value: productSKUs.filter(p => p.velocityCategory === 'slow').reduce((s, p) => s + p.inventoryValue, 0),
    percent: 0,
  },
  dead: {
    count: deadProducts.length,
    value: deadStockValue,
    percent: 0,
  },
  totalValue: totalInventoryValue,
  cashTrappedInSlowDead: deadStockValue + slowStockValue,
};

// Calculate percentages
inventoryVelocitySummary.fast.percent = Math.round((inventoryVelocitySummary.fast.value / totalInventoryValue) * 1000) / 10;
inventoryVelocitySummary.medium.percent = Math.round((inventoryVelocitySummary.medium.value / totalInventoryValue) * 1000) / 10;
inventoryVelocitySummary.slow.percent = Math.round((inventoryVelocitySummary.slow.value / totalInventoryValue) * 1000) / 10;
inventoryVelocitySummary.dead.percent = Math.round((inventoryVelocitySummary.dead.value / totalInventoryValue) * 1000) / 10;

// Kill List - products recommended for discontinuation or liquidation
export const killList = productSKUs.filter(
  p => p.reorderRecommendation === 'discontinue' || p.reorderRecommendation === 'liquidate'
);

// Channel arbitrage opportunities sorted by $ opportunity
export const arbitrageOpportunities = [...productSKUs]
  .filter(p => p.channelArbitrageOpportunity > 0)
  .sort((a, b) => b.channelArbitrageOpportunity - a.channelArbitrageOpportunity);

// Quick stats for Overview tab Morning Brief
export const productQuickStats = {
  avgCM: portfolioSummary.avgContributionMargin,
  deadStockValue: deadStockValue,
  expiringValue90d: expiringIn90dValue,
  channelArbitrageTotal: portfolioSummary.totalChannelArbitrage,
  killListCount: killList.length,
  topProduct: productSKUs.sort((a, b) => b.profitContributionPercent - a.profitContributionPercent)[0],
};

// Decision for Decision Hub (matches Decision interface from decisions.ts)
export const productDecision = {
  id: 'decision-product-001',
  question: 'Liquidate expiring inventory before write-off?',
  context: `$${Math.round(expiringIn90dValue / 1000)}K of inventory expires within 90 days across ${expiringIn90d.length} SKUs. At current velocity, ~60% will expire unsold. Flash sale at 40% off recovers ~$${Math.round(expiringIn90dValue * 0.36 / 1000)}K vs $0 at expiration.`,
  urgency: 'today' as const,
  confidence: 82,
  impact: {
    upside: `Recover $${Math.round(expiringIn90dValue * 0.36 / 1000)}K from at-risk inventory`,
    downside: 'Margin dilution on discounted products, potential brand perception risk',
  },
  category: 'operations' as const,
  recommendation: 'Flash sale on expiring SKUs',
  recommendedAction: 'Run 40% off flash sale on all SKUs expiring within 90 days. Donate remainder for tax write-off.',
  supportingMetrics: [
    { label: 'Inventory at Risk', value: `$${Math.round(expiringIn90dValue / 1000)}K` },
    { label: 'SKUs Expiring', value: `${expiringIn90d.length}` },
    { label: 'Recovery Potential', value: `~$${Math.round(expiringIn90dValue * 0.36 / 1000)}K` },
  ],
  options: [
    {
      label: 'Flash sale (40% off) on expiring SKUs',
      impact: `Recover ~$${Math.round(expiringIn90dValue * 0.36 / 1000)}K in 30 days`,
      risk: 'low' as const,
    },
    {
      label: 'Donate for tax write-off',
      impact: 'Tax deduction on $' + Math.round(expiringIn90dValue / 1000) + 'K, no revenue recovery',
      risk: 'low' as const,
    },
    {
      label: 'Hold and hope for demand spike',
      impact: 'Risk full write-off of $' + Math.round(expiringIn90dValue / 1000) + 'K',
      risk: 'high' as const,
    },
  ],
  owner: 'Operations',
};
