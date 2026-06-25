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
    macro_economy: [
      '涉及目标国宏观经济指标变化，对营商环境有直接影响',
      '反映目标国经济基本面变化，需纳入风险判断',
    ],
    industrial_policy: [
      '涉及目标国产业政策调整，可能改变行业竞争格局和外资准入条件',
      '政策变化直接影响外资企业的合规要求和经营成本',
    ],
    trade_environment: [
      '涉及目标国贸易政策和关税调整，影响市场进入策略',
      '贸易环境变化可能创造新的市场机会或增加进口成本',
    ],
    market_opportunity: [
      '揭示了明确的投资或市场进入机会，值得进一步评估',
      '目标市场出现结构性机会，与企业出海方向匹配',
    ],
    business_risk: [
      '揭示了需要关注的经营风险因素，建议纳入风险评估矩阵',
      '涉及税制、劳工或合规等核心经营要素的变化',
    ],
    political_geopolitical_risk: [
      '涉及可能影响外资企业运营的政治或地缘因素',
      '政策不确定性或地缘风险需要企业提前制定应对预案',
    ],
    corporate_recommendation: [
      '包含对企业具有指导意义的行动建议或政策信息',
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
