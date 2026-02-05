// Fulfillment & Operations Intelligence Data Layer (Nova Brief 7 - Pillar 7)
// WellBefore operates both DTC fulfillment AND 3PL for external clients

export interface FulfillmentHealthComponent {
  label: string;
  score: number;
  weight: number;
  benchmark: number;
  status: 'green' | 'yellow' | 'red';
  detail: string;
}

export interface FulfillmentHealthScore {
  composite: number;
  status: 'green' | 'yellow' | 'red';
  components: FulfillmentHealthComponent[];
  trend: number; // MoM change
}

export interface CostPerOrderBreakdown {
  category: string;
  amount: number;
  prevAmount: number;
  percentOfRevenue: number;
  benchmark: string;
  color: string;
}

export interface ThreePLClient {
  name: string;
  monthlyRevenue: number;
  monthlyCost: number;
  margin: number;
  marginPercent: number;
  ordersPerMonth: number;
  skuCount: number;
  storageUnits: number;
  status: 'profitable' | 'marginal' | 'unprofitable';
  trend: 'up' | 'down' | 'stable';
}

export interface ThreePLSummary {
  totalRevenue: number;
  totalCost: number;
  netMargin: number;
  netMarginPercent: number;
  utilizationPercent: number;
  clients: ThreePLClient[];
}

