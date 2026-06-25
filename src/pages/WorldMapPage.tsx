import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '@/components/layout/PageShell'
import RiskBadge from '@/components/common/RiskBadge'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingState from '@/components/common/LoadingState'
import ErrorState from '@/components/common/ErrorState'
import { getCountries, getDashboardOverview, getTodayOpportunities, getTodayRisks } from '@/services/dashboardService'
import type { CountryProfile, DashboardOverview, OpportunityItem, RiskItem } from '@/types'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, Database, FileCheck, Globe2, Radar, ScanSearch, ShieldAlert, Sparkles } from 'lucide-react'
import RealWorldMap from '@/components/common/WorldMap'

// Equirectangular projection: x% = 50 + lon * 100/360, y% = 50 - lat * (W/H) * 100/360
function lonLatToPercent(lon: number, lat: number, w = 1000, h = 520): { x: number; y: number } {
  return {
    x: 50 + lon * (100 / 360),
    y: 50 - lat * (w / h) * (100 / 360),
  }
}

const MAP_POINTS: Record<string, { x: number; y: number; label: string }> = {
  巴西: { ...lonLatToPercent(-46.6, -23.5), label: 'Sao Paulo / Brasilia' },
  沙特阿拉伯: { ...lonLatToPercent(46.7, 24.6), label: 'Riyadh' },
  阿联酋: { ...lonLatToPercent(55.3, 25.2), label: 'Dubai / Abu Dhabi' },
}

const riskWeight = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
}

export default function WorldMapPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [countries, setCountries] = useState<CountryProfile[]>([])
  const [risks, setRisks] = useState<RiskItem[]>([])
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([])
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [overviewData, countryData, riskData, opportunityData] = await Promise.all([
        getDashboardOverview(),
        getCountries(),
        getTodayRisks(),
        getTodayOpportunities(),
      ])
      setOverview(overviewData)
      setCountries(countryData)
      setRisks(riskData)
      setOpportunities(opportunityData)
      setActiveCountryId(countryData[0]?.id ?? null)
    } catch {
      setError('全球态势数据加载失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const activeCountry = useMemo(
    () => countries.find((country) => country.id === activeCountryId) ?? countries[0],
    [activeCountryId, countries]
  )

  const globalRiskScore = useMemo(() => {
    if (countries.length === 0) return 0
    const total = countries.reduce((sum, country) => sum + riskWeight[country.riskLevel], 0)
    return Math.round((total / (countries.length * 4)) * 100)
  }, [countries])

  if (loading) return <PageShell><LoadingState message="正在加载全球态势..." /></PageShell>
  if (error) return <PageShell><ErrorState message={error} onRetry={fetchData} /></PageShell>

  return (
    <PageShell>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="page-panel overflow-hidden rounded-lg">
          <div className="flex flex-col gap-4 border-b border-border/80 px-5 py-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs text-brand-800">
                <Globe2 className="h-3.5 w-3.5" />
                Global Situation Room
              </div>
              <h1 className="max-w-3xl text-3xl font-medium leading-tight text-foreground md:text-4xl">
                全球营商环境态势大屏
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                聚合国家风险、机会窗口、资料流入和报告进度，为后续真实来源接入预留全球视图。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 md:min-w-[360px]">
              <SignalCard label="资料流入" value={overview?.todaySourceCount ?? 0} icon={Database} />
              <SignalCard label="风险指数" value={globalRiskScore} icon={ShieldAlert} />
              <SignalCard label="待审核" value={overview?.pendingReviewCount ?? 0} icon={FileCheck} />
            </div>
          </div>

          <div className="relative min-h-[520px] px-4 py-6 md:px-8">
            <RealWorldMap width={1000} height={520} className="absolute inset-0 text-brand-800" />

            {countries.map((country) => {
              const point = MAP_POINTS[country.name]
              if (!point) return null
              const isActive = activeCountry?.id === country.id

              return (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => setActiveCountryId(country.id)}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  aria-label={`查看${country.name}`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full border-2 border-ivory shadow-[0_0_0_6px_rgba(89,112,91,0.14)] ${
                      isActive ? 'bg-accent-amber-500' : 'bg-brand-700'
                    }`}
                  />
                  <span
                    className={`mt-2 block min-w-28 rounded-md border bg-ivory/90 px-3 py-2 text-xs shadow-[0_10px_24px_rgba(47,61,51,0.10)] backdrop-blur ${
                      isActive ? 'border-brand-400 text-foreground' : 'border-border text-muted-foreground'
                    }`}
                  >
                    <span className="block font-medium text-foreground">{country.name}</span>
                    <span className="mt-0.5 block">{point.label}</span>
                  </span>
                </button>
              )
            })}

            <div className="absolute bottom-6 left-6 right-6 grid gap-3 md:grid-cols-3">
              <MetricStrip icon={Radar} label="监测国家" value={`${countries.length} 个`} />
              <MetricStrip icon={ScanSearch} label="高相关资料" value={`${overview?.highRelevanceCount ?? 0} 条`} />
              <MetricStrip icon={Sparkles} label="机会线索" value={`${opportunities.length} 条`} />
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="page-panel rounded-lg p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="section-eyebrow">Focus Country</p>
                <h2 className="mt-1 text-xl font-medium text-foreground">{activeCountry?.name ?? '暂无国家'}</h2>
              </div>
              {activeCountry && <StatusBadge status={activeCountry.reportStatus} />}
            </div>

            {activeCountry && (
              <>
                <div className="mb-4 flex items-center gap-2">
                  <RiskBadge level={activeCountry.riskLevel} />
                  <span className="rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-xs text-brand-800">
                    机会{activeCountry.opportunityLevel === 'high' ? '高' : activeCountry.opportunityLevel === 'medium' ? '中' : '低'}
                  </span>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{activeCountry.latestSummary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeCountry.keyIndustries.slice(0, 5).map((industry) => (
                    <span key={industry} className="rounded border border-border bg-secondary/60 px-2 py-1 text-xs text-muted-foreground">
                      {industry}
                    </span>
                  ))}
                </div>
                {activeCountry.reportId && (
                  <button
                    type="button"
                    onClick={() => navigate(`/reports/${activeCountry.reportId}`)}
                    className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-brand-800 px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-900"
                  >
                    打开国别报告
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          </section>

          <section className="page-panel rounded-lg p-5">
            <p className="section-eyebrow">Today Signals</p>
            <h2 className="mt-1 text-lg font-medium text-foreground">风险与机会</h2>
            <div className="mt-4 space-y-4">
              {risks.slice(0, 3).map((risk) => (
                <div key={risk.id} className="border-l-2 border-accent-amber-400 pl-3">
                  <div className="mb-1 flex items-center gap-2">
                    <RiskBadge level={risk.riskLevel} />
                    <span className="text-xs text-muted-foreground">{risk.country}</span>
                  </div>
                  <p className="text-sm leading-6 text-foreground">{risk.title}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  )
}

function SignalCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-border bg-ivory/75 px-3 py-3">
      <div className="mb-2 flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <Icon className="h-3.5 w-3.5 text-brand-600" />
      </div>
      <div className="text-2xl font-medium leading-none text-foreground">{value}</div>
    </div>
  )
}

function MetricStrip({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-ivory/88 px-4 py-3 shadow-[0_10px_26px_rgba(47,61,51,0.06)] backdrop-blur">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-100 text-brand-800">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

