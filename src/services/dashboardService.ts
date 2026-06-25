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
        s.dimensions.includes('political_geopolitical_risk') ||
        s.dimensions.includes('political_geopolitical_environment') ||
        s.dimensions.includes('compliance_rule_of_law_environment'))
  )

  return riskSources.slice(0, 6).map((s) => ({
    id: `risk-${s.id}`,
    title: s.title,
    riskLevel: s.relevanceLevel === 'high' ? 'high' : s.relevanceLevel === 'medium' ? 'medium' : 'low',
    country: s.country,
    dimension:
      s.dimensions.find((d) =>
        d === 'business_risk' ||
        d === 'political_geopolitical_risk' ||
        d === 'political_geopolitical_environment' ||
        d === 'compliance_rule_of_law_environment'
      ) ?? 'business_risk',
    description: s.summary.slice(0, 100) + '...',
  }))
}

export async function getTodayOpportunities(): Promise<OpportunityItem[]> {
  await new Promise((r) => setTimeout(r, 100))

  const oppSources = mockSources.filter(
    (s) =>
      s.relevanceLevel !== 'noise' &&
      (s.dimensions.includes('market_opportunity') ||
        s.dimensions.includes('corporate_recommendation') ||
        s.dimensions.includes('financial_investment_environment') ||
        s.dimensions.includes('industrial_market_environment') ||
        s.dimensions.includes('innovation_technology_environment') ||
        s.dimensions.includes('social_cultural_environment'))
  )

  return oppSources.slice(0, 6).map((s) => ({
    id: `opp-${s.id}`,
    title: s.title,
    country: s.country,
    dimension:
      s.dimensions.find((d) =>
        d === 'market_opportunity' ||
        d === 'corporate_recommendation' ||
        d === 'financial_investment_environment' ||
        d === 'industrial_market_environment' ||
        d === 'innovation_technology_environment' ||
        d === 'social_cultural_environment'
      ) ?? 'market_opportunity',
    description: s.summary.slice(0, 100) + '...',
  }))
}
