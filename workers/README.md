# Cloudflare Workers API

## 部署步骤（资源就绪后执行）

```bash
# 1. 创建 D1 数据库
wrangler d1 create rsp-db
# → 输出 database_id，填入 workers/wrangler.toml

# 2. 运行 migration
wrangler d1 execute rsp-db --file=./migrations/0001_initial.sql --remote

# 3. 创建 R2 buckets
wrangler r2 bucket create rsp-uploads
wrangler r2 bucket create rsp-outputs
# → 填入 workers/wrangler.toml

# 4. 设置密钥（出现提示时输入真实值）
wrangler secret put SESSION_SECRET_KEY
wrangler secret put ADMIN_KEY

# 5. 配置 AI Provider（选一）
# 方案 A：Cloudflare Workers AI
wrangler secret put AI_GATEWAY_ENDPOINT
# 方案 B：Replicate
wrangler secret put REPLICATE_API_KEY
# 方案 C：Cloudinary
wrangler secret put CLOUDINARY_CLOUD_NAME
wrangler secret put CLOUDINARY_API_KEY
wrangler secret put CLOUDINARY_API_SECRET

# 6. 部署 Workers
wrangler deploy --config workers/wrangler.toml

# 7. 验证
curl -X POST https://<your-worker>.workers.dev/api/v1/session/init
```

## 本地开发

```bash
cp .dev.vars.example .dev.vars
# 填入真实值后：
wrangler dev --config workers/wrangler.toml --local
```

## API 路由

| Method | Path | 说明 |
|--------|------|------|
| POST | `/api/v1/session/init` | 初始化匿名会话 |
| GET | `/api/v1/session/usage` | 查询用量（需 Cookie 或 X-Session-ID） |
| POST | `/api/v1/edit/enhance` | AI增强（需 Cookie 或 X-Session-ID） |
| POST | `/api/v1/edit/remove-bg` |背景去除（需 Cookie 或 X-Session-ID） |
| POST | `/api/v1/edit/restyle` | 风格重绘（需 Cookie 或 X-Session-ID） |
| GET | `/api/v1/edit/{task_id}` | 查询任务状态 |
| POST | `/api/v1/copy/rewrite` | 文案改写（需 Cookie 或 X-Session-ID） |
| POST | `/api/v1/admin/grant` | 管理员授权（需 X-Admin-Key） |

## 环境变量（wrangler secrets）

| 变量 | 必填 | 说明 |
|------|------|------|
| `SESSION_SECRET_KEY` | ✅ | HMAC 签名密钥，32+ 字符：`openssl rand -base64 32` |
| `ADMIN_KEY` | ✅ | 管理员操作密钥：`openssl rand -hex 32` |
| `AI_PROVIDER` | ✅ | `cf-workers-ai` \| `replicate` \| `cloudinary` |
| `AI_GATEWAY_ENDPOINT` | 仅 CF AI | CF AI Gateway URL |
| `REPLICATE_API_KEY` | 仅 Replicate | Replicate API Key |
| `CLOUDINARY_*` | 仅 Cloudinary | Cloudinary 三件套 |

## 资源状态

- ✅ KV `rsp-sessions`: 已创建 (`48712c55221f467aa1d25bd6b2522fac`)
- ✅ KV `rsp-rate-limits`: 已创建 (`864c39c2ce244d11866532fc8784dca9`)
- ❌ D1 `rsp-db`: [BLOCKED] Token 缺 D1 权限
- ❌ R2 buckets: [BLOCKED] 未开通 R2 服务
- ⚠️ AI Provider: [待确认] 选择推理方案