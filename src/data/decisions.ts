// CEO Decision Intelligence Data Layer
// Transforms raw metrics + insights into actionable decision cards

export type DecisionUrgency = 'today' | 'this-week' | 'this-month';
export type DecisionRisk = 'low' | 'medium' | 'high';
export type DecisionCategory = 'revenue' | 'cost' | 'operations' | 'growth' | 'risk';

export interface DecisionOption {
  label: string;
  impact: string;
  risk: DecisionRisk;
}

export interface SupportingMetric {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'flat';
  good?: boolean; // Whether the trend direction is positive
}

export interface Decision {
  id: string;
  question: string;
  context: string;
  category: DecisionCategory;
  urgency: DecisionUrgency;
  confidence: number; // 0-100, how confident the recommendation is
  impact: {
    upside: string;
    downside: string;
  };
  recommendation: string;
  recommendedAction: string;
  supportingMetrics: SupportingMetric[];
  options: DecisionOption[];
  owner: string;
}

// WellBefore CEO Decisions - derived from current metrics and insights
export const wellBeforeDecisions: Decision[] = [
  {
    id: 'wb-d1',
    question: 'Should you rush-order N95 Respirators?',
    context: 'Only 8 days of stock remaining at current velocity. This SKU drives 15.6% of revenue ($4,800/day).',
    category: 'operations',
    urgency: 'today',
    confidence: 92,
    impact: {
      upside: 'Prevent $38K+ in lost revenue over restock period',
      downside: 'Rush shipping adds ~$2.4K to order cost',
    },
    recommendation: 'Yes — rush order immediately',
    recommendedAction: 'Contact supplier for expedited PO',
    supportingMetrics: [
      { label: 'Days of Stock', value: '8 days', trend: 'down', good: false },
      { label: 'Daily Revenue', value: '$4,800/day', trend: 'up', good: true },
      { label: 'Revenue Share', value: '15.6%', trend: 'flat' },
      { label: 'Restock Lead Time', value: '12 days', trend: 'flat' },
    ],
    options: [
      { label: 'Rush order (2-day)', impact: '+$2.4K cost, prevents stockout', risk: 'low' },
      { label: 'Standard order', impact: '4-day stockout gap, -$19K revenue', risk: 'high' },
      { label: 'Source alternative supplier', impact: 'Unknown timeline, may find better price', risk: 'medium' },
    ],
    owner: 'Operations',
  },
  {
    id: 'wb-d2',
    question: 'Should you cut Meta ad spend by 20%?',
    context: 'CAC spiked 9.3% this month while Meta CPM increased 12%. Meanwhile, email ROAS is 30x vs Meta\'s 3.2x.',
    category: 'cost',
    urgency: 'this-week',
    confidence: 78,
    impact: {
      upside: 'Save $8.4K/month in ad spend, improve blended ROAS',
      downside: 'May lose 15-20% of new customer acquisition volume',
    },
    recommendation: 'Reallocate, don\'t cut — shift 20% of Meta budget to email & Google',
    recommendedAction: 'Pause bottom 20% of Meta ad sets, boost email campaigns',
    supportingMetrics: [
      { label: 'Meta ROAS', value: '3.2x', trend: 'down', good: false },
      { label: 'Email ROAS', value: '30x', trend: 'up', good: true },
      { label: 'Google ROAS', value: '4.8x', trend: 'up', good: true },
      { label: 'Blended CAC', value: '$18.42', trend: 'up', good: false },
    ],
    options: [
      { label: 'Reallocate 20% to email/Google', impact: 'Save $8.4K, maintain volume', risk: 'low' },
      { label: 'Cut Meta 20%, pocket savings', impact: 'Save $8.4K, lose ~180 customers/mo', risk: 'medium' },
      { label: 'Maintain current spend', impact: 'Risk further CAC inflation', risk: 'high' },
    ],
    owner: 'Marketing',
  },
  {
    id: 'wb-d3',
    question: 'Should you run a flash sale to hit revenue target?',
    context: 'Pacing at 92% to $920K target with 27% of month remaining. Need $10.9K/day vs current $9.8K/day run rate. Gap driver: conversion down 8% (traffic up 3%, AOV stable at $38.50). A sale fixes conversion but not traffic.',
    category: 'revenue',
    urgency: 'this-week',
    confidence: 65,
    impact: {
      upside: 'Close $73K gap, hit monthly revenue target',
      downside: 'Flash sale may compress margin by 2-3 points',
    },
    recommendation: 'Consider targeted sale on high-margin SKUs only',
    recommendedAction: 'Launch 48-hour sale on top 5 margin SKUs via email',
    supportingMetrics: [
      { label: 'Revenue Gap', value: '$72.7K', trend: 'down', good: false },
      { label: 'Daily Run Rate', value: '$9.8K', trend: 'flat' },
      { label: 'Required Rate', value: '$10.9K', trend: 'up', good: false },
      { label: 'Gross Margin', value: '42.5%', trend: 'down', good: false },
    ],
    options: [
      { label: 'Targeted flash sale (high-margin SKUs)', impact: 'Likely close gap, margin hit ~1%', risk: 'low' },
      { label: 'Sitewide 15% off', impact: 'Definitely close gap, margin hit ~3%', risk: 'medium' },
      { label: 'No sale, accept miss', impact: 'Miss target by ~$40K, preserve margin', risk: 'low' },
    ],
    owner: 'Marketing',
  },
  {
    id: 'wb-d4',
    question: 'Should you liquidate $17.2K in dead stock?',
    context: '3 SKUs with 150+ days inventory: face shields, gowns, old thermometers. Tying up warehouse space and capital.',
    category: 'operations',
    urgency: 'this-month',
    confidence: 88,
    impact: {
      upside: 'Free $17.2K in capital + warehouse space for faster-moving SKUs',
      downside: 'Realize ~40-60% loss on original cost',
    },
    recommendation: 'Yes — liquidate via B2B channel or donate for tax benefit',
    recommendedAction: 'List on liquidation marketplace, contact non-profit for donation',
    supportingMetrics: [
      { label: 'Capital Tied Up', value: '$17.2K', trend: 'flat' },
      { label: 'Days on Hand', value: '150+', trend: 'up', good: false },
      { label: 'Monthly Carrying Cost', value: '$340', trend: 'flat' },
      { label: 'Tax Benefit (donate)', value: '~$5.2K', trend: 'flat' },
    ],
    options: [
      { label: 'Liquidate at 40% of cost', impact: 'Recover $6.9K, free space', risk: 'low' },
      { label: 'Donate for tax benefit', impact: 'Save ~$5.2K in taxes, free space', risk: 'low' },
      { label: 'Hold and hope', impact: 'Continue $340/mo carrying cost', risk: 'medium' },
    ],
    owner: 'Operations',
  },
  {
    id: 'wb-d5',
    question: 'Should you increase email frequency to 4x/week?',
    context: 'Email channel at 30x ROAS, driving $84K this month on $2.8K spend. Currently sending 3x/week.',
    category: 'growth',
    urgency: 'this-week',
    confidence: 72,
    impact: {
      upside: 'Could add $28K/month in revenue at minimal cost',
      downside: 'Risk 5-10% increase in unsubscribe rate',
    },
    recommendation: 'Test 4x/week for 2 weeks, monitor unsubscribe rate',
    recommendedAction: 'Add one educational/value email per week, track engagement',
    supportingMetrics: [
      { label: 'Email ROAS', value: '30x', trend: 'up', good: true },
      { label: 'Monthly Email Rev', value: '$84K', trend: 'up', good: true },
      { label: 'Unsubscribe Rate', value: '0.3%', trend: 'flat' },
      { label: 'Open Rate', value: '28.4%', trend: 'up', good: true },
    ],
    options: [
      { label: 'Test 4x/week for 2 weeks', impact: 'Low risk test, potential +$28K/mo', risk: 'low' },
      { label: 'Jump to 5x/week', impact: 'Higher revenue potential, higher unsub risk', risk: 'medium' },
      { label: 'Stay at 3x/week', impact: 'No risk, leave money on table', risk: 'low' },
    ],
    owner: 'Marketing',
  },
];

