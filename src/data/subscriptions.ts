// Subscription Health Data for WellBefore
// 15,000+ monthly subscribers - the most valuable revenue stream

export interface SubscriptionMetrics {
  mrr: number;
  mrrGrowthRate: number;
  mrrPrevious: number;
  totalSubscribers: number;
  newSubscribers: number;
  churnedSubscribers: number;
  netSubscriberGrowth: number;
  monthlyChurnRate: number;
  previousChurnRate: number;
  subscriberLtv: number;
  oneTimeLtv: number;
  ltvMultiplier: number;
  avgSubscriberAov: number;
  avgOneTimeAov: number;
  revenueShare: number; // subscription revenue as % of total
  skipRate: number; // leading churn indicator
  previousSkipRate: number; // last month's skip rate for trend
  avgSubscriberLifespan: number; // months
  paybackPeriod: number; // months
  subscriberCac: number;
  monthlyContributionMargin: number;
}

export interface SubscriptionCohort {
  month: string;
  started: number;
  month1: number | null;
  month2: number | null;
  month3: number | null;
  month4: number | null;
  month5: number | null;
  month6: number | null;
  month7: number | null;
  month8: number | null;
  month9: number | null;
  month10: number | null;
  month11: number | null;
  month12: number | null;
}

export interface ChurnReason {
  reason: string;
  percentage: number;
  count: number;
  trend: 'up' | 'down' | 'flat';
}

export interface MrrTrendPoint {
  month: string;
  mrr: number;
  subscribers: number;
  churnRate: number;
  newSubs: number;
}

// Core subscription metrics
export const subscriptionMetrics: SubscriptionMetrics = {
  mrr: 487500, // $32.50 avg × 15,000 subscribers
  mrrGrowthRate: 4.2,
  mrrPrevious: 467850,
  totalSubscribers: 15000,
  newSubscribers: 1240,
  churnedSubscribers: 890,
  netSubscriberGrowth: 350,
  monthlyChurnRate: 5.93, // 890/15000 - typical DTC range
  previousChurnRate: 6.21,
  subscriberLtv: 585, // 18 month avg lifespan × $32.50
  oneTimeLtv: 142, // typical one-time buyer
  ltvMultiplier: 4.12, // subscribers are 4.12x more valuable
  avgSubscriberAov: 32.50,
  avgOneTimeAov: 28.40,
  revenueShare: 34.2, // 34.2% of total revenue is subscription
  skipRate: 8.7, // 8.7% of subscribers skipped last order - leading indicator
  previousSkipRate: 7.9, // last month's skip rate for trend comparison
  avgSubscriberLifespan: 18, // months
  paybackPeriod: 1.8, // months to recoup CAC
  subscriberCac: 58,
  monthlyContributionMargin: 18.20, // per subscriber after COGS + fulfillment
};

// MRR trend over 12 months
export const mrrTrend: MrrTrendPoint[] = [
  { month: 'Feb 25', mrr: 352000, subscribers: 10820, churnRate: 7.8, newSubs: 780 },
  { month: 'Mar 25', mrr: 365400, subscribers: 11240, churnRate: 7.5, newSubs: 850 },
  { month: 'Apr 25', mrr: 378200, subscribers: 11630, churnRate: 7.2, newSubs: 820 },
  { month: 'May 25', mrr: 391000, subscribers: 12030, churnRate: 7.0, newSubs: 890 },
  { month: 'Jun 25', mrr: 401500, subscribers: 12350, churnRate: 6.8, newSubs: 920 },
  { month: 'Jul 25', mrr: 413800, subscribers: 12730, churnRate: 6.6, newSubs: 960 },
  { month: 'Aug 25', mrr: 425600, subscribers: 13090, churnRate: 6.5, newSubs: 980 },
  { month: 'Sep 25', mrr: 436900, subscribers: 13440, churnRate: 6.4, newSubs: 1020 },
  { month: 'Oct 25', mrr: 449200, subscribers: 13820, churnRate: 6.3, newSubs: 1060 },
  { month: 'Nov 25', mrr: 459800, subscribers: 14150, churnRate: 6.2, newSubs: 1080 },
  { month: 'Dec 25', mrr: 467850, subscribers: 14390, churnRate: 6.2, newSubs: 1120 },
  { month: 'Jan 26', mrr: 487500, subscribers: 15000, churnRate: 5.9, newSubs: 1240 },
];

