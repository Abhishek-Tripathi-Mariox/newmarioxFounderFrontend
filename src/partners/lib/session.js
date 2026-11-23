import { apiUrl } from '@/partners/api';

/**
 * Who is signed in, checked once per page load (sign-in and sign-out do a full page load, so the
 * answer cannot go stale in between; an expired session mid-visit is caught by the API client's
 * 401 handling). This stands in for the Next middleware, which read the session cookie per request.
 *
 * Resolves to one of:
 *  - { status: 'in', user }   GET /me succeeded
 *  - { status: 'out' }        GET /me answered 401: no valid Mariox session (→ /login)
 *  - { status: 'denied' }     GET /me answered 403: signed in, but no partner access
 *  - { status: 'unknown' }    the API could not be reached or failed; the screens render and show
 *                             their own load errors, like the Next app did when the database was down.
 *
 * Uses a bare fetch rather than the shared client, so a 401 here does not trigger the client's
 * redirect to the login page.
 */
let pending = null;

export function loadSession() {
  pending ??= fetch(apiUrl('/me'), { credentials: 'include' })
    .then(async res => {
      if (res.status === 401) return { status: 'out' };
      if (res.status === 403) return { status: 'denied' };
      if (!res.ok) return { status: 'unknown' };
      const body = await res.json().catch(() => ({}));
      return body.user ? { status: 'in', user: body.user, body } : { status: 'unknown' };
    })
    .catch(() => ({ status: 'unknown' }));
  return pending;
}

/** Landing page for a signed-in user (middleware `home()`). */
export const homeFor = (role) => (role === 'admin' ? '/partners/admin' : '/partners/dashboard');
