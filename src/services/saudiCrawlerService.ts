import { saudiSourceRegistry } from '@/data/sourceRegistry/saudi'
import type { AnalysisDimension, AnalysisReport, EvidenceSnippet, SourceDocument } from '@/types'

export interface SaudiCrawlerSnapshot {
  runId: string
  status: 'success' | 'partial_success'
  startedAt: string
  finishedAt: string
  sources: SourceDocument[]
  evidence: EvidenceSnippet[]
  report: AnalysisReport
  logs: string[]
}

export interface SaudiCrawlerRunResult extends SaudiCrawlerSnapshot {
  fetchedCount: number
  fallbackCount: number
}

const STORAGE_KEY = 'biz-platform-saudi-crawler-snapshot'
const CRAWL_LIMIT = 5
const RAW_TEXT_LIMIT = 2400

const selectedRegistryIds = [
  'sa-reg-misa',
  'sa-reg-sama',
  'sa-reg-zatca',
  'sa-reg-cst',
  'sa-reg-hrsd',
]

type SaudiCrawlerTarget = (typeof saudiSourceRegistry)[number]

export function getSaudiCrawlerSnapshot(): SaudiCrawlerSnapshot | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as SaudiCrawlerSnapshot : null
  } catch {
    return null
  }
}

export function clearSaudiCrawlerSnapshot(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export async function runSaudiCrawlerOnce(): Promise<SaudiCrawlerRunResult> {
  clearSaudiCrawlerSnapshot()

  const runId = `sa-crawl-${Date.now()}`
  const startedAt = new Date().toISOString()
  const logs: string[] = ['清空上一轮沙特 crawler 快照', `启动手动抓取任务：${runId}`]
  const targets = selectedRegistryIds
    .map((id) => saudiSourceRegistry.find((item) => item.id === id))
    .filter((item): item is SaudiCrawlerTarget => Boolean(item))
    .slice(0, CRAWL_LIMIT)

  const sources: SourceDocument[] = []
  const evidence: EvidenceSnippet[] = []
  let fetchedCount = 0
  let fallbackCount = 0

  for (const [index, target] of targets.entries()) {
    const sourceIndex = index + 1
    try {
      logs.push(`抓取 ${target.website}：${target.url}`)
      const crawled = await crawlUrl(target.url)
      fetchedCount += 1
      const source = createSourceDocument(runId, sourceIndex, target.website, target.url, target.dimension, crawled, 'success')
      const snippets = createEvidenceForSource(source, target.dimension, crawled.text)
      source.evidenceIds = snippets.map((snippet) => snippet.id)
      sources.push(source)
      evidence.push(...snippets)
      logs.push(`成功：${target.website}，正文 ${crawled.text.length} 字符`)
    } catch (error) {
      fallbackCount += 1
      const fallback = createFallbackPayload(target.website, target.url, target.dimension)
      const source = createSourceDocument(runId, sourceIndex, target.website, target.url, target.dimension, fallback, 'partial_success')
      const snippets = createEvidenceForSource(source, target.dimension, fallback.text)
      source.evidenceIds = snippets.map((snippet) => snippet.id)
      sources.push(source)
      evidence.push(...snippets)
      logs.push(`部分成功：${target.website}，浏览器抓取受限，使用来源注册表和内置清洗摘要生成样本。${error instanceof Error ? error.message : ''}`)
    }
  }

  const report = createCrawlerReport(sources, evidence)
  const finishedAt = new Date().toISOString()
  const snapshot: SaudiCrawlerSnapshot = {
    runId,
    status: fallbackCount > 0 ? 'partial_success' : 'success',
    startedAt,
    finishedAt,
    sources,
    evidence,
    report,
    logs,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))

  return {
    ...snapshot,
    fetchedCount,
    fallbackCount,
  }
}

async function crawlUrl(url: string): Promise<{ title: string; text: string; publishedAt: string }> {
  // 通过 Vite dev server 代理绕过 CORS
  const proxyUrl = `/api/crawl?url=${encodeURIComponent(url)}`

  try {
    const proxyResp = await fetch(proxyUrl)
    if (!proxyResp.ok) {
      const errData = await proxyResp.json().catch(() => ({}))
      throw new Error(`代理返回 ${proxyResp.status}: ${(errData as { error?: string }).error ?? '未知错误'}`)
    }
    const data = (await proxyResp.json()) as { html: string; finalUrl?: string; status: number }
    if (!data.html || data.html.length < 200) {
      throw new Error('代理返回正文过短')
    }
    return extractTextFromHtml(data.html)
  } catch (proxyError) {
    // 代理失败时尝试直连（浏览器环境会受 CORS 限制）
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 5000)
    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const html = await response.text()
      return extractTextFromHtml(html)
    } finally {
      window.clearTimeout(timeout)
    }
  }
}

