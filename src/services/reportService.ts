import type { AnalysisReport, EvidenceSnippet, ReportGenerationInput } from '@/types'
import { createAgentClient } from '@/agent'
import { mockReports, mockSources, getEvidenceByIds, getReportById } from '@/data/mock'

const agentClient = createAgentClient()

export async function getReports(): Promise<AnalysisReport[]> {
  await new Promise((r) => setTimeout(r, 100))
  return mockReports
}

export async function getReportByIdService(id: string): Promise<AnalysisReport | null> {
  await new Promise((r) => setTimeout(r, 150))
  return getReportById(id) ?? null
}

export async function generateReport(input: ReportGenerationInput): Promise<AnalysisReport> {
  return agentClient.generateReport(input)
}

export interface EvidenceWithSource {
  evidence: EvidenceSnippet
  sourceTitle: string
  sourceDate: string
  sourceUrl?: string
  documentId: string
}

export async function getEvidenceForSection(sectionEvidenceIds: string[]): Promise<EvidenceWithSource[]> {
  await new Promise((r) => setTimeout(r, 100))

  const snippets = getEvidenceByIds(sectionEvidenceIds)

  return snippets.map((ev) => {
    const source = mockSources.find((s) => s.id === ev.documentId)
    return {
      evidence: ev,
      sourceTitle: source?.title ?? '未知来源',
      sourceDate: source?.publishedAt ?? '',
      sourceUrl: source?.url,
      documentId: ev.documentId,
    }
  })
}

export async function exportReport(
  reportId: string,
  format: 'markdown' | 'html'
): Promise<string> {
  await new Promise((r) => setTimeout(r, 200))

  const report = getReportById(reportId)
  if (!report) throw new Error('报告不存在')

  if (format === 'markdown') {
    return generateMarkdownExport(report)
  }
  return generateHtmlExport(report)
}

function generateMarkdownExport(report: AnalysisReport): string {
  let md = `# ${report.title}\n\n`
  md += `- 国家/地区：${report.country}\n`
  md += `- 报告周期：${report.period}\n`
  md += `- 生成时间：${report.generatedAt}\n`
  md += `- 状态：${report.status}\n\n`
  md += `---\n\n`

  for (const section of report.sections) {
    md += `## ${section.title}\n\n`
    md += `${section.content}\n\n`
    if (section.riskLevel) {
      md += `> 风险等级：${section.riskLevel}\n\n`
    }
    if (section.evidenceIds.length > 0) {
      md += `> 证据引用：${section.evidenceIds.join(', ')}\n\n`
    }
  }

  if (report.openQuestions.length > 0) {
    md += `## 待专家复核问题\n\n`
    for (const q of report.openQuestions) {
      md += `- ${q}\n`
    }
    md += '\n'
  }

  md += `---\n`
  md += `> ⚠️ 本报告由智能分析系统基于公开资料自动生成，需专家复核后使用。不构成投资建议。\n`
  md += `> 生成时间：${report.generatedAt}\n`

  return md
}

function generateHtmlExport(report: AnalysisReport): string {
  let html = `<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<title>${report.title}</title>\n`
  html += `<style>\nbody { font-family: system-ui, sans-serif; max-width: 800px; margin: auto; padding: 2rem; line-height: 1.8; }\n`
  html += `h1 { color: #1a3a2a; border-bottom: 2px solid #1a3a2a; padding-bottom: 0.5rem; }\n`
  html += `h2 { color: #2d6a47; margin-top: 2rem; }\n`
  html += `.risk-high { color: #dc2626; font-weight: bold; }\n`
  html += `.evidence { background: #f0fdf4; padding: 0.5rem; margin: 0.5rem 0; border-left: 3px solid #2d6a47; font-size: 0.9rem; }\n`
  html += `</style>\n</head>\n<body>\n`

  html += `<h1>${report.title}</h1>\n`
  html += `<p>国家/地区：${report.country} | 周期：${report.period} | 生成时间：${report.generatedAt}</p>\n<hr>\n`

  for (const section of report.sections) {
    html += `<h2>${section.title}</h2>\n`
    html += `<div>${section.content.replace(/\n/g, '<br>')}</div>\n`
  }

  html += `<hr>\n<p><em>⚠️ 本报告由智能分析系统基于公开资料自动生成，需专家复核后使用。不构成投资建议。</em></p>\n`
  html += `</body>\n</html>`

  return html
}
