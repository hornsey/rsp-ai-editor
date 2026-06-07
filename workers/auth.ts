// Google OAuth — login flow + callback
// Flow: /api/auth/google → redirect to Google → /api/auth/callback/google → set session cookie

import type { Env } from "./env";
import { signToken } from "./session";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

function getOAuthConfig(env: Env) {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set");
  return { clientId, clientSecret };
}

function buildAuthUrl(env: Env, state: string): string {
  const { clientId } = getOAuthConfig(env);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `https://api.image-editor.co/api/auth/callback/google`,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  return `${GOOGLE_AUTH_URL}?${params}`;
}

async function exchangeCode(code: string, env: Env): Promise<{ access_token: string; id_token: string }> {
  const { clientId, clientSecret } = getOAuthConfig(env);
  const resp = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `https://api.image-editor.co/api/auth/callback/google`,
      grant_type: "authorization_code",
    }),
  });
  if (!resp.ok) throw new Error(`Token exchange failed: ${resp.status}`);
  return resp.json() as Promise<{ access_token: string; id_token: string }>;
}

async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const resp = await fetch(`${GOOGLE_USERINFO_URL}?alt=json`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) throw new Error(`UserInfo failed: ${resp.status}`);
  return resp.json() as Promise<GoogleUserInfo>;
}

// Generate a random state parameter for CSRF protection
function generateState(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Login handler ─────────────────────────────────────────────────────────
export async function handleGoogleLogin(env: Env): Promise<Response> {
  const state = generateState();
  const authUrl = buildAuthUrl(env, state);

  // Store state in KV for 10 min validation
  const kv = env.SESSIONS;
  await kv.put(`oauth_state:${state}`, "pending", { expirationTtl: 600 });

  return new Response(null, {
    status: 302,
    headers: { Location: authUrl },
  });
}

// ── Callback handler ───────────────────────────────────────────────────────
export async function handleGoogleCallback(
  req: Request,
  env: Env
): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return new Response(`OAuth error: ${error}`, { status: 400 });
  }
  if (!code || !state) {
    return new Response("Missing code or state", { status: 400 });
  }

  // Validate state (CSRF protection)
  const kv = env.SESSIONS;
  const storedState = await kv.get(`oauth_state:${state}`);
  if (storedState !== "pending") {
    return new Response("Invalid or expired state", { status: 400 });
  }
  await kv.delete(`oauth_state:${state}`);

  // Exchange code for tokens
  const tokens = await exchangeCode(code, env);

  // Get Google user info
  const googleUser = await getGoogleUserInfo(tokens.access_token);

  // Upsert session in D1 (link google_id to session)
  const db = env.DB;
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  // Check if this Google user already has a session
  const existing = await db
    .prepare("SELECT session_id FROM sessions WHERE google_id = ?")
    .bind(googleUser.id)
    .first();

  let sessionId: string;
  if (existing) {
    sessionId = existing.session_id as string;
    await db
      .prepare("UPDATE sessions SET updated_at = ?, name = ?, picture = ? WHERE id = ?")
      .bind(now, googleUser.name, googleUser.picture, sessionId)
      .run();
  } else {
    // Create new session
    sessionId = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO sessions (id, google_id, plan, edits_used, edits_limit, resets_at, created_at, updated_at, name, picture)
         VALUES (?, ?, 'free', 0, 5, ?, ?, ?, ?, ?)`
      )
      .bind(sessionId, googleUser.id, now + 86400000, now, now, googleUser.name, googleUser.picture)
      .run();
  }

  // Sign and set session cookie
  const token = await signToken(sessionId, env);
  const cookie = `rsp_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${thirtyDays / 1000}`;

  // Redirect to frontend
  return new Response(null, {
    status: 302,
    headers: {
      Location: "https://image-editor.co/editor",
      "Set-Cookie": cookie,
    },
  });
}

// ── Link Google account to existing anonymous session ──────────────────────
// POST /api/auth/link-google { code, state }
export async function handleLinkGoogle(
  req: Request,
  env: Env
): Promise<Response> {
  // Require existing session
  const cookieHeader = req.headers.get("Cookie") || "";
  const tokenMatch = cookieHeader.match(/rsp_session=([^;]+)/);
  if (!tokenMatch) return new Response("Unauthorized", { status: 401 });

  const { verifyToken } = await import("./session");
  const result = await verifyToken(tokenMatch[1], env);
  if (!result.valid) return new Response("Invalid session", { status: 401 });

  const body = await req.json() as { code: string; state: string };
  if (!body.code || !body.state) return new Response("Missing code or state", { status: 400 });

  // Validate state
  const kv = env.SESSIONS;
  const storedState = await kv.get(`oauth_state:${body.state}`);
  if (storedState !== "pending") return new Response("Invalid state", { status: 400 });
  await kv.delete(`oauth_state:${body.state}`);

  const tokens = await exchangeCode(body.code, env);
  const googleUser = await getGoogleUserInfo(tokens.access_token);
  const db = env.DB;

  // Check if Google ID already linked to another session
  const conflict = await db
    .prepare("SELECT id FROM sessions WHERE google_id = ? AND id != ?")
    .bind(googleUser.id, result.sessionId)
    .first();
  if (conflict) return new Response("Google account already linked to another session", { status: 409 });

  await db
    .prepare("UPDATE sessions SET google_id = ?, updated_at = ?, name = ?, picture = ? WHERE id = ?")
    .bind(googleUser.id, Date.now(), googleUser.name, googleUser.picture, result.sessionId)
    .run();

  return new Response(JSON.stringify({ ok: true, data: { linked: true } }), {
    headers: { "Content-Type": "application/json" },
  });
}