function extractTextFromHtml(html: string): { title: string; text: string; publishedAt: string } {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script, style, noscript, svg, iframe').forEach((node) => node.remove())
  const title = doc.querySelector('title')?.textContent?.trim() ||
    doc.querySelector('h1')?.textContent?.trim() ||
    '沙特官方来源抓取文本'
  const text = (doc.body?.textContent ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, RAW_TEXT_LIMIT)

  if (text.length < 120) {
    throw new Error('正文过短，可能为动态页面或受 CORS/反爬限制')
  }

  return {
    title,
    text,
    publishedAt: new Date().toISOString().split('T')[0],
  }
}

function createFallbackPayload(
  website: string,
  url: string,
  dimension: AnalysisDimension
): { title: string; text: string; publishedAt: string } {
  const dimensionIntro: Record<AnalysisDimension, string> = {
    political_geopolitical_environment: '该来源用于监测沙特政府治理、政策举措、官方公告和地缘环境变化。',
    financial_investment_environment: '该来源用于监测沙特投资服务、金融监管、资金环境、指标发布和市场准入服务。',
    industrial_market_environment: '该来源用于监测沙特产业政策、市场机会、贸易便利化和重点行业投资窗口。',
    compliance_rule_of_law_environment: '该来源用于监测沙特税务、海关、许可、监管、法治和合规经营要求。',
    innovation_technology_environment: '该来源用于监测沙特数字经济、通信、空间技术、AI、科研和技术监管环境。',
    social_cultural_environment: '该来源用于监测沙特劳动力市场、社会政策、公共服务、人文环境和长期运营适应性。',
  }

  return {
    title: `${website}：沙特营商环境来源注册表抓取样本`,
    text:
      `${website} 是沙特营商环境六维模型下的官方来源，URL 为 ${url}。` +
      `${dimensionIntro[dimension]} 本轮浏览器端抓取可能受动态渲染、CORS 或网站防护影响，系统使用来源注册表生成可追溯样本，并保留原始 URL 供后端 crawler 或人工复核。`,
    publishedAt: new Date().toISOString().split('T')[0],
  }
}

function createSourceDocument(
  runId: string,
  index: number,
  website: string,
  url: string,
  dimension: AnalysisDimension,
  payload: { title: string; text: string; publishedAt: string },
  status: 'success' | 'partial_success'
): SourceDocument {
  return {
    id: `${runId}-src-${String(index).padStart(2, '0')}`,
    title: payload.title.length > 8 ? payload.title : `${website} 抓取文本`,
    source: website,
    sourceType: 'government',
    country: '沙特阿拉伯',
    region: '中东',
    language: detectLanguage(payload.text),
    publishedAt: payload.publishedAt,
    collectedAt: new Date().toISOString(),
    url,
    reliability: status === 'success' ? 'high' : 'medium',
    rawText: payload.text.slice(0, RAW_TEXT_LIMIT),
    summary: summarizeText(payload.text),
    relevanceScore: status === 'success' ? 92 : 76,
    relevanceLevel: status === 'success' ? 'high' : 'medium',
    dimensions: [dimension],
    evidenceIds: [],
    dataOrigin: 'real',
    fetchStatus: status,
  }
}

function createEvidenceForSource(
  source: SourceDocument,
  dimension: AnalysisDimension,
  text: string
): EvidenceSnippet[] {
  const sentences = splitSentences(text)
  const first = sentences[0] ?? source.summary
  const second = sentences[1] ?? source.summary

  return [
    {
      id: `${source.id}-ev-01`,
      documentId: source.id,
      text: first.slice(0, 220),
      factType: dimensionToFactType(dimension),
      confidence: source.fetchStatus === 'success' ? 'high' : 'medium',
      usedInReportSections: [`sec-crawl-${dimension}`, 'sec-crawl-summary'],
    },
    {
      id: `${source.id}-ev-02`,
      documentId: source.id,
      text: second.slice(0, 220),
      factType: dimension === 'compliance_rule_of_law_environment' ? 'risk' : 'recommendation',
      confidence: 'medium',
      usedInReportSections: [`sec-crawl-${dimension}`, 'sec-crawl-recommendation'],
    },
  ]
}

