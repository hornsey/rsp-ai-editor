# Stitch 分步生成提示词（RSP AI Editor）— v2

> ⚠️ 根据 PRD v1 修正：原 Login/Projects/Editor(文档)/Publish 全部推翻。
> 核心方向：「免登录、图片AI编辑器」，不是文档写作工具。

---

## 项目信息

- **项目名**：RSP AI Editor
- **project_id**：12437563088663070461（用于 `projectId` 参数）
- **产品定位**：免登录、即开即用的轻量 AI 图片编辑器，主打「上传→一键编辑→导出」
- **核心关键词**：ai editor rsp editing, ai image editor online

---

## API 调用参考

```json
{
  "name": "generate_screen_from_text",
  "arguments": {
    "projectId": "12437563088663070461",
    "prompt": "（见下方各屏幕提示词）"
  }
}
```

---

## 生成顺序（按 MVP 优先级）

---

### 2.1 首页 `/`（最优先）

**提示词**：
> Generate one screen: Homepage for RSP AI Editor — a no-signup AI image editor SaaS.
> Hero section: Large headline "Edit Images & Copy in Seconds — No Signup Required",
> subheadline "Upload your photo, pick an AI mode, and download in seconds. Free, instant, no account needed.",
> one primary CTA button "Start Editing Free" with a downward arrow, and three task shortcut cards below:
>   Card 1: "Enhance Photo" with sparkle icon — improves quality automatically
>   Card 2: "Remove Background" with wand icon — one-click background removal
>   Card 3: "Restyle Image" with palette icon — change the visual style
> Below the fold: a before/after comparison showcase (left: original blurred photo, right: AI enhanced result),
> a "How It Works" section with 3 steps (Upload → AI Edit → Download), social proof bar with "Trusted by 50,000+ creators", and footer with links.
> Style: modern, clean, light background, blue-violet accent color (#6C5CE7), generous whitespace,
> rounded corners, subtle shadows. Desktop-first. Professional but approachable tone.

**设计要点**：
- 主 CTA 必须显眼，蓝紫渐变按钮
- 3 个任务快捷入口是首屏核心转化元素
- before/after 对比展示是产品差异化体现

---

### 2.2 编辑器 `/editor`（核心任务页）

**提示词**：
> Generate one screen: Editor page for RSP AI Editor — a no-signup AI image editor tool.
> Layout: Full-width page. Top: minimal nav bar with logo "RSP AI Editor" and a "Sign In" link (text only, subtle).
> Center: Large drag-and-drop upload zone with dashed border, icon, and text "Drop your image here or click to upload — JPG, PNG, WebP up to 10MB".
> Below upload zone (in collapsed state, show 3 mode cards side by side):
>   Card 1: "Auto Enhance" — auto-improves photo quality, lighting, and colors
>   Card 2: "Background Remove" — removes background with one click
>   Card 3: "Restyle" — applies artistic style transformations
> Each card: icon, mode name, short description, and "Apply" button.
> After a mode is selected and processed: show result preview with before/after toggle,
> three result version thumbnails below, "Download" primary button, and "Try Another Mode" secondary link.
> Style: clean, tool-focused, light gray background, blue-violet accents, minimal chrome to keep focus on the image.
> Desktop-first. The UI should feel fast and simple — no sidebar, no complex menus.

**设计要点**：
- 上传区是首屏核心，必须大且显眼
- 3 个模式是产品核心功能
- 结果展示支持 before/after 对比
- 不要有复杂的导航或侧边栏

---

### 2.3 功能页 `/features`

**提示词**：
> Generate one screen: Features page for RSP AI Editor — a no-signup AI image editor.
> Page header: "Powerful AI Editing, Zero Learning Curve" with subhead "Three intelligent modes to transform your images in seconds."
> Three feature sections (alternating layout, icon + text left, visual right):
>   1. Auto Enhance: icon of a sparkle star, heading "Make Every Photo Shine", body text "Our AI analyzes your image and automatically adjusts lighting, contrast, color balance, and sharpness. Perfect for photos taken in low light or with a phone camera.", demo thumbnail showing before/after.
>   2. Background Remove: icon of a magic wand, heading "One Click, Clean Cutouts", body text "Remove any background instantly. Our AI precisely detects the subject and cuts it out cleanly — even around hair and fine edges. Ready for product photos, profile pictures, or collages.", demo thumbnail.
>   3. Restyle: icon of a palette, heading "Transform Into Any Style", body text "From vintage film to modern minimal, apply one of three art styles to completely change the mood of your image. Each restyle is generated fresh — no filters, just intelligent AI.", demo thumbnail.
> Below features: "Try it now — no signup, no credit card" with a large CTA "Open Free Editor".
> Footer with minimal links (Privacy, Terms, Contact).
> Style: clean, content-focused, light background, blue-violet (#6C5CE7) accent, generous spacing between sections. Desktop-first.

---

### 2.4 定价页 `/pricing`

**提示词**：
> Generate one screen: Pricing page for RSP AI Editor — a no-signup AI image editor.
> Page header: "Simple, Transparent Pricing" with subhead "Start free. Upgrade when you need more."
> Two pricing cards side by side, centered:
>   Free Plan card:
>     - Title: "Free"
>     - Price: "$0 / month"
>     - Description: "Perfect for trying out the editor"
>     - Feature list with checkmarks: 10 edits per day, Standard export quality, JPG & PNG support, No signup required
>     - CTA button: "Get Started Free" (outline style)
>   Pro Plan card (highlighted, recommended):
>     - Title: "Pro" with a "Most Popular" badge
>     - Price: "$12 / month"
>     - Description: "For creators who need more power"
>     - Feature list: Unlimited edits, HD export (no watermark), Batch processing (up to 10 images), Priority processing speed, All export formats including WebP
>     - CTA button: "Upgrade to Pro" (filled, blue-violet gradient)
> Below cards: "Need a custom plan for your team? Contact us." text link.
> FAQ accordion section with 3 questions: "Do I really need no signup?", "What image formats are supported?", "Can I cancel anytime?".
> Footer with minimal links.
> Style: clean pricing page, white background, cards with subtle shadows, blue-violet accent on Pro card and CTAs.
> Desktop-first, cards max-width ~900px centered.

---

## 已废弃的页面（不要生成）

- ❌ Login 登录页（PRD 明确免登录）
- ❌ Projects 列表（PRD 不做项目管理）
- ❌ 文档编辑器（PRD 是图片编辑器，不是文档工具）
- ❌ Publish Settings（发布不是 MVP 范围）

---

## 输出文件

- 截图保存路径：`/root/rsp-ai-editor/screenshots/`
  - `v2_01_homepage.png` — 首页
  - `v2_02_editor.png` — 工具页
  - `v2_03_features.png` — 功能页
  - `v2_04_pricing.png` — 定价页
