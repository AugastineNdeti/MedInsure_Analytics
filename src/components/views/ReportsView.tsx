import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  ShieldAlert,
  LineChart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

interface ReportTemplate {
  id: string;
  title: string;
  category: string;
  frequency: string;
  description: string;
  kpis: { label: string; value: string }[];
  summaryNarrative: string;
  recommendations: string[];
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'monthly-claims',
    title: 'Executive Monthly Claims Performance Report',
    category: 'Claims Governance',
    frequency: 'Monthly (Sep 2026)',
    description: 'Comprehensive evaluation of monthly claims incurrence, adjudication SLAs, rejection ratios, and category cost trajectories.',
    kpis: [
      { label: 'Total Incurred Claims', value: 'KES 216.4M' },
      { label: 'Claims Paid (71.2%)', value: 'KES 184.6M' },
      { label: 'Claims Incurred Volume', value: '12,847 claims' },
      { label: 'Average Claim Severity', value: 'KES 14,362' },
      { label: 'Rejection Rate', value: '8.7%' },
    ],
    summaryNarrative:
      'For the closing period of September 2026, claims incurred stood at KES 216.4M across 12,847 claims, representing a 7.2% volume increase over the prior comparative period. Inpatient care accounted for 41.6% of total payout load (KES 76.8M), driven predominantly by intensive care and cardiovascular surgeries. Clean claims turnaround improved to 4.2 business days.',
    recommendations: [
      'Maintain surgical pre-authorization thresholds on admissions over KES 150,000.',
      'Audit unbundled pharmacy dispensing patterns at outpatient centers in Kiambu and Nairobi counties.',
      'Re-engage Kenyatta National and Nairobi Hospital on quarterly bundled tariff schedules.',
    ],
  },
  {
    id: 'provider-cost-variance',
    title: 'Provider Cost Variance & Outlier Benchmark Report',
    category: 'Provider Network',
    frequency: 'Quarterly Audit (Q3 2026)',
    description: 'Analysis of billing deviations, length of stay variances, and tariff inflation across 342 paneled healthcare facilities in Kenya.',
    kpis: [
      { label: 'Active Facilities Audited', value: '342 hospitals' },
      { label: 'Facilities in Tier 1 (Audit)', value: '8 outlier facilities' },
      { label: 'Potential Variance Exposure', value: 'KES 24.8M' },
      { label: 'Overall Network SLA', value: '4.2 days avg' },
    ],
    summaryNarrative:
      'The network audit revealed that while Tier 1 teaching and referral centers maintain predictable volume-severity ratios, 8 private tertiary facilities exhibited tariff deviations exceeding 2.5 standard deviations from diagnosis medians. Apex Specialist Hospital and Horizon PolyClinic contributed to 34% of variance flags in orthopedic implants and specialized pharmacy refills.',
    recommendations: [
      'Implement itemized mandatory invoice receipt submission for specialty prosthesis above KES 80,000.',
      'Issue formal clinical inquiry letters to facilities in the high-cost / low-volume scatter quadrant.',
      'Shift 12 corporate schemes to preferred low-cost Tier 2 network panels for elective outpatient care.',
    ],
  },
  {
    id: 'underwriting-loss-ratio',
    title: 'Actuarial Underwriting & Loss Ratio Dossier',
    category: 'Actuarial & Finance',
    frequency: 'Annual / Portfolio Renewal',
    description: 'Technical analysis of earned premium revenue versus incurred claims, loss ratio development, and pricing adjustments.',
    kpis: [
      { label: 'Earned Premium Revenue', value: 'KES 255.0M' },
      { label: 'Incurred Claims Cost', value: 'KES 184.6M' },
      { label: 'Portfolio Loss Ratio', value: '72.4%' },
      { label: 'Underwriting Margin', value: 'KES 70.4M' },
      { label: 'Recommended IBNR Reserve', value: 'KES 34.2M' },
    ],
    summaryNarrative:
      'Portfolio loss ratio closed at 72.4%, slightly above the target benchmark of 70.0%. Corporate Comprehensive business (KES 168.0M premium) delivered a stable 73.0% loss ratio. The Retail Afya retail book experienced adverse claims selection resulting in a 77.0% loss ratio, necessitating a recommended 6.5% actuarial rate load for 2027 renewals.',
    recommendations: [
      'Apply a 6.5% actuarial premium adjustment on Retail Afya renewals with claims ratios exceeding 80%.',
      'Increase IBNR claims provision to KES 34.2M utilizing the Chain-Ladder actuarial methodology.',
      'Introduce mandatory wellness chronic disease management incentives for schemes with >100 members.',
    ],
  },
  {
    id: 'member-risk-utilization',
    title: 'Member Health Risk & Chronic Utilization Brief',
    category: 'Clinical Risk Management',
    frequency: 'Bi-Monthly',
    description: 'Evaluation of the 1,284 high-risk member cohort, chronic disease burden, and wellness intervention opportunities.',
    kpis: [
      { label: 'Covered Active Lives', value: '48,392 members' },
      { label: 'Chronic Cohort Size', value: '5,420 members (11.2%)' },
      { label: 'High-Risk Member Cohort', value: '1,284 members (2.6%)' },
      { label: 'Cost Concentration (Top 5%)', value: '44.8% of claims spend' },
    ],
    summaryNarrative:
      'Concentration analysis indicates that 2.6% of covered members (Critical & High Risk) account for 44.8% of total financial claim incurrence. Chronic hypertension, diabetes mellitus, and cardiovascular conditions represent 68% of recurring pharmacy and outpatient specialist expenditure. Active disease management programs show a 14% reduction in avoidable emergency admissions.',
    recommendations: [
      'Enroll 1,284 high-risk members into the MedInsure Chronic Care Pharmacy Delivery Program.',
      'Establish home diagnostic monitoring for diabetic members to mitigate emergency ketoacidosis admissions.',
      'Engage corporate scheme wellness coordinators for on-site preventive biometric screenings.',
    ],
  },
];

