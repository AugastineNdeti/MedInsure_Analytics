export type TimeRange = 'today' | '7d' | '30d' | 'quarter' | 'year' | 'custom' | string;

export type ClaimStatus = 'Paid' | 'Pending' | 'Rejected' | 'Under Review' | 'Cancelled';

export type ServiceCategory = 
  | 'Outpatient' 
  | 'Inpatient' 
  | 'Pharmacy' 
  | 'Dental' 
  | 'Optical' 
  | 'Maternity' 
  | 'Emergency' 
  | 'Chronic Care'
  | string;

export type RiskSegment = 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';

export type InvestigationPriority = 'Urgent Review' | 'Routine Audit' | 'Under Investigation' | 'Cleared / Normal';

export interface GlobalFilters {
  dateRange: TimeRange;
  insuranceProduct?: string;
  product?: string;
  claimType?: string;
  region?: string;
  county?: string;
  provider?: string;
  memberType?: string;
  claimStatus?: string;
  searchQuery?: string;
}

export interface OverviewKPIData {
  totalMembers: number;
  totalMembersDelta: number;
  totalClaims: number;
  totalClaimsDelta: number;
  claimsPaid: number;
  claimsPaidDelta: number;
  claimsPending: number;
  claimsPendingDelta: number;
  claimsRatio: number;
  claimsRatioDelta: number;
  averageClaimCost: number;
  averageClaimCostDelta: number;
  rejectionRate: number;
  rejectionRateDelta: number;
  highRiskMembers: number;
  highRiskMembersDelta: number;
}

export interface MonthlyClaimsTrend {
  month: string;
  claimsCount: number;
  claimsCost: number;
  avgClaimCost: number;
  approvedCost: number;
  pendingCost: number;
}

export interface ClaimStatusBreakdown {
  status: ClaimStatus;
  count: number;
  amount: number;
  percentage: number;
  color: string;
}

export interface CategoryBreakdown {
  category: ServiceCategory;
  count: number;
  totalAmount: number;
  avgAmount: number;
  percentage: number;
}

export interface CountyDistribution {
  county: string;
  claimsCount: number;
  claimsCost: number;
  avgCost: number;
  membersCount: number;
  riskScore: number;
  topProvider: string;
}

export interface ClaimRecord {
  id: string;
  memberId: string;
  age?: number;
  gender?: string;
  providerId: string;
  providerName: string;
  county: string;
  serviceCategory: ServiceCategory;
  diagnosisCode: string;
  diagnosisCategory: string;
  serviceDate: string;
  claimAmount: number;
  approvedAmount: number;
  status: ClaimStatus;
  processingDays: number;
  riskScore: number; // 0.0 - 1.0
  expectedAmount?: number;
  deviationPercent?: number;
  anomalyFactors?: string[];
  investigationPriority?: InvestigationPriority;
}

export interface MemberRecord {
  memberId: string;
  age: number;
  ageGroup: string;
  gender: 'Female' | 'Male';
  county: string;
  schemeTier: 'Corporate Comprehensive' | 'SME Care' | 'Retail Afya' | 'Senior Shield';
  memberType: 'Principal' | 'Dependent' | 'Retiree';
  claimsCount: number;
  totalClaimCost: number;
  averageClaimCost: number;
  riskScore: number;
  riskSegment: RiskSegment;
  chronicConditions: string[];
}

export interface ProviderRecord {
  id: string;
  name: string;
  tier: 'Level 6 National' | 'Level 5 Regional Referral' | 'Level 4 Primary Hospital' | 'Specialist Clinic';
  county: string;
  claimsVolume: number;
  totalCost: number;
  avgClaimCost: number;
  approvalRate: number;
  rejectionRate: number;
  avgProcessingDays: number;
  quadrant: 'High Volume / Low Cost' | 'High Volume / High Cost' | 'Low Volume / High Cost' | 'Low Volume / Low Cost';
  anomalyScore: number;
}

export interface FinancialMetric {
  month: string;
  premiumRevenue: number;
  claimsCost: number;
  netClaimsCost: number;
  lossRatio: number;
  underwritingMargin: number;
}

export interface ForecastPoint {
  date: string;
  actual?: number;
  forecast?: number;
  lowerConfidence?: number;
  upperConfidence?: number;
  isForecast: boolean;
}

export interface AutomatedInsight {
  id: string;
  title: string;
  observation: string;
  impact: 'neutral' | 'positive' | 'warning' | 'critical';
  category: 'claims' | 'utilization' | 'provider' | 'risk' | 'financial';
  metricValue?: string;
  suggestedAction?: string;
}

export interface AnalyticsReport {
  id: string;
  title: string;
  category: string;
  period: string;
  generatedDate: string;
  fileSize: string;
  summary: string;
  keyMetrics: { label: string; value: string }[];
}
