import { useState } from 'react';
import { clsx } from 'clsx';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Target,
  ArrowRight,
  Lightbulb,
  DollarSign,
  Package,
  Rocket,
  ShieldAlert,
} from 'lucide-react';
import type { Decision, DecisionUrgency, DecisionRisk, DecisionCategory, SupportingMetric } from '../../data/decisions';

const urgencyConfig: Record<DecisionUrgency, { label: string; color: string; icon: typeof Zap; bg: string; border: string }> = {
  'today': {
    label: 'Decide Today',
    color: 'text-red-600 dark:text-red-400',
    icon: Zap,
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
  },
  'this-week': {
    label: 'This Week',
    color: 'text-amber-600 dark:text-amber-400',
    icon: Clock,
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
  },
  'this-month': {
    label: 'This Month',
    color: 'text-blue-600 dark:text-blue-400',
    icon: Calendar,
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
  },
};

const riskConfig: Record<DecisionRisk, { label: string; color: string; bg: string }> = {
  low: { label: 'Low Risk', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  medium: { label: 'Med Risk', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30' },
  high: { label: 'High Risk', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30' },
};

const categoryConfig: Record<DecisionCategory, { icon: typeof DollarSign; color: string }> = {
  revenue: { icon: DollarSign, color: 'text-emerald-500' },
  cost: { icon: DollarSign, color: 'text-amber-500' },
  operations: { icon: Package, color: 'text-blue-500' },
  growth: { icon: Rocket, color: 'text-purple-500' },
  risk: { icon: ShieldAlert, color: 'text-red-500' },
};

function ConfidenceMeter({ confidence }: { confidence: number }) {
  const getColor = () => {
    if (confidence >= 80) return 'text-emerald-500';
    if (confidence >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getBarColor = () => {
    if (confidence >= 80) return 'bg-emerald-500';
    if (confidence >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all', getBarColor())}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className={clsx('text-xs font-bold tabular-nums', getColor())}>{confidence}%</span>
    </div>
  );
}

function MetricPill({ metric }: { metric: SupportingMetric }) {
  const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus;
  
  const trendColor = metric.good === undefined
    ? 'text-slate-400'
    : metric.good
      ? 'text-emerald-500'
      : 'text-red-500';

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-300 uppercase tracking-wide truncate">{metric.label}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{metric.value}</p>
      </div>
      {metric.trend && (
        <TrendIcon className={clsx('w-3.5 h-3.5 flex-shrink-0', trendColor)} />
      )}
    </div>
  );
}

export function DecisionCard({ decision, condensed }: { decision: Decision; condensed?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const urgency = urgencyConfig[decision.urgency];
  const category = categoryConfig[decision.category];
  const UrgencyIcon = urgency.icon;
  const CategoryIcon = category.icon;

  // Condensed mode: compact preview card (Lux Hero V38)
  if (condensed) {
    return (
      <div
        className={clsx(
          'bg-white dark:bg-slate-800 rounded-xl border transition-all duration-200',
          decision.urgency === 'today'
            ? 'border-red-200 dark:border-red-800 shadow-sm shadow-red-100 dark:shadow-red-900/20'
            : 'border-slate-200 dark:border-slate-700',
        )}
      >
        <div className="p-4">
          {/* Header: urgency badge + confidence */}
          <div className="flex items-center justify-between mb-2">
            <span className={clsx('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider', urgency.bg, urgency.color)}>
              <UrgencyIcon className="w-3 h-3" />
              {urgency.label}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full', decision.confidence >= 80 ? 'bg-emerald-500' : decision.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500')}
                  style={{ width: `${decision.confidence}%` }}
                />
              </div>
              <span className={clsx('text-xs font-bold tabular-nums', decision.confidence >= 80 ? 'text-emerald-500' : decision.confidence >= 60 ? 'text-amber-500' : 'text-red-500')}>
                {decision.confidence}%
              </span>
            </div>
          </div>
          {/* Title */}
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
            {decision.question}
          </h3>
          {/* Description: 2-line clamp */}
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
            {decision.context}
          </p>
          {/* Recommendation: inline compact */}
          <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{decision.recommendation}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-800 rounded-xl border transition-all duration-200',
        decision.urgency === 'today'
          ? 'border-red-200 dark:border-red-800 shadow-sm shadow-red-100 dark:shadow-red-900/20'
          : 'border-slate-200 dark:border-slate-700',
        expanded && 'ring-2 ring-blue-500/20'
      )}
    >
      {/* Main Card Content */}
      <div className="p-5">
        {/* Top Row: Urgency + Category + Confidence */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={clsx('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider', urgency.bg, urgency.color)}>
              <UrgencyIcon className="w-3 h-3" />
              {urgency.label}
            </span>
            <CategoryIcon className={clsx('w-4 h-4', category.color)} />
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Shield className="w-3 h-3" />
            <span>Confidence</span>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="mb-4">
          <ConfidenceMeter confidence={decision.confidence} />
        </div>

        {/* The Question */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2">
          {decision.question}
        </h3>

        {/* Context */}
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          {decision.context}
        </p>

        {/* Impact Quick View */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
            <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wide">Upside</p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">{decision.impact.upside}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20">
            <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase tracking-wide">Downside</p>
              <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">{decision.impact.downside}</p>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-0.5">Recommendation</p>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">{decision.recommendation}</p>
          </div>
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-4 text-xs font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              View Supporting Data & Options
            </>
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-5 space-y-5">
          {/* Supporting Metrics */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-3">
              Supporting Data
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {decision.supportingMetrics.map((metric, i) => (
                <MetricPill key={i} metric={metric} />
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-3">
              Options
            </h4>
            <div className="space-y-2">
              {decision.options.map((option, i) => {
                const risk = riskConfig[option.risk];
                return (
                  <div
                    key={i}
                    className={clsx(
                      'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                      i === 0
                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    )}
                  >
                    <div className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                      i === 0
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                    )}>
                      {i === 0 ? '★' : String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={clsx('text-sm font-medium', i === 0 ? 'text-blue-900 dark:text-blue-200' : 'text-slate-900 dark:text-white')}>
                        {option.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-300">{option.impact}</p>
                    </div>
                    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0', risk.bg, risk.color)}>
                      {risk.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Owner: <span className="font-medium text-slate-700 dark:text-slate-300">{decision.owner}</span>
            </span>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              <Target className="w-3.5 h-3.5" />
              {decision.recommendedAction}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
