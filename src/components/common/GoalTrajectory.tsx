import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentPlain } from '../../utils/format';

interface GoalTrajectoryProps {
  title: string;
  current: number;
  target: number;
  daysElapsed: number;
  daysInPeriod: number;
  format?: 'currency' | 'number' | 'percent';
  historicalData?: { date: string; value: number }[];
}

interface TrajectoryStatus {
  status: 'on-track' | 'at-risk' | 'behind' | 'ahead';
  projectedEnd: number;
  requiredDailyRate: number;
  currentDailyRate: number;
  gapToClose: number;
  percentComplete: number;
  pacePercent: number;
}

function calculateTrajectory(
  current: number,
  target: number,
  daysElapsed: number,
  daysInPeriod: number
): TrajectoryStatus {
  const daysRemaining = daysInPeriod - daysElapsed;
  const percentComplete = (current / target) * 100;
  
  // Expected progress at this point
  const expectedProgress = (daysElapsed / daysInPeriod) * target;
  const pacePercent = (current / expectedProgress) * 100;
  
  // Current velocity
  const currentDailyRate = daysElapsed > 0 ? current / daysElapsed : 0;
  
  // Projected end based on current velocity
  const projectedEnd = currentDailyRate * daysInPeriod;
  
  // What we need per day to hit target
  const remaining = target - current;
  const requiredDailyRate = daysRemaining > 0 ? remaining / daysRemaining : 0;
  
  // Gap to close
  const gapToClose = target - projectedEnd;
  
  // Determine status
  let status: TrajectoryStatus['status'];
  if (projectedEnd >= target * 1.05) {
    status = 'ahead';
  } else if (projectedEnd >= target * 0.98) {
    status = 'on-track';
  } else if (projectedEnd >= target * 0.90) {
    status = 'at-risk';
  } else {
    status = 'behind';
  }
  
  return {
    status,
    projectedEnd,
    requiredDailyRate,
    currentDailyRate,
    gapToClose,
    percentComplete,
    pacePercent,
  };
}

function formatValue(value: number, format: 'currency' | 'number' | 'percent'): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value, value >= 10000);
    case 'percent':
      return formatPercentPlain(value);
    default:
      return formatNumber(value);
  }
}

const statusConfig = {
  'ahead': {
    color: 'emerald',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: CheckCircle2,
    label: 'Ahead of Target',
    barColor: 'bg-emerald-500',
  },
  'on-track': {
    color: 'blue',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
    icon: TrendingUp,
    label: 'On Track',
    barColor: 'bg-blue-500',
  },
  'at-risk': {
    color: 'amber',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-600 dark:text-amber-400',
    icon: AlertTriangle,
    label: 'At Risk',
    barColor: 'bg-amber-500',
  },
  'behind': {
    color: 'red',
    bgLight: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-600 dark:text-red-400',
    icon: TrendingDown,
    label: 'Behind Target',
    barColor: 'bg-red-500',
  },
};

export function GoalTrajectoryCard({
  title,
  current,
  target,
  daysElapsed,
  daysInPeriod,
  format = 'currency',
}: GoalTrajectoryProps) {
  const trajectory = calculateTrajectory(current, target, daysElapsed, daysInPeriod);
  const config = statusConfig[trajectory.status];
  const StatusIcon = config.icon;
  const daysRemaining = daysInPeriod - daysElapsed;

  return (
    <div className={`rounded-xl border p-5 ${config.bgLight} ${config.border}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white text-sm">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{daysRemaining} days remaining</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgLight} ${config.text}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{config.label}</span>
        </div>
      </div>

      {/* Progress Bar with Projection */}
      <div className="relative mb-4">
        <div className="w-full h-3 bg-white dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
          {/* Current Progress */}
          <div
            className={`h-full ${config.barColor} rounded-full relative`}
            style={{ width: `${Math.min(trajectory.percentComplete, 100)}%` }}
          />
        </div>
        
        {/* Target Marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500"
          style={{ left: '100%', transform: 'translateX(-50%)' }}
        />
        
        {/* Projected End Marker */}
        {trajectory.projectedEnd !== current && (
          <div
            className={`absolute top-0 h-3 border-r-2 border-dashed ${config.text.replace('text-', 'border-')}`}
            style={{ 
              left: `${Math.min((trajectory.projectedEnd / target) * 100, 120)}%`,
            }}
          >
            <div className={`absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium ${config.text} whitespace-nowrap`}>
              Projected
            </div>
          </div>
        )}
        
        {/* Expected Progress Marker */}
        <div
          className="absolute top-3.5 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-slate-400 dark:border-b-slate-500"
          style={{ left: `${(daysElapsed / daysInPeriod) * 100}%`, transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {formatValue(current, format)}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Current</p>
        </div>
        <div>
          <p className={`text-lg font-bold ${config.text}`}>
            {formatValue(trajectory.projectedEnd, format)}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Projected</p>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {formatValue(target, format)}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Target</p>
        </div>
      </div>

      {/* Velocity Insight */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        {trajectory.status === 'behind' || trajectory.status === 'at-risk' ? (
          <div className="flex items-center gap-2 text-xs">
            <ArrowRight className={`w-3.5 h-3.5 ${config.text}`} />
            <span className="text-slate-600 dark:text-slate-300">
              Need <span className={`font-semibold ${config.text}`}>
                {formatValue(trajectory.requiredDailyRate, format)}
              </span>/day to hit target
              <span className="text-slate-500 ml-1">
                (currently {formatValue(trajectory.currentDailyRate, format)}/day)
              </span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <Target className={`w-3.5 h-3.5 ${config.text}`} />
            <span className="text-slate-600 dark:text-slate-300">
              Pace: <span className={`font-semibold ${config.text}`}>
                {trajectory.pacePercent.toFixed(0)}%
              </span> of expected
              {trajectory.gapToClose < 0 && (
                <span className="text-emerald-600 ml-1">
                  (+{formatValue(Math.abs(trajectory.gapToClose), format)} buffer)
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function GoalTrajectoryGrid() {
  // Get current day of month for calculations
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysElapsed = now.getDate();

  // Import targets from data
  const goals = [
    { title: 'Revenue Target', current: 847320, target: 920000, format: 'currency' as const },
    { title: 'Orders Target', current: 12458, target: 13500, format: 'number' as const },
    { title: 'New Customers', current: 3890, target: 4200, format: 'number' as const },
    { title: 'Gross Margin', current: 42.5, target: 44, format: 'percent' as const },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Goal Trajectory
        </h2>
        <p className="text-sm text-slate-500">
          Day {daysElapsed} of {daysInMonth}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <GoalTrajectoryCard
            key={goal.title}
            title={goal.title}
            current={goal.current}
            target={goal.target}
            daysElapsed={daysElapsed}
            daysInPeriod={daysInMonth}
            format={goal.format}
          />
        ))}
      </div>
    </div>
  );
}
