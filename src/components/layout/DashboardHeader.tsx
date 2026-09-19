import React from 'react';
import {
  Bell,
  Search,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { NavItem } from './Sidebar';

interface DashboardHeaderProps {
  currentTab: NavItem;
  onSearch?: (query: string) => void;
  onOpenReportModal?: () => void;
  onSwitchTab: (tab: NavItem) => void;
}

const TAB_TITLES: Record<NavItem, { title: string; subtitle: string }> = {
  overview: {
    title: 'Insurance Analytics Overview',
    subtitle: 'Monitor claims performance, member utilization, provider activity and financial risk.',
  },
  claims: {
    title: 'Claims Analytics & Severity',
    subtitle: 'Analyze claims volume, severity, frequency, approval/rejection patterns and financial exposure.',
  },
  members: {
    title: 'Member Utilization & Risk Analytics',
    subtitle: 'Understand demographic utilization, chronic cohorts, and actuarial member risk segments.',
  },
  providers: {
    title: 'Provider Performance Analytics',
    subtitle: 'Benchmarking hospitals, clinics and specialist centers across cost, SLA velocity and billing anomalies.',
  },
  risk: {
    title: 'Risk & Fraud Intelligence',
    subtitle: 'Decision-support anomaly detection, statistical variance screening and claims audit exposure.',
  },
  financial: {
    title: 'Financial Performance & Underwriting',
    subtitle: 'Premium revenue versus claims cost, loss ratio trajectory and portfolio underwriting surplus.',
  },
  trends: {
    title: 'Trends & Actuarial Forecasting',
    subtitle: '12-month projections with 95% confidence intervals based on time-series decomposition models.',
  },
  explorer: {
    title: 'Claims Data Explorer',
    subtitle: 'Interactive tabular intelligence with multi-column filtering, risk scoring, and raw dataset export.',
  },
  reports: {
    title: 'Executive Analytics Reports',
    subtitle: 'Formal executive dossiers, provider audits and actuarial underwriting briefs ready for export.',
  },
  settings: {
    title: 'System & Python REST API Configuration',
    subtitle: 'Manage connection to the Python backend analytics service, simulation parameters and thresholds.',
  },
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentTab,
  onSearch,
  onOpenReportModal,
  onSwitchTab,
}) => {
  const currentInfo = TAB_TITLES[currentTab] || {
    title: 'MedInsure Analytics',
    subtitle: 'Medical Insurance Intelligence & Claims Analytics',
  };

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 shadow-2xs">
      <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: View Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-sans">
              {currentInfo.title}
            </h2>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200/80">
              <ShieldCheck className="w-3 h-3" />
              Kenya Health Scheme
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{currentInfo.subtitle}</p>
        </div>

        {/* Right: Quick actions & indicators */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Quick Reports Button */}
          <button
            onClick={onOpenReportModal || (() => onSwitchTab('reports'))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Executive Report</span>
          </button>

          {/* Quick Explore Button */}
          <button
            onClick={() => onSwitchTab('explorer')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Data Explorer</span>
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => onSwitchTab('risk')}
              title="3 anomalous claims pending audit"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
