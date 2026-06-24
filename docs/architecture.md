# 架构说明

## 分层架构

```
┌─────────────────────────────────────────┐
│               Pages (5 个页面)            │
├─────────────────────────────────────────┤
│            Services (5 个模块)            │
├─────────────────────────────────────────┤
│       AgentClient Adapter (抽象层)        │
│   ┌──────────────┐  ┌────────────────┐  │
│   │ MockAgent    │  │ HttpAgent      │  │
│   │ Client       │  │ Client (占位)   │  │
│   └──────────────┘  └────────────────┘  │
├─────────────────────────────────────────┤
│         Mock Data (data/mock/)           │
└─────────────────────────────────────────┘
```

## 核心设计决策

### 1. Service 层隔离
页面不直接导入 Mock 数据或 AgentClient。所有数据获取通过 Service 层：
- `dashboardService` — 工作台聚合数据
- `sourcesService` — 资料 CRUD + 真实来源导入
- `screeningService` — 智能筛选 + 人工操作状态管理
- `reportService` — 报告查询、生成、导出
- `reviewService` — 审核操作 + 状态持久化

### 2. AgentClient 抽象
定义统一接口 `AgentClient`（`src/agent/types.ts`），MockAgentClient 和 HttpAgentClient 实现同一接口。通过 `src/agent/index.ts` 工厂函数切换。

替换路径：
```
当前: MockAgentClient  →  后续: HttpAgentClient
```

### 3. 数据流向
```
Mock Data (TS modules) → MockAgentClient → Service → Page Component
                                        ↓
                              HttpAgentClient → 后端 Agent API (后续)
```

### 4. 证据链设计
- 报告正文中嵌入 `[证:ev-xxx]` 标记
- `ReportDetailPage` 的 `renderContent()` 解析标记为可点击 Badge
- 点击 Badge → `activeEvidenceId` 状态更新 → `EvidencePanel` 渲染对应证据详情

### 5. 状态持久化
- 审核操作：`useReviewState` hook → localStorage
- 筛选操作：`screeningService` → localStorage
- 筛选条件、搜索框：页面内 state，不持久化

## 扩展点

| 扩展点 | 位置 | 说明 |
|---|---|---|
| 新分析维度 | `src/types/index.ts` → `AnalysisDimension` | 添加维度后需更新 mock 数据和 DimensionTag |
| 新国家/地区 | `src/data/mock/countries.ts` | 添加国家后需同步 sources 和 reports |
| 新 Agent 能力 | `src/agent/types.ts` → `AgentClient` | 添加方法后在 Mock/Http 两端实现 |
| 真实抓取 | `sourcesService.importRealSource()` | 当前模拟，后续替换为真实 HTTP 请求 |
| 报告模板 | `src/data/mock/reports.ts` | 可扩展为模板引擎或后端动态生成 |
| 用户认证 | 新建 `authService` + AuthContext | 后续引入 |
