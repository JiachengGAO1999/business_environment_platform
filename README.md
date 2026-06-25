# 全球营商环境智能分析平台 Demo

面向企业出海决策的全球营商环境智能分析工作台，将分散的公开资料转化为可溯源、可审核、可导出的国别营商环境分析报告。

> ⚠️ **Demo 声明**：本项目为功能演示版本，所有数据均为 Mock 模拟数据，不包含真实商业敏感信息。智能分析结果需专家复核后使用，不构成投资建议。

## 技术栈

| 层级 | 技术 |
|---|---|
| 框架 | React 19 + Vite 8 + TypeScript 6 |
| UI | Tailwind CSS v4 + shadcn/ui |
| 图标 | lucide-react |
| 路由 | react-router-dom v7 |
| 包管理 | pnpm |
| 数据 | 本地 Mock TypeScript 模块 |
| Agent | MockAgentClient（预留 HttpAgentClient 占位） |

## 本地启动

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 类型检查
pnpm exec tsc --noEmit
```

启动后访问 `http://localhost:5173`，无需任何 API Key。

## 页面说明

### 1. 工作台首页 `/`
- 5 个 KPI 指标卡（今日新增资料、高相关资料、高风险预警、已生成报告、待审核数）
- 3 个国家/地区卡片（巴西、沙特阿拉伯、阿联酋），点击跳转报告
- 今日重点风险列表 + 今日重点机会列表

### 2. 全球大屏 `/world`
- 世界地图态势视图，展示监测国家、风险指数、资料流入和机会线索
- 国家监测点联动右侧焦点面板，可查看风险、机会、摘要和报告入口
- 视觉风格遵循 `docs/design-style.md` 与 `docs/preview.png`

### 3. 资料库 `/sources`
- 资料表格，支持按国家、来源类型、相关性、维度、日期筛选
- 关键词搜索（标题、摘要、来源）
- 资料详情弹窗（摘要、关键事实、维度、证据片段）
- 真实来源模拟导入（URL 模拟抓取 + 手动文本粘贴）

### 4. 智能筛选 `/screening`
- 资料筛选卡片（相关性评分、判断理由、维度映射）
- 证据片段展示（标注"事实摘录" vs "模型推断"）
- 操作：采纳、降权、标记误判、加入今日报告
- 操作状态 localStorage 持久化，刷新后保留

### 5. 国别报告 `/reports`
- 报告列表（巴西完整报告 + 沙特和阿联酋草稿）
- 报告详情三栏布局：左侧目录 / 中间正文 / 右侧证据面板
- 点击报告中的证据编号，右侧显示来源资料和片段
- 报告结构：摘要、宏观经济、产业政策、贸易环境、投资机会、经营风险、政治与地缘风险、企业行动建议、证据来源、待复核问题
- Markdown / HTML 导出（复制内容）

### 6. 审核中心 `/review`
- 待审核报告列表 + 审核详情
- 段落级审核（通过、需修改、证据不足、事实冲突）
- 整体审核结论（可发布、需修改、暂不发布）
- 审核记录历史，localStorage 持久化

## Mock 数据说明

所有 Mock 数据位于 `src/data/mock/`，包含：

| 数据 | 文件 | 数量 |
|---|---|---|
| 国家/地区 | `countries.ts` | 3 个 |
| 来源资料 | `sources.ts` | 30 条 |
| 证据片段 | `evidence.ts` | 52 条 |
| 分析报告 | `reports.ts` | 3 份（1 完整 + 2 草稿） |
| 审核记录 | `reports.ts` | 10 条 |

数据覆盖全部 7 个分析维度：宏观经济、产业政策、贸易环境、市场机会、经营风险、政治与地缘风险、企业行动建议。

Mock 数据标记为 `dataOrigin: 'mock'`，真实来源模拟导入数据标记为 `dataOrigin: 'real'`。

## AgentClient 架构

```
页面组件 → Service 层 → AgentClient (adapter)
                            ├── MockAgentClient (当前)
                            └── HttpAgentClient (占位，后续接入)
```

- `src/agent/types.ts` — AgentClient 接口定义
- `src/agent/MockAgentClient.ts` — 返回固定但高质量的模拟结果，含异步延迟
- `src/agent/HttpAgentClient.ts` — 占位实现，待后续对接真实 API
- `src/agent/index.ts` — 工厂函数，通过 `VITE_AGENT_MODE` 环境变量切换

`.env.example`：
```
VITE_AGENT_MODE=mock
VITE_AGENT_API_URL=
```

真实 `AGENT_API_KEY` 只能放后端环境变量，前端不暴露。

## 状态持久化

以下操作通过 localStorage 持久化，刷新后保留：
- 智能筛选操作（采纳、降权、误判、加入报告）
- 审核操作（段落审核、整体审核）

不持久化的（页面切换后重置）：
- 筛选条件（国家、类型、相关性等下拉筛选器）
- 搜索框输入
- 导出内容

## 后续扩展指引

1. **接入真实 Agent API**：设置 `VITE_AGENT_MODE=http` 和 `VITE_AGENT_API_URL`
2. **真实来源抓取**：需要 backend/proxy 绕过 CORS 和反爬，当前仅模拟
3. **报告导出**：当前支持 Markdown/HTML 复制，后续可接 WeasyPrint/python-docx
4. **多语言支持**：mock 数据已预留 `language` 字段
5. **向量检索/RAG**：预留 `EvidenceSnippet` 和 `CitationCheckResult` 数据结构
6. **用户认证**：后续可引入登录和角色权限

## 目录结构

```
src/
  types/index.ts           # 类型定义
  data/mock/               # Mock 数据（6 个文件）
  agent/                   # AgentClient 抽象
  services/                # 业务服务层（5 个模块）
  components/
    layout/                # TopNav, PageShell
    common/                # 共享组件（9 个）
    sources/               # RealSourceImporter
    screening/             # ScreeningCard
    reports/               # ReportTOC, EvidencePanel, ReportExporter
  pages/                   # 页面组件
  hooks/                   # useDebounce, useReviewState
```
