/**
 * Financial & Insurance Formatters for MedInsure Analytics
 */

export function formatCurrency(amount: number, compact = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'KES 0';

  if (compact) {
    if (Math.abs(amount) >= 1_000_000_000) {
      return `KES ${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    if (Math.abs(amount) >= 1_000_000) {
      return `KES ${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `KES ${(amount / 1_000).toFixed(1)}k`;
    }
    return `KES ${Math.round(amount)}`;
  }

  return `KES ${Math.round(amount).toLocaleString('en-KE')}`;
}

export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-KE');
}

export function formatPercent(val: number, decimals = 1): string {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  return `${val.toFixed(decimals)}%`;
}

export function formatDelta(val: number): { text: string; isPositive: boolean; isNeutral: boolean } {
  if (val === 0) return { text: '0.0%', isPositive: false, isNeutral: true };
  const isPositive = val > 0;
  return {
    text: `${isPositive ? '+' : ''}${val.toFixed(1)}%`,
    isPositive,
    isNeutral: false,
  };
}
