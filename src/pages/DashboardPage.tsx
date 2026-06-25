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
import { FileText, Target, AlertTriangle, FileCheck, ClipboardCheck, TrendingUp, Globe2 } from 'lucide-react'
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
      <section className="page-panel mb-5 rounded-lg p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs text-brand-800">
              <Globe2 className="h-3.5 w-3.5" />
              Intelligence Overview
            </div>
            <h1 className="max-w-3xl text-3xl font-medium leading-tight text-foreground">
              全球营商环境智能分析平台
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              汇聚来源、筛选证据、生成国别报告并进入专家复核，让业务团队在同一张工作台上观察风险和机会。
            </p>
          </div>
          <div className="rounded-lg border border-border bg-ivory/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="section-eyebrow">Report Progress</span>
              <span className="text-xs text-muted-foreground">Mock data</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-brand-100">
                <div className="absolute inset-[-10px] rounded-full border-[10px] border-l-brand-700 border-t-brand-700 border-r-brand-300 border-b-brand-200" />
                <span className="relative text-3xl font-medium text-foreground">{overview.generatedReportCount}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">待专家审核</span>
                  <span className="font-medium text-foreground">{overview.pendingReviewCount}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">高风险预警</span>
                  <span className="font-medium text-accent-amber-600">{overview.highRiskAlertCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">高相关资料</span>
                  <span className="font-medium text-foreground">{overview.highRelevanceCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI 指标卡 */}
      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* 左侧：国家卡片 */}
        <div className="lg:col-span-3">
          <h2 className="section-eyebrow mb-3">
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
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <AlertTriangle className="h-4 w-4 text-accent-amber-600" />
                今日重点风险
              </h3>
              <div className="space-y-3">
                {risks.slice(0, 4).map((risk) => (
                  <div key={risk.id} className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <RiskBadge level={risk.riskLevel} />
                      <span className="text-muted-foreground">{risk.country}</span>
                    </div>
                    <p className="line-clamp-2 text-foreground">{risk.title}</p>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 重点机会 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingUp className="h-4 w-4 text-brand-700" />
                今日重点机会
              </h3>
              <div className="space-y-3">
                {opportunities.slice(0, 4).map((opp) => (
                  <div key={opp.id} className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <DimensionTag dimension={opp.dimension} />
                      <span className="text-muted-foreground">{opp.country}</span>
                    </div>
                    <p className="line-clamp-2 text-foreground">{opp.title}</p>
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
