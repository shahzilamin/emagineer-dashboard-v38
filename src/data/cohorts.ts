// Detailed cohort retention data for heatmap visualization
// Each cohort has monthly retention rates (% of original customers still active)

export interface CohortRetentionRow {
  cohort: string;        // e.g., "Jan 2024"
  cohortShort: string;   // e.g., "Jan"
  customers: number;     // Initial cohort size
  retention: (number | null)[];  // Monthly retention percentages [M0, M1, M2, ...]
  ltv: (number | null)[];        // Cumulative LTV at each month
}

export interface ChannelCohortQuality {
  channel: string;
  color: string;
  customers: number;
  cac: number;
  day30Retention: number;
  day60Retention: number;
  day90Retention: number;
  day180Retention: number;
  ltv90: number;
  ltv365: number | null;
  qualityScore: number;  // Composite score 0-100
  paybackDays: number;   // Days to recoup CAC
}

// Monthly retention rates - realistic DTC pattern:
// Month 0 = 100% (purchase), steep drop M1, gradual decline after
export const cohortRetentionData: CohortRetentionRow[] = [
  {
    cohort: 'Jan 2024', cohortShort: 'Jan',
    customers: 2450,
    retention: [100, 22.4, 16.8, 14.2, 12.5, 11.1, 10.2, 9.5, 8.9, 8.4, 8.0, 7.6, 7.3],
    ltv: [72, 87, 98, 106, 112, 118, 123, 128, 132, 136, 140, 143, 147],
  },
  {
    cohort: 'Feb 2024', cohortShort: 'Feb',
    customers: 2680,
    retention: [100, 21.1, 15.9, 13.4, 11.8, 10.5, 9.7, 9.0, 8.4, 7.9, 7.5, 7.1, null],
    ltv: [68, 82, 94, 102, 108, 114, 119, 124, 128, 132, 135, 139, null],
  },
  {
    cohort: 'Mar 2024', cohortShort: 'Mar',
    customers: 3120,
    retention: [100, 22.8, 17.1, 14.5, 12.8, 11.4, 10.5, 9.8, 9.2, 8.7, 8.3, null, null],
    ltv: [71, 86, 96, 104, 110, 116, 121, 126, 130, 134, 138, null, null],
  },
  {
    cohort: 'Apr 2024', cohortShort: 'Apr',
    customers: 2890,
    retention: [100, 24.6, 18.5, 15.8, 14.0, 12.5, 11.5, 10.8, 10.1, 9.6, null, null, null],
    ltv: [74, 91, 102, 112, 119, 126, 132, 137, 142, 146, null, null, null],
  },
  {
    cohort: 'May 2024', cohortShort: 'May',
    customers: 3250,
    retention: [100, 21.8, 16.4, 13.9, 12.2, 10.9, 10.0, 9.3, 8.7, null, null, null, null],
    ltv: [69, 84, 95, 103, 109, 115, 120, 125, 129, null, null, null, null],
  },
  {
    cohort: 'Jun 2024', cohortShort: 'Jun',
    customers: 2980,
    retention: [100, 23.5, 17.6, 14.9, 13.2, 11.8, 10.8, 10.1, null, null, null, null, null],
    ltv: [73, 89, 101, 110, 117, 123, 128, 133, null, null, null, null, null],
  },
  {
    cohort: 'Jul 2024', cohortShort: 'Jul',
    customers: 2750,
    retention: [100, 22.2, 16.7, 14.1, 12.4, 11.1, 10.2, null, null, null, null, null, null],
    ltv: [70, 85, 97, 105, 112, 118, 123, null, null, null, null, null, null],
  },
  {
    cohort: 'Aug 2024', cohortShort: 'Aug',
    customers: 3100,
    retention: [100, 25.1, 18.9, 16.1, 14.3, 12.8, null, null, null, null, null, null, null],
    ltv: [75, 92, 104, 114, 121, 128, null, null, null, null, null, null, null],
  },
  {
    cohort: 'Sep 2024', cohortShort: 'Sep',
    customers: 3420,
    retention: [100, 23.8, 17.9, 15.2, 13.5, null, null, null, null, null, null, null, null],
    ltv: [72, 88, 99, 108, 115, null, null, null, null, null, null, null, null],
  },
  {
    cohort: 'Oct 2024', cohortShort: 'Oct',
    customers: 3680,
    retention: [100, 26.2, 19.7, 16.8, null, null, null, null, null, null, null, null, null],
    ltv: [76, 94, 105, 116, null, null, null, null, null, null, null, null, null],
  },
  {
    cohort: 'Nov 2024', cohortShort: 'Nov',
    customers: 4250,
    retention: [100, 25.4, 19.1, null, null, null, null, null, null, null, null, null, null],
    ltv: [78, 96, 108, null, null, null, null, null, null, null, null, null, null],
  },
  {
    cohort: 'Dec 2024', cohortShort: 'Dec',
    customers: 4890,
    retention: [100, 27.3, null, null, null, null, null, null, null, null, null, null, null],
    ltv: [82, 102, null, null, null, null, null, null, null, null, null, null, null],
  },
];

