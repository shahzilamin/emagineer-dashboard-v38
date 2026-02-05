// Live Activity Feed data
// Simulates real-time business events across the portfolio

export type ActivityType =
  | 'order'
  | 'fulfillment'
  | 'alert'
  | 'milestone'
  | 'customer'
  | 'inventory'
  | 'financial'
  | 'marketing';

export type ActivityPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Activity {
  id: string;
  type: ActivityType;
  company: 'wellbefore' | 'd2cbuilders' | 'portfolio';
  title: string;
  detail?: string;
  value?: string;
  priority: ActivityPriority;
  timestamp: Date;
  icon: string; // emoji
}

export interface OvernightChange {
  metric: string;
  company: 'wellbefore' | 'd2cbuilders' | 'portfolio';
  previousValue: number;
  currentValue: number;
  changePercent: number;
  direction: 'up' | 'down';
  isGood: boolean;
  format: 'currency' | 'percent' | 'number';
}

export interface MomentumMetric {
  id: string;
  label: string;
  company: 'wellbefore' | 'd2cbuilders' | 'portfolio';
  currentVelocity: number; // current period growth rate
  previousVelocity: number; // previous period growth rate
  acceleration: number; // change in growth rate
  momentum: 'accelerating' | 'decelerating' | 'steady';
  currentValue: number;
  format: 'currency' | 'percent' | 'number';
  period: string;
}

export interface CEOPriority {
  id: string;
  title: string;
  reason: string;
  urgency: 'now' | 'today' | 'this-week';
  company: 'wellbefore' | 'd2cbuilders' | 'portfolio';
  impact: string;
  icon: string;
}

// Generate time-relative activities (simulates live feed)
const now = new Date();
const minutesAgo = (mins: number) => new Date(now.getTime() - mins * 60 * 1000);

export const activityFeed: Activity[] = [
  {
    id: 'act-1',
    type: 'order',
    company: 'wellbefore',
    title: 'Bulk N95 order received',
    detail: '500 units - Healthcare facility in Houston',
    value: '$4,750',
    priority: 'medium',
    timestamp: minutesAgo(2),
    icon: '📦',
  },
  {
    id: 'act-2',
    type: 'fulfillment',
    company: 'd2cbuilders',
    title: 'FitGear Pro batch shipped',
    detail: '142 orders dispatched via USPS Priority',
    value: '142 orders',
    priority: 'low',
    timestamp: minutesAgo(8),
    icon: '🚚',
  },
  {
    id: 'act-3',
    type: 'alert',
    company: 'wellbefore',
    title: 'N95 stock dipping below safety threshold',
    detail: '420 units remaining at 56/day velocity',
    priority: 'critical',
    timestamp: minutesAgo(15),
    icon: '🚨',
  },
  {
    id: 'act-4',
    type: 'marketing',
    company: 'wellbefore',
    title: 'Email campaign delivered',
    detail: '"Winter Wellness Bundle" - 45K recipients, 28% open rate',
    value: '$2,340 attributed',
    priority: 'low',
    timestamp: minutesAgo(22),
    icon: '📧',
  },
  {
    id: 'act-5',
    type: 'customer',
    company: 'wellbefore',
    title: 'New subscription signup',
    detail: 'Monthly PPE bundle - projected $720 LTV',
    value: '$59.99/mo',
    priority: 'low',
    timestamp: minutesAgo(31),
    icon: '🔄',
  },
  {
    id: 'act-6',
    type: 'milestone',
    company: 'd2cbuilders',
    title: 'BeautyBox monthly target hit early',
    detail: '103% of order target with 8 days remaining',
    priority: 'medium',
    timestamp: minutesAgo(45),
    icon: '🎯',
  },
  {
    id: 'act-7',
    type: 'financial',
    company: 'wellbefore',
    title: 'Shopify payout received',
    detail: 'Weekly settlement deposited',
    value: '$38,420',
    priority: 'medium',
    timestamp: minutesAgo(52),
    icon: '💰',
  },
  {
    id: 'act-8',
    type: 'alert',
    company: 'd2cbuilders',
    title: 'GourmetSnacks labor overage',
    detail: 'Kitting hours 18% over estimate for the week',
    priority: 'high',
    timestamp: minutesAgo(68),
    icon: '⚠️',
  },
  {
    id: 'act-9',
    type: 'order',
    company: 'wellbefore',
    title: 'Amazon restock PO acknowledged',
    detail: 'Thermometer Pro X - 2,000 units arriving Feb 10',
    priority: 'low',
    timestamp: minutesAgo(82),
    icon: '📋',
  },
  {
    id: 'act-10',
    type: 'customer',
    company: 'd2cbuilders',
    title: 'HealthyHarvest onboarding started',
    detail: 'New 3PL client - projected $15K MRR',
    value: '$15K MRR',
    priority: 'high',
    timestamp: minutesAgo(95),
    icon: '🤝',
  },
  {
    id: 'act-11',
    type: 'marketing',
    company: 'wellbefore',
    title: 'Meta ROAS recovered to 2.8x',
    detail: 'After pausing 3 underperforming ad sets yesterday',
    priority: 'medium',
    timestamp: minutesAgo(120),
    icon: '📈',
  },
  {
    id: 'act-12',
    type: 'fulfillment',
    company: 'wellbefore',
    title: '347 orders shipped today',
    detail: '98.3% on-time rate, avg 1.1 days to ship',
    value: '347 orders',
    priority: 'low',
    timestamp: minutesAgo(145),
    icon: '✅',
  },
  {
    id: 'act-13',
    type: 'inventory',
    company: 'wellbefore',
    title: 'Dead stock alert: Face shields',
    detail: '180 days on hand, 23 units, $1,840 tied up',
    priority: 'medium',
    timestamp: minutesAgo(180),
    icon: '📊',
  },
  {
    id: 'act-14',
    type: 'financial',
    company: 'portfolio',
    title: 'Combined daily revenue crossed $35K',
    detail: 'WB: $28.4K + D2C: $6.8K = $35.2K',
    value: '$35.2K',
    priority: 'medium',
    timestamp: minutesAgo(210),
    icon: '🏆',
  },
];

