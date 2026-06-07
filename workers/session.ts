// Session management: HMAC-SHA256 signed tokens prevent session ID forgery
// SESSION_SECRET_KEY is bound via env.SESSION_SECRET_KEY

import type { Env } from "./env";

export function generateSessionId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Sign a session ID into a token
export async function signToken(sessionId: string, env: Env): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.SESSION_SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(sessionId));
  const mac = btoa(String.fromCharCode(...Array.from(new Uint8Array(sig))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
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

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.SESSION_SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const expectedSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(sessionId));
  const expectedMac = btoa(String.fromCharCode(...Array.from(new Uint8Array(expectedSig))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

  if (receivedMac !== expectedMac) return { valid: false, reason: "Invalid signature" };
  return { valid: true, sessionId };
}

export const COOKIE_OPTIONS = `Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`;
