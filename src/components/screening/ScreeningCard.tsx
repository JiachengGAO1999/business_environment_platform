import type { ScreeningResult } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DimensionTag from '@/components/common/DimensionTag'
import EvidenceSnippetCard from '@/components/common/EvidenceSnippet'
import { getSourceById } from '@/data/mock'
import { Check, ArrowDown, Flag, FilePlus } from 'lucide-react'

interface ScreeningCardProps {
  result: ScreeningResult
  onAction: (documentId: string, action: 'approved' | 'demoted' | 'misjudged' | 'added_to_report') => void
}

export default function ScreeningCard({ result, onAction }: ScreeningCardProps) {
  const doc = getSourceById(result.documentId)

  if (!doc) return null

  const hasAction = !!result.userAction

  return (
    <Card className={`border ${hasAction ? 'opacity-70' : ''} ${result.userAction === 'approved' || result.userAction === 'added_to_report' ? 'border-l-4 border-l-green-500' : result.userAction === 'misjudged' ? 'border-l-4 border-l-red-500' : ''}`}>
      <CardContent className="p-4">
        {/* 标题行 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 leading-snug">{doc.title}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {doc.source} · {doc.country} · {doc.publishedAt}
            </p>
          </div>

          {/* 相关性评分 */}
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <div className="text-right">
              <div className={`text-lg font-bold ${
                result.relevanceLevel === 'high' ? 'text-green-700' :
                result.relevanceLevel === 'medium' ? 'text-amber-700' :
                'text-gray-500'
              }`}>
                {result.relevanceScore}
              </div>
              <Badge variant="outline" className={`text-xs ${
                result.relevanceLevel === 'high' ? 'bg-green-50 text-green-700 border-green-300' :
                result.relevanceLevel === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                'bg-gray-50 text-gray-500'
              }`}>
                {result.relevanceLevel === 'high' ? '高相关' : result.relevanceLevel === 'medium' ? '中相关' : '低相关'}
              </Badge>
            </div>
          </div>
        </div>

        {/* 判断理由 */}
        <div className="mb-3 bg-brand-50 rounded-lg p-3 border-l-2 border-brand-500">
          <p className="text-xs font-medium text-brand-800 mb-1">判断理由</p>
          <p className="text-xs text-brand-700 leading-relaxed">{result.reason}</p>
        </div>

        {/* 维度映射 */}
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-600 mb-1">命中分析维度</p>
          <div className="flex flex-wrap gap-1">
            {result.mappedDimensions.map((d) => (
              <DimensionTag key={d} dimension={d} />
            ))}
          </div>
        </div>

        {/* 事实 vs 推断 */}
        {result.extractedEvidenceSnippets.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-medium text-gray-600">证据片段</p>
              <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700">
                事实摘录
              </Badge>
            </div>
            <div className="space-y-1">
              {result.extractedEvidenceSnippets.map((ev) => (
                <EvidenceSnippetCard
                  key={ev.id}
                  evidence={ev}
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {/* 模型推断标注 */}
        <div className="mb-3">
          <Badge variant="secondary" className="text-[10px] bg-purple-100 text-purple-700 mb-1">
            模型推断
          </Badge>
          <p className="text-xs text-gray-500">
            基于上述事实和营商环境分析框架，系统推断该资料对{['宏观经济', '产业政策', '贸易环境', '市场机会', '经营风险', '政治与地缘风险', '企业行动建议'].filter((_, i) => result.mappedDimensions.length > i).join('、')}维度具有分析价值。
          </p>
        </div>

        {/* 操作按钮 */}
        {!hasAction && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
              onClick={() => onAction(result.documentId, 'approved')}
            >
              <Check className="h-3 w-3 mr-1" />采纳
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={() => onAction(result.documentId, 'demoted')}
            >
              <ArrowDown className="h-3 w-3 mr-1" />降权
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onAction(result.documentId, 'misjudged')}
            >
              <Flag className="h-3 w-3 mr-1" />标记误判
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 text-amber-600 border-amber-300 hover:bg-amber-50 ml-auto"
              onClick={() => onAction(result.documentId, 'added_to_report')}
            >
              <FilePlus className="h-3 w-3 mr-1" />加入今日报告
            </Button>
          </div>
        )}

        {/* 已操作状态 */}
        {hasAction && (
          <div className="flex items-center gap-2 pt-2 border-t text-xs">
            {result.userAction === 'approved' && (
              <span className="text-green-600 font-medium">✓ 已采纳</span>
            )}
            {result.userAction === 'demoted' && (
              <span className="text-gray-500 font-medium">已降权</span>
            )}
            {result.userAction === 'misjudged' && (
              <span className="text-red-500 font-medium">已标记误判</span>
            )}
            {result.userAction === 'added_to_report' && (
              <span className="text-amber-600 font-medium">已加入今日报告</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
