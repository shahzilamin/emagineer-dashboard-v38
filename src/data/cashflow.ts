// Cash Flow Intelligence & Working Capital - Nova Pillar 9
// "Pillars 1-8 answer 'is the business healthy?' Pillar 9 answers 'can the business survive?'"

export interface WeeklyCashFlow {
  week: number;
  label: string;
  startingBalance: number;
  cashIn: {
    dtcPayout: number;
    amazonPayout: number;
    walmartPayout: number;
    tiktokPayout: number;
    subscriptionRevenue: number;
    threePLRevenue: number;
    other: number;
    total: number;
  };
  cashOut: {
    inventoryPO: number;
    adSpend: number;
    payroll: number;
    fulfillment: number;
    shipping: number;
    overhead: number;
    platformFees: number;
    total: number;
  };
  netFlow: number;
  endingBalance: number;
  isProjected: boolean;
}

export interface CashScenario {
  label: string;
  multiplier: number;
  color: string;
  weeks: { week: number; endingBalance: number }[];
}

export interface CashInTransitChannel {
  channel: string;
  shortName: string;
  pendingAmount: number;
  avgPayoutDays: number;
  nextPayoutDate: string;
  nextPayoutAmount: number;
  reserveHeld: number;
  color: string;
}

export interface CashWaterfallItem {
  label: string;
  value: number;
  type: 'start' | 'inflow' | 'outflow' | 'end';
  color: string;
}

export interface CashHealthComponent {
  name: string;
  score: number;
  weight: number;
  status: 'green' | 'yellow' | 'red';
  detail: string;
}

export interface SupplierTerms {
  supplier: string;
  currentTerms: string;
  currentDPO: number;
  industryStandardDPO: number;
  monthlySpend: number;
  opportunityAmount: number;
  flag: 'improvement-available' | 'at-standard' | 'above-standard';
}

// ─── Cash Runway & Working Capital ───
export const cashRunway = {
  currentCash: 187500,
  weeklyNetBurn: 8750, // average net cash outflow per week
  runwayWeeks: 21.4, // 187500 / 8750
  status: 'green' as const, // 12+ = green, 6-12 = yellow, <6 = red
  trend: 'declining' as const, // was 24 weeks last month
  previousRunwayWeeks: 24.1,
  twoMonthAgoRunwayWeeks: 28.5, // Two months ago for 3-month trajectory
};

export const workingCapital = {
  currentAssets: 412000, // cash + inventory + receivables + in-transit
  currentLiabilities: 238000, // payables + accrued expenses + short-term debt
  ratio: 1.73, // 412000 / 238000
  status: 'adequate' as const, // 2.0+ = healthy, 1.5-2.0 = adequate, 1.2-1.5 = tight, <1.2 = danger
  previousRatio: 1.82,
  trend: 'declining' as const,
  breakdown: {
    cash: 187500,
    inventory: 142000,
    receivables: 38500,
    inTransit: 44000,
    payables: 156000,
    accruedExpenses: 52000,
    shortTermDebt: 30000,
  },
};

// ─── Cash Conversion Cycle (enhanced from V22) ───
export const cashConversionCycle = {
  current: {
    dio: 49, // Days Inventory Outstanding
    dso: 22, // Days Sales Outstanding (blended channels)
    dpo: 26, // Days Payable Outstanding
    ccc: 45, // = DIO + DSO - DPO
  },
  target: {
    dio: 35,
    dso: 18,
    dpo: 45,
    ccc: 8,
  },
  previous: {
    dio: 47,
    dso: 21,
    dpo: 25,
    ccc: 43,
  },
  annualCOGS: 840000,
  cashLockedInCycle: 103000, // at current CCC
  cashLockedAtTarget: 18400,
  potentialFreed: 84600, // 103000 - 18400
  trend: [
    { week: 'W1', ccc: 48 },
    { week: 'W2', ccc: 47 },
    { week: 'W3', ccc: 46 },
    { week: 'W4', ccc: 45 },
    { week: 'W5', ccc: 46 },
    { week: 'W6', ccc: 44 },
    { week: 'W7', ccc: 45 },
    { week: 'W8', ccc: 43 },
    { week: 'W9', ccc: 45 },
    { week: 'W10', ccc: 44 },
    { week: 'W11', ccc: 45 },
    { week: 'W12', ccc: 45 },
  ],
};

