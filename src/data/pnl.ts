import type { WaterfallItem } from '../components/charts/WaterfallChart';
import { wellBeforeMetrics } from './wellbefore';
import { d2cBuildersMetrics } from './d2cbuilders';

// ======================================
// WellBefore P&L Data (Monthly)
// ======================================
const wbRevenue = wellBeforeMetrics.revenue.mtd.current; // ~$847K
const wbCOGS = wbRevenue * (1 - wellBeforeMetrics.profitability.grossMargin.current / 100); // ~57.5% COGS
const wbGrossProfit = wbRevenue - wbCOGS;
const wbMarketing = wellBeforeMetrics.marketing.spend.mtd.current; // ~$81K
const wbFulfillment = wellBeforeMetrics.fulfillment.costPerOrder.current * wellBeforeMetrics.orders.mtd.current; // ~$60K
const wbOpEx = wbRevenue * (wellBeforeMetrics.profitability.operatingExpenseRatio.current / 100); // ~14.1%
const wbNetProfit = wellBeforeMetrics.profitability.netProfit.current; // ~$124.5K

// Previous month for comparison
const wbPrevRevenue = wellBeforeMetrics.revenue.mtd.previous;
const wbPrevCOGS = wbPrevRevenue * (1 - (wellBeforeMetrics.profitability.grossMargin.previous || 43.2) / 100);
const wbPrevGrossProfit = wbPrevRevenue - wbPrevCOGS;
const wbPrevMarketing = wellBeforeMetrics.marketing.spend.mtd.previous;
const wbPrevFulfillment = (wellBeforeMetrics.fulfillment.costPerOrder.previous || 4.72) * (wellBeforeMetrics.orders.mtd.previous || 11890);
const wbPrevOpEx = wbPrevRevenue * ((wellBeforeMetrics.profitability.operatingExpenseRatio.previous || 14.5) / 100);
const wbPrevNetProfit = wellBeforeMetrics.profitability.netProfit.previous;

export const wellBeforePnL: WaterfallItem[] = [
  {
    name: 'Revenue',
    value: wbRevenue,
    type: 'revenue',
    color: '#3b82f6',
    description: `MTD from Shopify, Amazon, Wholesale, Subscriptions`,
  },
  {
    name: 'COGS',
    value: wbCOGS,
    type: 'cost',
    color: '#f87171',
    description: `Product cost, packaging, inbound freight (${(100 - wellBeforeMetrics.profitability.grossMargin.current).toFixed(1)}% of revenue)`,
  },
  {
    name: 'Gross Profit',
    value: wbGrossProfit,
    type: 'subtotal',
    color: '#10b981',
    description: `${wellBeforeMetrics.profitability.grossMargin.current}% gross margin`,
  },
  {
    name: 'Marketing',
    value: wbMarketing,
    type: 'cost',
    color: '#f59e0b',
    description: `Meta Ads, Google Ads, Klaviyo, Referral programs`,
  },
  {
    name: 'Fulfillment',
    value: wbFulfillment,
    type: 'cost',
    color: '#f97316',
    description: `$${wellBeforeMetrics.fulfillment.costPerOrder.current}/order × ${wellBeforeMetrics.orders.mtd.current.toLocaleString()} orders`,
  },
  {
    name: 'Operating',
    value: wbOpEx,
    type: 'cost',
    color: '#a855f7',
    description: `Team, SaaS, rent, insurance (${wellBeforeMetrics.profitability.operatingExpenseRatio.current}% of revenue)`,
  },
  {
    name: 'Net Profit',
    value: wbNetProfit,
    type: 'total',
    description: `Bottom line: ${((wbNetProfit / wbRevenue) * 100).toFixed(1)}% net margin`,
  },
];

// Line items for the detailed P&L table
export interface PnLLineItem {
  label: string;
  current: number;
  previous: number;
  changePercent: number;
  percentOfRevenue: number;
  prevPercentOfRevenue: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
  indent?: boolean;
}

