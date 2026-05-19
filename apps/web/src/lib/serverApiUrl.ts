/**
 * Base URL for server-side fetch() to the Nest API (RSC, route handlers, etc.).
 * Set `API_URL` in `apps/web/.env` (e.g. `http://127.0.0.1:3001`).
 * In development only, falls back to 127.0.0.1:3001 if unset so local blog/shop still work when .env was missed.
 */
export function getServerApiBaseUrl(): string | null {
  const raw = process.env.API_URL?.trim();
  const normalized = raw?.replace(/\/$/, '') ?? '';
  if (normalized) return normalized;

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[your-style] API_URL is not set. Using http://127.0.0.1:3001 for server-side API fetches. Add API_URL to apps/web/.env to match your API.',
    );
    return 'http://127.0.0.1:3001';
  }

  console.error(
    '[your-style] API_URL is not set. Server-side fetches to the API will fail. Set API_URL in apps/web/.env or your host env.',
  );
  return null;
}
