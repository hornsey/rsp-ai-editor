
PRD v1 — RSP AI Editor（工作名）

1) 项目概述
- 项目名：RSP AI Editor  
- 阶段：02-product  
- 目标市场：US / English  
- 核心关键词：ai editor rsp editing  
- 上游证据：该词在最近90天起量，趋势强（2.16x, strong），意图偏“找可用编辑工具/资源”。

2) 一句话定位（Positioning）
为需要快速完成图片与文案微编辑的用户，提供一个免登录、即开即用的轻量 AI 编辑器，主打“上传→一键编辑→导出”。

3) ICP（至少3类）
1. 内容创作者（主ICP）  
   - 需求：快速改图、改文案、批量产出社媒素材  
   - 痛点：工具复杂、学习成本高、导出受限  
2. 中小商家运营  
   - 需求：低成本制作商品图/活动文案  
   - 痛点：没有设计团队，交付时效紧  
3. 学生/个人用户  
   - 需求：简历图、作业配图、简单润色  
   - 痛点：预算低，不愿注册付费再试

4) 用户任务（Jobs To Be Done）
- 我想在 3 分钟内完成一张图的基础编辑并下载。  
- 我想输入一句话，让系统给我 3 个编辑版本可选。  
- 我想不用注册，先试效果再决定是否升级。

5) 产品边界（Scope）
MVP 必做
- 图片上传与预览（jpg/png/webp）
- 一键 AI 编辑（3 个基础模式：enhance / remove bg / restyle）
- 文案辅助（标题/描述改写，3 个候选）
- 导出（带基础分辨率）
- 历史记录（本地会话级，非账号）

NOT-DO（首版不做）
- 不做复杂图层编辑（PS 级）
- 不做团队协作与项目管理
- 不做移动端原生 App
- 不做多语言（首版仅英文）

6) 差异化策略（vs 通用AI编辑器）
- 免登录试用路径（降低首跳流失）
- 任务化入口（不是空白画布，而是“我要去背景/我要优化商品图”）
- 快反馈（单次编辑目标 < 8s，失败可回退）

7) 站点类型判断
- 工具站（Tool-first）+ SEO 落地页 混合型  
- 首页承接搜索意图，工具页承接真实任务，内容页做长尾词与教育。

---

页面矩阵（Page Matrix）

