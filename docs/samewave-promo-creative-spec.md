# Samewave × PromptInc 站内引流广告实施规范

> **交接对象**：负责 PromptInc 前端广告接入的开发代理。
> **目标**：在 PromptInc 的 18+ 游戏流量内，以不露骨、低干扰、可量化的品牌广告，将用户引导至 Samewave 的公开首页。
> **本文件优先级**：高于现有 `AdSlot` 的灰色占位呈现；不改变外部广告网络配置。

---

## 1. 已锁定的业务边界

1. PromptInc 全部游戏用户均为 **18+**，Samewave 素材可用于现有站内广告位。
2. Samewave 是成人兴趣内容服务，但 PromptInc 上的广告必须保持：**无人物、无裸露、无露骨动作、无露骨文字**。
3. 点击只进入 Samewave 公开首页，由 Samewave 自己完成成年人确认、内容发现和付费流程。
4. 禁止跳转至：支付页、特定私密内容页、Telegram 私密邀请链接、直接下载链接。
5. 禁止在游戏进行中打断操作；插屏仅允许在一局结束或用户主动触发的场景显示。

---

## 2. 统一落地页与追踪

### 2.1 跳转 URL

所有 Samewave 广告点击使用以下 URL；在新窗口打开，并添加安全属性：

```text
https://samewave.cc/?utm_source=promptinc&utm_medium=internal_ad&utm_campaign=adult_interest_discovery
```

链接实现要求：

```tsx
<a
  href="https://samewave.cc/?utm_source=promptinc&utm_medium=internal_ad&utm_campaign=adult_interest_discovery"
  target="_blank"
  rel="noopener noreferrer"
>
```

### 2.2 必须记录的事件

沿用 `lib/analytics` 的 `track()`，不新增外部分析 SDK。

| 时机 | 事件名 | 必填属性 |
| --- | --- | --- |
| 广告至少 25% 进入视口 | `samewave_promo_impression` | `slot`、`creative`、`format`、`placement` |
| 点击广告或 CTA | `samewave_promo_click` | `slot`、`creative`、`format`、`cta_variant` |
| 关闭插屏 | `samewave_promo_dismiss` | `slot`、`creative`、`dismiss_after_ms` |

不得记录用户姓名、邮箱、IP、游戏存档、敏感兴趣标签或 Samewave 的具体内容 ID。

---

## 3. 已生成的视觉素材

| ID | 文件 | 原始比例 | 用途 | 推荐展示尺寸 |
| --- | --- | --- | --- | --- |
| `samewave-native-v1` | `public/ads/samewave/samewave-native-300x250-v1.png` | 4:3 | 原生卡片、游戏结算后横幅 | 300×250；响应式最小宽 280px |
| `samewave-leaderboard-v1` | `public/ads/samewave/samewave-leaderboard-728x90-v1.png` | 宽横幅 | 页面顶部、底部、攻略和榜单页 | 728×90；移动端高度 96px |
| `samewave-interstitial-v1` | `public/ads/samewave/samewave-interstitial-mobile-v1.png` | 9:16 | 结算后可关闭推广弹层 | 最大宽 380px，最大高为视口 82vh |

### 3.1 图片渲染规则

- 使用 `object-fit: cover`，不拉伸变形。
- 原生卡片：中心 60% 作为文字安全区；文字不可压在四角的光线装饰上。
- 横幅：中心 55% 作为文字安全区；窄屏允许裁掉两侧装饰，不得裁掉中心文案或 CTA。
- 插屏：上半部分是标题区，下三分之一是按钮区；不要用图片内嵌文字。
- 图片 `alt` 统一为：`Samewave 18+ 内容发现推广`。
- 图片加载失败时保留深色渐变底、全部文案和 CTA，不出现破图图标。

---

## 4. 视觉与排版规范

