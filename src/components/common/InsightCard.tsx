import React from 'react';
import { Sparkles, Terminal, AlertTriangle, Info, TrendingUp, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { AutomatedInsight } from '../../types';

interface InsightCardProps {
  insights: AutomatedInsight[];
  metadata?: {
    source?: string;
    lastUpdated?: string;
    recordsAnalyzed?: string;
    period?: string;
  };
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insights,
  metadata = {
    source: 'Claims Analytics Engine (Python / SciPy / Pandas)',
    lastUpdated: '19 Sep 2026, 14:32 EAT',
    recordsAnalyzed: '1.24M',
    period: 'Jan 2025 – Sep 2026',
  },
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 ${className}`}>
      {/* Header with Title & Python badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Automated Insights
            </h3>
            <p className="text-[11px] text-slate-500">
              Statistical anomalies, cost variance and utilization signals
            </p>
          </div>
        </div>

        {/* Powered by Python Analytics Engine Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 text-slate-100 text-[11px] font-mono tracking-tight font-medium shadow-xs self-start sm:self-auto">
          <Terminal className="w-3 h-3 text-teal-400" />
          <span>Powered by Python Analytics Engine</span>
        </div>
      </div>

      {/* Insights List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {insights.map((item) => {
          let borderStyle = 'border-slate-200 bg-slate-50/50';
          let icon = <Info className="w-4 h-4 text-cyan-600" />;
          let badgeColor = 'bg-cyan-50 text-cyan-700 border-cyan-200';

          if (item.impact === 'warning') {
            borderStyle = 'border-amber-200/70 bg-amber-50/20';
            icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
            badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
          } else if (item.impact === 'critical') {
            borderStyle = 'border-rose-200/70 bg-rose-50/20';
            icon = <AlertOctagon className="w-4 h-4 text-rose-600" />;
            badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
          } else if (item.impact === 'positive') {
            borderStyle = 'border-emerald-200/70 bg-emerald-50/20';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
            badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          }

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${borderStyle}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {icon}
                    <span className="text-xs font-semibold text-slate-800">{item.title}</span>
                  </div>
                  {item.metricValue && (
                    <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${badgeColor}`}>
                      {item.metricValue}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.observation}</p>
              </div>

              {item.suggestedAction && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-start gap-1">
                  <span className="font-semibold text-slate-700 shrink-0">Action:</span>
                  <span className="line-clamp-2">{item.suggestedAction}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Analytical Metadata Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Data source: {metadata.source}</span>
          <span>•</span>
          <span>Records analyzed: {metadata.recordsAnalyzed}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Period: {metadata.period}</span>
          <span>•</span>
          <span>Last updated: {metadata.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};