export const overnightChanges: OvernightChange[] = [
  {
    metric: 'Revenue (Today)',
    company: 'wellbefore',
    previousValue: 26800,
    currentValue: 28400,
    changePercent: 5.97,
    direction: 'up',
    isGood: true,
    format: 'currency',
  },
  {
    metric: 'CAC (Blended)',
    company: 'wellbefore',
    previousValue: 17.20,
    currentValue: 18.42,
    changePercent: 7.09,
    direction: 'up',
    isGood: false,
    format: 'currency',
  },
  {
    metric: 'On-Time Rate',
    company: 'd2cbuilders',
    previousValue: 96.8,
    currentValue: 97.2,
    changePercent: 0.41,
    direction: 'up',
    isGood: true,
    format: 'percent',
  },
  {
    metric: 'Error Rate',
    company: 'd2cbuilders',
    previousValue: 0.38,
    currentValue: 0.42,
    changePercent: 10.53,
    direction: 'up',
    isGood: false,
    format: 'percent',
  },
  {
    metric: 'Email ROAS',
    company: 'wellbefore',
    previousValue: 28.0,
    currentValue: 30.0,
    changePercent: 7.14,
    direction: 'up',
    isGood: true,
    format: 'number',
  },
  {
    metric: 'GourmetSnacks Margin',
    company: 'd2cbuilders',
    previousValue: 22.1,
    currentValue: 18.5,
    changePercent: -16.29,
    direction: 'down',
    isGood: false,
    format: 'percent',
  },
];

export const momentumMetrics: MomentumMetric[] = [
  {
    id: 'mom-1',
    label: 'Revenue',
    company: 'portfolio',
    currentVelocity: 8.2,
    previousVelocity: 5.4,
    acceleration: 2.8,
    momentum: 'accelerating',
    currentValue: 1016000,
    format: 'currency',
    period: 'MoM',
  },
  {
    id: 'mom-2',
    label: 'Gross Margin',
    company: 'portfolio',
    currentVelocity: -0.7,
    previousVelocity: 0.3,
    acceleration: -1.0,
    momentum: 'decelerating',
    currentValue: 42.5,
    format: 'percent',
    period: 'MoM',
  },
  {
    id: 'mom-3',
    label: 'Customer LTV',
    company: 'wellbefore',
    currentVelocity: 4.1,
    previousVelocity: 3.8,
    acceleration: 0.3,
    momentum: 'steady',
    currentValue: 128.50,
    format: 'currency',
    period: 'MoM',
  },
  {
    id: 'mom-4',
    label: 'Order Volume',
    company: 'd2cbuilders',
    currentVelocity: 12.3,
    previousVelocity: 8.1,
    acceleration: 4.2,
    momentum: 'accelerating',
    currentValue: 4850,
    format: 'number',
    period: 'MoM',
  },
  {
    id: 'mom-5',
    label: 'CAC',
    company: 'wellbefore',
    currentVelocity: 9.3,
    previousVelocity: 2.1,
    acceleration: 7.2,
    momentum: 'accelerating',
    currentValue: 18.42,
    format: 'currency',
    period: 'MoM',
  },
  {
    id: 'mom-6',
    label: 'Repeat Rate',
    company: 'wellbefore',
    currentVelocity: 3.7,
    previousVelocity: 1.2,
    acceleration: 2.5,
    momentum: 'accelerating',
    currentValue: 31.2,
    format: 'percent',
    period: 'MoM',
  },
];

export const ceoPriorities: CEOPriority[] = [
  {
    id: 'pri-1',
    title: 'Approve N95 rush order',
    reason: 'Stockout in 8 days. $4,800/day revenue at risk. Supplier needs PO today for expedited shipping.',
    urgency: 'now',
    company: 'wellbefore',
    impact: 'Prevents $38K+ lost revenue',
    icon: '🔴',
  },
  {
    id: 'pri-2',
    title: 'Review GourmetSnacks contract',
    reason: 'Margin dropped to 18.5% - below 20% minimum. Either renegotiate rates or offboard.',
    urgency: 'today',
    company: 'd2cbuilders',
    impact: 'Protect 3PL margin by 5.5 points',
    icon: '🟡',
  },
  {
    id: 'pri-3',
    title: 'Approve email frequency increase',
    reason: 'Email ROAS at 30x. Marketing wants to go from 3x to 4x weekly sends. Low risk, high reward.',
    urgency: 'today',
    company: 'wellbefore',
    impact: '+$28K/mo projected revenue',
    icon: '🟢',
  },
  {
    id: 'pri-4',
    title: 'HealthyHarvest onboarding review',
    reason: 'New 3PL client starting onboarding. Needs rate card approval and SLA sign-off.',
    urgency: 'this-week',
    company: 'd2cbuilders',
    impact: '+$15K MRR when live',
    icon: '🔵',
  },
  {
    id: 'pri-5',
    title: 'Dead stock liquidation plan',
    reason: '$17.2K tied up in slow-moving inventory. Tax benefit from donation before Q1 end.',
    urgency: 'this-week',
    company: 'wellbefore',
    impact: 'Free $17K cash + tax deduction',
    icon: '🟡',
  },
];