// D2C Builders CEO Decisions
export const d2cBuildersDecisions: Decision[] = [
  {
    id: 'd2c-d1',
    question: 'Should you fire GourmetSnacks as a client?',
    context: 'Client margin dropped to 18.5% (from 24%). Labor hours 25% over estimate due to complex kitting. Below your 22% minimum threshold.',
    category: 'risk',
    urgency: 'this-week',
    confidence: 71,
    impact: {
      upside: 'Free 140 labor hours/month for higher-margin clients',
      downside: 'Lose $12.8K/month in revenue (7.6% of total)',
    },
    recommendation: 'Renegotiate first — present new pricing or simplify scope',
    recommendedAction: 'Schedule pricing review call with GourmetSnacks this week',
    supportingMetrics: [
      { label: 'Client Margin', value: '18.5%', trend: 'down', good: false },
      { label: 'Monthly Revenue', value: '$12.8K', trend: 'flat' },
      { label: 'Labor Hours Over', value: '+25%', trend: 'up', good: false },
      { label: 'Revenue Share', value: '7.6%', trend: 'flat' },
    ],
    options: [
      { label: 'Renegotiate pricing (+15%)', impact: 'Restore margin to 26%, keep client', risk: 'medium' },
      { label: 'Simplify kitting scope', impact: 'Reduce labor, margin to ~23%', risk: 'low' },
      { label: 'Terminate client', impact: 'Lose $12.8K/mo, free 140 hours', risk: 'high' },
    ],
    owner: 'Account Management',
  },
  {
    id: 'd2c-d2',
    question: 'Should you close the HealthyHarvest deal?',
    context: '75% close probability, $15K MRR. Would be your 8th client and reduce concentration risk from 22.9% to 19.4%.',
    category: 'growth',
    urgency: 'this-week',
    confidence: 82,
    impact: {
      upside: 'Add $15K MRR, reduce top-client concentration risk',
      downside: 'Need to hire 1 additional warehouse associate ($3.2K/mo)',
    },
    recommendation: 'Yes — prioritize closing, reduces concentration risk significantly',
    recommendedAction: 'Send final proposal with onboarding timeline',
    supportingMetrics: [
      { label: 'Deal MRR', value: '$15K', trend: 'flat' },
      { label: 'Close Probability', value: '75%', trend: 'up', good: true },
      { label: 'Concentration (after)', value: '19.4%', trend: 'down', good: true },
      { label: 'New Hire Cost', value: '$3.2K/mo', trend: 'flat' },
    ],
    options: [
      { label: 'Close at proposed rate', impact: '+$15K MRR, hire 1 person', risk: 'low' },
      { label: 'Negotiate higher rate', impact: 'Better margin, may lose deal', risk: 'medium' },
      { label: 'Pass on deal', impact: 'No risk, concentration stays at 22.9%', risk: 'medium' },
    ],
    owner: 'Sales',
  },
  {
    id: 'd2c-d3',
    question: 'Should you invest in pick error reduction training?',
    context: 'Error rate up 10.5% to 0.42%. Each error costs ~$18 in rework + returns. Training investment: $2.5K one-time.',
    category: 'operations',
    urgency: 'this-month',
    confidence: 85,
    impact: {
      upside: 'Reduce errors by 30-40%, save ~$1.2K/month in rework costs',
      downside: '$2.5K training cost + 2 days of reduced productivity',
    },
    recommendation: 'Yes — ROI positive in 2.1 months',
    recommendedAction: 'Schedule training sessions for next week',
    supportingMetrics: [
      { label: 'Error Rate', value: '0.42%', trend: 'up', good: false },
      { label: 'Cost per Error', value: '$18', trend: 'flat' },
      { label: 'Monthly Error Cost', value: '$1.2K', trend: 'up', good: false },
      { label: 'Training ROI', value: '2.1 mo payback', trend: 'flat' },
    ],
    options: [
      { label: 'Full training program ($2.5K)', impact: 'Cut errors 30-40%, 2.1 mo payback', risk: 'low' },
      { label: 'Targeted training (problem areas)', impact: 'Cut errors 15-20%, $1K cost', risk: 'low' },
      { label: 'No training, increase QC', impact: 'Adds $800/mo in QC labor', risk: 'medium' },
    ],
    owner: 'Warehouse Manager',
  },
];

// Get decisions filtered by urgency
export function getUrgentDecisions(decisions: Decision[]): Decision[] {
  return decisions.filter(d => d.urgency === 'today');
}

export function getDecisionsByCategory(decisions: Decision[], category: DecisionCategory): Decision[] {
  return decisions.filter(d => d.category === category);
}

export function getDecisionStats(decisions: Decision[]) {
  return {
    total: decisions.length,
    urgent: decisions.filter(d => d.urgency === 'today').length,
    thisWeek: decisions.filter(d => d.urgency === 'this-week').length,
    thisMonth: decisions.filter(d => d.urgency === 'this-month').length,
    avgConfidence: Math.round(decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length),
  };
}
