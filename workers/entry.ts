// RSP AI Editor — Cloudflare Workers entry point
import { signAssetAccessToken, signToken, verifyAssetAccessToken, verifyToken } from "./session";
import { getD1, checkEntitlement, consumeCredit, checkRateLimit, getMonthlyCredits, nextResetAt, ensureCreditsSchema } from "./db";
import { runAIEdit } from "./ai";
import { handleGoogleLogin, handleGoogleCallback, handleAuthMe, handleLogout, handleLinkGoogle } from "./auth";
import type { Env } from "./env";
import type { EditMode } from "./schema";

const JSON_HEADER = { "Content-Type": "application/json" };
const DAY_MS = 86400000;
const MONTH_MS = 30 * DAY_MS;
// Signed input URLs must survive queue delay + provider fetch latency.
const ASSET_URL_TTL_MS = 60 * 60 * 1000;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADER });
}

function error(msg: string, code = 400): Response {
  return json({ ok: false, error: msg, code }, code);
}

function editOutputUrl(req: Request, taskId: string): string {
  const url = new URL(req.url);
  return `${url.origin}/api/v1/edit/${taskId}/output`;
}

async function editInputUrl(req: Request, env: Env, taskId: string, key: string): Promise<string> {
  const url = new URL(req.url);
  const token = await signAssetAccessToken(
    { key, taskId, expiresAt: Date.now() + ASSET_URL_TTL_MS },
    env
  );
  return `${url.origin}/api/v1/edit/${taskId}/input?token=${encodeURIComponent(token)}`;
}

function outputContentType(key: string): string {
  if (key.endsWith(".jpg") || key.endsWith(".jpeg")) return "image/jpeg";
  if (key.endsWith(".webp")) return "image/webp";
  return "image/png";
}

async function withContext<T>(stage: string, operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`${stage}: ${msg}`);
  }
}

function isAllowedHost(host: string): boolean {
  const allowedHosts = new Set([
    "image-editor.co",
    "www.image-editor.co",
    "rsp-ai-editor.sempron450.workers.dev",
    "localhost",
    "127.0.0.1",
  ]);

  return allowedHosts.has(host) || host.endsWith(".sempron450.workers.dev");
}

function getCorsOrigin(req: Request): string | null {
  const origin = req.headers.get("Origin");
  if (!origin) return null;

  try {
    const host = new URL(origin).hostname;
    return isAllowedHost(host) ? origin : null;
  } catch {
    return null;
  }
}

