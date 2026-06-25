import { useState, useEffect, useCallback } from 'react'
import PageShell from '@/components/layout/PageShell'
import LoadingState from '@/components/common/LoadingState'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import ScreeningCard from '@/components/screening/ScreeningCard'
import { getScreeningResults, updateScreeningDecision, getUserAction } from '@/services/screeningService'
import type { ScreeningResult, AnalysisDimension } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ScreeningPage() {
  const [results, setResults] = useState<ScreeningResult[]>([])
  const [filteredResults, setFilteredResults] = useState<ScreeningResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [relevanceFilter, setRelevanceFilter] = useState<string>('all')
  const [dimensionFilter, setDimensionFilter] = useState<string>('all')
  const [feedback, setFeedback] = useState<string | null>(null)

  const fetchResults = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getScreeningResults()
      // 恢复用户已执行的操作
      const withActions = data.map((r) => {
        const action = getUserAction(r.documentId)
        return action ? { ...r, userAction: action.action } : r
      })
      setResults(withActions)
    } catch {
      setError('数据加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  // 应用筛选
  useEffect(() => {
    let filtered = [...results]
    if (countryFilter !== 'all') {
      filtered = filtered.filter((r) => {
        const docId = r.documentId
        // 简单的国家推断：从 documentId 提取
        if (docId.includes('-br-')) return countryFilter === '巴西'
        if (docId.includes('-sa-')) return countryFilter === '沙特阿拉伯'
        if (docId.includes('-ae-')) return countryFilter === '阿联酋'
        return false
      })
    }
    if (relevanceFilter !== 'all') {
      filtered = filtered.filter((r) => r.relevanceLevel === relevanceFilter)
    }
    if (dimensionFilter !== 'all') {
      filtered = filtered.filter((r) =>
        r.mappedDimensions.includes(dimensionFilter as AnalysisDimension)
      )
    }
    setFilteredResults(filtered)
  }, [results, countryFilter, relevanceFilter, dimensionFilter])

  const handleAction = async (
    documentId: string,
    action: 'approved' | 'demoted' | 'misjudged' | 'added_to_report'
  ) => {
    const updated = await updateScreeningDecision(documentId, action)
    if (updated) {
      setResults((prev) =>
        prev.map((r) =>
          r.documentId === documentId ? { ...r, userAction: action } : r
        )
      )
      const labels: Record<string, string> = {
        approved: '已采纳',
        demoted: '已降权',
        misjudged: '已标记误判',
        added_to_report: '已加入今日报告',
      }
      setFeedback(`操作成功：${labels[action]}`)
      setTimeout(() => setFeedback(null), 2500)
    }
  }

  if (loading) return <PageShell><LoadingState message="正在加载筛选结果..." /></PageShell>

  return (
    <PageShell
      title="智能筛选"
      description="系统自动筛选与分析，每条资料展示判断理由、维度映射和证据片段。操作状态刷新后保留（localStorage 持久化）。"
    >
      {/* 反馈提示 */}
      {feedback && (
        <div className="mb-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
          {feedback}
        </div>
      )}

      {error ? (
        <ErrorState message={error} onRetry={fetchResults} />
      ) : (
        <>
          {/* 筛选行 */}
          <div className="flex items-center gap-3 mb-4 bg-card p-3 rounded-lg border">
            <Select value={countryFilter} onValueChange={(v) => setCountryFilter(v ?? 'all')}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="国家" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部国家</SelectItem>
                <SelectItem value="巴西">巴西</SelectItem>
                <SelectItem value="沙特阿拉伯">沙特阿拉伯</SelectItem>
                <SelectItem value="阿联酋">阿联酋</SelectItem>
              </SelectContent>
            </Select>
            <Select value={relevanceFilter} onValueChange={(v) => setRelevanceFilter(v ?? 'all')}>
              <SelectTrigger className="w-[110px] h-8 text-xs">
                <SelectValue placeholder="相关性" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部相关性</SelectItem>
                <SelectItem value="high">高相关</SelectItem>
                <SelectItem value="medium">中相关</SelectItem>
                <SelectItem value="low">低相关</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dimensionFilter} onValueChange={(v) => setDimensionFilter(v ?? 'all')}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="分析维度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部维度</SelectItem>
                <SelectItem value="political_geopolitical_environment">政治地缘环境</SelectItem>
                <SelectItem value="financial_investment_environment">金融投资环境</SelectItem>
                <SelectItem value="industrial_market_environment">产业市场环境</SelectItem>
                <SelectItem value="compliance_rule_of_law_environment">合规法治环境</SelectItem>
                <SelectItem value="innovation_technology_environment">科创环境</SelectItem>
                <SelectItem value="social_cultural_environment">社会人文环境</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-gray-400 ml-auto">
              共 {filteredResults.length} 条待筛选
            </span>
          </div>

          {/* 筛选卡片列表 */}
          {filteredResults.length === 0 ? (
            <EmptyState message="没有匹配的筛选结果，请调整筛选条件" />
          ) : (
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <ScreeningCard
                  key={result.documentId}
                  result={result}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </>
      )}
    </PageShell>
  )
}
