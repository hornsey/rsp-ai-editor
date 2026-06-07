// D1 + KV access helpers

import type { Env } from "./env";

export function getD1(env: Env): D1Database {
  return env.DB;
}

export function getKV(env: Env): KVNamespace {
  return env.SESSIONS;
}

export function getRateLimitKV(env: Env): KVNamespace {
  return env.RATE_LIMITS;
}

// Check and increment rate limit; returns { allowed: boolean; remaining: number }
export async function checkRateLimit(
  kv: KVNamespace,
  sessionId: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = await kv.getWithMetadata<{ count: number; windowStart: number }>(sessionId);
  const data = record.metadata;

  if (!data || data.windowStart < windowStart) {
    await kv.put(sessionId, JSON.stringify({ count: 1, windowStart: now }),
      { expirationTtl: Math.ceil(windowMs / 1000) + 60 });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  const count = data.count;
  if (count >= limit) {
    return { allowed: false, remaining: 0, resetAt: data.windowStart + windowMs };
  }

  await kv.put(sessionId, JSON.stringify({ count: count + 1, windowStart: data.windowStart }),
    { expirationTtl: Math.ceil(windowMs / 1000) + 60 });
  return { allowed: true, remaining: limit - count - 1, resetAt: data.windowStart + windowMs };
}

// Check entitlement
export async function checkEntitlement(
  db: D1Database,
  sessionId: string
): Promise<{ allowed: boolean; plan: string; edits_used: number; edits_limit: number; resets_at: number }> {
  const now = Math.floor(Date.now());

  const result = await db
    .prepare("SELECT plan, edits_used, edits_limit, resets_at FROM sessions WHERE id = ?")
    .bind(sessionId)
    .first();

  if (!result) return { allowed: false, plan: "free", edits_used: 0, edits_limit: 5, resets_at: now };

  const plan = result.plan as string;
  const edits_used = result.edits_used as number;
  const edits_limit = result.edits_limit as number;
  const resets_at = result.resets_at as number;

  if (now > resets_at) {
    const newResetsAt = plan === "free"
      ? now + 86400000
      : now + 30 * 86400000;

    await db
      .prepare("UPDATE sessions SET edits_used = 0, resets_at = ?, updated_at = ? WHERE id = ?")
      .bind(newResetsAt, now, sessionId)
      .run();

    return { allowed: true, plan, edits_used: 0, edits_limit, resets_at: newResetsAt };
  }

  return {
    allowed: edits_used < edits_limit,
    plan,
    edits_used,
    edits_limit,
    resets_at,
  };
}

// Consume one credit
export async function consumeCredit(db: D1Database, sessionId: string): Promise<void> {
  await db
    .prepare("UPDATE sessions SET edits_used = edits_used + 1, updated_at = ? WHERE id = ?")
    .bind(Date.now(), sessionId)
    .run();
}
