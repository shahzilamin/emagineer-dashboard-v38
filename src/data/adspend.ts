// Ad Spend & ROAS Command Center Data
// CEO's #1 question: "What am I getting back for every dollar I spend?"

import type { TimeSeriesPoint } from '../types';

export interface ChannelROI {
  channel: string;
  shortName: string;
  color: string;
  icon: 'meta' | 'google' | 'amazon' | 'walmart' | 'tiktok' | 'email' | 'affiliate' | 'organic' | 'direct';
  // Spend & Returns
  spend: number;
  revenue: number;
  roas: number;
  previousRoas: number;
  // Customer Economics
  cac: number;
  previousCac: number;
  ltv90: number;
  ltv365: number;
  ltvCacRatio: number;
  // Customer Quality / Stickiness
  repeatRate: number; // % who buy again within 90 days
  avgDaysToSecondPurchase: number;
  retentionAt90Days: number; // % still active at 90 days
  // Volume
  orders: number;
  newCustomers: number;
  conversionRate: number;
  // Trend
  trend: 'up' | 'down' | 'flat';
  roasTrend: TimeSeriesPoint[]; // 12-week ROAS trend
}

export interface MarketplaceChannel {
  name: string;
  color: string;
  revenue: number;
  previousRevenue: number;
  changePercent: number;
  orders: number;
  fees: number;
  feePercent: number;
  netMargin: number;
  monthlyTrend: TimeSeriesPoint[]; // 6-month trend
  adSpend: number;
  adRoas: number;
}

export interface OrganicPaidSplit {
  month: string;
  organic: number;
  paid: number;
  marketplace: number;
  organicPercent: number;
  paidPercent: number;
  marketplacePercent: number;
}

// Generate 12-week ROAS trend
const generateRoasTrend = (baseRoas: number, volatility: number = 0.15): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  let value = baseRoas * 0.92; // Start slightly lower
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 7);
    const change = (Math.random() - 0.4) * volatility * value;
    value = Math.max(value + change, baseRoas * 0.6);
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
    });
  }
  return data;
};

// Generate monthly revenue trend
const generateMonthlyTrend = (base: number, growth: number): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  let value = base * 0.7;
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    value = value * (1 + growth + (Math.random() - 0.5) * 0.05);
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
    });
  }
  return data;
};

// ============================================
// CHANNEL ROI DATA
// ============================================

