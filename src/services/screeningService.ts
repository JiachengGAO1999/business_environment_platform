import type { ScreeningResult, EvidenceSnippet } from '@/types'
import { createAgentClient } from '@/agent'
import { mockSources, getEvidenceByDocumentId } from '@/data/mock'

const agentClient = createAgentClient()

export async function getScreeningResults(): Promise<ScreeningResult[]> {
  const relevantDocs = mockSources.filter((s) => s.relevanceLevel !== 'noise')
  return agentClient.screenDocuments(relevantDocs)
}

export async function getEvidenceForDocument(documentId: string): Promise<EvidenceSnippet[]> {
  return getEvidenceByDocumentId(documentId)
}

// 人工操作状态管理（localStorage 持久化）
const STORAGE_KEY = 'biz-platform-screening-actions'

interface ScreeningAction {
  documentId: string
  action: 'approved' | 'demoted' | 'misjudged' | 'added_to_report'
  timestamp: string
}

function loadActions(): ScreeningAction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveActions(actions: ScreeningAction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actions))
}

export async function updateScreeningDecision(
  documentId: string,
  action: ScreeningAction['action']
): Promise<ScreeningResult | null> {
  // 记录操作
  const actions = loadActions()
  const existingIdx = actions.findIndex((a) => a.documentId === documentId)
  const actionRecord: ScreeningAction = {
    documentId,
    action,
    timestamp: new Date().toISOString(),
  }
  if (existingIdx >= 0) {
    actions[existingIdx] = actionRecord
  } else {
    actions.push(actionRecord)
  }
  saveActions(actions)

  // 返回更新后的结果
  const doc = mockSources.find((s) => s.id === documentId)
  if (!doc) return null

  const evidence = getEvidenceByDocumentId(documentId)
  return {
    documentId: doc.id,
    relevanceScore: doc.relevanceScore,
    relevanceLevel: doc.relevanceLevel,
    reason: `人工操作: ${ACTION_LABELS[action]}`,
    mappedDimensions: doc.dimensions,
    extractedEvidenceSnippets: evidence.slice(0, 3),
    userAction: action,
  }
}

export function getUserAction(documentId: string): ScreeningAction | undefined {
  return loadActions().find((a) => a.documentId === documentId)
}

export function getAllUserActions(): ScreeningAction[] {
  return loadActions()
}

const ACTION_LABELS: Record<string, string> = {
  approved: '采纳',
  demoted: '降权',
  misjudged: '标记误判',
  added_to_report: '加入今日报告',
}
