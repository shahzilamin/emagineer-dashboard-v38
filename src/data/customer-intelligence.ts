// Customer Intelligence Data - RFM Segmentation, Health Scores, Churn Risk
// Nova Brief #6: The customer-facing layer that completes the six-pillar decision engine

export interface RFMSegment {
  name: string;
  slug: string;
  count: number;
  percentOfTotal: number;
  revenueContribution: number;  // percent
  avgLTV: number;
  avgOrderFrequency: number;    // orders per year
  trend: 'growing' | 'stable' | 'shrinking';
  trendPercent: number;         // month-over-month change
  color: string;
  description: string;
  actionLabel: string;
}

export interface HealthDistribution {
  advocate: number;    // 90-100
  healthy: number;     // 75-89
  monitor: number;     // 50-74
  atRisk: number;      // 25-49
  critical: number;    // 0-24
}

export interface ChurnRiskBucket {
  period: string;
  subscribersAtRisk: number;
  revenueAtRisk: number;
  topReasons: { reason: string; count: number }[];
}

export interface ProfitabilityTier {
  tier: string;
  count: number;
  percentOfTotal: number;
  avgRevenue: number;
  avgContributionMargin: number;
  color: string;
}

export interface SegmentMigration {
  from: string;
  to: string;
  count: number;
  direction: 'upgrade' | 'downgrade' | 'stable';
}

export interface CrossChannelOverlap {
  channel1: string;
  channel2: string;
  overlapPercent: number;
  overlapCustomers: number;
}

// RFM Segments based on Nova's framework
export const rfmSegments: RFMSegment[] = [
  {
    name: 'Champions',
    slug: 'champions',
    count: 2_247,
    percentOfTotal: 12.8,
    revenueContribution: 43.2,
    avgLTV: 847,
    avgOrderFrequency: 11.2,
    trend: 'stable',
    trendPercent: 0.3,
    color: '#10b981',   // emerald-500
    description: 'Top customers by recency, frequency & spend. VIP treatment.',
    actionLabel: 'Ask for referrals',
  },
  {
    name: 'Loyal',
    slug: 'loyal',
    count: 3_510,
    percentOfTotal: 20.0,
    revenueContribution: 28.1,
    avgLTV: 412,
    avgOrderFrequency: 7.8,
    trend: 'growing',
    trendPercent: 2.1,
    color: '#3b82f6',   // blue-500
    description: 'Consistent buyers with strong engagement. Upsell ready.',
    actionLabel: 'Cross-sell & upsell',
  },
  {
    name: 'Potential Loyalists',
    slug: 'potential-loyalists',
    count: 3_158,
    percentOfTotal: 18.0,
    revenueContribution: 12.4,
    avgLTV: 189,
    avgOrderFrequency: 3.1,
    trend: 'growing',
    trendPercent: 4.7,
    color: '#8b5cf6',   // violet-500
    description: 'Recent buyers who haven\'t become regulars yet.',
    actionLabel: 'Convert to regulars',
  },
  {
    name: 'New Customers',
    slug: 'new-customers',
    count: 1_578,
    percentOfTotal: 9.0,
    revenueContribution: 4.2,
    avgLTV: 68,
    avgOrderFrequency: 1.0,
    trend: 'growing',
    trendPercent: 8.3,
    color: '#06b6d4',   // cyan-500
    description: 'Just arrived. Onboarding is critical - 44% cancel in 90 days.',
    actionLabel: 'Nail onboarding',
  },
  {
    name: 'At Risk',
    slug: 'at-risk',
    count: 2_632,
    percentOfTotal: 15.0,
    revenueContribution: 7.8,
    avgLTV: 324,
    avgOrderFrequency: 2.4,
    trend: 'shrinking',
    trendPercent: -1.8,
    color: '#f59e0b',   // amber-500
    description: 'Were loyal, now fading. Urgent intervention needed.',
    actionLabel: 'Intervention campaign',
  },
  {
    name: "Can't Lose Them",
    slug: 'cant-lose',
    count: 614,
    percentOfTotal: 3.5,
    revenueContribution: 3.1,
    avgLTV: 623,
    avgOrderFrequency: 1.2,
    trend: 'shrinking',
    trendPercent: -3.4,
    color: '#ef4444',   // red-500
    description: 'Best customers going dark. CEO-level alert.',
    actionLabel: 'Personal outreach',
  },
  {
    name: 'Hibernating',
    slug: 'hibernating',
    count: 2_105,
    percentOfTotal: 12.0,
    revenueContribution: 1.0,
    avgLTV: 95,
    avgOrderFrequency: 0.3,
    trend: 'stable',
    trendPercent: -0.5,
    color: '#94a3b8',   // slate-400
    description: 'Gone quiet. Low-cost reactivation candidates.',
    actionLabel: 'Low-cost reactivation',
  },
  {
    name: 'Lost',
    slug: 'lost',
    count: 1_706,
    percentOfTotal: 9.7,
    revenueContribution: 0.2,
    avgLTV: 42,
    avgOrderFrequency: 0,
    trend: 'stable',
    trendPercent: 0.1,
    color: '#64748b',   // slate-500
    description: 'Long gone. Exclude from active spend.',
    actionLabel: 'Exclude from targeting',
  },
];

export const totalCustomers = rfmSegments.reduce((sum, s) => sum + s.count, 0);

// Subscriber Health Distribution
export const subscriberHealthDistribution: HealthDistribution = {
  advocate: 1_350,    // 9%
  healthy: 9_450,     // 63%
  monitor: 2_700,     // 18%
  atRisk: 1_200,      // 8%
  critical: 300,       // 2%
};

