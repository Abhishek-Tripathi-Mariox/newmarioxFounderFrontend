/**
 * Small fetch wrapper for the Founders HQ API (see API.md): sends the session cookie (the shared
 * Mariox sign-in, docs/SSO.md), speaks JSON, unwraps `{ data }` and turns error bodies into ApiError.
 * A 401 means the Mariox session ended: the browser goes to /login and comes back here afterwards.
 */
import { redirectToLogin } from '@/lib/sso';
import { refreshCount, refreshSettled } from '@/api/client';

export const API_BASE = '/api/v1/hq';

export class ApiError extends Error {
  constructor({ status, code, message, details }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function readBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Requests any URL (absolute or same-origin) and returns the `data` of the answer. */
export async function requestJson(url, { method = 'GET', body, signal, retry = true } = {}) {
  const refreshesBefore = refreshCount();
  let response;
  try {
    response = await fetch(url, {
      method,
      signal,
      credentials: 'include',
      headers: { Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError({ status: 0, code: 'NETWORK_ERROR', message: 'Can’t reach the server. Check your connection and try again.' });
  }

  if (response.status === 401 && retry) {
    // HQ → Team tasks also uses the portal's access token: if its refresh rotated the session cookie
    // while this request was on its way, ask again with the new cookie instead of signing out.
    await refreshSettled();
    if (refreshCount() !== refreshesBefore) return requestJson(url, { method, body, signal, retry: false });
  }

  const payload = await readBody(response);
  if (!response.ok) {
    const error = payload?.error || {};
    if (response.status === 401) redirectToLogin();
    throw new ApiError({
      status: response.status,
      code: error.code || 'HTTP_ERROR',
      message: error.message || `The server answered ${response.status}.`,
      details: error.details,
    });
  }
  return payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload;
}

const call = (method) => (path, body, options) => requestJson(API_BASE + path, { ...options, method, body });

/** `api.get('/users')`, `api.put('/workspace', body)` … paths are relative to /api. */
export const api = {
  get: (path, options) => requestJson(API_BASE + path, options),
  post: call('POST'),
  put: call('PUT'),
  patch: call('PATCH'),
  del: call('DELETE'),
};
