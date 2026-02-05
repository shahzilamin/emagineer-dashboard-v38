import { clsx } from 'clsx';
import { useEffect, useState, useRef } from 'react';
import {
  Sun,
  Moon,
  Lightbulb,
  Building2,
  Warehouse,
  Briefcase,
  ChevronDown,
  Calendar,
  RefreshCw,
  Download,
  Wifi,
  LayoutDashboard,
} from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import type { DashboardTab, TimeRange } from '../../types';

const companies = [
  { id: 'wellbefore', name: 'WellBefore', icon: Building2, revenue: '$10M DTC' },
  { id: 'd2cbuilders', name: 'D2C Builders', icon: Warehouse, revenue: '$2M 3PL' },
  { id: 'portfolio', name: 'Portfolio', icon: Briefcase, revenue: 'Combined' },
] as const;

const timeRanges: { id: TimeRange; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'year', label: 'This Year' },
];

const tabShortcuts: Record<string, DashboardTab> = {
  '1': 'overview',
  '2': 'financial',
  '3': 'customers',
  '4': 'operations',
  '5': 'marketing',
};

export function Header() {
  const { company, view, timeRange, darkMode, setCompany, setView, setActiveTab, setTimeRange, toggleDarkMode } =
    useDashboard();

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const companyRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setCompanyDropdownOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) {
        setTimeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside as EventListener);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as EventListener);
    };
  }, []);

  const currentCompany = companies.find((c) => c.id === company)!;
  const CompanyIcon = currentCompany.icon;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const key = e.key.toLowerCase();
      
      // Tab shortcuts (1-5)
      if (tabShortcuts[key] && company !== 'portfolio') {
        setActiveTab(tabShortcuts[key]);
        return;
      }

      switch (key) {
        case 's':
          setView('scenarios');
          break;
        case 'd':
          toggleDarkMode();
          break;
        case 'w':
          setCompany('wellbefore');
          break;
        case 'b':
          setCompany('d2cbuilders');
          break;
        case 'p':
          setCompany('portfolio');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setView, setActiveTab, toggleDarkMode, setCompany, company]);

  const handleExport = () => {
    const data = `Emagineer Dashboard Export\nGenerated: ${new Date().toLocaleString()}\n\nCompany: ${currentCompany.name}\nView: ${view}\nTime Range: ${timeRanges.find(t => t.id === timeRange)?.label}\n`;
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Company Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="hidden sm:block font-bold text-slate-900 dark:text-white">
                Emagineer
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            {/* Company Selector */}
            <div className="relative" ref={companyRef}>
              <button 
                onClick={() => {
                  setCompanyDropdownOpen(!companyDropdownOpen);
                  setTimeDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <CompanyIcon className="w-4 h-4 text-slate-500 dark:text-slate-300" />
                <span className="font-medium text-sm text-slate-900 dark:text-white">
                  {currentCompany.name}
                </span>
                <span className="hidden md:block text-xs text-slate-400">
                  {currentCompany.revenue}
                </span>
                <ChevronDown className={clsx("w-3.5 h-3.5 text-slate-400 transition-transform", companyDropdownOpen && "rotate-180")} />
              </button>

              {companyDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                  {companies.map((c) => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setCompany(c.id);
                          setCompanyDropdownOpen(false);
                        }}
                        className={clsx(
                          'w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors',
                          company === c.id && 'bg-blue-50 dark:bg-blue-900/20'
                        )}
                      >
                        <Icon
                          className={clsx(
                            'w-5 h-5',
                            company === c.id
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-400'
                          )}
                        />
                        <div className="text-left flex-1">
                          <p
                            className={clsx(
                              'font-medium',
                              company === c.id
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-900 dark:text-white'
                            )}
                          >
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-500">{c.revenue}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Live</span>
            </div>

            {/* Time Range Selector */}
            <div className="relative" ref={timeRef}>
              <button 
                onClick={() => {
                  setTimeDropdownOpen(!timeDropdownOpen);
                  setCompanyDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:block text-sm text-slate-700 dark:text-slate-300">
                  {timeRanges.find((t) => t.id === timeRange)?.label}
                </span>
                <ChevronDown className={clsx("w-3.5 h-3.5 text-slate-400 transition-transform", timeDropdownOpen && "rotate-180")} />
              </button>

              {timeDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                  {timeRanges.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTimeRange(t.id);
                        setTimeDropdownOpen(false);
                      }}
                      className={clsx(
                        'w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors',
                        timeRange === t.id
                          ? 'text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-slate-700 dark:text-slate-300'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* What-If Mode Toggle */}
            <button
              onClick={() => setView(view === 'scenarios' ? 'executive' : 'scenarios')}
              title="What-If Scenario Planner (S)"
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                view === 'scenarios'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              )}
            >
              <Lightbulb className="w-4 h-4" />
              <span className="hidden md:block">What-If</span>
            </button>

            {/* Back to Dashboard (when in scenarios) */}
            {view === 'scenarios' && (
              <button
                onClick={() => setView('executive')}
                title="Back to Dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:block">Dashboard</span>
              </button>
            )}

            {/* Export */}
            <button
              onClick={handleExport}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Export Dashboard (CSV)"
            >
              <Download className="w-4 h-4 text-slate-500" />
            </button>

            {/* Refresh */}
            <button
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`${darkMode ? 'Light' : 'Dark'} mode (D)`}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