export const channelROI: ChannelROI[] = [
  {
    channel: 'Email (Klaviyo)',
    shortName: 'Email',
    color: '#8b5cf6',
    icon: 'email',
    spend: 2800,
    revenue: 84000,
    roas: 30.0,
    previousRoas: 28.5,
    cac: 2.33,
    previousCac: 2.45,
    ltv90: 156,
    ltv365: 312,
    ltvCacRatio: 133.9,
    repeatRate: 52.4,
    avgDaysToSecondPurchase: 18,
    retentionAt90Days: 64.2,
    orders: 1200,
    newCustomers: 180,
    conversionRate: 4.2,
    trend: 'up',
    roasTrend: generateRoasTrend(30.0, 0.08),
  },
  {
    channel: 'Organic Search',
    shortName: 'Organic',
    color: '#22c55e',
    icon: 'organic',
    spend: 0,
    revenue: 156000,
    roas: Infinity,
    previousRoas: Infinity,
    cac: 0,
    previousCac: 0,
    ltv90: 138,
    ltv365: 245,
    ltvCacRatio: Infinity,
    repeatRate: 38.1,
    avgDaysToSecondPurchase: 28,
    retentionAt90Days: 48.5,
    orders: 2300,
    newCustomers: 1650,
    conversionRate: 3.8,
    trend: 'down',
    roasTrend: [], // No spend, no ROAS to track
  },
  {
    channel: 'Meta Ads (FB/IG)',
    shortName: 'Meta',
    color: '#3b82f6',
    icon: 'meta',
    spend: 42500,
    revenue: 127500,
    roas: 3.0,
    previousRoas: 3.25,
    cac: 22.67,
    previousCac: 20.85,
    ltv90: 98,
    ltv365: 168,
    ltvCacRatio: 7.41,
    repeatRate: 24.2,
    avgDaysToSecondPurchase: 42,
    retentionAt90Days: 31.8,
    orders: 1875,
    newCustomers: 1420,
    conversionRate: 2.4,
    trend: 'down',
    roasTrend: generateRoasTrend(3.0, 0.12),
  },
  {
    channel: 'Google Ads',
    shortName: 'Google',
    color: '#ef4444',
    icon: 'google',
    spend: 31200,
    revenue: 93600,
    roas: 3.0,
    previousRoas: 3.15,
    cac: 23.11,
    previousCac: 21.50,
    ltv90: 105,
    ltv365: 182,
    ltvCacRatio: 7.87,
    repeatRate: 26.8,
    avgDaysToSecondPurchase: 38,
    retentionAt90Days: 35.2,
    orders: 1350,
    newCustomers: 985,
    conversionRate: 3.1,
    trend: 'flat',
    roasTrend: generateRoasTrend(3.0, 0.10),
  },
  {
    channel: 'Amazon Ads (PPC)',
    shortName: 'Amazon',
    color: '#f59e0b',
    icon: 'amazon',
    spend: 18500,
    revenue: 68450,
    roas: 3.7,
    previousRoas: 3.4,
    cac: 15.83,
    previousCac: 16.90,
    ltv90: 82,
    ltv365: 124,
    ltvCacRatio: 7.83,
    repeatRate: 18.5,
    avgDaysToSecondPurchase: 52,
    retentionAt90Days: 22.4,
    orders: 1168,
    newCustomers: 890,
    conversionRate: 8.2,
    trend: 'up',
    roasTrend: generateRoasTrend(3.7, 0.10),
  },
  {
    channel: 'TikTok Ads',
    shortName: 'TikTok',
    color: '#ec4899',
    icon: 'tiktok',
    spend: 8200,
    revenue: 19680,
    roas: 2.4,
    previousRoas: 2.1,
    cac: 28.97,
    previousCac: 31.20,
    ltv90: 72,
    ltv365: 115,
    ltvCacRatio: 3.97,
    repeatRate: 15.8,
    avgDaysToSecondPurchase: 58,
    retentionAt90Days: 18.6,
    orders: 283,
    newCustomers: 245,
    conversionRate: 1.8,
    trend: 'up',
    roasTrend: generateRoasTrend(2.4, 0.18),
  },
  {
    channel: 'Affiliate / Influencer',
    shortName: 'Affiliate',
    color: '#14b8a6',
    icon: 'affiliate',
    spend: 4500,
    revenue: 45000,
    roas: 10.0,
    previousRoas: 9.2,
    cac: 6.62,
    previousCac: 7.15,
    ltv90: 125,
    ltv365: 205,
    ltvCacRatio: 30.97,
    repeatRate: 34.5,
    avgDaysToSecondPurchase: 25,
    retentionAt90Days: 42.1,
    orders: 680,
    newCustomers: 485,
    conversionRate: 3.5,
    trend: 'up',
    roasTrend: generateRoasTrend(10.0, 0.12),
  },
  {
    channel: 'Walmart Ads',
    shortName: 'Walmart',
    color: '#0ea5e9',
    icon: 'walmart',
    spend: 5800,
    revenue: 17400,
    roas: 3.0,
    previousRoas: 2.7,
    cac: 19.33,
    previousCac: 21.10,
    ltv90: 68,
    ltv365: 98,
    ltvCacRatio: 5.07,
    repeatRate: 12.4,
    avgDaysToSecondPurchase: 62,
    retentionAt90Days: 16.8,
    orders: 300,
    newCustomers: 248,
    conversionRate: 5.4,
    trend: 'up',
    roasTrend: generateRoasTrend(3.0, 0.15),
  },
];

// ============================================
// MARKETPLACE REVENUE
// ============================================

export const marketplaceChannels: MarketplaceChannel[] = [
  {
    name: 'Amazon',
    color: '#f59e0b',
    revenue: 124500,
    previousRevenue: 108200,
    changePercent: 15.1,
    orders: 2850,
    fees: 18675, // 15% referral
    feePercent: 15.0,
    netMargin: 28.4,
    monthlyTrend: generateMonthlyTrend(124500, 0.08),
    adSpend: 18500,
    adRoas: 3.7,
  },
  {
    name: 'Walmart',
    color: '#0ea5e9',
    revenue: 48200,
    previousRevenue: 38500,
    changePercent: 25.2,
    orders: 980,
    fees: 6266, // 13% referral
    feePercent: 13.0,
    netMargin: 24.8,
    monthlyTrend: generateMonthlyTrend(48200, 0.12),
    adSpend: 5800,
    adRoas: 3.0,
  },
  {
    name: 'TikTok Shop',
    color: '#ec4899',
    revenue: 19200,
    previousRevenue: 12800,
    changePercent: 50.0,
    orders: 420,
    fees: 960, // 5% commission
    feePercent: 5.0,
    netMargin: 32.1,
    monthlyTrend: generateMonthlyTrend(19200, 0.22),
    adSpend: 8200,
    adRoas: 2.4,
  },
];