export const totalSubscribers = 15_000;
export const avgHealthScore = 72;
export const healthScoreTrend = -1.3; // declining slightly

// Churn Risk Monitor
export const churnRiskBuckets: ChurnRiskBucket[] = [
  {
    period: '30 days',
    subscribersAtRisk: 312,
    revenueAtRisk: 14_040,
    topReasons: [
      { reason: 'Payment failure (involuntary)', count: 87 },
      { reason: 'Skipped 2+ consecutive orders', count: 94 },
      { reason: 'Declining AOV trend', count: 68 },
      { reason: 'Approaching 90-day cliff', count: 63 },
    ],
  },
  {
    period: '60 days',
    subscribersAtRisk: 548,
    revenueAtRisk: 24_660,
    topReasons: [
      { reason: 'Engagement score declining', count: 186 },
      { reason: 'Payment retry exhausted', count: 112 },
      { reason: 'Product variety shrinking', count: 94 },
      { reason: 'Support ticket opened', count: 156 },
    ],
  },
  {
    period: '90 days',
    subscribersAtRisk: 891,
    revenueAtRisk: 40_095,
    topReasons: [
      { reason: 'Below cohort avg retention', count: 312 },
      { reason: 'Discount-dependent buyer', count: 204 },
      { reason: 'Single-product subscriber', count: 187 },
      { reason: 'Low engagement composite', count: 188 },
    ],
  },
];

// Customer-Level Profitability Tiers
export const profitabilityTiers: ProfitabilityTier[] = [
  {
    tier: 'Highly Profitable',
    count: 4_389,
    percentOfTotal: 25.0,
    avgRevenue: 520,
    avgContributionMargin: 234,
    color: '#10b981',
  },
  {
    tier: 'Profitable',
    count: 7_020,
    percentOfTotal: 40.0,
    avgRevenue: 285,
    avgContributionMargin: 99,
    color: '#3b82f6',
  },
  {
    tier: 'Break-Even',
    count: 2_281,
    percentOfTotal: 13.0,
    avgRevenue: 148,
    avgContributionMargin: 8,
    color: '#f59e0b',
  },
  {
    tier: 'Unprofitable',
    count: 3_860,
    percentOfTotal: 22.0,
    avgRevenue: 92,
    avgContributionMargin: -27,
    color: '#ef4444',
  },
];

// Segment Migration (month-over-month)
export const segmentMigrations: SegmentMigration[] = [
  { from: 'Champions', to: 'At Risk', count: 34, direction: 'downgrade' },
  { from: 'Loyal', to: 'Champions', count: 89, direction: 'upgrade' },
  { from: 'Loyal', to: 'At Risk', count: 67, direction: 'downgrade' },
  { from: 'Potential Loyalists', to: 'Loyal', count: 142, direction: 'upgrade' },
  { from: 'Potential Loyalists', to: 'Hibernating', count: 78, direction: 'downgrade' },
  { from: 'New Customers', to: 'Potential Loyalists', count: 234, direction: 'upgrade' },
  { from: 'New Customers', to: 'Lost', count: 156, direction: 'downgrade' },
  { from: 'At Risk', to: 'Loyal', count: 41, direction: 'upgrade' },
  { from: 'At Risk', to: 'Hibernating', count: 124, direction: 'downgrade' },
  { from: "Can't Lose Them", to: 'Lost', count: 28, direction: 'downgrade' },
  { from: "Can't Lose Them", to: 'At Risk', count: 19, direction: 'downgrade' },
  { from: 'Hibernating', to: 'Potential Loyalists', count: 56, direction: 'upgrade' },
  { from: 'Hibernating', to: 'Lost', count: 189, direction: 'downgrade' },
];

// Cross-Channel Customer Overlap Estimates
export const crossChannelOverlap: CrossChannelOverlap[] = [
  { channel1: 'Shopify DTC', channel2: 'Amazon', overlapPercent: 14.2, overlapCustomers: 2_130 },
  { channel1: 'Shopify DTC', channel2: 'Walmart', overlapPercent: 3.8, overlapCustomers: 570 },
  { channel1: 'Amazon', channel2: 'Walmart', overlapPercent: 8.1, overlapCustomers: 1_215 },
  { channel1: 'Shopify DTC', channel2: 'Wholesale', overlapPercent: 1.2, overlapCustomers: 180 },
];

// Subscriber Risk Breakdown
export const subscriberRiskBreakdown = {
  payment: {
    failedPaymentRate: 3.2,
    retrySuccessRate: 68,
    involuntaryChurnRate: 1.0,
    status: 'warning' as const,
  },
  engagement: {
    skipRate: 12.4,
    avgDaysSinceOrder: 24,
    consecutiveSkippers: 847,
    status: 'warning' as const,
  },
  value: {
    decliningAOVPercent: 8.7,
    discountDependencyRate: 22.3,
    status: 'warning' as const,
  },
  tenure: {
    approaching90DayCliff: 412,
    approaching6MonthPlateau: 634,
    status: 'healthy' as const,
  },
};

// Churn Impact Model (for the financial framework)
export const churnImpactModel = {
  currentChurnRate: 6.8,
  targetChurnRate: 4.8,
  subscribersLostMonthly: 1_020,
  potentialSavings: {
    conservative: { churnReduction: 2, subscribersSaved: 300, annualRevenue: 162_000 },
    aggressive: { churnReduction: 3, subscribersSaved: 450, annualRevenue: 243_000 },
  },
  avgSubscriptionAOV: 45,
};
