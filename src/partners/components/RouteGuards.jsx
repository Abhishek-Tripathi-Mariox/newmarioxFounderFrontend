import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { primeApi } from '@/partners/hooks/useApi';
import { homeFor, loadSession } from '@/partners/lib/session';
import { LOGIN_PATH, leaveTo, redirectToLogin, signOut } from '@/lib/sso';
import { AuthLayout } from './AuthLayout';
import { Button } from './ui';

/** The page-load session check as React state; null while it is in flight. */
function useSession() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    let live = true;
    loadSession().then(s => {
      if (s.status === 'in') primeApi('/me', s.body); // UserProvider shows the name without a second wait
      if (live) setSession(s);
    });
    return () => { live = false; };
  }, []);
  return session;
}

/** No session: the shared sign-in page (full page load), returning to `next` afterwards. */
function ToLogin({ next }) {
  useEffect(() => { redirectToLogin(next); }, [next]);
  return null;
}

/** Signed in to Mariox, but this account has no partner profile / partner admin access. */
function NoAccess() {
  return (
    <AuthLayout eyebrow="Partner portal" title="No access here" subtitle="Your Mariox account isn’t set up for the partner portal. Ask a Mariox admin if you think it should be.">
      <div className="stack" style={{ gap: 12 }}>
        <a className="btn fire block" href="/">Go to the team portal</a>
        <Button variant="ghost" block onClick={signOut}>Sign in with another account</Button>
      </div>
    </AuthLayout>
  );
}

/**
 * Signed-in areas (the Next middleware rules):
 *  - signed out → /login?next=<path>
 *  - signed in without partner access (403) → a "no access" screen (not /login, which would loop)
 *  - `admin` areas: a partner is sent to /partners/dashboard
 * Admins may open partner pages, as before. The API enforces access either way; this only decides
 * which screen to show.
 */
export function RequireSession({ admin = false }) {
  const session = useSession();
  const { pathname, search } = useLocation();
  if (!session) return null;
  if (session.status === 'out') return <ToLogin next={`${pathname}${search}`} />;
  if (session.status === 'denied') return <NoAccess />;
  if (admin && session.status === 'in' && session.user.role !== 'admin') return <Navigate to="/partners/dashboard" replace />;
  return <Outlet />;
}

/** Set-password: a signed-in user goes to their home page instead. */
export function PublicOnly() {
  const session = useSession();
  if (!session) return null;
  if (session.status === 'in') return <Navigate to={homeFor(session.user.role)} replace />;
  return <Outlet />;
}

/** /partners and unknown /partners/* paths: home when signed in, otherwise the sign-in page. */
export function HomeRedirect() {
  const session = useSession();
  if (!session) return null;
  if (session.status === 'out') return <ToLogin />;
  if (session.status === 'denied') return <NoAccess />;
  return <Navigate to={homeFor(session.user.role)} replace />;
}

/**
 * /partners/login (old links, bookmarks, invite emails): the one sign-in page now lives at /login.
 * Its `?next=` is passed on; `?email=` / `?reset=1` keep pre-filling the form.
 */
export function LoginRedirect() {
  const { search } = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(search);
    const out = new URLSearchParams();
    ['next', 'email', 'reset'].forEach((k) => params.get(k) && out.set(k, params.get(k)));
    leaveTo(`${LOGIN_PATH}?${out}`, { replace: true });
  }, [search]);
  return null;
}

/**
 * /partners/forgot-password (old links): forgot password is the one Mariox One flow at
 * /forgot-password. `?email=` / `?next=` are passed on.
 */
export function ForgotRedirect() {
  const { search } = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(search);
    const out = new URLSearchParams();
    ['email', 'next'].forEach((k) => params.get(k) && out.set(k, params.get(k)));
    leaveTo(`/forgot-password${out.size ? `?${out}` : ''}`, { replace: true });
  }, [search]);
  return null;
}