export const wellBeforePnLTable: PnLLineItem[] = [
  {
    label: 'Revenue',
    current: wbRevenue,
    previous: wbPrevRevenue,
    changePercent: ((wbRevenue - wbPrevRevenue) / wbPrevRevenue) * 100,
    percentOfRevenue: 100,
    prevPercentOfRevenue: 100,
    isSubtotal: true,
  },
  {
    label: 'Cost of Goods Sold',
    current: -wbCOGS,
    previous: -wbPrevCOGS,
    changePercent: ((wbCOGS - wbPrevCOGS) / wbPrevCOGS) * 100,
    percentOfRevenue: (wbCOGS / wbRevenue) * 100,
    prevPercentOfRevenue: (wbPrevCOGS / wbPrevRevenue) * 100,
    indent: true,
  },
  {
    label: 'Gross Profit',
    current: wbGrossProfit,
    previous: wbPrevGrossProfit,
    changePercent: ((wbGrossProfit - wbPrevGrossProfit) / wbPrevGrossProfit) * 100,
    percentOfRevenue: (wbGrossProfit / wbRevenue) * 100,
    prevPercentOfRevenue: (wbPrevGrossProfit / wbPrevRevenue) * 100,
    isSubtotal: true,
  },
  {
    label: 'Marketing & Advertising',
    current: -wbMarketing,
    previous: -wbPrevMarketing,
    changePercent: ((wbMarketing - wbPrevMarketing) / wbPrevMarketing) * 100,
    percentOfRevenue: (wbMarketing / wbRevenue) * 100,
    prevPercentOfRevenue: (wbPrevMarketing / wbPrevRevenue) * 100,
    indent: true,
  },
  {
    label: 'Fulfillment & Shipping',
    current: -wbFulfillment,
    previous: -wbPrevFulfillment,
    changePercent: ((wbFulfillment - wbPrevFulfillment) / wbPrevFulfillment) * 100,
    percentOfRevenue: (wbFulfillment / wbRevenue) * 100,
    prevPercentOfRevenue: (wbPrevFulfillment / wbPrevRevenue) * 100,
    indent: true,
  },
  {
    label: 'Operating Expenses',
    current: -wbOpEx,
    previous: -wbPrevOpEx,
    changePercent: ((wbOpEx - wbPrevOpEx) / wbPrevOpEx) * 100,
    percentOfRevenue: (wbOpEx / wbRevenue) * 100,
    prevPercentOfRevenue: (wbPrevOpEx / wbPrevRevenue) * 100,
    indent: true,
  },
  {
    label: 'Net Profit',
    current: wbNetProfit,
    previous: wbPrevNetProfit,
    changePercent: ((wbNetProfit - wbPrevNetProfit) / wbPrevNetProfit) * 100,
    percentOfRevenue: (wbNetProfit / wbRevenue) * 100,
    prevPercentOfRevenue: (wbPrevNetProfit / wbPrevRevenue) * 100,
    isTotal: true,
  },
];

// ======================================
// D2C Builders P&L Data (Monthly)
// ======================================
const d2cRevenue = d2cBuildersMetrics.revenue.mtd.current;
const d2cGrossMarginPct = d2cBuildersMetrics.profitability.grossMargin.current / 100;
const d2cLabor = d2cBuildersMetrics.costs.laborCost.current;
const d2cShippingCost = d2cBuildersMetrics.revenue.byStream.shipping * (1 - d2cBuildersMetrics.costs.shippingMargin.current / 100);
const d2cOverhead = d2cBuildersMetrics.costs.overhead;
const d2cGrossProfit = d2cRevenue * d2cGrossMarginPct;
const d2cNetProfit = d2cBuildersMetrics.profitability.netProfit.current;

export const d2cBuildersPnL: WaterfallItem[] = [
  {
    name: 'Revenue',
    value: d2cRevenue,
    type: 'revenue',
    color: '#10b981',
    description: 'Shipping, Pick & Pack, Storage, Hourly project work',
  },
  {
    name: 'Labor',
    value: d2cLabor,
    type: 'cost',
    color: '#f87171',
    description: `Warehouse staff & operations team`,
  },
  {
    name: 'Shipping',
    value: d2cShippingCost,
    type: 'cost',
    color: '#f59e0b',
    description: `Carrier costs (${d2cBuildersMetrics.costs.shippingMargin.current}% margin on shipping)`,
  },
  {
    name: 'Gross Profit',
    value: d2cGrossProfit,
    type: 'subtotal',
    color: '#10b981',
    description: `${d2cBuildersMetrics.profitability.grossMargin.current}% gross margin`,
  },
  {
    name: 'Overhead',
    value: d2cOverhead,
    type: 'cost',
    color: '#a855f7',
    description: 'Rent, utilities, insurance, SaaS',
  },
  {
    name: 'Net Profit',
    value: d2cNetProfit,
    type: 'total',
    description: `${((d2cNetProfit / d2cRevenue) * 100).toFixed(1)}% net margin`,
  },
];

