import type { CountryProfile } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import RiskBadge from './RiskBadge'
import StatusBadge from './StatusBadge'
import { MapPin, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const oppColors: Record<string, string> = {
  high: 'bg-green-100 text-green-700 border-green-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  low: 'bg-secondary text-gray-600 border-gray-300',
}

export default function CountryCard({ country }: { country: CountryProfile }) {
  const navigate = useNavigate()

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-brand-300"
      onClick={() => {
        if (country.reportId) {
          navigate(`/reports/${country.reportId}`)
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">{country.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
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
              className="text-xs bg-secondary text-gray-600 px-2 py-0.5 rounded"
            >
              {ind}
            </span>
          ))}
        </div>

        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
          {country.latestSummary}
        </p>
      </CardContent>
    </Card>
  )
}