// ─── 13-Week Rolling Cash Flow Forecast ───
const generateWeeklyForecast = (): WeeklyCashFlow[] => {
  const weeks: WeeklyCashFlow[] = [];
  let balance = 187500;

  const weekData = [
    // Actuals (weeks 1-4)
    { inv: 17500, ad: 12500, payroll: 0, ful: 3750, ship: 3000, over: 0, platFee: 1200, dtc: 27000, amz: 0, wmt: 0, tt: 0, sub: 4800, tpl: 2400, other: 1000, proj: false },
    { inv: 17500, ad: 12500, payroll: 12500, ful: 3750, ship: 3000, over: 0, platFee: 1200, dtc: 27000, amz: 10500, wmt: 3500, tt: 1200, sub: 4800, tpl: 2400, other: 800, proj: false },
    { inv: 0, ad: 12500, payroll: 0, ful: 3750, ship: 3000, over: 2000, platFee: 1200, dtc: 27000, amz: 10500, wmt: 3500, tt: 1200, sub: 4800, tpl: 2400, other: 900, proj: false },
    { inv: 0, ad: 12500, payroll: 12500, ful: 3750, ship: 3000, over: 0, platFee: 1200, dtc: 27000, amz: 10500, wmt: 3500, tt: 1200, sub: 4800, tpl: 2400, other: 1100, proj: false },
    // Projections (weeks 5-13)
    { inv: 22000, ad: 13000, payroll: 0, ful: 3800, ship: 3100, over: 0, platFee: 1250, dtc: 27500, amz: 0, wmt: 0, tt: 0, sub: 4900, tpl: 2500, other: 1000, proj: true },
    { inv: 22000, ad: 13000, payroll: 12500, ful: 3800, ship: 3100, over: 0, platFee: 1250, dtc: 27500, amz: 11000, wmt: 3600, tt: 1300, sub: 4900, tpl: 2500, other: 800, proj: true },
    { inv: 0, ad: 13000, payroll: 0, ful: 3800, ship: 3100, over: 2100, platFee: 1250, dtc: 27500, amz: 11000, wmt: 3600, tt: 1300, sub: 4900, tpl: 2500, other: 900, proj: true },
    { inv: 0, ad: 13000, payroll: 12500, ful: 3800, ship: 3100, over: 0, platFee: 1250, dtc: 27500, amz: 11000, wmt: 3600, tt: 1300, sub: 4900, tpl: 2500, other: 1100, proj: true },
    { inv: 25000, ad: 13500, payroll: 0, ful: 3900, ship: 3200, over: 0, platFee: 1300, dtc: 28000, amz: 0, wmt: 0, tt: 0, sub: 5000, tpl: 2600, other: 1000, proj: true },
    { inv: 25000, ad: 13500, payroll: 12500, ful: 3900, ship: 3200, over: 0, platFee: 1300, dtc: 28000, amz: 11500, wmt: 3700, tt: 1400, sub: 5000, tpl: 2600, other: 800, proj: true },
    { inv: 0, ad: 13500, payroll: 0, ful: 3900, ship: 3200, over: 2200, platFee: 1300, dtc: 28000, amz: 11500, wmt: 3700, tt: 1400, sub: 5000, tpl: 2600, other: 900, proj: true },
    { inv: 0, ad: 13500, payroll: 12500, ful: 3900, ship: 3200, over: 0, platFee: 1300, dtc: 28000, amz: 11500, wmt: 3700, tt: 1400, sub: 5000, tpl: 2600, other: 1100, proj: true },
    { inv: 28000, ad: 14000, payroll: 0, ful: 4000, ship: 3300, over: 0, platFee: 1350, dtc: 28500, amz: 0, wmt: 0, tt: 0, sub: 5100, tpl: 2700, other: 1000, proj: true },
  ];

  for (let i = 0; i < weekData.length; i++) {
    const d = weekData[i];
    const cashIn = {
      dtcPayout: d.dtc,
      amazonPayout: d.amz,
      walmartPayout: d.wmt,
      tiktokPayout: d.tt,
      subscriptionRevenue: d.sub,
      threePLRevenue: d.tpl,
      other: d.other,
      total: d.dtc + d.amz + d.wmt + d.tt + d.sub + d.tpl + d.other,
    };
    const cashOut = {
      inventoryPO: d.inv,
      adSpend: d.ad,
      payroll: d.payroll,
      fulfillment: d.ful,
      shipping: d.ship,
      overhead: d.over,
      platformFees: d.platFee,
      total: d.inv + d.ad + d.payroll + d.ful + d.ship + d.over + d.platFee,
    };
    const netFlow = cashIn.total - cashOut.total;
    const endingBalance = balance + netFlow;

    weeks.push({
      week: i + 1,
      label: `W${i + 1}`,
      startingBalance: balance,
      cashIn,
      cashOut,
      netFlow,
      endingBalance,
      isProjected: d.proj,
    });

    balance = endingBalance;
  }

  return weeks;
};

