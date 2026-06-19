const DEFAULT_SITE_URL = "https://image-editor.co";

function normalizeSiteUrl(rawUrl: string | undefined): string {
  const value = rawUrl?.trim();
  if (!value) return DEFAULT_SITE_URL;

  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function toAbsoluteUrl(path = "/"): string {
  return new URL(path, siteUrl).toString();
}