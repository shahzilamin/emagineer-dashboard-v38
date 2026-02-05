import { clsx } from 'clsx';
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Settings2,
  Megaphone,
} from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import type { DashboardTab } from '../../types';

const tabs: { id: DashboardTab; label: string; icon: typeof LayoutDashboard; shortcut: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, shortcut: '1' },
  { id: 'financial', label: 'Financial', icon: DollarSign, shortcut: '2' },
  { id: 'customers', label: 'Customers', icon: Users, shortcut: '3' },
  { id: 'operations', label: 'Operations', icon: Settings2, shortcut: '4' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, shortcut: '5' },
];

export function TabNavigation() {
  const { activeTab, setActiveTab, company, view } = useDashboard();

  // Don't show tabs for portfolio or scenarios view
  if (company === 'portfolio' || view === 'scenarios') return null;

  return (
    <div className="bg-white dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
      <div className="px-4 lg:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-400 font-mono">
                  {tab.shortcut}
                </kbd>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
