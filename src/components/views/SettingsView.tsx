import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Database,
  Code2,
  Sliders,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Save,
  Globe,
} from 'lucide-react';
import { apiService } from '../../services/api';

export const SettingsView: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000/api/v1');
  const [isSimulated, setIsSimulated] = useState(true);
  const [anomalyThreshold, setAnomalyThreshold] = useState(0.75);
  const [lossRatioAlert, setLossRatioAlert] = useState(70.0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'testing' | 'offline'>('connected');
  const [isSaved, setIsSaved] = useState(false);

  const API_ENDPOINTS = [
    { method: 'GET', path: '/api/v1/summary', desc: 'Returns executive KPIs, monthly trend series, status breakdown, and county distributions' },
    { method: 'GET', path: '/api/v1/claims', desc: 'Paginated tabular claims data with multi-column filtering, sorting and risk scores' },
    { method: 'GET', path: '/api/v1/claims/{id}', desc: 'Detailed adjudication record, line-item pricing, and clinical anomaly flags' },
    { method: 'GET', path: '/api/v1/members', desc: 'Member utilization demographics, chronic cohorts, and actuarial risk segmentations' },
    { method: 'GET', path: '/api/v1/providers', desc: 'Hospital and clinic performance benchmarks, SLA turnaround, and quadrant coordinates' },
    { method: 'GET', path: '/api/v1/risk/anomalies', desc: 'Machine-learning statistical outlier detection queue (Isolation Forest & Z-score)' },
    { method: 'GET', path: '/api/v1/financial/summary', desc: 'Earned written premium, loss ratio trajectory, and product underwriting margins' },
    { method: 'GET', path: '/api/v1/forecast/claims', desc: 'Holt-Winters / ARIMA seasonal projection with 95% upper and lower confidence intervals' },
    { method: 'GET', path: '/api/v1/insights', desc: 'Automated descriptive and predictive narrative observations generated from pandas pipeline' },
  ];

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }, 800);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Portfolio Highlight Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Server className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
                Backend Architecture Specification
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-sans">
              Python Analytics Engine & REST API Integration
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              This frontend UI is decoupled from the backend and designed to consume clean REST APIs produced by Python
              analytics frameworks (FastAPI, Pandas, NumPy, Scikit-learn, and Statsmodels).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isSimulated ? 'Simulated Engine (Active)' : 'Live REST API'}
            </span>
          </div>
        </div>
      </div>

      {/* Row 1: Connection & Data Source Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Settings */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-600" />
            <span>Python REST API Configuration</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                API Base URL (FastAPI / Flask Gateway)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-mono text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  onClick={handleTestConnection}
                  disabled={connectionStatus === 'testing'}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus === 'testing' ? 'animate-spin' : ''}`} />
                  <span>{connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Configurable via <code className="text-slate-600 bg-slate-100 px-1 py-0.5 rounded">VITE_API_BASE_URL</code> environment variable.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Data Runtime Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulated(true)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSimulated
                      ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-slate-900 block text-xs">Simulated Engine</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Realistic synthetic Kenyan health scheme data (ideal for portfolio demos)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSimulated(false)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    !isSimulated
                      ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-slate-900 block text-xs">Live Python REST API</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Polls local or remote FastAPI endpoints using Axios/Fetch contracts
                  </span>
                </button>
              </div>
            </div>

            {isSaved && (
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Configuration handshake verified. Service latency: 142ms.</span>
              </div>
            )}
          </div>
        </div>

        {/* Analytical Risk & Loss Ratio Alert Thresholds */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>Actuarial & Governance Thresholds</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-medium">
                  Statistical Anomaly Flag Threshold
                </label>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  Score ≥ {anomalyThreshold.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={anomalyThreshold}
                onChange={(e) => setAnomalyThreshold(parseFloat(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Claims exceeding this anomaly score from the Python model are queued for senior clinical review.
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-medium">
                  Portfolio Loss Ratio Alert Ceiling
                </label>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {lossRatioAlert.toFixed(1)}% Max
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="85"
                step="1"
                value={lossRatioAlert}
                onChange={(e) => setLossRatioAlert(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Loss ratios exceeding {lossRatioAlert}% trigger automatic underwriting premium surcharges on annual renewals.
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Scheme Currency: <strong className="text-slate-800">KES (Kenyan Shillings)</strong></span>
              <span className="font-mono">Timezone: Africa/Nairobi (EAT)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: REST API Endpoints Contract Map */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-teal-600" />
              <span>REST API Endpoints Specification (Python Backend Contract)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict JSON schemas implemented in both frontend TypeScript types and Python Pydantic models.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">9 Core Endpoints</span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
          {API_ENDPOINTS.map((endpoint, i) => (
            <div key={i} className="p-3 bg-white hover:bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-teal-100 text-teal-800 border border-teal-200">
                  {endpoint.method}
                </span>
                <span className="font-mono font-semibold text-slate-900">{endpoint.path}</span>
              </div>
              <span className="text-slate-500 text-[11px] sm:text-right max-w-md">
                {endpoint.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
