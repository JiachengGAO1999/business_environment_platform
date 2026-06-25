// ============================================================
// 全球营商环境智能分析平台 — 核心类型定义
// ============================================================

// --- 字面量类型 ---

export type DataOrigin = 'mock' | 'real';

export type SourceType =
  | 'government'
  | 'international_org'
  | 'media'
  | 'think_tank'
  | 'company'
  | 'database';

export type Reliability = 'high' | 'medium' | 'low';

export type RelevanceLevel = 'high' | 'medium' | 'low' | 'noise';

export type AnalysisDimension =
  | 'political_geopolitical_environment'
  | 'financial_investment_environment'
  | 'industrial_market_environment'
  | 'compliance_rule_of_law_environment'
  | 'innovation_technology_environment'
  | 'social_cultural_environment';

export type FactType =
  | 'macro'
  | 'policy'
  | 'trade'
  | 'risk'
  | 'opportunity'
  | 'recommendation';

export type Confidence = 'high' | 'medium' | 'low';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type OpportunityLevel = 'low' | 'medium' | 'high';

export type ReportStatus = 'not_started' | 'draft' | 'in_review' | 'approved' | 'archived';

export type ReviewAction = 'approved' | 'needs_revision' | 'unsupported' | 'factual_conflict' | 'delete';

export type FetchStatus = 'success' | 'failed' | 'partial_success' | 'manual_import';

// --- 维度标签映射 ---

export const DIMENSION_LABELS: Record<AnalysisDimension, string> = {
  political_geopolitical_environment: '政治举措及地缘环境',
  financial_investment_environment: '金融投资环境',
  industrial_market_environment: '产业政策及市场环境',
  compliance_rule_of_law_environment: '合规与法治环境',
  innovation_technology_environment: '新质生产力与科创环境',
  social_cultural_environment: '社会人文环境',
};

// --- 核心数据模型 ---

export interface SourceDocument {
  id: string;
  title: string;
  source: string;
  sourceType: SourceType;
  country: string;
  region: string;
  language: string;
  publishedAt: string;
  collectedAt: string;
  url?: string;
  reliability: Reliability;
  rawText?: string;
  summary: string;
  relevanceScore: number;
  relevanceLevel: RelevanceLevel;
  dimensions: AnalysisDimension[];
  evidenceIds: string[];
  dataOrigin: DataOrigin;
  fetchStatus?: FetchStatus;
}

export interface EvidenceSnippet {
  id: string;
  documentId: string;
  text: string;
  factType: FactType;
  confidence: Confidence;
  usedInReportSections: string[];
}

export interface CountryProfile {
  id: string;
  name: string;
  region: string;
  riskLevel: RiskLevel;
  opportunityLevel: OpportunityLevel;
  keyIndustries: string[];
  latestSummary: string;
  reportStatus: ReportStatus;
  reportId?: string;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  riskLevel?: RiskLevel;
  evidenceIds: string[];
  confidence: Confidence;
  reviewStatus: ReviewAction | 'pending';
}

export interface ReviewRecord {
  id: string;
  reportId: string;
  sectionId: string | null;
  reviewer: string;
  timestamp: string;
  action: ReviewAction;
  comment: string;
}

export interface AnalysisReport {
  id: string;
  country: string;
  title: string;
  period: string;
  status: ReportStatus;
  generatedAt: string;
  sections: ReportSection[];
  sourceDocumentIds: string[];
  openQuestions: string[];
  reviewRecords: ReviewRecord[];
}

// --- AgentClient 相关类型 ---

export interface ScreeningResult {
  documentId: string;
  relevanceScore: number;
  relevanceLevel: RelevanceLevel;
  reason: string;
  mappedDimensions: AnalysisDimension[];
  extractedEvidenceSnippets: EvidenceSnippet[];
  userAction?: 'approved' | 'demoted' | 'misjudged' | 'added_to_report';
}

export interface DimensionMapping {
  documentId: string;
  dimensions: AnalysisDimension[];
  confidence: Confidence;
}

export interface CitationCheckResult {
  sectionId: string;
  citationValid: boolean;
  missingEvidence: string[];
  notes: string;
}

export interface ReportGenerationInput {
  country: string;
  period: string;
  sourceDocumentIds: string[];
}

// --- Dashboard 聚合类型 ---

export interface DashboardOverview {
  todaySourceCount: number;
  highRelevanceCount: number;
  highRiskAlertCount: number;
  generatedReportCount: number;
  pendingReviewCount: number;
}

export interface RiskItem {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  country: string;
  dimension: AnalysisDimension;
  description: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  country: string;
  dimension: AnalysisDimension;
  description: string;
}

// --- 筛选类型 ---

export interface SourceFilters {
  country?: string;
  sourceType?: SourceType;
  relevanceLevel?: RelevanceLevel;
  dimension?: AnalysisDimension;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  dataOrigin?: DataOrigin;
}
