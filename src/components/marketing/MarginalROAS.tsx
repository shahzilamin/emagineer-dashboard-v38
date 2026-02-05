import { useState } from 'react';
import { clsx } from 'clsx';
import { ArrowUp, ArrowDown, Minus, TrendingUp, ArrowRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { channelMarginalROAS, type ChannelMarginalROAS } from '../../data/marketing-intelligence';

const recConfig = {
  increase: { icon: ArrowUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', label: 'Scale' },
  hold: { icon: Minus, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Hold' },
  decrease: { icon: ArrowDown, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Reduce' },
};

function ChannelRow({ channel }: { channel: ChannelMarginalROAS }) {
  const config = recConfig[channel.recommendation];
  const Icon = config.icon;
  const spendGap = channel.optimalSpend - channel.currentSpend;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
      {/* Channel color + name */}
      <div className="flex items-center gap-2 w-24 flex-shrink-0">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: channel.color }} />
        <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{channel.shortName}</span>
      </div>

      {/* Marginal ROAS */}
      <div className="w-20 text-right flex-shrink-0">
        <p className={clsx('text-sm font-bold', channel.currentMarginalRoas >= 3 ? 'text-emerald-600' : channel.currentMarginalRoas >= 2 ? 'text-amber-600' : 'text-red-600')}>
          {channel.currentMarginalRoas.toFixed(1)}x
        </p>
        <p className="text-xs text-slate-500">mROAS</p>
      </div>

      {/* Spend bar (current vs optimal) */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <div
              className={clsx('h-full rounded-full transition-all', channel.recommendation === 'decrease' ? 'bg-red-500' : channel.recommendation === 'increase' ? 'bg-emerald-500' : 'bg-amber-500')}
              style={{ width: `${Math.min(100, (channel.currentSpend / channel.optimalSpend) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 w-16 text-right flex-shrink-0">
            {spendGap >= 0 ? '+' : ''}{spendGap > 0 ? `$${(spendGap / 1000).toFixed(1)}K` : `-$${(Math.abs(spendGap) / 1000).toFixed(1)}K`}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          ${(channel.currentSpend / 1000).toFixed(1)}K / ${(channel.optimalSpend / 1000).toFixed(1)}K optimal
        </p>
      </div>

      {/* Recommendation badge */}
      <div className={clsx('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0', config.bg, config.color)}>
        <Icon className="w-3 h-3" />
        {config.label}
      </div>
    </div>
  );
}

export function MarginalROAS() {
  const [selectedChannel, setSelectedChannel] = useState<string>('Meta');
  const selected = channelMarginalROAS.find(c => c.shortName === selectedChannel) || channelMarginalROAS[0];

  const scaleChannels = channelMarginalROAS.filter(c => c.recommendation === 'increase');

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Marginal ROAS - Diminishing Returns
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            What does the next $1K on each channel actually return?
          </p>
        </div>
        {scaleChannels.length > 0 && (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {scaleChannels.length} channels under-invested
            </span>
          </div>
        )}
      </div>

      {/* Channel rows - sorted by recommendation priority */}
      <div className="space-y-2 mb-5">
        {channelMarginalROAS
          .sort((a, b) => {
            const order = { increase: 0, hold: 1, decrease: 2 };
            return order[a.recommendation] - order[b.recommendation] || b.currentMarginalRoas - a.currentMarginalRoas;
          })
          .map((channel) => (
            <div
              key={channel.shortName}
              onClick={() => setSelectedChannel(channel.shortName)}
              className="cursor-pointer"
            >
              <ChannelRow channel={channel} />
            </div>
          ))}
      </div>

      {/* Diminishing Returns Curve for selected channel */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selected.color }} />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {selected.channel} - Returns Curve
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            {channelMarginalROAS.map(c => (
              <button
                key={c.shortName}
                onClick={() => setSelectedChannel(c.shortName)}
                className={clsx(
                  'text-xs px-2 py-0.5 rounded-full transition-colors',
                  selectedChannel === c.shortName
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                {c.shortName}
              </button>
            ))}
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selected.curve}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis
                dataKey="spendLevel"
                tick={{ fontSize: 12 }}
                className="text-slate-500"
                tickLine={false}
                label={{ value: 'Spend ($K)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-slate-500"
                tickLine={false}
                axisLine={false}
                label={{ value: 'mROAS', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg">
                      <p className="text-xs text-slate-500">At ${d.spendLevel}K spend</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{d.marginalRoas.toFixed(1)}x marginal ROAS</p>
                    </div>
                  );
                }}
              />
              <ReferenceLine
                y={2}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{ value: 'Breakeven', position: 'right', fill: '#ef4444', fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="marginalRoas"
                stroke={selected.color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: 'white', strokeWidth: 2, stroke: selected.color }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendation */}
        <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
          <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="font-medium text-slate-900 dark:text-white">{selected.shortName}:</span>{' '}
            {selected.recommendationText}
          </p>
        </div>
      </div>
    </div>
  );
}
