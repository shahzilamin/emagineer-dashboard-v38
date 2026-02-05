import { useState } from 'react';
import { Repeat, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cashConversionMetrics } from '../../data/tariffs';

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function CycleGauge({ label, days, target, color, description }: {
  label: string;
  days: number;
  target: string;
  color: string;
  description: string;
}) {
  const maxDays = 80;
  const width = Math.min((days / maxDays) * 100, 100);

  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
        <span className="text-xs text-slate-500">Target: {target}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${width}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-lg font-bold text-slate-900 dark:text-white w-12 text-right">
          {days}d
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
  );
}

export function CashConversionCycle() {
  const [showForecast, setShowForecast] = useState(false);
  const metrics = cashConversionMetrics;
  const cccHealthy = metrics.ccc <= metrics.targetCcc;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-teal-500" />
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              Cash Conversion Cycle
            </h4>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              cccHealthy
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            }`}>
              {cccHealthy ? 'HEALTHY' : 'WATCH'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Prev: {metrics.previousCcc}d</span>
            <span className="text-slate-300">|</span>
            <span>Target: &lt;{metrics.targetCcc}d</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* CCC Formula Visual */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2">
            <p className="text-xs text-blue-600 dark:text-blue-300">DIO</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">{metrics.dio}</p>
            <p className="text-xs text-blue-500">days</p>
          </div>
          <span className="text-2xl font-bold text-slate-400">+</span>
          <div className="text-center bg-purple-50 dark:bg-purple-900/20 rounded-lg px-4 py-2">
            <p className="text-xs text-purple-600 dark:text-purple-300">DSO</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">{metrics.dso}</p>
            <p className="text-xs text-purple-500">days</p>
          </div>
          <span className="text-2xl font-bold text-slate-400">−</span>
          <div className="text-center bg-teal-50 dark:bg-teal-900/20 rounded-lg px-4 py-2">
            <p className="text-xs text-teal-600 dark:text-teal-300">DPO</p>
            <p className="text-2xl font-bold text-teal-700 dark:text-teal-200">{metrics.dpo}</p>
            <p className="text-xs text-teal-500">days</p>
          </div>
          <span className="text-2xl font-bold text-slate-400">=</span>
          <div className={`text-center rounded-lg px-4 py-2 ${
            cccHealthy
              ? 'bg-emerald-50 dark:bg-emerald-900/20'
              : 'bg-amber-50 dark:bg-amber-900/20'
          }`}>
            <p className={`text-xs ${cccHealthy ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'}`}>CCC</p>
            <p className={`text-2xl font-bold ${cccHealthy ? 'text-emerald-700 dark:text-emerald-200' : 'text-amber-700 dark:text-amber-200'}`}>{metrics.ccc}</p>
            <p className={`text-xs ${cccHealthy ? 'text-emerald-500' : 'text-amber-500'}`}>days</p>
          </div>
        </div>

        {/* Component gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <CycleGauge
            label="Days Inventory Outstanding"
            days={metrics.dio}
            target="30-45d"
            color="#3b82f6"
            description="Inventory sits 52 days before selling. Tariff cost increase = more cash per unit in warehouse."
          />
          <CycleGauge
            label="Days Sales Outstanding"
            days={metrics.dso}
            target="0-3d"
            color="#8b5cf6"
            description="DTC payments are near-instant. This is WellBefore's advantage."
          />
          <CycleGauge
            label="Days Payables Outstanding"
            days={metrics.dpo}
            target="45-60d"
            color="#14b8a6"
            description="38 days to pay suppliers. Negotiating to 50d would improve CCC by 12 days."
          />
        </div>

        {/* Tariff impact on CCC */}
        {metrics.tariffImpactOnCcc > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                Tariffs added ~{metrics.tariffImpactOnCcc} days to your CCC
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                Higher landed costs = more cash tied up per unit of inventory. At {metrics.dio} days DIO and {formatCurrency(metrics.inventoryValue)} inventory value, each day of DIO costs ~{formatCurrency(metrics.inventoryValue / metrics.dio)}/day in working capital.
              </p>
            </div>
          </div>
        )}

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Inventory Value</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(metrics.inventoryValue)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Monthly Burn</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(metrics.monthlyBurn)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Cash Runway</p>
            <p className={`text-lg font-bold ${metrics.cashRunway > 6 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {metrics.cashRunway} mo
            </p>
          </div>
        </div>

        {/* 13-Week Cash Forecast toggle */}
        <div>
          <button
            onClick={() => setShowForecast(!showForecast)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              13-Week Cash Flow Forecast
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {metrics.weeklyForecast.filter((w) => w.projected).length} weeks projected
              </span>
              {showForecast ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {showForecast && (
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.weeklyForecast} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v: number) => `$${(v / 1000000).toFixed(1)}M`}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      if (!d) return null;
                      return (
                        <div className="bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl">
                          <p className="font-bold">{d.label} {d.projected ? '(Projected)' : '(Actual)'}</p>
                          <div className="mt-1 space-y-0.5">
                            <p className="text-emerald-300">Inflow: {formatCurrency(d.inflow)}</p>
                            <p className="text-red-300">Outflow: {formatCurrency(d.outflow)}</p>
                            <p className="text-blue-300 font-bold">Balance: {formatCurrency(d.balance)}</p>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine
                    y={1500000}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{ value: 'Min Reserve', position: 'insideTopLeft', fill: '#ef4444', fontSize: 10 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#3b82f6"
                    fill="url(#balanceGradient)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Actual
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full border border-blue-500" />
                  Projected
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0 border-t border-dashed border-red-500" />
                  Min Reserve ($1.5M)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
