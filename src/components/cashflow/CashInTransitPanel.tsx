import { Truck, Clock, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import {
  cashInTransit,
  totalInTransit,
  totalReserves,
  inTransitAsPercentOfRevenue,
  cashRunway,
} from '../../data/cashflow';

const formatDollar = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function CashInTransitPanel() {
  const maxPending = Math.max(...cashInTransit.map((c) => c.pendingAmount));
  const transitPctColor =
    inTransitAsPercentOfRevenue < 10 ? 'text-emerald-600' :
    inTransitAsPercentOfRevenue < 20 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Cash In-Transit</h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">{formatDollar(totalInTransit)}</p>
          <p className={clsx('text-xs', transitPctColor)}>
            {inTransitAsPercentOfRevenue.toFixed(1)}% of monthly revenue
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">Pending Payouts</p>
          <p className="text-base font-bold tabular-nums text-slate-900 dark:text-white">{formatDollar(totalInTransit)}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">Reserves Held</p>
          <p className="text-base font-bold tabular-nums text-amber-600 dark:text-amber-400">{formatDollar(totalReserves)}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">Available Cash</p>
          <p className="text-base font-bold tabular-nums text-emerald-600">{formatDollar(cashRunway.currentCash)}</p>
        </div>
      </div>

      {/* Channel breakdown */}
      <div className="space-y-3">
        {cashInTransit.map((ch) => (
          <div key={ch.channel} className="flex items-center gap-3">
            {/* Channel name */}
            <div className="w-20 flex-shrink-0">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{ch.shortName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{ch.avgPayoutDays}d avg</p>
            </div>

            {/* Bar */}
            <div className="flex-1">
              <div className="w-full h-5 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden relative">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${(ch.pendingAmount / maxPending) * 100}%`,
                    backgroundColor: ch.color,
                    opacity: 0.8,
                  }}
                />
                {ch.reserveHeld > 0 && (
                  <div
                    className="absolute top-0 h-full bg-red-500/30 border-r-2 border-red-500"
                    style={{
                      left: `${((ch.pendingAmount - ch.reserveHeld) / maxPending) * 100}%`,
                      width: `${(ch.reserveHeld / maxPending) * 100}%`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Amount + next payout */}
            <div className="w-28 text-right flex-shrink-0">
              <p className="text-xs font-bold tabular-nums text-slate-900 dark:text-white">{formatDollar(ch.pendingAmount)}</p>
              <div className="flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">{ch.nextPayoutDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Amazon reserve warning */}
      {totalReserves > 0 && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Amazon is holding {formatDollar(totalReserves)} in reserves.</strong>{' '}
            This cash exists but is inaccessible. During peak periods, Amazon holds can extend to 4-6 weeks.
            Factor this into inventory PO decisions.
          </p>
        </div>
      )}

      {/* CEO Insight */}
      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>💡 Insight:</strong> {formatDollar(totalInTransit)} is cash you HAVE but can't USE. As marketplace share grows,
          more revenue gets locked in longer payout cycles. Shifting 5% of marketplace revenue to DTC would free ~{formatDollar(totalInTransit * 0.05 * 3)} annually in float.
        </p>
      </div>
    </div>
  );
}
