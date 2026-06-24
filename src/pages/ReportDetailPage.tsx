import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TopNav from '@/components/layout/TopNav'
import ReportTOC from '@/components/reports/ReportTOC'
import EvidencePanel from '@/components/reports/EvidencePanel'
import ReportExporter from '@/components/reports/ReportExporter'
import LoadingState from '@/components/common/LoadingState'
import ErrorState from '@/components/common/ErrorState'
import StatusBadge from '@/components/common/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  submitSectionReview,
  submitOverallReview,
  getSectionReviewState,
  getOverallReviewState,
  getReportWithReviewState,
} from '@/services/reviewService'
import type { AnalysisReport, ReviewAction } from '@/types'
import { ArrowLeft, Check, Pencil, AlertTriangle } from 'lucide-react'

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<AnalysisReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSectionId, setActiveSectionId] = useState('')
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null)
  const [reviewingSectionId, setReviewingSectionId] = useState<string | null>(null)
  const [reviewComment, setReviewComment] = useState('')
  const [showOverallReview, setShowOverallReview] = useState(false)
  const [overallDecision, setOverallDecision] = useState('')
  const [overallComment, setOverallComment] = useState('')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const fetchReport = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getReportWithReviewState(id)
      if (!data) {
        setError('报告不存在')
      } else {
        setReport(data)
        if (data.sections.length > 0) {
          setActiveSectionId(data.sections[0].id)
        }
      }
    } catch {
      setError('报告加载失败')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchReport() }, [fetchReport])

  // Intersection observer for TOC highlighting
  useEffect(() => {
    if (!report) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )

    for (const section of report.sections) {
      const el = sectionRefs.current[section.id]
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [report])

  const scrollToSection = (sectionId: string) => {
    const el = sectionRefs.current[sectionId]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleEvidenceClick = (evidenceId: string) => {
    setActiveEvidenceId(evidenceId === activeEvidenceId ? null : evidenceId)
  }

  const handleSectionReview = async (sectionId: string, action: ReviewAction) => {
    if (!id) return
    await submitSectionReview(id, sectionId, action, reviewComment)
    setReviewingSectionId(null)
    setReviewComment('')
    fetchReport()
  }

  const handleOverallReview = async () => {
    if (!id) return
    await submitOverallReview(id, overallDecision, overallComment)
    setShowOverallReview(false)
    setOverallComment('')
    fetchReport()
  }

  // Parse evidence markers in content
  const renderContent = (content: string, sectionEvidenceIds: string[]) => {
    const parts = content.split(/(\[证:[^\]]+\])/g)
    return parts.map((part, i) => {
      const match = part.match(/\[证:([^\]]+)\]/)
      if (match) {
        const evId = match[1]
        const exists = sectionEvidenceIds.includes(evId)
        const isActive = activeEvidenceId === evId
        return (
          <button
            key={i}
            onClick={() => exists && handleEvidenceClick(evId)}
            className={`inline-flex items-center px-1 text-xs font-mono rounded ${
              !exists
                ? 'text-gray-300 cursor-not-allowed'
                : isActive
                ? 'bg-brand-600 text-white'
                : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
            }`}
            title={exists ? '点击查看证据来源' : '证据引用'}
          >
            [{match[1]}]
          </button>
        )
      }
      // Process bold markers
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
      return (
        <span key={i}>
          {boldParts.map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={j} className="font-semibold text-gray-900">{bp.slice(2, -2)}</strong>
            }
            return <span key={j}>{bp}</span>
          })}
        </span>
      )
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <LoadingState message="加载报告中..." fullPage />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <div className="p-6">
          <ErrorState message={error ?? '报告不存在'} onRetry={fetchReport} />
          <div className="text-center mt-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/reports')} className="text-xs">
              <ArrowLeft className="h-3 w-3 mr-1" />返回报告列表
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentSection = report.sections.find((s) => s.id === activeSectionId)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      {/* Report Header */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-2 mb-1">
          <Button variant="ghost" size="sm" onClick={() => navigate('/reports')} className="text-xs h-7 px-2">
            <ArrowLeft className="h-3 w-3 mr-1" />返回
          </Button>
          <h1 className="text-base font-semibold text-gray-900 flex-1">{report.title}</h1>
          <StatusBadge status={report.status} />
          <ReportExporter reportId={report.id} reportTitle={report.title} />
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
          <span>{report.country}</span>
          <span>{report.period}</span>
          <span>生成时间：{report.generatedAt}</span>
          <span>{report.sourceDocumentIds.length} 条来源</span>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="grid" style={{ gridTemplateColumns: '260px 1fr 320px', minHeight: 'calc(100vh - 3.5rem - 72px)' }}>
        {/* Left: TOC */}
        <ReportTOC
          sections={report.sections}
          activeSectionId={activeSectionId}
          onNavigate={scrollToSection}
        />

        {/* Center: Report Content */}
        <div className="bg-white border-r overflow-y-auto" style={{ maxHeight: 'calc(100vh - 3.5rem - 72px)' }}>
          <div className="p-6 max-w-[720px]">
            {/* Risk summary alert */}
            {report.sections.some((s) => s.riskLevel === 'high' || s.riskLevel === 'critical') && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
                <strong>风险提示：</strong>本报告包含高风险或严重风险标记的章节，建议重点关注经营风险和政治与地缘风险部分。
              </div>
            )}

            {/* Sections */}
            {report.sections.map((section) => {
              const localReview = getSectionReviewState(report.id, section.id)
              const currentStatus = localReview?.action ?? section.reviewStatus

              return (
                <div
                  key={section.id}
                  id={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el }}
                  className="mb-8 scroll-mt-20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
                    {section.riskLevel && (
                      <Badge variant="outline" className={`text-xs ${
                        section.riskLevel === 'high' || section.riskLevel === 'critical'
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : section.riskLevel === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-green-50 text-green-700 border-green-300'
                      }`}>
                        风险：{section.riskLevel}
                      </Badge>
                    )}
                    {section.confidence && (
                      <Badge variant="secondary" className={`text-xs ${
                        section.confidence === 'low'
                          ? 'bg-red-100 text-red-700'
                          : section.confidence === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        置信度：{section.confidence}
                      </Badge>
                    )}
                    {/* Review status badge */}
                    {currentStatus !== 'pending' && (
                      <Badge variant="outline" className={`text-xs ${
                        currentStatus === 'approved' ? 'bg-green-50 text-green-700 border-green-300' :
                        currentStatus === 'needs_revision' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                        'bg-red-50 text-red-700 border-red-300'
                      }`}>
                        {currentStatus === 'approved' ? '已通过' :
                         currentStatus === 'needs_revision' ? '需修改' : '证据不足'}
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                    {section.content.split('\n').map((para, pi) => (
                      para.trim() ? (
                        <p key={pi}>
                          {renderContent(para, section.evidenceIds)}
                        </p>
                      ) : pi > 0 ? <br key={pi} /> : null
                    ))}
                  </div>

                  {/* Section-level review */}
                  {report.status === 'in_review' && section.title !== '证据来源' && section.title !== '待专家复核问题' && (
                    <div className="mt-3 pt-3 border-t">
                      {reviewingSectionId === section.id ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="输入审核意见（可选）..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="text-xs min-h-[60px]"
                          />
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="text-xs h-7 bg-green-600 hover:bg-green-700" onClick={() => handleSectionReview(section.id, 'approved')}>
                              <Check className="h-3 w-3 mr-1" />通过
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleSectionReview(section.id, 'needs_revision')}>
                              <Pencil className="h-3 w-3 mr-1" />需修改
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7 text-red-600" onClick={() => handleSectionReview(section.id, 'unsupported')}>
                              <AlertTriangle className="h-3 w-3 mr-1" />证据不足
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
                          className="text-xs text-gray-500 h-7"
                          onClick={() => setReviewingSectionId(section.id)}
                        >
                          审核此段落
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Overall Review section */}
            {report.status === 'in_review' && (
              <div className="border-t pt-6 mt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">整体审核结论</h3>
                {getOverallReviewState(report.id) ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                    <p className="text-green-700 font-medium">
                      审核状态：{getOverallReviewState(report.id)!.decision}
                    </p>
                    <p className="text-gray-600 mt-1">{getOverallReviewState(report.id)!.comment}</p>
                  </div>
                ) : showOverallReview ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {['可发布', '需修改', '暂不发布'].map((d) => (
                        <Button
                          key={d}
                          size="sm"
                          variant={overallDecision === d ? 'default' : 'outline'}
                          onClick={() => setOverallDecision(d)}
                          className={`text-xs h-7 ${overallDecision === d && d === '可发布' ? 'bg-green-600' : overallDecision === d && d === '暂不发布' ? 'bg-red-600' : ''}`}
                        >
                          {d}
                        </Button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="整体审核意见..."
                      value={overallComment}
                      onChange={(e) => setOverallComment(e.target.value)}
                      className="text-xs min-h-[80px]"
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="text-xs h-7" onClick={handleOverallReview} disabled={!overallDecision}>
                        <Check className="h-3 w-3 mr-1" />提交审核结论
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setShowOverallReview(false)}>
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setShowOverallReview(true)}>
                    开始审核
                  </Button>
                )}
              </div>
            )}

            {/* Review history */}
            {report.reviewRecords.length > 0 && (
              <div className="border-t pt-6 mt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">审核记录</h3>
                <div className="space-y-2">
                  {report.reviewRecords.map((r) => (
                    <div key={r.id} className="text-xs bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{r.reviewer}</span>
                        <Badge variant="outline" className={`text-xs ${
                          r.action === 'approved' ? 'bg-green-50 text-green-700' :
                          r.action === 'needs_revision' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {r.action === 'approved' ? '通过' :
                           r.action === 'needs_revision' ? '需修改' :
                           r.action === 'unsupported' ? '证据不足' :
                           r.action === 'factual_conflict' ? '事实冲突' : r.action}
                        </Badge>
                        <span className="text-gray-400">{new Date(r.timestamp).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <p className="text-gray-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Evidence Panel */}
        <EvidencePanel
          activeEvidenceId={activeEvidenceId}
          sectionEvidenceIds={currentSection?.evidenceIds ?? []}
        />
      </div>
    </div>
  )
}