1. /（index）
- 主词：ai editor rsp editing
- H1：RSP AI Editor — Edit Images & Copy in Seconds
- 目标：首访转化到工具页
- CTA：Start Editing Free
- Schema：SoftwareApplication, FAQPage
- 内链：/editor, /features, /pricing, /blog/*

2. /editor（index）
- 主词：ai image editor online
- H1：AI Editor (No Signup)
- 目标：核心任务完成页
- CTA：Upload Image
- Schema：SoftwareApplication
- 数据需求：编辑任务队列、导出状态、错误码

3. /features（index）
- 主词：ai photo enhancer / background remover
- H1：Features for Fast AI Editing
- 目标：功能解释 + 商业转化
- CTA：Try Feature Now

4. /pricing（index）
- 主词：ai editor pricing
- H1：Simple Pricing for Creators
- 目标：商业化承接
- CTA：Upgrade to Pro

5. /blog/ai-editor-rsp-editing-guide（index）
- 主词：ai editor rsp editing
- H1：How to Use AI Editor RSP Editing Workflow
- 目标：关键词精准承接 + 教育转化
- CTA：Open the Editor

6. /privacy /terms（index）
- 合规必备，避免后续404风险

---

功能需求（Functional Requirements）

F1 上传与编辑
- 支持拖拽上传，最大 10MB  
- 编辑模式：
  - Auto Enhance
  - Background Remove
  - Style Restyle
- 每次返回最多 3 个结果版本

F2 文案改写
- 输入原文，返回 3 个风格（clean / persuasive / concise）
- 支持一键复制

F3 导出
- 免费版：标准清晰度 + 水印 [待确认]
- Pro版：高清导出 + 无水印 [待确认]

F4 基础分析埋点
- 首次上传率、编辑完成率、导出率、升级点击率

---

非功能需求（NFR）
- 首屏加载 < 2.5s（桌面）
- 编辑结果返回 P95 < 8s
- 错误可解释（网络/格式/超限）
- 基础反滥用（频率限制 + 文件校验）

---

商业化与定价（草案）
- Free：每日有限次数 + 标准导出  
- Pro（月订阅）：更多次数 + 高清无水印 + 批量  
- [待确认] 是否加入 Lifetime（需结合获客成本）

---

Route Contract（初稿）
必须存在且可访问：
- /
- /editor
- /features
- /pricing
- /blog/ai-editor-rsp-editing-guide
- /privacy
- /terms
- /404

禁止假设：
- 不假设用户会注册后再试用
- 不假设用户理解复杂编辑术语

---

Competitive Minimum（可对标最低能力）
- 30 秒内完成第一次编辑闭环（上传→编辑→导出）
- 至少 3 个稳定编辑模式
- 明确的免费额度说明
- 合规页面齐全、无死链

---

风险清单
- P0：关键词可能品牌/噪音属性偏高，需人工SERP复扫验证可持续流量  
- P1：AI结果质量不稳导致留存差  
- P2：同类工具竞争激烈，需差异化入口与速度优势

---

给下游的最小必要信息
给文案
- 首页与工具页都要“任务导向”文案，不写泛AI口号

给设计
- 首屏必须 1 主 CTA + 3 个任务快捷入口
- 工具结果区要支持 before/after 对比

给前后端
- 先打通单任务流水线（上传→推理→导出）
- 埋点事件最少：upload_start / edit_success / export_click / paywall_view

---

质量门槛自检
- ✅ PRD 可开发，不是关键词说明  
- ✅ index 页面均有真实用户任务  
- ✅ NOT-DO 明确  
- ✅ 下游边界清晰  
- ⚠️ 待补：SERP Top3 竞品逐页拆解（功能/定价/流量入口）

---

产品定义与 PRD交接摘要

当前结论
- 状态：[NEEDS_REVIEW]
- 一句话结论：该词可做工具站切入，建议以“免登录快速编辑”做MVP，但需先补SERP人工复核与竞品拆解。

关键输入
- 项目：RSP AI Editor
- 当前阶段：02-product
- 上游资料：关键词趋势结果（strong, 90d新词）

本阶段交付物
- 文件/内容：PRD v1 + 页面矩阵 + Route Contract 初稿
- 核心判断：Tool-first + SEO 落地页混合
- 已确认项：MVP范围、页面结构、下游合同
- 待确认项：品牌词风险、定价细节、免费额度

风险
- P0：关键词可持续性
- P1：结果质量稳定性
- P2：同质化竞争

给下游的最小必要信息
- 下一阶段：定价、合规、文案、设计、前后端
- 必须读取：本PRD中的页面矩阵与NOT-DO
- 不能假设：用户愿意先注册
- 建议启动 Prompt：基于本PRD输出 Pricing v1 + Compliance checklist + Homepage copy deck

[NEEDS_REVIEW]
[2026/5/28 12:39] 乐研（调研）: 收到，按你要求我已经用 site-pricing-calibration + 合规 + 文案 三个阶段思路，基于现有 PRD 输出以下三份内容：

---

1) Pricing v1（RSP AI Editor）

 目标：先保证可用与不亏穿，再逐步提ARPU。  
 市场：US / English。  
 说明：具体成本数据缺失，以下含 [待确认] 参数位。

套餐矩阵（v1）

- Free
  - 价格：$0
  - 额度：每日 5 次图片编辑 + 10 次文案改写
  - 导出：标准分辨率（如 1024px）+ 水印 [待确认]
  - 历史记录：最近 24h（会话级）
  - 适用人群：首次试用、轻度用户
  - CTA：Start Free

- Pro Monthly
  - 价格：$12/mo（年付可 $9/mo）
  - 额度：每月 500 次图片编辑 + 1000 次文案改写
  - 导出：高清 + 无水印
  - 功能：优先队列、批量导出（上限 20/批）、历史记录 90 天
  - 适用人群：创作者、独立运营
  - CTA：Upgrade to Pro

- Team
  - 价格：$39/mo（3 席位起）
  - 额度：共享池 2500 次/月
  - 功能：简单协作（共享历史/模板）、账单管理、邮箱支持
  - 适用人群：小团队电商/内容工作室
  - CTA：Contact Sales（不承诺即时开通）

- Lifetime（可选，灰度）
  - 建议：先不上线公开售卖
  - 若上：$129 一次性，限制为 1500 次总编辑点数 + 基础支持
  - 理由：避免长期成本失控与滥用风险

商业模型校准（简版）

- 不写“无限次”“永久不限量”
- 免费额度要“能体验价值但不够重度生产”
- 成本守门指标（上线前必须补齐）：
  - 单次图像编辑成本 [待确认]
  - 平均免费用户日调用次数 [待确认]
  - 付费转化率目标（首月）2%~5% [待确认]
- 触发调价规则（建议）：
  - 若 Pro 用户毛利 < 65%，下调额度或上调价格
  - 若 Free 滥用率 > 8%，增加验证码/频控/导出限制

---

2) Compliance Checklist（上线前核对清单）

A. 法律页面与路由
- [ ] /privacy 存在且可访问
- [ ] /terms 存在且可访问
- [ ] /refund（若订阅）存在且可访问
- [ ] /cookie（使用分析/追踪时）存在且可访问
- [ ] 页脚全站可见并正确内链（不404）

B. 数据与第三方披露
- [ ] 披露收集数据：上传图片、提示词、设备/日志、支付信息（经支付服务商）
- [ ] 披露第三方处理商：AI推理、对象存储、分析工具、支付网关、邮件服务
- [ ] 披露用途：提供功能、反滥用、性能监控、账单与支持
- [ ] 披露保留期与删除机制（如“用户可请求删除”）

C. 账号与支付
- [ ] 自动续费条款清晰（周期、扣费时间、取消方式）
- [ ] 退款政策明确（天数/条件/不适用场景）
- [ ] 价格展示与结算一致（币种、税费提示）

D. AI与内容风险
- [ ] 声明“AI结果可能不完全准确”
- [ ] 禁止将输出冒充官方认证/法律/医疗建议
- [ ] 用户上传内容责任边界明确（不得侵权、违法）
- [ ] 提供侵权/投诉联络方式

E. 禁用表达（文案层）
- [ ] 禁用：official, 100% accurate, guaranteed, unlimited free
- [ ] 不用“完全免费”描述付费功能
- [ ] 不暗示与品牌官方关系（RSP词需加非官方说明）

F. 安全与运营最低要求
- [ ] 基础速率限制、防刷机制
- [ ] 上传文件类型/大小校验
- [ ] 敏感日志脱敏
- [ ] 异常告警与封禁流程

---

3) Homepage Copy Deck（首页文案包，英文）

 风格：短句、任务导向、避免空泛AI术语。  
 适配结构：Hero → Proof → Problem → Solution → How it works → Pricing teaser → FAQ → Final CTA

Hero
- H1: Edit Images & Copy in Seconds — No Signup Required
- Subhead: RSP AI Editor helps you enhance photos, remove backgrounds, and rewrite captions in one fast workflow.
- Primary CTA: Start Editing Free
- Secondary CTA: See How It Works

Proof Strip
- Fast turnaround for everyday edits  
- Beginner-friendly, task-based interface  
- Built for creators, sellers, and solo teams

Problem Section
- Title: Most editing tools are either too complex or too limited
- Bullets:
  - Too many controls for simple tasks
  - Slow iteration when you need quick outputs
  - Paywall before you can test real quality

Solution Section
- Title: One workflow for 80% of daily editing tasks
- Feature cards:
  1. Auto Enhance — Improve clarity and lighting instantly  
  2. Background Remove — Clean cutout for product and profile images  
  3. Smart Rewrite — Generate 3 caption options in different tones  

How It Works
1. Upload your image  
2. Pick an edit mode  
3. Export your result (and refine if needed)

Pricing Teaser
- Free for quick trials  
- Pro for higher volume, HD exports, and no watermark  
- CTA: View Pricing

FAQ (Homepage short)
- Do I need an account to start?  
  No. You can try core editing before signup.
- Can I use it for commercial projects?  
  Yes, subject to our Terms and content policy.
- Is output always perfect?  
  AI output quality may vary. You can regenerate and refine.

Final CTA Block
- Title: Ready to ship better visuals faster?
- Body: Start with free edits now. Upgrade only when your workflow grows.
- CTA: Start Editing Free

SEO Copy Freeze（首页）
- Target keyword: ai editor rsp editing
- Suggested title tag: RSP AI Editor | Fast Image & Copy Editing Online
- Meta description: Use RSP AI Editor to enhance photos, remove backgrounds, and rewrite copy in seconds. No signup required to start.
- H1 fixed: Edit Images & Copy in Seconds — No Signup Required

---
[2026/5/28 12:03] 乐研（调研）: 好的，下面给你一版基于关键词 “ai editor rsp editing” 的可执行 PRD v1（学员版，可直接交下游）。

PRD v1 — RSP AI Editor（工作名）

1) 项目概述
- 项目名：RSP AI Editor  
- 阶段：02-product  
- 目标市场：US / English  
- 核心关键词：ai editor rsp editing  
- 上游证据：该词在最近90天起量，趋势强（2.16x, strong），意图偏“找可用编辑工具/资源”。

2) 一句话定位（Positioning）
为需要快速完成图片与文案微编辑的用户，提供一个免登录、即开即用的轻量 AI 编辑器，主打“上传→一键编辑→导出”。

3) ICP（至少3类）
1. 内容创作者（主ICP）  
   - 需求：快速改图、改文案、批量产出社媒素材  
   - 痛点：工具复杂、学习成本高、导出受限  
2. 中小商家运营  
   - 需求：低成本制作商品图/活动文案  
   - 痛点：没有设计团队，交付时效紧  
3. 学生/个人用户  
   - 需求：简历图、作业配图、简单润色  
   - 痛点：预算低，不愿注册付费再试

4) 用户任务（Jobs To Be Done）
- 我想在 3 分钟内完成一张图的基础编辑并下载。  
- 我想输入一句话，让系统给我 3 个编辑版本可选。  
- 我想不用注册，先试效果再决定是否升级。

5) 产品边界（Scope）
MVP 必做
- 图片上传与预览（jpg/png/webp）
- 一键 AI 编辑（3 个基础模式：enhance / remove bg / restyle）
- 文案辅助（标题/描述改写，3 个候选）
- 导出（带基础分辨率）
- 历史记录（本地会话级，非账号）

NOT-DO（首版不做）
- 不做复杂图层编辑（PS 级）
- 不做团队协作与项目管理
- 不做移动端原生 App
- 不做多语言（首版仅英文）

6) 差异化策略（vs 通用AI编辑器）
- 免登录试用路径（降低首跳流失）
- 任务化入口（不是空白画布，而是“我要去背景/我要优化商品图”）
- 快反馈（单次编辑目标 < 8s，失败可回退）

7) 站点类型判断
- 工具站（Tool-first）+ SEO 落地页 混合型  
- 首页承接搜索意图，工具页承接真实任务，内容页做长尾词与教育。

---

页面矩阵（Page Matrix）

1. /（index）
- 主词：ai editor rsp editing
- H1：RSP AI Editor — Edit Images & Copy in Seconds
- 目标：首访转化到工具页
- CTA：Start Editing Free
- Schema：SoftwareApplication, FAQPage
- 内链：/editor, /features, /pricing, /blog/*

2. /editor（index）
- 主词：ai image editor online
- H1：AI Editor (No Signup)
- 目标：核心任务完成页
- CTA：Upload Image
- Schema：SoftwareApplication
- 数据需求：编辑任务队列、导出状态、错误码

3. /features（index）
- 主词：ai photo enhancer / background remover
- H1：Features for Fast AI Editing
- 目标：功能解释 + 商业转化
- CTA：Try Feature Now

4. /pricing（index）
- 主词：ai editor pricing
- H1：Simple Pricing for Creators
- 目标：商业化承接
- CTA：Upgrade to Pro

5. /blog/ai-editor-rsp-editing-guide（index）
- 主词：ai editor rsp editing
- H1：How to Use AI Editor RSP Editing Workflow
- 目标：关键词精准承接 + 教育转化
- CTA：Open the Editor

6. /privacy /terms（index）
- 合规必备，避免后续404风险

---

功能需求（Functional Requirements）

F1 上传与编辑
- 支持拖拽上传，最大 10MB  
- 编辑模式：
  - Auto Enhance
  - Background Remove
  - Style Restyle
- 每次返回最多 3 个结果版本

F2 文案改写
- 输入原文，返回 3 个风格（clean / persuasive / concise）
- 支持一键复制

F3 导出
- 免费版：标准清晰度 + 水印 [待确认]
- Pro版：高清导出 + 无水印 [待确认]

F4 基础分析埋点
- 首次上传率、编辑完成率、导出率、升级点击率

---

非功能需求（NFR）
- 首屏加载 < 2.5s（桌面）
- 编辑结果返回 P95 < 8s
- 错误可解释（网络/格式/超限）
- 基础反滥用（频率限制 + 文件校验）

---

商业化与定价（草案）
- Free：每日有限次数 + 标准导出  
- Pro（月订阅）：更多次数 + 高清无水印 + 批量  
- [待确认] 是否加入 Lifetime（需结合获客成本）

---

Route Contract（初稿）
必须存在且可访问：
- /
- /editor
- /features
- /pricing
- /blog/ai-editor-rsp-editing-guide
- /privacy
- /terms
- /404

禁止假设：
- 不假设用户会注册后再试用
- 不假设用户理解复杂编辑术语

---

Competitive Minimum（可对标最低能力）
- 30 秒内完成第一次编辑闭环（上传→编辑→导出）
- 至少 3 个稳定编辑模式
- 明确的免费额度说明
- 合规页面齐全、无死链

---

风险清单
- P0：关键词可能品牌/噪音属性偏高，需人工SERP复扫验证可持续流量  
- P1：AI结果质量不稳导致留存差  
- P2：同类工具竞争激烈，需差异化入口与速度优势

---

给下游的最小必要信息
给文案
- 首页与工具页都要“任务导向”文案，不写泛AI口号

给设计
- 首屏必须 1 主 CTA + 3 个任务快捷入口
- 工具结果区要支持 before/after 对比

给前后端
- 先打通单任务流水线（上传→推理→导出）
- 埋点事件最少：upload_start / edit_success / export_click / paywall_view

---

质量门槛自检
- ✅ PRD 可开发，不是关键词说明  
- ✅ index 页面均有真实用户任务  
- ✅ NOT-DO 明确  
- ✅ 下游边界清晰  
- ⚠️ 待补：SERP Top3 竞品逐页拆解（功能/定价/流量入口）

---

产品定义与 PRD交接摘要

当前结论
- 状态：[NEEDS_REVIEW]
- 一句话结论：该词可做工具站切入，建议以“免登录快速编辑”做MVP，但需先补SERP人工复核与竞品拆解。

关键输入
- 项目：RSP AI Editor
- 当前阶段：02-product
- 上游资料：关键词趋势结果（strong, 90d新词）

本阶段交付物
- 文件/内容：PRD v1 + 页面矩阵 + Route Contract 初稿
- 核心判断：Tool-first + SEO 落地页混合
- 已确认项：MVP范围、页面结构、下游合同
- 待确认项：品牌词风险、定价细节、免费额度

风险
- P0：关键词可持续性
- P1：结果质量稳定性
- P2：同质化竞争

给下游的最小必要信息
- 下一阶段：定价、合规、文案、设计、前后端
- 必须读取：本PRD中的页面矩阵与NOT-DO
- 不能假设：用户愿意先注册
- 建议启动 Prompt：基于本PRD输出 Pricing v1 + Compliance checklist + Homepage copy deck

[NEEDS_REVIEW]
[2026/5/28 12:39] 乐研（调研）: 收到，按你要求我已经用 site-pricing-calibration + 合规 + 文案 三个阶段思路，基于现有 PRD 输出以下三份内容：

---

1) Pricing v1（RSP AI Editor）

 目标：先保证可用与不亏穿，再逐步提ARPU。  
 市场：US / English。  
 说明：具体成本数据缺失，以下含 [待确认] 参数位。

套餐矩阵（v1）

- Free
  - 价格：$0
  - 额度：每日 5 次图片编辑 + 10 次文案改写
  - 导出：标准分辨率（如 1024px）+ 水印 [待确认]
  - 历史记录：最近 24h（会话级）
  - 适用人群：首次试用、轻度用户
  - CTA：Start Free

- Pro Monthly
  - 价格：$12/mo（年付可 $9/mo）
  - 额度：每月 500 次图片编辑 + 1000 次文案改写
  - 导出：高清 + 无水印
  - 功能：优先队列、批量导出（上限 20/批）、历史记录 90 天
  - 适用人群：创作者、独立运营
  - CTA：Upgrade to Pro

- Team
  - 价格：$39/mo（3 席位起）
  - 额度：共享池 2500 次/月
  - 功能：简单协作（共享历史/模板）、账单管理、邮箱支持
  - 适用人群：小团队电商/内容工作室
  - CTA：Contact Sales（不承诺即时开通）

- Lifetime（可选，灰度）
  - 建议：先不上线公开售卖
  - 若上：$129 一次性，限制为 1500 次总编辑点数 + 基础支持
  - 理由：避免长期成本失控与滥用风险

商业模型校准（简版）

- 不写“无限次”“永久不限量”
- 免费额度要“能体验价值但不够重度生产”
- 成本守门指标（上线前必须补齐）：
  - 单次图像编辑成本 [待确认]
  - 平均免费用户日调用次数 [待确认]
  - 付费转化率目标（首月）2%~5% [待确认]
- 触发调价规则（建议）：
  - 若 Pro 用户毛利 < 65%，下调额度或上调价格
  - 若 Free 滥用率 > 8%，增加验证码/频控/导出限制

---

2) Compliance Checklist（上线前核对清单）

A. 法律页面与路由
- [ ] /privacy 存在且可访问
- [ ] /terms 存在且可访问
- [ ] /refund（若订阅）存在且可访问
- [ ] /cookie（使用分析/追踪时）存在且可访问
- [ ] 页脚全站可见并正确内链（不404）

B. 数据与第三方披露
- [ ] 披露收集数据：上传图片、提示词、设备/日志、支付信息（经支付服务商）
- [ ] 披露第三方处理商：AI推理、对象存储、分析工具、支付网关、邮件服务
- [ ] 披露用途：提供功能、反滥用、性能监控、账单与支持
- [ ] 披露保留期与删除机制（如“用户可请求删除”）

C. 账号与支付
- [ ] 自动续费条款清晰（周期、扣费时间、取消方式）
- [ ] 退款政策明确（天数/条件/不适用场景）
- [ ] 价格展示与结算一致（币种、税费提示）

D. AI与内容风险
- [ ] 声明“AI结果可能不完全准确”
- [ ] 禁止将输出冒充官方认证/法律/医疗建议
- [ ] 用户上传内容责任边界明确（不得侵权、违法）
- [ ] 提供侵权/投诉联络方式

E. 禁用表达（文案层）
- [ ] 禁用：official, 100% accurate, guaranteed, unlimited free
- [ ] 不用“完全免费”描述付费功能
- [ ] 不暗示与品牌官方关系（RSP词需加非官方说明）

F. 安全与运营最低要求
- [ ] 基础速率限制、防刷机制
- [ ] 上传文件类型/大小校验
- [ ] 敏感日志脱敏
- [ ] 异常告警与封禁流程

---

3) Homepage Copy Deck（首页文案包，英文）

 风格：短句、任务导向、避免空泛AI术语。  
 适配结构：Hero → Proof → Problem → Solution → How it works → Pricing teaser → FAQ → Final CTA

Hero
- H1: Edit Images & Copy in Seconds — No Signup Required
- Subhead: RSP AI Editor helps you enhance photos, remove backgrounds, and rewrite captions in one fast workflow.
- Primary CTA: Start Editing Free
- Secondary CTA: See How It Works

Proof Strip
- Fast turnaround for everyday edits  
- Beginner-friendly, task-based interface  
- Built for creators, sellers, and solo teams

Problem Section
- Title: Most editing tools are either too complex or too limited
- Bullets:
  - Too many controls for simple tasks
  - Slow iteration when you need quick outputs
  - Paywall before you can test real quality

Solution Section
- Title: One workflow for 80% of daily editing tasks
- Feature cards:
  1. Auto Enhance — Improve clarity and lighting instantly  
  2. Background Remove — Clean cutout for product and profile images  
  3. Smart Rewrite — Generate 3 caption options in different tones  

How It Works
1. Upload your image  
2. Pick an edit mode  
3. Export your result (and refine if needed)

Pricing Teaser
- Free for quick trials  
- Pro for higher volume, HD exports, and no watermark  
- CTA: View Pricing

FAQ (Homepage short)
- Do I need an account to start?  
  No. You can try core editing before signup.
- Can I use it for commercial projects?  
  Yes, subject to our Terms and content policy.
- Is output always perfect?  
  AI output quality may vary. You can regenerate and refine.

Final CTA Block
- Title: Ready to ship better visuals faster?
- Body: Start with free edits now. Upgrade only when your workflow grows.
- CTA: Start Editing Free

SEO Copy Freeze（首页）
- Target keyword: ai editor rsp editing
- Suggested title tag: RSP AI Editor | Fast Image & Copy Editing Online
- Meta description: Use RSP AI Editor to enhance photos, remove backgrounds, and rewrite copy in seconds. No signup required to start.
- H1 fixed: Edit Images & Copy in Seconds — No Signup Required

---

---

1) /pricing Full Page Copy (EN)

SEO
- Title tag: Pricing | RSP AI Editor
- Meta description: Simple pricing for fast AI image and copy editing. Start free, upgrade when you need higher volume and HD exports.
- H1: Simple Pricing for Fast Editing

Hero
Headline: Start Free. Upgrade When It Saves You Time.  
Subhead: Built for creators, sellers, and small teams who need fast editing without complex tools.  
Primary CTA: Start Editing Free  
Secondary CTA: Compare Plans

Billing Toggle
- Monthly / Yearly (Save 25%)

Plan Cards

Free — $0
- Best for trying the workflow
- 5 image edits/day
- 10 copy rewrites/day
- Standard export quality
- Session history (24h)
- Watermark on exports [if enabled]
- CTA: Start Free

Pro — $12/month (or $9/month billed yearly)
- Best for active creators
- 500 image edits/month
- 1,000 copy rewrites/month
- HD exports
- No watermark
- Priority processing
- Batch export (up to 20 per batch)
- History retention (90 days)
- CTA: Upgrade to Pro

Team — $39/month (3 seats included)
- Best for small teams
- Shared pool: 2,500 edits/month
- Shared templates & history
- Team billing
- Priority email support
- CTA: Contact Sales

Trust / Clarification Strip
- No hidden fees  
- Cancel anytime  
- Secure checkout

FAQ
Q: Do unused credits roll over?  
A: No, monthly credits reset each billing cycle.

Q: What counts as one edit?  
A: One successful image generation/edit output counts as one edit. Regenerations count separately.

Q: Can I cancel anytime?  
A: Yes. Your plan remains active until the end of the billing period.

Q: Do you offer refunds?  
A: Please see our Refund Policy for eligibility and time windows.

Q: Is there an unlimited plan?  
A: No. We use clear usage limits to keep performance and pricing fair.

Final CTA
Headline: Ready to edit faster?  
Body: Start with Free. Upgrade when your workflow scales.  
CTA: Start Editing Free

---

2) Legal Drafts (EN, launch-ready v1)

 注意：以下是产品运营草稿，不构成法律意见。正式上线前建议法务复核。
