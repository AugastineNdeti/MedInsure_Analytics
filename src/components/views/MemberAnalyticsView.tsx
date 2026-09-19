import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  TrendingUp,
  ShieldAlert,
  HeartPulse,
  Info,
  DollarSign,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
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
import { RiskBadge } from '../common/RiskBadge';
import { FilterBar } from '../common/FilterBar';
import { GlobalFilters, MemberRecord } from '../../types';
import { apiService } from '../../services/api';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

interface MemberAnalyticsViewProps {
  filters: GlobalFilters;
  onFilterChange: (newFilters: Partial<GlobalFilters>) => void;
  onResetFilters: () => void;
}

export const MemberAnalyticsView: React.FC<MemberAnalyticsViewProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [demographics, setDemographics] = useState<any[]>([]);
  const [claimsDist, setClaimsDist] = useState<any[]>([]);
  const [riskSegments, setRiskSegments] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await apiService.getMembers();
      const riskRes = await apiService.getMemberRiskSegmentation();
      setMembers(res.members);
      setDemographics(res.demographics);
      setClaimsDist(res.claimsPerMemberDist);
      setRiskSegments(riskRes.segments);
    }
    load();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* 7 Member KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          title="Active Members"
          value="48,392"
          delta={4.8}
          subtitle="Covered principals & dep."
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          title="New Members"
          value="2,310"
          delta={12.4}
          subtitle="Added this period"
          icon={<UserPlus className="w-4 h-4 text-teal-600" />}
        />
        <MetricCard
          title="Members with Claims"
          value="12,847"
          delta={7.2}
          subtitle="26.5% utilization rate"
          icon={<FileSpreadsheet className="w-4 h-4" />}
        />
        <MetricCard
          title="Avg Claims / Member"
          value="2.1"
          delta={0.2}
          subtitle="Among active claimers"
          icon={<Activity className="w-4 h-4 text-cyan-600" />}
        />
        <MetricCard
          title="Average Cost / Member"
          value="KES 3,815"
          delta={3.1}
          inverseDeltaColors={true}
          subtitle="Across entire 48.4k pool"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <MetricCard
          title="High-Risk Members"
          value="1,284"
          delta={5.2}
          inverseDeltaColors={true}
          subtitle="Score > 0.75 actuarial"
          icon={<ShieldAlert className="w-4 h-4 text-rose-500" />}
        />
        <MetricCard
          title="Chronic Condition Members"
          value="5,420"
          delta={3.4}
          inverseDeltaColors={true}
          subtitle="Hypertension, DM, Renal"
          icon={<HeartPulse className="w-4 h-4 text-amber-500" />}
        />
      </div>

      {/* Row 1: Demographics Utilization by Age & Claims per Member distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization by Age Group */}
        <ChartCard
          title="Member Utilization by Age Group"
          subtitle="Cohort member volume and average financial claim cost"
          tooltipText="Demonstrates high membership density in 26-45 working age group, with steep cost acceleration in 56+."
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographics} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
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
                    name === 'Avg Cost / Member' ? formatCurrency(val) : formatNumber(val),
                    name,
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="count" fill="#334155" radius={[4, 4, 0, 0]} name="Member Count" />
                <Bar yAxisId="right" dataKey="avgCost" fill="#0d9488" radius={[4, 4, 0, 0]} name="Avg Cost / Member" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Claims per Member Distribution */}
        <ChartCard
          title="Claims per Member Distribution"
          subtitle="73.5% of covered lives generated 0 claims; 3.9% generated 4+ claims"
          tooltipText="Heavily skewed Pareto distribution characteristic of health insurance schemes."
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimsDist} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${formatNumber(val)} members (${item.payload.percentage}%)`,
                    'Members',
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} name="Member Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Member Risk Segmentation */}
      <ChartCard
        title="Member Risk Segmentation"
        subtitle="Actuarial multi-variable risk scoring model classification"
        tooltipText="Segmented using demographic age, chronic condition burden, prior 12-month hospitalization and prescription trajectory."
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {riskSegments.map((seg) => (
            <div
              key={seg.segment}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800">{seg.segment}</span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
              </div>

              <div>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {formatNumber(seg.count)}
                </span>
                <span className="text-xs text-slate-500 ml-1.5 font-mono">({seg.percentage}%)</span>
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex justify-between items-center text-xs">
                <span className="text-slate-500 text-[11px]">Avg Incurred Cost</span>
                <span className="font-mono font-semibold text-slate-900">{formatCurrency(seg.avgCost)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actuarial disclaimer badge mandated by user prompt */}
        <div className="mt-4 p-3 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Actuarial Classification Notice:</strong> Risk segments represent predictive portfolio analytics
            classifications generated by the Python risk model for underwriting reserve estimation and case management,
            rather than individual clinical or medical diagnoses.
          </p>
        </div>
      </ChartCard>

      {/* Row 3: Top Utilizers Table */}
      <ChartCard
        title="Top Member Utilizers"
        subtitle="High-utilization member profiles generating concentrated claim expenditure"
        tooltipText="Identifies members benefiting from specialized chronic wellness management."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-medium">
                <th className="py-2.5 px-3 font-mono">Member ID</th>
                <th className="py-2.5 px-3">Age Group</th>
                <th className="py-2.5 px-3">County</th>
                <th className="py-2.5 px-3">Scheme Tier</th>
                <th className="py-2.5 px-3 text-center">Claims Count</th>
                <th className="py-2.5 px-3 text-right">Total Claim Cost</th>
                <th className="py-2.5 px-3 text-right">Average Claim Cost</th>
                <th className="py-2.5 px-3 text-center">Risk Score</th>
                <th className="py-2.5 px-3 text-center">Risk Segment</th>
                <th className="py-2.5 px-3">Chronic Profiling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => (
                <tr key={m.memberId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{m.memberId}</td>
                  <td className="py-2.5 px-3 text-slate-700">{m.ageGroup} ({m.gender[0]})</td>
                  <td className="py-2.5 px-3 text-slate-600">{m.county}</td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">{m.schemeTier}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-800">
                    {m.claimsCount}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(m.totalClaimCost)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {formatCurrency(m.averageClaimCost)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <RiskBadge score={m.riskScore} />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <RiskBadge segment={m.riskSegment} />
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    <div className="flex flex-wrap gap-1">
                      {m.chronicConditions.map((c, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};
