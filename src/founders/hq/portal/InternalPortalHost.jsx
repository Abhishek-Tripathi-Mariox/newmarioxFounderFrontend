import { Suspense, lazy, useEffect, useRef } from 'react';
import {
  MemoryRouter,
  Navigate,
  Route,
  Routes,
  UNSAFE_LocationContext as LocationContext,
  UNSAFE_RouteContext as RouteContext,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/store';
import { can } from '@/domain/permissions';
import { Button } from '@/components/ui';
import { pageOf } from '@/components/layout/routes';
import ModalHost from '@/components/layout/ModalHost';
import DrawerHost from '@/components/layout/DrawerHost';
import NotificationStack from '@/components/layout/NotificationStack';
import { isPortalPath, leaveTo } from '@/lib/sso';
import { closePortalOverlays, loadAttendanceData, loadUsersData, pollAttendance, usePortalBridge } from '../teamTasks/portalBridge';
import { INTERNAL_HOME } from './marioxNav';

/** The internal portal's pages (App.jsx routes, same paths), loaded on first use. */
const PAGES = [
  ['/live', () => import('@/features/live/LivePage')],
  ['/attendance', () => import('@/features/attendance/AttendancePage')],
  ['/reports', () => import('@/features/reports/ReportsPage')],
  ['/dashboard', () => import('@/features/dashboard/DashboardPage')],
  ['/team-tasks', () => import('@/features/team-tasks/TeamTasksPage')],
  ['/leads', () => import('@/features/leads/LeadsPage')],
  ['/follow-ups', () => import('@/features/followups/FollowUpsPage')],
  ['/lead-setup', () => import('@/features/setup/LeadSetupPage')],
  ['/projects', () => import('@/features/projects/ProjectsPage')],
  ['/project-follow-ups', () => import('@/features/project-followups/ProjectFollowUpsPage')],
  ['/users', () => import('@/features/users/UsersPage')],
].map(([path, load]) => [path, lazy(load)]);

/** Same cadence as the portal's live refresh (App.jsx useReminderPolling). */
const POLL_MS = 20000;

/** What the app's BrowserRouter puts in context, reset so the subtree below starts a router of its own. */
const NO_PARENT_ROUTE = { outlet: null, matches: [], isDataRoute: false };

const box = { background: '#fff', border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px', padding: '36px 16px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' };
const btn = { marginTop: '12px', height: '34px', border: '0', background: 'var(--acc, oklch(0.5 0.17 265))', color: '#fff', borderRadius: '9px', padding: '0 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };

/** Everything the pages read: people (fresh), the rest of the portal data and the workday data. */
const loadAll = () => loadUsersData().then((ok) => ok && loadAttendanceData());

/**
 * Keeps the in-memory location and HQ in step: a new `path` from HQ's sidebar moves there; moving
 * inside the pages (links, "view all" buttons) is reported through `onPath`.
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

/**
 * The portal header's page actions (components/layout/Header.jsx), which the hosted pages don't have
 * without the portal shell: + New lead, + New project / + Report bug / + Log hours, + Invite user,
 * + New follow-up — same permissions and modals.
 */
function PortalActions() {
  const { pathname } = useLocation();
  const page = pageOf(pathname);
  const perm = useStore(useShallow((x) => ({ viewAs: x.viewAs, users: x.users, roles: x.roles })));
  const f = useStore((x) => x.pj?.f) || {};
  const openModal = useStore((x) => x.openModal);
  const c = (m, a) => can(perm, m, a);
  const isProj = page.path === '/projects';
  const isUsers = page.path === '/users';
  const buttons = [
    page.path === '/leads' && c('leads', 'c') && <Button key="lead" onClick={() => openModal('lead', {})}>+ New lead</Button>,
    isProj && c('projects', 'c') && <Button key="proj" onClick={() => openModal('proj', {})}>+ New project</Button>,
    isProj && c('bugs', 'c') && <Button key="bug" variant="dangerOutline" onClick={() => openModal('bug', { p: f.project || undefined })}>+ Report bug</Button>,
    isProj && c('ts', 'c') && <Button key="log" variant="primary" onClick={() => openModal('log', { member: f.member || undefined, project: f.project || undefined })}>+ Log hours</Button>,
    isUsers && <Button key="user" variant="primary" onClick={() => openModal('user', {})}>+ Invite user</Button>,
    !isProj && !isUsers && c('fu', 'c') && <Button key="fu" variant="primary" onClick={() => openModal('fu', {})}>+ New follow-up</Button>,
  ].filter(Boolean);
  if (!buttons.length) return null;
  return <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>{buttons}</div>;
}

/** A link out of the portal (Partners, Founders HQ): a full page load there; unknown portal paths: home. */
function Elsewhere() {
  const { pathname, search, hash } = useLocation();
  const outside = !isPortalPath(pathname);
  useEffect(() => { if (outside) leaveTo(`${pathname}${search}${hash}`); }, [outside, pathname, search, hash]);
  return outside ? <div style={box} role="status">Opening…</div> : <Navigate to={INTERNAL_HOME} replace />;
}

/**
 * Founders HQ → Companies → Mariox → Internal portal: the internal portal's pages (Live now,
 * Attendance, Reports, Dashboard, Team tasks, Leads, Follow-ups, Lead setup, Projects, Project
 * follow-ups, Team & hours) with the same components, store and API, without the portal's own shell:
 * HQ's sidebar lists the pages. `path` picks the page; `onPath` hears about moves made inside it.
 *
 * Data comes through the HQ portal bridge (session, people, all portal data, workday data), and the
 * live board / attendance refresh runs while this is open, like the portal does. The pages use React
 * Router, so they get a MemoryRouter of their own (the host's router context is cleared for this
 * subtree first, as in PartnersAdminEmbed); the browser URL stays on /founders. Drawers, modals and
 * toasts render through the portal hosts mounted here and close when HQ moves elsewhere.
 */
export default function InternalPortalHost({ path = INTERNAL_HOME, onPath }) {
  const status = usePortalBridge((x) => x.status);
  const error = usePortalBridge((x) => x.error);
  const att = usePortalBridge((x) => x.att);
  const attError = usePortalBridge((x) => x.attError);

  useEffect(() => {
    loadAll();
    const iv = setInterval(() => { if (!document.hidden) pollAttendance(); }, POLL_MS);
    return () => {
      clearInterval(iv);
      closePortalOverlays();
    };
  }, []);

  if (status === 'denied') return <div style={box}>Your Mariox account can’t open the internal portal.</div>;
  if (status === 'error' || att === 'error') {
    return (
      <div style={box} role="alert">
        <div style={{ fontWeight: 600, color: 'oklch(0.3 0.015 265)' }}>Couldn’t load the internal portal</div>
        <div style={{ marginTop: '4px' }}>{status === 'error' ? error : attError}</div>
        <button type="button" style={btn} onClick={() => loadAll()}>Try again</button>
      </div>
    );
  }
  if (status !== 'ready' || att !== 'ready') return <div style={box} role="status">Loading the internal portal…</div>;

  return (
    <div className="hq-portal">
      <LocationContext.Provider value={null}>
        <RouteContext.Provider value={NO_PARENT_ROUTE}>
          <MemoryRouter initialEntries={[path]}>
            <PathSync path={path} onPath={onPath} />
            <PortalActions />
            <Suspense fallback={<div style={box} role="status">Loading…</div>}>
              <Routes>
                {PAGES.map(([pagePath, Page]) => <Route key={pagePath} path={pagePath} element={<Page />} />)}
                <Route path="*" element={<Elsewhere />} />
              </Routes>
            </Suspense>
            <DrawerHost />
            <ModalHost />
            <NotificationStack />
          </MemoryRouter>
        </RouteContext.Provider>
      </LocationContext.Provider>
    </div>
  );
}
