/**
 * Founders HQ → internal portal bridge for Team tasks, Leads and Attendance.
 *
 * HQ → Tasks shows the internal portal's Team tasks page and HQ → Sales → Pipeline its Leads page (same
 * records, same pages as /team-tasks and /leads), with HQ's company tabs above them; team tasks are HQ's
 * only tasks and portal leads its only sales pipeline. The portal normally restores its session only on
 * portal paths (App.jsx PortalSession, which also routes to a landing page). Here we do just the parts
 * the pages need, without navigating:
 *  1. `connect()`  — refresh cookie → portal access token (in memory) + the signed-in principal, then
 *                    people (users / roles) and team tasks. Also feeds the sidebar "Tasks" count.
 *  2. `loadRest()` — the rest of the portal data (sales owners, leads, follow-ups, masters, projects …):
 *                    the Leads page and HQ's lead tiles (`loadSalesData()`, which re-reads the sales part
 *                    on later calls), and the task form's project / lead pickers and drawers.
 *  3. `loadAttendanceData()` — for HQ → Attendance (the portal's /attendance page): everything from
 *                    `loadRest()` (members, sales owners, projects for report lines) plus a fresh copy
 *                    of the workday data (live board, ~45 days of attendance events, shift reports).
 *                    While that page is open, `pollAttendance()` refreshes today's part (portal pollLive).
 *  4. `loadUsersData()` — for HQ → Companies → Mariox → Users & roles (the portal's /users page): people
 *                    (users, roles, audit log; re-read on later visits) plus `loadRest()` for the
 *                    table's projects column (leads / projects) and the people pickers.
 * `boot` is left alone (it stays 'pending' under /founders), so the portal's reminder / live polling
 * in App.jsx never starts inside HQ.
 */
import { useEffect } from 'react';
import { create } from 'zustand';
import { useStore } from '@/store';
import { getAll, onExpired, refreshSession } from '@/api/client';
import { loadAll } from '@/api/loaders';
import { loadSales } from '@/api/sales';
import { loadPeople } from '@/api/people';
import { loadWorkday } from '@/api/workday';
import { workdayPeople } from '@/domain/attendance';
import { fromApiTeamTask, loadTeamTasks } from '@/api/teamTasks';
import { serverNow } from '@/lib/clock';
import { sod } from '@/lib/date';
import { redirectToLogin } from '@/lib/sso';

/**
 * Bridge status: 'idle' | 'connecting' | 'ready' | 'denied' (no portal access) | 'error'.
 * Attendance: `att` 'idle' | 'loading' | 'ready' | 'error' (+ `attError`), `attAt` = when the portal
 * store's workday data was last refreshed (0 = never; the sidebar badge only trusts it while recent).
 */
export const usePortalBridge = create(() => ({ status: 'idle', error: '', att: 'idle', attError: '', attAt: 0, rest: 'idle', restError: '' }));

/** HQ → Tasks company tab: 'all' or an HQ company id (team tasks are filtered by their company). */
export const useTasksCompany = create(() => ({ co: 'all' }));
export const setTasksCompany = (co) => useTasksCompany.setState({ co: co || 'all' });

/**
 * HQ → Sales → Pipeline: the company tab ('all' or an HQ company id) and what to show once the hosted
 * Leads page is up (`open`: a lead id whose drawer opens; `modal`: [kind, props] of a portal modal to open).
 */
export const useLeadsCompany = create(() => ({ co: 'all', open: null, modal: null }));
export const setLeadsCompany = (co) => useLeadsCompany.setState({ co: co || 'all' });

/**
 * HQ's active companies for the team task forms, chips and filters ([{ id, name, hue }]), so tasks can
 * belong to companies the founders added. Only updates the portal store when the list changed.
 */
export function setTeamTaskCompanies(companies) {
  const list = (companies || []).map((c) => ({ id: c.id, name: c.name || c.id, hue: c.hue ?? 265 }));
  const cur = useStore.getState().ttCompanies;
  if (cur && JSON.stringify(cur) === JSON.stringify(list)) return;
  useStore.setState({ ttCompanies: list });
}

