# NES 模拟器新增页面 - 页面设计（桌面优先）

## Global Styles（全站/本功能通用）
- Layout 基础：桌面优先（≥1024px 为主），≤768px 自动切换为单列与触控布局。
- 设计令牌（建议）：
  - Background: #0B0F19（深色）/ #FFFFFF（浅色，若全站为浅色则沿用）
  - Text: #E5E7EB / #111827
  - Accent: #6366F1（主按钮与高亮）
  - Border: rgba(255,255,255,0.12) 或 #E5E7EB
  - 圆角：卡片 12px；按钮 10px
  - 阴影：卡片轻阴影（仅用于区分层级）
- Typography：
  - H1 28–32px / 700；H2 20–24px / 600；正文 14–16px
- Buttons：
  - Primary：Accent 背景 + 白字；Hover 提亮；Disabled 降低不透明度
  - Secondary：描边按钮
- Links：下划线或 hover 变色；保持可辨识

---

## Page 1：首页（新增入口与说明）
### Layout
- 结构：顶部导航（沿用全站）+ 主内容容器（max-width 1100–1200px）+ 卡片式入口区。
- 实现：CSS Grid（桌面 2–3 列卡片；移动端 1 列）。

### Meta Information
- title："PromptInc - NES 模拟器"
- description："在浏览器中本地上传并运行 NES ROM（本站不提供 ROM）。"
- OG：沿用站点默认；必要时追加页面标题

### Page Structure
1. Hero/标题区
2. 功能入口卡片区（含 NES 模拟器入口）
3. 使用须知与合规提示（静态内容）

### Sections & Components
- NES 模拟器入口卡片
  - 标题："NES 模拟器"
  - 描述："本地上传 ROM 运行；支持键盘与手机虚拟按键；不提供 ROM"
  - CTA："打开模拟器"（跳转 /nes）
- 使用须知（静态信息块）
  - 关键文案：不内置 ROM；ROM 由你自行提供；（如纯前端实现）不上传到服务器

---

## Page 2：NES 模拟器页（/nes）
### Layout
- 桌面：左右分栏（CSS Grid 12 列或 2 列）
  - 左侧（主区）：画面 Canvas + 状态栏
  - 右侧（侧栏）：ROM 上传区 + 键位说明 + 合规提示
- 移动端：上下堆叠（Canvas 在上，虚拟按键固定在下方或覆盖层）。
- 画面区域建议保持 4:3 比例（使用容器 aspect-ratio 控制），避免拉伸变形。

### Meta Information
- title："NES 模拟器 - 本地上传 ROM"
- description："上传你本地的 NES ROM，在浏览器中运行并使用键盘/触控按键操作。"
- OG：title 同上

### Page Structure
1. 顶部：页面标题 + 返回首页
2. 主运行区：Canvas + 状态/错误提示
3. 控制区：
   - 桌面：键盘提示
   - 移动端：虚拟按键（方向 + A/B + Start/Select）
4. 侧栏/下方：示例 ROM 一键试玩（含许可来源） + ROM 上传与说明

### Sections & Components
- 顶部栏（Header Row）
  - 左："返回"（回首页）
  - 中："NES 模拟器"
  - 右（可选仅展示状态）："未加载/加载中/运行中/出错"

- ROM 上传卡片（ROM Upload Card）
  - 文件选择按钮："选择 ROM 文件"
  - 文件信息：文件名、大小（只读展示）
  - 操作："重新选择"（覆盖当前 ROM）
  - 校验提示：
    - 未选择：提示你先选择 ROM
    - 不支持/读取失败：错误文案（清晰可理解）

- 示例 ROM 卡片（Sample ROMs）
  - 列表：3–5 个可自由分发 ROM
  - 每项展示：名称、简短描述、"试玩" 按钮
  - 许可与来源：明确展示许可名称与来源链接（新标签页打开）

- 模拟器画面区（Emulator Stage）
  - Canvas 容器：居中、可自适应缩放
  - 状态提示层：空态（未加载）、加载中、错误（可重试）

- 键盘控制说明（Keyboard Help）
  - 文本列表：方向键、A/B、Start/Select 的默认键位说明
  - 说明定位：桌面侧栏；移动端折叠为 "操作说明" 手风琴

- 移动端虚拟按键（Touch Controller，仅触屏显示）
  - 布局：
    - 左下：方向键（十字）或虚拟摇杆（四向即可）
    - 右下：A/B 两个大按钮
    - 中下：Start / Select 两个小按钮
  - 交互状态：
    - 按下：按钮高亮、轻微缩放（transition 120ms）
    - 多指：允许方向键与 A/B 同时按压（避免手指冲突）
  - 遮挡策略：控制区可使用半透明背景，避免遮住画面关键区域

- 合规提示（Compliance Notice）
  - 固定文案："本站不提供 ROM；请确保你拥有对应 ROM 的合法使用权。"

### Responsive Behavior
- ≥1024px：左右分栏；侧栏固定宽度 320–360px
- 768–1023px：侧栏下移至 Canvas 下方
- ≤767px：单列；虚拟按键固定底部（或覆盖层），Canvas 上方保留安全区域

### Accessibility
- 文件选择按钮与虚拟按键提供可聚焦样式
- 关键状态（错误/加载）使用文本可读提示，避免仅靠颜色区分
