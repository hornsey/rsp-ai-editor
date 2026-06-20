# PRD v2 — RSP AI Editor（US Market / Workflow Edition）

## 1. 文档目标
- 基于 `input/prd0620.md` 与 `input/tech0620.md`，将原有“轻量 AI 编辑器”升级为更适合欧美市场、可指导设计/前后端/增长协作的产品文档。
- 本文档同时约束：
  - **当前 MVP 必做范围**
  - **中期产品升级方向**
  - **哪些是策略升级，不等于首版必须实现**

## 2. 项目概述
- 项目名：RSP AI Editor
- 阶段：02-product
- 目标市场：US / English
- 产品类型：Tool-first SEO site + Web editor
- 核心关键词入口：`ai editor rsp editing`
- 核心转化路径：`/` 或 `/blog/*` → `/editor` → 导出成功 → `/pricing`

---

## 3. 一句话定位
**RSP AI Editor 是一个免登录、任务导向的 AI 图像编辑工作流产品，帮助非设计用户在几秒内把普通图片变成可直接使用的内容资产。**

英文对外口径建议：
> Turn any image into a clean, usable asset in seconds using AI.

更偏商业化定位的内部口径：
> The fastest way for sellers, creators, and everyday users to turn raw photos into usable image assets without learning complex design tools.

---

## 4. 为什么值得做
### 4.1 市场判断
- 用户并不想“学习一个编辑器”，而是想**完成一个任务**。
- 美国市场对 task-based image tools 接受度高，且 SEO 工具页仍有持续流量空间。
- 相比做一个“在线 Photoshop”，做“任务型 AI 图像工作流”更容易：
  - 降低首次使用门槛
  - 匹配搜索意图
  - 更容易做付费升级
  - 更适合小团队快速验证

### 4.2 核心判断
本产品不是和 Canva / Photoshop 正面拼“全能编辑能力”，而是聚焦：
- 上传图片
- 识别任务
- 自动生成高可用结果
- 快速导出

也就是说，产品竞争点不在“工具数量”，而在：
- 更快完成任务
- 更少学习成本
- 更符合真实使用场景
- 更清晰的免费→付费路径

---

## 5. 目标用户（ICP）

### 5.1 主 ICP：中小商家 / 电商卖家
典型用户：Amazon / Shopify / Etsy 卖家
- 任务：把普通商品图快速变成可上架、可投放、可展示的素材
- 痛点：不会 PS、没有设计团队、交付时间紧
- 最看重：结果可卖、速度快、白底/商品图合规感强
- 付费意愿：高

### 5.2 次 ICP：内容创作者
典型用户：YouTube / TikTok / Instagram creators
- 任务：快速做缩略图、封面图、社媒视觉素材
- 痛点：要快、要能试错、不能被复杂 UI 拖慢
- 最看重：可直接出片、风格明确、导出方便
- 付费意愿：中高

### 5.3 次 ICP：普通个人用户 / 办公用户
典型用户：学生、求职者、office users
- 任务：去背景、证件照、简历配图、简单润色
- 痛点：低频但刚需，不愿先注册或先付费
- 最看重：简单、便宜、一次性完成
- 付费意愿：中

### 5.4 非目标用户
- 专业设计师深度修图工作流
- 需要复杂图层、路径、钢笔工具、模板协作的大团队
- 原生移动 App 重度场景
- 多语言国际化首发场景

---

## 6. 用户任务（Jobs To Be Done）
### JTBD-1 商品图
“我想把一张普通商品照片快速变成更干净、更像电商主图的可用素材。”

### JTBD-2 社媒素材
“我想在几分钟内把一张图处理成能发内容、做封面的素材，不想学复杂编辑器。”

### JTBD-3 日常处理
“我只想去背景 / 润色 / 改风格，先试效果，再决定是否付费。”

### JTBD-4 文案辅助
“我想在处理图片的同时，顺手拿到几条可直接用的标题/描述改写结果。”

---

