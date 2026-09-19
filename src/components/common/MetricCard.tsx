import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, HelpCircle } from 'lucide-react';
import { formatDelta } from '../../utils/formatters';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  inverseDeltaColors?: boolean; // When positive delta is bad (e.g. Rejection Rate, Loss Ratio)
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  isDemoData?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  delta,
  deltaLabel = 'vs prev. period',
  inverseDeltaColors = false,
  subtitle,
  icon,
  badge,
  isDemoData = true,
}) => {
  const deltaInfo = delta !== undefined ? formatDelta(delta) : null;

  // For metrics like Rejection Rate or Loss Ratio, a delta increase is warning/negative
  const isGood = deltaInfo ? (inverseDeltaColors ? !deltaInfo.isPositive : deltaInfo.isPositive) : true;

  return (
    <div
      id={id}
      className="bg-white rounded-lg border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between relative group"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {title}
          </span>
          <div className="flex items-center gap-1.5">
            {isDemoData && (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-medium">
                Demo
              </span>
            )}
            {icon && <div className="text-slate-400 group-hover:text-slate-600 transition-colors">{icon}</div>}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
            {value}
          </span>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-teal-50 text-teal-700 border border-teal-200">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        {deltaInfo && (
          <div className="flex items-center gap-1">
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-semibold text-[11px] ${
                deltaInfo.isNeutral
                  ? 'bg-slate-100 text-slate-600'
                  : isGood
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}
            >
              {deltaInfo.isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : deltaInfo.isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {deltaInfo.text}
            </span>
            <span className="text-slate-500 text-[11px] truncate max-w-[120px]">{deltaLabel}</span>
          </div>
        )}
        {subtitle && <span className="text-slate-400 text-[11px] ml-auto">{subtitle}</span>}
      </div>
    </div>
  );
};
