import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; height?: string; className?: string }> = ({
  rows = 4,
  height = 'h-6',
  className = '',
}) => {
  return (
    <div className={`w-full space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`bg-slate-200/70 rounded ${height} w-full`}
          style={{ width: `${Math.max(45, 100 - (i % 3) * 15)}%` }}
        />
      ))}
    </div>
  );
};

export const KPILoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 h-28 space-y-3">
          <div className="h-3 bg-slate-200 rounded w-1/2" />
          <div className="h-7 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
};
