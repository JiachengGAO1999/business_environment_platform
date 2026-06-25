import { useState, useEffect, useCallback } from 'react'
import PageShell from '@/components/layout/PageShell'
import LoadingState from '@/components/common/LoadingState'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import DimensionTag from '@/components/common/DimensionTag'
import RiskBadge from '@/components/common/RiskBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getSources, getSourceByIdService } from '@/services/sourcesService'
import { runSaudiCrawlerOnce, type SaudiCrawlerRunResult } from '@/services/saudiCrawlerService'
import { useDebounce } from '@/hooks/useDebounce'
import type { SourceDocument, SourceFilters, SourceType, RelevanceLevel, AnalysisDimension, EvidenceSnippet } from '@/types'
import { ExternalLink, Loader2, PlayCircle, Search, X, Upload } from 'lucide-react'
import RealSourceImporter from '@/components/sources/RealSourceImporter'

export default function SourcesPage() {
  const [sources, setSources] = useState<SourceDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SourceFilters>({})
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 300)
  const [selectedSource, setSelectedSource] = useState<{
    source: SourceDocument
    evidence: EvidenceSnippet[]
  } | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [crawlerRunning, setCrawlerRunning] = useState(false)
  const [crawlerResult, setCrawlerResult] = useState<SaudiCrawlerRunResult | null>(null)

  const fetchSources = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getSources({ ...filters, searchQuery: debouncedSearch || undefined })
      setSources(result)
    } catch {
      setError('数据加载失败')
    } finally {
      setLoading(false)
    }
  }, [filters, debouncedSearch])

  useEffect(() => {
    fetchSources()
  }, [fetchSources])

  const updateFilter = (key: keyof SourceFilters, value: string | null | undefined) => {
    setFilters((prev) => {
      const next = { ...prev }
      if (!value || value === 'all') {
        delete next[key]
      } else {
        ;(next as Record<string, string>)[key] = value
      }
      return next
    })
  }

  const clearFilters = () => {
    setFilters({})
    setSearchInput('')
  }

  const runSaudiCrawler = async () => {
    setCrawlerRunning(true)
    setCrawlerResult(null)
    try {
      const result = await runSaudiCrawlerOnce()
      setCrawlerResult(result)
      setFilters((prev) => ({ ...prev, country: '沙特阿拉伯', dataOrigin: 'real' }))
      await fetchSources()
    } finally {
      setCrawlerRunning(false)
    }
  }

  const openDetail = async (id: string) => {
    const result = await getSourceByIdService(id)
    if (result) {
      setSelectedSource(result)
      setDetailOpen(true)
    }
  }

  const hasActiveFilters =
    filters.country ||
    filters.sourceType ||
    filters.relevanceLevel ||
    filters.dimension ||
    debouncedSearch

  return (
    <PageShell title="资料库" description="管理每日抓取和导入的全球营商环境相关资料">
      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-3 mb-4 bg-card p-3 rounded-lg border">
        <Select value={filters.country ?? 'all'} onValueChange={(v) => updateFilter('country', v === 'all' ? undefined : v)}>
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

        <Select value={filters.sourceType ?? 'all'} onValueChange={(v) => updateFilter('sourceType', v === 'all' ? undefined : v as SourceType)}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="来源类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="government">政府</SelectItem>
            <SelectItem value="international_org">国际组织</SelectItem>
            <SelectItem value="media">媒体</SelectItem>
            <SelectItem value="think_tank">智库</SelectItem>
            <SelectItem value="company">企业</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.relevanceLevel ?? 'all'} onValueChange={(v) => updateFilter('relevanceLevel', v === 'all' ? undefined : v as RelevanceLevel)}>
          <SelectTrigger className="w-[110px] h-8 text-xs">
            <SelectValue placeholder="相关性" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部相关性</SelectItem>
            <SelectItem value="high">高相关</SelectItem>
            <SelectItem value="medium">中相关</SelectItem>
            <SelectItem value="low">低相关</SelectItem>
            <SelectItem value="noise">噪声</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.dimension ?? 'all'} onValueChange={(v) => updateFilter('dimension', v === 'all' ? undefined : v as AnalysisDimension)}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
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

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="搜索标题、摘要..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
            <X className="h-3 w-3 mr-1" />清除筛选
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={runSaudiCrawler}
          disabled={crawlerRunning}
          className="h-8 text-xs ml-auto"
        >
          {crawlerRunning ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <PlayCircle className="h-3 w-3 mr-1" />
          )}
          一键抓取沙特
        </Button>

        <Button variant="outline" size="sm" onClick={() => setImportOpen(true)} className="h-8 text-xs">
          <Upload className="h-3 w-3 mr-1" />导入真实来源
        </Button>
      </div>

      {crawlerResult && (
        <div className="mb-4 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-xs text-brand-900">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-medium">沙特 crawler 已完成</span>
            <span>来源 {crawlerResult.sources.length} 条</span>
            <span>证据 {crawlerResult.evidence.length} 条</span>
            <span>直接抓取 {crawlerResult.fetchedCount} 条</span>
            <span>部分成功 {crawlerResult.fallbackCount} 条</span>
            <span>报告已更新为：{crawlerResult.report.title}</span>
          </div>
          {crawlerResult.logs.length > 0 && (
            <p className="mt-1 text-muted-foreground">
              {crawlerResult.logs[crawlerResult.logs.length - 1]}
            </p>
          )}
        </div>
      )}

      {/* 资料表格 */}
      {loading ? (
        <LoadingState message="加载资料..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSources} />
      ) : sources.length === 0 ? (
        <EmptyState message="没有匹配的资料，请调整筛选条件" />
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-[30%]">标题</TableHead>
                <TableHead className="text-xs w-[12%]">来源</TableHead>
                <TableHead className="text-xs w-[8%]">国家</TableHead>
                <TableHead className="text-xs w-[8%]">类型</TableHead>
                <TableHead className="text-xs w-[8%]">相关性</TableHead>
                <TableHead className="text-xs w-[18%]">维度</TableHead>
                <TableHead className="text-xs w-[8%]">来源标记</TableHead>
                <TableHead className="text-xs w-[8%]">日期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer hover:bg-background"
                  onClick={() => openDetail(s.id)}
                >
                  <TableCell className="text-xs font-medium text-gray-900 max-w-[300px] truncate">
                    {s.title}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 truncate max-w-[150px]">
                    {s.source}
                  </TableCell>
                  <TableCell className="text-xs">{s.country}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant="outline" className="text-xs">
                      {SOURCE_TYPE_LABELS[s.sourceType] ?? s.sourceType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1">
                      <span className={`font-medium ${s.relevanceLevel === 'high' ? 'text-green-700' : s.relevanceLevel === 'medium' ? 'text-amber-700' : s.relevanceLevel === 'noise' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {s.relevanceScore}
                      </span>
                      <RiskBadge level={s.relevanceLevel === 'noise' ? 'low' : s.relevanceLevel === 'high' ? 'high' : 'medium'} />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex flex-wrap gap-1">
                      {s.dimensions.slice(0, 2).map((d) => (
                        <DimensionTag key={d} dimension={d} />
                      ))}
                      {s.dimensions.length > 2 && (
                        <span className="text-xs text-gray-400">+{s.dimensions.length - 2}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {s.dataOrigin === 'real' ? (
                      <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-300">真实</Badge>
                    ) : (
                      <span className="text-gray-400">Mock</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                    {s.publishedAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 资料详情 Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedSource && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{selectedSource.source.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">来源机构：</span>
                    <span className="font-medium">{selectedSource.source.source}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">国家/地区：</span>
                    <span className="font-medium">{selectedSource.source.country}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">类型：</span>
                    <Badge variant="outline" className="text-xs">{SOURCE_TYPE_LABELS[selectedSource.source.sourceType]}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">可靠性：</span>
                    <span className="font-medium">{RELIABILITY_LABELS[selectedSource.source.reliability]}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">发布时间：</span>
                    <span>{selectedSource.source.publishedAt}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">语言：</span>
                    <span>{selectedSource.source.language}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">数据来源：</span>
                    {selectedSource.source.dataOrigin === 'real' ? (
                      <Badge className="text-xs bg-blue-100 text-blue-700">真实来源</Badge>
                    ) : (
                      <span className="text-gray-400">Mock 模拟数据</span>
                    )}
                  </div>
                  {selectedSource.source.url && (
                    <div>
                      <span className="text-gray-500">原文链接：</span>
                      <a
                        href={selectedSource.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:underline inline-flex items-center gap-1"
                      >
                        查看原文 <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">摘要</h4>
                  <p className="text-xs text-gray-600 leading-relaxed bg-background p-3 rounded">
                    {selectedSource.source.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    命中的分析维度
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedSource.source.dimensions.map((d) => (
                      <DimensionTag key={d} dimension={d} />
                    ))}
                  </div>
                </div>

                {selectedSource.evidence.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      证据片段 ({selectedSource.evidence.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedSource.evidence.map((ev) => (
                        <div key={ev.id} className="text-xs text-gray-700 bg-brand-50 border-l-2 border-brand-500 p-2 rounded">
                          <p>{ev.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[10px]">
                              {ev.factType}
                            </Badge>
                            <span className="text-gray-400">
                              置信度：{ev.confidence}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 真实来源导入 Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">导入真实来源</DialogTitle>
          </DialogHeader>
          <RealSourceImporter
            onSuccess={() => {
              setImportOpen(false)
              fetchSources()
            }}
          />
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  government: '政府',
  international_org: '国际组织',
  media: '媒体',
  think_tank: '智库',
  company: '企业',
  database: '数据库',
}

const RELIABILITY_LABELS: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}
