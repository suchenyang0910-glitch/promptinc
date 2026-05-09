# 第二/第三批游戏线 - 页面设计规范（Desktop-first）

## 全局（适用于全部页面）
### Layout
- 桌面端：内容最大宽度 1200px，居中；两侧留白。
- 移动端：100% 宽度，关键 CTA 固定在底部安全区（safe-area-inset）。
- 间距体系：8px 基线（8/16/24/32）。

### Meta Information（通用默认）
- Title 模板：`{游戏名} | 休闲小游戏`
- Description 模板：`在浏览器中直接游玩 {游戏名}，支持移动端触控操作、结算与排行榜。`
- Open Graph：og:title/og:description/og:image（游戏封面）、og:type=website

### Global Styles（Design Tokens）
- 背景：#0B1220（深色）/ 内容卡片：#111B2E
- 主色：#5B8CFF（按钮/链接/高亮）
- 强调色：#22C55E（成功/进榜）、#F59E0B（提示）、#EF4444（失败/GameOver）
- 字体：
  - 标题：20/24/32
  - 正文：14/16
  - 数字（分数）：等宽或半等宽（提升可读性）
- 按钮：主按钮实心（hover 提亮 8%），次按钮描边；禁用态降低不透明度。
- 动效：按钮/卡片 hover 100–150ms；GameOver 弹层 180–220ms（淡入+上移）。

---

## 页面 1：首页（游戏集合页）
### Layout
- 桌面端：顶部导航 + 2–4 列卡片网格（CSS Grid）。
- 移动端：1 列卡片列表，筛选折叠为 Drawer。

### Meta Information
- Title：`休闲小游戏合集 | 第二/第三批`
- Description：突出“无需下载、移动端可玩、含排行榜”。

### Page Structure
1) 顶部导航区
2) 筛选/搜索区
3) 游戏卡片网格
4) SEO 文案与 FAQ 摘要区
5) 页脚

### Sections & Components
- 顶部导航（NavBar）
  - 左：站点 Logo
  - 中：导航项（首页/全部游戏 可选）
  - 右：搜索框（桌面端常显）
- 筛选区（FilterBar）
  - 标签：操作方式、单局时长、类型
  - 操作：清空、应用
- 游戏卡片（GameCard）
  - 封面图（16:9）、名称、一句话玩法、标签（如“60秒一局”）
  - CTA：立即游玩
- SEO/FAQ 摘要（SeoContentBlock）
  - 可渲染 3–6 条聚合 FAQ（模板化）

---

## 页面 2：游戏游玩页（/g/[slug]）
### Layout
- 桌面端：左侧主画布（或居中），右侧信息栏（排行榜入口/FAQ 目录/广告位）。Flex 双栏。
- 移动端：单列堆叠；画布置顶；HUD 与关键按钮贴近拇指区；FAQ 折叠。

### Meta Information
- Title/Description/OG 按全局模板，但按游戏内容填充。
- 结构化数据（建议）：FAQPage（由 FAQ 模板生成）。

### Page Structure
1) 顶部轻量栏（返回、游戏名、音效）
2) 游戏区域（Canvas/DOM 渲染容器）
3) HUD（分数/时间/步数/暂停/重开）
4) 广告位（至少预留 1 个可配置容器）
5) FAQ/玩法说明区
6) GameOver 弹层（覆盖在游戏区域之上）

### Sections & Components
- GameViewport
  - 容器固定比例：桌面端建议 16:9 或自适应；移动端优先保证可点击区域足够大
  - 触控映射：tap/swipe/drag（按游戏配置）
  - 横竖屏：默认竖屏；若游戏更适合横屏，则展示“旋转设备”提示层
- HUDBar
  - 左：分数（大号数字）
  - 中：时间/步数（按游戏启用）
  - 右：暂停、重开、音效
- AdSlot（占位组件）
  - Top Banner（可选）、GameOver 插屏位（必留）、Rewarded 位（可选）
  - 统一用占位骨架，便于后续接入广告 SDK
- FAQSection
  - 标题：玩法简介/规则/操作方式/常见问题
  - 交互：折叠面板（Accordion），默认展开前 2 条
- GameOverModal
  - 内容：本局得分、最佳分、（可选）排名提示
  - 表单：昵称输入（进榜或手动提交时出现）
  - CTA：再来一局、查看排行榜

---

## 页面 3：排行榜页（/g/[slug]/leaderboard）
### Layout
- 桌面端：榜单表格为主，右侧展示“我的最佳/提交记录（可选）”。
- 移动端：榜单列表卡片化；顶部吸顶切换（今日/本周/历史）。

### Meta Information
- Title：`{游戏名} 排行榜`
- Description：突出“Top 榜、我的最佳、更新频率”。

### Page Structure
1) 顶部栏（返回游戏、游戏名、分享可选）
2) 时间范围切换（Tabs）
3) 榜单展示（Table/List）
4) 我的最佳（SummaryCard）

### Sections & Components
- PeriodTabs
  - 今日 / 本周 / 历史（默认历史）
- LeaderboardList
  - 字段：排名、昵称、分数、日期
  - 空状态：暂无记录
- MyBestCard
  - 展示当前设备/昵称最佳分与（可选）估算排名