// Channel-level acquisition quality
export const channelCohortQuality: ChannelCohortQuality[] = [
  {
    channel: 'Email (Klaviyo)',
    color: '#8b5cf6',
    customers: 1200,
    cac: 2.33,
    day30Retention: 38.5,
    day60Retention: 28.9,
    day90Retention: 24.1,
    day180Retention: 18.5,
    ltv90: 168,
    ltv365: 285,
    qualityScore: 95,
    paybackDays: 1,
  },
  {
    channel: 'Direct',
    color: '#22c55e',
    customers: 2900,
    cac: 0,
    day30Retention: 32.1,
    day60Retention: 24.2,
    day90Retention: 20.3,
    day180Retention: 15.8,
    ltv90: 148,
    ltv365: 242,
    qualityScore: 92,
    paybackDays: 0,
  },
  {
    channel: 'Organic Search',
    color: '#06b6d4',
    customers: 2300,
    cac: 0,
    day30Retention: 28.4,
    day60Retention: 21.1,
    day90Retention: 17.6,
    day180Retention: 13.2,
    ltv90: 132,
    ltv365: 215,
    qualityScore: 88,
    paybackDays: 0,
  },
  {
    channel: 'Meta Ads',
    color: '#3b82f6',
    customers: 1875,
    cac: 22.67,
    day30Retention: 19.2,
    day60Retention: 13.8,
    day90Retention: 11.2,
    day180Retention: 8.1,
    ltv90: 98,
    ltv365: 156,
    qualityScore: 62,
    paybackDays: 42,
  },
  {
    channel: 'Google Ads',
    color: '#f59e0b',
    customers: 1350,
    cac: 23.11,
    day30Retention: 21.6,
    day60Retention: 15.9,
    day90Retention: 13.1,
    day180Retention: 9.8,
    ltv90: 112,
    ltv365: 178,
    qualityScore: 68,
    paybackDays: 38,
  },
  {
    channel: 'Referral',
    color: '#ec4899',
    customers: 680,
    cac: 6.62,
    day30Retention: 35.8,
    day60Retention: 27.1,
    day90Retention: 22.5,
    day180Retention: 17.2,
    ltv90: 158,
    ltv365: 262,
    qualityScore: 90,
    paybackDays: 8,
  },
];

// Summary metrics
export const cohortSummaryMetrics = {
  avgMonthlyRetentionRate: 23.7,    // Average M1 retention across cohorts
  retentionTrend: 'improving' as const,  // improving | stable | declining
  retentionTrendPct: 2.8,          // % improvement in M1 retention (recent vs early)
  bestCohort: 'Dec 2024',
  worstCohort: 'Feb 2024',
  avgPaybackPeriod: 38,            // Days to recoup blended CAC
  ltv12Estimate: 185,              // Estimated 12-month LTV (blended)
  retentionCurveType: 'healthy-dtc' as const,  // Curve flattens after month 4-5
};
