// Google OAuth — login flow + callback
// Flow: /api/v1/auth/google → redirect to Google → /api/v1/auth/callback/google → set session cookie

import type { Env } from "./env";
import { signToken, verifyToken } from "./session";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const DEFAULT_FRONTEND_URL = "https://image-editor.co/editor";

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface OAuthState {
  returnTo: string;
  redirectUri: string;
}

function getOAuthConfig(env: Env) {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set");
  return { clientId, clientSecret };
}

function getRedirectUri(req: Request): string {
  const url = new URL(req.url);
  // Keep the callback path aligned with the URI that was originally configured
  // in Google Cloud Console for this project.
  return `${url.origin}/api/auth/callback/google`;
}

function getSafeReturnTo(req: Request): string {
  const url = new URL(req.url);
  const raw = url.searchParams.get("return_to") || DEFAULT_FRONTEND_URL;

  try {
    const returnUrl = new URL(raw);
    const allowedHosts = new Set([
      "image-editor.co",
      "www.image-editor.co",
      "rsp-ai-editor.sempron450.workers.dev",
      "localhost",
      "127.0.0.1",
    ]);

    if (allowedHosts.has(returnUrl.hostname)) return returnUrl.toString();
  } catch {
    // Fall through to default.
  }

  return DEFAULT_FRONTEND_URL;
}

function buildAuthUrl(env: Env, state: string, redirectUri: string): string {
  const { clientId } = getOAuthConfig(env);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  return `${GOOGLE_AUTH_URL}?${params}`;
}

async function exchangeCode(code: string, env: Env, redirectUri: string): Promise<{ access_token: string; id_token: string }> {
  const { clientId, clientSecret } = getOAuthConfig(env);
  const resp = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
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

function generateState(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sessionCookie(token: string): string {
  const maxAge = 30 * 24 * 60 * 60;
  return `rsp_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearSessionCookie(): string {
  return "rsp_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";
}

function redirectWithStatus(returnTo: string, status: "success" | "error", reason?: string): Response {
  const url = new URL(returnTo);
  url.searchParams.set("auth", status);
  if (reason) url.searchParams.set("reason", reason);
  return new Response(null, { status: 302, headers: { Location: url.toString() } });
}

export async function handleGoogleLogin(req: Request, env: Env): Promise<Response> {
  const state = generateState();
  const redirectUri = getRedirectUri(req);
  const returnTo = getSafeReturnTo(req);
  const authUrl = buildAuthUrl(env, state, redirectUri);

  const payload: OAuthState = { returnTo, redirectUri };
  await env.SESSIONS.put(`oauth_state:${state}`, JSON.stringify(payload), { expirationTtl: 600 });

  return new Response(null, {
    status: 302,
    headers: { Location: authUrl },
  });
}

export async function handleGoogleCallback(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const defaultReturnTo = DEFAULT_FRONTEND_URL;
  if (error) return redirectWithStatus(defaultReturnTo, "error", error);
  if (!code || !state) return redirectWithStatus(defaultReturnTo, "error", "missing_code_or_state");

  const storedState = await env.SESSIONS.get(`oauth_state:${state}`);
  if (!storedState) return redirectWithStatus(defaultReturnTo, "error", "invalid_or_expired_state");
  await env.SESSIONS.delete(`oauth_state:${state}`);

  const oauthState = JSON.parse(storedState) as OAuthState;
  const tokens = await exchangeCode(code, env, oauthState.redirectUri);
  const googleUser = await getGoogleUserInfo(tokens.access_token);

  const db = env.DB;
  const now = Date.now();

  const existing = await db
    .prepare("SELECT id FROM sessions WHERE google_id = ?")
    .bind(googleUser.id)
    .first<{ id: string }>();

  let sessionId: string;
  if (existing) {
    sessionId = existing.id;
    await db
      .prepare("UPDATE sessions SET updated_at = ?, name = ?, picture = ? WHERE id = ?")
      .bind(now, googleUser.name, googleUser.picture, sessionId)
      .run();
  } else {
    sessionId = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO sessions (id, google_id, plan, edits_used, edits_limit, resets_at, created_at, updated_at, name, picture)
         VALUES (?, ?, 'free', 0, 5, ?, ?, ?, ?, ?)`
      )
      .bind(sessionId, googleUser.id, now + 86400000, now, now, googleUser.name, googleUser.picture)
      .run();
  }

  const token = await signToken(sessionId, env);
  const redirect = redirectWithStatus(oauthState.returnTo, "success");
  redirect.headers.append("Set-Cookie", sessionCookie(token));
  return redirect;
}

export async function handleAuthMe(req: Request, env: Env): Promise<Response> {
  const token = req.headers.get("Cookie")?.match(/rsp_session=([^;]+)/)?.[1]
    || req.headers.get("X-Session-ID");

  if (!token) {
    return new Response(JSON.stringify({ ok: true, data: { authenticated: false } }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await verifyToken(token, env);
  if (!result.valid) {
    return new Response(JSON.stringify({ ok: true, data: { authenticated: false } }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const row = await env.DB
    .prepare("SELECT id, google_id, plan, edits_used, edits_limit, resets_at, name, picture FROM sessions WHERE id = ?")
    .bind(result.sessionId)
    .first();

  if (!row) {
    return new Response(JSON.stringify({ ok: true, data: { authenticated: false } }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({
    ok: true,
    data: {
      authenticated: Boolean(row.google_id),
      session_id: row.id,
      plan: row.plan,
      edits_used: row.edits_used,
      edits_limit: row.edits_limit,
      resets_at: row.resets_at,
      user: row.google_id ? { name: row.name, picture: row.picture } : null,
    },
  }), { headers: { "Content-Type": "application/json" } });
}

export async function handleLogout(): Promise<Response> {
  return new Response(JSON.stringify({ ok: true, data: { logged_out: true } }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearSessionCookie(),
    },
  });
}

export async function handleLinkGoogle(req: Request, env: Env): Promise<Response> {
  const tokenMatch = (req.headers.get("Cookie") || "").match(/rsp_session=([^;]+)/);
  if (!tokenMatch) return new Response("Unauthorized", { status: 401 });

  const result = await verifyToken(tokenMatch[1], env);
  if (!result.valid) return new Response("Invalid session", { status: 401 });

  const body = await req.json() as { code: string; state: string };
  if (!body.code || !body.state) return new Response("Missing code or state", { status: 400 });

  const storedState = await env.SESSIONS.get(`oauth_state:${body.state}`);
  if (!storedState) return new Response("Invalid state", { status: 400 });
  await env.SESSIONS.delete(`oauth_state:${body.state}`);

  const oauthState = JSON.parse(storedState) as OAuthState;
  const tokens = await exchangeCode(body.code, env, oauthState.redirectUri);
  const googleUser = await getGoogleUserInfo(tokens.access_token);

  const conflict = await env.DB
    .prepare("SELECT id FROM sessions WHERE google_id = ? AND id != ?")
    .bind(googleUser.id, result.sessionId)
    .first();
  if (conflict) return new Response("Google account already linked to another session", { status: 409 });

  await env.DB
    .prepare("UPDATE sessions SET google_id = ?, updated_at = ?, name = ?, picture = ? WHERE id = ?")
    .bind(googleUser.id, Date.now(), googleUser.name, googleUser.picture, result.sessionId)
    .run();

  return new Response(JSON.stringify({ ok: true, data: { linked: true } }), {
    headers: { "Content-Type": "application/json" },
  });
}