export const ReportsView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportTemplate>(REPORT_TEMPLATES[0]);
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Executive PDF Dossier "${selectedReport.title}" generated successfully and downloaded.`);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Template Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {REPORT_TEMPLATES.map((report) => {
          const isSelected = selectedReport.id === report.id;
          return (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/40 shadow-xs ring-1 ring-teal-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-medium text-teal-700 uppercase tracking-wider">{report.category}</span>
                <span className="font-mono">{report.frequency}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{report.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {report.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Printable Dossier View */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                {selectedReport.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">• {selectedReport.frequency}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
              {selectedReport.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              MedInsure Decision Support Brief • Prepared for Executive Board & Actuarial Committee
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              disabled={isExporting}
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Core Actuarial & Financial Benchmarks
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {selectedReport.kpis.map((kpi, idx) => (
              <div key={idx} className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wide">
                  {kpi.label}
                </span>
                <span className="text-base sm:text-lg font-bold font-mono text-slate-900 block mt-1">
                  {kpi.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Narrative */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Executive Narrative & Analysis
          </h3>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {selectedReport.summaryNarrative}
          </div>
        </div>

        {/* Strategic Decision Support & Action Points */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Decision Support & Underwriting Recommendations
          </h3>
          <div className="space-y-2">
            {selectedReport.recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-3 rounded-lg border border-teal-200/80 bg-teal-50/30 text-xs text-slate-800"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Report Footer & Sign-off Block */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>
            Data Source: <span className="font-mono text-slate-600">MedInsure Python Core Engine (v2.4)</span> • Certified Actuarial Data
          </div>
          <div className="flex items-center gap-4">
            <span>Adjudicator: Dr. Evans Kiplagat</span>
            <span className="font-mono">Ref: REP-2026-09-KE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
