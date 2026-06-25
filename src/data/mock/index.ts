import { mockCountries } from './countries'
import { mockSources as baseMockSources } from './sources'
import { mockEvidence as baseMockEvidence } from './evidence'
import { mockReports as baseMockReports, mockReviewRecords } from './reports'
import { saudiRealEvidence, saudiRealReport, saudiRealSources } from '@/data/real'
import type {
  SourceDocument,
  EvidenceSnippet,
  CountryProfile,
  AnalysisReport,
  ReviewRecord,
} from '@/types'

export { mockCountries, mockReviewRecords }

export const mockSources: SourceDocument[] = [
  ...baseMockSources.filter((source) => source.country !== '沙特阿拉伯'),
  ...saudiRealSources,
]

export const mockEvidence: EvidenceSnippet[] = [
  ...baseMockEvidence.filter((evidence) => !evidence.documentId.startsWith('src-sa-')),
  ...saudiRealEvidence,
]

export const mockReports: AnalysisReport[] = [
  ...baseMockReports.filter((report) => report.country !== '沙特阿拉伯'),
  saudiRealReport,
]

// --- 辅助查询函数 ---

export function getSourceById(id: string): SourceDocument | undefined {
  return mockSources.find((s) => s.id === id)
}

export function getSourcesByCountry(country: string): SourceDocument[] {
  return mockSources.filter((s) => s.country === country)
}

export function getEvidenceById(id: string): EvidenceSnippet | undefined {
  return mockEvidence.find((e) => e.id === id)
}

export function getEvidenceByDocumentId(documentId: string): EvidenceSnippet[] {
  return mockEvidence.filter((e) => e.documentId === documentId)
}

export function getEvidenceByIds(ids: string[]): EvidenceSnippet[] {
  return ids.map((id) => mockEvidence.find((e) => e.id === id)).filter(Boolean) as EvidenceSnippet[]
}

export function getCountryById(id: string): CountryProfile | undefined {
  return mockCountries.find((c) => c.id === id)
}

export function getCountryByName(name: string): CountryProfile | undefined {
  return mockCountries.find((c) => c.name === name)
}

export function getReportById(id: string): AnalysisReport | undefined {
  return mockReports.find((r) => r.id === id)
}

export function getReportByCountry(country: string): AnalysisReport | undefined {
  return mockReports.find((r) => r.country === country)
}

export function getReviewRecordsByReportId(reportId: string): ReviewRecord[] {
  return mockReviewRecords.filter((r) => r.reportId === reportId)
}

// --- 统计函数 ---

export function getTodaySourceCount(): number {
  return mockSources.filter((s) => s.relevanceLevel !== 'noise').length
}

export function getHighRelevanceCount(): number {
  return mockSources.filter((s) => s.relevanceLevel === 'high').length
}

export function getHighRiskAlertCount(): number {
  return mockSources.filter(
    (s) =>
      s.dimensions.includes('business_risk') ||
      s.dimensions.includes('political_geopolitical_risk') ||
      s.dimensions.includes('political_geopolitical_environment') ||
      s.dimensions.includes('compliance_rule_of_law_environment')
  ).length
}

export function getGeneratedReportCount(): number {
  return mockReports.filter((r) => r.status !== 'not_started').length
}

export function getPendingReviewCount(): number {
  return mockReports.filter((r) => r.status === 'in_review').length
}
