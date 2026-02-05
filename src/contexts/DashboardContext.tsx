import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { DashboardState, DashboardTab, TimeRange } from '../types';

interface DashboardContextType extends DashboardState {
  setCompany: (company: DashboardState['company']) => void;
  setView: (view: DashboardState['view']) => void;
  setActiveTab: (tab: DashboardTab) => void;
  setTimeRange: (range: TimeRange) => void;
  toggleDarkMode: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(() => {
    // Check for saved preferences
    const saved = localStorage.getItem('dashboard-preferences-v21');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure activeTab exists (migration from v20)
        if (!parsed.activeTab) parsed.activeTab = 'overview';
        // Migrate old 'operator' view to 'executive' with 'operations' tab
        if (parsed.view === 'operator') {
          parsed.view = 'executive';
          parsed.activeTab = 'operations';
        }
        return parsed;
      } catch {
        // Fall through to defaults
      }
    }

    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return {
      company: 'wellbefore',
      view: 'executive',
      activeTab: 'overview' as DashboardTab,
      timeRange: 'month' as TimeRange,
      darkMode: prefersDark,
    };
  });

  // Save preferences
  useEffect(() => {
    localStorage.setItem('dashboard-preferences-v21', JSON.stringify(state));
  }, [state]);

  // Apply dark mode to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  const setCompany = (company: DashboardState['company']) => {
    setState((prev) => ({ ...prev, company, activeTab: 'overview' }));
  };

  const setView = (view: DashboardState['view']) => {
    setState((prev) => ({ ...prev, view }));
  };

  const setActiveTab = (activeTab: DashboardTab) => {
    setState((prev) => ({ ...prev, activeTab, view: 'executive' }));
  };

  const setTimeRange = (timeRange: TimeRange) => {
    setState((prev) => ({ ...prev, timeRange }));
  };

  const toggleDarkMode = () => {
    setState((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <DashboardContext.Provider
      value={{
        ...state,
        setCompany,
        setView,
        setActiveTab,
        setTimeRange,
        toggleDarkMode,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
