import { DashboardProvider, useDashboard } from './contexts/DashboardContext';
import { DashboardLayout } from './components/layout';
import { WellBeforeDashboard } from './components/wellbefore';
import { D2CBuildersDashboard } from './components/d2cbuilders';
import { PortfolioDashboard } from './components/portfolio';
import { ScenarioPlanner } from './components/scenarios';

function DashboardContent() {
  const { company, view } = useDashboard();

  // Scenario planner works across all companies
  if (view === 'scenarios') {
    return <ScenarioPlanner />;
  }

  // Portfolio view
  if (company === 'portfolio') {
    return <PortfolioDashboard />;
  }

  // WellBefore - tabbed dashboard
  if (company === 'wellbefore') {
    return <WellBeforeDashboard />;
  }

  // D2C Builders - tabbed dashboard
  if (company === 'd2cbuilders') {
    return <D2CBuildersDashboard />;
  }

  return null;
}

function App() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </DashboardProvider>
  );
}

export default App;
