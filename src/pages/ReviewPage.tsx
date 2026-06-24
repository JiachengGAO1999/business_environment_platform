import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '@/components/layout/PageShell'
import LoadingState from '@/components/common/LoadingState'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import StatusBadge, { ReviewStatusBadge } from '@/components/common/StatusBadge'
import { getPendingReviews, getReportWithReviewState } from '@/services/reviewService'
import { useReviewState } from '@/hooks/useReviewState'
import type { AnalysisReport, ReviewAction } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Layers,
  Check,
  Pencil,
  AlertTriangle,
  XCircle,
  Eye,
  History,
} from 'lucide-react'

export default function ReviewPage() {
  const [reports, setReports] = useState<AnalysisReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null)
  const [tabFilter, setTabFilter] = useState<'pending' | 'reviewed' | 'all'>('pending')
  const [reviewingSectionId, setReviewingSectionId] = useState<string | null>(null)
  const [reviewComment, setReviewComment] = useState('')
  const [overallDecision, setOverallDecision] = useState('')
  const [overallComment, setOverallComment] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    reviews,
    addReview,
    getSectionReview,
    getOverallReview,
    loaded: reviewsLoaded,
  } = useReviewState(selectedReportId ?? '')

  const fetchReports = async () => {
    setLoading(true)
    setError(null)
    try {
      setReports(await getPendingReviews())
    } catch {
      setError('数据加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReports() }, [])

  const openReport = async (reportId: string) => {
    setSelectedReportId(reportId)
    const report = await getReportWithReviewState(reportId)
    setSelectedReport(report)
  }

  const handleSectionReview = async (sectionId: string, action: ReviewAction) => {
    addReview(sectionId, action, reviewComment)
    setReviewingSectionId(null)
    setReviewComment('')
    showFeedback(ACTION_LABELS[action] ?? action)
  }

  const handleOverallReview = () => {
    addReview(null, overallDecision as ReviewAction, overallComment)
    showFeedback(`整体审核结论：${overallDecision}`)
    setOverallDecision('')
    setOverallComment('')
  }

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 2500)
  }

  const filteredReports = tabFilter === 'all'
    ? reports
    : tabFilter === 'pending'
    ? reports.filter((r) => r.status === 'in_review')
    : reports.filter((r) => r.status === 'approved')

  return (
    <PageShell title="审核中心" description="专家审核国别报告，标记通过、需修改或证据不足。审核状态刷新后保留。">
      {feedback && (
        <div className="mb-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
          {feedback}
        </div>
      )}

      {loading || !reviewsLoaded ? (
        <LoadingState message="加载中..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchReports} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Report list */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-1 mb-3">
              {['pending', 'reviewed', 'all'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTabFilter(t as typeof tabFilter)}
                  className={`text-xs px-3 py-1 rounded-md transition-colors ${
                    tabFilter === t ? 'bg-brand-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'
                  }`}
                >
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>

            {filteredReports.length === 0 ? (
              <EmptyState message="暂无待审核报告" />
            ) : (
              <div className="space-y-2">
                {filteredReports.map((r) => (
                  <Card
                    key={r.id}
                    className={`cursor-pointer transition-colors ${
                      selectedReportId === r.id
                        ? 'border-brand-500 ring-1 ring-brand-500'
                        : 'border-gray-200 hover:border-brand-300'
                    }`}
                    onClick={() => openReport(r.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-xs font-medium text-gray-900 line-clamp-2">
                          {r.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{r.country}</span>
                        <Calendar className="h-3 w-3" />
                        <span>{r.period}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={r.status} />
                        {r.openQuestions.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700">
                            {r.openQuestions.length} 个待复核
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right: Review detail */}
          <div className="lg:col-span-2">
            {!selectedReport ? (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                选择左侧报告开始审核
              </div>
            ) : (
              <div className="space-y-4">
                {/* Report header */}
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {selectedReport.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => navigate(`/reports/${selectedReport.id}`)}
                    >
                      <Eye className="h-3 w-3 mr-1" />查看完整报告
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{selectedReport.country}</span>
                    <span>{selectedReport.period}</span>
                    <Layers className="h-3 w-3" />
                    <span>{selectedReport.sections.length} 章节</span>
                  </div>
                </div>

                {/* Section review */}
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">段落审核</h4>
                  <div className="space-y-3">
                    {selectedReport.sections.map((section) => {
                      const localReview = getSectionReview(section.id)
                      const currentStatus = localReview?.action ?? section.reviewStatus

                      return (
                        <div key={section.id} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="text-xs font-medium text-gray-900">{section.title}</h5>
                            {currentStatus !== 'pending' && (
                              <ReviewStatusBadge status={currentStatus} />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {section.content.slice(0, 150)}...
                          </p>

                          {reviewingSectionId === section.id ? (
                            <div className="space-y-2">
                              <Textarea
                                placeholder="审核意见（可选）..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="text-xs min-h-[60px]"
                              />
                              <div className="flex items-center gap-1 flex-wrap">
                                <Button size="sm" className="text-xs h-7 bg-green-600 hover:bg-green-700" onClick={() => handleSectionReview(section.id, 'approved')}>
                                  <Check className="h-3 w-3 mr-1" />通过
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleSectionReview(section.id, 'needs_revision')}>
                                  <Pencil className="h-3 w-3 mr-1" />需修改
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs h-7 text-red-600" onClick={() => handleSectionReview(section.id, 'unsupported')}>
                                  <AlertTriangle className="h-3 w-3 mr-1" />证据不足
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs h-7 text-red-600" onClick={() => handleSectionReview(section.id, 'factual_conflict')}>
                                  <XCircle className="h-3 w-3 mr-1" />事实冲突
                                </Button>
                                <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setReviewingSectionId(null)}>
                                  取消
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 text-gray-500"
                              onClick={() => setReviewingSectionId(section.id)}
                            >
                              审核此段落
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Overall review */}
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">整体审核结论</h4>
                  {getOverallReview() ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                      <p className="text-green-700 font-medium">
                        结论：{getOverallReview()!.action}
                      </p>
                      <p className="text-gray-600 mt-1">{getOverallReview()!.comment}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Select value={overallDecision || undefined} onValueChange={(v) => setOverallDecision(v ?? '')}>
                        <SelectTrigger className="w-[200px] h-8 text-xs">
                          <SelectValue placeholder="选择审核结论" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="可发布">可发布</SelectItem>
                          <SelectItem value="需修改">需修改</SelectItem>
                          <SelectItem value="暂不发布">暂不发布</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea
                        placeholder="整体审核意见..."
                        value={overallComment}
                        onChange={(e) => setOverallComment(e.target.value)}
                        className="text-xs min-h-[80px]"
                      />
                      <Button size="sm" className="text-xs h-7" onClick={handleOverallReview} disabled={!overallDecision}>
                        <Check className="h-3 w-3 mr-1" />提交审核结论
                      </Button>
                    </div>
                  )}
                </div>

                {/* Review history */}
                {reviews.length > 0 && (
                  <div className="bg-white rounded-lg border p-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <History className="h-3 w-3" />审核记录
                    </h4>
                    <ScrollArea className="max-h-[300px]">
                      <div className="space-y-2">
                        {reviews.map((r, idx) => (
                          <div key={idx}>
                            <div className="text-xs">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">
                                  {r.sectionId
                                    ? selectedReport?.sections.find((s) => s.id === r.sectionId)?.title ?? r.sectionId
                                    : '整体审核'}
                                </span>
                                <Badge variant="outline" className={`text-xs ${
                                  r.action === 'approved' ? 'bg-green-50 text-green-700' :
                                  r.action === 'needs_revision' ? 'bg-amber-50 text-amber-700' :
                                  'bg-red-50 text-red-700'
                                }`}>
                                  {ACTION_LABELS[r.action] ?? r.action}
                                </Badge>
                                <span className="text-gray-400">
                                  {new Date(r.timestamp).toLocaleString('zh-CN')}
                                </span>
                              </div>
                              <p className="text-gray-600">{r.comment}</p>
                            </div>
                            {idx < reviews.length - 1 && <Separator className="mt-2" />}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </PageShell>
  )
}

const TAB_LABELS: Record<string, string> = {
  pending: '待审核',
  reviewed: '已审核',
  all: '全部',
}

const ACTION_LABELS: Record<string, string> = {
  approved: '已通过',
  needs_revision: '需修改',
  unsupported: '证据不足',
  factual_conflict: '事实冲突',
  delete: '已删除',
  '可发布': '可发布',
  '需修改': '需修改',
  '暂不发布': '暂不发布',
}
