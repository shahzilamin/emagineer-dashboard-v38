import { Handshake, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { supplierTerms, totalTermsOpportunity, cashConversionCycle } from '../../data/cashflow';

const formatDollar = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function SupplierTermsTracker() {
  const ccc = cashConversionCycle;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Handshake className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Supplier Terms & CCC Optimization</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Working capital opportunity</p>
          <p className="text-base font-bold text-emerald-600 tabular-nums">{formatDollar(totalTermsOpportunity)}</p>
        </div>
      </div>

      {/* CCC Formula Visual */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">Cash Conversion Cycle</p>
        <div className="flex items-center justify-center gap-2 text-center flex-wrap">
          <div className="bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-600">
            <p className="text-xs text-slate-500 dark:text-slate-400">DIO</p>
            <p className="text-lg font-bold tabular-nums text-amber-600">{ccc.current.dio}d</p>
            <p className="text-xs text-slate-400">target: {ccc.target.dio}d</p>
          </div>
          <span className="text-lg font-bold text-slate-400">+</span>
          <div className="bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-600">
            <p className="text-xs text-slate-500 dark:text-slate-400">DSO</p>
            <p className="text-lg font-bold tabular-nums text-amber-600">{ccc.current.dso}d</p>
            <p className="text-xs text-slate-400">target: {ccc.target.dso}d</p>
          </div>
          <span className="text-lg font-bold text-slate-400">−</span>
          <div className="bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-600">
            <p className="text-xs text-slate-500 dark:text-slate-400">DPO</p>
            <p className="text-lg font-bold tabular-nums text-red-600">{ccc.current.dpo}d</p>
            <p className="text-xs text-slate-400">target: {ccc.target.dpo}d</p>
          </div>
          <span className="text-lg font-bold text-slate-400">=</span>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg px-4 py-2 border-2 border-blue-300 dark:border-blue-600">
            <p className="text-xs text-blue-600 dark:text-blue-300">CCC</p>
            <p className="text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-200">{ccc.current.ccc}d</p>
            <p className="text-xs text-blue-500">target: {ccc.target.ccc}d</p>
          </div>
        </div>

        {/* Cash locked */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Cash locked in operating cycle:</span>
          <span className="font-bold tabular-nums text-red-600">{formatDollar(ccc.cashLockedInCycle)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Potential to free (at target CCC):</span>
          <span className="font-bold tabular-nums text-emerald-600">{formatDollar(ccc.potentialFreed)}</span>
        </div>
      </div>

      {/* CCC Trend */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">12-Week CCC Trend</p>
        <div className="flex items-end gap-1" style={{ height: '60px' }}>
          {ccc.trend.map((w) => {
            const barH = ((w.ccc - 30) / 25) * 60; // scale 30-55 range to 0-60px
            const color = w.ccc <= 35 ? 'bg-emerald-500' : w.ccc <= 45 ? 'bg-amber-500' : 'bg-red-500';
            return (
              <div key={w.week} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className={clsx('w-full rounded-t', color)} style={{ height: `${Math.max(4, barH)}px` }} />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-400">{ccc.trend[0].week}</span>
          <span className="text-xs text-slate-400">{ccc.trend[ccc.trend.length - 1].week}</span>
        </div>
        {/* Target line reference */}
        <div className="flex items-center gap-1 mt-1">
          <div className="w-4 h-0.5 bg-emerald-500" />
          <span className="text-xs text-slate-400">≤35d = on target</span>
          <div className="w-4 h-0.5 bg-amber-500 ml-2" />
          <span className="text-xs text-slate-400">36-45d = acceptable</span>
          <div className="w-4 h-0.5 bg-red-500 ml-2" />
          <span className="text-xs text-slate-400">&gt;45d = needs action</span>
        </div>
      </div>

      {/* Supplier Terms Table */}
      <div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Supplier Payment Terms</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">Supplier</th>
                <th className="text-center py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">Terms</th>
                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">DPO</th>
                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">Standard</th>
                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">Spend/mo</th>
                <th className="text-right py-2 px-2 font-semibold text-emerald-600 dark:text-emerald-400">Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {supplierTerms.map((s) => (
                <tr key={s.supplier} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-1.5">
                      {s.flag === 'improvement-available' && (
                        <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      )}
                      <span className="font-medium text-slate-700 dark:text-slate-200">{s.supplier}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600 dark:text-slate-300">{s.currentTerms}</td>
                  <td className={clsx(
                    'py-2.5 px-2 text-right tabular-nums font-medium',
                    s.currentDPO < s.industryStandardDPO ? 'text-red-600' : 'text-emerald-600'
                  )}>
                    {s.currentDPO}d
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-slate-500 dark:text-slate-400">{s.industryStandardDPO}d</td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-slate-700 dark:text-slate-200">{formatDollar(s.monthlySpend)}</td>
                  <td className={clsx(
                    'py-2.5 px-2 text-right tabular-nums font-bold',
                    s.opportunityAmount > 5000 ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'
                  )}>
                    {formatDollar(s.opportunityAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 dark:border-slate-600">
                <td colSpan={5} className="py-2 px-2 text-right font-semibold text-slate-700 dark:text-slate-200">Total Opportunity</td>
                <td className="py-2 px-2 text-right font-bold tabular-nums text-emerald-600 text-sm">{formatDollar(totalTermsOpportunity)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* CEO Insight */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>💡 CEO Insight:</strong> Moving top 2 Chinese suppliers from Net 30 to Net 60 frees {formatDollar(totalTermsOpportunity)} in permanent working capital.
          That's equivalent to a {formatDollar(totalTermsOpportunity)} interest-free, no-dilution loan. Offer 2-year volume commitment as leverage.
        </p>
      </div>
    </div>
  );
}
