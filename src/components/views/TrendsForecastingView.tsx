import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Cpu,
  Calendar,
  AlertCircle,
  HelpCircle,
  Sliders,
  CheckCircle2,
  Info,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
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
import { GlobalFilters, ForecastPoint } from '../../types';
import { apiService } from '../../services/api';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

interface TrendsForecastingViewProps {
  filters: GlobalFilters;
  onFilterChange: (newFilters: Partial<GlobalFilters>) => void;
  onResetFilters: () => void;
}

export const TrendsForecastingView: React.FC<TrendsForecastingViewProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [horizon, setHorizon] = useState<3 | 6 | 12>(12);
  const [metric, setMetric] = useState<'cost' | 'claims' | 'members'>('cost');
  const [model, setModel] = useState<string>('Holt-Winters Seasonal (Triple Exp)');
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);

  useEffect(() => {
    async function load() {
      const data = await apiService.getClaimsForecast(horizon);
      setForecastData(data);
    }
    load();
  }, [horizon]);

  // Adjust display data depending on horizon & metric
  const displayData = forecastData
    .filter((pt) => {
      if (!pt.isForecast) return true;
      // Filter based on horizon
      const forecastIndices = ['Oct 26', 'Nov 26', 'Dec 26', 'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'May 27', 'Jun 27', 'Jul 27', 'Aug 27', 'Sep 27'];
      const idx = forecastIndices.indexOf(pt.date);
      return idx >= 0 && idx < horizon;
    })
    .map((pt) => {
      if (metric === 'cost') return pt;
      if (metric === 'claims') {
        // Approximate claim counts (cost / ~15,000)
        return {
          ...pt,
          actual: pt.actual ? Math.round(pt.actual / 15000) : undefined,
          forecast: pt.forecast ? Math.round(pt.forecast / 15000) : undefined,
          lowerConfidence: pt.lowerConfidence ? Math.round(pt.lowerConfidence / 15000) : undefined,
          upperConfidence: pt.upperConfidence ? Math.round(pt.upperConfidence / 15000) : undefined,
        };
      }
      // Members metric (~48k + growth)
      return {
        ...pt,
        actual: pt.actual ? Math.round(48000 + (pt.actual / 2000000) * 100) : undefined,
        forecast: pt.forecast ? Math.round(48500 + (pt.forecast / 2000000) * 120) : undefined,
        lowerConfidence: pt.lowerConfidence ? Math.round(47500 + (pt.lowerConfidence / 2000000) * 90) : undefined,
        upperConfidence: pt.upperConfidence ? Math.round(49500 + (pt.upperConfidence / 2000000) * 150) : undefined,
      };
    });

  const renderForecastTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload as ForecastPoint;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-md shadow-xl text-xs font-sans space-y-1.5 border border-slate-700">
          <div className="flex items-center justify-between gap-4 border-b border-slate-700 pb-1.5">
            <span className="font-semibold text-teal-300">{label}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium ${data.isForecast ? 'bg-amber-500/20 text-amber-300' : 'bg-teal-500/20 text-teal-300'}`}>
              {data.isForecast ? 'Projected Forecast' : 'Historical Actual'}
            </span>
          </div>

          {data.actual !== undefined && (
            <div className="flex justify-between gap-6">
              <span className="text-slate-400">Actual Value:</span>
              <span className="font-mono font-bold text-teal-400">
                {metric === 'cost' ? formatCurrency(data.actual) : formatNumber(data.actual)}
              </span>
            </div>
          )}

          {data.forecast !== undefined && (
            <>
              <div className="flex justify-between gap-6">
                <span className="text-slate-400">Mean Forecast:</span>
                <span className="font-mono font-bold text-amber-400">
                  {metric === 'cost' ? formatCurrency(data.forecast) : formatNumber(data.forecast)}
                </span>
              </div>
              <div className="flex justify-between gap-6 text-[11px]">
                <span className="text-slate-400">95% Upper Bound:</span>
                <span className="font-mono text-slate-300">
                  {metric === 'cost' ? formatCurrency(data.upperConfidence || 0) : formatNumber(data.upperConfidence || 0)}
                </span>
              </div>
              <div className="flex justify-between gap-6 text-[11px]">
                <span className="text-slate-400">95% Lower Bound:</span>
                <span className="font-mono text-slate-300">
                  {metric === 'cost' ? formatCurrency(data.lowerConfidence || 0) : formatNumber(data.lowerConfidence || 0)}
                </span>
              </div>
            </>
          )}
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

      {/* Model & Parameter Selection Toolbar */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-teal-50 text-teal-700 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-900 block">
              Python Actuarial Forecasting Engine
            </span>
            <span className="text-[11px] text-slate-500">
              Seasonal decomposition with confidence intervals
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Metric Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium">
            <button
              onClick={() => setMetric('cost')}
              className={`px-2.5 py-1 rounded transition-all ${
                metric === 'cost' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Claims Cost
            </button>
            <button
              onClick={() => setMetric('claims')}
              className={`px-2.5 py-1 rounded transition-all ${
                metric === 'claims' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Claims Count
            </button>
            <button
              onClick={() => setMetric('members')}
              className={`px-2.5 py-1 rounded transition-all ${
                metric === 'members' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Members
            </button>
          </div>

          {/* Forecast Horizon */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium">
            {[3, 6, 12].map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h as any)}
                className={`px-2.5 py-1 rounded transition-all ${
                  horizon === h ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {h}M Horizon
              </button>
            ))}
          </div>

          {/* Model Selector */}
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-medium rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="Holt-Winters Seasonal (Triple Exp)">Holt-Winters Seasonal</option>
            <option value="ARIMA(2,1,1)(1,0,1)12">SARIMA (2,1,1) Seasonal</option>
            <option value="Prophet Additive Decomposition">Facebook Prophet Engine</option>
          </select>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <ChartCard
        title={`Claims Incurred Forecast (${horizon}-Month Horizon)`}
        subtitle="Historical monthly actuals followed by statistical projection with 95% confidence interval band"
        tooltipText="Green solid line = Historical Actuals. Amber dashed line = Mean Projection. Shaded area = 95% Confidence Interval."
        headerRight={
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-teal-700">
              <span className="w-3 h-0.5 bg-teal-600 inline-block" /> Actual Data
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-700">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-600 inline-block" /> Projected Forecast
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
              Model: {model}
            </span>
          </div>
        }
      >
        <div className="h-96 w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 10, right: 25, left: 15, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => metric === 'cost' ? formatCurrency(v, true) : formatNumber(v)}
              />
              <Tooltip content={renderForecastTooltip} />

              {/* Dividing reference line between actual and forecast */}
              <ReferenceLine
                x="Sep 26"
                stroke="#64748b"
                strokeDasharray="3 3"
                label={{ value: 'Forecast Cutoff (Sep 2026)', position: 'insideTopLeft', fill: '#475569', fontSize: 10 }}
              />

              {/* 95% Confidence Interval Band */}
              <Area
                type="monotone"
                dataKey="upperConfidence"
                stroke="transparent"
                fill="url(#confidenceGradient)"
                name="95% Upper CI"
              />
              <Area
                type="monotone"
                dataKey="lowerConfidence"
                stroke="transparent"
                fill="#ffffff"
                name="95% Lower CI"
              />

              {/* Actual Line */}
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual Data"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0d9488' }}
              />

              {/* Forecast Line */}
              <Line
                type="monotone"
                dataKey="forecast"
                name="Forecast Projection"
                stroke="#d97706"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#d97706' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mandatory Actuarial Disclaimer Note */}
        <div className="mt-4 p-3.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Actuarial Modeling Disclaimer:</strong> Forecasts reflect statistical time-series projections
            incorporating past 21-month claims seasonality, medical tariff inflation (+7.5% p.a.), and estimated IBNR
            (Incurred But Not Reported) development factors. Projections are provided as <strong>decision-support estimates</strong> for
            pricing and reserve guidance rather than guaranteed financial outcomes.
          </p>
        </div>
      </ChartCard>

      {/* Row 2: Projected Forecast Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
            12-Month Projected Claims Payout
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900">KES 338.9M</span>
          <span className="text-xs text-slate-500 block">+14.2% vs previous 12-month period</span>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
            Recommended IBNR Reserve
          </span>
          <span className="text-2xl font-bold font-mono text-teal-700">KES 34.2M</span>
          <span className="text-xs text-slate-500 block">Based on Chain-Ladder actuarial method</span>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
            Expected Loss Ratio Range
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900">71.0% – 73.8%</span>
          <span className="text-xs text-amber-600 block">Close monitoring required on SME tier</span>
        </div>
      </div>
    </div>
  );
};
