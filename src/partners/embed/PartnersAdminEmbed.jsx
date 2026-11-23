import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import {
  MemoryRouter,
  Route,
  Routes,
  UNSAFE_LocationContext as LocationContext,
  UNSAFE_RouteContext as RouteContext,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { PARTNERS_ADMIN_HOME as PARTNER_ADMIN_HOME, leaveTo, redirectToLogin } from '@/lib/sso';
import { PortalHostContext } from '@/partners/lib/portalHost';
import { ensurePartnerFonts } from '@/partners/lib/fonts';
import { loadSession } from '@/partners/lib/session';
import { primeApi } from '@/partners/hooks/useApi';
import { ToastProvider } from '@/partners/components/ui';
import { UserProvider } from '@/partners/components/UserProvider';
import { SettingsProvider } from '@/partners/components/SettingsProvider';
import { SectionGate } from '@/partners/components/SectionGate';
import { ADMIN_PAGE_MOD } from '@/partners/lib/perms';
import '@/partners/styles/isolation.css';
import '@/partners/styles/theme.css';
import '@/partners/styles/globals.css';
import '@/partners/styles/acquire.css';
import '@/partners/styles/skin.css';

/** The admin console's pages (partners/routes.jsx → admin, same paths), loaded on first use. */
const ADMIN_PAGES = [
  ['', () => import('@/partners/pages/admin/AdminOverviewPage')],
  ['/acquisition', () => import('@/partners/pages/admin/AdminAcquisitionPage')],
  ['/partners', () => import('@/partners/pages/admin/AdminPartnersPage')],
  ['/partners/:id', () => import('@/partners/pages/admin/AdminPartnerDetailPage')],
  ['/leads', () => import('@/partners/pages/admin/AdminLeadsPage')],
  ['/leads/:id', () => import('@/partners/pages/admin/AdminLeadDetailPage')],
  ['/projects', () => import('@/partners/pages/admin/AdminProjectsPage')],
  ['/requests', () => import('@/partners/pages/admin/AdminRequestsPage')],
  ['/kit', () => import('@/partners/pages/admin/AdminKitPage')],
  ['/settings', () => import('@/partners/pages/admin/AdminSettingsPage')],
  ['/account', () => import('@/partners/pages/admin/AdminAccountPage')],
].map(([sub, load]) => [PARTNER_ADMIN_HOME + sub, lazy(load), ADMIN_PAGE_MOD[sub]]);

/** What the app's BrowserRouter puts in context, reset so the subtree below starts a router of its own. */
const NO_PARENT_ROUTE = { outlet: null, matches: [], isDataRoute: false };

const box = { background: '#fff', border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px', padding: '36px 16px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' };

/**
 * A partner page outside the admin console (e.g. the partner side's own screens): open the full
 * partner app there, in this browser tab.
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

/**
 * Keeps the in-memory location and the host in step: a new `path` from the host (its sidebar) moves
 * there; moving inside the pages (links, list → detail) is reported through `onPath`.
 */
function PathSync({ path, onPath }) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const shown = useRef(path);
  useEffect(() => {
    if (path && path !== shown.current) {
      shown.current = path;
      navigate(path);
    }
  }, [path, navigate]);
  useEffect(() => {
    shown.current = pathname + search;
    if (onPath) onPath(shown.current);
  }, [pathname, search, onPath]);
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
 * The partner admin console (/partners/admin/*: Overview, Acquisition, Partners, Leads, Projects,
 * Requests, Sales kit, Settings, account) hosted inside another screen (Founders HQ → Companies →
 * Mariox → Partner portal): the same components, API and behaviour as the partner app, without its
 * sidebar and header (AppShell), because the host's sidebar lists the pages. `path` picks the page; `onPath` hears about
 * moves made inside it.
 *
 * Router: those pages (and the lead pipeline, project list and links inside them) use React Router
 * hooks, and moving between them must not change the browser URL. So this subtree gets a
 * MemoryRouter of its own. React Router refuses a <Router> inside another one only by checking for a
 * location in context, so the host's location and matched routes are cleared for this subtree first;
 * nothing inside reads the host router, and the host never sees the in-memory location. Paths outside
 * the admin console open the full partner app in the same browser tab.
 *
 * Styles: everything renders inside `.pp-root.pp-embed`, which scopes the partner stylesheets and
 * carries their design tokens itself (theme.css applies the page-level `:root` / `body` rules only to
 * a full-page `.pp-root`), so neither side's styles reach the other. HQ is light only, so is this.
 */
export default function PartnersAdminEmbed({ path = PARTNER_ADMIN_HOME, onPath }) {
  const [host, setHost] = useState(null);
  const session = usePartnerAdminSession();
  useEffect(() => { ensurePartnerFonts(); }, []);

  let body = null;
  if (!session || session.status === 'out') body = <div style={box} role="status">Loading the partner portal…</div>;
  else if (session.status === 'denied' || (session.status === 'in' && session.user.role !== 'admin')) {
    body = <div style={box}>Your Mariox account isn’t a partner admin, so the partner portal can’t be opened here.</div>;
  } else if (host) {
    body = (
      <LocationContext.Provider value={null}>
        <RouteContext.Provider value={NO_PARENT_ROUTE}>
          <MemoryRouter initialEntries={[path]}>
            <ScrollToTopOnNavigate />
            <PathSync path={path} onPath={onPath} />
            <PortalHostContext.Provider value={host}>
              <UserProvider>
                <SettingsProvider>
                  <ToastProvider>
                    <section className="view">
                      <Suspense fallback={<div style={box} role="status">Loading…</div>}>
                        <Routes>
                          {ADMIN_PAGES.map(([pagePath, Page, mod]) => <Route key={pagePath} path={pagePath} element={<SectionGate mod={mod}><Page /></SectionGate>} />)}
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
