// Marketing Intelligence Data Layer
// Nova's brief: MER as north star, marginal ROAS, CAC payback, efficiency traffic lights, organic dependency tax

import { channelROI, organicPaidSplit, adSpendSummary } from './adspend';

// ============================================
// MER (Marketing Efficiency Ratio)
// ============================================
// MER = Total Revenue / Total Ad Spend (un-gameable north star)

export interface MERDataPoint {
  month: string;
  totalRevenue: number;
  totalAdSpend: number;
  mer: number;
}

export const merTrend: MERDataPoint[] = [
  { month: 'Mar 25', totalRevenue: 730000, totalAdSpend: 158000, mer: 4.62 },
  { month: 'Apr 25', totalRevenue: 742000, totalAdSpend: 165000, mer: 4.50 },
  { month: 'May 25', totalRevenue: 755000, totalAdSpend: 172000, mer: 4.39 },
  { month: 'Jun 25', totalRevenue: 758000, totalAdSpend: 178000, mer: 4.26 },
  { month: 'Jul 25', totalRevenue: 766000, totalAdSpend: 185000, mer: 4.14 },
  { month: 'Aug 25', totalRevenue: 775000, totalAdSpend: 190000, mer: 4.08 },
  { month: 'Sep 25', totalRevenue: 783000, totalAdSpend: 195000, mer: 4.02 },
  { month: 'Oct 25', totalRevenue: 792000, totalAdSpend: 200000, mer: 3.96 },
  { month: 'Nov 25', totalRevenue: 808000, totalAdSpend: 208000, mer: 3.88 },
  { month: 'Dec 25', totalRevenue: 819000, totalAdSpend: 215000, mer: 3.81 },
  { month: 'Jan 26', totalRevenue: 834000, totalAdSpend: 222000, mer: 3.76 },
  { month: 'Feb 26', totalRevenue: 848000, totalAdSpend: 230000, mer: 3.69 },
];

export const currentMER = merTrend[merTrend.length - 1].mer;
export const previousMER = merTrend[merTrend.length - 2].mer;
export const merChange = currentMER - previousMER;

// ============================================
// MARGINAL ROAS (Diminishing Returns)
// ============================================
// What does the NEXT $1K on each channel return?

export interface MarginalROASPoint {
  spendLevel: number; // cumulative spend in thousands
  marginalRoas: number; // ROAS on the last $1K
}

export interface ChannelMarginalROAS {
  channel: string;
  shortName: string;
  color: string;
  currentSpend: number;
  optimalSpend: number; // where marginal ROAS = target ROAS
  currentMarginalRoas: number;
  curve: MarginalROASPoint[];
  recommendation: 'increase' | 'hold' | 'decrease';
  recommendationText: string;
}

const generateDiminishingCurve = (
  maxRoas: number,
  decayRate: number,
  startSpend: number,
  steps: number = 12
): MarginalROASPoint[] => {
  const points: MarginalROASPoint[] = [];
  for (let i = 0; i < steps; i++) {
    const spend = startSpend + i * (startSpend * 0.25);
    const marginalRoas = maxRoas * Math.exp(-decayRate * i);
    points.push({
      spendLevel: Math.round(spend / 1000),
      marginalRoas: Math.round(marginalRoas * 100) / 100,
    });
  }
  return points;
};

export const channelMarginalROAS: ChannelMarginalROAS[] = [
  {
    channel: 'Email (Klaviyo)',
    shortName: 'Email',
    color: '#8b5cf6',
    currentSpend: 2800,
    optimalSpend: 8000,
    currentMarginalRoas: 25.2,
    curve: generateDiminishingCurve(35, 0.08, 1000),
    recommendation: 'increase',
    recommendationText: 'Far below optimal. Every additional $1K returns 25x. Scale aggressively.',
  },
  {
    channel: 'Affiliate / Influencer',
    shortName: 'Affiliate',
    color: '#14b8a6',
    currentSpend: 4500,
    optimalSpend: 12000,
    currentMarginalRoas: 7.8,
    curve: generateDiminishingCurve(14, 0.1, 2000),
    recommendation: 'increase',
    recommendationText: 'High marginal returns. Double spend to $9K and monitor.',
  },
  {
    channel: 'Google Ads',
    shortName: 'Google',
    color: '#ef4444',
    currentSpend: 31200,
    optimalSpend: 35000,
    currentMarginalRoas: 2.1,
    curve: generateDiminishingCurve(5.5, 0.12, 10000),
    recommendation: 'hold',
    recommendationText: 'Near optimal spend. Marginal returns approaching breakeven.',
  },
  {
    channel: 'Meta Ads (FB/IG)',
    shortName: 'Meta',
    color: '#3b82f6',
    currentSpend: 42500,
    optimalSpend: 38000,
    currentMarginalRoas: 1.6,
    curve: generateDiminishingCurve(5.0, 0.13, 15000),
    recommendation: 'decrease',
    recommendationText: 'Past optimal. Cut $4.5K and reallocate to Email + Affiliate.',
  },
  {
    channel: 'Amazon Ads',
    shortName: 'Amazon',
    color: '#f59e0b',
    currentSpend: 18500,
    optimalSpend: 22000,
    currentMarginalRoas: 2.8,
    curve: generateDiminishingCurve(6.0, 0.11, 8000),
    recommendation: 'increase',
    recommendationText: 'Room to grow. Add $3.5K, focus on top-converting ASINs.',
  },
  {
    channel: 'TikTok Ads',
    shortName: 'TikTok',
    color: '#ec4899',
    currentSpend: 8200,
    optimalSpend: 6000,
    currentMarginalRoas: 1.4,
    curve: generateDiminishingCurve(4.0, 0.15, 3000),
    recommendation: 'decrease',
    recommendationText: 'Attribution unreliable. Cut to $6K test budget. Monitor cross-channel lift.',
  },
  {
    channel: 'Walmart Ads',
    shortName: 'Walmart',
    color: '#0ea5e9',
    currentSpend: 5800,
    optimalSpend: 8000,
    currentMarginalRoas: 2.5,
    curve: generateDiminishingCurve(4.5, 0.1, 3000),
    recommendation: 'increase',
    recommendationText: 'Growing platform with room to scale. Add $2.2K incrementally.',
  },
];

