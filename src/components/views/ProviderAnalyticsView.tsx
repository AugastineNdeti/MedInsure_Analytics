import React, { useState, useEffect } from 'react';
import {
  Building2,
  FileSpreadsheet,
  DollarSign,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Compass,
  ArrowUpRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
} from 'recharts';
import { MetricCard } from '../common/MetricCard';
import { ChartCard } from '../common/ChartCard';
import { FilterBar } from '../common/FilterBar';
import { RiskBadge } from '../common/RiskBadge';
import { GlobalFilters, ProviderRecord } from '../../types';
import { apiService } from '../../services/api';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

interface ProviderAnalyticsViewProps {
  filters: GlobalFilters;
  onFilterChange: (newFilters: Partial<GlobalFilters>) => void;
  onResetFilters: () => void;
}

export const ProviderAnalyticsView: React.FC<ProviderAnalyticsViewProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [providers, setProviders] = useState<ProviderRecord[]>([]);

  useEffect(() => {
    async function load() {
      const res = await apiService.getProviders();
      setProviders(res);
    }
    load();
  }, []);

  // Sort providers by volume for horizontal bar chart
  const sortedByVolume = [...providers].sort((a, b) => b.claimsVolume - a.claimsVolume);

  // Scatter plot data mapping
  const scatterData = providers.map((p) => ({
    name: p.name,
    x: p.claimsVolume,
    y: p.avgClaimCost,
    tier: p.tier,
    county: p.county,
    rejectionRate: p.rejectionRate,
    quadrant: p.quadrant,
  }));

  const renderScatterTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-md shadow-xl text-xs font-sans space-y-1.5 border border-slate-700 max-w-xs">
          <p className="font-semibold text-teal-300 border-b border-slate-700 pb-1">{data.name}</p>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Claims Volume:</span>
            <span className="font-mono font-medium">{formatNumber(data.x)} claims</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Avg Claim Severity:</span>
            <span className="font-mono font-medium text-emerald-400">{formatCurrency(data.y)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Quadrant:</span>
            <span className="font-mono font-medium text-cyan-300">{data.quadrant}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Rejection Rate:</span>
            <span className="font-mono font-medium text-rose-400">{formatPercent(data.rejectionRate)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* 6 Provider KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <MetricCard
          title="Active Providers"
          value="342"
          delta={2.4}
          subtitle="Hospitals & clinics"
          icon={<Building2 className="w-4 h-4" />}
        />
        <MetricCard
          title="Total Claims"
          value="12,847"
          delta={7.2}
          subtitle="Processed YTD"
          icon={<FileSpreadsheet className="w-4 h-4 text-cyan-600" />}
        />
        <MetricCard
          title="Avg Claim Cost"
          value="KES 14,362"
          delta={3.1}
          inverseDeltaColors={true}
          subtitle="Network benchmark"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <MetricCard
          title="Approval Rate"
          value="91.3%"
          delta={0.5}
          subtitle="Clean claims SLA"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
        <MetricCard
          title="Rejection Rate"
          value="8.7%"
          delta={-0.5}
          inverseDeltaColors={true}
          subtitle="Tariff & policy breaches"
          icon={<AlertOctagon className="w-4 h-4 text-rose-500" />}
        />
        <MetricCard
          title="Avg Processing"
          value="4.2 Days"
          delta={-8.7}
          subtitle="Turnaround speed"
          icon={<Clock className="w-4 h-4 text-teal-600" />}
        />
      </div>

      {/* Row 1: Scatter Plot (Provider Cost Comparison) with Quadrant Analysis */}
      <ChartCard
        title="Provider Cost vs Volume Comparison (Quadrant Matrix)"
        subtitle="Identifies network efficiency hubs, high-cost outlier centers, and specialty clinics"
        tooltipText="X-axis: Claim volume; Y-axis: Average claim cost. Quadrant lines set at 1,000 claims and KES 15,000 average severity benchmark."
        headerRight={
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> High Volume / Low Cost
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> High Cost Outliers
            </span>
          </div>
        }
      >
        <div className="h-88 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                name="Claims Volume"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(v) => `${v} claims`}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Avg Claim Cost"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(v) => `KES ${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={renderScatterTooltip} />
              {/* Benchmark Reference Lines splitting quadrants */}
              <ReferenceLine x={1000} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Vol Benchmark (1,000)', fill: '#64748b', fontSize: 10 }} />
              <ReferenceLine y={15000} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Cost Benchmark (KES 15k)', fill: '#64748b', fontSize: 10 }} />
              <Scatter name="Providers" data={scatterData}>
                {scatterData.map((entry, index) => {
                  let fillColor = '#0d9488'; // default teal
                  if (entry.quadrant === 'High Volume / High Cost') fillColor = '#e11d48'; // rose
                  else if (entry.quadrant === 'Low Volume / High Cost') fillColor = '#f59e0b'; // amber
                  else if (entry.quadrant === 'High Volume / Low Cost') fillColor = '#0284c7'; // blue
                  else fillColor = '#10b981'; // green

                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Quadrant Insight Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/40 text-xs space-y-1">
            <span className="font-semibold text-blue-900 block">High Volume / Low Cost</span>
            <span className="text-[10px] text-blue-700 font-medium">Efficient Network Hubs</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Facilities like Kenyatta National & Mater Hospital demonstrate scale efficiency with lower average severity.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/40 text-xs space-y-1">
            <span className="font-semibold text-rose-900 block">High Volume / High Cost</span>
            <span className="text-[10px] text-rose-700 font-medium">Tertiary Scrutiny Centers</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              The Nairobi Hospital & Aga Khan absorb complex tertiary admissions, requiring continuous pre-auth surveillance.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/40 text-xs space-y-1">
            <span className="font-semibold text-amber-900 block">Low Volume / High Cost</span>
            <span className="text-[10px] text-amber-700 font-medium">Specialty Surgery & Outliers</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Apex Specialist & Horizon PolyClinic present high cost variance (+300%) with low volume; priority audit targets.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 text-xs space-y-1">
            <span className="font-semibold text-emerald-900 block">Low Volume / Low Cost</span>
            <span className="text-[10px] text-emerald-700 font-medium">Community Primary Clinics</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Regional clinics delivering cost-effective outpatient services with swift turnaround times.
            </p>
          </div>
        </div>
      </ChartCard>

      {/* Row 2: Claims by Provider (Horizontal Bar) & Provider Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal Bar: Claims by Provider */}
        <ChartCard
          title="Claims Volume by Provider Facility"
          subtitle="Top 10 facilities by claims volume processed"
          tooltipText="Displays concentration of claims across primary hospital partners."
        >
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={sortedByVolume.slice(0, 8)}
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10, fill: '#334155' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  width={140}
                />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${formatNumber(val)} claims | Total: ${formatCurrency(item.payload.totalCost, true)}`,
                    'Claims Volume',
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="claimsVolume" fill="#0d9488" radius={[0, 4, 4, 0]} name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Provider Governance Summary Table */}
        <ChartCard
          title="Provider Governance & SLA Benchmark"
          subtitle="Approval velocity, rejection rates and statistical anomaly index"
          tooltipText="Providers with anomaly scores > 0.70 trigger automated pre-payment auditing."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-medium">
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3 text-right">Avg Cost</th>
                  <th className="py-2.5 px-3 text-center">Approval %</th>
                  <th className="py-2.5 px-3 text-center">SLA Days</th>
                  <th className="py-2.5 px-3 text-center">Anomaly Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.slice(0, 7).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-medium text-slate-900 truncate max-w-[160px]">
                      {p.name}
                      <span className="block text-[10px] text-slate-400">{p.tier}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                      {formatCurrency(p.avgClaimCost)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-medium text-emerald-700">
                      {p.approvalRate}%
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      {p.avgProcessingDays}d
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <RiskBadge score={p.anomalyScore} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
