import type { ReactNode } from 'react';
import { Header } from './Header';
import { TabNavigation } from './TabNavigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <TabNavigation />
      <main className="px-4 lg:px-6 py-6">{children}</main>
    </div>
  );
}
