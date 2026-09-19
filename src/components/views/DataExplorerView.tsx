import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { FilterBar } from '../common/FilterBar';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { GlobalFilters, ClaimRecord } from '../../types';
import { mockClaimsList } from '../../data/mockData';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface DataExplorerViewProps {
  filters: GlobalFilters;
  onFilterChange: (newFilters: Partial<GlobalFilters>) => void;
  onResetFilters: () => void;
}

type SortField =
  | 'id'
  | 'memberId'
  | 'serviceDate'
  | 'claimAmount'
  | 'approvedAmount'
  | 'riskScore'
  | 'providerName'
  | 'serviceCategory';

export const DataExplorerView: React.FC<DataExplorerViewProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('serviceDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);

  // Filter and sort claims
  const processedClaims = useMemo(() => {
    let result = [...mockClaimsList];

    // Global filter constraints
    if (filters.claimType !== 'All') {
      result = result.filter((c) => c.serviceCategory === filters.claimType);
    }
    if (filters.claimStatus !== 'All') {
      result = result.filter((c) => c.status === filters.claimStatus);
    }
    if (filters.county !== 'All') {
      result = result.filter((c) => c.county === filters.county);
    }
    if (filters.provider !== 'All') {
      result = result.filter((c) => c.providerName === filters.provider);
    }

    // Text search query (ID, memberId, diagnosis, provider)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.memberId.toLowerCase().includes(q) ||
          c.providerName.toLowerCase().includes(q) ||
          c.diagnosisCategory.toLowerCase().includes(q) ||
          c.diagnosisCode.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [filters, searchQuery, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(processedClaims.length / pageSize));
  const paginatedClaims = processedClaims.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // CSV export function
  const handleExportCSV = () => {
    const headers = [
      'Claim ID',
      'Member ID',
      'Age',
      'Gender',
      'County',
      'Provider',
      'Service Category',
      'Diagnosis Code',
      'Diagnosis Category',
      'Service Date',
      'Claim Amount',
      'Approved Amount',
      'Status',
      'Risk Score',
    ];

    const rows = processedClaims.map((c) => [
      c.id,
      c.memberId,
      c.age,
      c.gender,
      c.county,
      `"${c.providerName}"`,
      c.serviceCategory,
      c.diagnosisCode,
      `"${c.diagnosisCategory}"`,
      c.serviceDate,
      c.claimAmount,
      c.approvedAmount,
      c.status,
      c.riskScore,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medinsure_claims_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* Explorer Controls: Search bar + CSV Export */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Claim ID (CLM-...), Member ID, Provider, Diagnosis..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-500 font-mono">
            Showing {formatNumber(processedClaims.length)} matching records
          </span>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Interactive Claims Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 font-mono"
                >
                  <div className="flex items-center gap-1">
                    Claim ID
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('memberId')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 font-mono"
                >
                  <div className="flex items-center gap-1">
                    Member ID
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-2 text-center">Demog</th>
                <th className="py-3 px-3">County</th>
                <th
                  onClick={() => handleSort('providerName')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    Provider
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('serviceCategory')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    Category
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">ICD-10 Diagnosis</th>
                <th
                  onClick={() => handleSort('serviceDate')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    Date
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('claimAmount')}
                  className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    Claimed
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('approvedAmount')}
                  className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    Approved
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                <th
                  onClick={() => handleSort('riskScore')}
                  className="py-3 px-3 text-center cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center justify-center gap-1">
                    Risk
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedClaims.map((claim) => (
                <tr
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim)}
                  className="hover:bg-teal-50/40 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-900">{claim.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{claim.memberId}</td>
                  <td className="py-2.5 px-2 text-center text-slate-500">
                    {claim.age ? `${claim.age}${claim.gender ? claim.gender[0] : ''}` : '38F'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{claim.county}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 truncate max-w-[150px]" title={claim.providerName}>
                    {claim.providerName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{claim.serviceCategory}</td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[180px]" title={claim.diagnosisCategory}>
                    <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded mr-1 text-slate-500">
                      {claim.diagnosisCode}
                    </span>
                    {claim.diagnosisCategory}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{claim.serviceDate}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(claim.claimAmount)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                    {claim.approvedAmount > 0 ? formatCurrency(claim.approvedAmount) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <StatusBadge status={claim.status} />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <RiskBadge score={claim.riskScore} />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClaim(claim);
                      }}
                      className="p-1 text-slate-400 hover:text-teal-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, processedClaims.length)} of {formatNumber(processedClaims.length)} records
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Claim Detail Modal Drawer */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Data Explorer Detail View
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedClaim.id} • {selectedClaim.memberId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Provider Facility</span>
                <span className="font-semibold text-slate-900">{selectedClaim.providerName}</span>
                <span className="block text-slate-500 mt-0.5">{selectedClaim.county} County</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Member Demographics</span>
                <span className="font-semibold text-slate-900">
                  {selectedClaim.age ? `${selectedClaim.age} years old (${selectedClaim.gender || 'Female'})` : '42 years old (Female)'}
                </span>
                <span className="block text-slate-500 mt-0.5">Scheme member</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Claimed Amount</span>
                <span className="font-bold text-base text-slate-900 font-mono">
                  {formatCurrency(selectedClaim.claimAmount)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Approved Payout</span>
                <span className="font-bold text-base text-emerald-700 font-mono">
                  {selectedClaim.approvedAmount > 0 ? formatCurrency(selectedClaim.approvedAmount) : 'Pending Review'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Clinical Diagnosis</span>
              <p className="font-medium text-slate-800">
                <strong className="font-mono text-teal-700 mr-1">{selectedClaim.diagnosisCode}:</strong>
                {selectedClaim.diagnosisCategory}
              </p>
            </div>

            {selectedClaim.anomalyFactors && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-rose-800 font-semibold">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Variance Observations:</span>
                </div>
                <ul className="list-disc list-inside text-rose-700 space-y-0.5 pl-1">
                  {selectedClaim.anomalyFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span>Status: <StatusBadge status={selectedClaim.status} /></span>
                <span>Risk Score: <RiskBadge score={selectedClaim.riskScore} /></span>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
