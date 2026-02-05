import { Users } from 'lucide-react';
import { CohortHeatmap } from './CohortHeatmap';
import { ChannelQuality } from './ChannelQuality';
import { CohortInsights } from './CohortInsights';
import { cohortRetentionData, channelCohortQuality } from '../../data/cohorts';

export function CohortAnalytics() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Customer Cohort & Retention Analytics
          </h2>
          <p className="text-sm text-slate-500">
            The #1 indicator of whether this business can 100x — are customers coming back?
          </p>
        </div>
      </div>

      {/* Key Insights + Summary Stats */}
      <CohortInsights retentionData={cohortRetentionData} channelData={channelCohortQuality} />

      {/* Cohort Retention Heatmap */}
      <CohortHeatmap data={cohortRetentionData} />

      {/* Channel Acquisition Quality */}
      <ChannelQuality data={channelCohortQuality} />
    </div>
  );
}
