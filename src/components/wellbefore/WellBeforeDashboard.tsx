import { useDashboard } from '../../contexts/DashboardContext';
import { OverviewTab } from './tabs/OverviewTab';
import { FinancialTab } from './tabs/FinancialTab';
import { CustomersTab } from './tabs/CustomersTab';
import { OperationsTab } from './tabs/OperationsTab';
import { MarketingTab } from './tabs/MarketingTab';

export function WellBeforeDashboard() {
  const { activeTab } = useDashboard();

  return (
    <div className="max-w-7xl mx-auto">
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'financial' && <FinancialTab />}
      {activeTab === 'customers' && <CustomersTab />}
      {activeTab === 'operations' && <OperationsTab />}
      {activeTab === 'marketing' && <MarketingTab />}
    </div>
  );
}
