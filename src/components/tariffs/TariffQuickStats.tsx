import { Shield, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { tariffQuickStats } from '../../data/tariffs';

const riskColors: Record<string, string> = {
  low: 'text-emerald-300',
  medium: 'text-amber-300',
  high: 'text-orange-300',
  critical: 'text-red-300',
};

export function TariffQuickStats() {
  const stats = tariffQuickStats;
  const riskColor = riskColors[stats.sourcingRisk] || 'text-amber-300';

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg backdrop-blur-sm">
        <Shield className="w-4 h-4 text-blue-200 flex-shrink-0" />
        <div className="flex items-center gap-4 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-300">Tariff Rate</span>
            <span className="font-bold tabular-nums text-white">
              {stats.avgEffectiveTariffRate}%
            </span>
          </div>

          <div className="w-px h-4 bg-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-300">Cost/mo</span>
            <span className="font-bold tabular-nums text-white">
              ${Math.round(stats.monthlyTariffCost / 1000)}K
            </span>
          </div>

          <div className="w-px h-4 bg-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-300">Margin Hit</span>
            <span className="font-bold tabular-nums text-red-300">
              -{stats.marginErosion}pp
            </span>
            <AlertTriangle className="w-3 h-3 text-red-300" />
          </div>

          <div className="w-px h-4 bg-slate-600 flex-shrink-0" />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-300">Risk</span>
            <span className={clsx('font-bold uppercase', riskColor)}>
              {stats.sourcingRisk}
            </span>
          </div>

          <div className="w-px h-4 bg-slate-600 flex-shrink-0" />

          <span className="text-slate-400 whitespace-nowrap truncate max-w-[180px]">
            ⚠ {stats.mostVulnerableProduct} ({stats.mostVulnerableMarginDelta}pp)
          </span>
        </div>
      </div>
    </div>
  );
}
