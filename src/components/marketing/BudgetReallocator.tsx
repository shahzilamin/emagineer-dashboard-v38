import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { budgetReallocations, type ReallocationSuggestion } from '../../data/marketing-intelligence';
import { formatCurrency } from '../../utils/format';

function ReallocationRow({ suggestion }: { suggestion: ReallocationSuggestion }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-sm font-medium text-red-600 dark:text-red-400 whitespace-nowrap">{suggestion.from}</span>
        <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{suggestion.to}</span>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
        {formatCurrency(suggestion.amount, true)}
      </span>
      <div className="hidden sm:block text-right min-w-0 flex-1">
        <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{suggestion.projectedImpact}</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{suggestion.confidence}%</span>
      </div>
    </div>
  );
}

export function BudgetReallocator() {
  const totalReallocation = budgetReallocations.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Budget Reallocation Recommendations
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Where to move the next dollar based on marginal returns
          </p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">
            {formatCurrency(totalReallocation, true)} to shift
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {budgetReallocations.map((suggestion, i) => (
          <ReallocationRow key={i} suggestion={suggestion} />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
          <span className="font-medium text-slate-700 dark:text-slate-300">Net impact:</span>{' '}
          Same total spend, projected +{formatCurrency(91600)} monthly revenue from better allocation.
          Based on marginal ROAS curves and historical channel performance.
        </p>
      </div>
    </div>
  );
}
