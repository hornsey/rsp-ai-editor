# 视觉设计与页面生成 Prompt 交付（ShipSolo 学员版）

项目：`rsp-ai-editor`  
当前阶段：`06-design`  
上游输入：`/root/rsp-ai-editor/docs`

---

## 0) Preflight 与输入契约检查（已补齐）

### 0.1 环境/依赖检查
- 账号/Token/浏览器登录态：本阶段不依赖（设计与交接文档产出），无需阻塞。
- 本地资料可读性：`/root/rsp-ai-editor/docs` 可访问，核心文档可读取。

### 0.2 已发现资料（有）
- Product：
  - `docs/prd.md`
- Copy：
  - `docs/copy/homepage-copy-deck.md`
  - `docs/copy/component-copy-map.md`
  - `docs/copy/faq-extended.md`
  - `docs/copy/footer-legal-links.md`
- Pricing：
  - `docs/pricing/pricing-v1.md`
- Legal：
  - `docs/legal/privacy.md`
  - `docs/legal/terms.md`
  - `docs/legal/refund.md`
  - `docs/legal/cookie.md`

### 0.3 输入契约缺口（剩余）
- 缺品牌资产终稿（Logo 安全区、品牌色 Token、字体授权说明）。
- 缺素材清单终版（截图/示例图/视频/图标来源与版权状态）。
- 缺设计稿实物导出（HTML/CSS 真源或 Figma frame 链接）。

### 0.4 结论
- `PRD` 与页面矩阵已补齐，可推进全站信息架构与模块设计。
- 当前阶段可输出：全站页面结构 + 组件状态 + 前端 handoff 规范。
- 状态判定：`[NEEDS_REVIEW]`（可开发推进，但品牌与素材终稿未冻结）。

---

## 1) 设计目标
1. 用户首屏 5 秒内理解：这是一个免登录、任务导向的 AI 编辑器。  
2. 用户 30 秒内完成首次尝试：上传 → 选择模式 → 看到结果。  
3. 保持转化路径清晰：免费试用与 Pro 升级边界明确。  
4. SEO 承接与工具转化统一：内容页导流到 `/editor`，工具页承接核心行为。

---

## 2) 用户路径（按 PRD）
1. 搜索进入 `/` 或 `/blog/*`，理解价值与适用场景。  
2. 点击 CTA 进入 `/editor`，完成首次上传/改写。  
3. 在结果区完成导出，触发首次“成功体验”。  
4. 遇到额度/清晰度/无水印需求时进入 `/pricing` 升级。  
5. 对能力细节存疑时前往 `/features` 和 FAQ 区确认。

---

## 3) 页面结构（全站）

### 3.1 `/` 首页（主转化页）
1. Hero：H1 + 子标题 + 主 CTA（Start Editing Free）+ 3 任务快捷入口
2. Task Shortcuts：Enhance / Remove BG / Restyle（任务化而非空白画布）
3. Proof Strip：速度、免登录、可导出三条证据
4. Core Features：三大能力卡 + 使用结果示意
5. How it Works：上传 → 编辑 → 导出（3 步）
6. Use Cases：Creator / Seller / Student
7. Pricing Teaser：Free vs Pro 对比摘要
8. FAQ Preview：关键疑问折叠（完整 FAQ 可下沉）
9. Final CTA + Legal Footer

### 3.2 `/editor` 工具页（核心任务页）
1. Upload Zone：拖拽/点击上传（jpg/png/webp，10MB）
2. Mode Tabs：Auto Enhance / Background Remove / Style Restyle
3. Prompt/Copy Assist：clean / persuasive / concise 三风格改写入口
4. Result Panel：最多 3 个结果版本 + before/after 对比
5. Export Bar：导出按钮、清晰度说明、水印说明
6. History Panel：本地会话级历史（非账号）
7. Error & Limit UI：格式错误/超限/网络错误/额度限制

### 3.3 `/features` 功能页（解释 + 转化）
1. 功能总览 Hero
2. 三功能深度说明（适用场景、输入要求、输出预期）
3. 速度与稳定性说明（P95 < 8s 目标）
4. 对比区（为何比通用编辑器更快上手）
5. CTA：Try Feature Now

### 3.4 `/pricing` 定价页（商业化承接）
1. H1 + 定价定位文案
2. Free / Pro 价格卡（如有 Team 可灰态占位）
3. 配额/水印/分辨率/批量能力对比
4. FAQ（支付、退款、商用）
5. CTA：Upgrade to Pro

### 3.5 `/blog/ai-editor-rsp-editing-guide` 内容页
1. 问题导入（搜索意图承接）
2. 步骤教程（图文分步）
3. 常见错误处理
4. 结果示例
5. CTA：Open the Editor

### 3.6 合规与兜底页面
- `/privacy`、`/terms` 必须在导航或页脚可达
- 建议补充 `/refund`、`/cookie` 直达（已存在法务文档）
- `/404` 提供回流 CTA（Back to Home / Open Editor）

---