// ============================================
// ORGANIC VS PAID SPLIT (12 months)
// ============================================

export const organicPaidSplit: OrganicPaidSplit[] = [
  { month: 'Mar 25', organic: 285000, paid: 320000, marketplace: 125000, organicPercent: 39.0, paidPercent: 43.8, marketplacePercent: 17.1 },
  { month: 'Apr 25', organic: 272000, paid: 338000, marketplace: 132000, organicPercent: 36.7, paidPercent: 45.6, marketplacePercent: 17.8 },
  { month: 'May 25', organic: 260000, paid: 355000, marketplace: 140000, organicPercent: 34.4, paidPercent: 47.0, marketplacePercent: 18.5 },
  { month: 'Jun 25', organic: 248000, paid: 362000, marketplace: 148000, organicPercent: 32.7, paidPercent: 47.8, marketplacePercent: 19.5 },
  { month: 'Jul 25', organic: 241000, paid: 370000, marketplace: 155000, organicPercent: 31.4, paidPercent: 48.3, marketplacePercent: 20.2 },
  { month: 'Aug 25', organic: 235000, paid: 378000, marketplace: 162000, organicPercent: 30.3, paidPercent: 48.8, marketplacePercent: 20.9 },
  { month: 'Sep 25', organic: 228000, paid: 385000, marketplace: 170000, organicPercent: 29.1, paidPercent: 49.2, marketplacePercent: 21.7 },
  { month: 'Oct 25', organic: 222000, paid: 392000, marketplace: 178000, organicPercent: 28.0, paidPercent: 49.5, marketplacePercent: 22.5 },
  { month: 'Nov 25', organic: 218000, paid: 405000, marketplace: 185000, organicPercent: 27.0, paidPercent: 50.1, marketplacePercent: 22.9 },
  { month: 'Dec 25', organic: 212000, paid: 415000, marketplace: 192000, organicPercent: 25.9, paidPercent: 50.7, marketplacePercent: 23.4 },
  { month: 'Jan 26', organic: 208000, paid: 428000, marketplace: 198000, organicPercent: 24.9, paidPercent: 51.3, marketplacePercent: 23.7 },
  { month: 'Feb 26', organic: 204000, paid: 440000, marketplace: 204000, organicPercent: 24.1, paidPercent: 51.9, marketplacePercent: 24.1 },
];

// ============================================
// BLENDED CAC TREND (12 weeks)
// ============================================

export const blendedCacTrend: TimeSeriesPoint[] = (() => {
  const data: TimeSeriesPoint[] = [];
  let value = 15.20;
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 7);
    value = value + (Math.random() - 0.35) * 0.8; // Slight upward drift
    value = Math.max(value, 14.0);
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
    });
  }
  return data;
})();

// ============================================
// SUMMARY CALCULATIONS
// ============================================

export const adSpendSummary = {
  totalSpend: channelROI.reduce((sum, ch) => sum + ch.spend, 0),
  totalRevenue: channelROI.reduce((sum, ch) => sum + ch.revenue, 0),
  blendedRoas: (() => {
    const totalSpend = channelROI.filter(c => c.spend > 0).reduce((sum, ch) => sum + ch.spend, 0);
    const totalRev = channelROI.filter(c => c.spend > 0).reduce((sum, ch) => sum + ch.revenue, 0);
    return Math.round((totalRev / totalSpend) * 100) / 100;
  })(),
  blendedCac: (() => {
    const paidChannels = channelROI.filter(c => c.spend > 0);
    const totalSpend = paidChannels.reduce((sum, ch) => sum + ch.spend, 0);
    const totalNewCustomers = paidChannels.reduce((sum, ch) => sum + ch.newCustomers, 0);
    return Math.round((totalSpend / totalNewCustomers) * 100) / 100;
  })(),
  previousBlendedCac: 16.85,
  totalNewCustomers: channelROI.reduce((sum, ch) => sum + ch.newCustomers, 0),
  avgLtv365: Math.round(channelROI.reduce((sum, ch) => sum + ch.ltv365 * ch.newCustomers, 0) / channelROI.reduce((sum, ch) => sum + ch.newCustomers, 0)),
  organicRevenuePercent: 24.1,
  previousOrganicPercent: 27.0,
  marketplaceRevenue: marketplaceChannels.reduce((sum, m) => sum + m.revenue, 0),
  marketplaceGrowth: 21.5, // blended MoM
};
