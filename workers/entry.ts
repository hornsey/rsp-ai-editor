// RSP AI Editor — Cloudflare Workers entry point
import { signToken, verifyToken } from "./session";
import { getD1, checkEntitlement, consumeCredit, checkRateLimit } from "./db";
import { runAIEdit } from "./ai";
import { handleGoogleLogin, handleGoogleCallback, handleAuthMe, handleLogout, handleLinkGoogle } from "./auth";
import type { Env } from "./env";
import type { EditMode } from "./schema";

const JSON_HEADER = { "Content-Type": "application/json" };
const DAY_MS = 86400000;
const MONTH_MS = 30 * DAY_MS;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADER });
}

function error(msg: string, code = 400): Response {
  return json({ ok: false, error: msg, code }, code);
}

function getCorsOrigin(req: Request): string | null {
  const origin = req.headers.get("Origin");
  if (!origin) return null;

  try {
    const host = new URL(origin).hostname;
    const allowedHosts = new Set([
      "image-editor.co",
      "www.image-editor.co",
      "rsp-ai-editor.sempron450.workers.dev",
      "localhost",
      "127.0.0.1",
    ]);
    return allowedHosts.has(host) ? origin : null;
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
async function handleSessionInit(env: Env): Promise<Response> {
  const db = getD1(env);
  const sessionId = crypto.randomUUID();
  const now = Date.now();

  // New session starts as 'free', resets tomorrow
  const resetsAt = now + DAY_MS;

  await db
    .prepare(
      `INSERT INTO sessions (id, plan, edits_used, edits_limit, resets_at, created_at, updated_at)
       VALUES (?, 'free', 0, 5, ?, ?, ?)`
    )
    .bind(sessionId, resetsAt, now, now)
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
      edits_used: 0,
      edits_limit: 5,
      resets_at: resetsAt,
    },
  }), { status: 200, headers });
}

// ── /api/v1/session/usage ─────────────────────────────────────────────────
async function handleSessionUsage(req: Request, env: Env): Promise<Response> {
  const session = await auth(req, env);
  if (session instanceof Response) return session;

  const db = getD1(env);
  const row = await db
    .prepare("SELECT plan, edits_used, edits_limit, resets_at FROM sessions WHERE id = ?")
    .bind(session)
    .first();

  if (!row) return error("Session not found", 404);

  const now = Date.now();
  const resetsAt = row.resets_at as number;

  // Auto-reset if window passed
  if (now > resetsAt) {
    const newResetsAt = (row.plan as string) === "free"
      ? now + DAY_MS
      : now + MONTH_MS;

    await db
      .prepare("UPDATE sessions SET edits_used = 0, resets_at = ?, updated_at = ? WHERE id = ?")
      .bind(newResetsAt, now, session)
      .run();

    return json({
      ok: true,
      data: { plan: row.plan, edits_used: 0, edits_limit: row.edits_limit, resets_at: newResetsAt },
    });
  }

  return json({
    ok: true,
    data: {
      plan: row.plan,
      edits_used: row.edits_used,
      edits_limit: row.edits_limit,
      resets_at: row.resets_at,
    },
  });
}

// ── /api/v1/edit/{mode} ───────────────────────────────────────────────────
async function handleEdit(req: Request, env: Env, mode: EditMode): Promise<Response> {
  const session = await auth(req, env);
  if (session instanceof Response) return session;

  const db = getD1(env);
  const rateLimitKV = env.RATE_LIMITS;

  // Check entitlement
  const entitlement = await checkEntitlement(db, session);
  if (!entitlement.allowed) {
    return error(
      `Daily/monthly limit reached. Upgrade at /pricing`,
      429
    );
  }

  // Check rate limit via KV
  const windowMs = entitlement.plan === "free" ? DAY_MS : MONTH_MS;
  const limit = entitlement.plan === "free" ? 5 : entitlement.plan === "pro" ? 500 : 2500;

  const rl = await checkRateLimit(rateLimitKV, session, limit, windowMs);
  if (!rl.allowed) {
    return error(`Rate limit exceeded. Reset at ${new Date(rl.resetAt).toISOString()}`, 429);
  }

  // Parse multipart form
  let image: ArrayBuffer | null = null;
  let contentType = "";
  try {
    const fd = await req.formData();
    const file = fd.get("image");
    if (!file || typeof file === "string") return error("Missing 'image' field");
    image = await file.arrayBuffer();
    contentType = file.type || "image/jpeg";
  } catch {
    return error("Failed to parse form data");
  }

  // Validate file size < 10MB
  if (image.byteLength > 10 * 1024 * 1024) {
    return error("File too large. Max 10MB", 413);
  }

  // Upload to R2
  const taskId = crypto.randomUUID();
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const inputKey = `uploads/${session}/${taskId}-input.${ext}`;

  await env.UPLOADS.put(inputKey, image, {
    httpMetadata: { contentType },
    customMetadata: { session_id: session, task_id: taskId },
  });

  const inputUrl = `https://placeholder.r2.dev/${inputKey}`; // R2 public URL or signed

  // Consume credit
  await consumeCredit(db, session);

  // Create edit task
  await db
    .prepare(
      `INSERT INTO edits (id, session_id, mode, status, input_url, credits_used, created_at)
       VALUES (?, ?, ?, 'processing', ?, 1, ?)`
    )
    .bind(taskId, session, inputUrl, Date.now())
    .run();

  // Run AI (non-blocking for fast response — worker returns immediately,
  // caller polls /api/v1/edit/{task_id})
  runAIEdit(inputUrl, mode, env)
    .then(async (result) => {
      const outputKey = `outputs/${session}/${taskId}-output.${ext}`;
      // Fetch AI output and store in R2
      const aiResp = await fetch(result.output_url);
      await env.OUTPUTS.put(outputKey, await aiResp.arrayBuffer());

      await db
        .prepare(`UPDATE edits SET status = 'done', output_url = ? WHERE id = ?`)
        .bind(`https://placeholder.r2.dev/${outputKey}`, taskId)
        .run();
    })
    .catch(async (err: Error) => {
      await db
        .prepare(`UPDATE edits SET status = 'failed', error_msg = ? WHERE id = ?`)
        .bind(err.message, taskId)
        .run();
    });

  return json({ ok: true, data: { task_id: taskId, status: "processing" } });
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

  return json({
    ok: true,
    data: {
      task_id: row.id,
      status: row.status,
      mode: row.mode,
      output_url: row.output_url || null,
      error: row.error_msg || null,
      created_at: row.created_at,
    },
  });
}