function withCors(req: Request, res: Response): Response {
  const origin = getCorsOrigin(req);
  if (!origin) return res;

  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,X-Session-ID,X-Admin-Key");
  headers.append("Vary", "Origin");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

function corsPreflight(req: Request): Response {
  const origin = getCorsOrigin(req);
  return new Response(null, {
    status: origin ? 204 : 403,
    headers: origin ? {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,X-Session-ID,X-Admin-Key",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    } : undefined,
  });
}

// ── /api/v1/session/init ──────────────────────────────────────────────────
async function handleSessionInit(req: Request, env: Env): Promise<Response> {
  const db = getD1(env);
  await ensureCreditsSchema(db);

  const existingToken = req.headers.get("Cookie")?.match(/rsp_session=([^;]+)/)?.[1]
    || req.headers.get("X-Session-ID");

  if (existingToken) {
    const existing = await verifyToken(existingToken, env);
    if (existing.valid) {
      const entitlement = await checkEntitlement(db, existing.sessionId);

      if (entitlement.reset_at !== 0) {
        return json({
          ok: true,
          data: {
            session_id: existing.sessionId,
            plan: entitlement.plan,
            monthly_credits: entitlement.monthly_credits,
            purchased_credits: entitlement.purchased_credits,
            credits_used: entitlement.credits_used,
            credits_remaining: entitlement.credits_remaining,
            reset_at: entitlement.reset_at,
          },
        });
      }
    }
  }

  const sessionId = crypto.randomUUID();
  const now = Date.now();

  // New session starts on the free credit window, resets tomorrow.
  const resetAt = now + DAY_MS;

  await db
    .prepare(
      `INSERT INTO sessions (id, plan, monthly_credits, purchased_credits, credits_used, reset_at, created_at, updated_at)
       VALUES (?, 'free', 5, 0, 0, ?, ?, ?)`
    )
    .bind(sessionId, resetAt, now, now)
    .run();

  const token = await signAndEncode(sessionId, env);
  const headers = new Headers({
    "Content-Type": "application/json",
    "Set-Cookie": `rsp_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * DAY_MS / 1000}`,
  });

  return new Response(JSON.stringify({
    ok: true,
    data: {
      session_id: sessionId,
      plan: "free",
      monthly_credits: 5,
      purchased_credits: 0,
      credits_used: 0,
      credits_remaining: 5,
      reset_at: resetAt,
    },
  }), { status: 200, headers });
}

// ── /api/v1/session/usage ─────────────────────────────────────────────────
async function handleSessionUsage(req: Request, env: Env): Promise<Response> {
  const session = await auth(req, env);
  if (session instanceof Response) return session;

  const db = getD1(env);
  const entitlement = await checkEntitlement(db, session);

  if (!entitlement.allowed && entitlement.reset_at === 0) return error("Session not found", 404);

  return json({
    ok: true,
    data: {
      plan: entitlement.plan,
      monthly_credits: entitlement.monthly_credits,
      purchased_credits: entitlement.purchased_credits,
      credits_used: entitlement.credits_used,
      credits_remaining: entitlement.credits_remaining,
      reset_at: entitlement.reset_at,
    },
  });
}

// ── /api/v1/edit/{mode} ───────────────────────────────────────────────────
async function handleEdit(req: Request, env: Env, mode: EditMode, ctx: { waitUntil(promise: Promise<unknown>): void }): Promise<Response> {
  let stage = "auth";
  try {
  const session = await auth(req, env);
  if (session instanceof Response) return session;

  const db = getD1(env);
  const rateLimitKV = env.RATE_LIMITS;

  // Check entitlement
  stage = "check entitlement";
  const entitlement = await checkEntitlement(db, session);
  if (!entitlement.allowed) {
    return error(
      `No credits remaining. Upgrade or add a credit pack at /pricing`,
      429
    );
  }

  // Check burst rate limit via KV. Credits remain the source of truth for entitlement.
  stage = "check rate limit";
  const windowMs = entitlement.plan === "free" ? DAY_MS : MONTH_MS;
  const limit = Math.max(entitlement.monthly_credits + entitlement.purchased_credits, 1);

  const rl = await checkRateLimit(rateLimitKV, session, limit, windowMs);
  if (!rl.allowed) {
    return error(`Rate limit exceeded. Reset at ${new Date(rl.resetAt).toISOString()}`, 429);
  }

  // Parse multipart form
  stage = "parse multipart form";
  let image: ArrayBuffer | null = null;
  let contentType = "";
  let filename = "upload.jpg";
  try {
    const fd = await req.formData();
    const file = fd.get("image");
    if (!file || typeof file === "string") return error("Missing 'image' field");
    image = await file.arrayBuffer();
    contentType = file.type || "image/jpeg";
    filename = file.name || filename;
  } catch {
    return error("Failed to parse form data");
  }

  // Validate file size < 10MB
  if (image.byteLength > 10 * 1024 * 1024) {
    return error("File too large. Max 10MB", 413);
  }

  // Upload to R2
  stage = "upload input to R2";
  const taskId = crypto.randomUUID();
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const inputKey = `uploads/${session}/${taskId}-input.${ext}`;

  await env.UPLOADS.put(inputKey, image, {
    httpMetadata: { contentType },
    customMetadata: { session_id: session, task_id: taskId },
  });

  const inputUrl = await editInputUrl(req, env, taskId, inputKey);

  // Consume credit
  stage = "consume credit";
  await consumeCredit(db, session);

  // Create edit task
  stage = "create edit task";
  await db
    .prepare(
      `INSERT INTO edits (id, session_id, mode, status, input_url, credits_used, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(taskId, session, mode, "processing", inputUrl, 1, Date.now())
    .run();

  // Run AI (non-blocking for fast response — worker returns immediately,
  // caller polls /api/v1/edit/{task_id})
  ctx.waitUntil(
    runAIEdit(inputUrl, mode, env, { data: image, contentType, filename })
      .then(async (result) => {
        const outputExt = result.contentType?.includes("png") ? "png" : ext;
        const outputKey = `outputs/${session}/${taskId}-output.${outputExt}`;
        const outputBytes = result.output ?? await fetchAIOutput(result.output_url);

        await env.OUTPUTS.put(outputKey, outputBytes, {
          httpMetadata: { contentType: result.contentType || outputContentType(outputKey) },
          customMetadata: { session_id: session, task_id: taskId, mode },
        });

        await db
          .prepare(`UPDATE edits SET status = 'done', output_url = ? WHERE id = ?`)
          .bind(`r2://${outputKey}`, taskId)
          .run();
      })
      .catch(async (err: Error) => {
        await db
          .prepare(`UPDATE edits SET status = 'failed', error_msg = ? WHERE id = ?`)
          .bind(err.message, taskId)
          .run();
      })
  );

  return json({ ok: true, data: { task_id: taskId, status: "processing" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return error(`${stage}: ${msg}`, 500);
  }
}

async function fetchAIOutput(outputUrl?: string): Promise<ArrayBuffer> {
  if (!outputUrl) throw new Error("AI provider returned no output URL or bytes");

  const aiResp = await fetch(outputUrl);
  if (!aiResp.ok) {
    throw new Error(`Failed to fetch AI output ${aiResp.status}: ${await aiResp.text()}`);
  }
  return aiResp.arrayBuffer();
}

// ── /api/v1/edit/{task_id} ────────────────────────────────────────────────
async function handleEditStatus(req: Request, env: Env): Promise<Response> {
  const session = await auth(req, env);
  if (session instanceof Response) return session;

  const url = new URL(req.url);
  const taskId = url.pathname.split("/").pop()!;

  const db = getD1(env);
  const row = await db
    .prepare("SELECT * FROM edits WHERE id = ? AND session_id = ?")
    .bind(taskId, session)
    .first();

  if (!row) return error("Task not found", 404);

  const storedOutputUrl = typeof row.output_url === "string" ? row.output_url : null;

  return json({
    ok: true,
    data: {
      task_id: row.id,
      status: row.status,
      mode: row.mode,
      output_url: storedOutputUrl?.startsWith("r2://") ? editOutputUrl(req, String(row.id)) : storedOutputUrl,
      error: row.error_msg || null,
      created_at: row.created_at,
    },
  });
}

// ── /api/v1/edit/{task_id}/output ──────────────────────────────────────────
async function handleDebugRembgHealth(env: Env): Promise<Response> {
  const baseUrl = (env.REMBG_API_URL || "").replace(/\/$/, "");
  if (!baseUrl) return error("REMBG_API_URL is not configured", 500);

  const target = `${baseUrl}/health`;
  const started = Date.now();

  try {
    const upstream = await fetch(target, {
      method: "GET",
      headers: {
        "Accept": "application/json,text/plain,*/*",
        "User-Agent": "Cloudflare-Worker-rembg-debug",
      },
    });
    const body = await upstream.text();

    return json({
      ok: upstream.ok,
      target,
      status: upstream.status,
      statusText: upstream.statusText,
      elapsedMs: Date.now() - started,
      headers: (() => {
        const headerMap: Record<string, string> = {};
        upstream.headers.forEach((value, key) => {
          headerMap[key] = value;
        });
        return headerMap;
      })(),
      body: body.slice(0, 2000),
    }, upstream.ok ? 200 : 502);
  } catch (err) {
    return json({
      ok: false,
      target,
      elapsedMs: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    }, 502);
  }
}

async function handleEditOutput(req: Request, env: Env): Promise<Response> {
  const session = await auth(req, env);
  if (session instanceof Response) return session;

  const url = new URL(req.url);
  const taskId = url.pathname.split("/").at(-2)!;
  const db = getD1(env);
  const row = await db
    .prepare("SELECT output_url, status FROM edits WHERE id = ? AND session_id = ?")
    .bind(taskId, session)
    .first();

  if (!row) return error("Task not found", 404);
  if (row.status !== "done") return error("Output is not ready", 409);

  const storedOutputUrl = typeof row.output_url === "string" ? row.output_url : "";
  if (!storedOutputUrl.startsWith("r2://")) return error("Output not stored in R2", 404);

  const outputKey = storedOutputUrl.slice("r2://".length);
  const object = await env.OUTPUTS.get(outputKey);
  if (!object) return error("Output object not found", 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", outputContentType(outputKey));
  headers.set("Cache-Control", "private, max-age=3600");
  return new Response(object.body, { headers });
}

async function handleEditInput(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const taskId = url.pathname.split("/").at(-2)!;
  const token = url.searchParams.get("token");
  if (!token) return error("Missing asset token", 401);

  const tokenResult = await verifyAssetAccessToken(token, env);
  if (!tokenResult.valid) {
    const invalidToken = tokenResult as { valid: false; reason: string };
    return error(`Unauthorized: ${invalidToken.reason}`, 401);
  }
  if (tokenResult.payload.taskId !== taskId) return error("Unauthorized: task mismatch", 401);

  const object = await env.UPLOADS.get(tokenResult.payload.key);
  if (!object) return error("Input object not found", 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", outputContentType(tokenResult.payload.key));
  headers.set("Cache-Control", "private, max-age=300");
  return new Response(object.body, { headers });
}

// ── /api/v1/copy/rewrite ─────────────────────────────────────────────────
async function handleCopyRewrite(req: Request, env: Env): Promise<Response> {
  const session = await auth(req, env);
  if (session instanceof Response) return session;

  return error(
    "Copy rewrite is temporarily disabled in this build until the production AI rewrite backend is ready.",
    501
  );
}

// ── /api/v1/admin/grant ───────────────────────────────────────────────────
async function handleAdminGrant(req: Request, env: Env): Promise<Response> {
  const adminKey = req.headers.get("X-Admin-Key");
  if (adminKey !== env.ADMIN_KEY) {
    return error("Forbidden", 403);
  }

  const body = await req.json() as { session_id?: string; plan?: string; duration_days?: number; purchased_credits?: number };
  if (!body.session_id || !body.plan) return error("Missing session_id or plan");

  const validPlans = ["free", "pro", "max"];
  if (!validPlans.includes(body.plan)) return error(`plan must be: ${validPlans.join(" | ")}`);

  const db = getD1(env);
  await ensureCreditsSchema(db);
  const now = Date.now();
  const resetAt = body.duration_days ? now + body.duration_days * DAY_MS : nextResetAt(body.plan, now);
  const monthlyCredits = getMonthlyCredits(body.plan);
  const purchasedCredits = Math.max(0, Math.floor(body.purchased_credits ?? 0));

  await db
    .prepare(
      `INSERT INTO sessions (id, plan, monthly_credits, purchased_credits, credits_used, reset_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET plan = ?, monthly_credits = ?, purchased_credits = purchased_credits + ?, credits_used = 0, reset_at = ?, updated_at = ?`
    )
    .bind(
      body.session_id, body.plan, monthlyCredits, purchasedCredits, resetAt, now, now,
      body.plan, monthlyCredits, purchasedCredits, resetAt, now
    )
    .run();

  await db
    .prepare(
      `INSERT INTO admin_log (id, action, target_id, admin_key, created_at)
       VALUES (?, 'grant_plan', ?, ?, ?)`
    )
    .bind(crypto.randomUUID(), body.session_id, adminKey, now)
    .run();

  return json({ ok: true, data: { plan: body.plan, monthly_credits: monthlyCredits, purchased_credits: purchasedCredits, reset_at: resetAt } });
}

// ── Auth helper ────────────────────────────────────────────────────────────
async function auth(req: Request, env: Env): Promise<string | Response> {
  const token = req.headers.get("Cookie")?.match(/rsp_session=([^;]+)/)?.[1]
    || req.headers.get("X-Session-ID");

  if (!token) return error("Unauthorized: no session token", 401);

  const result = await verifyToken(token, env);
  if (!result.valid) {
    const invalidToken = result as { valid: false; reason: string };
    return error(`Unauthorized: ${invalidToken.reason}`, 401);
  }
  return result.sessionId;
}

async function signAndEncode(sessionId: string, env: Env): Promise<string> {
  return signToken(sessionId, env);
}

// ── Router ────────────────────────────────────────────────────────────────
export default {
  async fetch(req: Request, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): Promise<Response> {
    if (req.method === "OPTIONS") return corsPreflight(req);

    const url = new URL(req.url);
    const path = url.pathname.replace("/api/v1", "");

    try {
      let response: Response;

      if (path === "/session/init" && req.method === "POST") response = await handleSessionInit(req, env);
      else if (path === "/session/usage" && req.method === "GET") response = await handleSessionUsage(req, env);
      else if (path.match(/^\/edit\/(enhance|remove-bg|restyle)$/) && req.method === "POST") {
        const mode = path.split("/").pop() as EditMode;
        response = await handleEdit(req, env, mode, ctx);
      } else if (path === "/debug/rembg-health" && req.method === "GET") response = await handleDebugRembgHealth(env);
      else if (path.match(/^\/edit\/[a-f0-9-]+\/input$/) && req.method === "GET") {
        response = await handleEditInput(req, env);
      }
      else if (path.match(/^\/edit\/[a-f0-9-]+\/output$/) && req.method === "GET") {
        response = await handleEditOutput(req, env);
      } else if (path.match(/^\/edit\/[a-f0-9-]+$/) && req.method === "GET") {
        response = await handleEditStatus(req, env);
      } else if (path === "/copy/rewrite" && req.method === "POST") response = await handleCopyRewrite(req, env);
      else if (path === "/admin/grant" && req.method === "POST") response = await handleAdminGrant(req, env);
      else if (path === "/auth/google" && req.method === "GET") response = await handleGoogleLogin(req, env);
      else if ((path === "/auth/callback/google" || url.pathname === "/api/auth/callback/google") && req.method === "GET") response = await handleGoogleCallback(req, env);
      else if (path === "/auth/me" && req.method === "GET") response = await handleAuthMe(req, env);
      else if (path === "/auth/logout" && req.method === "POST") response = await handleLogout();
      else if (path === "/auth/link-google" && req.method === "POST") response = await handleLinkGoogle(req, env);
      else response = error("Not found", 404);

      return withCors(req, response);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return withCors(req, json({ ok: false, error: msg, code: 500 }, 500));
    }
  },
};
