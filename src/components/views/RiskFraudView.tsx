import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Building2,
  Users,
  Search,
  Eye,
  Info,
  DollarSign,
  CheckCircle2,
  X,
  FileText,
  Sliders,
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { ChartCard } from '../common/ChartCard';
import { FilterBar } from '../common/FilterBar';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { GlobalFilters, ClaimRecord } from '../../types';
import { mockRiskAnomalies } from '../../data/mockData';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

interface RiskFraudViewProps {
  filters: GlobalFilters;
  onFilterChange: (newFilters: Partial<GlobalFilters>) => void;
  onResetFilters: () => void;
}

export const RiskFraudView: React.FC<RiskFraudViewProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [anomalies, setAnomalies] = useState<ClaimRecord[]>(mockRiskAnomalies);
  const [selectedAuditClaim, setSelectedAuditClaim] = useState<ClaimRecord | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  const filteredAnomalies = priorityFilter === 'All'
    ? anomalies
    : anomalies.filter(a => a.investigationPriority === priorityFilter);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Filters Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* 5 Specific Risk & Anomaly KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="High-Risk Claims"
          value="142"
          delta={8.4}
          inverseDeltaColors={true}
          subtitle="Anomaly score ≥ 0.75"
          icon={<ShieldAlert className="w-4 h-4 text-rose-600" />}
        />
        <MetricCard
          title="High-Risk Members"
          value="1,284"
          delta={5.2}
          inverseDeltaColors={true}
          subtitle="Multi-claim spikes"
          icon={<Users className="w-4 h-4 text-amber-500" />}
        />
        <MetricCard
          title="Anomalous Providers"
          value="8"
          delta={0.0}
          inverseDeltaColors={true}
          subtitle="Tariff deviation > 2.5σ"
          icon={<Building2 className="w-4 h-4 text-rose-500" />}
        />
        <MetricCard
          title="Claims Under Review"
          value="38"
          delta={-12.5}
          subtitle="Actively in audit queue"
          icon={<FileCheck className="w-4 h-4 text-teal-600" />}
        />
        <MetricCard
          title="Estimated Exposure"
          value="KES 24.8M"
          delta={4.1}
          inverseDeltaColors={true}
          subtitle="Flagged payout reserve"
          icon={<DollarSign className="w-4 h-4 text-rose-700" />}
        />
      </div>

      {/* Analytical Guidance Banner (Strict non-accusatory terminology) */}
      <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-2 font-semibold">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Statistical Anomaly Governance & Objective Audit Protocol</span>
        </div>
        <p className="text-amber-800/90 leading-relaxed text-[11px] pl-6">
          This system performs statistical outlier detection, comparing line-item tariffs against historical county benchmarks, ICD-10 diagnostic length-of-stay medians, and dispensing frequency. All items flagged below represent <strong>potential anomalies and statistical risk indicators</strong> requiring routine verification, and do not constitute formal assertions of misconduct.
        </p>
      </div>

      {/* Main Anomaly Detection Table */}
      <ChartCard
        title="Anomaly Detection & Statistical Variance Queue"
        subtitle="Ranked claims showing excessive deviation from expected diagnosis and provider benchmarks"
        tooltipText="Claims flagged by Python machine learning outlier model (Isolation Forest + Tariff Z-score algorithms)."
        headerRight={
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium">
            {['All', 'Urgent Review', 'Routine Audit', 'Cleared / Normal'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded transition-all ${
                  priorityFilter === p
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-medium">
                <th className="py-2.5 px-3 font-mono">Claim ID</th>
                <th className="py-2.5 px-3">Provider Facility</th>
                <th className="py-2.5 px-3">Diagnosis / Service</th>
                <th className="py-2.5 px-3 text-right">Claim Amount</th>
                <th className="py-2.5 px-3 text-right">Expected Amount</th>
                <th className="py-2.5 px-3 text-right">Deviation</th>
                <th className="py-2.5 px-3 text-center">Anomaly Score</th>
                <th className="py-2.5 px-3 text-center">Investigation Priority</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnomalies.map((claim) => (
                <tr
                  key={claim.id}
                  onClick={() => setSelectedAuditClaim(claim)}
                  className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{claim.id}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {claim.providerName}
                    <span className="block text-[10px] text-slate-400 font-normal">{claim.county} County</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-[200px] truncate" title={claim.diagnosisCategory}>
                    <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded mr-1 text-slate-500">
                      {claim.diagnosisCode}
                    </span>
                    {claim.diagnosisCategory}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(claim.claimAmount)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                    {formatCurrency(claim.expectedAmount || 0)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                    +{claim.deviationPercent}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <RiskBadge score={claim.riskScore} />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <RiskBadge priority={claim.investigationPriority} />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAuditClaim(claim);
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Row 2: Common Anomaly Typologies & Anomaly Prevention Value */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Tariff Billing Variance (+300%+)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Claims submitted at charges significantly exceeding established regional scheme fee schedules for surgical procedures and ICU daily limits.
          </p>
          <span className="text-[11px] font-mono text-slate-400 block pt-1 border-t border-slate-100">
            Detected cases: 48 claims (KES 11.2M exposure)
          </span>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Unbundled Laboratory & Pharmacy Codes</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Separate billing for bundled diagnostic panels (e.g. individual lipid fractions rather than inclusive profile) inflating procedural costs.
          </p>
          <span className="text-[11px] font-mono text-slate-400 block pt-1 border-t border-slate-100">
            Detected cases: 62 claims (KES 8.4M exposure)
          </span>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>Rapid Utilization Frequency Spikes</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multiple high-cost pharmacy refills or repeated diagnostic ultrasound scans within short 48-hour windows across different clinics.
          </p>
          <span className="text-[11px] font-mono text-slate-400 block pt-1 border-t border-slate-100">
            Detected cases: 32 claims (KES 5.2M exposure)
          </span>
        </div>
      </div>

      {/* Audit Detail Modal Drawer */}
      {selectedAuditClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 font-semibold">
                  Investigation Audit Case
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedAuditClaim.id} • {selectedAuditClaim.providerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAuditClaim(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Invoiced Claim</span>
                <span className="font-bold text-base text-slate-900 font-mono">
                  {formatCurrency(selectedAuditClaim.claimAmount)}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                <span className="text-[10px] text-emerald-700 block uppercase">Actuarial Benchmark Expected</span>
                <span className="font-bold text-base text-emerald-800 font-mono">
                  {formatCurrency(selectedAuditClaim.expectedAmount || 0)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs space-y-1.5">
              <span className="font-semibold text-rose-800 block">Identified Outlier Factors:</span>
              <ul className="list-disc list-inside text-rose-700 space-y-1 text-[11px]">
                {selectedAuditClaim.anomalyFactors?.map((af, i) => (
                  <li key={i}>{af}</li>
                )) || <li>Variance exceeds 3.0 standard deviations from diagnosis median.</li>}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono">Score: {selectedAuditClaim.riskScore}</span>
                <RiskBadge priority={selectedAuditClaim.investigationPriority} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert(`Claim ${selectedAuditClaim.id} routed to Senior Medical Adjudicator for line-item review.`);
                    setSelectedAuditClaim(null);
                  }}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded font-medium"
                >
                  Hold for Review
                </button>
                <button
                  onClick={() => setSelectedAuditClaim(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
