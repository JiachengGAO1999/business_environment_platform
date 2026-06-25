import type { ReportStatus } from '@/types'
import { Badge } from '@/components/ui/badge'

const statusConfig: Record<ReportStatus, { label: string; className: string }> = {
  not_started: { label: '未开始', className: 'bg-secondary text-gray-600 border-gray-300' },
  draft: { label: '草稿', className: 'bg-blue-100 text-blue-700 border-blue-300' },
  in_review: { label: '待审核', className: 'bg-amber-100 text-amber-700 border-amber-300' },
  approved: { label: '已审核', className: 'bg-green-100 text-green-700 border-green-300' },
  archived: { label: '已归档', className: 'bg-secondary text-gray-500 border-gray-300' },
}

export default function StatusBadge({ status }: { status: ReportStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  )
}

export function ReviewStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: '待审核', className: 'bg-secondary text-gray-600 border-gray-300' },
    approved: { label: '已通过', className: 'bg-green-100 text-green-700 border-green-300' },
    needs_revision: { label: '需修改', className: 'bg-amber-100 text-amber-700 border-amber-300' },
    unsupported: { label: '证据不足', className: 'bg-red-100 text-red-700 border-red-300' },
    factual_conflict: { label: '事实冲突', className: 'bg-red-100 text-red-700 border-red-300' },
    delete: { label: '已删除', className: 'bg-secondary text-gray-500 border-gray-300' },
  }

  const c = config[status] ?? { label: status, className: 'bg-secondary text-gray-600' }
  return (
    <Badge variant="outline" className={`text-xs ${c.className}`}>
      {c.label}
    </Badge>
  )
}