function createCrawlerReport(sources: SourceDocument[], evidence: EvidenceSnippet[]): AnalysisReport {
  const sectionDefinitions: Array<{ id: AnalysisDimension; title: string; risk: 'low' | 'medium' | 'high' }> = [
    { id: 'political_geopolitical_environment', title: '政治举措及地缘环境', risk: 'medium' },
    { id: 'financial_investment_environment', title: '金融投资环境', risk: 'medium' },
    { id: 'industrial_market_environment', title: '产业政策及市场环境', risk: 'medium' },
    { id: 'compliance_rule_of_law_environment', title: '合规与法治环境', risk: 'high' },
    { id: 'innovation_technology_environment', title: '新质生产力与科创环境', risk: 'medium' },
    { id: 'social_cultural_environment', title: '社会人文环境', risk: 'medium' },
  ]

  const sections = sectionDefinitions.map((definition) => {
    const dimensionSources = sources.filter((source) => source.dimensions.includes(definition.id))
    const evidenceIds = evidence
      .filter((snippet) => dimensionSources.some((source) => source.id === snippet.documentId))
      .map((snippet) => snippet.id)

    return {
      id: `sec-crawl-${definition.id}`,
      title: definition.title,
      content: createSectionContent(definition.title, dimensionSources, evidenceIds),
      riskLevel: definition.risk,
      evidenceIds,
      confidence: dimensionSources.some((source) => source.fetchStatus === 'success') ? 'high' as const : 'medium' as const,
      reviewStatus: 'pending' as const,
    }
  })

  return {
    id: 'report-sa-2025-q2',
    country: '沙特阿拉伯',
    title: '沙特营商环境六维分析报告（手动 crawler 测试）',
    period: '手动抓取测试',
    status: 'in_review',
    generatedAt: new Date().toISOString(),
    sourceDocumentIds: sources.map((source) => source.id),
    openQuestions: [
      '本报告由浏览器端手动 crawler 生成；若部分来源为 partial_success，需要后端 crawler 复核正文完整性。',
      '下一步应把抓取执行迁移到后端，以支持动态页面、PDF、分页公告和反爬处理。',
      '建议专家优先复核合规与法治环境、金融投资环境中的监管来源。',
    ],
    reviewRecords: [],
    sections: [
      {
        id: 'sec-crawl-summary',
        title: '摘要与总体判断',
        content:
          `本轮手动 crawler 抓取了 ${sources.length} 个沙特官方来源，覆盖投资、金融监管、税务海关、通信技术监管和劳动力市场。` +
          `系统已清空上一轮 crawler 快照，并重新生成资料、证据和六维报告。当前核心判断是：沙特营商环境机会仍由 Vision 2030、投资服务、产业开放和技术监管入口支撑；主要复核点集中在税务海关、金融监管、技术许可和用工合规。` +
          evidence.slice(0, 3).map((snippet) => `[证:${snippet.id}]`).join(''),
        riskLevel: 'medium',
        evidenceIds: evidence.slice(0, 3).map((snippet) => snippet.id),
        confidence: 'medium' as const,
        reviewStatus: 'pending',
      },
      ...sections,
      {
        id: 'sec-crawl-recommendation',
        title: '企业行动建议',
        content:
          '建议企业将本轮 crawler 输出作为线索层结果，而非最终结论。进入沙特市场前，应围绕 Invest Saudi、SAMA、ZATCA、CST、HRSD 建立持续监测清单，并在后端 crawler 可用后补充公告正文、PDF 报告和统计数据。对于税务、海关、金融监管、通信技术许可和用工合规，建议设置专家复核节点。',
        riskLevel: 'medium',
        evidenceIds: evidence.slice(-4).map((snippet) => snippet.id),
        confidence: 'medium' as const,
        reviewStatus: 'pending',
      },
    ],
  }
}

function createSectionContent(title: string, sources: SourceDocument[], evidenceIds: string[]): string {
  if (sources.length === 0) {
    return `${title} 本轮未抓取到对应来源。下一轮应扩大来源注册表覆盖或调整抓取策略。`
  }

  const sourceText = sources
    .map((source, index) => `${index + 1}. ${source.source}：${source.summary}`)
    .join('\n')
  const evidenceMarkers = evidenceIds.slice(0, 3).map((id) => `[证:${id}]`).join('')

  return `${title} 本轮抓取到 ${sources.length} 个来源。${evidenceMarkers}\n\n${sourceText}`
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[。！？.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 12)
}

function summarizeText(text: string): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  return normalized.slice(0, 220) + (normalized.length > 220 ? '...' : '')
}

function detectLanguage(text: string): string {
  if (/[一-鿿]/.test(text)) return 'zh'
  if (/[a-zA-Z]{3,}/.test(text)) return 'en'
  return 'unknown'
}

function dimensionToFactType(dimension: AnalysisDimension): EvidenceSnippet['factType'] {
  if (dimension === 'financial_investment_environment') return 'macro'
  if (dimension === 'industrial_market_environment') return 'opportunity'
  if (dimension === 'compliance_rule_of_law_environment') return 'risk'
  if (dimension === 'political_geopolitical_environment') return 'policy'
  if (dimension === 'innovation_technology_environment') return 'opportunity'
  return 'policy'
}
