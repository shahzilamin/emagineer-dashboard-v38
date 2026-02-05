import { clsx } from 'clsx';
import { Clock, AlertTriangle, CheckCircle2, Timer } from 'lucide-react';
import { cacPaybackByChannel, type CACPaybackChannel } from '../../data/marketing-intelligence';
import { formatCurrency } from '../../utils/format';

const statusConfig = {
  healthy: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500', barBg: 'bg-emerald-100 dark:bg-emerald-900/30', label: '< 3 mo', icon: CheckCircle2 },
  watch: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500', barBg: 'bg-amber-100 dark:bg-amber-900/30', label: '3-6 mo', icon: Timer },
  danger: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500', barBg: 'bg-red-100 dark:bg-red-900/30', label: '> 6 mo', icon: AlertTriangle },
};

function PaybackBar({ channel }: { channel: CACPaybackChannel }) {
  const config = statusConfig[channel.status];
  const maxMonths = 12;
  const widthPct = Math.min(100, (channel.paybackMonths / maxMonths) * 100);

  return (
    <div className="flex items-center gap-3 group">
      {/* Channel name */}
      <div className="w-20 flex-shrink-0 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: channel.color }} />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{channel.shortName}</span>
      </div>

      {/* Bar */}
      <div className="flex-1 min-w-0">
        <div className="relative h-7 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
          {/* Reference lines at 3 and 6 months */}
          <div className="absolute top-0 bottom-0 left-1/4 w-px bg-slate-300/50 dark:bg-slate-600/50 z-10" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-300/50 dark:bg-slate-600/50 z-10" />

          <div
            className={clsx('h-full rounded-lg flex items-center justify-end pr-2 transition-all', config.bg)}
            style={{ width: `${widthPct}%`, minWidth: '40px' }}
          >
            <span className="text-xs font-bold text-white">
              {channel.paybackMonths.toFixed(1)}mo
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-0.5 px-1">
          <span>0</span>
          <span>3mo</span>
          <span>6mo</span>
          <span>12mo</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
        <div className="text-right w-14">
          <p className="text-xs text-slate-500">CAC</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(channel.cac)}</p>
        </div>
        <div className="text-right w-14">
          <p className="text-xs text-slate-500">LTV</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(channel.ltv365)}</p>
        </div>
        <div className="text-right w-14">
          <p className="text-xs text-slate-500">LTV:CAC</p>
          <p className={clsx('text-sm font-bold', channel.ltvCacRatio > 10 ? 'text-emerald-600' : channel.ltvCacRatio > 5 ? 'text-amber-600' : 'text-red-600')}>
            {channel.ltvCacRatio.toFixed(1)}x
          </p>
        </div>
      </div>
    </div>
  );
}

export function CACPayback() {
  const healthyCount = cacPaybackByChannel.filter(c => c.status === 'healthy').length;
  const dangerCount = cacPaybackByChannel.filter(c => c.status === 'danger').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            CAC Payback by Channel
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            How fast does each channel's customers become profitable?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">
            {healthyCount} fast payback
          </span>
          {dangerCount > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">
              {dangerCount} slow payback
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {cacPaybackByChannel.map((channel) => (
          <PaybackBar key={channel.shortName} channel={channel} />
        ))}
      </div>

      {/* Insight */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(statusConfig).map(([status, config]) => {
            const channels = cacPaybackByChannel.filter(c => c.status === status);
            if (channels.length === 0) return null;
            const Icon = config.icon;
            return (
              <div key={status} className={clsx('p-3 rounded-lg', config.barBg)}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={clsx('w-3.5 h-3.5', config.color)} />
                  <span className={clsx('text-xs font-semibold', config.color)}>{config.label} payback</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {channels.map(c => c.shortName).join(', ')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
