import packageJson from "../../package.json";

const fallbackVersion = packageJson.version || "0.0.0";

function normalizeVersion(rawVersion: string | undefined): string {
  const value = rawVersion?.trim();

  if (!value) return fallbackVersion;

  return value.startsWith("v") ? value : `v${value}`;
}

export const appVersion = normalizeVersion(process.env.NEXT_PUBLIC_APP_VERSION ?? packageJson.version);
