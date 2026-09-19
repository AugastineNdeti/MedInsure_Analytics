import React, { useState, useEffect } from 'react';
import {
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Percent,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MetricCard } from '../common/MetricCard';
import { ChartCard } from '../common/ChartCard';
import { FilterBar } from '../common/FilterBar';
import { InsightCard } from '../common/InsightCard';
import { KPILoadingSkeleton } from '../common/LoadingSkeleton';
import { GlobalFilters, OverviewKPIData, MonthlyClaimsTrend, ClaimStatusBreakdown, CategoryBreakdown, CountyDistribution, AutomatedInsight } from '../../types';
import { apiService } from '../../services/api';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

interface OverviewViewProps {
  filters: GlobalFilters;
  onFilterChange: (newFilters: Partial<GlobalFilters>) => void;
  onResetFilters: () => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onNavigateTab,
}) => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<OverviewKPIData | null>(null);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyClaimsTrend[]>([]);
  const [statusData, setStatusData] = useState<ClaimStatusBreakdown[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [countyData, setCountyData] = useState<CountyDistribution[]>([]);
  const [insights, setInsights] = useState<AutomatedInsight[]>([]);

  // Trend chart metric toggle: 'amount' | 'volume' | 'avgCost'
  const [trendMetric, setTrendMetric] = useState<'amount' | 'volume' | 'avgCost'>('amount');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [summary, fetchedInsights] = await Promise.all([
          apiService.getDashboardSummary(filters),
          apiService.getInsights(),
        ]);
        if (isMounted) {
          setKpis(summary.kpis);
          setMonthlyTrends(summary.monthlyTrends);
          setStatusData(summary.statusBreakdown);
          setCategoryData(summary.categoryBreakdown);
          setCountyData(summary.countyDistribution);
          setInsights(fetchedInsights);
        }
      } catch (e) {
        console.error('Failed to load overview data', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  if (loading || !kpis) {
    return (
      <div className="p-6 space-y-6">
        <KPILoadingSkeleton />
      </div>
    );
  }

  // Format tooltip for trend chart
  const renderTrendTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload as MonthlyClaimsTrend;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-md shadow-xl text-xs font-sans space-y-1.5 border border-slate-700">
          <p className="font-semibold text-teal-300 border-b border-slate-700 pb-1">{label}</p>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Total Claims:</span>
            <span className="font-mono font-medium">{formatNumber(data.claimsCount)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Total Expenditure:</span>
            <span className="font-mono font-medium text-emerald-400">{formatCurrency(data.claimsCost)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Avg Cost / Claim:</span>
            <span className="font-mono font-medium text-cyan-300">{formatCurrency(data.avgClaimCost)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Filters Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* 8 Executive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          id="kpi-total-members"
          title="Total Members"
          value={formatNumber(kpis.totalMembers)}
          delta={kpis.totalMembersDelta}
          icon={<Users className="w-4 h-4" />}
          subtitle="48.4k covered lives"
        />
        <MetricCard
          id="kpi-total-claims"
          title="Total Claims"
          value={formatNumber(kpis.totalClaims)}
          delta={kpis.totalClaimsDelta}
          icon={<FileSpreadsheet className="w-4 h-4" />}
          subtitle="Incurred YTD"
        />
        <MetricCard
          id="kpi-claims-paid"
          title="Claims Paid"
          value={formatCurrency(kpis.claimsPaid, true)}
          delta={kpis.claimsPaidDelta}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          subtitle="71.2% disbursed"
        />
        <MetricCard
          id="kpi-claims-pending"
          title="Claims Pending"
          value={formatCurrency(kpis.claimsPending, true)}
          delta={kpis.claimsPendingDelta}
          inverseDeltaColors={true}
          icon={<Clock className="w-4 h-4 text-cyan-500" />}
          subtitle="Awaiting adjudication"
        />
        <MetricCard
          id="kpi-claims-ratio"
          title="Claims Ratio"
          value={formatPercent(kpis.claimsRatio)}
          delta={kpis.claimsRatioDelta}
          inverseDeltaColors={true}
          icon={<Percent className="w-4 h-4 text-amber-500" />}
          subtitle="Target: ≤ 70.0%"
          badge="Loss Ratio"
        />
        <MetricCard
          id="kpi-avg-claim-cost"
          title="Average Claim Cost"
          value={formatCurrency(kpis.averageClaimCost)}
          delta={kpis.averageClaimCostDelta}
          inverseDeltaColors={true}
          icon={<TrendingUp className="w-4 h-4 text-slate-500" />}
          subtitle="Median: KES 8,450"
        />
        <MetricCard
          id="kpi-rejection-rate"
          title="Rejection Rate"
          value={formatPercent(kpis.rejectionRate)}
          delta={kpis.rejectionRateDelta}
          inverseDeltaColors={true}
          icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
          subtitle="Tariff & policy rules"
        />
        <MetricCard
          id="kpi-high-risk-members"
          title="High-Risk Members"
          value={formatNumber(kpis.highRiskMembers)}
          delta={kpis.highRiskMembersDelta}
          inverseDeltaColors={true}
          icon={<ShieldAlert className="w-4 h-4 text-rose-600" />}
          subtitle="Chronic multi-condition"
        />
      </div>

      {/* Row 1: Claims Trend (Large Area/Line) + Claims by Status (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Line/Area: Claims Volume & Cost Trend */}
        <ChartCard
          id="chart-claims-trend"
          className="lg:col-span-2"
          title="Claims Volume & Cost Trend"
          subtitle="Monthly claims incurred and paid totals across all member schemes (Jan 2025 – Sep 2026)"
          tooltipText="Time-series observation of claim progression. Use toggles to switch between claim expenditure, count, and severity."
          headerRight={
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium border border-slate-200">
              <button
                onClick={() => setTrendMetric('amount')}
                className={`px-2.5 py-1 rounded transition-all ${
                  trendMetric === 'amount'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Claim Amount
              </button>
              <button
                onClick={() => setTrendMetric('volume')}
                className={`px-2.5 py-1 rounded transition-all ${
                  trendMetric === 'volume'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Claim Volume
              </button>
              <button
                onClick={() => setTrendMetric('avgCost')}
                className={`px-2.5 py-1 rounded transition-all ${
                  trendMetric === 'avgCost'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Average Cost
              </button>
            </div>
          }
        >
          <div className="h-72 sm:h-80 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              {trendMetric === 'amount' ? (
                <AreaChart data={monthlyTrends} margin={{ top: 10, right: 15, left: 15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => formatCurrency(val, true)}
                  />
                  <Tooltip content={renderTrendTooltip} />
                  <Area
                    type="monotone"
                    dataKey="claimsCost"
                    name="Incurred Claims"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#costGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="approvedCost"
                    name="Approved Payout"
                    stroke="#0284c7"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              ) : trendMetric === 'volume' ? (
                <BarChart data={monthlyTrends} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip content={renderTrendTooltip} />
                  <Bar dataKey="claimsCount" fill="#0d9488" radius={[4, 4, 0, 0]} name="Total Claims" />
                </BarChart>
              ) : (
                <LineChart data={monthlyTrends} margin={{ top: 10, right: 15, left: 15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `KES ${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={renderTrendTooltip} />
                  <Line
                    type="monotone"
                    dataKey="avgClaimCost"
                    name="Avg Claim Severity"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ fill: '#0284c7', r: 3 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-mono">Current period avg: KES 14,362</span>
            <button
              onClick={() => onNavigateTab('claims')}
              className="text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1"
            >
              Claims breakdown <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </ChartCard>

        {/* Donut Chart: Claims by Status */}
        <ChartCard
          id="chart-claims-status"
          title="Claims by Status"
          subtitle="Adjudication resolution breakdown across 12,847 claims"
          tooltipText="Proportion of claims approved, pending review, or rejected under policy criteria."
        >
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${formatNumber(val)} claims (${item.payload.percentage}%) - ${formatCurrency(item.payload.amount, true)}`,
                    item.payload.status,
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
            {statusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium">{item.status}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-500">{formatNumber(item.count)}</span>
                  <span className="text-slate-900 font-semibold w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Claims by Category (Horizontal Bar) & Geographic Analysis (Kenya County Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal Bar: Claims by Category */}
        <ChartCard
          id="chart-claims-category"
          title="Claims by Service Category"
          subtitle="Utilization volume and financial payout across clinical service lines"
          tooltipText="Displays total claim volume alongside financial exposure per benefit category."
          headerRight={
            <span className="text-xs text-slate-400 font-mono">Top: Outpatient (44.2%)</span>
          }
        >
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categoryData}
                margin={{ top: 5, right: 30, left: 45, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${formatNumber(val)} claims | Total: ${formatCurrency(item.payload.totalAmount, true)} (Avg: ${formatCurrency(item.payload.avgAmount)})`,
                    'Claims Volume',
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#0d9488" radius={[0, 4, 4, 0]} name="Claim Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2 rounded bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-medium block">Inpatient Total</span>
              <span className="font-semibold text-slate-900 font-mono">KES 76.8M</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-medium block">Outpatient Total</span>
              <span className="font-semibold text-slate-900 font-mono">KES 51.2M</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-medium block">Pharmacy Total</span>
              <span className="font-semibold text-slate-900 font-mono">KES 28.4M</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-medium block">Maternity Total</span>
              <span className="font-semibold text-slate-900 font-mono">KES 26.5M</span>
            </div>
          </div>
        </ChartCard>

        {/* Kenya Geographic Analysis: Claims Distribution by County */}
        <ChartCard
          id="chart-geographic-county"
          title="Claims Distribution by County"
          subtitle="Geographic concentration of member claims volume, financial cost, and average severity"
          tooltipText="Identifies regional exposure patterns across Kenya counties. Higher bars indicate larger claims financial load."
          headerRight={
            <div className="inline-flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Kenya National Network</span>
            </div>
          }
        >
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {countyData.map((c, index) => {
              const maxCost = 110000000;
              const costPercent = Math.min(100, Math.round((c.claimsCost / maxCost) * 100));

              return (
                <div
                  key={c.county}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-slate-50/70 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-slate-900 text-xs">{c.county} County</span>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        ({formatNumber(c.membersCount)} members)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900">{formatCurrency(c.claimsCost, true)}</span>
                      <span className="text-[10px] text-slate-500 ml-1.5 font-mono">
                        ({formatNumber(c.claimsCount)} claims)
                      </span>
                    </div>
                  </div>

                  {/* Heat bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0
                          ? 'bg-teal-600'
                          : index < 3
                          ? 'bg-teal-500'
                          : index < 6
                          ? 'bg-cyan-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${Math.max(5, costPercent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                    <span>Top facility: <strong className="text-slate-700">{c.topProvider}</strong></span>
                    <span>Avg claim: <strong className="font-mono text-slate-700">{formatCurrency(c.avgCost)}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Automated Insights Panel */}
      <InsightCard
        insights={insights}
        metadata={{
          source: 'Claims Analytics Engine (Python / Pandas / SciPy)',
          recordsAnalyzed: '1.24M',
          lastUpdated: '19 Sep 2026, 14:32 EAT',
          period: 'Jan 2025 – Sep 2026',
        }}
      />
    </div>
  );
};