## 7. 产品核心原则
1. **No-signup-first**：不要求用户注册后才能第一次试用。
2. **Task-first**：优先让用户选任务，不让用户面对空白画布。
3. **Fast-first**：首次成功体验要尽量压缩到 30 秒内。
4. **Commercially useful**：输出不是“有趣”，而是“能用”。
5. **SEO-friendly**：每个能力都可以发展成独立流量页。
6. **MVP 收敛**：先把高频任务做稳，再扩功能矩阵。

---

## 8. 产品定位升级：从编辑器到工作流系统
### 8.1 当前 MVP 的对外产品定义
当前首版仍然是：
- 一个轻量 AI image editor
- 以 `/editor` 为核心任务页
- 支持 3 个基础模式：`enhance` / `remove-bg` / `restyle`
- 带 3 种 copy rewrite 风格：`clean` / `persuasive` / `concise`

### 8.2 中期战略定义
中期不应停留在“3 个模式的编辑器”，而应演进为：
**AI image task routing system / AI image workflow platform**

这意味着：
- 用户输入图片和目标任务
- 系统自动判断适合的处理策略
- 不同场景走不同约束逻辑
- 输出结果更稳定、更贴近商业用途

### 8.3 关键升级点
不是马上拆成很多模型，而是先拆成**策略层**：
- Task Router
- Prompt Builder
- Mask / Region Control

---

## 9. 核心产品策略
### 9.1 SEO Tool Stack + Editor
站点结构应支持两层能力：
- **工具页**：承接真实任务并完成转化
- **SEO 落地页**：承接长尾搜索并导流到工具页

中期可扩展的独立流量页包括：
- `/remove-background`
- `/image-upscaler`
- `/remove-object`
- `/passport-photo-maker`
- `/product-photo-editor`
- `/youtube-thumbnail-maker`

### 9.2 差异化主张
我们不是：
- 在线 Photoshop
- Canva 替代品
- 全能设计平台

我们是：
- 面向非设计用户的任务型 AI 图像处理产品
- 强调“上传 → 一键得到可用结果 → 导出”
- 更适合卖家、创作者、普通办公用户

### 9.3 竞争最低标准
至少要达到：
- 30 秒内完成第一次编辑闭环
- 3 个基础模式稳定可用
- 免费额度清晰
- 导出路径清晰
- 合规页面齐全
- 错误状态可解释

---

## 10. Pipeline 产品定义
> 这是中期产品架构方向，不要求首版就全部外显。

### 10.1 三类核心 Pipeline
#### A. Product Image Pipeline
目标：让商品图更可卖
- 典型任务：去背景、白底图、补光、商品图清理、工作室质感增强
- 约束：主体形状尽量不变、边缘干净、输出有商业摄影感
- 商业价值：最高

#### B. Portrait Pipeline
目标：让人像更好看，但保持身份一致
- 典型任务：人像润色、背景替换、证件照、头像优化
- 约束：不能变脸、不能明显改五官、发丝细节重要
- 商业价值：中高

#### C. Generic Editing Pipeline
目标：支持更自由的通用图像编辑
- 典型任务：风格转换、局部重绘、加物体、场景修改
- 约束：最低，允许一定生成变化
- 商业价值：中

### 10.2 产品结论
- MVP 阶段可以继续用单一主模型 + 模式化 prompt 跑通
- 但正式产品设计必须为 pipeline 分层预留空间
- 关键不是“立刻换 3 个模型”，而是先做：
  - 任务识别
  - Prompt 策略分层
  - 区域/主体保护

### 10.3 对前后端的产品要求
首版即使不显式展示 pipeline，也应在数据和接口层保留：
- `task_type`
- `subject_type`（可后续扩展）
- `prompt`
- `mask/region`（可选）
- `result_status`
- `credits_used`

---

## 11. MVP 范围
### 11.1 P0 / 首版必须做
#### 编辑闭环
- 图片上传与预览
- 文件校验：JPG / PNG / WebP，10MB 以内
- 3 个编辑模式：
  - Auto Enhance
  - Background Remove
  - Style Restyle
