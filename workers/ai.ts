// AI inference — abstracted behind AI_PROVIDER
// Supports: cf-workers-ai (default), replicate, cloudinary

import type { Env } from "./env";
import type { EditMode } from "./schema";

export interface AIResult {
  output_url: string;
  width?: number;
  height?: number;
}

export async function runAIEdit(
  inputR2Url: string,
  mode: EditMode,
  env: Env
): Promise<AIResult> {
  const provider = env.AI_PROVIDER || "cf-workers-ai";

  switch (provider) {
    case "cf-workers-ai":   return runCFWorkersAI(inputR2Url, mode, env);
    case "replicate":        return runReplicate(inputR2Url, mode, env);
    case "cloudinary":       return runCloudinary(inputR2Url, mode, env);
    default:                 throw new Error(`Unknown AI_PROVIDER: ${provider}`);
  }
}

// ── Cloudflare Workers AI ─────────────────────────────────────────────────
async function runCFWorkersAI(_inputR2Url: string, _mode: EditMode, _env: Env): Promise<AIResult> {
  // TODO: Use @cf/... models via AI Gateway
  // Required env: AI_GATEWAY_ENDPOINT (Cloudflare AI Gateway URL)
  // Suggested models:
  //   enhance   → @cf/stabilityai/stable-diffusion-xl-base-1.0  (upscaler)
  //   remove-bg → dedicated BG removal model or @cf/llava-hf/llava-1.5-7b-hf
  //   restyle   → @cf/stabilityai/stable-diffusion-xl-base-1.0
  throw new Error("[TODO] Implement CF Workers AI. Set AI_GATEWAY_ENDPOINT and choose model slugs.");
}

// ── Replicate ────────────────────────────────────────────────────────────
async function runReplicate(inputR2Url: string, mode: EditMode, env: Env): Promise<AIResult> {
  const apiKey = env.REPLICATE_API_KEY;
  if (!apiKey) throw new Error("REPLICATE_API_KEY not set");

  const modelVersions: Record<EditMode, string> = {
    "enhance":     "stability-ai/sdxl:...",
    "remove-bg":   "zhileio/rembg:...",
    "restyle":     "stability-ai/stable-diffusion:...",
  };

  const inputResp = await fetch(inputR2Url);
  const inputData = await inputResp.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...Array.from(new Uint8Array(inputData))));

  const resp = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: modelVersions[mode],
      input: { image: `data:image/jpeg;base64,${base64}` },
    }),
  });

  if (!resp.ok) throw new Error(`Replicate error: ${resp.status}`);
  const pred = (await resp.json()) as { id: string };

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const status = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { "Authorization": `Token ${apiKey}` },
    }).then(r => r.json()) as { status: string; output?: string[] };

    if (status.status === "succeeded") {
      const output = Array.isArray(status.output) ? status.output[0] : status.output;
      return { output_url: output as string };
    }
    if (status.status === "failed") throw new Error("Replicate inference failed");
  }
  throw new Error("Replicate inference timeout (>60s)");
}

// ── Cloudinary ────────────────────────────────────────────────────────────
async function runCloudinary(inputR2Url: string, mode: EditMode, env: Env): Promise<AIResult> {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary env vars not set");

  const transforms: Record<EditMode, string> = {
    "enhance":     "auto_enhance",
    "remove-bg":   "e_background_removal",
    "restyle":     "e_style_transfer,fl_realistic_avatar",
  };

  const inputResp = await fetch(inputR2Url);
  const inputData = await inputResp.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...Array.from(new Uint8Array(inputData))));

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `timestamp=${timestamp}${apiSecret}`;
  const sigBytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(toSign));
  const signature = Array.from(new Uint8Array(sigBytes)).map(b => b.toString(16).padStart(2, "0")).join("");

  const formData = new FormData();
  formData.append("file", `data:image/jpeg;base64,${base64}`);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("transformation", transforms[mode]);

  const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!resp.ok) throw new Error(`Cloudinary error: ${resp.status}`);
  const result = await resp.json() as { secure_url: string; width: number; height: number };
  return { output_url: result.secure_url, width: result.width, height: result.height };
}
