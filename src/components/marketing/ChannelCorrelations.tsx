import { useState } from 'react';
import { clsx } from 'clsx';
import { Network, AlertTriangle, ArrowRight, ChevronDown, ChevronUp, Lightbulb, Eye } from 'lucide-react';
import {
  channelCorrelations,
  crossChannelInsights,
  correlationSummary,
  type ChannelCorrelation,
} from '../../data/channel-correlations';

function CorrelationBar({ strength }: { strength: number }) {
  const getColor = () => {
    if (strength >= 0.7) return 'bg-red-500';
    if (strength >= 0.5) return 'bg-amber-500';
    return 'bg-blue-400';
  };
  const getLabel = () => {
    if (strength >= 0.7) return 'Strong';
    if (strength >= 0.5) return 'Moderate';
    return 'Weak';
  };
  const getLabelColor = () => {
    if (strength >= 0.7) return 'text-red-600 dark:text-red-400';
    if (strength >= 0.5) return 'text-amber-600 dark:text-amber-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all', getColor())}
          style={{ width: `${strength * 100}%` }}
        />
      </div>
      <span className={clsx('text-xs font-bold tabular-nums w-16 text-right', getLabelColor())}>
        {(strength * 100).toFixed(0)}% {getLabel()}
      </span>
    </div>
  );
}

function CorrelationPair({ pair }: { pair: ChannelCorrelation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4">
        {/* Channel pair header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold"
            style={{ backgroundColor: pair.color }}
          >
            {pair.sourceShort.substring(0, 2)}
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {pair.sourceShort} → {pair.targetShort}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300 truncate">
              {pair.mechanism.split('.')[0]}
            </p>
          </div>
        </div>

        {/* Correlation strength */}
        <CorrelationBar strength={pair.correlationStrength} />

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-3 text-xs font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Hide details</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> Evidence & impact</>
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-1">Mechanism</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{pair.mechanism}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-1">Evidence</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{pair.evidence}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">If you cut {pair.sourceShort}</p>
                <p className="text-sm text-amber-800 dark:text-amber-200">{pair.impact}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ insight }: { insight: typeof crossChannelInsights[0] }) {
  const severityColors = {
    high: 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10',
    medium: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10',
    low: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10',
  };

  return (
    <div className={clsx('border-l-4 rounded-r-lg p-4', severityColors[insight.severity])}>
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{insight.title}</p>
      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{insight.description}</p>
      <div className="flex items-start gap-1.5">
        <Lightbulb className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">{insight.actionable}</p>
      </div>
    </div>
  );
}

export function ChannelCorrelations() {
  const [showAll, setShowAll] = useState(false);
  const visiblePairs = showAll ? channelCorrelations : channelCorrelations.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Cross-Channel Amplification</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">Which channels secretly drive other channels' results</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20">
            <Eye className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-bold text-red-600 dark:text-red-400">
              ${(correlationSummary.hiddenRevenue / 1000).toFixed(0)}K/mo hidden revenue
            </span>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-300">Pairs Analyzed</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{correlationSummary.totalPairsAnalyzed}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-300">Strong Links</p>
          <p className="text-xl font-bold text-red-600">{correlationSummary.strongCorrelations}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-300">Hidden Rev/mo</p>
          <p className="text-xl font-bold text-amber-600">${(correlationSummary.hiddenRevenue / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-300">Avg Strength</p>
          <p className="text-xl font-bold text-blue-600">
            {(channelCorrelations.reduce((s, c) => s + c.correlationStrength, 0) / channelCorrelations.length * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Correlation pairs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visiblePairs.map((pair) => (
          <CorrelationPair key={`${pair.sourceShort}-${pair.targetShort}`} pair={pair} />
        ))}
      </div>

      {channelCorrelations.length > 4 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            {showAll ? (
              <><ChevronUp className="w-4 h-4" /> Show fewer</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> Show all {channelCorrelations.length} pairs</>
            )}
          </button>
        </div>
      )}

      {/* CEO Insights */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          CEO Insights — What This Means for Budget Decisions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {crossChannelInsights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>
      </div>

      {/* Warning banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-800 dark:text-red-200">
            Never cut a channel based on platform ROAS alone
          </p>
          <p className="text-xs text-red-700 dark:text-red-300 mt-1">
            {correlationSummary.riskIfIgnored}
          </p>
        </div>
      </div>
    </div>
  );
}

// Compact version for Overview tab — expandable with breakdown (Sol QW2 V38)
export function ChannelCorrelationsBadge() {
  const [expanded, setExpanded] = useState(false);
  const strongLinks = channelCorrelations.filter(c => c.correlationStrength >= 0.7);
  // Estimate hidden rev per link proportionally to strength
  const totalStrength = strongLinks.reduce((s, c) => s + c.correlationStrength, 0);

  return (
    <div className="rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 w-full px-3 py-1.5 text-left hover:bg-cyan-100/50 dark:hover:bg-cyan-900/30 transition-colors"
      >
        <Network className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
        <span className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
          {correlationSummary.strongCorrelations} strong cross-channel links detected
        </span>
        <span className="text-xs text-cyan-600 dark:text-cyan-400">
          (${(correlationSummary.hiddenRevenue / 1000).toFixed(0)}K hidden rev)
        </span>
        <span className="ml-auto flex-shrink-0">
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-cyan-500" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-500" />}
        </span>
      </button>
      {expanded && (
        <div className="px-3 pb-2.5 pt-1 border-t border-cyan-200 dark:border-cyan-800 space-y-1.5">
          <p className="text-xs text-cyan-600 dark:text-cyan-400 mb-1">
            Revenue attributed to one channel but driven by another — reallocating improves ROAS accuracy by ~12%.
          </p>
          {strongLinks.map(link => {
            const share = link.correlationStrength / totalStrength;
            const estRev = Math.round(correlationSummary.hiddenRevenue * share / 1000);
            return (
              <div key={`${link.sourceShort}-${link.targetShort}`} className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-cyan-700 dark:text-cyan-300 w-28">{link.sourceShort} → {link.targetShort}</span>
                <div className="flex-1 h-1 bg-cyan-200 dark:bg-cyan-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${link.correlationStrength * 100}%` }} />
                </div>
                <span className="tabular-nums font-bold text-cyan-700 dark:text-cyan-300 w-10 text-right">~${estRev}K</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
