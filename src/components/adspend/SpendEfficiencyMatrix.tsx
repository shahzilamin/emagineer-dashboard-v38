import { useState } from 'react';
import type { ChannelROI } from '../../data/adspend';
import { formatCurrency } from '../../utils/format';

interface SpendEfficiencyMatrixProps {
  channels: ChannelROI[];
}

export function SpendEfficiencyMatrix({ channels }: SpendEfficiencyMatrixProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Only paid channels
  const paidChannels = channels.filter((c) => c.spend > 0);

  // Matrix dimensions: X = ROAS, Y = LTV:CAC ratio
  // Bubble size = spend amount
  const maxSpend = Math.max(...paidChannels.map((c) => c.spend));
  const maxRoas = Math.max(...paidChannels.map((c) => c.roas));
  const maxLtvCac = Math.max(...paidChannels.map((c) => c.ltvCacRatio));

  // Quadrant thresholds
  const roasMidpoint = 5; // Below 5x = low ROAS
  const ltvCacMidpoint = 10; // Below 10x = low LTV:CAC

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Spend Efficiency Matrix
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          ROAS vs Customer Quality - bubble size = spend
        </p>
      </div>

      {/* Matrix */}
      <div className="relative h-72 border-l-2 border-b-2 border-slate-200 dark:border-slate-600 ml-8 mb-6">
        {/* Quadrant Labels (Lux: bolder, more visible) */}
        <div className="absolute top-2 right-3 text-sm text-emerald-600 dark:text-emerald-400 font-bold">
          ★ Scale Winners
        </div>
        <div className="absolute top-2 left-3 text-sm text-amber-600 dark:text-amber-400 font-bold">
          Nurture
        </div>
        <div className="absolute bottom-2 right-3 text-sm text-blue-600 dark:text-blue-400 font-bold">
          Cash Cows
        </div>
        <div className="absolute bottom-2 left-3 text-sm text-red-600 dark:text-red-400 font-bold">
          Rethink
        </div>

        {/* Midlines */}
        <div
          className="absolute border-t border-dashed border-slate-300 dark:border-slate-600 w-full"
          style={{ top: `${(1 - ltvCacMidpoint / (maxLtvCac * 1.1)) * 100}%` }}
        />
        <div
          className="absolute border-l border-dashed border-slate-300 dark:border-slate-600 h-full"
          style={{ left: `${(roasMidpoint / (maxRoas * 1.1)) * 100}%` }}
        />

        {/* Axis Labels */}
        <div className="absolute -left-8 top-0 text-xs text-slate-500 font-medium transform -rotate-90 origin-center" style={{ left: '-28px', top: '45%' }}>
          LTV:CAC →
        </div>
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-500 font-medium">
          ROAS →
        </div>

        {/* Bubbles */}
        {paidChannels.map((channel) => {
          const x = (channel.roas / (maxRoas * 1.1)) * 100;
          const y = (1 - channel.ltvCacRatio / (maxLtvCac * 1.1)) * 100;
          const size = Math.max(24, (channel.spend / maxSpend) * 56);
          const isHovered = hovered === channel.channel;

          return (
            <div
              key={channel.channel}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                zIndex: isHovered ? 20 : 10,
              }}
              onMouseEnter={() => setHovered(channel.channel)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Bubble */}
              <div
                className="rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-transform duration-200"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: channel.color,
                  opacity: isHovered ? 1 : 0.85,
                  transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                  fontSize: size < 32 ? '9px' : '11px',
                }}
              >
                {channel.shortName.substring(0, 3)}
              </div>

              {/* Tooltip */}
              {isHovered && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white rounded-lg p-3 text-xs whitespace-nowrap z-30 shadow-xl">
                  <p className="font-semibold mb-1">{channel.channel}</p>
                  <div className="space-y-0.5 text-slate-300">
                    <p>Spend: {formatCurrency(channel.spend)}</p>
                    <p>ROAS: {channel.roas.toFixed(1)}x</p>
                    <p>LTV:CAC: {channel.ltvCacRatio.toFixed(1)}x</p>
                    <p>Repeat: {channel.repeatRate.toFixed(1)}%</p>
                  </div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-2">
        {paidChannels.map((ch) => (
          <div key={ch.channel} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: ch.color }}
            />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {ch.shortName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
