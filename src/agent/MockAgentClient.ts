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
import {
  getEvidenceByDocumentId,
  getReportById,
  mockEvidence as allEvidence,
} from '@/data/mock'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class MockAgentClient implements AgentClient {
  async screenDocuments(input: SourceDocument[]): Promise<ScreeningResult[]> {
    await delay(300)
    return input
      .filter((doc) => doc.relevanceLevel !== 'noise')
      .map((doc) => {
        const evidence = getEvidenceByDocumentId(doc.id)
        return {
          documentId: doc.id,
          relevanceScore: doc.relevanceScore,
          relevanceLevel: doc.relevanceLevel,
          reason: generateScreeningReason(doc),
          mappedDimensions: doc.dimensions,
          extractedEvidenceSnippets: evidence.slice(0, 3),
        }
      })
  }

  async extractEvidence(input: SourceDocument[]): Promise<EvidenceSnippet[]> {
    await delay(200)
    const docIds = new Set(input.map((d) => d.id))
    return allEvidence.filter((e) => docIds.has(e.documentId))
  }

  async mapDimensions(input: SourceDocument[]): Promise<DimensionMapping[]> {
    await delay(200)
    return input.map((doc) => ({
      documentId: doc.id,
      dimensions: doc.dimensions,
      confidence: doc.relevanceLevel === 'high' ? 'high' : doc.relevanceLevel === 'medium' ? 'medium' : 'low',
    }))
  }

  async generateReport(input: ReportGenerationInput): Promise<AnalysisReport> {
    await delay(1500)
    const report = getReportById(`report-${input.country === '巴西' ? 'br' : input.country === '沙特阿拉伯' ? 'sa' : 'ae'}-2025-q2`)
    if (!report) {
      throw new Error(`未找到${input.country}的报告`)
    }
    return report
  }

  async checkCitations(input: AnalysisReport): Promise<CitationCheckResult> {
    await delay(500)
    const allEvidenceIds = new Set(allEvidence.map((e) => e.id))

    const missingEvidence: string[] = []
    let allValid = true

    for (const section of input.sections) {
      for (const evId of section.evidenceIds) {
        if (!allEvidenceIds.has(evId)) {
          missingEvidence.push(evId)
          allValid = false
        }
      }
    }

    return {
      sectionId: input.sections[0]?.id ?? '',
      citationValid: allValid && missingEvidence.length === 0,
      missingEvidence,
      notes: allValid
        ? '所有引用证据均有效'
        : `${missingEvidence.length}条证据引用未找到对应记录`,
    }
  }
}

// --- 辅助函数：生成筛选理由 ---

function generateScreeningReason(doc: SourceDocument): string {
  const reasons: Record<string, string[]> = {
    political_geopolitical_environment: [
      '涉及目标国政府治理、政策举措或地缘环境变化，需纳入营商环境判断',
    ],
    financial_investment_environment: [
      '涉及投资服务、金融监管或资金环境，对市场进入和融资安排有直接影响',
    ],
    industrial_market_environment: [
      '涉及产业政策、市场机会或贸易便利化，影响行业进入路径和资源配置',
    ],
    compliance_rule_of_law_environment: [
      '涉及税务、海关、许可或监管合规要求，需纳入企业经营风险清单',
    ],
    innovation_technology_environment: [
      '涉及数字经济、技术监管或科创资源，对科技企业合作机会具有参考价值',
    ],
    social_cultural_environment: [
      '涉及劳动力市场、社会政策或人文环境，影响企业本地运营和长期发展',
    ],
  }

  const dimReasons = doc.dimensions
    .map((d) => reasons[d]?.[0])
    .filter(Boolean) as string[]

  if (dimReasons.length === 0) {
    return '基于文本内容与营商环境分析框架的匹配度判断'
  }

  return dimReasons.join('；') + '。'
}
