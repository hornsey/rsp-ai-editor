// RSP AI Editor — API client for Workers backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.image-editor.co";
const SESSION_TOKEN_KEY = "rsp_session_token";

export function getApiBase(): string {
  return API_BASE;
}

function getSessionCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/rsp_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getStoredSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setStoredSessionToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_TOKEN_KEY, token);
  } catch {
    // Anonymous editing should still work when storage is blocked if cookies are available.
  }
}

function clearStoredSessionToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // Ignore storage failures during logout.
  }
}

function getSessionToken(): string | null {
  return getSessionCookie() || getStoredSessionToken();
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const sessionToken = getSessionToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (sessionToken) headers["X-Session-ID"] = sessionToken;

  const res = await fetch(`${getApiBase()}/api/v1${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data.data as T;
}

// ── Session ───────────────────────────────────────────────────────────────
export async function initSession(): Promise<SessionData> {
  const session = await request<SessionData>("/session/init", { method: "POST" });
  if (session.session_token) setStoredSessionToken(session.session_token);
  return session;
}

export async function getUsage(): Promise<UsageData> {
  return request<UsageData>("/session/usage");
}

// ── Auth ──────────────────────────────────────────────────────────────────
export function getGoogleLoginUrl(returnTo?: string): string {
  const target = returnTo || (typeof window !== "undefined" ? window.location.href : "https://image-editor.co/editor");
  return `${getApiBase()}/api/v1/auth/google?return_to=${encodeURIComponent(target)}`;
}

export async function getAuthMe(): Promise<AuthMeData> {
  return request<AuthMeData>("/auth/me");
}

export async function logout(): Promise<{ logged_out: boolean }> {
  try {
    return await request<{ logged_out: boolean }>("/auth/logout", { method: "POST" });
  } finally {
    clearStoredSessionToken();
  }
}

// ── Edit ─────────────────────────────────────────────────────────────────
export async function submitEdit(
  mode: "enhance" | "remove-bg" | "restyle",
  file: File
): Promise<{ task_id: string; status: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const sessionToken = getSessionToken();
  const headers: Record<string, string> = {};
  if (sessionToken) headers["X-Session-ID"] = sessionToken;

  const res = await fetch(`${getApiBase()}/api/v1/edit/${mode}`, {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || "Edit failed");
  return data.data;
}

export async function getEditStatus(taskId: string): Promise<EditStatus> {
  return request<EditStatus>(`/edit/${taskId}`);
}

export async function fetchAuthorizedAssetUrl(url: string): Promise<string> {
  const sessionToken = getSessionToken();
  const headers: Record<string, string> = {};
  if (sessionToken) headers["X-Session-ID"] = sessionToken;

  const res = await fetch(url, { headers, credentials: "include" });
  if (!res.ok) throw new Error(`Failed to load edited image: ${res.status}`);
  return URL.createObjectURL(await res.blob());
}

// ── Copy rewrite ─────────────────────────────────────────────────────────
export async function rewriteCopy(
  text: string,
  style: "clean" | "persuasive" | "concise"
): Promise<{ versions: string[] }> {
  return request<{ versions: string[] }>("/copy/rewrite", {
    method: "POST",
    body: JSON.stringify({ text, style }),
  });
}

// ── Types ────────────────────────────────────────────────────────────────
export interface SessionData {
  session_id: string;
  session_token?: string;
  plan: "free" | "pro" | "max";
  monthly_credits: number;
  purchased_credits: number;
  credits_used: number;
  credits_remaining: number;
  reset_at: number;
}

export interface UsageData {
  plan: string;
  monthly_credits: number;
  purchased_credits: number;
  credits_used: number;
  credits_remaining: number;
  reset_at: number;
}

export interface AuthMeData {
  authenticated: boolean;
  session_id?: string;
  plan?: string;
  monthly_credits?: number;
  purchased_credits?: number;
  credits_used?: number;
  credits_remaining?: number;
  reset_at?: number;
  user?: {
    name?: string | null;
    picture?: string | null;
  } | null;
}

export interface EditStatus {
  task_id: string;
  status: "pending" | "processing" | "done" | "failed";
  mode: string;
  output_url: string | null;
  error: string | null;
  created_at: number;
}
