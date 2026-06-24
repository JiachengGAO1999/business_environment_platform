import type { AnalysisReport, ReviewRecord } from '@/types'

export const mockReviewRecords: ReviewRecord[] = [
  {
    id: 'rev-001',
    reportId: 'report-br-2025-q2',
    sectionId: 'sec-macro',
    reviewer: '张明（区域经济研究专家）',
    timestamp: '2025-06-18T10:30:00Z',
    action: 'approved',
    comment: '宏观数据分析准确，对高利率环境的判断与市场共识一致。建议补充巴西债务/GDP比率的最新趋势。',
  },
  {
    id: 'rev-002',
    reportId: 'report-br-2025-q2',
    sectionId: 'sec-policy',
    reviewer: '张明（区域经济研究专家）',
    timestamp: '2025-06-18T10:45:00Z',
    action: 'approved',
    comment: '新工业计划和税制改革两个政策抓得准确。本地化率要求的分析有深度。',
  },
  {
    id: 'rev-003',
    reportId: 'report-br-2025-q2',
    sectionId: 'sec-trade',
    reviewer: '李华（国际贸易与投资分析师）',
    timestamp: '2025-06-18T14:00:00Z',
    action: 'needs_revision',
    comment: '对南方共同市场自贸谈判的分析略显乐观，建议补充谈判进展缓慢的背景。欧盟-南方共同市场协议尚未生效。',
  },
  {
    id: 'rev-004',
    reportId: 'report-br-2025-q2',
    sectionId: 'sec-opportunity',
    reviewer: '李华（国际贸易与投资分析师）',
    timestamp: '2025-06-18T14:20:00Z',
    action: 'approved',
    comment: '投资机会分析覆盖全面，新能源和数字经济两个重点把握准确。建议增加农业科技投资机会。',
  },
  {
    id: 'rev-005',
    reportId: 'report-br-2025-q2',
    sectionId: 'sec-risk',
    reviewer: '王芳（跨境合规与风险管理专家）',
    timestamp: '2025-06-19T09:00:00Z',
    action: 'unsupported',
    comment: '税制复杂度的量化估计需要更具体的证据支撑。建议补充世界银行营商环境报告中关于巴西税制排名的数据。',
  },
  {
    id: 'rev-006',
    reportId: 'report-br-2025-q2',
    sectionId: 'sec-politics',
    reviewer: '王芳（跨境合规与风险管理专家）',
    timestamp: '2025-06-19T09:30:00Z',
    action: 'unsupported',
    comment: '2026年大选影响分析有价值，但对反对派候选人政策主张的具体分析不足，建议补充主要候选人的经济政策倾向。',
  },
  {
    id: 'rev-007',
    reportId: 'report-br-2025-q2',
    sectionId: 'sec-recommendation',
    reviewer: '张明（区域经济研究专家）',
    timestamp: '2025-06-19T11:00:00Z',
    action: 'approved',
    comment: '行动建议务实可行，分阶段进入策略和选举年预案是很好的框架。建议补充本地团队建设的时间节点建议。',
  },
  {
    id: 'rev-008',
    reportId: 'report-br-2025-q2',
    sectionId: null,
    reviewer: '张明（区域经济研究专家）',
    timestamp: '2025-06-19T11:30:00Z',
    action: 'needs_revision',
    comment: '整体报告质量较高，分析框架清晰。建议修改贸易章节后重新提交审核。补充农业科技和生物经济领域的机会分析。',
  },
  {
    id: 'rev-009',
    reportId: 'report-sa-2025-q2',
    sectionId: 'sec-macro',
    reviewer: '李华（国际贸易与投资分析师）',
    timestamp: '2025-06-17T14:00:00Z',
    action: 'approved',
    comment: '对沙特经济多元化进展的分析有数据支撑，继续推进。',
  },
  {
    id: 'rev-010',
    reportId: 'report-ae-2025-q2',
    sectionId: null,
    reviewer: '张明（区域经济研究专家）',
    timestamp: '2025-06-16T10:00:00Z',
    action: 'approved',
    comment: '阿联酋报告信息准确，建议后续补充阿布扎比与迪拜差异化定位的分析。',
  },
]

