import type { AnalysisReport } from '@/types'
import { mockReviewRecords } from './reports'

export const sixDimensionMockReports: AnalysisReport[] = [
  {
    id: 'report-br-2025-q2',
    country: '巴西',
    title: '巴西营商环境六维监测报告（Mock）',
    period: '2025年Q2',
    status: 'in_review',
    generatedAt: '2025-06-15T08:00:00Z',
    sourceDocumentIds: [
      'src-br-001',
      'src-br-002',
      'src-br-003',
      'src-br-004',
      'src-br-005',
      'src-br-006',
      'src-br-007',
      'src-br-008',
      'src-br-009',
      'src-br-010',
      'src-br-011',
    ],
    openQuestions: [
      '巴西税制改革过渡期各阶段对外资企业的具体税负影响仍需进一步量化。',
      '2026年大选后产业政策和税改节奏是否延续，需要持续跟踪候选人经济政策。',
      '新能源和基础设施项目中的本地化要求需要补充州级执行口径。',
    ],
    reviewRecords: mockReviewRecords.filter((r) => r.reportId === 'report-br-2025-q2'),
    sections: [
      {
        id: 'sec-br-summary',
        title: '摘要与总体判断',
        content:
          '2025年Q2巴西营商环境呈现“融资成本高、政策机会明确、合规复杂度仍高”的特征。高利率和财政压力影响企业投资节奏[证:ev-br-001][证:ev-br-002][证:ev-br-003]，但再工业化、新能源、基础设施和数字经济仍提供结构性机会[证:ev-br-004][证:ev-br-011][证:ev-br-016][证:ev-br-019]。企业应以分阶段进入、本地团队建设和税务合规前置为主线。',
        riskLevel: 'high',
        evidenceIds: ['ev-br-001', 'ev-br-002', 'ev-br-003', 'ev-br-004', 'ev-br-011', 'ev-br-016', 'ev-br-019'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-br-politics',
        title: '政治举措及地缘环境',
        content:
          '2026年总统大选是巴西未来营商环境的主要不确定性。现任政府支持率下降和反对派上升可能影响税改推进、国企私有化和外资政策连续性[证:ev-br-013]。企业应在重大资本开支前设置选举情景 review gate，并准备政策延续与政策转向两套预案[证:ev-br-014]。',
        riskLevel: 'high',
        evidenceIds: ['ev-br-013', 'ev-br-014', 'ev-br-024'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-br-finance',
        title: '金融投资环境',
        content:
          '巴西金融投资环境短期受高利率压制。央行 Focus 报告显示 GDP 增长预期下调，Selic 基准利率预计维持高位，融资成本将持续抑制企业投资意愿[证:ev-br-001][证:ev-br-002]。财政赤字压力也限制公共投资空间[证:ev-br-003]。进入巴西的企业应优先使用母公司信贷、国际金融机构贷款或项目融资，降低本地高息借贷依赖。',
        riskLevel: 'high',
        evidenceIds: ['ev-br-001', 'ev-br-002', 'ev-br-003'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-br-industry',
        title: '产业政策及市场环境',
        content:
          '巴西产业机会集中在高附加值制造、新能源、基础设施和数字经济。新工业计划支持半导体、新能源装备和生物制药等行业[证:ev-br-004][证:ev-br-022]；新能源装机增长和输电线路拍卖形成中长期机会[证:ev-br-011][证:ev-br-012]；基础设施特许权拍卖带来公路铁路项目窗口[证:ev-br-016]。贸易侧仍需关注较高关税和本地化生产替代方案[证:ev-br-008]。',
        riskLevel: 'medium',
        evidenceIds: ['ev-br-004', 'ev-br-008', 'ev-br-011', 'ev-br-012', 'ev-br-016', 'ev-br-019', 'ev-br-022'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-br-compliance',
        title: '合规与法治环境',
        content:
          '巴西合规成本仍是外资企业的核心挑战。税制改革方向明确，但十年过渡期意味着企业需同时应对新旧税制和供应链定价调整[证:ev-br-006][证:ev-br-021]。金融科技监管提高资本充足率和反洗钱要求[证:ev-br-015]，基础设施和产业政策也伴随本地用工、本地采购或本地设厂要求[证:ev-br-005][证:ev-br-017]。',
        riskLevel: 'high',
        evidenceIds: ['ev-br-005', 'ev-br-006', 'ev-br-015', 'ev-br-017', 'ev-br-021', 'ev-br-025'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-br-innovation',
        title: '新质生产力与科创环境',
        content:
          '巴西数字经济规模和政策目标显示科创环境具备增长基础。数字经济已成为增长较快领域，电商、金融科技和云计算是重点方向[证:ev-br-019]。再工业化计划也将半导体和新能源装备列为优先支持赛道[证:ev-br-022]。但金融科技企业需同步评估监管趋严带来的资本和合规成本[证:ev-br-015]。',
        riskLevel: 'medium',
        evidenceIds: ['ev-br-015', 'ev-br-019', 'ev-br-022'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-br-social',
        title: '社会人文环境',
        content:
          '巴西劳动力市场改善但结构性问题仍在。失业率下降显示就业环境回暖，但非正规就业占比仍高，劳动法、社保缴费和工会谈判会增加用工管理复杂度[证:ev-br-010]。企业应在进入早期建立本地 HR、税务和劳动法顾问机制。',
        riskLevel: 'medium',
        evidenceIds: ['ev-br-010'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-br-recommendation',
        title: '企业行动建议',
        content:
          '建议企业采用“小规模试点、验证、逐步扩大”的路径；优先评估新能源、基础设施和数字经济等政策支持行业；在公司注册前完成税务、劳动和金融合规清单；针对 2026 年大选设置投资决策复核节点。对制造和工程企业，应把本地化率、本地用工和供应链布局作为项目成本模型的核心变量[证:ev-br-005][证:ev-br-014][证:ev-br-021][证:ev-br-025]。',
        riskLevel: 'medium',
        evidenceIds: ['ev-br-005', 'ev-br-014', 'ev-br-021', 'ev-br-025'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
    ],
  },
  {
    id: 'report-ae-2025-q2',
    country: '阿联酋',
    title: '阿联酋营商环境六维监测报告（Mock）',
    period: '2025年Q2',
    status: 'approved',
    generatedAt: '2025-06-14T08:00:00Z',
    sourceDocumentIds: [
      'src-ae-001',
      'src-ae-002',
      'src-ae-003',
      'src-ae-004',
      'src-ae-005',
      'src-ae-006',
      'src-ae-007',
      'src-ae-008',
    ],
    openQuestions: [
      '迪拜和阿布扎比在金融科技、AI 与生命科学激励政策上的差异需要进一步拆分。',
      '自由区与非自由区公司税适用边界需要结合具体业务模式复核。',
    ],
    reviewRecords: mockReviewRecords.filter((r) => r.reportId === 'report-ae-2025-q2'),
    sections: [
      {
        id: 'sec-ae-summary',
        title: '摘要与总体判断',
        content:
          '阿联酋营商环境整体开放度和可预期性较强。100% 外资持股适用行业扩展，非石油经济增长、银行体系稳健和 AI 投资构成主要机会[证:ev-ae-001][证:ev-ae-003][证:ev-ae-004][证:ev-ae-005]。主要风险来自公司税、转让定价和自由区合规边界[证:ev-ae-008][证:ev-ae-009]。',
        riskLevel: 'low',
        evidenceIds: ['ev-ae-001', 'ev-ae-003', 'ev-ae-004', 'ev-ae-005', 'ev-ae-008', 'ev-ae-009'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-ae-politics',
        title: '政治举措及地缘环境',
        content:
          '阿联酋政策连续性较强，政府持续通过外资持股放开、AI 计划和清洁能源项目提升区域商业枢纽地位[证:ev-ae-001][证:ev-ae-005][证:ev-ae-010]。对企业而言，主要任务不是规避政策波动，而是识别联邦、酋长国和自由区不同层级政策之间的适配关系。',
        riskLevel: 'low',
        evidenceIds: ['ev-ae-001', 'ev-ae-005', 'ev-ae-010'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-ae-finance',
        title: '金融投资环境',
        content:
          '阿联酋金融投资环境稳健。非石油 GDP 预计增长，银行系统资产扩张且不良贷款率保持低位[证:ev-ae-003][证:ev-ae-004]。DIFC 新增企业数量和金融科技占比提升，说明金融和金融科技生态仍具吸引力[证:ev-ae-007]。企业可把阿联酋作为中东区域融资、结算和区域总部节点。',
        riskLevel: 'low',
        evidenceIds: ['ev-ae-003', 'ev-ae-004', 'ev-ae-007'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-ae-industry',
        title: '产业政策及市场环境',
        content:
          '阿联酋市场机会集中在 AI、金融科技、清洁能源、跨境电商、新能源设备和电动汽车等领域[证:ev-ae-005][证:ev-ae-010][证:ev-ae-011]。100% 外资持股行业扩展和创新激励方案降低了部分行业进入门槛[证:ev-ae-001][证:ev-ae-012]。',
        riskLevel: 'low',
        evidenceIds: ['ev-ae-001', 'ev-ae-005', 'ev-ae-010', 'ev-ae-011', 'ev-ae-012'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-ae-compliance',
        title: '合规与法治环境',
        content:
          '阿联酋公司税政策总体平稳，但自由区企业、集团内部交易、研发优惠和转让定价文档仍需精细管理[证:ev-ae-008][证:ev-ae-009]。建议企业在落地前按自由区、非自由区和跨境交易三类场景完成税务结构设计。',
        riskLevel: 'medium',
        evidenceIds: ['ev-ae-008', 'ev-ae-009'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-ae-innovation',
        title: '新质生产力与科创环境',
        content:
          '阿联酋科创环境表现突出。国家 AI 计划追加投入，重点支持生成式 AI 在政府服务、医疗诊断和金融风控中的应用，并计划培养 AI 工程师、提供办公空间和云计算补贴[证:ev-ae-005][证:ev-ae-006]。ADIO 激励方案覆盖创新、金融科技、农业科技和生命科学[证:ev-ae-013]。',
        riskLevel: 'low',
        evidenceIds: ['ev-ae-005', 'ev-ae-006', 'ev-ae-013'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-ae-social',
        title: '社会人文环境',
        content:
          '阿联酋社会人文环境对国际企业较友好，人才、国际化服务和区域总部功能成熟。本批 mock 资料对教育、劳动力和文化因素覆盖不足，后续真实数据流应补充人力资源、签证、教育和人才政策来源。',
        riskLevel: 'low',
        evidenceIds: [],
        confidence: 'low',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-ae-recommendation',
        title: '企业行动建议',
        content:
          '建议企业将阿联酋定位为区域总部、融资结算和创新试点节点。AI、金融科技、清洁能源和生命科学企业应优先对接 ADIO、DIFC 等平台，落地前完成公司税、转让定价和自由区资格判断[证:ev-ae-007][证:ev-ae-009][证:ev-ae-013]。',
        riskLevel: 'low',
        evidenceIds: ['ev-ae-007', 'ev-ae-009', 'ev-ae-013'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
    ],
  },
]
