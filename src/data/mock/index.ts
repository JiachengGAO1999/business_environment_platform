import { mockCountries } from './countries'
import { mockSources as baseMockSources } from './sources'
import { mockEvidence as baseMockEvidence } from './evidence'
import { mockReviewRecords } from './reports'
import { sixDimensionMockReports } from './reportsSixDimension'
import { saudiRealEvidence, saudiRealReport, saudiRealSources } from '@/data/real'
import { getSaudiCrawlerSnapshot } from '@/services/saudiCrawlerService'
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
  ...sixDimensionMockReports,
  saudiRealReport,
]

export function getEffectiveSources(): SourceDocument[] {
  const snapshot = getSaudiCrawlerSnapshot()
  if (!snapshot) return mockSources
  return [
    ...mockSources.filter((source) => source.country !== '沙特阿拉伯'),
    ...snapshot.sources,
  ]
}

export function getEffectiveEvidence(): EvidenceSnippet[] {
  const snapshot = getSaudiCrawlerSnapshot()
  if (!snapshot) return mockEvidence
  return [
    ...mockEvidence.filter((evidence) => !evidence.documentId.startsWith('src-sa-real-') && !evidence.documentId.startsWith('sa-crawl-')),
    ...snapshot.evidence,
  ]
}

export function getEffectiveReports(): AnalysisReport[] {
  const snapshot = getSaudiCrawlerSnapshot()
  if (!snapshot) return mockReports
  return [
    ...mockReports.filter((report) => report.country !== '沙特阿拉伯'),
    snapshot.report,
  ]
}

// --- 辅助查询函数 ---

export function getSourceById(id: string): SourceDocument | undefined {
  return getEffectiveSources().find((s) => s.id === id)
}

export function getSourcesByCountry(country: string): SourceDocument[] {
  return getEffectiveSources().filter((s) => s.country === country)
}

export function getEvidenceById(id: string): EvidenceSnippet | undefined {
  return getEffectiveEvidence().find((e) => e.id === id)
}

export function getEvidenceByDocumentId(documentId: string): EvidenceSnippet[] {
  return getEffectiveEvidence().filter((e) => e.documentId === documentId)
}

export function getEvidenceByIds(ids: string[]): EvidenceSnippet[] {
  const evidence = getEffectiveEvidence()
  return ids.map((id) => evidence.find((e) => e.id === id)).filter(Boolean) as EvidenceSnippet[]
}

export function getCountryById(id: string): CountryProfile | undefined {
  return mockCountries.find((c) => c.id === id)
}

export function getCountryByName(name: string): CountryProfile | undefined {
  return mockCountries.find((c) => c.name === name)
}

export function getReportById(id: string): AnalysisReport | undefined {
  return getEffectiveReports().find((r) => r.id === id)
}

export function getReportByCountry(country: string): AnalysisReport | undefined {
  return getEffectiveReports().find((r) => r.country === country)
}

export function getReviewRecordsByReportId(reportId: string): ReviewRecord[] {
  return mockReviewRecords.filter((r) => r.reportId === reportId)
}

// --- 统计函数 ---

export function getTodaySourceCount(): number {
  return getEffectiveSources().filter((s) => s.relevanceLevel !== 'noise').length
}

export function getHighRelevanceCount(): number {
  return getEffectiveSources().filter((s) => s.relevanceLevel === 'high').length
}

export function getHighRiskAlertCount(): number {
  return getEffectiveSources().filter(
    (s) =>
      s.dimensions.includes('political_geopolitical_environment') ||
      s.dimensions.includes('compliance_rule_of_law_environment')
  ).length
}

export function getGeneratedReportCount(): number {
  return getEffectiveReports().filter((r) => r.status !== 'not_started').length
}

export function getPendingReviewCount(): number {
  return getEffectiveReports().filter((r) => r.status === 'in_review').length
}
