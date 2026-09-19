import {
  OverviewKPIData,
  MonthlyClaimsTrend,
  ClaimStatusBreakdown,
  CategoryBreakdown,
  CountyDistribution,
  ClaimRecord,
  MemberRecord,
  ProviderRecord,
  FinancialMetric,
  ForecastPoint,
  AutomatedInsight,
  GlobalFilters,
} from '../types';
import {
  mockOverviewKPIs,
  mockMonthlyTrends,
  mockStatusBreakdown,
  mockCategoryBreakdown,
  mockCountyDistribution,
  mockTopExpensiveClaims,
  mockRiskAnomalies,
  mockProviders,
  mockMembers,
  mockFinancials,
  mockForecastData,
  mockInsights,
  mockExplorerClaims,
} from '../data/mockData';

// Base URL configured via environment variable with fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Configurable client mode for portfolio / live evaluation
export interface ApiConfig {
  useLiveBackend: boolean;
  simulatedLatencyMs: number;
  customBaseUrl: string;
}

const STORAGE_KEY_API_CONFIG = 'medinsure_api_config';

export function getApiConfig(): ApiConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_API_CONFIG);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load api config from storage', e);
  }
  return {
    useLiveBackend: false, // Default to synthetic engine for smooth standalone portfolio evaluation
    simulatedLatencyMs: 150,
    customBaseUrl: API_BASE_URL,
  };
}

export function saveApiConfig(config: ApiConfig): void {
  localStorage.setItem(STORAGE_KEY_API_CONFIG, JSON.stringify(config));
}

