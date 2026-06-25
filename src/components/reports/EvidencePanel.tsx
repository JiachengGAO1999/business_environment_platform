import { useEffect, useState } from 'react'
import type { EvidenceWithSource } from '@/services/reportService'
import { getEvidenceForSection } from '@/services/reportService'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExternalLink, Quote } from 'lucide-react'

interface EvidencePanelProps {
  activeEvidenceId: string | null
  sectionEvidenceIds: string[]
}

export default function EvidencePanel({ activeEvidenceId, sectionEvidenceIds }: EvidencePanelProps) {
  const [allEvidence, setAllEvidence] = useState<EvidenceWithSource[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sectionEvidenceIds.length > 0) {
      setLoading(true)
      getEvidenceForSection(sectionEvidenceIds).then((data) => {
        setAllEvidence(data)
        setLoading(false)
      })
    } else {
      setAllEvidence([])
    }
  }, [sectionEvidenceIds])

  const activeEvidence = activeEvidenceId
    ? allEvidence.find((e) => e.evidence.id === activeEvidenceId)
    : null

  return (
    <div className="sticky top-14 h-[calc(100vh-3.5rem)] bg-card border-l overflow-hidden">
      <div className="p-3 border-b">
        <h3 className="text-xs font-semibold text-gray-700">
          {activeEvidence ? '证据详情' : '证据来源'}
        </h3>
      </div>
      <ScrollArea className="h-[calc(100vh-7rem)]">
        <div className="p-3">
          {loading ? (
            <p className="text-xs text-gray-400">加载中...</p>
          ) : !activeEvidenceId ? (
            <div className="text-center py-8">
              <Quote className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">点击报告中的证据编号<br />查看来源资料</p>
            </div>
          ) : !activeEvidence ? (
            <p className="text-xs text-gray-400">证据未找到</p>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">证据编号</p>
                <Badge variant="outline" className="text-xs font-mono">
                  {activeEvidence.evidence.id}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">来源资料</p>
                <p className="text-xs font-medium text-gray-900">{activeEvidence.sourceTitle}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">来源日期</p>
                <p className="text-xs text-gray-700">{activeEvidence.sourceDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">证据片段</p>
                <div className="bg-brand-50 border-l-2 border-brand-500 p-2 rounded text-xs text-gray-700 leading-relaxed">
                  {activeEvidence.evidence.text}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">置信度：</p>
                <Badge variant="secondary" className={`text-xs ${
                  activeEvidence.evidence.confidence === 'high'
                    ? 'bg-green-100 text-green-700'
                    : activeEvidence.evidence.confidence === 'medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {activeEvidence.evidence.confidence}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">类型</p>
                <Badge variant="outline" className="text-xs">{activeEvidence.evidence.factType}</Badge>
              </div>
              {activeEvidence.sourceUrl && (
                <a
                  href={activeEvidence.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1"
                >
                  查看原始资料 <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {/* 章节全部证据列表 */}
          {allEvidence.length > 0 && !activeEvidenceId && (
            <div className="space-y-3 mt-4">
              <p className="text-xs text-gray-500">本章节引用证据</p>
              {allEvidence.map((item) => (
                <div key={item.evidence.id} className="text-xs border rounded p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Badge variant="outline" className="text-[10px] font-mono">{item.evidence.id}</Badge>
                    <Badge variant="secondary" className={`text-[10px] ${
                      item.evidence.confidence === 'high'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.evidence.confidence}
                    </Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed line-clamp-2">{item.evidence.text}</p>
                  <p className="text-gray-400 mt-1 truncate">{item.sourceTitle}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
