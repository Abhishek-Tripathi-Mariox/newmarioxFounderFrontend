import { buildSample } from '@/founders/summary/data/sample';
import { requestJson } from '@/founders/api/client';

/**
 * Where the founder summaries come from. Default: the Founders HQ backend, which calls the two Mariox
 * products with the founder API key. Set VITE_SUMMARY_API_URL=sample to run on built-in sample data.
 */
const BASE = (import.meta.env.VITE_SUMMARY_API_URL || '/api/v1/hq/summary').trim().replace(/\/$/, '');

/** True when the app runs on built-in sample data instead of the summary API. */
export const usingSampleData = BASE === 'sample';

/**
 * Loads one company summary: 'mariox' (internal portal) or 'partners' (partners portal).
 * Errors carry the server's message (e.g. the product is not connected or not reachable).
 */
export async function fetchSummary(name, { signal } = {}) {
  if (usingSampleData) return buildSample(new Date())[name];
  return requestJson(`${BASE}/${name}`, { signal });
}
