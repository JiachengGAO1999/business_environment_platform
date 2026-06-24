import { useState, useEffect } from 'react'
import PageShell from '@/components/layout/PageShell'
import KPICard from '@/components/common/KPICard'
import CountryCard from '@/components/common/CountryCard'
import RiskBadge from '@/components/common/RiskBadge'
import DimensionTag from '@/components/common/DimensionTag'
import LoadingState from '@/components/common/LoadingState'
import ErrorState from '@/components/common/ErrorState'
import { getDashboardOverview, getCountries, getTodayRisks, getTodayOpportunities } from '@/services/dashboardService'
import type { DashboardOverview, CountryProfile, RiskItem, OpportunityItem } from '@/types'
import { FileText, Target, AlertTriangle, FileCheck, ClipboardCheck, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [countries, setCountries] = useState<CountryProfile[]>([])
  const [risks, setRisks] = useState<RiskItem[]>([])
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [ov, cs, rs, os] = await Promise.all([
        getDashboardOverview(),
        getCountries(),
        getTodayRisks(),
        getTodayOpportunities(),
      ])
      setOverview(ov)
      setCountries(cs)
      setRisks(rs)
      setOpportunities(os)
    } catch {
      setError('数据加载失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <PageShell><LoadingState message="正在加载工作台数据..." /></PageShell>
  if (error) return <PageShell><ErrorState message={error} onRetry={fetchData} /></PageShell>
  if (!overview) return <PageShell><ErrorState message="数据为空" onRetry={fetchData} /></PageShell>

  return (
    <PageShell>
      {/* KPI 指标卡 */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <KPICard title="今日新增资料" value={overview.todaySourceCount} icon={FileText} />
        <KPICard title="高相关资料" value={overview.highRelevanceCount} icon={Target} />
        <KPICard
          title="高风险预警"
          value={overview.highRiskAlertCount}
          icon={AlertTriangle}
          variant={overview.highRiskAlertCount > 10 ? 'danger' : 'warning'}
        />
        <KPICard title="已生成报告" value={overview.generatedReportCount} icon={FileCheck} />
        <KPICard title="待专家审核" value={overview.pendingReviewCount} icon={ClipboardCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：国家卡片 */}
        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            国家/地区监测
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {countries.map((c) => (
              <CountryCard key={c.id} country={c} />
            ))}
          </div>
        </div>

        {/* 右侧：概览面板 */}
        <div className="space-y-4">
          {/* 重点风险 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                今日重点风险
              </h3>
              <div className="space-y-3">
                {risks.slice(0, 4).map((risk) => (
                  <div key={risk.id} className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <RiskBadge level={risk.riskLevel} />
                      <span className="text-gray-500">{risk.country}</span>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{risk.title}</p>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 重点机会 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                今日重点机会
              </h3>
              <div className="space-y-3">
                {opportunities.slice(0, 4).map((opp) => (
                  <div key={opp.id} className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <DimensionTag dimension={opp.dimension} />
                      <span className="text-gray-500">{opp.country}</span>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{opp.title}</p>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
