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