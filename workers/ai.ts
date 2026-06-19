// AI inference — abstracted behind AI_PROVIDER
// Supports: fal (primary), cf-workers-ai, replicate, cloudinary

import type { Env } from "./env";
import type { EditMode } from "./schema";

export interface AIResult {
  output_url?: string;
  output?: ArrayBuffer;
  contentType?: string;
  width?: number;
  height?: number;
}

export interface AIInputAsset {
  data: ArrayBuffer;
  contentType: string;
  filename: string;
}

const MODEL_SLUG = "openai/gpt-image-2/edit";

const FAL_QUEUE_URL = "https://queue.fal.run";
const POLL_INTERVAL_MS = 2000;
const POLL_MAX_ATTEMPTS = 60; // ~2 minutes

export async function runAIEdit(
  inputR2Url: string,
  mode: EditMode,
  env: Env,
  inputAsset?: AIInputAsset
): Promise<AIResult> {
  if (mode === "remove-bg") {
    if (!inputAsset) throw new Error("remove-bg requires the original uploaded image bytes");
    return runRembgRemoveBg(inputAsset, env);
  }

  const provider = env.AI_PROVIDER || "fal";

  switch (provider) {
    case "fal":        return runFalEdit(inputR2Url, mode, env);
    case "cf-workers-ai": return runCFWorkersAI(inputR2Url, mode, env);
    case "replicate":   return runReplicate(inputR2Url, mode, env);
    case "cloudinary":  return runCloudinary(inputR2Url, mode, env);
    default:            throw new Error(`Unknown AI_PROVIDER: ${provider}`);
  }
}

// ── rembg HTTP API ─────────────────────────────────────────────────────────
async function runRembgRemoveBg(input: AIInputAsset, env: Env): Promise<AIResult> {
  const apiUrl = (env.REMBG_API_URL || "http://43.137.51.88:8000").replace(/\/+$/, "");
  const apiKey = env.REMBG_API_KEY;
  if (!apiKey) throw new Error("REMBG_API_KEY not set — set it as a Wrangler secret.");

  const model = env.REMBG_MODEL || "general";
  if (!["general", "human"].includes(model)) {
    throw new Error("REMBG_MODEL must be either 'general' or 'human'");
  }

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([input.data], { type: input.contentType || "application/octet-stream" }),
    input.filename || "upload.jpg"
  );

  const resp = await fetch(`${apiUrl}/remove-bg?model=${encodeURIComponent(model)}`, {
    method: "POST",
    headers: { "X-API-Key": apiKey },
    body: formData,
  });

  if (!resp.ok) {
    const body = await resp.text();
    let detail = body;
    try {
      const parsed = JSON.parse(body) as { detail?: unknown };
      if (typeof parsed.detail === "string") detail = parsed.detail;
    } catch {
      // Keep the raw provider body for non-JSON failures.
    }
    throw new Error(`rembg failed ${resp.status}: ${detail || resp.statusText}`);
  }

  const contentType = resp.headers.get("Content-Type") || "image/png";
  if (!contentType.toLowerCase().includes("image/png")) {
    throw new Error(`rembg returned unexpected content type: ${contentType}`);
  }

  return {
    output: await resp.arrayBuffer(),
    contentType,
  };
}

// ── fal.ai ─────────────────────────────────────────────────────────────────
// Primary provider: fal.ai GPT Image 2 edit endpoint
// Docs: https://fal.ai/models/openai/gpt-image-2/edit/api
//
// Input schema for this model (image-to-image):
//   prompt          string   — instruction describing the edit
//   image_urls      string[] — publicly reachable URLs of source images
//   image_size      string   — "auto" | "square_hd" | "square" | "portrait_4_3"
//                              | "portrait_16_9" | "landscape_4_3" | "landscape_16_9"
//   quality         string   — "auto" | "low" | "medium" | "high" (default "high")
//   num_images      number   — number of output images (default 1, max 4)
//   output_format   string   — "png" | "jpeg" | "webp" (default "png")
//
// Output schema:
//   images: [{ url, width, height, file_name, content_type }]
//
// Queue protocol:
//   POST https://queue.fal.run/{model_slug}
//     body: { input: { ... }, webhookUrl: null }
//   → { request_id: string }
//
//   GET https://queue.fal.run/{model_slug}/requests/{request_id}
//   → { status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED", ... }
//
//   GET https://queue.fal.run/{model_slug}/requests/{request_id}/data
//   → final output object
// ─────────────────────────────────────────────────────────────────────────────

interface FalQueueResponse {
  request_id: string;
}

interface FalQueueStatus {
  status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  logs?: Array<{ message: string }>;
}

interface FalOutput {
  images: Array<{
    url: string;
    width: number;
    height: number;
    file_name: string;
    content_type: string;
  }>;
}

function buildEditPrompt(mode: EditMode): string {
  switch (mode) {
    case "enhance":
      return "Enhance this image: improve lighting, sharpness, color balance, and overall quality while preserving the original content and composition.";
    case "remove-bg":
      return "Remove the background from this image, leaving only the main subject with a transparent background.";
    case "restyle":
      return "Transform the style of this image while keeping the subject and composition intact — apply a fresh, modern aesthetic.";
    default:
      return "Edit this image as requested.";
  }
}

async function runFalEdit(
  inputR2Url: string,
  mode: EditMode,
  env: Env
): Promise<AIResult> {
  const apiKey = env.FAL_KEY;
  if (!apiKey) throw new Error("FAL_KEY not set — set it as a Wrangler secret.");

  const prompt = buildEditPrompt(mode);

  // Step 1: Submit to fal queue
  const submitResp = await fetch(`${FAL_QUEUE_URL}/${MODEL_SLUG}`, {
    method: "POST",
    headers: {
      "Authorization": `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt,
        image_urls: [inputR2Url],
        image_size: "auto",
        quality: "high",
        num_images: 1,
        output_format: "png",
      },
      webhookUrl: null, // We poll; no webhook needed
    }),
  });

  if (!submitResp.ok) {
    const body = await submitResp.text();
    throw new Error(`fal.submit failed ${submitResp.status}: ${body}`);
  }

  const { request_id } = await submitResp.json() as FalQueueResponse;

  // Step 2: Poll until completed
  for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));

    const statusResp = await fetch(
      `${FAL_QUEUE_URL}/${MODEL_SLUG}/requests/${request_id}`,
      {
        headers: { "Authorization": `Key ${apiKey}` },
      }
    );

    if (!statusResp.ok) {
      throw new Error(`fal.status poll failed ${statusResp.status}`);
    }

    const status = await statusResp.json() as FalQueueStatus;

    if (status.status === "COMPLETED") {
      // Step 3: Fetch result data
      const resultResp = await fetch(
        `${FAL_QUEUE_URL}/${MODEL_SLUG}/requests/${request_id}/data`,
        { headers: { "Authorization": `Key ${apiKey}` } }
      );

      if (!resultResp.ok) throw new Error(`fal.result failed ${resultResp.status}`);
      const result = await resultResp.json() as FalOutput;

      if (!result.images || result.images.length === 0) {
        throw new Error("fal returned no images in output");
      }

      const first = result.images[0];
      return {
        output_url: first.url,
        width: first.width,
        height: first.height,
      };
    }

    if (status.status === "FAILED") {
      throw new Error("fal inference failed on the provider side");
    }

    // IN_QUEUE or IN_PROGRESS — keep polling
  }

  throw new Error(`fal inference timeout after ${POLL_MAX_ATTEMPTS * POLL_INTERVAL_MS / 1000}s`);
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
