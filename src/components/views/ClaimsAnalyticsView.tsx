import React, { useState, useEffect } from 'react';
import {
  Activity,
  FileSpreadsheet,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Ban,
  CheckCircle,
  Filter,
  Eye,
  X,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { MetricCard } from '../common/MetricCard';
import { ChartCard } from '../common/ChartCard';
import { FilterBar } from '../common/FilterBar';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { GlobalFilters, ClaimRecord } from '../../types';
import { mockTopExpensiveClaims, mockMonthlyTrends, mockCategoryBreakdown } from '../../data/mockData';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

interface ClaimsAnalyticsViewProps {
  filters: GlobalFilters;
  onFilterChange: (newFilters: Partial<GlobalFilters>) => void;
  onResetFilters: () => void;
}

export const ClaimsAnalyticsView: React.FC<ClaimsAnalyticsViewProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);

  // Claim Severity Distribution (Histogram Data)
  const severityDistribution = [
    { range: '< KES 5k', count: 3410, totalCost: 11900000, percentage: 26.5 },
    { range: '5k–15k', count: 4820, totalCost: 45790000, percentage: 37.5 },
    { range: '15k–30k', count: 2410, totalCost: 50610000, percentage: 18.8 },
    { range: '30k–75k', count: 1280, totalCost: 57600000, percentage: 10.0 },
    { range: '75k–150k', count: 540, totalCost: 55080000, percentage: 4.2 },
    { range: '150k–300k', count: 260, totalCost: 54600000, percentage: 2.0 },
    { range: '> KES 300k', count: 127, totalCost: 68580000, percentage: 1.0 },
  ];

  // Claims Frequency Trend (Monthly frequency per 1,000 members)
  const frequencyTrend = [
    { month: 'Oct 25', frequency: 24.3, benchmark: 25.0 },
    { month: 'Nov 25', frequency: 24.9, benchmark: 25.0 },
    { month: 'Dec 25', frequency: 25.8, benchmark: 25.0 },
    { month: 'Jan 26', frequency: 24.5, benchmark: 25.0 },
    { month: 'Feb 26', frequency: 25.2, benchmark: 25.0 },
    { month: 'Mar 26', frequency: 26.4, benchmark: 25.0 },
    { month: 'Apr 26', frequency: 26.8, benchmark: 25.0 },
    { month: 'May 26', frequency: 27.2, benchmark: 25.0 },
    { month: 'Jun 26', frequency: 27.5, benchmark: 25.0 },
    { month: 'Jul 26', frequency: 27.9, benchmark: 25.0 },
    { month: 'Aug 26', frequency: 28.3, benchmark: 25.0 },
    { month: 'Sep 26', frequency: 28.7, benchmark: 25.0 },
  ];

  // Claims by Age Group
  const claimsByAge = [
    { ageGroup: '0–17', count: 1480, amount: 18400000, avgCost: 12432 },
    { ageGroup: '18–25', count: 1240, amount: 9734000, avgCost: 7850 },
    { ageGroup: '26–35', count: 3890, amount: 40533000, avgCost: 10420 },
    { ageGroup: '36–45', count: 3120, amount: 43399000, avgCost: 13910 },
    { ageGroup: '46–55', count: 1850, amount: 36704000, avgCost: 19840 },
    { ageGroup: '56–65', count: 980, amount: 27832000, avgCost: 28400 },
    { ageGroup: '65+', count: 287, amount: 12728000, avgCost: 44350 },
  ];

  // Claims by Gender (Neutral visual presentation)
  const claimsByGender = [
    { gender: 'Female', count: 7194, amount: 104200000, percentage: 56.0, avgCost: 14484 },
    { gender: 'Male', count: 5653, amount: 80400000, percentage: 44.0, avgCost: 14222 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Filters Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* 8 Specific Claims KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          title="Claim Frequency"
          value="0.27"
          delta={3.8}
          subtitle="Claims / member / yr"
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricCard
          title="Claim Severity"
          value="KES 14,362"
          delta={3.1}
          inverseDeltaColors={true}
          subtitle="Incurred avg severity"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Average Claim Cost"
          value="KES 14,362"
          delta={3.1}
          inverseDeltaColors={true}
          subtitle="Median: KES 8,450"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <MetricCard
          title="Median Claim Cost"
          value="KES 8,450"
          delta={1.8}
          inverseDeltaColors={true}
          subtitle="Interquartile: 4.2k–22.1k"
          icon={<DollarSign className="w-4 h-4 text-slate-500" />}
        />
        <MetricCard
          title="Total Exposure"
          value="KES 216.4M"
          delta={5.9}
          subtitle="Gross incurred liability"
          icon={<FileSpreadsheet className="w-4 h-4 text-cyan-600" />}
        />
        <MetricCard
          title="Paid Amount"
          value="KES 184.6M"
          delta={6.4}
          subtitle="Disbursed claims"
          icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
        />
        <MetricCard
          title="Pending Amount"
          value="KES 31.8M"
          delta={-2.1}
          inverseDeltaColors={true}
          subtitle="In adjudication queue"
          icon={<Clock className="w-4 h-4 text-amber-500" />}
        />
        <MetricCard
          title="Rejection Rate"
          value="8.7%"
          delta={-0.5}
          inverseDeltaColors={true}
          subtitle="1,118 rejected claims"
          icon={<Ban className="w-4 h-4 text-rose-500" />}
        />
      </div>

      {/* Row 1: Claims Frequency Trend & Severity Distribution Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Claims Frequency Trend"
          subtitle="Monthly claims per 1,000 active members vs actuarial baseline"
          tooltipText="Tracks claims frequency per thousand covered lives. Upward movement indicates increasing utilization."
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={frequencyTrend} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                  domain={[20, 32]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="frequency"
                  name="Observed Frequency"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="Actuarial Target (25.0)"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Claim Severity Distribution"
          subtitle="Histogram of claim count and exposure across financial cost tiers"
          tooltipText="Illustrates that 64% of claims are under KES 15k, but claims over KES 150k generate 36% of financial liability."
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityDistribution} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${formatNumber(val)} claims (${item.payload.percentage}%) | Total: ${formatCurrency(item.payload.totalCost, true)}`,
                    'Claims in Tier',
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Demographic Breakdown - Age Group & Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims by Age Group */}
        <ChartCard
          className="lg:col-span-2"
          title="Claims Volume & Severity by Age Group"
          subtitle="Elderly segments show lower claim count but exponential average severity"
          tooltipText="Compares claims volume against average cost escalation in older age cohorts."
        >
          <div className="h-68 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimsByAge} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#0d9488' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `KES ${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === 'Avg Claim Cost' ? formatCurrency(val) : formatNumber(val),
                    name,
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="count" fill="#334155" radius={[4, 4, 0, 0]} name="Claim Count" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgCost"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  name="Avg Claim Cost"
                  dot={{ r: 4 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Claims by Gender */}
        <ChartCard
          title="Claims by Gender"
          subtitle="Balanced gender utilization profile"
          tooltipText="Female utilization includes maternity and pediatric dependent claims."
        >
          <div className="space-y-4 pt-2">
            {claimsByGender.map((g) => (
              <div key={g.gender} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{g.gender} Members</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(g.amount, true)}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${g.gender === 'Female' ? 'bg-teal-600' : 'bg-cyan-600'}`}
                    style={{ width: `${g.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{formatNumber(g.count)} claims ({g.percentage}%)</span>
                  <span>Avg: {formatCurrency(g.avgCost)}</span>
                </div>
              </div>
            ))}

            <div className="p-3 rounded bg-teal-50/60 border border-teal-200 text-xs text-teal-800 leading-relaxed">
              <strong className="block mb-0.5">Actuarial Observation:</strong>
              Average claim severity between genders remains closely balanced (KES 14,484 vs KES 14,222), with female utilization skewing toward preventative outpatient and maternity.
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 3: Top 10 Most Expensive Claims Table */}
      <ChartCard
        title="Top 10 Most Expensive Claims"
        subtitle="Highest financial exposures requiring clinical audit and reinsurance logging"
        tooltipText="All records anonymized under Data Protection regulations. Click any claim row to inspect adjudication details."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-medium">
                <th className="py-2.5 px-3 font-mono">Claim ID</th>
                <th className="py-2.5 px-3 font-mono">Member ID</th>
                <th className="py-2.5 px-3">Provider</th>
                <th className="py-2.5 px-3">Diagnosis Category</th>
                <th className="py-2.5 px-3">Service Date</th>
                <th className="py-2.5 px-3 text-right">Claim Amount</th>
                <th className="py-2.5 px-3 text-right">Approved Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Risk Score</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTopExpensiveClaims.map((claim) => (
                <tr
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim)}
                  className="hover:bg-teal-50/30 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{claim.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{claim.memberId}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 truncate max-w-[160px]">
                    {claim.providerName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[200px]" title={claim.diagnosisCategory}>
                    <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded mr-1 text-slate-500">
                      {claim.diagnosisCode}
                    </span>
                    {claim.diagnosisCategory}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{claim.serviceDate}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(claim.claimAmount)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                    {claim.approvedAmount > 0 ? formatCurrency(claim.approvedAmount) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <StatusBadge status={claim.status} />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <RiskBadge score={claim.riskScore} />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClaim(claim);
                      }}
                      className="text-slate-400 hover:text-teal-700 p-1"
                      title="View full claim audit details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Claim Detail Modal Drawer */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Claims Adjudication Audit
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedClaim.id} • {selectedClaim.memberId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Provider Facility</span>
                <span className="font-semibold text-slate-900">{selectedClaim.providerName}</span>
                <span className="block text-slate-500 mt-0.5">{selectedClaim.county} County</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Service Line</span>
                <span className="font-semibold text-slate-900">{selectedClaim.serviceCategory}</span>
                <span className="block text-slate-500 mt-0.5">Date: {selectedClaim.serviceDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Claimed Amount</span>
                <span className="font-bold text-base text-slate-900 font-mono">{formatCurrency(selectedClaim.claimAmount)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Approved Payout</span>
                <span className="font-bold text-base text-emerald-700 font-mono">
                  {selectedClaim.approvedAmount > 0 ? formatCurrency(selectedClaim.approvedAmount) : 'Pending Review'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Clinical Diagnosis & ICD-10 Code</span>
              <p className="font-medium text-slate-800">
                <strong className="font-mono text-teal-700 mr-1">{selectedClaim.diagnosisCode}:</strong>
                {selectedClaim.diagnosisCategory}
              </p>
            </div>

            {selectedClaim.anomalyFactors && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-rose-800 font-semibold">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Statistical Anomaly Flags Detected by Python Engine:</span>
                </div>
                <ul className="list-disc list-inside text-rose-700 space-y-0.5 pl-1">
                  {selectedClaim.anomalyFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span>Status: <StatusBadge status={selectedClaim.status} /></span>
                <span>Risk Score: <RiskBadge score={selectedClaim.riskScore} /></span>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
