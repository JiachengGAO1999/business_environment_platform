import type { RiskLevel } from '@/types'
import { Badge } from '@/components/ui/badge'

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  low: { label: '低风险', className: 'bg-brand-50 text-brand-800 border-brand-200' },
  medium: { label: '中风险', className: 'bg-accent-amber-50 text-accent-amber-600 border-accent-amber-300' },
  high: { label: '高风险', className: 'bg-[#fff2e6] text-[#9a4d14] border-[#ecc39d]' },
  critical: { label: '严重风险', className: 'bg-danger-50 text-danger-700 border-danger-100' },
}

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const config = riskConfig[level]
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  )
}
