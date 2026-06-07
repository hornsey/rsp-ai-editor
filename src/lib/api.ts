// RSP AI Editor — API client for Workers backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.image-editor.co";

function getSessionCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/rsp_session=([^;]+)/);
  return match ? match[1] : null;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const cookie = getSessionCookie();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (cookie) headers["X-Session-ID"] = cookie;

  const res = await fetch(`${API_BASE}/api/v1${path}`, {
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
  return request<SessionData>("/session/init", { method: "POST" });
}

export async function getUsage(): Promise<UsageData> {
  return request<UsageData>("/session/usage");
}

// ── Edit ─────────────────────────────────────────────────────────────────
export async function submitEdit(
  mode: "enhance" | "remove-bg" | "restyle",
  file: File
): Promise<{ task_id: string; status: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const cookie = getSessionCookie();
  const headers: Record<string, string> = {};
  if (cookie) headers["X-Session-ID"] = cookie;

  const res = await fetch(`${API_BASE}/api/v1/edit/${mode}`, {
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
  plan: "free" | "pro" | "team";
  edits_used: number;
  edits_limit: number;
  resets_at: number;
}

export interface UsageData {
  plan: string;
  edits_used: number;
  edits_limit: number;
  resets_at: number;
}

export interface EditStatus {
  task_id: string;
  status: "pending" | "processing" | "done" | "failed";
  mode: string;
  output_url: string | null;
  error: string | null;
  created_at: number;
}
