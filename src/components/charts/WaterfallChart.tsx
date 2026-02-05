import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  type LabelProps,
} from 'recharts';

export interface WaterfallItem {
  name: string;
  value: number;
  type: 'revenue' | 'cost' | 'subtotal' | 'total';
  color?: string;
  description?: string;
}

interface WaterfallChartProps {
  data: WaterfallItem[];
  height?: number;
  showLabels?: boolean;
  formatValue?: (value: number) => string;
}

interface WaterfallBarData {
  name: string;
  invisible: number;
  visible: number;
  total: number;
  type: string;
  color: string;
  description?: string;
  rawValue: number;
}

const DEFAULT_COLORS = {
  revenue: '#3b82f6',     // blue
  cost: '#ef4444',        // red
  subtotal: '#10b981',    // emerald
  totalPositive: '#10b981',
  totalNegative: '#ef4444',
};

function defaultFormatValue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function WaterfallChart({
  data,
  height = 320,
  showLabels = true,
  formatValue = defaultFormatValue,
}: WaterfallChartProps) {
  const chartData = useMemo(() => {
    let runningTotal = 0;
    const result: WaterfallBarData[] = [];

    for (const item of data) {
      if (item.type === 'revenue') {
        // Revenue starts from 0
        result.push({
          name: item.name,
          invisible: 0,
          visible: item.value,
          total: item.value,
          type: item.type,
          color: item.color || DEFAULT_COLORS.revenue,
          description: item.description,
          rawValue: item.value,
        });
        runningTotal = item.value;
      } else if (item.type === 'cost') {
        // Costs hang down from the running total
        const absValue = Math.abs(item.value);
        const newTotal = runningTotal - absValue;
        result.push({
          name: item.name,
          invisible: newTotal,
          visible: absValue,
          total: newTotal,
          type: item.type,
          color: item.color || DEFAULT_COLORS.cost,
          description: item.description,
          rawValue: -absValue,
        });
        runningTotal = newTotal;
      } else if (item.type === 'subtotal') {
        // Subtotals show the current running total from 0
        result.push({
          name: item.name,
          invisible: 0,
          visible: runningTotal,
          total: runningTotal,
          type: item.type,
          color: item.color || DEFAULT_COLORS.subtotal,
          description: item.description,
          rawValue: runningTotal,
        });
      } else if (item.type === 'total') {
        // Final total bar from 0
        result.push({
          name: item.name,
          invisible: 0,
          visible: runningTotal,
          total: runningTotal,
          type: item.type,
          color: item.color || (runningTotal >= 0 ? DEFAULT_COLORS.totalPositive : DEFAULT_COLORS.totalNegative),
          description: item.description,
          rawValue: runningTotal,
        });
      }
    }

    return result;
  }, [data]);

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map((d) => d.invisible + d.visible)) * 1.1;
  }, [chartData]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ top: showLabels ? 24 : 8, right: 12, bottom: 4, left: 12 }}
        barCategoryGap="20%"
      >
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: 'currentColor' }}
          tickLine={false}
          axisLine={{ stroke: 'currentColor', opacity: 0.1 }}
          className="text-slate-500 dark:text-slate-300"
          interval={0}
          angle={0}
        />
        <YAxis
          tickFormatter={(v: number) => formatValue(v)}
          tick={{ fontSize: 11, fill: 'currentColor' }}
          tickLine={false}
          axisLine={false}
          className="text-slate-400"
          domain={[0, maxValue]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;
            const entry = payload[0]?.payload as WaterfallBarData;
            if (!entry) return null;

            return (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3 text-sm">
                <p className="font-semibold text-slate-900 dark:text-white">{entry.name}</p>
                <p
                  className="font-bold mt-1"
                  style={{ color: entry.color }}
                >
                  {entry.type === 'cost' ? '-' : ''}{formatValue(Math.abs(entry.rawValue))}
                </p>
                {entry.description && (
                  <p className="text-xs text-slate-500 mt-1 max-w-[200px]">{entry.description}</p>
                )}
                {entry.type === 'cost' && (
                  <p className="text-xs text-slate-500 mt-1">
                    Running total: {formatValue(entry.total)}
                  </p>
                )}
              </div>
            );
          }}
          cursor={{ fill: 'transparent' }}
        />
        <ReferenceLine y={0} stroke="currentColor" strokeOpacity={0.1} />

        {/* Invisible base bar */}
        <Bar dataKey="invisible" stackId="waterfall" fill="transparent" radius={0} />

        {/* Visible bar */}
        <Bar
          dataKey="visible"
          stackId="waterfall"
          radius={[4, 4, 0, 0]}
          label={
            showLabels
              ? (props: LabelProps) => {
                  const x = Number(props.x) || 0;
                  const y = Number(props.y) || 0;
                  const width = Number(props.width) || 0;
                  const index = Number(props.index) || 0;
                  const entry = chartData[index];
                  if (!entry) return null;
                  const labelText = entry.type === 'cost'
                    ? `-${formatValue(Math.abs(entry.rawValue))}`
                    : formatValue(entry.rawValue);
                  return (
                    <text
                      x={x + width / 2}
                      y={y - 8}
                      fill="currentColor"
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={entry.type === 'subtotal' || entry.type === 'total' ? 700 : 500}
                      className="text-slate-600 dark:text-slate-300"
                    >
                      {labelText}
                    </text>
                  );
                }
              : false
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={entry.type === 'subtotal' || entry.type === 'total' ? 0.9 : 0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
