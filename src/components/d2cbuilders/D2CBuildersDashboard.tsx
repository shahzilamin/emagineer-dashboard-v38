import { useDashboard } from '../../contexts/DashboardContext';
import { D2COverviewTab } from './tabs/OverviewTab';
import { D2CFinancialTab } from './tabs/FinancialTab';
import { D2CCustomersTab } from './tabs/CustomersTab';
import { D2COperationsTab } from './tabs/OperationsTab';
import { D2CMarketingTab } from './tabs/MarketingTab';

export function D2CBuildersDashboard() {
  const { activeTab } = useDashboard();

  return (
    <div className="max-w-7xl mx-auto">
      {activeTab === 'overview' && <D2COverviewTab />}
      {activeTab === 'financial' && <D2CFinancialTab />}
      {activeTab === 'customers' && <D2CCustomersTab />}
      {activeTab === 'operations' && <D2COperationsTab />}
      {activeTab === 'marketing' && <D2CMarketingTab />}
    </div>
  );
}