export const mockReports: AnalysisReport[] = [
  // ===== 巴西完整报告 =====
  {
    id: 'report-br-2025-q2',
    country: '巴西',
    title: '巴西宏观经济与营商环境研究报告（2025年Q2）',
    period: '2025年Q2',
    status: 'in_review',
    generatedAt: '2025-06-15T08:00:00Z',
    sourceDocumentIds: [
      'src-br-001', 'src-br-002', 'src-br-003', 'src-br-004',
      'src-br-005', 'src-br-006', 'src-br-007', 'src-br-008',
      'src-br-009', 'src-br-010', 'src-br-011',
    ],
    openQuestions: [
      '巴西税制改革过渡期（2026-2036）各阶段对外资企业的具体税负影响需进一步量化分析。',
      '2026年大选后新政府是否延续当前再工业化政策存在不确定性，需持续跟踪主要候选人经济政策纲领。',
      '新能源投资的具体电价补贴机制和PPA合同标准化程度需要在实地调研中确认。',
      '基础设施特许权项目中本地用工比例的具体执行标准因州而异，需要逐州调研。',
      '巴西与欧盟自贸协定谈判进展速度存在分歧报告，需交叉验证多个来源后更新判断。',
    ],
    reviewRecords: mockReviewRecords.filter((r) => r.reportId === 'report-br-2025-q2'),
    sections: [
      {
        id: 'sec-summary',
        title: '摘要',
        content: `2025年Q2巴西营商环境呈现"高利率压制增长、结构性机会浮现"的格局。宏观经济面临GDP增速下调至1.8%、基准利率维持14.25%高位的压力，财政赤字占GDP的6.8%进一步限制公共投资空间[证:ev-br-001][证:ev-br-002][证:ev-br-003]。但新工业计划的600亿雷亚尔投资和税制改革推进，为外资企业在高附加值制造业和数字经济领域创造了政策窗口[证:ev-br-004][证:ev-br-006]。

本报告基于11条来源资料的分析，核心判断如下：第一，巴西当前的高利率和高税负环境是外资企业短期面临的主要经营成本挑战。第二，再工业化政策和能源转型为中长期投资提供了结构性机会，但需匹配本地化策略。第三，2026年大选是近期最大的政策不确定性来源，建议企业在选举年到来前建立灵活的市场进入和退出机制。`,
        riskLevel: 'high',
        evidenceIds: ['ev-br-001', 'ev-br-002', 'ev-br-003', 'ev-br-004', 'ev-br-006'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-macro',
        title: '宏观经济运行状态',
        content: `巴西经济在2025年Q2面临多重压力。央行Focus报告显示市场对全年GDP增长预期已下调至1.8%，通胀预期维持在4.5%的高位，远离央行3%的目标中值[证:ev-br-001][证:ev-br-020]。为应对持续的通胀压力，央行将Selic基准利率维持在14.25%的历史高位，市场普遍预期年内降息空间极为有限[证:ev-br-002]。

财政方面，赤字预期占GDP的6.8%，财政整顿的紧迫性与经济增长需求之间存在明显张力[证:ev-br-003]。高利率环境已对企业投资和居民消费产生抑制作用，制造业和建筑业信贷增速明显放缓。

积极信号方面，Q2失业率降至8.1%，为2015年以来最低水平，制造业和信息技术服务业是新增就业的主要推动力[证:ev-br-010]。但需注意非正规就业占比仍高达38.5%，劳动力市场的结构性脆弱性未根本改变。

综合判断：巴西宏观经济短期内将继续承受高利率和财政整顿的双重约束，预计2025年全年GDP增速在1.5%-2.0%区间。2026年若通胀回落至目标区间，央行可能在下半年启动降息周期，届时投资环境将边际改善。`,
        riskLevel: 'high',
        evidenceIds: ['ev-br-001', 'ev-br-002', 'ev-br-003', 'ev-br-010', 'ev-br-020'],
        confidence: 'high',
        reviewStatus: 'approved',
      },
      {
        id: 'sec-policy',
        title: '产业政策与监管变化',
        content: `巴西政府2025年推出两项重大政策：新工业计划和税制改革方案。

新工业计划以总规模约600亿雷亚尔的财政支持为杠杆，通过税收减免、低息贷款和政府采购偏好，重点支持半导体、新能源装备和生物制药等高附加值制造业[证:ev-br-004]。计划明确要求受益企业满足本地化率要求——这是一个双刃剑：一方面为已在巴西设厂的外资企业提供了政策红利，另一方面对新进入者构成额外的供应链投资压力[证:ev-br-005]。

税制改革PEC 110/2025计划将联邦、州、市三级间接税统一为增值税体系[证:ev-br-006]。这是巴西近三十年来最雄心勃勃的税改方案。改革将显著降低企业的合规成本——据估计，当前巴西企业平均每年花费约1500小时处理税务合规，统一增值税后预计可减少40%以上的时间投入。但过渡期长达10年（2026年起），企业在过渡期内需同时应对新旧两套税制[证:ev-br-021]。

金融监管方面，央行提高了大型数字银行和支付机构的资本充足率要求至12%[证:ev-br-015]，这对在巴西展业的中资金融科技企业构成直接的合规成本挑战，但也有利于行业长期健康发展。`,
        riskLevel: 'medium',
        evidenceIds: ['ev-br-004', 'ev-br-005', 'ev-br-006', 'ev-br-015', 'ev-br-021'],
        confidence: 'medium',
        reviewStatus: 'approved',
      },
      {
        id: 'sec-trade',
        title: '贸易与市场准入环境',
        content: `WTO对巴西的最新贸易政策审议确认，巴西平均关税水平仍然高于新兴市场平均水平，尤其在汽车、化工和信息技术产品领域[证:ev-br-008]。这意味着通过贸易模式进入巴西市场的外企面临较高的关税壁垒，本地化生产或本地组装是降低贸易成本的可行替代方案。

积极方面，巴西参与南方共同市场（Mercosur）对外自贸谈判取得一定进展，与欧盟的自贸协定谈判虽未最终签署但接近完成。如能达成，将为巴西企业打开更大的欧洲市场，并可能降低部分工业品的进口关税[证:ev-br-009]。不过该判断存在不确定性——此前的谈判已多次延期，实际生效时间难以预测。

农产品贸易方面，巴西大豆和牛肉出口在2025年5月创下新高，中国和中东是主要需求驱动方[证:ev-br-018]。但欧盟新出台的反毁林法规（EUDR）可能影响巴西农产品未来对欧出口，相关出口企业需提前建立供应链溯源系统。

在信息技术产品进口关税高企的背景下[证:ev-br-023]，建议电子产品出口企业评估在巴西进行本地组装或利用玛瑙斯自贸区的税收优惠政策。`,
        riskLevel: 'medium',
        evidenceIds: ['ev-br-008', 'ev-br-009', 'ev-br-018', 'ev-br-023'],
        confidence: 'medium',
        reviewStatus: 'needs_revision',
      },
      {
        id: 'sec-opportunity',
        title: '投资机会分析',
        content: `综合多来源资料分析，巴西当前最主要的结构性投资机会分布在以下领域：

**新能源**：巴西能源研究公司十年规划预测，到2030年太阳能和风能装机容量分别增长180%和120%[证:ev-br-011]。东北部地区风光资源丰富，政府计划拍卖新的输电线路和新能源基地。外资在新能源领域享有与本地企业同等待遇[证:ev-br-012]，这是当前巴西对外资最友好的行业之一。

**基础设施**：2025年下半年将有7条联邦公路和3条铁路特许权拍卖，总投资额约450亿雷亚尔[证:ev-br-016]。外资企业可独立或联合体形式参与竞标。需要注意的是中标企业需满足本地用工比例要求并在当地设立法人[证:ev-br-017]。

**数字经济**：巴西数字经济规模已达2400亿美元（占GDP的11.8%），政府目标到2030年提升至18%[证:ev-br-019]。电商、金融科技和云计算是增长最快的细分领域。但需关注金融科技监管趋严对行业格局的影响。

**高附加值制造**：新工业计划明确支持半导体、新能源装备和生物制药三个赛道[证:ev-br-022]，外资企业应积极对接政府的补贴和采购通道。

这些机会的落地仍面临融资成本高和本地化要求等现实约束，但方向明确、政策支持力度大，建议有实力的企业以中长期视角布局。`,
        riskLevel: 'medium',
        evidenceIds: ['ev-br-011', 'ev-br-012', 'ev-br-016', 'ev-br-017', 'ev-br-019', 'ev-br-022'],
        confidence: 'medium',
        reviewStatus: 'approved',
      },
      {
        id: 'sec-risk',
        title: '经营风险',
        content: `在巴西经营的外资企业需重点关注以下风险维度：

**融资成本**：基准利率14.25%意味着巴西雷亚尔融资成本是全球主要经济体中最高的之一[证:ev-br-002]。企业应尽量利用母公司或国际金融市场融资，减少本地借贷依赖。

**税制复杂度**：尽管税改方向明确，但长达10年的过渡期意味着企业在相当长时间内仍需应对复杂的税制[证:ev-br-006][证:ev-br-021]。巴西当前税制在世界银行营商环境排名中长期处于低位，该风险短期内难以根本缓解。（注：税制排名的具体数据需补充世界银行最新营商环境报告以增强证据支撑。）

**劳工与合规**：非正规就业占比38.5%反映劳动力市场的结构性特征[证:ev-br-010]。严格的劳动法、高额的社保缴费和工会谈判要求增加了用工成本和管理复杂度。

**本地化要求**：无论是工业计划[证:ev-br-005]还是基础设施特许权[证:ev-br-025]，都对外资企业提出本地用工、本地采购或本地设厂的要求，人力策略和供应链布局需提前规划。

**金融合规**：金融科技领域监管趋严[证:ev-br-015]，相关企业需预留充分的合规投入。

综合看，巴西经营风险整体偏高，主要体现在成本端和合规端，但并非不可管理。关键策略是本地化团队建设、税务提前规划和融资结构优化。`,
        riskLevel: 'high',
        evidenceIds: ['ev-br-002', 'ev-br-005', 'ev-br-006', 'ev-br-010', 'ev-br-015', 'ev-br-021', 'ev-br-025'],
        confidence: 'medium',
        reviewStatus: 'unsupported',
      },
      {
        id: 'sec-politics',
        title: '政治与地缘风险',
        content: `2026年总统大选是巴西未来12-18个月最大的政策不确定性来源。现任政府支持率已降至38%[证:ev-br-013]，反对派候选人在圣保罗、里约等主要城市支持率上升。大选结果将直接影响税改推进节奏、国企私有化进程和外资政策的连续性。

经济学人智库将此轮选举评估为"巴西近十年来政策不确定性最高的选举周期之一"[证:ev-br-024]。主要风险情景包括：若反对派胜选且推行激进的经济政策转向，可能导致税改暂停或工业政策大幅调整；若现任政府连任，政策将延续但改革推进速度可能因选举周期而放缓。

地缘风险方面，巴西作为金砖国家和G20成员，整体国际环境相对稳定。但中美贸易摩擦的溢出效应可能通过大宗商品价格波动间接影响巴西经济和汇率。巴西对华农产品出口高度依赖，若中巴贸易关系出现波动将产生显著影响。

建议企业建立选举年专项预案，对大额投资决策进行不同选举结果下的压力测试[证:ev-br-014]。在当前阶段（2025年Q2-Q3），可维持已有的投资计划和市场调研，但建议将重大资本开支决策至少推迟至2026年Q1选情更明朗之后。

（注：主要候选人的具体经济政策倾向需进一步补充，以增强本节分析的确定性。）`,
        riskLevel: 'high',
        evidenceIds: ['ev-br-013', 'ev-br-014', 'ev-br-024'],
        confidence: 'low',
        reviewStatus: 'unsupported',
      },
      {
        id: 'sec-recommendation',
        title: '企业行动建议',
        content: `基于以上分析，对计划进入或扩大巴西市场的外资企业提出以下建议：

**1. 本地化服务团队建设**：鉴于本地化率要求[证:ev-br-005][证:ev-br-025]和税制复杂度[证:ev-br-021]，建议在进入巴西市场的第一年即建立本地法人实体和核心运营团队，聘用本地税务和法律顾问。时间节点上，建议在2025年底前完成公司注册和核心团队搭建。

**2. 政策杠杆和本地化经营**：积极对接新工业计划的补贴和政府采购通道[证:ev-br-022]，将政策利好转化为实际的成本节约和市场准入。新能源企业应关注2025下半年输电线路拍卖进程[证:ev-br-012]。

**3. 融资结构优化**：在高利率环境下[证:ev-br-002]，严格控制本地借贷敞口，优先使用母公司信贷和国际金融机构贷款。可考虑与巴西国家开发银行（BNDES）对接获得优惠利率的项目融资。

**4. 分阶段市场进入路径**：建议采用"小规模试点→验证→逐步扩大"的分阶段策略。首期可选择基础设施特许权项目或新能源IPP项目作为切入点，这些领域政策透明、外资待遇清晰。

**5. 选举年预案**：针对2026年大选[证:ev-br-014]制定至少两套情景预案（政策延续情景和政策转向情景），对重大投资决策设置选举前的review gate。

**6. 中长期信心**：尽管短期风险较高，巴西2.1亿人口的消费市场、丰富的自然资源和明确的再工业化方向，使其中长期投资价值仍然显著。建议以5-10年为投资回报周期进行规划。`,
        riskLevel: 'medium',
        evidenceIds: ['ev-br-002', 'ev-br-005', 'ev-br-012', 'ev-br-014', 'ev-br-021', 'ev-br-022', 'ev-br-025'],
        confidence: 'medium',
        reviewStatus: 'approved',
      },
      {
        id: 'sec-sources',
        title: '证据来源',
        content: `本报告的分析判断基于以下11条来源资料，每条关键判断均标注了对应的证据编号，可点击查看原文片段。

| 编号 | 资料 | 来源机构 | 日期 |
|---|---|---|---|
| src-br-001 | 巴西央行Focus市场报告 | 巴西中央银行 | 2025-06-02 |
| src-br-002 | 巴西2025年新工业计划 | 巴西发展、工业、贸易和服务部 | 2025-05-28 |
| src-br-003 | 税制改革PEC 110/2025 | 巴西财政部 | 2025-06-10 |
| src-br-004 | WTO巴西贸易政策审议 | 世界贸易组织 | 2025-05-15 |
| src-br-005 | 劳动力市场Q2数据 | 巴西地理与统计研究所 | 2025-06-05 |
| src-br-006 | 新能源投资展望 | 巴西能源研究公司 | 2025-05-20 |
| src-br-007 | 2026年大选前瞻 | 经济学人智库 | 2025-06-08 |
| src-br-008 | 金融科技监管新规 | 巴西中央银行 | 2025-06-01 |
| src-br-009 | 基础设施特许权拍卖 | 巴西基础设施部 | 2025-06-12 |
| src-br-010 | 农产品出口数据 | 巴西农业部 | 2025-06-03 |
| src-br-011 | 数字经济发展白皮书 | 巴西科技创新与通信部 | 2025-05-01 |

来源覆盖政府官方（8条）、国际组织（1条）和独立智库（2条），以高可靠性来源为主。

> ⚠️ 重要提醒：本报告由智能分析系统基于公开资料自动生成，所有判断均标注证据来源。报告中标记为"低置信度"或"需复核"的段落，建议专家在使用前进行人工审核和补充调研。本报告不构成投资建议。`,
        riskLevel: undefined,
        evidenceIds: [],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-questions',
        title: '待专家复核问题',
        content: `以下问题在现有资料基础上无法得出确定结论，需要专家进一步研判或补充调研：

1. **税制改革过渡期量化影响**：PEC 110/2025的10年过渡期内，各阶段对外资制造企业的实际税负变化尚缺乏量化模型。建议由税务专家针对企业所在行业做专项测算。

2. **2026年大选候选人经济政策追踪**：目前对主要总统候选人的经济政策主张缺乏系统性对比分析，特别是对税改、外资政策和国企私有化的立场，建议建立持续跟踪机制。

3. **新能源投资补贴机制细节**：东北部新能源基地的电价补贴和PPA合同标准化程度需要通过实地调研或当地律所确认，现有公开资料不足以做出确定性判断。

4. **基础设施特许权本地用工比例**：各州的具体执行标准和合规成本差异较大，建议在进行具体项目投标前委托当地律所做州级合规尽调。

5. **税制排名的数据更新**：经营风险章节引用的税制复杂度判断需要补充世界银行最新营商环境报告（如有）或PwC Paying Taxes报告的量化数据。`,
        riskLevel: undefined,
        evidenceIds: [],
        confidence: 'low',
        reviewStatus: 'pending',
      },
    ],
  },

  // ===== 沙特报告草稿 =====
  {
    id: 'report-sa-2025-q2',
    country: '沙特阿拉伯',
    title: '沙特阿拉伯营商环境分析报告（2025年Q2）',
    period: '2025年Q2',
    status: 'draft',
    generatedAt: '2025-06-14T08:00:00Z',
    sourceDocumentIds: ['src-sa-001', 'src-sa-002', 'src-sa-003', 'src-sa-005', 'src-sa-007'],
    openQuestions: [
      'NEOM项目外资参与的实际回报率数据尚不充分，需跟踪已签约项目的执行情况。',
      '红海航运安全风险的实际保险成本增幅需要航运业专业数据支撑。',
    ],
    reviewRecords: mockReviewRecords.filter((r) => r.reportId === 'report-sa-2025-q2'),
    sections: [
      {
        id: 'sec-summary',
        title: '摘要',
        content: `沙特阿拉伯正处于Vision 2030战略的冲刺阶段。非石油GDP占比提升至52%[证:ev-sa-001]，FDI流入创280亿美元新高[证:ev-sa-002]。区域总部计划（RHQ）和外资法的持续放宽为国际企业创造了明确的市场进入机会。NEOM等巨型项目的推进带来大规模工程和设备采购机会[证:ev-sa-008]。主要风险在于红海地缘政治不确定性[证:ev-sa-012]和部分行业的本地化要求。整体看，沙特是当前中东地区营商环境改善速度最快、政策透明度最高的市场之一。`,
        riskLevel: 'medium',
        evidenceIds: ['ev-sa-001', 'ev-sa-002', 'ev-sa-008', 'ev-sa-012'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-macro',
        title: '宏观经济运行状态',
        content: `沙特经济多元化取得实质性进展。非石油GDP占比从2016年的40%提升至2024年的52%[证:ev-sa-001]。FDI流入在2024年达到280亿美元创历史新高[证:ev-sa-002]。通胀稳定在2.1%的低位，回购利率5.75%[证:ev-sa-009]。非石油私营部门PMI连续第22个月处于扩张区间[证:ev-sa-010]，企业信心保持在高位。整体宏观经济环境对外资友好，通胀和利率风险可控。`,
        riskLevel: 'low',
        evidenceIds: ['ev-sa-001', 'ev-sa-002', 'ev-sa-009', 'ev-sa-010'],
        confidence: 'high',
        reviewStatus: 'approved',
      },
      {
        id: 'sec-policy',
        title: '产业政策与监管变化',
        content: `沙特在政策开放方面持续取得进展。区域总部计划（RHQ）已吸引超过200家跨国公司设立区域总部[证:ev-sa-004]，RHQ企业享有政府采购优先权和税收优惠。新公司法修正案自2025年7月起允许外资企业在多数行业持100%股权[证:ev-sa-006]，审批时间从30天缩短至5个工作日。但金融服务和能源上游仍保留限制[证:ev-sa-007]，相关行业需在进入前确认准入条件。`,
        riskLevel: 'low',
        evidenceIds: ['ev-sa-004', 'ev-sa-006', 'ev-sa-007'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-trade',
        title: '贸易与市场准入环境',
        content: '（本节尚在撰写中。沙特是GCC关税同盟成员，对外统一关税为5%。与多国签有双边投资协定。具体数据和分析待补充。）',
        riskLevel: undefined,
        evidenceIds: [],
        confidence: 'low',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-opportunity',
        title: '投资机会分析',
        content: `沙特的投资机会集中在几个超级项目和政策驱动领域。NEOM项目2025-2026年度将发布超过200亿美元的工程和供应合同[证:ev-sa-008]。阿美IKTVA本地化计划新增50亿美元采购额[证:ev-sa-011]。矿业投资法开放38个勘探区块给外资[证:ev-sa-014]。PIF资产管理规模超1万亿美元，重点布局AI、清洁能源、电动汽车和医疗健康[证:ev-sa-015]，作为战略合作伙伴的角色日益重要。`,
        riskLevel: 'medium',
        evidenceIds: ['ev-sa-008', 'ev-sa-011', 'ev-sa-014', 'ev-sa-015'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-risk',
        title: '经营风险',
        content: '（本节尚在撰写中。初步识别的主要风险包括：部分行业仍保留外资限制[证:ev-sa-007]、红海航运安全对供应链的影响[证:ev-sa-012]、以及本地化要求对外资运营成本的影响。）',
        riskLevel: 'medium',
        evidenceIds: ['ev-sa-007', 'ev-sa-012'],
        confidence: 'low',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-politics',
        title: '政治与地缘风险',
        content: `也门停火谈判取得进展但尚未达成最终协议，红海航运安全仍受威胁[证:ev-sa-012]。大规模冲突可能性下降，但企业仍需将航运风险纳入供应链应急预案，评估绕行好望角的额外时间和成本[证:ev-sa-013]。沙特国内政治稳定，王储主导的改革方向明确。`,
        riskLevel: 'medium',
        evidenceIds: ['ev-sa-012', 'ev-sa-013'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-recommendation',
        title: '企业行动建议',
        content: '（本节尚在撰写中。初步建议：尽快启动RHQ注册以获取政府采购和税收优惠[证:ev-sa-004]，评估NEOM供应链机会[证:ev-sa-008]，与PIF探索战略合作可能[证:ev-sa-015]，制定红海航运应急预案[证:ev-sa-013]。）',
        riskLevel: undefined,
        evidenceIds: ['ev-sa-004', 'ev-sa-008', 'ev-sa-013', 'ev-sa-015'],
        confidence: 'low',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-sources',
        title: '证据来源',
        content: '（待补全。目前已引用7条来源资料。）',
        riskLevel: undefined,
        evidenceIds: [],
        confidence: 'low',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-questions',
        title: '待专家复核问题',
        content: '（待补全。）',
        riskLevel: undefined,
        evidenceIds: [],
        confidence: 'low',
        reviewStatus: 'pending',
      },
    ],
  },

  // ===== 阿联酋报告草稿 =====
  {
    id: 'report-ae-2025-q2',
    country: '阿联酋',
    title: '阿联酋营商环境分析报告（2025年Q2）',
    period: '2025年Q2',
    status: 'draft',
    generatedAt: '2025-06-13T08:00:00Z',
    sourceDocumentIds: ['src-ae-001', 'src-ae-002', 'src-ae-003', 'src-ae-004', 'src-ae-005'],
    openQuestions: [
      '阿布扎比和迪拜在金融科技和数字经济领域的差异化定位和竞争策略需要进一步分析。',
      '9%公司税对外资企业在自贸区和内陆的实际税负差异需要更多实证数据。',
    ],
    reviewRecords: mockReviewRecords.filter((r) => r.reportId === 'report-ae-2025-q2'),
    sections: [
      {
        id: 'sec-summary',
        title: '摘要',
        content: `阿联酋继续保持中东地区最成熟、最开放的外资环境。2025年非石油GDP增速4.2%[证:ev-ae-003]，通胀温和可控[证:ev-ae-004]。外资法将100%外资持股行业扩展至156个[证:ev-ae-001]。AI战略和清洁能源投资带来新的机会窗口[证:ev-ae-005][证:ev-ae-010]。迪拜国际金融中心（DIFC）继续保持区域金融枢纽地位[证:ev-ae-007]。9%公司税实施一周年平稳运行[证:ev-ae-008]。整体看，阿联酋是中东地区营商环境风险最低、外资友好度最高的市场。`,
        riskLevel: 'low',
        evidenceIds: ['ev-ae-001', 'ev-ae-003', 'ev-ae-004', 'ev-ae-005', 'ev-ae-007', 'ev-ae-008', 'ev-ae-010'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-macro',
        title: '宏观经济运行状态',
        content: `阿联酋2025年宏观经济表现稳健。非石油GDP预计增长4.2%，主要由旅游、金融服务、科技和建筑业驱动[证:ev-ae-003]。通胀率温和在2.3%，银行系统总资产增长8.5%，不良贷款率保持在3.1%的低位[证:ev-ae-004]。整体经济环境对外资非常友好，主要宏观经济风险指标均在可控范围内。`,
        riskLevel: 'low',
        evidenceIds: ['ev-ae-003', 'ev-ae-004'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-policy',
        title: '产业政策与监管变化',
        content: `阿联酋在政策开放方面继续领跑中东。外资法将100%外资持股行业扩展至156个[证:ev-ae-001]，自贸区外也允许100%外资持股[证:ev-ae-002]。国家AI计划新增50亿迪拉姆投资[证:ev-ae-005]。ADIO提供最高30%投资额的现金返还和补贴，创新许可证年费仅1000迪拉姆[证:ev-ae-012]。政策透明度和可预期性在区域处于最高水平。`,
        riskLevel: 'low',
        evidenceIds: ['ev-ae-001', 'ev-ae-002', 'ev-ae-005', 'ev-ae-012'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-trade',
        title: '贸易与市场准入环境',
        content: `阿联酋与中国双边贸易持续增长，2025年Q1贸易额达280亿美元同比增长18%[证:ev-ae-011]。阿联酋作为中国商品进入中东和非洲市场的物流枢纽地位稳固。跨境电商、新能源设备和电动汽车是增长最快的贸易品类。`,
        riskLevel: 'low',
        evidenceIds: ['ev-ae-011'],
        confidence: 'high',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-opportunity',
        title: '投资机会分析',
        content: `阿联酋当前的投资机会分布广泛。AI领域国家战略级别投入[证:ev-ae-005][证:ev-ae-006]，清洁能源目标2030年占比50%[证:ev-ae-010]，DIFC作为区域金融中心持续增长[证:ev-ae-007]。ADIO在创新、金融科技、农业科技和生命科学领域提供慷慨激励[证:ev-ae-012][证:ev-ae-013]。企业应在落地前与ADIO协商定制激励包。`,
        riskLevel: 'low',
        evidenceIds: ['ev-ae-005', 'ev-ae-006', 'ev-ae-007', 'ev-ae-010', 'ev-ae-012', 'ev-ae-013'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-risk',
        title: '经营风险',
        content: `阿联酋整体经营风险较低，但需关注9%公司税的合规要求，特别是转让定价文档[证:ev-ae-008][证:ev-ae-009]。自贸区与内陆的税务安排差异也需在进入策略中考虑。建议企业在第一年即聘请本地税务顾问完成合规体系搭建。`,
        riskLevel: 'low',
        evidenceIds: ['ev-ae-008', 'ev-ae-009'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-politics',
        title: '政治与地缘风险',
        content: '（本节尚在撰写中。阿联酋国内政治稳定，国际关系平衡。主要地缘风险关注点包括中东区域安全局势和国际贸易摩擦溢出效应。）',
        riskLevel: 'low',
        evidenceIds: [],
        confidence: 'low',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-recommendation',
        title: '企业行动建议',
        content: `建议有意进入阿联酋市场的企业：选择自贸区或ADIO特区落地以获取最优政策组合[证:ev-ae-002][证:ev-ae-012]，利用DIFC进行中东和非洲区域的资金管理[证:ev-ae-007]，对接AI战略和清洁能源领域的政府采购和补贴机会[证:ev-ae-005][证:ev-ae-010]，并在落地前与ADIO协商定制激励包[证:ev-ae-013]。`,
        riskLevel: undefined,
        evidenceIds: ['ev-ae-002', 'ev-ae-005', 'ev-ae-007', 'ev-ae-010', 'ev-ae-012', 'ev-ae-013'],
        confidence: 'medium',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-sources',
        title: '证据来源',
        content: '（待补全。目前已引用5条来源资料。）',
        riskLevel: undefined,
        evidenceIds: [],
        confidence: 'low',
        reviewStatus: 'pending',
      },
      {
        id: 'sec-questions',
        title: '待专家复核问题',
        content: '（待补全。）',
        riskLevel: undefined,
        evidenceIds: [],
        confidence: 'low',
        reviewStatus: 'pending',
      },
    ],
  },
]
