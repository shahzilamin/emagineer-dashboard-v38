import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PillarStat {
  label: string;
  value: string;
  color?: string;
}

interface HeroTrend {
  direction: 'up' | 'down' | 'flat';
  label: string;
  sentiment: 'good' | 'bad' | 'neutral';
}

interface TrendHistory {
  points: string[]; // 3 data points: [twoMonthAgo, lastMonth, current]
  trajectory: 'accelerating-decline' | 'stable-fluctuation' | 'recovery-correction' | 'steady-improvement' | 'accelerating-improvement';
}

export interface LinkedDecision {
  title: string;
  confidence: number;
  urgency: 'today' | 'this-week' | 'this-month';
}

interface PillarCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  status: 'green' | 'yellow' | 'red';
  heroValue: string;
  heroLabel: string;
  alertText?: string;
  heroTrend?: HeroTrend;
  trendHistory?: TrendHistory;
  linkedDecision?: LinkedDecision;
  stats: PillarStat[];
}

const statusStyles = {
  green: { dot: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
  yellow: { dot: 'bg-amber-500', ring: 'ring-amber-500/20' },
  red: { dot: 'bg-red-500', ring: 'ring-red-500/20' },
};

const trajectoryLabels: Record<TrendHistory['trajectory'], { label: string; color: string }> = {
  'accelerating-decline': { label: 'accelerating decline', color: 'text-red-500 dark:text-red-400' },
  'stable-fluctuation': { label: 'normal fluctuation', color: 'text-slate-500 dark:text-slate-400' },
  'recovery-correction': { label: 'healthy correction', color: 'text-emerald-600 dark:text-emerald-400' },
  'steady-improvement': { label: 'steady improvement', color: 'text-emerald-600 dark:text-emerald-400' },
  'accelerating-improvement': { label: 'accelerating improvement', color: 'text-emerald-600 dark:text-emerald-400' },
};

const urgencyLabels: Record<string, { label: string; color: string }> = {
  'today': { label: 'DECIDE TODAY', color: 'text-red-500 dark:text-red-400' },
  'this-week': { label: 'THIS WEEK', color: 'text-amber-600 dark:text-amber-400' },
  'this-month': { label: 'THIS MONTH', color: 'text-blue-600 dark:text-blue-400' },
};

export function PillarCard({
  icon: Icon,
  iconColor,
  title,
  status,
  heroValue,
  heroLabel,
  alertText,
  heroTrend,
  trendHistory,
  linkedDecision,
  stats,
}: PillarCardProps) {
  const c = statusStyles[status];

  return (
    <div
      className={clsx(
        'bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4',
        'ring-1 ring-inset',
        c.ring
      )}
    >
      {/* Header: icon + title + status dot */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={clsx('w-4 h-4', iconColor)} />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {title}
          </span>
        </div>
        <div className={clsx('w-2.5 h-2.5 rounded-full', c.dot)} />
      </div>

      {/* Alert badge (conditional) */}
      {alertText && (
        <div className="mb-3 px-2 py-1 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">
            {alertText}
          </span>
        </div>
      )}

      {/* Hero metric */}
      <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
        {heroValue}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        {heroLabel}
      </p>

      {/* Trend indicator */}
      {heroTrend && (
        <div className={clsx(
          'flex items-center gap-1 mt-1',
          heroTrend.sentiment === 'good' ? 'text-emerald-600 dark:text-emerald-400'
            : heroTrend.sentiment === 'bad' ? 'text-red-600 dark:text-red-400'
            : 'text-slate-500 dark:text-slate-400'
        )}>
          <span className="text-xs">
            {heroTrend.direction === 'up' ? '↗' : heroTrend.direction === 'down' ? '↘' : '→'}
          </span>
          <span className="text-xs font-medium">{heroTrend.label}</span>
        </div>
      )}

      {/* 3-Month Trend History (Sol Hero V37) */}
      {trendHistory && (
        <div className="mt-1.5">
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 tabular-nums">
            <span>3mo:</span>
            <span>{trendHistory.points[0]}</span>
            <span>→</span>
            <span>{trendHistory.points[1]}</span>
            <span>→</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">{trendHistory.points[2]}</span>
          </div>
          <span className={clsx('text-xs font-medium', trajectoryLabels[trendHistory.trajectory].color)}>
            {trajectoryLabels[trendHistory.trajectory].label}
          </span>
        </div>
      )}

      {/* Supporting stats */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 space-y-1.5">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {s.label}
            </span>
            <span
              className={clsx(
                'text-xs font-semibold tabular-nums',
                s.color || 'text-slate-700 dark:text-slate-200'
              )}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Linked Decision — diagnosis-to-action bridge (Sol Hero V38) */}
      {linkedDecision && trendHistory && (trendHistory.trajectory === 'accelerating-decline' || trendHistory.trajectory === 'recovery-correction') && (
        <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-1.5 text-xs text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">
            <ArrowRight className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium line-clamp-1">{linkedDecision.title}</span>
            <span className="tabular-nums flex-shrink-0">({linkedDecision.confidence}%)</span>
            <span className={clsx('text-xs font-bold flex-shrink-0 ml-auto', urgencyLabels[linkedDecision.urgency]?.color)}>
              {urgencyLabels[linkedDecision.urgency]?.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
