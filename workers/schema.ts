// RSP AI Editor — Shared types for Workers API
export type Plan = "free" | "pro" | "max";

export interface Session {
  id: string;
  plan: Plan;
  monthly_credits: number;
  purchased_credits: number;
  credits_used: number;
  reset_at: number; // Unix ms
  created_at: number;
  updated_at: number;
}

export interface EditTask {
  id: string;
  session_id: string;
  mode: "enhance" | "remove-bg" | "restyle";
  status: "pending" | "processing" | "done" | "failed";
  input_url: string;
  output_url?: string;
  error_msg?: string;
  credits_used: number;
  created_at: number;
}

export interface Subscription {
  id: string;
  session_id: string;
  provider: "stripe" | "lemonsqueezy";
  plan: "pro" | "max";
  status: "active" | "cancelled" | "past_due";
  provider_id: string;
  current_period_end: number;
  created_at: number;
}

export interface PricingTier {
  plan: Plan;
  monthly_credits: number;
  resets_every: "day" | "month";
  hd_export: boolean;
  watermark: boolean;
  batch_size: number;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export const RATE_LIMITS = {
  free: { monthly_credits: 5, window: "day" },
  pro: { monthly_credits: 1200, window: "month" },
  max: { monthly_credits: 3500, window: "month" },
} as const;

export type EditMode = "enhance" | "remove-bg" | "restyle";
export type CopyStyle = "clean" | "persuasive" | "concise";
