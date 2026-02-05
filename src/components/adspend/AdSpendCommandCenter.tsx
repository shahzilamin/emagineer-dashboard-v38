import {
  DollarSign,
  BarChart3,
  Target,
  Users,
  TrendingUp,
  TrendingDown,
  Zap,
} from 'lucide-react';
import { ChannelROILeaderboard } from './ChannelROILeaderboard';
import { OrganicPaidSplit } from './OrganicPaidSplit';
import { MarketplaceTracker } from './MarketplaceTracker';
import { SpendEfficiencyMatrix } from './SpendEfficiencyMatrix';
import { CACTrend } from './CACTrend';
import {
  channelROI,
  organicPaidSplit,
  marketplaceChannels,
  blendedCacTrend,
  adSpendSummary,
} from '../../data/adspend';
import { formatCurrency } from '../../utils/format';

export function AdSpendCommandCenter() {
  const summary = adSpendSummary;
  const cacRising = summary.blendedCac > summary.previousBlendedCac;
  const cacChange = summary.blendedCac - summary.previousBlendedCac;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Ad Spend & ROAS Command Center
          </h2>
          <p className="text-sm text-slate-500">
            What are you getting back for every dollar you spend?
          </p>
        </div>
      </div>

      {/* Hero Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Spend */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-slate-500">Total Spend MTD</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(summary.totalSpend, true)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            across {channelROI.filter((c) => c.spend > 0).length} paid channels
          </p>
        </div>

        {/* Blended ROAS */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-slate-500">Blended ROAS</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {summary.blendedRoas.toFixed(1)}x
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {formatCurrency(summary.totalSpend, true)} → {formatCurrency(channelROI.filter(c => c.spend > 0).reduce((s, c) => s + c.revenue, 0), true)}
          </p>
        </div>

        {/* Blended CAC */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${cacRising ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
              <Target className={`w-4 h-4 ${cacRising ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
            </div>
            <span className="text-xs font-medium text-slate-500">Blended CAC</span>
          </div>
          <p className={`text-2xl font-bold ${cacRising ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
            {formatCurrency(summary.blendedCac)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {cacRising ? (
              <TrendingUp className="w-3 h-3 text-red-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-emerald-500" />
            )}
            <span className={`text-xs ${cacRising ? 'text-red-600' : 'text-emerald-600'}`}>
              {cacChange >= 0 ? '+' : ''}{formatCurrency(cacChange)} MoM
            </span>
          </div>
        </div>

        {/* Avg LTV */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-medium text-slate-500">Avg 365d LTV</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(summary.avgLtv365)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            weighted by new customers
          </p>
        </div>

        {/* Marketplace Growth */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-xs font-medium text-slate-500">Marketplace Rev</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(summary.marketplaceRevenue, true)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-emerald-600">
              +{summary.marketplaceGrowth.toFixed(1)}% MoM
            </span>
          </div>
        </div>
      </div>

      {/* Channel ROI Leaderboard - Full Width */}
      <ChannelROILeaderboard channels={channelROI} />

      {/* Two-Column Layout: Efficiency Matrix + CAC Trend */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <SpendEfficiencyMatrix channels={channelROI} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <CACTrend
            data={blendedCacTrend}
            currentCac={summary.blendedCac}
            previousCac={summary.previousBlendedCac}
          />
        </div>
      </div>

      {/* Two-Column Layout: Organic/Paid Split + Marketplace */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <OrganicPaidSplit data={organicPaidSplit} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <MarketplaceTracker channels={marketplaceChannels} />
        </div>
      </div>
    </div>
  );
}
