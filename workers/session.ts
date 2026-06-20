// Session management: HMAC-SHA256 signed tokens prevent session ID forgery
// SESSION_SECRET_KEY is bound via env.SESSION_SECRET_KEY

import type { Env } from "./env";

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...Array.from(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function fromBase64Url(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const decoded = atob(`${normalized}${padding}`);
  return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

export function generateSessionId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Sign a session ID into a token
export async function signToken(sessionId: string, env: Env): Promise<string> {
  const key = await importHmacKey(env.SESSION_SECRET_KEY);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(sessionId));
  const mac = toBase64Url(new Uint8Array(sig));
  return `${sessionId}.${mac}`;
}

// Verify a token, return sessionId or error
export async function verifyToken(
  token: string,
  env: Env
): Promise<{ valid: true; sessionId: string } | { valid: false; reason: string }> {
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, reason: "Malformed token" };

  const [sessionId, receivedMac] = parts;

  const key = await importHmacKey(env.SESSION_SECRET_KEY);

  const expectedSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(sessionId));
  const expectedMac = toBase64Url(new Uint8Array(expectedSig));

  if (receivedMac !== expectedMac) return { valid: false, reason: "Invalid signature" };
  return { valid: true, sessionId };
}

export interface AssetAccessPayload {
  key: string;
  taskId: string;
  expiresAt: number;
}

export async function signAssetAccessToken(payload: AssetAccessPayload, env: Env): Promise<string> {
  const encodedPayload = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await importHmacKey(env.SESSION_SECRET_KEY);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encodedPayload));
  return `${encodedPayload}.${toBase64Url(new Uint8Array(sig))}`;
}

export async function verifyAssetAccessToken(
  token: string,
  env: Env
): Promise<{ valid: true; payload: AssetAccessPayload } | { valid: false; reason: string }> {
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, reason: "Malformed token" };

  const [encodedPayload, receivedMac] = parts;
  const key = await importHmacKey(env.SESSION_SECRET_KEY);
  const expectedSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encodedPayload));
  const expectedMac = toBase64Url(new Uint8Array(expectedSig));

  if (receivedMac !== expectedMac) return { valid: false, reason: "Invalid signature" };

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as AssetAccessPayload;
    if (!payload.key || !payload.taskId || !payload.expiresAt) {
      return { valid: false, reason: "Invalid payload" };
    }

    if (Date.now() > payload.expiresAt) return { valid: false, reason: "Token expired" };
    return { valid: true, payload };
  } catch {
    return { valid: false, reason: "Invalid payload" };
  }
}

export const COOKIE_OPTIONS = `Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`;
