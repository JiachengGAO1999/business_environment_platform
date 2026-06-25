import type { ReviewRecord } from '@/types'

export const mockReviewRecords: ReviewRecord[] = [
  {
    id: 'rev-br-001',
    reportId: 'report-br-2025-q2',
    sectionId: 'sec-br-finance',
    reviewer: '张明（区域经济研究专家）',
    timestamp: '2025-06-18T10:30:00Z',
    action: 'approved',
    comment: '金融投资环境章节对高利率和融资成本的判断清晰，建议后续补充更多央行原始数据。',
  },
  {
    id: 'rev-br-002',
    reportId: 'report-br-2025-q2',
    sectionId: 'sec-br-industry',
    reviewer: '李华（国际贸易与投资分析师）',
    timestamp: '2025-06-18T14:00:00Z',
    action: 'needs_revision',
    comment: '产业政策及市场环境章节覆盖新能源和基础设施，但贸易壁垒部分还需要更多来源交叉验证。',
  },
  {
    id: 'rev-br-003',
    reportId: 'report-br-2025-q2',
    sectionId: 'sec-br-compliance',
    reviewer: '王芳（跨境合规与风险管理专家）',
    timestamp: '2025-06-19T09:00:00Z',
    action: 'unsupported',
    comment: '税制复杂度判断方向正确，但量化成本仍需补充权威证据。',
  },
  {
    id: 'rev-br-004',
    reportId: 'report-br-2025-q2',
    sectionId: null,
    reviewer: '张明（区域经济研究专家）',
    timestamp: '2025-06-19T11:30:00Z',
    action: 'needs_revision',
    comment: '六维结构清晰，建议补充社会人文环境和州级执行差异后再发布。',
  },
  {
    id: 'rev-ae-001',
    reportId: 'report-ae-2025-q2',
    sectionId: 'sec-ae-innovation',
    reviewer: '张明（区域经济研究专家）',
    timestamp: '2025-06-16T10:00:00Z',
    action: 'approved',
    comment: '科创环境章节对 AI、金融科技和创新激励的抓取准确，适合进入下一版真实数据替换。',
  },
]