- 单任务处理与结果轮询
- 导出结果
- 本地会话级历史记录

#### 文案辅助
- 输入文案
- 返回 3 个风格改写：
  - clean
  - persuasive
  - concise
- 支持一键复制

#### 商业化基础
- 免费额度展示
- `/pricing` 页面
- Pro / Max / Credit Packs 定价展示
- paywall / 升级提示基础能力

#### SEO 与合规基础
- 首页
- 功能页
- 定价页
- 博客承接页
- 法务页面：`/privacy` `/terms` `/refund` `/cookie`
- 自定义 404

### 11.2 P1 / 第一轮增长迭代
- 上传后自动推荐更匹配的任务
- Product Image 场景文案与模板强化
- 更明确的 before/after 对比能力
- 更好的失败重试和错误建议
- 独立 SEO 工具页（至少 1–2 个）

### 11.3 P2 / 中期扩展
- Object Removal
- Image Upscaler
- White Background / Amazon-ready 商品图
- Passport / ID Photo
- Thumbnail Generator
- Batch processing
- API / automation 入口

### 11.4 NOT-DO（首版不做）
- 不做复杂图层编辑
- 不做专业设计器工作台
- 不做团队协作与项目管理
- 不做原生移动端 App
- 不做多语言 UI
- 不做 Team / Lifetime 套餐对外售卖
- 不做“无限使用”宣传

---

## 12. 核心用户流程
### 12.1 当前 MVP 核心流程
1. 用户从首页 / 内容页进入
2. 点击 CTA 进入 `/editor`
3. 上传图片
4. 选择模式（enhance / remove-bg / restyle）
5. 系统处理并返回结果
6. 用户对比结果并导出
7. 遇到额度、高清、无水印需求时进入 `/pricing`

### 12.2 中期优化流程
1. Upload Image
2. Auto Detect Subject / Task Type
3. Suggest Best Action
4. One-click generate
5. Optional tweak / rewrite
6. Export

### 12.3 成功定义
以下至少满足一项：
- 用户完成首次导出
- 用户获得满意结果并保存历史
- 用户因额度/质量需求点击升级

---

## 13. 页面 / 路由结构
### 必达 Route Contract
- `/`
- `/editor`
- `/features`
- `/pricing`
- `/blog/ai-editor-rsp-editing-guide`
- `/privacy`
- `/terms`
- `/refund`
- `/cookie`
- `/404`（或框架自定义 not-found 对外等效）

### 页面目标定义
#### `/`
- 目标：解释产品价值并导流到 `/editor`
- H1：RSP AI Editor — Edit Images & Copy in Seconds
- CTA：Start Editing Free
- 核心模块：Hero / 任务快捷入口 / 核心能力 / How it works / Pricing teaser / FAQ

#### `/editor`
- 目标：完成首次任务闭环
- H1：AI Editor (No Signup)
- CTA：Upload Image
- 核心模块：Upload / Mode Tabs / Result Panel / Export / Copy Rewrite / History / Error States

#### `/features`
- 目标：解释能力与适用场景，承接犹豫用户
- CTA：Try Feature Now

#### `/pricing`
- 目标：承接升级与补量购买
- CTA：Choose Your Plan

#### `/blog/ai-editor-rsp-editing-guide`
- 目标：承接 SEO 精准意图并导流到工具页
- CTA：Open the Editor

#### 法务页
- 目标：补齐上线合规与支付信任基础

---

## 14. 功能需求（Functional Requirements）
### F1 上传与校验
- 支持拖拽与点击上传
- 格式：JPG / PNG / WebP
- 大小限制：10MB
- 错误需可解释：格式错误 / 超限 / 网络失败

### F2 图像编辑
- 支持 `enhance` / `remove-bg` / `restyle`
- 返回 1 个主结果即可；UI 可展示对比与变体，但不能误导为真实生成了多个独立结果
- 支持任务状态：`pending` / `processing` / `done` / `failed`
- 失败时允许重试或返回说明

