// D1 + KV access helpers

import type { Env } from "./env";

const DAY_MS = 86400000;
const MONTH_MS = 30 * DAY_MS;
const REQUIRED_SESSION_COLUMNS = ["monthly_credits", "purchased_credits", "credits_used", "reset_at"] as const;

let creditsSchemaVerified = false;

export type Plan = "free" | "pro" | "max";

export interface CreditEntitlement {
  allowed: boolean;
  plan: Plan;
  monthly_credits: number;
  purchased_credits: number;
  credits_used: number;
  reset_at: number;
  credits_remaining: number;
}

const PLAN_CREDITS: Record<Plan, number> = {
  free: 5,
  pro: 1200,
  max: 3500,
};

export function getD1(env: Env): D1Database {
  return env.DB;
}

export function getKV(env: Env): KVNamespace {
  return env.SESSIONS;
}

export function getRateLimitKV(env: Env): KVNamespace {
  return env.RATE_LIMITS;
}

export function getMonthlyCredits(plan: string): number {
  return PLAN_CREDITS[normalizePlan(plan)];
}

export function normalizePlan(plan: string): Plan {
  if (plan === "pro" || plan === "max") return plan;
  return "free";
}

export function getResetWindowMs(plan: string): number {
  return normalizePlan(plan) === "free" ? DAY_MS : MONTH_MS;
}

export function nextResetAt(plan: string, now = Date.now()): number {
  return now + getResetWindowMs(plan);
}

export async function ensureCreditsSchema(db: D1Database): Promise<void> {
  if (creditsSchemaVerified) return;

  const tableInfo = await db.prepare("PRAGMA table_info(sessions)").all<{ name: string }>();
  const columns = new Set((tableInfo.results || []).map((column) => column.name));
  const missingColumns = REQUIRED_SESSION_COLUMNS.filter((column) => !columns.has(column));

  if (missingColumns.length > 0) {
    throw new Error(
      `Database schema is outdated. Missing sessions columns: ${missingColumns.join(", ")}. Run wrangler d1 execute rsp-db --file=./migrations/0002_credits_model.sql --remote before deploying this Worker build.`
    );
  }

  creditsSchemaVerified = true;
}

function creditsRemaining(monthlyCredits: number, purchasedCredits: number, creditsUsed: number): number {
  return Math.max(0, monthlyCredits - creditsUsed) + Math.max(0, purchasedCredits);
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

  const record = await kv.get(sessionId, "json") as { count: number; windowStart: number } | null;
  const data = record;

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

// Check entitlement against the credit wallet. Monthly credits reset on reset_at;
// purchased credits persist and are only decremented after monthly credits are used.
export async function checkEntitlement(
  db: D1Database,
  sessionId: string
): Promise<CreditEntitlement> {
  await ensureCreditsSchema(db);
  const now = Date.now();

  const result = await db
    .prepare("SELECT plan, monthly_credits, purchased_credits, credits_used, reset_at FROM sessions WHERE id = ?")
    .bind(sessionId)
    .first();

  if (!result) {
    return {
      allowed: false,
      plan: "free",
      monthly_credits: PLAN_CREDITS.free,
      purchased_credits: 0,
      credits_used: 0,
      reset_at: 0,
      credits_remaining: 0,
    };
  }

  const plan = normalizePlan(result.plan as string);
  const monthly_credits = Number(result.monthly_credits ?? PLAN_CREDITS[plan]);
  const purchased_credits = Number(result.purchased_credits ?? 0);
  let credits_used = Number(result.credits_used ?? 0);
  let reset_at = Number(result.reset_at ?? nextResetAt(plan, now));

  if (now > reset_at) {
    reset_at = nextResetAt(plan, now);
    credits_used = 0;

    await db
      .prepare("UPDATE sessions SET monthly_credits = ?, credits_used = 0, reset_at = ?, updated_at = ? WHERE id = ?")
      .bind(monthly_credits, reset_at, now, sessionId)
      .run();
  }

  const remaining = creditsRemaining(monthly_credits, purchased_credits, credits_used);

  return {
    allowed: remaining > 0,
    plan,
    monthly_credits,
    purchased_credits,
    credits_used,
    reset_at,
    credits_remaining: remaining,
  };
}

// Consume one credit. Use monthly allocation first, then decrement purchased credits.
export async function consumeCredit(db: D1Database, sessionId: string): Promise<void> {
  await ensureCreditsSchema(db);
  const now = Date.now();
  const row = await db
    .prepare("SELECT monthly_credits, purchased_credits, credits_used FROM sessions WHERE id = ?")
    .bind(sessionId)
    .first();

  if (!row) return;

  const monthlyCredits = Number(row.monthly_credits ?? 0);
  const purchasedCredits = Number(row.purchased_credits ?? 0);
  const creditsUsed = Number(row.credits_used ?? 0);

  if (creditsUsed < monthlyCredits) {
    await db
      .prepare("UPDATE sessions SET credits_used = credits_used + 1, updated_at = ? WHERE id = ?")
      .bind(now, sessionId)
      .run();
    return;
  }

  if (purchasedCredits > 0) {
    await db
      .prepare("UPDATE sessions SET purchased_credits = purchased_credits - 1, updated_at = ? WHERE id = ?")
      .bind(now, sessionId)
      .run();
  }
}
