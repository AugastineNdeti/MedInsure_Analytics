import React from 'react';
import { Filter, Calendar, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { GlobalFilters, TimeRange } from '../../types';

interface FilterBarProps {
  filters: GlobalFilters;
  onFilterChange: (newFilters: Partial<GlobalFilters>) => void;
  onReset: () => void;
  className?: string;
}

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: 'Today', value: 'today' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
  { label: 'Custom Range', value: 'custom' },
];

const PRODUCTS = ['All Products', 'Corporate Comprehensive', 'SME Care', 'Retail Afya', 'Senior Shield'];
const REGIONS = ['All Regions', 'Nairobi Metro', 'Central', 'Coast', 'Rift Valley', 'Western / Nyanza'];
const COUNTIES = [
  'All Counties',
  'Nairobi',
  'Kiambu',
  'Mombasa',
  'Nakuru',
  'Machakos',
  'Kisumu',
  'Uasin Gishu',
  'Kakamega',
  'Meru',
  'Nyeri',
];
const PROVIDERS = [
  'All Providers',
  'The Nairobi Hospital',
  'Aga Khan University Hospital',
  'Kenyatta National Hospital',
  'Mater Misericordiae Hospital',
  'MP Shah Hospital',
  'Avenue Healthcare',
  "Gertrude's Children's Hospital",
  'The Karen Hospital',
  'Mediheal Hospital Nakuru',
  'Apex Specialist Surgical Center',
  'Horizon PolyClinic Mombasa',
];
const MEMBER_TYPES = ['All Types', 'Principal', 'Dependent', 'Retiree'];
const STATUSES = ['All Statuses', 'Paid', 'Pending', 'Under Review', 'Rejected', 'Cancelled'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  className = '',
}) => {
  const isFiltered =
    filters.dateRange !== 'quarter' ||
    filters.product !== 'All Products' ||
    filters.region !== 'All Regions' ||
    filters.county !== 'All Counties' ||
    filters.provider !== 'All Providers' ||
    filters.memberType !== 'All Types' ||
    filters.claimStatus !== 'All Statuses';

  return (
    <div className={`bg-white rounded-lg border border-slate-200/90 p-3.5 shadow-xs mb-6 ${className}`}>
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Date Range Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 xl:pb-0 scrollbar-none text-xs border border-slate-200 rounded-md p-1 bg-slate-50/70">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1 hidden sm:block shrink-0" />
          {TIME_RANGES.map((item) => (
            <button
              key={item.value}
              onClick={() => onFilterChange({ dateRange: item.value })}
              className={`px-2.5 py-1 rounded font-medium transition-all shrink-0 ${
                filters.dateRange === item.value
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action controls / Reset */}
        <div className="flex items-center gap-2 self-end xl:self-auto">
          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
            Jan 2025 – Sep 2026
          </span>
        </div>
      </div>

      {/* Secondary Dropdown Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
        {/* Product Filter */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Product
          </label>
          <select
            value={filters.product}
            onChange={(e) => onFilterChange({ product: e.target.value })}
            className="w-full bg-slate-50/70 border border-slate-200 text-slate-700 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 text-xs font-medium"
          >
            {PRODUCTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => onFilterChange({ region: e.target.value })}
            className="w-full bg-slate-50/70 border border-slate-200 text-slate-700 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 text-xs font-medium"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* County */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            County
          </label>
          <select
            value={filters.county}
            onChange={(e) => onFilterChange({ county: e.target.value })}
            className="w-full bg-slate-50/70 border border-slate-200 text-slate-700 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 text-xs font-medium"
          >
            {COUNTIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Provider */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Provider
          </label>
          <select
            value={filters.provider}
            onChange={(e) => onFilterChange({ provider: e.target.value })}
            className="w-full bg-slate-50/70 border border-slate-200 text-slate-700 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 text-xs font-medium truncate"
          >
            {PROVIDERS.map((prv) => (
              <option key={prv} value={prv}>
                {prv}
              </option>
            ))}
          </select>
        </div>

        {/* Member Type */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Member Type
          </label>
          <select
            value={filters.memberType}
            onChange={(e) => onFilterChange({ memberType: e.target.value })}
            className="w-full bg-slate-50/70 border border-slate-200 text-slate-700 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 text-xs font-medium"
          >
            {MEMBER_TYPES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Claim Status */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Claim Status
          </label>
          <select
            value={filters.claimStatus}
            onChange={(e) => onFilterChange({ claimStatus: e.target.value })}
            className="w-full bg-slate-50/70 border border-slate-200 text-slate-700 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 text-xs font-medium"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