// Utility delay for realistic dashboard responsiveness
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MedInsureApiService {
  private config: ApiConfig;

  constructor() {
    this.config = getApiConfig();
  }

  public updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    saveApiConfig(this.config);
  }

  public getConfig(): ApiConfig {
    return { ...this.config };
  }

  // Generic request wrapper that tries live Python REST API if enabled, or falls back to mock
  private async request<T>(endpoint: string, fallbackData: T): Promise<T> {
    if (this.config.useLiveBackend) {
      try {
        const url = `${this.config.customBaseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return await res.json();
      } catch (err) {
        console.warn(`[Python API Client] Call to ${endpoint} failed, utilizing local fallback engine:`, err);
        // Seamless fallback ensures UI never breaks during demos
      }
    }

    if (this.config.simulatedLatencyMs > 0) {
      await delay(this.config.simulatedLatencyMs);
    }
    return fallbackData;
  }

  // 1. GET /api/dashboard/summary
  async getDashboardSummary(filters?: Partial<GlobalFilters>): Promise<{
    kpis: OverviewKPIData;
    monthlyTrends: MonthlyClaimsTrend[];
    statusBreakdown: ClaimStatusBreakdown[];
    categoryBreakdown: CategoryBreakdown[];
    countyDistribution: CountyDistribution[];
  }> {
    return this.request('/dashboard/summary', {
      kpis: mockOverviewKPIs,
      monthlyTrends: mockMonthlyTrends,
      statusBreakdown: mockStatusBreakdown,
      categoryBreakdown: mockCategoryBreakdown,
      countyDistribution: mockCountyDistribution,
    });
  }

  // 2. GET /api/claims
  async getClaims(filters?: Partial<GlobalFilters>): Promise<{
    claims: ClaimRecord[];
    totalCount: number;
  }> {
    let filtered = [...mockExplorerClaims];
    if (filters?.claimStatus && filters.claimStatus !== 'All') {
      filtered = filtered.filter(c => c.status === filters.claimStatus);
    }
    if (filters?.county && filters.county !== 'All') {
      filtered = filtered.filter(c => c.county === filters.county);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.id.toLowerCase().includes(q) ||
          c.memberId.toLowerCase().includes(q) ||
          c.providerName.toLowerCase().includes(q) ||
          c.diagnosisCategory.toLowerCase().includes(q)
      );
    }
    return this.request('/claims', {
      claims: filtered,
      totalCount: filtered.length,
    });
  }

  // 3. GET /api/claims/trends
  async getClaimsTrends(timeRange?: string): Promise<MonthlyClaimsTrend[]> {
    return this.request('/claims/trends', mockMonthlyTrends);
  }

  // 4. GET /api/members
  async getMembers(): Promise<{
    members: MemberRecord[];
    demographics: { ageGroup: string; count: number; avgCost: number }[];
    claimsPerMemberDist: { range: string; count: number; percentage: number }[];
  }> {
    const demographics = [
      { ageGroup: '18–25', count: 6240, avgCost: 7850 },
      { ageGroup: '26–35', count: 14890, avgCost: 10420 },
      { ageGroup: '36–45', count: 12450, avgCost: 13910 },
      { ageGroup: '46–55', count: 8120, avgCost: 19840 },
      { ageGroup: '56–65', count: 4780, avgCost: 28400 },
      { ageGroup: '65+', count: 1912, avgCost: 44350 },
    ];

    const claimsPerMemberDist = [
      { range: '0 claims', count: 35545, percentage: 73.5 },
      { range: '1 claim', count: 6840, percentage: 14.1 },
      { range: '2–3 claims', count: 4120, percentage: 8.5 },
      { range: '4–5 claims', count: 1280, percentage: 2.6 },
      { range: '6+ claims', count: 607, percentage: 1.3 },
    ];

    return this.request('/members', {
      members: mockMembers,
      demographics,
      claimsPerMemberDist,
    });
  }

  // 5. GET /api/members/risk
  async getMemberRiskSegmentation(): Promise<{
    segments: { segment: string; count: number; percentage: number; color: string; avgCost: number }[];
  }> {
    return this.request('/members/risk', {
      segments: [
        { segment: 'Low Risk', count: 32906, percentage: 68.0, color: '#10b981', avgCost: 6200 },
        { segment: 'Moderate Risk', count: 10646, percentage: 22.0, color: '#0ea5e9', avgCost: 18400 },
        { segment: 'High Risk', count: 3581, percentage: 7.4, color: '#f59e0b', avgCost: 56900 },
        { segment: 'Critical Risk', count: 1259, percentage: 2.6, color: '#ef4444', avgCost: 142000 },
      ],
    });
  }

  // 6. GET /api/providers
  async getProviders(): Promise<ProviderRecord[]> {
    return this.request('/providers', mockProviders);
  }

  // 7. GET /api/providers/performance
  async getProviderPerformance(): Promise<{
    providers: ProviderRecord[];
    summary: {
      activeProviders: number;
      avgApprovalRate: number;
      avgProcessingDays: number;
      highCostQuadrantCount: number;
    };
  }> {
    return this.request('/providers/performance', {
      providers: mockProviders,
      summary: {
        activeProviders: 342,
        avgApprovalRate: 91.3,
        avgProcessingDays: 4.2,
        highCostQuadrantCount: 11,
      },
    });
  }

  // 8. GET /api/risk/anomalies
  async getRiskAnomalies(): Promise<{
    anomalies: ClaimRecord[];
    highRiskClaimsCount: number;
    highRiskMembersCount: number;
    anomalousProvidersCount: number;
    claimsUnderReviewCount: number;
    estimatedExposure: number;
  }> {
    return this.request('/risk/anomalies', {
      anomalies: mockRiskAnomalies,
      highRiskClaimsCount: 142,
      highRiskMembersCount: 1284,
      anomalousProvidersCount: 8,
      claimsUnderReviewCount: 38,
      estimatedExposure: 24800000,
    });
  }

  // 9. GET /api/financial/summary
  async getFinancialSummary(): Promise<{
    financials: FinancialMetric[];
    kpis: {
      premiumRevenue: number;
      claimsCost: number;
      netClaimsCost: number;
      lossRatio: number;
      avgPremiumPerMember: number;
      avgCostPerMember: number;
      outstandingClaims: number;
    };
  }> {
    return this.request('/financial/summary', {
      financials: mockFinancials,
      kpis: {
        premiumRevenue: 255000000, // KES 255.0M
        claimsCost: 184600000, // KES 184.6M
        netClaimsCost: 178200000, // KES 178.2M
        lossRatio: 72.4, // 72.4%
        avgPremiumPerMember: 5269, // KES 5,269
        avgCostPerMember: 3815, // KES 3,815
        outstandingClaims: 31800000, // KES 31.8M
      },
    });
  }

  // 10. GET /api/forecast/claims
  async getClaimsForecast(horizonMonths = 12): Promise<ForecastPoint[]> {
    return this.request(`/forecast/claims?horizon=${horizonMonths}`, mockForecastData);
  }

  // 11. GET /api/insights
  async getInsights(): Promise<AutomatedInsight[]> {
    return this.request('/insights', mockInsights);
  }

  // Health ping test for Settings view
  async testPythonConnection(customUrl?: string): Promise<{ success: boolean; message: string; latency: number }> {
    const targetUrl = customUrl || this.config.customBaseUrl;
    const start = performance.now();
    try {
      const res = await fetch(`${targetUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        return { success: true, message: `Python REST Engine responsive (${res.status} OK)`, latency };
      }
      return { success: false, message: `Python REST responded with HTTP ${res.status}`, latency };
    } catch (e: any) {
      const latency = Math.round(performance.now() - start);
      return {
        success: false,
        message: `Connection to ${targetUrl} unreachable (${e.message || 'Network error'}). Running seamlessly in Client Synthetic Mode.`,
        latency,
      };
    }
  }
}

export const apiService = new MedInsureApiService();