export const weeklyForecast = generateWeeklyForecast();

// Generate scenario bands
export const cashScenarios: CashScenario[] = [
  {
    label: 'Best (+20%)',
    multiplier: 1.2,
    color: '#10b981',
    weeks: weeklyForecast.map((w) => ({
      week: w.week,
      endingBalance: w.startingBalance + (w.cashIn.total * 1.2 - w.cashOut.total),
    })),
  },
  {
    label: 'Base',
    multiplier: 1.0,
    color: '#3b82f6',
    weeks: weeklyForecast.map((w) => ({
      week: w.week,
      endingBalance: w.endingBalance,
    })),
  },
  {
    label: 'Worst (-20%)',
    multiplier: 0.8,
    color: '#ef4444',
    weeks: weeklyForecast.map((w) => ({
      week: w.week,
      endingBalance: w.startingBalance + (w.cashIn.total * 0.8 - w.cashOut.total),
    })),
  },
];

// Find minimum balance in worst case
export const worstCaseMin = Math.min(...cashScenarios[2].weeks.map((w) => w.endingBalance));
export const worstCaseMinWeek = cashScenarios[2].weeks.find((w) => w.endingBalance === worstCaseMin)?.week || 0;

// ─── Cash In-Transit by Channel ───
export const cashInTransit: CashInTransitChannel[] = [
  {
    channel: 'Shopify DTC',
    shortName: 'Shopify',
    pendingAmount: 8200,
    avgPayoutDays: 2,
    nextPayoutDate: 'Feb 5',
    nextPayoutAmount: 4100,
    reserveHeld: 0,
    color: '#3b82f6',
  },
  {
    channel: 'Amazon FBA',
    shortName: 'Amazon',
    pendingAmount: 24800,
    avgPayoutDays: 16,
    nextPayoutDate: 'Feb 12',
    nextPayoutAmount: 12400,
    reserveHeld: 8500,
    color: '#f59e0b',
  },
  {
    channel: 'Walmart',
    shortName: 'Walmart',
    pendingAmount: 7200,
    avgPayoutDays: 10,
    nextPayoutDate: 'Feb 8',
    nextPayoutAmount: 3600,
    reserveHeld: 0,
    color: '#0ea5e9',
  },
  {
    channel: 'TikTok Shop',
    shortName: 'TikTok',
    pendingAmount: 3800,
    avgPayoutDays: 7,
    nextPayoutDate: 'Feb 7',
    nextPayoutAmount: 1900,
    reserveHeld: 0,
    color: '#ec4899',
  },
];

export const totalInTransit = cashInTransit.reduce((sum, c) => sum + c.pendingAmount, 0);
export const totalReserves = cashInTransit.reduce((sum, c) => sum + c.reserveHeld, 0);
export const inTransitAsPercentOfRevenue = ((totalInTransit / 200000) * 100); // 22% of monthly rev

// ─── Net Cash Flow Waterfall (Monthly) ───
export const cashFlowWaterfall: CashWaterfallItem[] = [
  { label: 'Starting Cash', value: 187500, type: 'start', color: '#3b82f6' },
  { label: 'DTC Revenue', value: 108000, type: 'inflow', color: '#10b981' },
  { label: 'Marketplace', value: 56000, type: 'inflow', color: '#10b981' },
  { label: 'Subscriptions', value: 19200, type: 'inflow', color: '#10b981' },
  { label: '3PL Revenue', value: 9600, type: 'inflow', color: '#10b981' },
  { label: 'Payout Delays', value: -36000, type: 'outflow', color: '#ef4444' },
  { label: 'Reserves Held', value: -8500, type: 'outflow', color: '#ef4444' },
  { label: 'Inventory/COGS', value: -70000, type: 'outflow', color: '#ef4444' },
  { label: 'Ad Spend', value: -50000, type: 'outflow', color: '#ef4444' },
  { label: 'Payroll', value: -25000, type: 'outflow', color: '#ef4444' },
  { label: 'Fulfillment', value: -15000, type: 'outflow', color: '#ef4444' },
  { label: 'Shipping', value: -12000, type: 'outflow', color: '#ef4444' },
  { label: 'Overhead', value: -10800, type: 'outflow', color: '#ef4444' },
  { label: 'Ending Cash', value: 153000, type: 'end', color: '#3b82f6' },
];

