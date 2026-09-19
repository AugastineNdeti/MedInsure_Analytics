import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  Building2,
  ShieldAlert,
  LineChart,
  TrendingUp,
  Table2,
  FileText,
  Settings,
  Activity,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Server,
} from 'lucide-react';

export type NavItem =
  | 'overview'
  | 'claims'
  | 'members'
  | 'providers'
  | 'risk'
  | 'financial'
  | 'trends'
  | 'explorer'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  userName?: string;
  userRole?: string;
}

const NAV_CONFIG: { id: NavItem; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'claims', label: 'Claims Analytics', icon: FileSpreadsheet },
  { id: 'members', label: 'Member Analytics', icon: Users },
  { id: 'providers', label: 'Provider Analytics', icon: Building2 },
  { id: 'risk', label: 'Risk & Fraud', icon: ShieldAlert },
  { id: 'financial', label: 'Financial Analytics', icon: LineChart },
  { id: 'trends', label: 'Trends & Forecasting', icon: TrendingUp },
  { id: 'explorer', label: 'Data Explorer', icon: Table2 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  userName = 'Dr. Evans Kiplagat',
  userRole = 'Lead Health Actuary / BI',
}) => {
  return (
    <aside
      className={`bg-slate-900 text-slate-100 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 border-r border-slate-800 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0 shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-bold tracking-tight text-white font-sans">
                    MedInsure Analytics
                  </h1>
                </div>
                <p className="text-[10px] text-teal-400 font-medium tracking-tight truncate">
                  Claims & Decision Intelligence
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="flex justify-center p-2 border-b border-slate-800">
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {NAV_CONFIG.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {!isCollapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-slate-800 space-y-3">
        {/* System & Data Status */}
        {!isCollapsed && (
          <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Engine
              </span>
              <span className="text-[10px] font-mono text-teal-300">v2.4-py</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Data refreshed: <span className="text-slate-300 font-medium">19 Sep 2026, 14:32</span>
            </div>
          </div>
        )}

        {/* User Profile Card */}
        <div className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-teal-300 shrink-0">
            EK
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 truncate">{userRole}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
              title="Sign out of demo session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
