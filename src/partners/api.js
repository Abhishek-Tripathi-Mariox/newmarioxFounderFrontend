// Browser-side API client for the partner portal. Every screen goes through this so errors are
// handled the same way. Paths are relative to API_BASE: api.get('/leads') → GET /api/v1/pp/leads.
// The session is the shared Mariox sign-in cookie (docs/SSO.md), sent with every request.
import { redirectToLogin } from '@/lib/sso';

/** Where the partner-portal API is mounted on the combined backend. */
export const API_BASE = '/api/v1/pp';

/** Full URL for a partner API path, for places that need a plain link (img src, download href). */
export const apiUrl = (path) => `${API_BASE}${path}`;

/** An API failure with the HTTP status and the server's `error` message. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(method, path, data) {
  const res = await fetch(apiUrl(path), {
    method,
    headers: data !== undefined ? { 'content-type': 'application/json' } : undefined,
    body: data !== undefined ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });
  const json = await res.json().catch(() => ({}));
  // A lapsed session sends the browser to the one sign-in page (and back here afterwards), except
  // for the set-password call, whose 401s the form shows.
  if (res.status === 401 && !path.startsWith('/auth')) redirectToLogin();
  if (!res.ok) throw new ApiError(res.status, json.error || `Request failed (${res.status})`);
  return json;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, data) => request('POST', path, data ?? {}),
  patch: (path, data) => request('PATCH', path, data),
  put: (path, data) => request('PUT', path, data),
  del: (path) => request('DELETE', path),
};