// P&L vs Cash comparison
export const plVsCash = {
  plProfit: 35000,
  cashChange: -34500,
  gap: 69500,
  gapBreakdown: [
    { reason: 'Amazon reserves held', amount: 8500 },
    { reason: 'Payout delays (AMZ/WMT/TT)', amount: 36000 },
    { reason: 'Supplier PO overlap', amount: 15000 },
    { reason: 'Timing differences', amount: 10000 },
  ],
};

// ─── Cash Health Composite ───
export const cashHealthComponents: CashHealthComponent[] = [
  {
    name: 'Cash Runway',
    score: 85,
    weight: 0.30,
    status: 'green',
    detail: '21.4 weeks remaining (target: 12+)',
  },
  {
    name: 'CCC Efficiency',
    score: 56,
    weight: 0.20,
    status: 'yellow',
    detail: '45 days (target: 35 days)',
  },
  {
    name: 'Working Capital',
    score: 73,
    weight: 0.20,
    status: 'yellow',
    detail: '1.73x ratio (target: 2.0+)',
  },
  {
    name: 'Forecast Stability',
    score: 82,
    weight: 0.15,
    status: 'green',
    detail: '6.2% variance (target: <5%)',
  },
  {
    name: 'In-Transit Concentration',
    score: 58,
    weight: 0.15,
    status: 'yellow',
    detail: '22% of monthly rev (target: <10%)',
  },
];

export const cashHealthScore = Math.round(
  cashHealthComponents.reduce((sum, c) => sum + c.score * c.weight, 0)
);

// ─── Supplier Terms ───
export const supplierTerms: SupplierTerms[] = [
  {
    supplier: 'Zhongshan Medical (China)',
    currentTerms: 'Net 30, 50% deposit',
    currentDPO: 22,
    industryStandardDPO: 45,
    monthlySpend: 28000,
    opportunityAmount: 17900,
    flag: 'improvement-available',
  },
  {
    supplier: 'Guangdong PPE (China)',
    currentTerms: 'Net 30, 40% deposit',
    currentDPO: 26,
    industryStandardDPO: 45,
    monthlySpend: 18000,
    opportunityAmount: 9500,
    flag: 'improvement-available',
  },
  {
    supplier: 'US Packaging Co',
    currentTerms: 'Net 45',
    currentDPO: 42,
    industryStandardDPO: 45,
    monthlySpend: 8500,
    opportunityAmount: 850,
    flag: 'at-standard',
  },
  {
    supplier: 'LogiFreight LLC',
    currentTerms: 'Net 30',
    currentDPO: 28,
    industryStandardDPO: 30,
    monthlySpend: 12000,
    opportunityAmount: 800,
    flag: 'at-standard',
  },
];

export const totalTermsOpportunity = supplierTerms.reduce((sum, s) => sum + s.opportunityAmount, 0);

// ─── Cash Flow Decision for Decision Hub ───
export const cashFlowDecisionForHub = {
  id: 'cashflow-negotiate-terms',
  question: 'Negotiate supplier terms to free $29K+ working capital?',
  context: 'Top 2 Chinese suppliers are on Net 30 with 40-50% deposits. Industry standard is Net 45-60 with 20-30% deposits. Moving to standard terms frees $27.4K in permanent working capital.',
  urgency: 'this-week' as const,
  confidence: 78,
  impact: {
    upside: '$27.4K working capital freed (no interest, no dilution)',
    downside: 'Supplier relationship risk; may lose priority on rush orders',
  },
  supportingMetrics: [
    { label: 'Current DPO', value: '26 days' },
    { label: 'Industry DPO', value: '45 days' },
    { label: 'Monthly Supplier Spend', value: '$66.5K' },
    { label: 'Working Capital Freed', value: '$27.4K' },
  ],
  recommendation: 'Negotiate in phases: start with Zhongshan Medical (largest spend). Offer 2-year volume commitment in exchange for Net 60 + 20% deposit.',
  recommendedAction: 'Start supplier negotiation with Zhongshan Medical this week',
  options: [
    { label: 'Negotiate top 2 suppliers', risk: 'low' as const, impact: 'Free $27.4K in working capital from top spend suppliers' },
    { label: 'Negotiate all 4 suppliers', risk: 'medium' as const, impact: 'Free $29K+ but more complex negotiation management' },
    { label: 'Maintain current terms', risk: 'low' as const, impact: 'Preserve relationships, forgo $27.4K working capital' },
  ],
  owner: 'CEO',
  category: 'cost' as const,
};
