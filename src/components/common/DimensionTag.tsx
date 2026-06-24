import type { AnalysisDimension } from '@/types'
import { DIMENSION_LABELS } from '@/types'
import { Badge } from '@/components/ui/badge'

const dimColors: Record<AnalysisDimension, string> = {
  macro_economy: 'bg-blue-50 text-blue-700 border-blue-200',
  industrial_policy: 'bg-purple-50 text-purple-700 border-purple-200',
  trade_environment: 'bg-teal-50 text-teal-700 border-teal-200',
  market_opportunity: 'bg-green-50 text-green-700 border-green-200',
  business_risk: 'bg-orange-50 text-orange-700 border-orange-200',
  political_geopolitical_risk: 'bg-red-50 text-red-700 border-red-200',
  corporate_recommendation: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

export default function DimensionTag({ dimension }: { dimension: AnalysisDimension }) {
  return (
    <Badge variant="outline" className={`text-xs ${dimColors[dimension]}`}>
      {DIMENSION_LABELS[dimension]}
    </Badge>
  )
}
