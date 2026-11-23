/**
 * Single sign-on helpers shared by the three areas of the app (docs/SSO.md): the internal portal
 * (`/`), Partners (`/partners/*`) and Founders HQ (`/founders`).
 *
 * Everyone signs in at `/login` (the portal's LoginScreen). The session is the portal's refresh
 * cookie, which the Partners and HQ APIs also read, so:
 *  - an area that finds no session sends the browser to `/login?next=<where they were>`;
 *  - signing out anywhere is `POST /api/v1/auth/logout`, then `/login`;
 *  - moving between areas is a full page load, so each area checks the session afresh.
 */

export const LOGIN_PATH = '/login';
export const PARTNERS_HOME = '/partners/dashboard';
export const PARTNERS_ADMIN_HOME = '/partners/admin';
export const FOUNDERS_HOME = '/founders';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

/** Portal pages that only make sense signed out; never a place to return to after sign-in. */
const SIGNED_OUT_PATHS = [LOGIN_PATH, '/accept-invite', '/reset-password', '/forgot-password'];

const isUnder = (pathname, base) => pathname === base || pathname.startsWith(`${base}/`);

/** Which area a pathname belongs to: 'founders' | 'partners-admin' | 'partners' | 'portal'. */
export function areaOf(pathname) {
  if (isUnder(pathname, FOUNDERS_HOME)) return 'founders';
  if (isUnder(pathname, PARTNERS_ADMIN_HOME)) return 'partners-admin';
  if (isUnder(pathname, '/partners')) return 'partners';
  return 'portal';
}

const pathnameOf = (path) => new URL(path, window.location.origin).pathname;

/** True for paths the internal portal renders (everything outside /partners and /founders). */
export const isPortalPath = (path) => areaOf(pathnameOf(path)) === 'portal';

/**
 * A `?next=` value that is safe to follow: a same-site path (not `//host` or `/\host`), not one of
 * the signed-out pages. Returns the normalised path + query + hash, or null.
 */
export function safeNext(raw) {
  if (typeof raw !== 'string' || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return null;
  let url;
  try {
    url = new URL(raw, window.location.origin);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin || SIGNED_OUT_PATHS.includes(url.pathname)) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}

/** The `next` query parameter of the current URL, when safe to follow. */
export const nextFromLocation = () => safeNext(new URLSearchParams(window.location.search).get('next'));

/**
 * May this user open `path`? Uses `user.apps` from /auth/login|refresh|me. Without `apps` (older
 * API) only the portal counts as open, which is how it behaved before.
 */
export function canOpen(user, path) {
  const apps = (user && user.apps) || {};
  switch (areaOf(pathnameOf(path))) {
    case 'founders': return !!apps.founders;
    case 'partners-admin': return apps.partners === 'admin';
    case 'partners': return !!apps.partners;
    default: return apps.portal !== false;
  }
}

/**
 * Where to go right after signing in: a safe `next` the user may open, else their `home` when it is
 * outside the portal (partner → /partners/dashboard, founder seat → /founders). Null means "the
 * portal's usual landing page".
 */
export function landingFor(user, next) {
  const apps = (user && user.apps) || {};
  const target = safeNext(next);
  // A partner admin (e.g. a founder) heading for the partner side's home runs Partners from the admin console.
  if (target && apps.partners === 'admin' && pathnameOf(target) === PARTNERS_HOME) return PARTNERS_ADMIN_HOME;
  if (target && canOpen(user, target)) return target;
  const home = safeNext(user && user.home);
  if (home && !isPortalPath(home)) return home;
  if (apps.portal === false) {
    if (apps.partners) return apps.partners === 'admin' ? PARTNERS_ADMIN_HOME : PARTNERS_HOME;
    if (apps.founders) return FOUNDERS_HOME;
  }
  return null;
}

/**
 * Query string carrying the sign-in context between /login and /forgot-password: a safe `?next=`
 * from `params`, plus `extra` values that are set (e.g. email, reset). Old `?as=` values are dropped.
 */
export function signInQuery(params, extra = {}) {
  const out = new URLSearchParams();
  const next = safeNext(params.get('next'));
  if (next) out.set('next', next);
  Object.entries(extra).forEach(([k, v]) => v && out.set(k, v));
  const q = out.toString();
  return q ? `?${q}` : '';
}

/** `/login`, with `?next=` when given. */
export const loginUrl = (next) => {
  const target = safeNext(next);
  return target ? `${LOGIN_PATH}?next=${encodeURIComponent(target)}` : LOGIN_PATH;
};

const here = () => `${window.location.pathname}${window.location.search}${window.location.hash}`;

let leaving = false;

/** Full page load to another area (or the login page). Repeated calls while leaving are ignored. */
export function leaveTo(path, { replace = false } = {}) {
  if (leaving) return;
  leaving = true;
  if (replace) window.location.replace(path);
  else window.location.assign(path);
}

/** No (valid) session in this area: go to the one sign-in page and come back here afterwards. */
export const redirectToLogin = (next = here()) => leaveTo(loginUrl(next), { replace: true });

/** Sign out of every area: revoke the session on the server, then show the sign-in page. */
export async function signOut() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
  } catch {
    // Offline or already signed out — the sign-in page is still the right place to land.
  }
  leaveTo(LOGIN_PATH);
}

/**
 * True while the page is Founders HQ (it hosts portal screens such as Leads). The internal portal is
 * Mariox's own, so there "our company" is always Mariox; only Founders HQ chooses between companies.
 */
export const inFoundersHQ = () => areaOf(window.location.pathname) === 'founders';
