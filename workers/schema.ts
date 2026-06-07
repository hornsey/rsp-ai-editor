// RSP AI Editor — Shared types for Workers API
export interface Session {
  id: string;
  plan: "free" | "pro" | "team";
  edits_used: number;
  edits_limit: number;
  resets_at: number; // Unix ms
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
  plan: "pro" | "team";
  status: "active" | "cancelled" | "past_due";
  provider_id: string;
  current_period_end: number;
  created_at: number;
}

export interface PricingTier {
  plan: string;
  edits_limit: number;
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
  free: { limit: 5, window: "day" },
  pro: { limit: 500, window: "month" },
  team: { limit: 2500, window: "month" },
} as const;

export type EditMode = "enhance" | "remove-bg" | "restyle";
export type CopyStyle = "clean" | "persuasive" | "concise";
