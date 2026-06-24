import type { EvidenceSnippet as EvidenceSnippetType } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Quote } from 'lucide-react'

const confidenceConfig: Record<string, { label: string; className: string }> = {
  high: { label: '高置信度', className: 'bg-green-100 text-green-700' },
  medium: { label: '中置信度', className: 'bg-amber-100 text-amber-700' },
  low: { label: '低置信度', className: 'bg-red-100 text-red-700' },
}

interface EvidenceSnippetProps {
  evidence: EvidenceSnippetType
  sourceTitle?: string
  sourceDate?: string
  compact?: boolean
}

export default function EvidenceSnippetCard({
  evidence,
  sourceTitle,
  sourceDate,
  compact = false,
}: EvidenceSnippetProps) {
  const conf = confidenceConfig[evidence.confidence] ?? confidenceConfig.medium

  if (compact) {
    return (
      <div className="flex items-start gap-2 text-sm py-1">
        <Quote className="h-3 w-3 text-gray-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-gray-700 truncate">{evidence.text}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="secondary" className={`text-[10px] px-1 py-0 ${conf.className}`}>
              {conf.label}
            </Badge>
            {sourceTitle && (
              <span className="text-[10px] text-gray-400 truncate">{sourceTitle}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-l-2 border-l-brand-500">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <Quote className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 leading-relaxed">{evidence.text}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className={`text-xs ${conf.className}`}>
                {conf.label}
              </Badge>
              {evidence.factType && (
                <Badge variant="outline" className="text-xs">
                  {evidence.factType}
                </Badge>
              )}
              {sourceTitle && (
                <span className="text-xs text-gray-400 truncate">
                  来源：{sourceTitle}
                  {sourceDate ? ` (${sourceDate})` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
