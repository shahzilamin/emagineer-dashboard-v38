import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Users,
  Repeat,
  Clock,
  Target,
} from 'lucide-react';
import type { ChannelROI } from '../../data/adspend';
import { formatCurrency } from '../../utils/format';

type SortKey = 'roas' | 'ltvCacRatio' | 'spend' | 'revenue' | 'repeatRate';

interface ChannelROILeaderboardProps {
  channels: ChannelROI[];
}

export function ChannelROILeaderboard({ channels }: ChannelROILeaderboardProps) {
  const [sortBy, setSortBy] = useState<SortKey>('ltvCacRatio');
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  // Filter to paid channels only for the leaderboard (organic has infinite ROAS, not useful for comparison)
  const paidChannels = channels.filter((c) => c.spend > 0);

  const sorted = [...paidChannels].sort((a, b) => {
    if (sortBy === 'roas') return b.roas - a.roas;
    if (sortBy === 'ltvCacRatio') return b.ltvCacRatio - a.ltvCacRatio;
    if (sortBy === 'spend') return b.spend - a.spend;
    if (sortBy === 'revenue') return b.revenue - a.revenue;
    if (sortBy === 'repeatRate') return b.repeatRate - a.repeatRate;
    return 0;
  });

  const maxRoas = Math.max(...paidChannels.map((c) => c.roas));

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      {/* Header with Sort Controls */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Channel ROI Leaderboard
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Ranked by efficiency - where should the next dollar go?
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'ltvCacRatio' as SortKey, label: 'LTV:CAC' },
            { key: 'roas' as SortKey, label: 'ROAS' },
            { key: 'repeatRate' as SortKey, label: 'Stickiness' },
            { key: 'revenue' as SortKey, label: 'Revenue' },
            { key: 'spend' as SortKey, label: 'Spend' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                sortBy === option.key
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {sorted.map((channel, index) => {
          const isExpanded = expandedChannel === channel.channel;
          const roasBarWidth = channel.roas === Infinity ? 100 : (channel.roas / maxRoas) * 100;
          const cacChange = channel.cac - channel.previousCac;

          return (
            <div key={channel.channel}>
              {/* Main Row */}
              <button
                onClick={() => setExpandedChannel(isExpanded ? null : channel.channel)}
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left"
              >
                {/* Rank */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    backgroundColor: index === 0 ? '#fef3c7' : index === 1 ? '#e5e7eb' : index === 2 ? '#fed7aa' : '#f1f5f9',
                    color: index === 0 ? '#92400e' : index === 1 ? '#374151' : index === 2 ? '#9a3412' : '#64748b',
                  }}
                >
                  {index + 1}
                </div>

                {/* Channel Name */}
                <div className="min-w-[130px]">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: channel.color }}
                    />
                    <span className="font-medium text-sm text-slate-900 dark:text-white">
                      {channel.shortName}
                    </span>
                    <TrendIcon trend={channel.trend} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 ml-4.5">
                    {formatCurrency(channel.spend)} spend
                  </p>
                </div>

                {/* ROAS Bar */}
                <div className="flex-1 hidden sm:block">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">ROAS</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {channel.roas.toFixed(1)}x
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(roasBarWidth, 100)}%`,
                        backgroundColor: channel.color,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                </div>

                {/* LTV:CAC */}
                <div className="w-20 text-right hidden md:block">
                  <p className="text-xs text-slate-500">LTV:CAC</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {channel.ltvCacRatio.toFixed(1)}x
                  </p>
                </div>

                {/* Revenue */}
                <div className="w-24 text-right">
                  <p className="text-xs text-slate-500">Revenue</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(channel.revenue, true)}
                  </p>
                </div>

                {/* Expand Icon */}
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 bg-slate-50 dark:bg-slate-800/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {/* Customer Economics */}
                    <div className="bg-white dark:bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Target className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
                          Acquisition Cost
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(channel.cac)}
                      </p>
                      <p className={`text-xs mt-1 ${cacChange > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {cacChange > 0 ? '+' : ''}{formatCurrency(cacChange)} vs last month
                      </p>
                    </div>

                    {/* LTV */}
                    <div className="bg-white dark:bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Users className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
                          Customer LTV
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(channel.ltv365)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        90d: {formatCurrency(channel.ltv90)}
                      </p>
                    </div>

                    {/* Stickiness */}
                    <div className="bg-white dark:bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Repeat className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
                          Repeat Rate
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {channel.repeatRate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {channel.retentionAt90Days.toFixed(0)}% active at 90d
                      </p>
                    </div>

                    {/* Time to Second Purchase */}
                    <div className="bg-white dark:bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
                          2nd Purchase
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {channel.avgDaysToSecondPurchase}d
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        avg time to reorder
                      </p>
                    </div>
                  </div>

                  {/* CEO Insight for this channel */}
                  <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
                      💡 CEO Insight
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      {getChannelInsight(channel)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getChannelInsight(channel: ChannelROI): string {
  if (channel.icon === 'email') {
    return `Email customers are ${(channel.repeatRate / 24.2).toFixed(1)}x more likely to repurchase than Meta-acquired customers. At ${formatCurrency(channel.cac)} CAC, every dollar here is worth ${channel.ltvCacRatio.toFixed(0)}x. Consider increasing email frequency.`;
  }
  if (channel.icon === 'affiliate') {
    return `Affiliate-acquired customers have ${channel.repeatRate.toFixed(0)}% repeat rate and ${formatCurrency(channel.ltv365)} LTV - second only to email. This channel is under-invested at ${formatCurrency(channel.spend)}/mo. Doubling spend here could yield ${channel.roas.toFixed(0)}x returns.`;
  }
  if (channel.icon === 'meta') {
    return `ROAS declining from ${channel.previousRoas.toFixed(1)}x to ${channel.roas.toFixed(1)}x while CAC rose ${formatCurrency(channel.cac - channel.previousCac)}. But Meta drives ${channel.newCustomers.toLocaleString()} new customers/mo - it's a volume play. Watch the ${channel.ltvCacRatio.toFixed(1)}x LTV:CAC ratio.`;
  }
  if (channel.icon === 'google') {
    return `Google customers convert at ${channel.conversionRate.toFixed(1)}% (vs Meta's ${channels_convRate('meta')}%) and have better 365d LTV at ${formatCurrency(channel.ltv365)}. High-intent channel. Worth testing higher bids on branded terms.`;
  }
  if (channel.icon === 'amazon') {
    return `Amazon ROAS improved to ${channel.roas.toFixed(1)}x with ${channel.conversionRate.toFixed(1)}% conversion. But repeat rate is only ${channel.repeatRate.toFixed(0)}% - Amazon owns the customer relationship. Focus on driving Amazon-to-Shopify migration.`;
  }
  if (channel.icon === 'tiktok') {
    return `TikTok is the youngest channel with lowest ROAS (${channel.roas.toFixed(1)}x) but fastest improvement (+${((channel.roas - channel.previousRoas) / channel.previousRoas * 100).toFixed(0)}% MoM). Low repeat rate (${channel.repeatRate.toFixed(0)}%) suggests impulse buyers. Test subscription offers for TikTok traffic.`;
  }
  if (channel.icon === 'walmart') {
    return `Walmart is growing fastest (+${((channel.roas - channel.previousRoas) / channel.previousRoas * 100).toFixed(0)}% ROAS improvement) but lowest LTV:CAC (${channel.ltvCacRatio.toFixed(1)}x) and repeat rate (${channel.repeatRate.toFixed(0)}%). Early innings - invest for share, optimize later.`;
  }
  return `LTV:CAC of ${channel.ltvCacRatio.toFixed(1)}x with ${channel.repeatRate.toFixed(0)}% repeat rate.`;
}

function channels_convRate(_icon: string): string {
  return '2.4';
}
