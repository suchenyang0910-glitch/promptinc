# 页面设计文档（Desktop-first）

## 全站通用规范

### Layout
- 桌面优先：内容容器 `max-width: 1024–1200px` 居中，左右留白；主要区块纵向堆叠，区块之间 24–40px 间距。
- 列表区块采用 CSS Grid：桌面 2 列卡片，移动端 1 列；卡片内部用 Flex 处理标题/描述/CTA 对齐。

### Meta Information（规则）
- 每个增长页需提供：`title`、`description`、`canonical`、Open Graph（如有）、必要时添加 JSON-LD（CollectionPage / WebPage）。
- 对“集合页”（/top、/compare、/tags）优先使用 CollectionPage 并包含 hasPart 指向详情页，增强可理解性。

### Global Styles（设计令牌建议）
- 背景：`slate-950`；卡片：`slate-900`；边框：`slate-800`。
- 主强调色：蓝色 CTA（按钮/链接 hover）；次要文本：`slate-400`。
- 链接：默认灰，hover 变白/强调色；避免下划线泛滥，仅在正文可用下划线。
- 广告位：统一容器样式（圆角、边框、占位高度固定），避免 CLS。

### 安全与可观测（与页面交互相关）
- CSP Report-Only 阶段：不影响页面展示；在灰度 Enforce 时，确保广告/统计脚本域名纳入白名单，否则会直接影响变现与数据。

---

## 页面：Top 列表页（/top）

### Page Structure
1) 顶部标题区（H1 + 一句话价值）
2) 顶部广告位（Banner）
3) 榜单卡片网格（2 列）
4) Explore More（内链增长块：Tags + Quick Compare）
5) 底部广告位（Banner）
6) Footer

### Sections & Components
- 榜单卡片（核心增长组件）
  - 标题（去掉站点后缀）、描述、主 CTA（Open List）。
  - 卡片整体可点击，CTA 保持强对比。
- Explore More（内链增长块）
  - 导航短链：Compare / Tags。
  - Tags：展示 Top N 标签（去重、短词优先）；点击到 /tags/[tag]。
  - Quick Compare：展示 6 个对比入口（主题相关优先，避免完全随机导致跳出）。
- 广告（变现组件）
  - Top/Bottom Banner：两处即可，避免在集合页过度插入影响爬虫与体验。

---

## 页面：Top 详情页（/top/[slug]）

### Page Structure
1) 头部（H1 + 简述）
2) 首屏广告位（可选，若影响体验则放在首屏后）
3) 榜单内容列表（游戏卡片/条目）
4) 内链增长块（相关 Tags / 相关 Compare / 相关 Top）
5) 末尾广告位
6) Footer

### Sections & Components
- 榜单内容列表
  - 每条目提供：游戏名、emoji/缩略信息、到游戏详情/玩法页的链接。
- 内链增长块（关键）
  - 相关 Tags：优先取该榜单覆盖游戏的共同/高频标签。
  - 相关 Compare：优先推荐“榜单前几名之间”的对比入口，提升相关性。
  - 相关 Top：同主题或同品类榜单。
- 广告位
  - 建议在“内容中段”与“末尾”放置，避免与内链块同屏抢注意力。

---

## 页面：Compare 列表页（/compare）

### Page Structure
1) 顶部轻导航（Home/Games/Top/Categories/Tags）
2) 标题区（H1 + 简述）
3) Explore More（Top 入口卡片 + Tags）
4) 对比入口卡片网格（2 列）
5) Footer

### Sections & Components
- 对比入口卡片
  - 主标题：A vs B；副信息：品类；CTA：Open comparison。
  - 卡片内部层级清晰，避免信息过载。
- Explore More
  - 固定露出 Top 与 Tags，形成闭环流量。

---

## 页面：Compare 详情页（/compare/[pair]）

### Page Structure
1) 标题区（H1：A vs B + 简述）
2) 首屏广告位（建议放在首屏下方）
3) 对比主体（左右两列对比表/卡片）
4) 行动区（去玩/看攻略/看榜单）
5) 内链增长块（更多相似对比 + 相关 Tags + 相关 Top）
6) 末尾广告位

### Sections & Components
- 对比主体
  - 两列并排：关键信息对齐（品类、标签、玩法要点、推荐人群）。
  - 若内容较长：用“分组标题 + 对齐行”提升扫读效率。
- 内链增长块（提高页面深度）
  - 更多相似对比：共享标签/同品类优先。
  - 相关 Tags：展示 6–12 个，避免堆砌。
  - 相关 Top：提供 3–6 个榜单入口。

---

## 页面：Tags 列表页（/tags）

### Page Structure
1) 标题区（H1 + 简述）
2) 顶部广告位（Banner）
3) 标签云/标签按钮列表（可换行）
4) Curated Lists（Top 入口卡片）
5) Quick Compare（对比入口）
6) 底部广告位（Banner）
7) Footer

### Sections & Components
- 标签按钮
  - 统一尺寸与 hover；点击区域大于 40px 高度，提升可用性。
  - 桌面展示更多标签；移动端可分组/折叠（可选）。
- Curated Lists / Quick Compare
  - 作为“从标签页走向更深内容”的二跳组件。

---

## 页面：Tag 详情页（/tags/[tag]）

### Page Structure
1) 标题区（H1：#tag + 简述）
2) 顶部广告位
3) 标签下内容列表（游戏卡片列表）
4) 内链增长块（相关标签 / 相关对比 / 相关榜单）
5) 末尾广告位
6) Footer

### Sections & Components
- 内容列表
  - 主目标：让搜索流量快速找到“可点击的下一页”（游戏/攻略/榜单）。
- 内链增长块（闭环）
  - 相关标签：同一批游戏的高频标签。
  - 相关对比：优先取列表头部游戏之间的对比。
  - 相关榜单：同主题 Top。

---

## 广告组件（AdSlot）展示规范（适用于以上页面）
- 版位命名：与页面/位置绑定（如 top-index-top、tags-bottom），便于投放与 A/B。
- 加载策略：延迟加载 + 固定占位高度，降低 CLS；不阻塞首屏内容渲染。
- 可见率目标：首屏下方 1 个、内容末尾 1 个为主；集合页避免“卡片网格中插多广告”导致体验下降。
