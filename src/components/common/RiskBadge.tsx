import React from 'react';
import { RiskSegment, InvestigationPriority } from '../../types';

interface RiskBadgeProps {
  segment?: RiskSegment;
  priority?: InvestigationPriority;
  score?: number;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ segment, priority, score, className = '' }) => {
  if (score !== undefined) {
    let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
    if (score >= 0.8) colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
    else if (score >= 0.5) colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
    else colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${colorClasses} ${className}`}>
        {score.toFixed(2)}
      </span>
    );
  }

  if (priority) {
    switch (priority) {
      case 'Urgent Review':
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            Urgent Review
          </span>
        );
      case 'Routine Audit':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>
            Routine Audit
          </span>
        );
      case 'Under Investigation':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 ${className}`}>
            Under Investigation
          </span>
        );
      case 'Cleared / Normal':
      default:
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
            Normal / Audited
          </span>
        );
    }
  }

  if (segment) {
    switch (segment) {
      case 'Critical Risk':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
            Critical Risk
          </span>
        );
      case 'High Risk':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 ${className}`}>
            High Risk
          </span>
        );
      case 'Moderate Risk':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200 ${className}`}>
            Moderate Risk
          </span>
        );
      case 'Low Risk':
      default:
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
            Low Risk
          </span>
        );
    }
  }

  return null;
};
