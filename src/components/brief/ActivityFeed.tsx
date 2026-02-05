import { useState } from 'react';
import { clsx } from 'clsx';
import {
  Filter,
  ChevronDown,
} from 'lucide-react';
import { activityFeed, type Activity, type ActivityType } from '../../data/activity';
import { formatRelativeTime } from '../../utils/format';

const typeLabels: Record<ActivityType, { label: string; color: string }> = {
  order: { label: 'Orders', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  fulfillment: { label: 'Fulfillment', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
  alert: { label: 'Alerts', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  milestone: { label: 'Milestones', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
  customer: { label: 'Customers', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' },
  inventory: { label: 'Inventory', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  financial: { label: 'Financial', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
  marketing: { label: 'Marketing', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400' },
};

const priorityDot: Record<string, string> = {
  critical: 'bg-red-500 animate-pulse',
  high: 'bg-amber-500',
  medium: 'bg-blue-500',
  low: 'bg-slate-400',
};

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className={clsx(
      'flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group',
      activity.priority === 'critical' && 'bg-red-50/50 dark:bg-red-900/10'
    )}>
      {/* Timeline dot */}
      <div className="flex flex-col items-center pt-1 flex-shrink-0">
        <div className={clsx('w-2 h-2 rounded-full', priorityDot[activity.priority])} />
        <div className="w-px h-full bg-slate-200 dark:bg-slate-700 mt-1 min-h-[20px] group-last:hidden" />
      </div>

      {/* Icon */}
      <span className="text-base flex-shrink-0 mt-0.5">{activity.icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
            {activity.title}
          </p>
          <span className="text-xs text-slate-500 flex-shrink-0 mt-0.5">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
        {activity.detail && (
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">{activity.detail}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {activity.value && (
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {activity.value}
            </span>
          )}
          <span className="text-xs text-slate-500">
            {activity.company === 'wellbefore' ? 'WellBefore' : activity.company === 'd2cbuilders' ? 'D2C Builders' : 'Portfolio'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ActivityFeed() {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  const filtered = filter === 'all'
    ? activityFeed
    : activityFeed.filter(a => a.type === filter);

  const displayed = showAll ? filtered : filtered.slice(0, 8);

  const criticalCount = activityFeed.filter(a => a.priority === 'critical').length;
  const highCount = activityFeed.filter(a => a.priority === 'high').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white text-sm">
                Live Activity
              </h3>
            </div>
            <span className="text-xs text-slate-500">{activityFeed.length} events</span>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <span className="text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                {criticalCount} critical
              </span>
            )}
            {highCount > 0 && (
              <span className="text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">
                {highCount} high
              </span>
            )}
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1">
          <button
            onClick={() => setFilter('all')}
            className={clsx(
              'text-xs font-medium px-2 py-1 rounded-full transition-colors whitespace-nowrap flex items-center gap-1',
              filter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >
            <Filter className="w-3 h-3" />
            All
          </button>
          {(['alert', 'order', 'fulfillment', 'financial', 'marketing', 'customer'] as ActivityType[]).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={clsx(
                'text-xs font-medium px-2 py-1 rounded-full transition-colors whitespace-nowrap',
                filter === type
                  ? typeLabels[type].color + ' ring-1 ring-current'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              )}
            >
              {typeLabels[type].label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Items */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {displayed.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>

      {/* Show More */}
      {filtered.length > 8 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-1 border-t border-slate-200 dark:border-slate-700"
        >
          Show {filtered.length - 8} more events
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