export interface ReturnMetric {
  category: string;
  returnRate: number;
  costPerReturn: number;
  monthlyReturns: number;
  monthlyCost: number;
  topReason: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface ReturnsSummary {
  overallRate: number;
  prevRate: number;
  benchmark: number;
  totalMonthlyReturns: number;
  totalMonthlyCost: number;
  unsellablePercent: number;
  byCategory: ReturnMetric[];
  byReason: { reason: string; percent: number; fixable: boolean }[];
}

export interface LaborMetric {
  shift: string;
  picksPerHour: number;
  costPerOrder: number;
  utilizationRate: number;
  headcount: number;
  benchmark: number;
}

export interface OrderTimelinePoint {
  hour: string;
  ordersReceived: number;
  ordersShipped: number;
  pendingQueue: number;
}

export interface FulfillmentDecision {
  id: string;
  title: string;
  urgency: 'now' | 'today' | 'this-week';
  confidence: number;
  upside: string;
  downside: string;
  recommendation: string;
}

// ─── Fulfillment Health Score ─────────────────────────────────

export const fulfillmentHealthScore: FulfillmentHealthScore = {
  composite: 76,
  status: 'yellow',
  trend: -2.3,
  components: [
    {
      label: 'Speed',
      score: 82,
      weight: 25,
      benchmark: 87,
      status: 'yellow',
      detail: '82% same-day fulfillment vs 87% benchmark',
    },
    {
      label: 'Accuracy',
      score: 96,
      weight: 25,
      benchmark: 98,
      status: 'green',
      detail: '96.8% perfect order rate vs 98% benchmark',
    },
    {
      label: 'Cost',
      score: 68,
      weight: 25,
      benchmark: 75,
      status: 'yellow',
      detail: '$10.85 all-in cost/order vs $8.50 benchmark',
    },
    {
      label: 'Returns',
      score: 58,
      weight: 25,
      benchmark: 70,
      status: 'red',
      detail: '11.2% return rate vs 8% PPE benchmark',
    },
  ],
};

// ─── Cost Per Order Waterfall ─────────────────────────────────

export const costPerOrderWaterfall: CostPerOrderBreakdown[] = [
  { category: 'Revenue', amount: 38.50, prevAmount: 37.20, percentOfRevenue: 100, benchmark: '', color: '#3b82f6' },
  { category: 'COGS', amount: -14.20, prevAmount: -13.40, percentOfRevenue: 36.9, benchmark: '35%', color: '#ef4444' },
  { category: 'Pick & Pack', amount: -2.95, prevAmount: -2.86, percentOfRevenue: 7.7, benchmark: '$2.86', color: '#f97316' },
  { category: 'Shipping (Outbound)', amount: -5.85, prevAmount: -5.50, percentOfRevenue: 15.2, benchmark: '$5.50', color: '#f97316' },
  { category: 'Packaging', amount: -0.82, prevAmount: -0.75, percentOfRevenue: 2.1, benchmark: '$0.75', color: '#f97316' },
  { category: 'Payment Processing', amount: -1.42, prevAmount: -1.38, percentOfRevenue: 3.7, benchmark: '2.9%+$0.30', color: '#a855f7' },
  { category: 'Returns Allocation', amount: -0.95, prevAmount: -0.72, percentOfRevenue: 2.5, benchmark: '$0.85', color: '#ef4444' },
  { category: 'Warehouse Labor', amount: -1.35, prevAmount: -1.20, percentOfRevenue: 3.5, benchmark: '$1.20', color: '#f97316' },
  { category: 'Contribution Margin', amount: 10.96, prevAmount: 11.39, percentOfRevenue: 28.5, benchmark: '33%', color: '#10b981' },
];

// The key insight: CEO sees 42.5% "gross margin" but actual contribution is 28.5%
export const fulfillmentCostSummary = {
  reportedGrossMargin: 42.5,
  actualContributionMargin: 28.5,
  gapPerOrder: 5.39, // $5.39 in fulfillment costs between gross and contribution
  gapPerMonth: 26950, // 5,000 orders × $5.39
  gapPerYear: 323400,
  avgOrderValue: 38.50,
  totalFulfillmentCost: 13.34, // all fulfillment line items combined
  fulfillmentAsPercentOfRevenue: 34.6,
};

// ─── 3PL Business P&L ────────────────────────────────────────

export const threePLSummary: ThreePLSummary = {
  totalRevenue: 47800,
  totalCost: 38900,
  netMargin: 8900,
  netMarginPercent: 18.6,
  utilizationPercent: 73,
  clients: [
    {
      name: 'GourmetSnacks Co',
      monthlyRevenue: 18500,
      monthlyCost: 14200,
      margin: 4300,
      marginPercent: 23.2,
      ordersPerMonth: 2100,
      skuCount: 45,
      storageUnits: 120,
      status: 'profitable',
      trend: 'up',
    },
    {
      name: 'HealthyHarvest',
      monthlyRevenue: 12800,
      monthlyCost: 10400,
      margin: 2400,
      marginPercent: 18.8,
      ordersPerMonth: 1450,
      skuCount: 28,
      storageUnits: 85,
      status: 'profitable',
      trend: 'stable',
    },
    {
      name: 'PureWellness Labs',
      monthlyRevenue: 9200,
      monthlyCost: 8100,
      margin: 1100,
      marginPercent: 12.0,
      ordersPerMonth: 980,
      skuCount: 62,
      storageUnits: 95,
      status: 'marginal',
      trend: 'down',
    },
    {
      name: 'EcoClean Supplies',
      monthlyRevenue: 7300,
      monthlyCost: 6200,
      margin: 1100,
      marginPercent: 15.1,
      ordersPerMonth: 820,
      skuCount: 18,
      storageUnits: 45,
      status: 'profitable',
      trend: 'up',
    },
  ],
};

// ─── Returns Analytics ────────────────────────────────────────

export const returnsSummary: ReturnsSummary = {
  overallRate: 11.2,
  prevRate: 10.8,
  benchmark: 8.0,
  totalMonthlyReturns: 560,
  totalMonthlyCost: 4760,
  unsellablePercent: 22,
  byCategory: [
    { category: 'Masks (N95/KN95)', returnRate: 6.8, costPerReturn: 7.50, monthlyReturns: 142, monthlyCost: 1065, topReason: 'Sizing/Fit', trend: 'stable', color: '#3b82f6' },
    { category: 'Gloves (Nitrile)', returnRate: 4.2, costPerReturn: 6.80, monthlyReturns: 84, monthlyCost: 571, topReason: 'Wrong Size', trend: 'down', color: '#10b981' },
    { category: 'Sanitizer', returnRate: 3.1, costPerReturn: 9.20, monthlyReturns: 47, monthlyCost: 432, topReason: 'Damaged', trend: 'stable', color: '#f59e0b' },
    { category: 'Test Kits', returnRate: 18.5, costPerReturn: 11.40, monthlyReturns: 185, monthlyCost: 2109, topReason: 'Expired on Arrival', trend: 'up', color: '#ef4444' },
    { category: 'First Aid', returnRate: 8.9, costPerReturn: 8.10, monthlyReturns: 62, monthlyCost: 502, topReason: 'Not as Described', trend: 'stable', color: '#8b5cf6' },
    { category: 'Thermometers', returnRate: 12.4, costPerReturn: 12.50, monthlyReturns: 40, monthlyCost: 500, topReason: 'Defective', trend: 'down', color: '#ec4899' },
  ],
  byReason: [
    { reason: 'Expired on Arrival', percent: 28.4, fixable: true },
    { reason: 'Wrong Size/Fit', percent: 22.1, fixable: true },
    { reason: 'Damaged in Transit', percent: 18.6, fixable: true },
    { reason: 'Not as Described', percent: 14.2, fixable: true },
    { reason: 'Changed Mind', percent: 9.8, fixable: false },
    { reason: 'Defective', percent: 6.9, fixable: true },
  ],
};

// ─── Labor Productivity ───────────────────────────────────────

export const laborMetrics: LaborMetric[] = [
  { shift: 'Morning (6AM-2PM)', picksPerHour: 165, costPerOrder: 1.15, utilizationRate: 88, headcount: 12, benchmark: 200 },
  { shift: 'Afternoon (2PM-10PM)', picksPerHour: 148, costPerOrder: 1.28, utilizationRate: 82, headcount: 10, benchmark: 200 },
  { shift: 'Night (10PM-6AM)', picksPerHour: 122, costPerOrder: 1.56, utilizationRate: 68, headcount: 6, benchmark: 200 },
];

export const laborSummary = {
  avgPicksPerHour: 152,
  benchmark: 200,
  topPerformerBenchmark: 250,
  laborCostPercent: 28.2,
  monthlyLaborCost: 42600,
  potentialSavingsAtBenchmark: 7200, // per month if hitting 200 picks/hour
};

// ─── Order Timeline ───────────────────────────────────────────

export const orderTimeline: OrderTimelinePoint[] = [
  { hour: '6AM', ordersReceived: 45, ordersShipped: 0, pendingQueue: 45 },
  { hour: '7AM', ordersReceived: 62, ordersShipped: 28, pendingQueue: 79 },
  { hour: '8AM', ordersReceived: 85, ordersShipped: 65, pendingQueue: 99 },
  { hour: '9AM', ordersReceived: 110, ordersShipped: 95, pendingQueue: 114 },
  { hour: '10AM', ordersReceived: 98, ordersShipped: 120, pendingQueue: 92 },
  { hour: '11AM', ordersReceived: 75, ordersShipped: 110, pendingQueue: 57 },
  { hour: '12PM', ordersReceived: 68, ordersShipped: 85, pendingQueue: 40 },
  { hour: '1PM', ordersReceived: 72, ordersShipped: 90, pendingQueue: 22 },
  { hour: '2PM', ordersReceived: 88, ordersShipped: 78, pendingQueue: 32 },
  { hour: '3PM', ordersReceived: 95, ordersShipped: 92, pendingQueue: 35 },
  { hour: '4PM', ordersReceived: 82, ordersShipped: 98, pendingQueue: 19 },
  { hour: '5PM', ordersReceived: 55, ordersShipped: 65, pendingQueue: 9 },
  { hour: '6PM', ordersReceived: 38, ordersShipped: 42, pendingQueue: 5 },
];

// ─── Quick Stats for Morning Brief ───────────────────────────

export const fulfillmentQuickStats = {
  healthScore: fulfillmentHealthScore.composite,
  previousHealthScore: 71, // Last month's composite score
  twoMonthAgoHealthScore: 68, // Two months ago score for 3-month trajectory
  healthStatus: fulfillmentHealthScore.status,
  costPerOrder: 10.85,
  costPerOrderBenchmark: 8.50,
  sameDayRate: 82,
  sameDayBenchmark: 87,
  returnRate: returnsSummary.overallRate,
  returnBenchmark: returnsSummary.benchmark,
  threePLMargin: threePLSummary.netMarginPercent,
  threePLRevenue: threePLSummary.totalRevenue,
  hiddenCostGap: fulfillmentCostSummary.gapPerMonth,
};

// ─── Decision Hub Integration (matches Decision interface from decisions.ts) ─────

export const fulfillmentDecisionForHub = {
  id: 'fulfillment-returns-crisis',
  question: 'Should you audit test kit suppliers to fix the 18.5% return rate?',
  context: 'Test Kits have 2.3x the PPE return benchmark. Top reason: "Expired on Arrival" (28.4% of all returns). Monthly cost: $2,109 in test kit return processing alone. 90.2% of all return reasons are fixable.',
  category: 'operations' as const,
  urgency: 'today' as const,
  confidence: 88,
  impact: {
    upside: 'Fix top return category: save $2,100/mo. Reducing overall rate from 11.2% to 8% benchmark saves $4,760 → $3,400/mo = $1,360/mo savings + customer satisfaction.',
    downside: 'Supplier switching takes 4-6 weeks. Short-term test kit availability may drop.',
  },
  recommendation: 'Audit incoming test kit batches. Reject stock with <6 months shelf life. Evaluate backup suppliers with longer expiration dates.',
  recommendedAction: 'Schedule supplier audit this week',
  supportingMetrics: [
    { label: 'Test Kit Return Rate', value: '18.5%', trend: 'up' as const, good: false },
    { label: 'PPE Benchmark', value: '8.0%', trend: 'flat' as const, good: true },
    { label: 'Monthly Return Cost', value: '$4,760', trend: 'up' as const, good: false },
    { label: 'Fixable Returns', value: '90.2%', trend: 'flat' as const, good: true },
  ],
  options: [
    { label: 'Audit & reject short-shelf-life stock', impact: 'Save ~$600/mo on test kits immediately', risk: 'low' as const },
    { label: 'Switch test kit supplier entirely', impact: 'Save ~$2,100/mo but 4-6 week transition', risk: 'medium' as const },
    { label: 'Add expiration check at receiving', impact: 'Prevent future expired stock, modest cost', risk: 'low' as const },
  ],
  owner: 'Operations',
};

export const fulfillmentDecisions: FulfillmentDecision[] = [
  {
    id: 'return-test-kits',
    title: 'Test Kit returns at 18.5% — investigate expiration dates',
    urgency: 'now',
    confidence: 88,
    upside: 'Fix top return category: save $2,100/mo in return costs',
    downside: 'Supplier relationship tension if pushing for fresher stock',
    recommendation: 'Audit incoming test kit batches for expiration dates. Reject any with <6 months remaining. Consider switching to supplier with longer shelf life.',
  },
  {
    id: 'labor-night-shift',
    title: 'Night shift at 122 picks/hr vs 200 benchmark — 39% below target',
    urgency: 'this-week',
    confidence: 72,
    upside: 'Closing gap saves $2,400/mo in labor costs',
    downside: 'Night shift premium makes per-pick cost higher regardless',
    recommendation: 'Evaluate night shift necessity. If volume doesn\'t justify it, consolidate into morning/afternoon. If needed, invest in pick-to-light or voice-pick systems.',
  },
  {
    id: '3pl-purewellness',
    title: 'PureWellness Labs margin declining (12%) with 62 SKUs — complexity tax',
    urgency: 'today',
    confidence: 78,
    upside: 'Renegotiate: add $800/mo in margin (raise to 18%+)',
    downside: 'Client may leave for cheaper 3PL',
    recommendation: 'Highest SKU count (62) of any client but lowest margin. Charge complexity fee or require SKU rationalization. 62 SKUs for $9.2K revenue = $148/SKU/month — below cost of complexity.',
  },
];