### F3 Copy Rewrite
- 输入原文
- 返回 3 种改写风格：`clean` / `persuasive` / `concise`
- 支持一键复制
- 结果文案必须可直接消费，不能是明显占位符

### F4 导出
- 免费版：标准导出质量
- 付费版：高清导出、无水印
- 对免费限制与付费权益说明清晰

### F5 会话与历史
- 支持匿名会话
- 历史记录默认为本地会话级，不对外宣称账号云同步

### F6 定价与权益
- Free：5 image edits/day + 10 copy rewrites/day
- Pro：$12/mo 或 $108/year，1,200 credits/month
- Max：$28/mo 或 $252/year，3,500 credits/month
- Credit Packs：
  - Starter Pack：500 / $6.9（首购一次）
  - Standard Pack：1,500 / $26.9
  - Growth Pack：3,000 / $48.9
  - Scale Pack：6,000 / $86.9
- 不展示 Team / Lifetime

### F7 埋点
最小埋点事件：
- `upload_start`
- `edit_success`
- `export_click`
- `paywall_view`

建议补充：
- `upload_error`
- `edit_failed`
- `pricing_cta_click`
- `rewrite_success`

---

## 15. 数据与接口的产品约束
### 15.1 最小数据字段
建议至少保留：
- `session_id`
- `plan`
- `task_id`
- `task_type`
- `mode`
- `prompt`
- `input_url`
- `output_url`
- `status`
- `credits_used`
- `created_at`

### 15.2 面向未来 pipeline 的扩展字段
- `subject_type`：product / portrait / generic
- `mask_region`：可选
- `router_reason`：可选
- `output_variant_count`：可选

### 15.3 产品规则
- 计费口径应与真实处理一致，不能让用户误以为生成了多个真实版本但实际上只是前端复制展示
- copy rewrite 不能长期维持 placeholder 结果
- 若未来加入任务自动推荐，应在结果页明确推荐原因，而不是黑盒跳转

---

## 16. 非功能需求（NFR）
- 首屏加载：桌面目标 < 2.5s
- 编辑结果返回：P95 < 8s（目标）
- 错误提示可解释
- 有基础反滥用与频率限制
- 移动端可用，不要求移动端高级编辑体验
- SEO 页面需可抓取、可索引、无死链

---

## 17. 商业化原则
### 17.1 付费逻辑
用户应先获得一次“可感知成功体验”，再遇到：
- 更高质量导出
- 更高频使用
- 更多 credits 需求
- 无水印需求

然后进入付费。

### 17.2 禁止口径
- 不宣称 unlimited
- 不售卖未实现的团队协作能力
- 不把 Credit Pack 包装成比订阅更划算的长期方案

### 17.3 转化触发点
- 导出前升级提示
- 额度用尽提示
- 高清导出提示
- 批量 / 高级需求提示

---

## 18. SEO 与增长结构
### 18.1 当前结构
- 首页：品牌词 + 总入口
- 博客页：教育与意图承接
- `/editor`：核心转化页
- `/pricing`：商业转化页

### 18.2 中期结构
围绕高意图任务建立独立页面：
- Remove Background
- Product Photo Editor
- Passport Photo Maker
- Thumbnail Maker
- Image Upscaler
- Object Remover

### 18.3 增长漏斗
Google Search / Content / Direct
→ Landing Page
→ Try Free
→ Successful Result
→ Paywall / Upgrade
→ Subscription or Credit Pack

---

## 19. 验收标准
### 19.1 产品验收
- 用户无需注册即可开始第一次编辑
- 用户可在 30 秒内完成首次上传到结果返回的主流程（理想环境下）
- `/editor` 能完成上传 → 处理 → 导出闭环
- 定价信息与权益口径和 `docs/pricing/pricing-v1.md` 一致
- 法务页面可访问且无 404
- 用户清楚知道免费额度和升级收益