## 4) 视觉风格（默认科技极简，抗模板化）
- 风格：Modern Utility（高可读、低装饰、强操作）
- 色彩 Token（建议）：
  - `--bg: #F7F8FA`
  - `--text-primary: #111315`
  - `--text-secondary: #5B6470`
  - `--border: #E6EAF0`
  - `--accent: #19C37D`
  - `--accent-hover: #12A66A`
- 字体：`Manrope`（标题）+ `Instrument Sans`（正文）
- 圆角体系：`8 / 12 / 20`
- 阴影体系：轻阴影 + 描边分层（避免重玻璃拟态）
- 间距体系：4pt 基线，主区块 64/80 垂直节奏
- 动效：150–200ms（hover、accordion、panel 切换）

---

## 5) 组件建议（含关键状态）
- `HeroPrimaryCTA`
- `TaskShortcutCard`
- `HeroEditorPanel`：`idle / uploading / generating / success / error / limit_reached`
- `ModeTabs`
- `CopyRewriteInput` + `RewriteResults(3 variants)`
- `ResultCompareSlider`（before/after）
- `ExportActionBar`（free/pro 提示）
- `PricingCards`
- `FAQAccordion`
- `LegalFooter`
- `ErrorBanner`（network/format/size/rate-limit）

---

## 6) 开发交接说明（前端可直接拆分）

### 6.1 布局与响应式
- Desktop `>=1200`：12 列栅格
- Tablet `768–1199`：8 列
- Mobile `<768`：单列
- `/editor` 结果区移动端改为上下布局（先输入，后结果）

### 6.2 文案与数据契约
- 全部文案从 `component-copy-map.md` 按 key 读取，不写死。
- 事件埋点最小集（PRD）：
  - `upload_start`
  - `edit_success`
  - `export_click`
  - `paywall_view`

### 6.3 路由契约对齐
PRD 必达路由：
- `/`
- `/editor`
- `/features`
- `/pricing`
- `/blog/ai-editor-rsp-editing-guide`
- `/privacy`
- `/terms`
- `/404`

建议补充直达（已有法务文档）：
- `/refund`
- `/cookie`

### 6.4 性能与可用性
- 首屏目标 `< 2.5s`（桌面）
- 编辑结果返回 `P95 < 8s`
- Hero 与编辑主面板优先渲染，其余模块延迟加载
- 错误提示必须可解释：网络/格式/超限

---

## 7) 可优化点（下一轮）
1. 增加“场景模板库”视觉入口（ecom/product/poster）。
2. 增加“失败重试建议”组件（提高编辑完成率）。
3. 设计 Pro 升级 paywall 的 A/B 两版（软提示 vs 硬弹层）。
4. 统一 blog 内嵌 CTA 模块样式，提高内容页导流效率。

---

## 8) 验收清单自检
- [x] 基于 PRD 输出了全站页面矩阵映射
- [x] 首页与编辑页均为任务导向，不依赖注册
- [x] 关键状态齐全（上传/处理中/成功/失败/额度）
- [x] 路由契约覆盖到 `/404`
- [x] 合规入口纳入 Footer 规划
- [ ] 品牌资产终稿未冻结（影响视觉终版）
- [ ] 素材版权清单未冻结（影响上线合规）
- [ ] 尚未附 HTML/CSS 真源或 Figma 链接

---

## 9) 风险分级
- P0：无
- P1：品牌系统未冻结，可能导致前端后续返工
- P1：素材版权状态未确认，可能卡上线
- P2：若 Free/Pro 配额文案未锁定，定价页需二次改版

---

## 10) 下游交接摘要

### 当前结论
- 状态：`[NEEDS_REVIEW]`
- 一句话：PRD 缺口已补齐，现可进入全站前端实现；但品牌资产/素材版权/设计真源文件未冻结，需二次复核后定版。

### 关键输入
- 项目：`rsp-ai-editor`
- 当前阶段：`06-design`
- 上游资料：`docs/prd.md` + `docs/copy/*` + `docs/pricing/pricing-v1.md` + `docs/legal/*`

### 本阶段交付物
- 文件/内容：本 `HANDOFF.md`（全站 IA + 组件状态 + 实现规范）
- 核心判断：Tool-first + SEO 混合站点；`/editor` 为主转化中枢
- 已确认项：页面矩阵、关键路由、交互状态、埋点最小集
- 待确认项：品牌视觉终稿、素材版权、最终设计真源链接

### 给下游最小必要信息
- 下一阶段：前端实现、QA
- 必须读取：
  - `docs/prd.md`
  - `docs/copy/component-copy-map.md`
  - `docs/pricing/pricing-v1.md`
  - `docs/legal/*.md`
- 不能假设：
  - 不可假设用户会先注册后试用
  - 不可假设“无限次数/无水印”默认可用
  - 不可假设第三方素材默认可商用

### 建议返修入口
- 当补齐品牌资产与素材清单后，回到 06-design 补交：
  - HTML/CSS 真源或 Figma 链接
  - Token 文件（颜色/字号/间距/圆角）
  - 移动端关键状态截图集

[NEEDS_REVIEW]
