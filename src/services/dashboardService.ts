import type { DashboardOverview, RiskItem, OpportunityItem, CountryProfile } from '@/types'
import {
  getTodaySourceCount,
  getHighRelevanceCount,
  getHighRiskAlertCount,
  getGeneratedReportCount,
  getPendingReviewCount,
  mockSources,
  mockCountries,
} from '@/data/mock'

export async function getDashboardOverview(): Promise<DashboardOverview> {
  // 模拟微小的异步延迟
  await new Promise((r) => setTimeout(r, 100))

  return {
    todaySourceCount: getTodaySourceCount(),
    highRelevanceCount: getHighRelevanceCount(),
    highRiskAlertCount: getHighRiskAlertCount(),
    generatedReportCount: getGeneratedReportCount(),
    pendingReviewCount: getPendingReviewCount(),
  }
}

export async function getCountries(): Promise<CountryProfile[]> {
  await new Promise((r) => setTimeout(r, 50))
  return mockCountries
}

export async function getTodayRisks(): Promise<RiskItem[]> {
  await new Promise((r) => setTimeout(r, 100))

  const riskSources = mockSources.filter(
    (s) =>
      s.relevanceLevel !== 'noise' &&
      (s.dimensions.includes('business_risk') ||
        s.dimensions.includes('political_geopolitical_risk'))
  )

  return riskSources.slice(0, 6).map((s) => ({
    id: `risk-${s.id}`,
    title: s.title,
    riskLevel: s.relevanceLevel === 'high' ? 'high' : s.relevanceLevel === 'medium' ? 'medium' : 'low',
    country: s.country,
    dimension: s.dimensions.find((d) => d === 'business_risk' || d === 'political_geopolitical_risk') ?? 'business_risk',
    description: s.summary.slice(0, 100) + '...',
  }))
}

export async function getTodayOpportunities(): Promise<OpportunityItem[]> {
  await new Promise((r) => setTimeout(r, 100))

  const oppSources = mockSources.filter(
    (s) =>
      s.relevanceLevel !== 'noise' &&
      (s.dimensions.includes('market_opportunity') ||
        s.dimensions.includes('corporate_recommendation'))
  )

  return oppSources.slice(0, 6).map((s) => ({
    id: `opp-${s.id}`,
    title: s.title,
    country: s.country,
    dimension: s.dimensions.find((d) => d === 'market_opportunity' || d === 'corporate_recommendation') ?? 'market_opportunity',
    description: s.summary.slice(0, 100) + '...',
  }))
}
