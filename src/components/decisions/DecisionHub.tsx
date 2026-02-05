import { useState } from 'react';
import { clsx } from 'clsx';
import {
  Brain,
  Zap,
  Clock,
  Calendar,
  Filter,
  Sparkles,
} from 'lucide-react';
import { DecisionCard } from './DecisionCard';
import type { Decision, DecisionUrgency } from '../../data/decisions';
import { getDecisionStats } from '../../data/decisions';

type FilterType = 'all' | DecisionUrgency;

const filters: { id: FilterType; label: string; icon: typeof Zap }[] = [
  { id: 'all', label: 'All', icon: Filter },
  { id: 'today', label: 'Today', icon: Zap },
  { id: 'this-week', label: 'This Week', icon: Clock },
  { id: 'this-month', label: 'This Month', icon: Calendar },
];

interface DecisionHubProps {
  decisions: Decision[];
  displayLimit?: number;
  condensed?: boolean;
  companyName?: string;
  criticalAlertCount?: number;
}

export function DecisionHub({ decisions, displayLimit, condensed, companyName: _companyName = 'WellBefore', criticalAlertCount = 0 }: DecisionHubProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const stats = getDecisionStats(decisions);

  const filteredDecisions = activeFilter === 'all'
    ? decisions
    : decisions.filter(d => d.urgency === activeFilter);

  // Sort: today first, then this-week, then this-month. Within same urgency, higher confidence first.
  const sortedDecisions = [...filteredDecisions].sort((a, b) => {
    const urgencyOrder: Record<DecisionUrgency, number> = { 'today': 0, 'this-week': 1, 'this-month': 2 };
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    return b.confidence - a.confidence;
  });

  // Apply display limit to rendered cards only — not to stats or filters
  const displayedDecisions = displayLimit
    ? sortedDecisions.slice(0, displayLimit)
    : sortedDecisions;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-200 dark:shadow-purple-900/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Decision Intelligence
              <span className="cursor-help" title="Decisions generated from real-time metrics & anomaly detection">
                <Sparkles className="w-4 h-4 text-purple-500" />
              </span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {stats.total} decisions pending
              {displayLimit && displayLimit < filteredDecisions.length ? ` · showing top ${displayLimit}` : ''}
              {' • '}
              {stats.urgent > 0 && (
                <span className="text-red-600 dark:text-red-400 font-medium">{stats.urgent} urgent</span>
              )}
              {stats.urgent === 0 && criticalAlertCount > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">{criticalAlertCount} critical alert{criticalAlertCount > 1 ? 's' : ''} below</span>
              )}
              {stats.urgent === 0 && criticalAlertCount === 0 && 'No urgent items'}
            </p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Avg Confidence: {stats.avgConfidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const count = filter.id === 'all'
            ? stats.total
            : filter.id === 'today'
              ? stats.urgent
              : filter.id === 'this-week'
                ? stats.thisWeek
                : stats.thisMonth;

          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                activeFilter === filter.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{filter.label}</span>
              {count > 0 && (
                <span className={clsx(
                  'text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full',
                  activeFilter === filter.id
                    ? filter.id === 'today'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Decision Cards */}
      {displayedDecisions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {displayedDecisions.map((decision) => (
            <DecisionCard key={decision.id} decision={decision} condensed={condensed} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No decisions for this timeframe</p>
        </div>
      )}

      {/* Footer removed — context moved to Sparkles tooltip in header (Lux QW2) */}
    </div>
  );
}
