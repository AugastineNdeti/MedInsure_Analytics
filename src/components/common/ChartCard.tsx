import React from 'react';
import { Info, Download } from 'lucide-react';

interface ChartCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  tooltipText?: string;
  headerRight?: React.ReactNode;
  onExport?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  id,
  title,
  subtitle,
  tooltipText,
  headerRight,
  onExport,
  children,
  className = '',
}) => {
  return (
    <div
      id={id}
      className={`bg-white rounded-lg border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
              {title}
            </h3>
            {tooltipText && (
              <div className="group/tip relative inline-block">
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/tip:block w-56 p-2 bg-slate-900 text-white text-[11px] rounded shadow-lg z-20 leading-tight">
                  {tooltipText}
                </div>
              </div>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {headerRight}
          {onExport && (
            <button
              onClick={onExport}
              title="Export Chart Data"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full flex-1 min-h-0">{children}</div>
    </div>
  );
};
