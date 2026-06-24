import type { AgentClient } from './types'
import type {
  SourceDocument,
  EvidenceSnippet,
  DimensionMapping,
  AnalysisReport,
  ReportGenerationInput,
  ScreeningResult,
  CitationCheckResult,
} from '@/types'

export class HttpAgentClient implements AgentClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? ''
  }

  private ensureConfigured(): void {
    if (!this.baseUrl) {
      throw new Error(
        'HttpAgentClient 未连接真实 API。\n' +
        '请在 .env 中配置 VITE_AGENT_API_URL 后重启。\n' +
        '注意：真实 AGENT_API_KEY 只能放后端环境变量，不要在前端暴露。'
      )
    }
  }

  async screenDocuments(_input: SourceDocument[]): Promise<ScreeningResult[]> {
    this.ensureConfigured()
    throw new Error('screenDocuments: 待后续对接真实智能体 API')
  }

  async extractEvidence(_input: SourceDocument[]): Promise<EvidenceSnippet[]> {
    this.ensureConfigured()
    throw new Error('extractEvidence: 待后续对接真实智能体 API')
  }

  async mapDimensions(_input: SourceDocument[]): Promise<DimensionMapping[]> {
    this.ensureConfigured()
    throw new Error('mapDimensions: 待后续对接真实智能体 API')
  }

  async generateReport(_input: ReportGenerationInput): Promise<AnalysisReport> {
    this.ensureConfigured()
    throw new Error('generateReport: 待后续对接真实智能体 API')
  }

  async checkCitations(_input: AnalysisReport): Promise<CitationCheckResult> {
    this.ensureConfigured()
    throw new Error('checkCitations: 待后续对接真实智能体 API')
  }
}