// Subscription retention cohorts (% retained each month)
export const subscriptionCohorts: SubscriptionCohort[] = [
  { month: 'Jan 25', started: 780, month1: 82, month2: 71, month3: 62, month4: 57, month5: 53, month6: 50, month7: 48, month8: 46, month9: 45, month10: 44, month11: 43, month12: 42 },
  { month: 'Feb 25', started: 850, month1: 83, month2: 72, month3: 63, month4: 58, month5: 54, month6: 51, month7: 49, month8: 47, month9: 46, month10: 45, month11: 44, month12: null },
  { month: 'Mar 25', started: 820, month1: 81, month2: 70, month3: 61, month4: 56, month5: 52, month6: 49, month7: 47, month8: 46, month9: 45, month10: 44, month11: null, month12: null },
  { month: 'Apr 25', started: 890, month1: 84, month2: 73, month3: 64, month4: 59, month5: 55, month6: 52, month7: 50, month8: 48, month9: 47, month10: null, month11: null, month12: null },
  { month: 'May 25', started: 920, month1: 85, month2: 74, month3: 65, month4: 60, month5: 56, month6: 53, month7: 51, month8: 49, month9: null, month10: null, month11: null, month12: null },
  { month: 'Jun 25', started: 960, month1: 84, month2: 73, month3: 64, month4: 59, month5: 55, month6: 52, month7: 50, month8: null, month9: null, month10: null, month11: null, month12: null },
  { month: 'Jul 25', started: 980, month1: 86, month2: 75, month3: 66, month4: 61, month5: 57, month6: 54, month7: null, month8: null, month9: null, month10: null, month11: null, month12: null },
  { month: 'Aug 25', started: 1020, month1: 85, month2: 74, month3: 65, month4: 60, month5: 56, month6: null, month7: null, month8: null, month9: null, month10: null, month11: null, month12: null },
  { month: 'Sep 25', started: 1060, month1: 86, month2: 76, month3: 67, month4: 62, month5: null, month6: null, month7: null, month8: null, month9: null, month10: null, month11: null, month12: null },
  { month: 'Oct 25', started: 1080, month1: 87, month2: 77, month3: 68, month4: null, month5: null, month6: null, month7: null, month8: null, month9: null, month10: null, month11: null, month12: null },
  { month: 'Nov 25', started: 1120, month1: 88, month2: 78, month3: null, month4: null, month5: null, month6: null, month7: null, month8: null, month9: null, month10: null, month11: null, month12: null },
  { month: 'Dec 25', started: 1240, month1: 89, month2: null, month3: null, month4: null, month5: null, month6: null, month7: null, month8: null, month9: null, month10: null, month11: null, month12: null },
];

// Churn reasons - why subscribers cancel
export const churnReasons: ChurnReason[] = [
  { reason: 'Too expensive', percentage: 28, count: 249, trend: 'up' },
  { reason: 'No longer needed', percentage: 22, count: 196, trend: 'flat' },
  { reason: 'Switched to competitor', percentage: 18, count: 160, trend: 'up' },
  { reason: 'Product quality issues', percentage: 12, count: 107, trend: 'down' },
  { reason: 'Delivery issues', percentage: 9, count: 80, trend: 'flat' },
  { reason: 'Over-stocked', percentage: 7, count: 62, trend: 'flat' },
  { reason: 'Other', percentage: 4, count: 36, trend: 'flat' },
];

// Subscription plan distribution
export const planDistribution = [
  { plan: 'Monthly', subscribers: 6750, percentage: 45, churnRate: 7.8, avgAov: 29.90 },
  { plan: 'Bi-monthly', subscribers: 4500, percentage: 30, churnRate: 5.2, avgAov: 34.80 },
  { plan: 'Quarterly', subscribers: 2700, percentage: 18, churnRate: 3.1, avgAov: 38.50 },
  { plan: 'Annual', subscribers: 1050, percentage: 7, churnRate: 1.2, avgAov: 42.20 },
];

// Top subscription products
export const topSubscriptionProducts = [
  { name: 'KN95 Masks (50-pack)', subscribers: 4200, mrr: 121800, churnRate: 5.1 },
  { name: 'N95 Respirators (20-pack)', subscribers: 3600, mrr: 136800, churnRate: 4.8 },
  { name: 'Hand Sanitizer Bundle', subscribers: 2800, mrr: 53200, churnRate: 7.2 },
  { name: 'Glove Subscription (L)', subscribers: 2100, mrr: 75600, churnRate: 6.5 },
  { name: 'PPE Essentials Kit', subscribers: 1500, mrr: 67500, churnRate: 5.8 },
  { name: 'Other Products', subscribers: 800, mrr: 32600, churnRate: 8.4 },
];

// Calculated summary stats
export const subscriptionSummary = {
  annualRecurringRevenue: subscriptionMetrics.mrr * 12,
  churnImpactMonthly: subscriptionMetrics.churnedSubscribers * subscriptionMetrics.avgSubscriberAov,
  revenueAtRisk: Math.round(subscriptionMetrics.totalSubscribers * (subscriptionMetrics.skipRate / 100) * subscriptionMetrics.avgSubscriberAov * 3), // 3 months of at-risk revenue from skippers
  churnReduction5pctImpact: Math.round(subscriptionMetrics.mrr * 12 * 0.25), // 5% churn reduction = ~25% profit impact
  subscriberLifetimeValue: subscriptionMetrics.subscriberLtv,
  first90DayChurnRate: 38, // 38% of all cancellations happen in first 90 days (industry: 44%)
};