// ============================================
// CAC PAYBACK BY CHANNEL
// ============================================

export interface CACPaybackChannel {
  channel: string;
  shortName: string;
  color: string;
  cac: number;
  monthlyGrossMarginPerCustomer: number;
  paybackMonths: number;
  status: 'healthy' | 'watch' | 'danger';
  ltv365: number;
  ltvCacRatio: number;
}

export const cacPaybackByChannel: CACPaybackChannel[] = channelROI
  .filter(ch => ch.spend > 0)
  .map(ch => {
    const monthlyGM = (ch.ltv365 / 12) * 0.55; // approx 55% gross margin
    const payback = ch.cac / monthlyGM;
    return {
      channel: ch.channel,
      shortName: ch.shortName,
      color: ch.color,
      cac: ch.cac,
      monthlyGrossMarginPerCustomer: Math.round(monthlyGM * 100) / 100,
      paybackMonths: Math.round(payback * 10) / 10,
      status: payback <= 3 ? 'healthy' as const : payback <= 6 ? 'watch' as const : 'danger' as const,
      ltv365: ch.ltv365,
      ltvCacRatio: ch.ltvCacRatio,
    };
  })
  .sort((a, b) => a.paybackMonths - b.paybackMonths);

// ============================================
// EFFICIENCY TRAFFIC LIGHTS
// ============================================

export interface TrafficLight {
  metric: string;
  value: number;
  displayValue: string;
  status: 'green' | 'yellow' | 'red';
  thresholds: { green: string; yellow: string; red: string };
  insight: string;
}

const getMERStatus = (mer: number): 'green' | 'yellow' | 'red' =>
  mer > 4 ? 'green' : mer >= 3 ? 'yellow' : 'red';

const getCACPaybackStatus = (months: number): 'green' | 'yellow' | 'red' =>
  months < 3 ? 'green' : months <= 6 ? 'yellow' : 'red';

const getOrganicStatus = (pct: number): 'green' | 'yellow' | 'red' =>
  pct > 40 ? 'green' : pct >= 25 ? 'yellow' : 'red';

const getTACOSStatus = (tacos: number): 'green' | 'yellow' | 'red' =>
  tacos < 8 ? 'green' : tacos <= 12 ? 'yellow' : 'red';

const getOverclaimStatus = (gap: number): 'green' | 'yellow' | 'red' =>
  gap < 20 ? 'green' : gap <= 40 ? 'yellow' : 'red';

// Calculate overclaim gap
const platformReportedRevenue = channelROI.filter(c => c.spend > 0).reduce((s, c) => s + c.revenue, 0);
const estimatedActualRevenue = adSpendSummary.totalRevenue * 0.72; // ~28% overclaim
const overclaimGap = Math.round(((platformReportedRevenue - estimatedActualRevenue) / estimatedActualRevenue) * 100);

// Amazon TACoS: ad spend / total Amazon revenue (including organic)
const amazonChannel = channelROI.find(c => c.shortName === 'Amazon');
const amazonTotalRevenue = 124500; // from marketplace data
const amazonTACoS = amazonChannel ? (amazonChannel.spend / amazonTotalRevenue) * 100 : 0;

const blendedPayback = (() => {
  const paidChannels = channelROI.filter(c => c.spend > 0);
  const totalSpend = paidChannels.reduce((s, c) => s + c.spend, 0);
  const totalNewCustomers = paidChannels.reduce((s, c) => s + c.newCustomers, 0);
  const avgCAC = totalSpend / totalNewCustomers;
  const avgMonthlyGM = (adSpendSummary.avgLtv365 / 12) * 0.55;
  return avgCAC / avgMonthlyGM;
})();

