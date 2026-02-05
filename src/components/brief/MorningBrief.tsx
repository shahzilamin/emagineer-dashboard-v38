import { useState } from 'react';
import { clsx } from 'clsx';
import {
  Sun,
  Moon,
  Coffee,
  Sunset,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { overnightChanges, ceoPriorities, type OvernightChange, type CEOPriority } from '../../data/activity';
import { formatCurrency } from '../../utils/format';

function getGreeting(): { text: string; icon: React.ReactNode; subtext: string } {
  const hour = new Date().getHours();
  if (hour < 6) {
    return { text: 'Burning midnight oil', icon: <Moon className="w-6 h-6 text-indigo-400" />, subtext: 'Here\'s what happened while you weren\'t looking.' };
  }
  if (hour < 12) {
    return { text: 'Good morning, Shaz', icon: <Coffee className="w-6 h-6 text-amber-500" />, subtext: 'Here\'s what happened overnight.' };
  }
  if (hour < 17) {
    return { text: 'Afternoon check-in', icon: <Sun className="w-6 h-6 text-amber-400" />, subtext: 'Here\'s how the day is tracking.' };
  }
  if (hour < 21) {
    return { text: 'Evening wrap-up', icon: <Sunset className="w-6 h-6 text-orange-400" />, subtext: 'Here\'s how today went.' };
  }
  return { text: 'Late night dashboard', icon: <Moon className="w-6 h-6 text-indigo-400" />, subtext: 'Here\'s the latest across the portfolio.' };
}

function formatChangeValue(change: OvernightChange): string {
  if (change.format === 'currency') return formatCurrency(change.currentValue);
  if (change.format === 'percent') return `${change.currentValue.toFixed(1)}%`;
  return `${change.currentValue.toFixed(1)}x`;
}

function OvernightChangeRow({ change }: { change: OvernightChange }) {
  const isPositive = change.isGood;
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className={clsx(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          isPositive ? 'bg-emerald-500' : 'bg-red-500'
        )} />
        <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{change.metric}</span>
        <span className="text-xs text-slate-500 flex-shrink-0">
          {change.company === 'wellbefore' ? 'WB' : change.company === 'd2cbuilders' ? 'D2C' : 'ALL'}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {formatChangeValue(change)}
        </span>
        <span className={clsx(
          'text-xs font-medium flex items-center gap-0.5',
          isPositive ? 'text-emerald-600' : 'text-red-600'
        )}>
          {change.direction === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {change.direction === 'up' ? '+' : ''}{change.changePercent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function PriorityItem({ priority }: { priority: CEOPriority }) {
  const [expanded, setExpanded] = useState(false);

  const urgencyColors = {
    now: 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20',
    today: 'border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/20',
    'this-week': 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  };

  const urgencyBadge = {
    now: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
    today: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    'this-week': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
  };

  const urgencyLabel = {
    now: 'NOW',
    today: 'TODAY',
    'this-week': 'THIS WEEK',
  };

  return (
    <div
      className={clsx(
        'border-l-3 rounded-r-lg px-4 py-3 cursor-pointer transition-all',
        urgencyColors[priority.urgency]
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-base flex-shrink-0 mt-0.5">{priority.icon}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {priority.title}
            </p>
            {expanded && (
              <div className="mt-2 space-y-1.5">
                <p className="text-xs text-slate-600 dark:text-slate-300">{priority.reason}</p>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Impact: {priority.impact}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={clsx(
            'text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
            urgencyBadge[priority.urgency]
          )}>
            {urgencyLabel[priority.urgency]}
          </span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>
    </div>
  );
}

export function MorningBrief() {
  const greeting = getGreeting();
  const goodChanges = overnightChanges.filter(c => c.isGood);
  const badChanges = overnightChanges.filter(c => !c.isGood);
  const nowPriorities = ceoPriorities.filter(p => p.urgency === 'now');
  const todayPriorities = ceoPriorities.filter(p => p.urgency === 'today');
  const weekPriorities = ceoPriorities.filter(p => p.urgency === 'this-week');

  const timeNow = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-6 text-white overflow-hidden relative">
      {/* Subtle glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Greeting Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            {greeting.icon}
            <div>
              <h1 className="text-2xl font-bold">{greeting.text}</h1>
              <p className="text-slate-500 dark:text-slate-300 text-sm mt-0.5">{greeting.subtext}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-300 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeNow}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Overnight Changes */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Since Last Check
            </h3>

            {/* Good Changes */}
            {goodChanges.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 px-3">
                  ✓ Trending Well
                </p>
                <div className="space-y-0.5">
                  {goodChanges.map((change, i) => (
                    <OvernightChangeRow key={i} change={change} />
                  ))}
                </div>
              </div>
            )}

            {/* Bad Changes */}
            {badChanges.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 px-3">
                  ✗ Needs Attention
                </p>
                <div className="space-y-0.5">
                  {badChanges.map((change, i) => (
                    <OvernightChangeRow key={i} change={change} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: CEO Priorities */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-3 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Your Priorities
              <span className="bg-red-500/20 text-red-300 text-xs font-bold px-1.5 py-0.5 rounded">
                {nowPriorities.length} urgent
              </span>
            </h3>

            <div className="space-y-2">
              {nowPriorities.map(p => (
                <PriorityItem key={p.id} priority={p} />
              ))}
              {todayPriorities.map(p => (
                <PriorityItem key={p.id} priority={p} />
              ))}
              {weekPriorities.map(p => (
                <PriorityItem key={p.id} priority={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
