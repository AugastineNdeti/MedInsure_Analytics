import React, { useState, useEffect } from 'react';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  DollarSign,
  Percent,
  Receipt,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { MetricCard } from '../common/MetricCard';
import { ChartCard } from '../common/ChartCard';
import { FilterBar } from '../common/FilterBar';
import { GlobalFilters, FinancialMetric } from '../../types';
import { apiService } from '../../services/api';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

interface FinancialAnalyticsViewProps {
  filters: GlobalFilters;
  onFilterChange: (newFilters: Partial<GlobalFilters>) => void;
  onResetFilters: () => void;
}

export const FinancialAnalyticsView: React.FC<FinancialAnalyticsViewProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [financials, setFinancials] = useState<FinancialMetric[]>([]);
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await apiService.getFinancialSummary();
      setFinancials(res.financials);
      setKpis(res.kpis);
    }
    load();
  }, []);

  if (!kpis) return null;

  // Product tier breakdown for underwriting margin
  const productMargins = [
    { product: 'Corporate Comprehensive', premium: 168000000, claims: 122640000, lossRatio: 73.0, margin: 45360000 },
    { product: 'SME Care', premium: 48500000, claims: 33950000, lossRatio: 70.0, margin: 14550000 },
    { product: 'Retail Afya', premium: 24500000, claims: 18865000, lossRatio: 77.0, margin: 5635000 },
    { product: 'Senior Shield', premium: 14000000, claims: 9142000, lossRatio: 65.3, margin: 4858000 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* 7 Specific Financial KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          title="Premium Revenue"
          value={formatCurrency(kpis.premiumRevenue, true)}
          delta={8.2}
          subtitle="Earned written premium"
          icon={<DollarSign className="w-4 h-4 text-teal-600" />}
        />
        <MetricCard
          title="Claims Cost"
          value={formatCurrency(kpis.claimsCost, true)}
          delta={6.4}
          inverseDeltaColors={true}
          subtitle="Gross incurred claims"
          icon={<Receipt className="w-4 h-4 text-slate-500" />}
        />
        <MetricCard
          title="Net Claims Cost"
          value={formatCurrency(kpis.netClaimsCost, true)}
          delta={5.8}
          inverseDeltaColors={true}
          subtitle="Post-reinsurance recovery"
          icon={<Scale className="w-4 h-4 text-cyan-600" />}
        />
        <MetricCard
          title="Loss Ratio"
          value={formatPercent(kpis.lossRatio)}
          delta={1.8}
          inverseDeltaColors={true}
          subtitle="Target threshold: 70.0%"
          badge="72.4% Actual"
          icon={<Percent className="w-4 h-4 text-amber-500" />}
        />
        <MetricCard
          title="Avg Premium / Member"
          value={formatCurrency(kpis.avgPremiumPerMember)}
          delta={3.2}
          subtitle="Annualized per life"
          icon={<TrendingUp className="w-4 h-4 text-teal-600" />}
        />
        <MetricCard
          title="Avg Cost / Member"
          value={formatCurrency(kpis.avgCostPerMember)}
          delta={3.1}
          inverseDeltaColors={true}
          subtitle="Incurred per life"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <MetricCard
          title="Outstanding Claims"
          value={formatCurrency(kpis.outstandingClaims, true)}
          delta={-2.1}
          inverseDeltaColors={true}
          subtitle="IBNR actuarial reserve"
          icon={<Receipt className="w-4 h-4 text-amber-600" />}
        />
        <MetricCard
          title="Underwriting Margin"
          value="KES 70.4M"
          delta={11.5}
          subtitle="27.6% Gross surplus"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Row 1: Combination Chart (Monthly Financial Performance) & Dual-Line Chart (Premium vs Claims Cost) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Financial Performance: Combination Chart */}
        <ChartCard
          title="Monthly Financial Performance (Premium vs Claims Cost)"
          subtitle="Columns = Earned Premium, Line = Incurred Claims Cost (Oct 2025 – Sep 2026)"
          tooltipText="Demonstrates consistent positive underwriting margin with seasonal spikes in claims during July–September."
        >
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={financials} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatCurrency(v, true)}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [formatCurrency(val), name]}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="premiumRevenue" name="Premium Revenue" fill="#0f766e" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="claimsCost"
                  name="Claims Cost"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Loss Ratio Trend: Line Chart */}
        <ChartCard
          title="Loss Ratio Trajectory & Actuarial Target"
          subtitle="Monthly claims ratio against the 70% underwriting target threshold"
          tooltipText="Actuarial threshold set at 70%. Values above 70% trigger premium rate review on corporate renewals."
        >
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financials} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                  domain={[60, 80]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Loss Ratio']}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine
                  y={70.0}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{ value: 'Target Max (70.0%)', fill: '#d97706', fontSize: 10, position: 'insideTopLeft' }}
                />
                <Line
                  type="monotone"
                  dataKey="lossRatio"
                  name="Observed Loss Ratio"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Underwriting Margin by Insurance Product Line */}
      <ChartCard
        title="Underwriting Margin by Insurance Product Line"
        subtitle="Financial profitability and claims performance across portfolio tiers"
        tooltipText="Corporate Comprehensive accounts for 65.9% of total earned premium."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-medium">
                <th className="py-2.5 px-3">Product Line</th>
                <th className="py-2.5 px-3 text-right">Earned Premium</th>
                <th className="py-2.5 px-3 text-right">Incurred Claims</th>
                <th className="py-2.5 px-3 text-center">Loss Ratio</th>
                <th className="py-2.5 px-3 text-right">Underwriting Surplus</th>
                <th className="py-2.5 px-3 text-center">Portfolio Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productMargins.map((p) => (
                <tr key={p.product} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-semibold text-slate-900">{p.product}</td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-800">
                    {formatCurrency(p.premium)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-700">
                    {formatCurrency(p.claims)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        p.lossRatio > 72.0
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {p.lossRatio}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                    {formatCurrency(p.margin)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.lossRatio <= 70 ? (
                      <span className="text-[11px] text-emerald-700 font-medium">Within Target</span>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-medium">Under Review</span>
                    )}
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