let connecting = null;
let peopleAt = 0; // when users / roles / audit were last loaded into the portal store
let restLoading = null;
let restOk = false;
let restError = '';
let attLoading = null;

const setBridge = (patch) => usePortalBridge.setState(patch);

/** Restore the portal session and load people + team tasks. Safe to call repeatedly. */
export function connect() {
  if (connecting) return connecting;
  setBridge({ status: 'connecting', error: '' });
  connecting = (async () => {
    // A failed silent refresh (session ended) behaves like the rest of HQ: sign in again, come back.
    onExpired(() => redirectToLogin());
    const s = await refreshSession();
    if (!s) {
      redirectToLogin();
      throw new Error('Your session has ended. Please sign in again.');
    }
    const me = s.user;
    if (me.apps && me.apps.portal === false) {
      setBridge({ status: 'denied' });
      return false;
    }
    const sup = me.role && me.role.id === 'r-super';
    useStore.setState({ me, auth: { uid: me.id, at: serverNow() }, viewAs: sup ? null : me.id });
    const [people, tasks] = await Promise.all([loadPeople(me), loadTeamTasks(me)]);
    useStore.setState({ ...people, ...tasks });
    peopleAt = Date.now();
    setBridge({ status: 'ready', error: '' });
    return true;
  })().catch((e) => {
    connecting = null; // allow "Try again"
    setBridge({ status: 'error', error: (e && e.message) || 'Couldn’t load team tasks' });
    return false;
  });
  return connecting;
}

/** Everything else the portal loads at sign-in (once). Failures only cost the project / lead pickers. */
export function loadRest() {
  if (restLoading) return restLoading;
  if (!restOk) setBridge({ rest: 'loading', restError: '' });
  restLoading = connect().then(async (ok) => {
    if (!ok) { restLoading = null; setBridge({ rest: 'idle' }); return; }
    try {
      const data = await loadAll(useStore.getState().me);
      useStore.setState(data);
      restOk = true;
      setBridge({ rest: 'ready', restError: '' });
    } catch (e) {
      restLoading = null;
      restError = (e && e.message) || '';
      setBridge({ rest: 'error', restError: restError || 'The internal portal didn’t respond.' });
    }
  });
  return restLoading;
}

let peopleRefreshing = null;

/**
 * HQ → Mariox → Users & roles: the portal session and people, then the rest of the portal data in the
 * background (projects column, report lines). People are re-read when they weren't loaded just now, so
 * changes made in the portal meanwhile appear (a failed refresh keeps what is shown). Resolves true
 * when the page can show; the host shows the bridge status otherwise.
 */
export function loadUsersData() {
  return connect().then(async (ok) => {
    if (!ok) return false;
    loadRest();
    if (Date.now() - peopleAt < 5000) return true;
    if (!peopleRefreshing) {
      peopleRefreshing = loadPeople(useStore.getState().me)
        .then((people) => { useStore.setState(people); peopleAt = Date.now(); })
        .catch(() => {})
        .finally(() => { peopleRefreshing = null; });
    }
    await peopleRefreshing;
    return true;
  });
}

/**
 * HQ → Attendance: people (members + sales owners), projects and fresh workday data (live board,
 * attendance events and shift reports for the portal's ranges). Resolves true when the page can show.
 */
export function loadAttendanceData() {
  if (attLoading) return attLoading;
  if (usePortalBridge.getState().att !== 'ready') setBridge({ att: 'loading', attError: '' });
  attLoading = (async () => {
    if (!(await connect())) {
      setBridge({ att: 'idle' }); // denied / error: the host shows the bridge status
      return false;
    }
    const hadRest = restOk;
    await loadRest();
    if (!restOk) throw new Error(restError || 'The internal portal didn’t respond.');
    // loadRest() just loaded the workday data, unless it had done so on an earlier visit.
    if (hadRest) useStore.setState(await loadWorkday(useStore.getState().me));
    setBridge({ att: 'ready', attError: '', attAt: Date.now() });
    return true;
  })().catch((e) => {
    // Data already shown stays; only a first load turns into an error.
    if (usePortalBridge.getState().att !== 'ready') setBridge({ att: 'error', attError: (e && e.message) || 'Couldn’t load attendance' });
    return false;
  }).finally(() => { attLoading = null; });
  return attLoading;
}

