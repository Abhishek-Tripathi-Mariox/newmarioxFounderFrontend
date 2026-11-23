import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import {
  MemoryRouter,
  Route,
  Routes,
  UNSAFE_LocationContext as LocationContext,
  UNSAFE_RouteContext as RouteContext,
  useLocation,
} from 'react-router-dom';
import { leaveTo, redirectToLogin } from '@/lib/sso';
import { PortalHostContext } from '@/partners/lib/portalHost';
import { ensurePartnerFonts } from '@/partners/lib/fonts';
import { loadSession } from '@/partners/lib/session';
import { primeApi } from '@/partners/hooks/useApi';
import { ToastProvider } from '@/partners/components/ui';
import { UserProvider } from '@/partners/components/UserProvider';
import { SettingsProvider } from '@/partners/components/SettingsProvider';
import '@/partners/styles/isolation.css';
import '@/partners/styles/theme.css';
import '@/partners/styles/globals.css';
import '@/partners/styles/acquire.css';

const PartnersPage = lazy(() => import('@/partners/pages/admin/AdminPartnersPage'));
const PartnerDetailPage = lazy(() => import('@/partners/pages/admin/AdminPartnerDetailPage'));

/** The partner admin's Partners list; the detail page is `${LIST}/:id` (same paths as the partner app). */
const PARTNERS_LIST_PATH = '/partners/admin/partners';

/** What the app's BrowserRouter puts in context, reset so the subtree below starts a router of its own. */
const NO_PARENT_ROUTE = { outlet: null, matches: [], isDataRoute: false };

const box = { background: '#fff', border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px', padding: '36px 16px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' };

/**
 * Any other partner page a link leads to (a lead, the requests inbox, projects …): open the full
 * partner admin there, in this browser tab.
 */
function OpenInPartnerApp() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => { leaveTo(`${pathname}${search}${hash}`); }, [pathname, search, hash]);
  return <div style={box} role="status">Opening the partner portal…</div>;
}

/** Like the partner app (PartnerRoot), show the top of the page after moving between list and detail. */
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** The partner app's admin session check (RouteGuards RequireSession admin), with HQ-style messages. */
function usePartnerAdminSession() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    let live = true;
    loadSession().then((s) => {
      if (s.status === 'in') primeApi('/me', s.body);
      if (live) setSession(s);
    });
    return () => { live = false; };
  }, []);
  useEffect(() => { if (session?.status === 'out') redirectToLogin(); }, [session]);
  return session;
}

/**
 * The partner admin's Partners page and partner detail page (/partners/admin/partners[/:id]) hosted
 * inside another screen (Founders HQ → Companies → Mariox → Partners): the same components, API and
 * behaviour as the partner app, without its top dock.
 *
 * Router: those pages (and the lead pipeline, project list and links inside them) use React Router
 * hooks, and moving between list and detail must not change the browser URL. So this subtree gets a
 * MemoryRouter of its own. React Router refuses a <Router> inside another one only by checking for a
 * location in context, so the host's location and matched routes are cleared for this subtree first;
 * nothing inside reads the host router, and the host never sees the in-memory location. Paths other
 * than the list and detail open the full partner admin in the same browser tab.
 *
 * Styles: everything renders inside `.pp-root.pp-embed`, which scopes the partner stylesheets and
 * carries their design tokens itself (theme.css applies the page-level `:root` / `body` rules only to
 * a full-page `.pp-root`), so neither side's styles reach the other. HQ is light only, so is this.
 */
export default function PartnersAdminEmbed() {
  const [host, setHost] = useState(null);
  const session = usePartnerAdminSession();
  useEffect(() => { ensurePartnerFonts(); }, []);

  let body = null;
  if (!session || session.status === 'out') body = <div style={box} role="status">Loading partners…</div>;
  else if (session.status === 'denied' || (session.status === 'in' && session.user.role !== 'admin')) {
    body = <div style={box}>Your Mariox account isn’t a partner admin, so partners can’t be managed here.</div>;
  } else if (host) {
    body = (
      <LocationContext.Provider value={null}>
        <RouteContext.Provider value={NO_PARENT_ROUTE}>
          <MemoryRouter initialEntries={[PARTNERS_LIST_PATH]}>
            <ScrollToTopOnNavigate />
            <PortalHostContext.Provider value={host}>
              <UserProvider>
                <SettingsProvider>
                  <ToastProvider>
                    <section className="view">
                      <Suspense fallback={<div style={box} role="status">Loading partners…</div>}>
                        <Routes>
                          <Route path={PARTNERS_LIST_PATH} element={<PartnersPage />} />
                          <Route path={`${PARTNERS_LIST_PATH}/:id`} element={<PartnerDetailPage />} />
                          <Route path="*" element={<OpenInPartnerApp />} />
                        </Routes>
                      </Suspense>
                    </section>
                  </ToastProvider>
                </SettingsProvider>
              </UserProvider>
            </PortalHostContext.Provider>
          </MemoryRouter>
        </RouteContext.Provider>
      </LocationContext.Provider>
    );
  }

  return (
    <div ref={setHost} className="pp-root pp-embed" data-theme="light">
      {body}
    </div>
  );
}
