// TypeScript declarations for Workers runtime bindings

export interface Env {
  // D1 database
  DB: D1Database;

  // KV namespaces
  SESSIONS: KVNamespace;
  RATE_LIMITS: KVNamespace;

  // R2 buckets
  UPLOADS: R2Bucket;
  OUTPUTS: R2Bucket;

  // Auth secrets
  SESSION_SECRET_KEY: string;
  ADMIN_KEY: string;

  // Google OAuth
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;

  // AI provider
  AI_PROVIDER?: string;
  REPLICATE_API_KEY?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  AI_GATEWAY_ENDPOINT?: string;
}