/** Live refresh while HQ → Attendance is open: today's live board, events and reports (portal pollLive). */
export async function pollAttendance() {
  if (usePortalBridge.getState().att !== 'ready') return;
  const { pollLive } = useStore.getState();
  if (pollLive) await pollLive();
  setBridge({ attAt: Date.now() });
}

/** How long the portal store's attendance counts as current for the sidebar badge. */
const ATT_FRESH_MS = 3 * 60 * 1000;

/**
 * People in today (any attendance event today) from the portal store, or null when its workday data
 * isn't loaded or hasn't been refreshed lately (HQ then shows the founder summary's count).
 */
export function useAttendanceInCount() {
  const attAt = usePortalBridge((x) => (x.att === 'ready' ? x.attAt : 0));
  const n = useStore((st) => {
    if (!st.me) return 0;
    const T = sod(serverNow());
    const ids = new Set(workdayPeople(st).map((p) => p.id));
    const inToday = new Set();
    (st.attLog || []).forEach((e) => { if (e.t >= T && ids.has(e.who)) inToday.add(e.who); });
    return inToday.size;
  });
  return attAt && Date.now() - attAt < ATT_FRESH_MS ? n : null;
}

let refreshing = null;

/**
 * Re-fetch team tasks (each time HQ → Tasks or a page that counts team tasks is shown, and every few minutes
 * while such a page is open), so changes made elsewhere appear. A failed fetch keeps the list already shown.
 */
export function refreshTeamTasks() {
  const me = useStore.getState().me;
  if (!me || usePortalBridge.getState().status !== 'ready' || (me.role && me.role.id === 'r-client')) return Promise.resolve();
  if (refreshing) return refreshing;
  refreshing = getAll('/team-tasks')
    .then((rows) => { useStore.setState({ teamTasks: rows.map(fromApiTeamTask) }); })
    .catch(() => {})
    .finally(() => { refreshing = null; });
  return refreshing;
}

let leadsRefreshing = null;

/**
 * Leads for HQ (Sales, Today, Customers, Contracts): the first call loads the portal data the Leads page
 * needs (owners, leads, follow-ups, masters — loadRest); later calls re-read the sales data so changes
 * made elsewhere appear. A failed refresh keeps what is shown. Never throws.
 */
export function loadSalesData() {
  if (!restOk) return loadRest().catch(() => {});
  const me = useStore.getState().me;
  if (!me || usePortalBridge.getState().status !== 'ready') return Promise.resolve();
  if (leadsRefreshing) return leadsRefreshing;
  leadsRefreshing = loadSales(me)
    .then((data) => { useStore.setState(data); })
    .catch(() => {})
    .finally(() => { leadsRefreshing = null; });
  return leadsRefreshing;
}

/** Close the lead drawer and lead modals (when HQ leaves Sales → Pipeline); other portal modals stay. */
export function closeLeadOverlays() {
  useStore.setState((x) => ({
    selLead: null,
    modal: x.modal && ['lead', 'leadImport', 'quote', 'fu'].includes(x.modal.kind) ? null : x.modal,
  }));
}

/** Close any portal modal / drawer left open (when HQ leaves Tasks). */
export function closePortalOverlays() {
  useStore.setState((x) => ({ modal: null, selLead: null, pj: { ...x.pj, selP: null, selM: null, portal: null } }));
}

/**
 * Sidebar "Tasks" badge: open team tasks assigned to or given by the signed-in founder, or null
 * while the portal session isn't there (no badge then). Connects on first use.
 */
export function useOpenTeamTaskCount() {
  useEffect(() => { connect(); }, []);
  const ready = usePortalBridge((x) => x.status === 'ready');
  const n = useStore((x) => {
    const me = x.me && x.me.id;
    return me ? (x.teamTasks || []).filter((t) => t.status !== 'Done' && (t.a === me || t.by === me)).length : 0;
  });
  return ready ? n : null;
}
