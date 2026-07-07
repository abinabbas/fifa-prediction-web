/**
 * API base URL for all frontend requests.
 * Set NEXT_PUBLIC_API_URL in your hosting provider (required for production builds).
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:4000";
  }

  return "";
}