export const efficiencyTrafficLights: TrafficLight[] = [
  {
    metric: 'MER',
    value: currentMER,
    displayValue: `${currentMER.toFixed(1)}:1`,
    status: getMERStatus(currentMER),
    thresholds: { green: '>4:1', yellow: '3-4:1', red: '<3:1' },
    insight: currentMER < 4 ? 'Trending toward danger zone. Revenue growth not keeping pace with ad spend growth.' : 'Healthy but declining. Watch month-over-month trend.',
  },
  {
    metric: 'CAC Payback',
    value: blendedPayback,
    displayValue: `${blendedPayback.toFixed(1)} mo`,
    status: getCACPaybackStatus(blendedPayback),
    thresholds: { green: '<3 mo', yellow: '3-6 mo', red: '>6 mo' },
    insight: blendedPayback < 3 ? 'Capital is turning fast. Safe to scale.' : 'Watch per-channel payback - blended hides outliers.',
  },
  {
    metric: 'Organic Rev %',
    value: adSpendSummary.organicRevenuePercent,
    displayValue: `${adSpendSummary.organicRevenuePercent}%`,
    status: getOrganicStatus(adSpendSummary.organicRevenuePercent),
    thresholds: { green: '>40%', yellow: '25-40%', red: '<25%' },
    insight: 'Dangerously close to red zone. Every 1% lost = ~$85K/yr in new ad spend required.',
  },
  {
    metric: 'Amazon TACoS',
    value: Math.round(amazonTACoS * 10) / 10,
    displayValue: `${(Math.round(amazonTACoS * 10) / 10).toFixed(1)}%`,
    status: getTACOSStatus(amazonTACoS),
    thresholds: { green: '<8%', yellow: '8-12%', red: '>12% ' },
    insight: amazonTACoS > 12 ? 'Ads not building organic momentum. Paying for every sale.' : 'Ads helping build organic rank. Healthy.',
  },
  {
    metric: 'Overclaim Gap',
    value: overclaimGap,
    displayValue: `${overclaimGap}%`,
    status: getOverclaimStatus(overclaimGap),
    thresholds: { green: '<20%', yellow: '20-40%', red: '>40%' },
    insight: 'Platforms claim more credit than reality. Budget with MER, not platform ROAS.',
  },
];

// ============================================
// ORGANIC DEPENDENCY TAX
// ============================================

export interface OrganicDependencyData {
  currentOrganicPercent: number;
  previousOrganicPercent: number;
  organicDeclineRate: number; // pp per month
  annualRevenue: number;
  paidReplacementCostPerPoint: number; // $ cost to replace 1% organic with paid
  projectedTax12Months: number;
  projectedOrganicPercent12Months: number;
}

export const organicDependency: OrganicDependencyData = (() => {
  const currentPct = organicPaidSplit[organicPaidSplit.length - 1].organicPercent;
  const sixMonthsAgoPct = organicPaidSplit[organicPaidSplit.length - 7]?.organicPercent || 30;
  const declineRate = (sixMonthsAgoPct - currentPct) / 6;
  const annualRev = 848000 * 12;
  const costPerPoint = annualRev * 0.01 * 0.25; // each 1% costs ~25 cents per dollar in CAC
  const projected12Mo = Math.max(15, currentPct - declineRate * 12);
  const pointsLost = currentPct - projected12Mo;

  return {
    currentOrganicPercent: currentPct,
    previousOrganicPercent: sixMonthsAgoPct,
    organicDeclineRate: Math.round(declineRate * 100) / 100,
    annualRevenue: annualRev,
    paidReplacementCostPerPoint: Math.round(costPerPoint),
    projectedTax12Months: Math.round(pointsLost * costPerPoint),
    projectedOrganicPercent12Months: Math.round(projected12Mo * 10) / 10,
  };
})();

// ============================================
// BUDGET REALLOCATION SUGGESTION
// ============================================

export interface ReallocationSuggestion {
  from: string;
  to: string;
  amount: number;
  projectedImpact: string;
  confidence: number;
}

export const budgetReallocations: ReallocationSuggestion[] = [
  {
    from: 'Meta Ads',
    to: 'Email (Klaviyo)',
    amount: 3000,
    projectedImpact: '+$72K revenue/mo (from 3x → 25x ROAS on reallocated spend)',
    confidence: 85,
  },
  {
    from: 'TikTok Ads',
    to: 'Affiliate',
    amount: 2200,
    projectedImpact: '+$17K revenue/mo (from 2.4x → 10x ROAS)',
    confidence: 72,
  },
  {
    from: 'Meta Ads',
    to: 'Amazon Ads',
    amount: 1500,
    projectedImpact: '+$2.6K revenue/mo + builds organic Amazon rank',
    confidence: 68,
  },
];