| 项目 | 规范 |
| --- | --- |
| 容器背景 | `#121019` 至 `#241a37` 的暗色半透明渐变 |
| 主色 | `#B46CFF` |
| 高亮色 | `#F1D2FF` |
| 正文 | `#F7F3FA` |
| 辅助文字 | `#C6B8D6` |
| 圆角 | 卡片 16px；按钮 12px；插屏 20px |
| 描边 | `1px solid rgba(214, 168, 255, .28)` |
| 阴影 | `0 14px 40px rgba(0,0,0,.35)` |

```text
推广 · 18+                 12px / 600 / 字距 0.12em
探索属于你的同频空间         20px / 700
私密、尊重、由你决定节奏     14px / 400
[进入 Samewave]            14px / 700
```

- 不使用“色情”“裸聊”“成人视频”等字样。
- 不使用暗示立即付费、夸大承诺或诱导性倒计时。
- 广告容器左上角固定展示 `推广 · 18+`，不可隐藏。

---

## 5. 三种成品版式

### 5.1 原生卡片（300×250）

适用：`NativeAdBar`、`*-gameover-after-submit`、内容页内嵌。

```text
┌──────────────────────────────┐
│ 推广 · 18+                    │
│                                │
│   探索属于你的同频空间          │
│   私密、尊重、由你决定节奏      │
│                                │
│              [进入 Samewave]  │
└──────────────────────────────┘
```

- 整张卡片可点击；CTA 保留独立按钮语义。
- CTA 文案 A/B：`进入 Samewave` / `查看同频内容`。
- 不自动展开，不自动播放声音或视频。

### 5.2 横幅（728×90）

适用：`home-top`、`home-bottom`、`*-top`、`*-bottom`。

```text
Samewave · 18+   在尊重与边界中，发现同频连接             [进入]
```

- 桌面：单行，CTA 右对齐。
- 移动：标题与 CTA 保留同一行；中间副文案可隐藏，不能溢出或换成两行。
- 最小高度 76px，最大高度 96px。

### 5.3 结算后插屏（9:16）

适用：`*-interstitial` 和 `*-gameover-modal`。

```text
                 [关闭 ×]

              SAMEWAVE · 成人专属
             发现你真正感兴趣的内容
             进入后完成年龄确认

              [继续探索]
              [暂不进入]
```

- 仅在一局结束后触发；不可覆盖正在进行的游戏。
- 关闭按钮从打开瞬间就可用，不倒计时、不隐藏。
- `暂不进入` 只关闭本次弹层；同一会话内 30 分钟不再展示。
- 同一用户每天最多展示 2 次；同一游戏会话最多展示 1 次。

---

## 6. 现有广告位接入矩阵

| PromptInc 位置 | 现有标识 | 接入素材 | 展示策略 |
| --- | --- | --- | --- |
| 首页顶部/底部 | `home-top`、`home-bottom` | 横幅 | 每页可展示 1 次；优先首页底部 |
| 榜单/标签/攻略页顶部/底部 | `*-top`、`*-bottom` | 横幅 | 顶部优先；同页不重复两个 Samewave 广告 |
| 游戏结束后的横幅 | `*-gameover-after-submit` | 原生卡片 | 推荐，用户可自然选择点击 |
| 游戏结束模态框 | `*-gameover-modal` | 原生卡片或小插屏 | 可关闭，不自动跳转 |
| 游戏插屏 | `*-interstitial` | 移动插屏 | 仅结算后；按第 5.3 节频控 |
| `NativeAdBar` | `data-ad-type="native"` | 原生卡片 | 推荐作为首期试点 |

### 去重规则

1. 一次页面浏览最多展示 1 个 Samewave 横幅位。
2. 结算后已出现 Samewave 插屏时，后续的 `gameover-after-submit` 不再展示 Samewave 卡片。
3. 同一用户 24 小时内最多记录 10 次 Samewave 曝光；超出后不再渲染。

---

## 7. 动画与交互要求

