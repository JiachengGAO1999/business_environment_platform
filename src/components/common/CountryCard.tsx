import type { CountryProfile } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import RiskBadge from './RiskBadge'
import StatusBadge from './StatusBadge'
import { MapPin, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const oppColors: Record<string, string> = {
  high: 'bg-brand-50 text-brand-800 border-brand-200',
  medium: 'bg-accent-amber-50 text-accent-amber-600 border-accent-amber-300',
  low: 'bg-secondary text-muted-foreground border-border',
}

export default function CountryCard({ country }: { country: CountryProfile }) {
  const navigate = useNavigate()

  return (
    <Card
      className="cursor-pointer border-border transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_14px_34px_rgba(47,61,51,0.09)]"
      onClick={() => {
        if (country.reportId) {
          navigate(`/reports/${country.reportId}`)
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-medium text-foreground">{country.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {country.region}
            </div>
          </div>
          <StatusBadge status={country.reportStatus} />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <RiskBadge level={country.riskLevel} />
          <Badge variant="outline" className={`text-xs ${oppColors[country.opportunityLevel]}`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            机会{country.opportunityLevel === 'high' ? '高' : country.opportunityLevel === 'medium' ? '中' : '低'}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {country.keyIndustries.map((ind) => (
            <span
              key={ind}
              className="rounded border border-border/80 bg-secondary/70 px-2 py-0.5 text-xs text-muted-foreground"
            >
              {ind}
            </span>
          ))}
        </div>

        <p className="line-clamp-3 text-xs leading-6 text-muted-foreground">
          {country.latestSummary}
        </p>
      </CardContent>
    </Card>
  )
}
