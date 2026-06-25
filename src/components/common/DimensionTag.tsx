import type { AnalysisDimension } from '@/types'
import { DIMENSION_LABELS } from '@/types'
import { Badge } from '@/components/ui/badge'

const dimColors: Record<AnalysisDimension, string> = {
  political_geopolitical_environment: 'bg-[#eef3ef] text-[#435745] border-[#d3ddd0]',
  financial_investment_environment: 'bg-brand-50 text-brand-800 border-brand-200',
  industrial_market_environment: 'bg-[#f3ede2] text-[#765b32] border-[#dfd1ba]',
  compliance_rule_of_law_environment: 'bg-accent-amber-50 text-accent-amber-600 border-accent-amber-300',
  innovation_technology_environment: 'bg-[#eef0f4] text-[#4f5967] border-[#d5dae2]',
  social_cultural_environment: 'bg-[#edf5e9] text-[#4f6b3f] border-[#d2dfc8]',
  macro_economy: 'bg-brand-50 text-brand-800 border-brand-200',
  industrial_policy: 'bg-[#f3ede2] text-[#765b32] border-[#dfd1ba]',
  trade_environment: 'bg-[#eef3ef] text-[#4d664f] border-[#d5dfd3]',
  market_opportunity: 'bg-[#edf5e9] text-[#4f6b3f] border-[#d2dfc8]',
  business_risk: 'bg-accent-amber-50 text-accent-amber-600 border-accent-amber-300',
  political_geopolitical_risk: 'bg-danger-50 text-danger-700 border-danger-100',
  corporate_recommendation: 'bg-[#eef0f4] text-[#4f5967] border-[#d5dae2]',
}

export default function DimensionTag({ dimension }: { dimension: AnalysisDimension }) {
  return (
    <Badge variant="outline" className={`text-xs ${dimColors[dimension]}`}>
      {DIMENSION_LABELS[dimension]}
    </Badge>
  )
}