| 元素 | 动画 | 时长 | 触发 |
| --- | --- | --- | --- |
| 原生卡片 | 淡入 + 上移 6px | 220ms | 首次进入视口 |
| 横幅背景波纹 | 极慢横向位移 | 8–12s、线性、无限 | 未开启减少动态效果时 |
| CTA | hover 亮度 + 轻微上移 1px | 160ms | 指针悬停/键盘聚焦 |
| 插屏 | 背景淡入、卡片由下向上 12px | 220ms | 打开 |
| 关闭 | 淡出 | 140ms | 点击关闭或 Esc |

### 禁止项

- 禁止闪烁、跳动、摇晃、倒计时、自动播放音频。
- 禁止全屏弹层自动跳转。
- 禁止超过 2 个同时运动的元素。
- 支持 `prefers-reduced-motion: reduce`：关闭所有背景循环和位移动画。

### 点击与键盘行为

- CTA 点击：先记录 `samewave_promo_click`，再使用新窗口打开统一 URL。
- 整卡点击与 CTA 点击必须只记录 **一次** click 事件。
- 插屏：`Escape`、关闭图标、`暂不进入` 都应关闭；焦点限制在弹层内，关闭后回到原触发元素。
- 所有可点击元素必须可通过 `Tab` 到达，焦点态清晰可见。

---

## 8. 推荐组件接口

新增独立组件；不要污染外部广告网络的 `AD_CONFIG`：

```ts
type SamewavePromoProps = {
  placement: "banner" | "native" | "interstitial";
  slot: string;
  ctaVariant?: "enter" | "discover";
  onDismiss?: () => void;
};
```

组件职责：

1. 根据 `placement` 选择图片、布局和 CTA 文案。
2. 使用统一 URL 和 UTM 参数。
3. 发送曝光、点击、关闭事件。
4. 执行第 6 节的去重与第 5.3 节的频率限制。
5. 图片失败时降级到深色渐变卡片，不能让页面布局塌陷。

不要：

- 将 Samewave 链接写进 `AD_CONFIG.nativeCode` 的 `dangerouslySetInnerHTML`。
- 使用第三方脚本、弹窗脚本或新广告网络代码。
- 在客户端硬编码任何支付、Telegram、用户身份或内容 ID。

---

## 9. A/B 测试与判定

| 变量 | A 版 | B 版 |
| --- | --- | --- |
| CTA | `进入 Samewave` | `查看同频内容` |
| 卡片位置 | 首页底部 | 游戏结算后 |

- 用稳定匿名 ID 做 50/50 分流；同一用户 7 天内不可换组。
- 每组至少 300 次有效曝光，且至少运行 7 天。
- 主指标：`click / impression`。
- 次指标：Samewave 落地页的成年人确认完成率（由 Samewave 侧 UTM 汇总）。
- 仅当 CTR 提升 ≥20%，且落地页完成率不下降超过 10%，才替换默认版本。

---

## 10. 开发验收清单

### 功能

- [ ] 三种广告位均使用正确素材、文案与统一 URL。
- [ ] 所有链接新窗口打开，包含 `noopener noreferrer`。
- [ ] 曝光、点击、关闭事件字段完整且不包含敏感信息。
- [ ] 同页、会话、每日频控和去重符合第 6 节。
- [ ] 图片加载失败后仍展示完整文案和 CTA。

### 体验

- [ ] 320px、375px、768px、1280px、1440px 宽度无溢出、无拉伸、无文字截断。
- [ ] 移动横幅为单行，CTA 可点击。
- [ ] 插屏可立即关闭；Esc、生效焦点、回焦均正确。
- [ ] `prefers-reduced-motion` 下没有循环动画。
- [ ] 游戏进行中不出现 Samewave 插屏。

### 质量

- [ ] `pnpm lint`、`pnpm build`、现有 Playwright 测试通过。
- [ ] 新增组件单测：URL、UTM、事件、频控、关闭、降级渲染。
- [ ] 新增 Playwright：首页横幅、游戏结束原生卡片、插屏关闭及新窗口跳转。