// ======================================
// Combined Portfolio P&L
// ======================================
const combinedRevenue = wbRevenue + d2cRevenue;
const combinedCOGS = wbCOGS + d2cRevenue * (1 - d2cGrossMarginPct);
const combinedGrossProfit = combinedRevenue - combinedCOGS;
const combinedMarketing = wbMarketing; // D2C has minimal marketing
const combinedOpEx = wbOpEx + d2cOverhead;
const combinedNetProfit = wbNetProfit + d2cNetProfit;

export const portfolioPnL: WaterfallItem[] = [
  {
    name: 'Revenue',
    value: combinedRevenue,
    type: 'revenue',
    color: '#3b82f6',
    description: `WB: $${(wbRevenue / 1000).toFixed(0)}K + D2C: $${(d2cRevenue / 1000).toFixed(0)}K`,
  },
  {
    name: 'COGS',
    value: combinedCOGS,
    type: 'cost',
    color: '#f87171',
    description: 'Product costs + direct labor',
  },
  {
    name: 'Gross Profit',
    value: combinedGrossProfit,
    type: 'subtotal',
    color: '#10b981',
    description: `${((combinedGrossProfit / combinedRevenue) * 100).toFixed(1)}% blended margin`,
  },
  {
    name: 'Marketing',
    value: combinedMarketing,
    type: 'cost',
    color: '#f59e0b',
    description: 'Primarily WellBefore ad spend',
  },
  {
    name: 'Operations',
    value: combinedOpEx,
    type: 'cost',
    color: '#a855f7',
    description: 'Combined operating expenses',
  },
  {
    name: 'Net Profit',
    value: combinedNetProfit,
    type: 'total',
    description: `${((combinedNetProfit / combinedRevenue) * 100).toFixed(1)}% portfolio net margin`,
  },
];

// ======================================
// Monthly P&L Trend (6 months)
// ======================================
export interface MonthlyPnL {
  month: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  marketing: number;
  fulfillment: number;
  opex: number;
  netProfit: number;
  grossMarginPct: number;
  netMarginPct: number;
}

export const monthlyPnLTrend: MonthlyPnL[] = [
  { month: 'Aug', revenue: 780000, cogs: 444600, grossProfit: 335400, marketing: 72000, fulfillment: 52000, opex: 108000, netProfit: 103400, grossMarginPct: 43.0, netMarginPct: 13.3 },
  { month: 'Sep', revenue: 812000, cogs: 459600, grossProfit: 352400, marketing: 75000, fulfillment: 54000, opex: 110000, netProfit: 113400, grossMarginPct: 43.4, netMarginPct: 14.0 },
  { month: 'Oct', revenue: 845000, cogs: 483800, grossProfit: 361200, marketing: 78000, fulfillment: 56800, opex: 112000, netProfit: 114400, grossMarginPct: 42.7, netMarginPct: 13.5 },
  { month: 'Nov', revenue: 892000, cogs: 515200, grossProfit: 376800, marketing: 85000, fulfillment: 58200, opex: 115000, netProfit: 118600, grossMarginPct: 42.2, netMarginPct: 13.3 },
  { month: 'Dec', revenue: 924000, cogs: 529800, grossProfit: 394200, marketing: 88000, fulfillment: 59500, opex: 118000, netProfit: 128700, grossMarginPct: 42.7, netMarginPct: 13.9 },
  { month: 'Jan', revenue: 847320, cogs: wbCOGS, grossProfit: wbGrossProfit, marketing: wbMarketing, fulfillment: wbFulfillment, opex: wbOpEx, netProfit: wbNetProfit, grossMarginPct: wellBeforeMetrics.profitability.grossMargin.current, netMarginPct: (wbNetProfit / wbRevenue) * 100 },
];

// ======================================
// Cost breakdown for donut chart
// ======================================
export interface CostBreakdown {
  name: string;
  value: number;
  color: string;
  percentOfRevenue: number;
}

export const wellBeforeCostBreakdown: CostBreakdown[] = [
  { name: 'COGS', value: wbCOGS, color: '#f87171', percentOfRevenue: (wbCOGS / wbRevenue) * 100 },
  { name: 'Marketing', value: wbMarketing, color: '#f59e0b', percentOfRevenue: (wbMarketing / wbRevenue) * 100 },
  { name: 'Fulfillment', value: wbFulfillment, color: '#f97316', percentOfRevenue: (wbFulfillment / wbRevenue) * 100 },
  { name: 'Operating', value: wbOpEx, color: '#a855f7', percentOfRevenue: (wbOpEx / wbRevenue) * 100 },
  { name: 'Net Profit', value: wbNetProfit, color: '#10b981', percentOfRevenue: (wbNetProfit / wbRevenue) * 100 },
];
