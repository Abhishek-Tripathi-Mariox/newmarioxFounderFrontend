import { requestJson } from '@/founders/api/client';

/** Founder summaries from the backend (internal portal + partner portal numbers for HQ). */
const BASE = '/api/v1/hq/summary';

/**
 * Loads one company summary: 'mariox' (internal portal) or 'partners' (partners portal).
 * Errors carry the server's message (e.g. the product is not connected or not reachable).
 */
export function fetchSummary(name, { signal } = {}) {
  return requestJson(`${BASE}/${name}`, { signal });
}