// ── /api/v1/copy/rewrite ─────────────────────────────────────────────────
async function handleCopyRewrite(req: Request, env: Env): Promise<Response> {
  const session = await auth(req, env);
  if (session instanceof Response) return session;

  const body = await req.json() as { text?: string; style?: string };
  if (!body.text) return error("Missing 'text' field");

  const style = body.style || "clean";
  if (!["clean", "persuasive", "concise"].includes(style)) {
    return error("style must be: clean | persuasive | concise");
  }

  // For now, return placeholder — integrate LLM API (e.g. CF Workers AI chat)
  return json({
    ok: true,
    data: {
      versions: [
        `[${style}] ${body.text}`,
        `[${style} v2] ${body.text} — enhanced`,
        `[${style} v3] ${body.text} (final)`,
      ],
    },
  });
}

// ── /api/v1/admin/grant ───────────────────────────────────────────────────
async function handleAdminGrant(req: Request, env: Env): Promise<Response> {
  const adminKey = req.headers.get("X-Admin-Key");
  if (adminKey !== env.ADMIN_KEY) {
    return error("Forbidden", 403);
  }

  const body = await req.json() as { session_id?: string; plan?: string; duration_days?: number };
  if (!body.session_id || !body.plan) return error("Missing session_id or plan");

  const validPlans = ["free", "pro", "team"];
  if (!validPlans.includes(body.plan)) return error(`plan must be: ${validPlans.join(" | ")}`);

  const db = getD1(env);
  const now = Date.now();
  const duration = (body.duration_days || 30) * DAY_MS;
  const resetsAt = now + duration;

  await db
    .prepare(
      `INSERT INTO sessions (id, plan, edits_used, edits_limit, resets_at, created_at, updated_at)
       VALUES (?, ?, 0, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET plan = ?, edits_limit = ?, resets_at = ?, updated_at = ?`
    )
    .bind(
      body.session_id, body.plan,
      body.plan === "free" ? 5 : body.plan === "pro" ? 500 : 2500,
      resetsAt, now, now,
      body.plan,
      body.plan === "free" ? 5 : body.plan === "pro" ? 500 : 2500,
      resetsAt, now
    )
    .run();

  await db
    .prepare(
      `INSERT INTO admin_log (id, action, target_id, admin_key, created_at)
       VALUES (?, 'grant_plan', ?, ?, ?)`
    )
    .bind(crypto.randomUUID(), body.session_id, adminKey, now)
    .run();

  return json({ ok: true, data: { plan: body.plan, resets_at: resetsAt } });
}

// ── Auth helper ────────────────────────────────────────────────────────────
async function auth(req: Request, env: Env): Promise<string | Response> {
  const token = req.headers.get("Cookie")?.match(/rsp_session=([^;]+)/)?.[1]
    || req.headers.get("X-Session-ID");

  if (!token) return error("Unauthorized: no session token", 401);

  const result = await verifyToken(token, env);
  if (!result.valid) return error(`Unauthorized: ${result.reason}`, 401);
  return result.sessionId;
}

async function signAndEncode(sessionId: string, env: Env): Promise<string> {
  return signToken(sessionId, env);
}

// ── Router ────────────────────────────────────────────────────────────────
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === "OPTIONS") return corsPreflight(req);

    const url = new URL(req.url);
    const path = url.pathname.replace("/api/v1", "");

    try {
      let response: Response;

      if (path === "/session/init" && req.method === "POST") response = await handleSessionInit(env);
      else if (path === "/session/usage" && req.method === "GET") response = await handleSessionUsage(req, env);
      else if (path.match(/^\/edit\/(enhance|remove-bg|restyle)$/) && req.method === "POST") {
        const mode = path.split("/").pop() as EditMode;
        response = await handleEdit(req, env, mode);
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
