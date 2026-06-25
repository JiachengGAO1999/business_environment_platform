import type { AnalysisReport, ReviewRecord, ReviewAction } from '@/types'
import { getEffectiveReports, getReviewRecordsByReportId, getReportById } from '@/data/mock'

const STORAGE_KEY = 'biz-platform-review-state'

interface ReviewState {
  sectionReviews: Record<string, { action: ReviewAction; comment: string }>
  overallReview: { decision: string; comment: string } | null
  customReviews: ReviewRecord[]
}

function loadState(reportId: string): ReviewState {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${reportId}`)
    return stored ? JSON.parse(stored) : { sectionReviews: {}, overallReview: null, customReviews: [] }
  } catch {
    return { sectionReviews: {}, overallReview: null, customReviews: [] }
  }
}

function saveState(reportId: string, state: ReviewState): void {
  localStorage.setItem(`${STORAGE_KEY}-${reportId}`, JSON.stringify(state))
}

export async function getPendingReviews(): Promise<AnalysisReport[]> {
  await new Promise((r) => setTimeout(r, 100))
  return getEffectiveReports().filter(
    (r) => r.status === 'draft' || r.status === 'in_review'
  )
}

export async function getReviewHistory(reportId: string): Promise<ReviewRecord[]> {
  await new Promise((r) => setTimeout(r, 100))
  const builtIn = getReviewRecordsByReportId(reportId)
  const state = loadState(reportId)
  return [...builtIn, ...state.customReviews]
}

export async function submitSectionReview(
  reportId: string,
  sectionId: string,
  action: ReviewAction,
  comment: string
): Promise<{ success: boolean; review: ReviewRecord }> {
  await new Promise((r) => setTimeout(r, 200))

  const newReview: ReviewRecord = {
    id: `rev-${Date.now()}`,
    reportId,
    sectionId,
    reviewer: '当前用户（Demo）',
    timestamp: new Date().toISOString(),
    action,
    comment,
  }

  // 持久化到 localStorage
  const state = loadState(reportId)
  state.sectionReviews[sectionId] = { action, comment }
  state.customReviews.push(newReview)
  saveState(reportId, state)

  return { success: true, review: newReview }
}

export async function submitOverallReview(
  reportId: string,
  decision: string,
  comment: string
): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 200))

  const state = loadState(reportId)
  state.overallReview = { decision, comment }
  saveState(reportId, state)

  return { success: true }
}

export function getSectionReviewState(
  reportId: string,
  sectionId: string
): { action: ReviewAction; comment: string } | null {
  const state = loadState(reportId)
  return state.sectionReviews[sectionId] ?? null
}

export function getOverallReviewState(reportId: string): { decision: string; comment: string } | null {
  const state = loadState(reportId)
  return state.overallReview
}

export function getReportSectionReviewStatus(
  reportId: string,
  sectionId: string,
  originalStatus: ReviewAction | 'pending'
): ReviewAction | 'pending' {
  const local = getSectionReviewState(reportId, sectionId)
  return local?.action ?? originalStatus
}

export async function getReportWithReviewState(reportId: string): Promise<AnalysisReport | null> {
  const report = getReportById(reportId)
  if (!report) return null

  const state = loadState(reportId)

  // 合并自定义审核记录
  const allReviews = [
    ...report.reviewRecords,
    ...state.customReviews,
  ]

  return {
    ...report,
    reviewRecords: allReviews,
    sections: report.sections.map((s) => ({
      ...s,
      reviewStatus: state.sectionReviews[s.id]?.action ?? s.reviewStatus,
    })),
  }
}
