import type { SourceDocument, EvidenceSnippet, SourceFilters } from '@/types'
import { mockSources, getEvidenceByDocumentId, getSourceById } from '@/data/mock'

export async function getSources(filters: SourceFilters = {}): Promise<SourceDocument[]> {
  await new Promise((r) => setTimeout(r, 150))

  let result = [...mockSources]

  if (filters.country) {
    result = result.filter((s) => s.country === filters.country)
  }
  if (filters.sourceType) {
    result = result.filter((s) => s.sourceType === filters.sourceType)
  }
  if (filters.relevanceLevel) {
    result = result.filter((s) => s.relevanceLevel === filters.relevanceLevel)
  }
  if (filters.dimension) {
    result = result.filter((s) => s.dimensions.includes(filters.dimension!))
  }
  if (filters.dataOrigin) {
    result = result.filter((s) => s.dataOrigin === filters.dataOrigin)
  }
  if (filters.dateFrom) {
    result = result.filter((s) => s.publishedAt >= filters.dateFrom!)
  }
  if (filters.dateTo) {
    result = result.filter((s) => s.publishedAt <= filters.dateTo!)
  }
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase()
    result = result.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.source.toLowerCase().includes(q)
    )
  }

  return result
}

export async function getSourceByIdService(id: string): Promise<{
  source: SourceDocument
  evidence: EvidenceSnippet[]
} | null> {
  await new Promise((r) => setTimeout(r, 100))
  const source = getSourceById(id)
  if (!source) return null
  const evidence = getEvidenceByDocumentId(id)
  return { source, evidence }
}

// 真实来源模拟导入（纯前端演示，不做真实抓取）
export interface RealSourceImportInput {
  url?: string
  text?: string
  country?: string
}

export interface RealSourceImportResult {
  success: boolean
  source: SourceDocument
  status: 'success' | 'failed' | 'partial_success' | 'manual_import'
  errorMessage?: string
}

export async function importRealSource(input: RealSourceImportInput): Promise<RealSourceImportResult> {
  // 模拟网络延迟
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000))

  if (input.url) {
    // 模拟 URL 抓取
    const url = input.url.toLowerCase()

    if (url.includes('blocked') || url.includes('forbidden')) {
      return {
        success: false,
        status: 'failed',
        errorMessage: '模拟：网站拒绝抓取（CORS/反爬/登录墙）。真实场景需后端 proxy 支持。',
        source: createFailedSource(input.url, input.country ?? '未知'),
      }
    }

    if (url.includes('partial') || url.includes('incomplete')) {
      return {
        success: true,
        status: 'partial_success',
        source: createSimulatedSource(input.url, input.country ?? '未知', 'partial'),
      }
    }

    return {
      success: true,
      status: 'success',
      source: createSimulatedSource(input.url, input.country ?? '未知', 'full'),
    }
  }

  if (input.text) {
    // 手动文本导入
    const title = extractTitleFromText(input.text)
    return {
      success: true,
      status: 'manual_import',
      source: {
        id: `src-real-${Date.now()}`,
        title: title ?? '手动导入文本',
        source: '手动导入',
        sourceType: 'database',
        country: input.country ?? '未知',
        region: '',
        language: detectLanguage(input.text),
        publishedAt: new Date().toISOString().split('T')[0],
        collectedAt: new Date().toISOString(),
        url: undefined,
        reliability: 'low',
        rawText: input.text.slice(0, 2000),
        summary: input.text.slice(0, 200) + (input.text.length > 200 ? '...' : ''),
        relevanceScore: 0,
        relevanceLevel: 'low',
        dimensions: [],
        evidenceIds: [],
        dataOrigin: 'real',
        fetchStatus: 'manual_import',
      },
    }
  }

  return {
    success: false,
    status: 'failed',
    errorMessage: '请提供 URL 或文本内容',
    source: createFailedSource('', input.country ?? '未知'),
  }
}

// --- 辅助函数 ---

function createSimulatedSource(url: string, country: string, quality: 'full' | 'partial'): SourceDocument {
  const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url)
  const domain = urlObj.hostname

  return {
    id: `src-real-${Date.now()}`,
    title: `[模拟抓取] ${domain} - ${country}营商环境相关信息`,
    source: domain,
    sourceType: 'government',
    country,
    region: '',
    language: 'zh',
    publishedAt: new Date().toISOString().split('T')[0],
    collectedAt: new Date().toISOString(),
    url,
    reliability: 'medium',
    summary:
      quality === 'full'
        ? '（模拟抓取结果）这是一份来自该来源的模拟营商环境资料摘要。真实数据需通过后端代理抓取并解析网页正文。本摘要仅用于演示数据结构和流程。'
        : '（模拟部分抓取结果）仅获取到部分内容，可能由于网页结构复杂或内容分页导致。建议手动导入完整文本以获得更好的分析结果。',
    relevanceScore: quality === 'full' ? 65 : 40,
    relevanceLevel: quality === 'full' ? 'medium' : 'low',
    dimensions: quality === 'full' ? ['macro_economy'] : [],
    evidenceIds: [],
    dataOrigin: 'real',
    fetchStatus: quality === 'full' ? 'success' : 'partial_success',
  }
}

function createFailedSource(url: string, country: string): SourceDocument {
  return {
    id: `src-real-${Date.now()}`,
    title: `[抓取失败] ${url || '未提供URL'}`,
    source: url ? new URL(url.startsWith('http') ? url : 'https://' + url).hostname : '未知',
    sourceType: 'government',
    country,
    region: '',
    language: 'zh',
    publishedAt: new Date().toISOString().split('T')[0],
    collectedAt: new Date().toISOString(),
    url,
    reliability: 'low',
    summary: '抓取失败：目标网站可能阻止自动抓取。Demo 阶段仅支持模拟抓取和手动文本导入。',
    relevanceScore: 0,
    relevanceLevel: 'noise',
    dimensions: [],
    evidenceIds: [],
    dataOrigin: 'real',
    fetchStatus: 'failed',
  }
}

function extractTitleFromText(text: string): string | null {
  const firstLine = text.trim().split('\n')[0]
  if (firstLine.length <= 100 && firstLine.length >= 5) {
    return firstLine
  }
  return null
}

function detectLanguage(text: string): string {
  // 简单的语言检测：检查是否包含中文字符
  if (/[一-鿿]/.test(text)) return 'zh'
  if (/[a-zA-Z]{3,}/.test(text)) return 'en'
  return 'unknown'
}
