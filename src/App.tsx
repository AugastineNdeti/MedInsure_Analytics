/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, NavItem } from './components/layout/Sidebar';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { OverviewView } from './components/views/OverviewView';
import { ClaimsAnalyticsView } from './components/views/ClaimsAnalyticsView';
import { MemberAnalyticsView } from './components/views/MemberAnalyticsView';
import { ProviderAnalyticsView } from './components/views/ProviderAnalyticsView';
import { RiskFraudView } from './components/views/RiskFraudView';
import { FinancialAnalyticsView } from './components/views/FinancialAnalyticsView';
import { TrendsForecastingView } from './components/views/TrendsForecastingView';
import { DataExplorerView } from './components/views/DataExplorerView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { LoginView } from './components/auth/LoginView';
import { GlobalFilters } from './types';

const INITIAL_FILTERS: GlobalFilters = {
  dateRange: 'Jan 2025 – Sep 2026',
  insuranceProduct: 'All',
  claimType: 'All',
  region: 'All',
  county: 'All',
  provider: 'All',
  memberType: 'All',
  claimStatus: 'All',
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>({
    name: 'Dr. Evans Kiplagat',
    role: 'Lead Health Actuary / BI',
  });
  const [currentTab, setCurrentTab] = useState<NavItem>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState<GlobalFilters>(INITIAL_FILTERS);

  const handleFilterChange = (newFilters: Partial<GlobalFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // If user logs out, display the enterprise persona sign-in view
  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={() => setCurrentUser(null)}
        userName={currentUser.name}
        userRole={currentUser.role}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Dashboard Header */}
        <DashboardHeader
          currentTab={currentTab}
          onSwitchTab={(tab) => setCurrentTab(tab)}
          onOpenReportModal={() => setCurrentTab('reports')}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto pb-12">
          {currentTab === 'overview' && (
            <OverviewView
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'claims' && (
            <ClaimsAnalyticsView
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          )}

          {currentTab === 'members' && (
            <MemberAnalyticsView
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          )}

          {currentTab === 'providers' && (
            <ProviderAnalyticsView
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          )}

          {currentTab === 'risk' && (
            <RiskFraudView
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          )}

          {currentTab === 'financial' && (
            <FinancialAnalyticsView
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          )}

          {currentTab === 'trends' && (
            <TrendsForecastingView
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          )}

          {currentTab === 'explorer' && (
            <DataExplorerView
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          )}

          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
