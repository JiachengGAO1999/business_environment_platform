import type { EvidenceSnippet } from '@/types'

export const mockEvidence: EvidenceSnippet[] = [
  // ===== 巴西证据 (25条) =====
  // src-br-001: 央行Focus报告
  { id: 'ev-br-001', documentId: 'src-br-001', text: '2025年GDP增长预期从2.1%下调至1.8%，反映市场对经济放缓的共识增强。', factType: 'macro', confidence: 'high', usedInReportSections: ['sec-macro'] },
  { id: 'ev-br-002', documentId: 'src-br-001', text: 'Selic基准利率预计在年内维持在14.25%高位，融资成本将持续压制企业投资意愿。', factType: 'risk', confidence: 'high', usedInReportSections: ['sec-macro', 'sec-risk'] },
  { id: 'ev-br-003', documentId: 'src-br-001', text: '财政赤字预期占GDP的6.8%，财政整顿压力将在中期限制公共投资空间。', factType: 'macro', confidence: 'high', usedInReportSections: ['sec-macro', 'sec-risk'] },

  // src-br-002: 新工业计划
  { id: 'ev-br-004', documentId: 'src-br-002', text: '新工业计划承诺通过税收减免、低息贷款和政府采购偏好支持半导体、新能源装备和生物制药等高附加值制造业，总规模约600亿雷亚尔。', factType: 'policy', confidence: 'high', usedInReportSections: ['sec-policy'] },
  { id: 'ev-br-005', documentId: 'src-br-002', text: '外资企业可参与但需满足本地化率要求，这对供应链布局和成本结构有直接影响。', factType: 'risk', confidence: 'medium', usedInReportSections: ['sec-policy', 'sec-recommendation'] },

  // src-br-003: 税制改革
  { id: 'ev-br-006', documentId: 'src-br-003', text: 'PEC 110/2025计划将联邦、州、市三级间接税统一为增值税体系，过渡期从2026年起预计10年完成。', factType: 'policy', confidence: 'high', usedInReportSections: ['sec-policy', 'sec-risk'] },
  { id: 'ev-br-007', documentId: 'src-br-003', text: '改革将显著降低合规成本，但短期内可能出现税负结构变化，企业需评估过渡期影响。', factType: 'risk', confidence: 'medium', usedInReportSections: ['sec-risk', 'sec-recommendation'] },

  // src-br-004: WTO贸易政策审议
  { id: 'ev-br-008', documentId: 'src-br-004', text: '巴西平均关税水平高于新兴市场平均水平，尤其在汽车、化工和信息技术产品领域。', factType: 'trade', confidence: 'high', usedInReportSections: ['sec-trade'] },
  { id: 'ev-br-009', documentId: 'src-br-004', text: '巴西参与南方共同市场对外自贸谈判取得进展，有望扩大对亚洲和欧洲市场准入。', factType: 'trade', confidence: 'medium', usedInReportSections: ['sec-trade', 'sec-opportunity'] },

  // src-br-005: 劳动力市场
  { id: 'ev-br-010', documentId: 'src-br-005', text: '2025年Q2失业率降至8.1%为2015年以来最低，但非正规就业占比仍高达38.5%。', factType: 'macro', confidence: 'high', usedInReportSections: ['sec-macro', 'sec-risk'] },

  // src-br-006: 新能源
  { id: 'ev-br-011', documentId: 'src-br-006', text: '到2030年太阳能和风能装机容量将分别增长180%和120%，东北部地区风光资源丰富。', factType: 'opportunity', confidence: 'high', usedInReportSections: ['sec-opportunity'] },
  { id: 'ev-br-012', documentId: 'src-br-006', text: '外资在新能源领域享有与本地企业同等待遇，政府将拍卖新的输电线路和新能源基地。', factType: 'opportunity', confidence: 'medium', usedInReportSections: ['sec-opportunity', 'sec-recommendation'] },

  // src-br-007: 选举前瞻
  { id: 'ev-br-013', documentId: 'src-br-007', text: '现任政府支持率下降至38%，反对派候选人在主要城市支持率上升，大选结果将直接影响外资政策连续性。', factType: 'risk', confidence: 'medium', usedInReportSections: ['sec-politics'] },
  { id: 'ev-br-014', documentId: 'src-br-007', text: '建议企业提前准备选举年情景预案，评估不同选举结果对税改、私有化和行业监管的影响。', factType: 'recommendation', confidence: 'medium', usedInReportSections: ['sec-politics', 'sec-recommendation'] },

  // src-br-008: 金融科技监管
  { id: 'ev-br-015', documentId: 'src-br-008', text: '大型数字银行和支付机构需提高最低资本充足率至12%，并加强反洗钱合规，对中资金融科技企业构成合规成本挑战。', factType: 'risk', confidence: 'high', usedInReportSections: ['sec-risk', 'sec-policy'] },

  // src-br-009: 基础设施
  { id: 'ev-br-016', documentId: 'src-br-009', text: '2025年下半年将拍卖7条联邦公路和3条铁路特许权，总投资额约450亿雷亚尔。', factType: 'opportunity', confidence: 'high', usedInReportSections: ['sec-opportunity'] },
  { id: 'ev-br-017', documentId: 'src-br-009', text: '外资企业可独立或联合体形式竞标，中标企业需在项目地设立法人实体并满足本地用工比例要求。', factType: 'risk', confidence: 'medium', usedInReportSections: ['sec-opportunity', 'sec-risk'] },

  // src-br-010: 农产品出口
  { id: 'ev-br-018', documentId: 'src-br-010', text: '5月大豆出口量同比增加15%，牛肉出口增加12%，但欧盟新反毁林法规可能影响未来出口。', factType: 'trade', confidence: 'high', usedInReportSections: ['sec-trade'] },

  // src-br-011: 数字经济
  { id: 'ev-br-019', documentId: 'src-br-011', text: '2024年巴西数字经济规模达2400亿美元占GDP的11.8%，目标2030年提升至18%。电商、金融科技和云计算增长最快。', factType: 'opportunity', confidence: 'medium', usedInReportSections: ['sec-opportunity'] },

  // 巴西额外证据（关联多个报告章节）
  { id: 'ev-br-020', documentId: 'src-br-001', text: '通胀预期维持在4.5%附近，高于央行3%目标中值，降息空间有限。', factType: 'macro', confidence: 'high', usedInReportSections: ['sec-macro'] },
  { id: 'ev-br-021', documentId: 'src-br-003', text: '税改过渡期10年，企业需制定分阶段合规策略，前3年重点关注增值税统一对供应链定价的影响。', factType: 'recommendation', confidence: 'medium', usedInReportSections: ['sec-recommendation'] },
  { id: 'ev-br-022', documentId: 'src-br-002', text: '半导体、新能源装备和生物制药被列为优先支持行业，相关外资企业应积极对接政府补贴和采购通道。', factType: 'recommendation', confidence: 'medium', usedInReportSections: ['sec-recommendation'] },
  { id: 'ev-br-023', documentId: 'src-br-004', text: '在信息技术产品领域，巴西进口关税显著高于WTO发展中成员平均水平。', factType: 'trade', confidence: 'high', usedInReportSections: ['sec-trade'] },
  { id: 'ev-br-024', documentId: 'src-br-007', text: '2026年大选是巴西近十年来政策不确定性最高的选举周期之一，外资企业应谨慎评估大额投资的时机选择。', factType: 'risk', confidence: 'medium', usedInReportSections: ['sec-politics'] },
  { id: 'ev-br-025', documentId: 'src-br-009', text: '中标企业本地用工比例要求对外资企业的人力资源策略和项目成本有实质性影响，需提前规划。', factType: 'risk', confidence: 'medium', usedInReportSections: ['sec-risk', 'sec-recommendation'] },

  // ===== 沙特证据 (15条) =====
  { id: 'ev-sa-001', documentId: 'src-sa-001', text: '非石油GDP占比从2016年的40%提升至2024年的52%，经济多元化取得实质性进展。', factType: 'macro', confidence: 'high', usedInReportSections: ['sec-macro'] },
  { id: 'ev-sa-002', documentId: 'src-sa-001', text: 'FDI流入在2024年达到280亿美元创历史新高，NEOM项目建设按计划推进。', factType: 'macro', confidence: 'high', usedInReportSections: ['sec-macro', 'sec-opportunity'] },
  { id: 'ev-sa-003', documentId: 'src-sa-001', text: 'Vision 2030进入冲刺阶段，多个巨型项目将在2026-2028年集中交付和运营。', factType: 'opportunity', confidence: 'medium', usedInReportSections: ['sec-opportunity'] },
  { id: 'ev-sa-004', documentId: 'src-sa-002', text: '已有超过200家跨国公司在利雅得设立区域总部，RHQ企业可享政府采购优先权、公司所得税减免和签证便利。', factType: 'policy', confidence: 'high', usedInReportSections: ['sec-policy', 'sec-recommendation'] },
  { id: 'ev-sa-005', documentId: 'src-sa-002', text: '2025年新增RHQ企业包括多家科技和金融机构，表明沙特作为区域商业中心的吸引力持续增强。', factType: 'opportunity', confidence: 'medium', usedInReportSections: ['sec-opportunity'] },
  { id: 'ev-sa-006', documentId: 'src-sa-003', text: '自2025年7月起外资企业在多数行业可持100%股权无需本地合伙人，审批时间从30天缩短至5个工作日。', factType: 'policy', confidence: 'high', usedInReportSections: ['sec-policy'] },
  { id: 'ev-sa-007', documentId: 'src-sa-003', text: '金融服务、能源上游和部分敏感行业仍保留外资限制，进入前需确认行业准入条件。', factType: 'risk', confidence: 'medium', usedInReportSections: ['sec-risk'] },
  { id: 'ev-sa-008', documentId: 'src-sa-004', text: '2025-2026年度NEOM将发布超过200亿美元的工程和供应合同，涉及建筑、可再生能源、数字化和交通领域。', factType: 'opportunity', confidence: 'medium', usedInReportSections: ['sec-opportunity'] },
  { id: 'ev-sa-009', documentId: 'src-sa-005', text: '回购利率维持5.75%，5月CPI通胀率稳定在2.1%，银行系统流动性充裕。', factType: 'macro', confidence: 'high', usedInReportSections: ['sec-macro'] },
  { id: 'ev-sa-010', documentId: 'src-sa-005', text: '非石油私营部门PMI连续第22个月处于扩张区间，企业信心保持在较高水平。', factType: 'macro', confidence: 'high', usedInReportSections: ['sec-macro', 'sec-opportunity'] },
  { id: 'ev-sa-011', documentId: 'src-sa-006', text: '阿美IKTVA计划2025年新增50亿美元本地采购，重点覆盖钻井设备、管材、数字服务和环保技术。外企可通过设厂或合资参与。', factType: 'opportunity', confidence: 'medium', usedInReportSections: ['sec-opportunity', 'sec-recommendation'] },
  { id: 'ev-sa-012', documentId: 'src-sa-007', text: '也门停火谈判取得进展但未达成最终协议，红海航运安全仍受威胁。', factType: 'risk', confidence: 'medium', usedInReportSections: ['sec-politics'] },
  { id: 'ev-sa-013', documentId: 'src-sa-007', text: '建议企业将红海航运风险纳入供应链应急预案，评估绕行好望角的额外时间和成本。', factType: 'recommendation', confidence: 'medium', usedInReportSections: ['sec-politics', 'sec-recommendation'] },
  { id: 'ev-sa-014', documentId: 'src-sa-008', text: '外资可申请勘探区块从12个扩展至38个覆盖金、铜、磷酸盐、稀土等矿种，许可证有效期从5年延长至8年。', factType: 'opportunity', confidence: 'high', usedInReportSections: ['sec-opportunity'] },
  { id: 'ev-sa-015', documentId: 'src-sa-010', text: 'PIF资产管理规模超1万亿美元，重点布局AI、清洁能源、电动汽车和医疗健康领域，可作为战略合作伙伴。', factType: 'opportunity', confidence: 'medium', usedInReportSections: ['sec-opportunity', 'sec-recommendation'] },

  // ===== 阿联酋证据 (12条) =====
  { id: 'ev-ae-001', documentId: 'src-ae-001', text: '100%外资持股适用行业从122个扩展至156个，新增教育科技、AI研发、生物制药合同制造和绿色建筑咨询。', factType: 'policy', confidence: 'high', usedInReportSections: ['sec-policy'] },
  { id: 'ev-ae-002', documentId: 'src-ae-001', text: '自贸区外也允许100%外资持股，企业注册流程进一步简化。', factType: 'policy', confidence: 'high', usedInReportSections: ['sec-policy', 'sec-recommendation'] },
  { id: 'ev-ae-003', documentId: 'src-ae-002', text: '2025年非石油GDP预计增长4.2%，主要由旅游、金融服务、科技和建筑业驱动。', factType: 'macro', confidence: 'high', usedInReportSections: ['sec-macro'] },
  { id: 'ev-ae-004', documentId: 'src-ae-002', text: '银行系统总资产增长8.5%，不良贷款率保持在3.1%的低位，整体通胀率温和在2.3%。', factType: 'macro', confidence: 'high', usedInReportSections: ['sec-macro', 'sec-risk'] },
  { id: 'ev-ae-005', documentId: 'src-ae-003', text: '向国家AI计划追加50亿迪拉姆（约13.6亿美元），重点支持生成式AI在政府服务、医疗诊断和金融风控中的应用。', factType: 'policy', confidence: 'high', usedInReportSections: ['sec-policy', 'sec-opportunity'] },
  { id: 'ev-ae-006', documentId: 'src-ae-003', text: '计划到2027年培养1万名AI工程师，为AI初创企业提供免费办公空间和云计算补贴。', factType: 'opportunity', confidence: 'medium', usedInReportSections: ['sec-opportunity'] },
  { id: 'ev-ae-007', documentId: 'src-ae-004', text: 'DIFC 2025上半年新增注册企业超600家，金融科技占比35%，来自亚洲的企业数量增长最快。', factType: 'opportunity', confidence: 'high', usedInReportSections: ['sec-opportunity'] },
  { id: 'ev-ae-008', documentId: 'src-ae-005', text: '9%公司税政策总体平稳，自贸区企业合规成本可控，关键优化策略包括合理运用集团内部交易定价和研发税收优惠。', factType: 'risk', confidence: 'medium', usedInReportSections: ['sec-risk', 'sec-recommendation'] },
  { id: 'ev-ae-009', documentId: 'src-ae-005', text: '需注意转让定价文档要求，避免因文档准备不足导致的税务争议。', factType: 'recommendation', confidence: 'medium', usedInReportSections: ['sec-risk', 'sec-recommendation'] },
  { id: 'ev-ae-010', documentId: 'src-ae-006', text: '巴拉卡核电站全面商运，核电占总发电量25%，新一批太阳能IPP招标总装机容量2GW，目标2030年清洁能源占比50%。', factType: 'opportunity', confidence: 'high', usedInReportSections: ['sec-opportunity'] },
  { id: 'ev-ae-011', documentId: 'src-ae-007', text: '2025年Q1阿联酋与中国双边贸易额达280亿美元同比增长18%，跨境电商、新能源设备和电动汽车增长最快。', factType: 'trade', confidence: 'high', usedInReportSections: ['sec-trade', 'sec-opportunity'] },
  { id: 'ev-ae-012', documentId: 'src-ae-008', text: '四个重点领域最高可达项目投资额30%的现金返还和补贴，创新许可证年费仅1000迪拉姆。', factType: 'opportunity', confidence: 'high', usedInReportSections: ['sec-opportunity', 'sec-recommendation'] },
  { id: 'ev-ae-013', documentId: 'src-ae-008', text: 'ADIO激励方案覆盖创新、金融科技、农业科技和生命科学四个领域，企业应在落地前与ADIO协商定制激励包。', factType: 'recommendation', confidence: 'medium', usedInReportSections: ['sec-recommendation'] },
]
