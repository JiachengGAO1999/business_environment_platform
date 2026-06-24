import type { CountryProfile } from '@/types'

export const mockCountries: CountryProfile[] = [
  {
    id: 'country-br',
    name: '巴西',
    region: '拉丁美洲',
    riskLevel: 'high',
    opportunityLevel: 'high',
    keyIndustries: ['农业', '能源与矿业', '制造业', '数字经济', '新能源'],
    latestSummary:
      '2025年Q2巴西经济面临通胀压力和财政整顿双重挑战。央行维持高利率以抑制通胀，政府推进税制改革和再工业化计划。新能源、农业科技和数字经济领域出现结构性机会，但税制复杂度和融资成本仍是外资主要障碍。',
    reportStatus: 'in_review',
    reportId: 'report-br-2025-q2',
  },
  {
    id: 'country-sa',
    name: '沙特阿拉伯',
    region: '中东',
    riskLevel: 'medium',
    opportunityLevel: 'high',
    keyIndustries: ['能源转型', '基建与房地产', '数字科技', '旅游娱乐', '金融服务'],
    latestSummary:
      '沙特Vision 2030进入冲刺阶段，NEOM、红海旅游等巨型项目持续推进。外资政策持续开放，设立区域总部的外企可享政府采购和税收优惠。地缘政治风险和油价波动仍是主要不确定因素，但市场开放和基建投资带来明确机会窗口。',
    reportStatus: 'draft',
    reportId: 'report-sa-2025-q2',
  },
  {
    id: 'country-ae',
    name: '阿联酋',
    region: '中东',
    riskLevel: 'low',
    opportunityLevel: 'high',
    keyIndustries: ['金融科技', '物流与贸易', '数字经济', '清洁能源', '医疗健康'],
    latestSummary:
      '阿联酋继续保持区域商业枢纽地位，外资法和税务政策持续优化。数字经济战略和清洁能源投资加速。迪拜和阿布扎比在金融科技、AI和Web3领域的政策创新吸引大量国际企业和人才流入。',
    reportStatus: 'draft',
    reportId: 'report-ae-2025-q2',
  },
]
