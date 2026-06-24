import type {
  SourceDocument,
  EvidenceSnippet,
  DimensionMapping,
  AnalysisReport,
  ReportGenerationInput,
  ScreeningResult,
  CitationCheckResult,
} from '@/types'

export interface AgentClient {
  screenDocuments(input: SourceDocument[]): Promise<ScreeningResult[]>
  extractEvidence(input: SourceDocument[]): Promise<EvidenceSnippet[]>
  mapDimensions(input: SourceDocument[]): Promise<DimensionMapping[]>
  generateReport(input: ReportGenerationInput): Promise<AnalysisReport>
  checkCitations(input: AnalysisReport): Promise<CitationCheckResult>
}
