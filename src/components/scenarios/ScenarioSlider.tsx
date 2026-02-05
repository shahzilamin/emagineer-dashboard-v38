import { clsx } from 'clsx';
import { useId } from 'react';

interface ScenarioSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  prefix?: string;
  description?: string;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  baselineValue?: number;
  invertColor?: boolean;
}

export function ScenarioSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  prefix = '',
  description,
  onChange,
  formatValue,
  baselineValue,
  invertColor = false,
}: ScenarioSliderProps) {
  const id = useId();
  const diff = baselineValue !== undefined ? value - baselineValue : 0;
  const isPositive = invertColor ? diff < 0 : diff > 0;
  const isNegative = invertColor ? diff > 0 : diff < 0;
  const isChanged = Math.abs(diff) > 0.001;

  const displayValue = formatValue
    ? formatValue(value)
    : `${prefix}${value.toLocaleString()}${unit}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
            {displayValue}
          </span>
          {isChanged && (
            <span
              className={clsx(
                'text-xs font-medium px-1.5 py-0.5 rounded-full tabular-nums',
                isPositive && 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
                isNegative && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              )}
            >
              {diff > 0 ? '+' : ''}{formatValue ? formatValue(diff) : `${prefix}${diff.toLocaleString()}${unit}`}
            </span>
          )}
        </div>
      </div>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-500">{description}</p>
      )}
      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-600
            bg-slate-200 dark:bg-slate-700
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:hover:bg-blue-700 [&::-webkit-slider-thumb]:transition-colors
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-slate-800"
        />
        {baselineValue !== undefined && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400 dark:bg-slate-500 pointer-events-none rounded-full"
            style={{ left: `${((baselineValue - min) / (max - min)) * 100}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{formatValue ? formatValue(min) : `${prefix}${min.toLocaleString()}${unit}`}</span>
        <span>{formatValue ? formatValue(max) : `${prefix}${max.toLocaleString()}${unit}`}</span>
      </div>
    </div>
  );
}
