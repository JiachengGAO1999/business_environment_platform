import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '@/components/layout/PageShell'
import LoadingState from '@/components/common/LoadingState'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import StatusBadge from '@/components/common/StatusBadge'
import { getReports } from '@/services/reportService'
import type { AnalysisReport } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Layers } from 'lucide-react'

export default function ReportsListPage() {
  const [reports, setReports] = useState<AnalysisReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const navigate = useNavigate()

  const fetchReports = async () => {
    setLoading(true)
    setError(null)
    try {
      setReports(await getReports())
    } catch {
      setError('数据加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReports() }, [])

  const filtered = statusFilter === 'all'
    ? reports
    : reports.filter((r) => r.status === statusFilter)

  return (
    <PageShell title="国别报告" description="系统生成的国别营商环境分析报告">
      {loading ? (
        <LoadingState message="加载报告列表..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchReports} />
      ) : (
        <>
          {/* 状态筛选 Tabs */}
          <div className="flex items-center gap-2 mb-4">
            {['all', 'draft', 'in_review', 'approved'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  statusFilter === s
                    ? 'bg-brand-700 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {STATUS_TAB_LABELS[s] ?? s}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState message="暂无报告" />
          ) : (
            <div className="grid gap-4">
              {filtered.map((report) => (
                <Card
                  key={report.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-brand-300"
                  onClick={() => navigate(`/reports/${report.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {report.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{report.country}</span>
                          <span>·</span>
                          <Calendar className="h-3 w-3" />
                          <span>{report.period}</span>
                          <span>·</span>
                          <Layers className="h-3 w-3" />
                          <span>{report.sections.length} 章节</span>
                          <span>·</span>
                          <span>{report.sourceDocumentIds.length} 条来源</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <StatusBadge status={report.status} />
                        {report.openQuestions.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-300">
                            {report.openQuestions.length} 个待复核
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </PageShell>
  )
}

const STATUS_TAB_LABELS: Record<string, string> = {
  all: '全部',
  draft: '草稿',
  in_review: '待审核',
  approved: '已审核',
  archived: '已归档',
}
