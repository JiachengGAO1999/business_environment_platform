import type { RiskLevel } from '@/types'
import { Badge } from '@/components/ui/badge'

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  low: { label: '低风险', className: 'bg-green-100 text-green-800 border-green-300' },
  medium: { label: '中风险', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  high: { label: '高风险', className: 'bg-amber-100 text-amber-800 border-amber-300' },
  critical: { label: '严重风险', className: 'bg-red-100 text-red-800 border-red-300' },
}

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const config = riskConfig[level]
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  )
}