### 19.2 体验验收
- 首屏能在 5 秒内让用户理解“这是一个什么产品”
- 首页和工具页都以任务为中心，而不是抽象 AI 营销话术
- 错误场景至少覆盖：格式错误、文件过大、网络异常、额度不足、处理失败

### 19.3 增长验收
- 首页到 `/editor` CTA 路径清晰
- 内容页到工具页 CTA 存在且明确
- pricing 页能清楚区分订阅和 credit packs

---

## 20. 风险与待确认
### P0
- 当前关键词是否存在品牌词 / 噪音词属性偏高问题，仍需持续 SERP 人工复核
- 若图像结果质量不稳定，核心转化会直接受损

### P1
- 现阶段产品定位已升级，但首版实际能力仍偏轻，若营销口径过大，会造成预期落差
- 商品图、人像、通用编辑如果不做策略区分，成功率和投诉风险会变高
- copy rewrite 若仍是占位实现，会破坏整体产品可信度

### P2
- 独立 SEO 工具页扩展节奏过快，可能导致内容/研发分散
- 定价与 credit 消耗规则若不透明，会影响转化和口碑

### 待确认
- 免费导出是否始终保留水印，还是按模式区别处理
- Product Image Pipeline 是否作为第一优先增长方向
- 是否在下一阶段优先补 `remove-object` 或 `upscale`
- 是否需要把 passport / ID photo 作为第二波 SEO 切入点

---

## 21. 给下游的任务拆分
### 给设计
- 首页与 `/editor` 必须突出任务导向与免登录试用
- 结果区要强化“成功体验”与 before/after 对比
- pricing 页必须清楚表达 Free / Pro / Max / Credit Packs 区别
- 为中期 pipeline 升级预留 task suggestion / subject hint UI 空间

### 给前端
- 保持 `/editor` 为主任务页
- UI 状态完整：idle / uploading / processing / success / error / limit
- 不要把前端复制结果伪装成多个真实 AI 输出
- 事件埋点先实现最小集

### 给后端
- 优先打通匿名 session、上传、处理、轮询、导出闭环
- 数据结构预留 `task_type` / `subject_type` / `credits_used`
- copy rewrite 返回真实可用结果
- 为后续 task router 预留策略扩展点

### 给测试
- 覆盖免费用户主流程
- 覆盖格式/大小/网络/额度/失败场景
- 校验 pricing 与权益口径一致
- 校验法务页与 404 回流路径

### 给运营 / 增长
- 首批内容优先围绕任务型词，不要泛 AI 大词
- 首页、博客、SEO 页口径统一：快、简单、免登录、可导出
- 优先验证商品图和去背景类需求的转化表现

---

## 22. 版本规划
### Phase 1：MVP（当前）
- 3 模式编辑器
- Copy rewrite
- Free / Pro / Max / Credit Packs
- SEO 基础页 + 法务页

### Phase 2：Task-first 强化
- 任务自动推荐
- 更强的商品图表达
- 更好的 paywall 与错误引导
- 部分独立工具页上线

### Phase 3：Workflow 平台化
- Product / Portrait / Generic 路由
- 更多任务入口
- 批量处理
- API / automation

---

## 23. PRD 结论
### 当前结论
- 状态：`[DONE]`
- 一句话结论：RSP AI Editor 的首版仍应保持轻量、免登录、任务导向的编辑器定位，但产品文档需要明确其中期方向不是“堆更多模式”，而是升级为面向商品图、人像、通用场景的 AI 图像任务路由系统。

### 本次更新重点
- 从“功能清单”升级为“用户任务 + 商业场景 + pipeline 策略”的 PRD
- 保留当前 MVP 收敛范围，不让战略升级变成功能失控
- 对设计、前端、后端、测试、增长给出可执行边界

### 质量门槛自检
- ✅ 一句话定位明确
- ✅ 主 ICP 与场景明确
- ✅ MVP / P1 / P2 / NOT-DO 清晰
- ✅ 页面结构、核心流程、功能边界可执行
- ✅ 与现有 pricing 口径对齐
- ✅ 为中期 pipeline 升级预留产品约束

[DONE]
