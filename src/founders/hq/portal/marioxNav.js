/**
 * Founders HQ sidebar → Companies → Mariox: the two portals and their pages, opened inside HQ
 * (portal/InternalPortalHost, partners/embed/PartnersAdminEmbed). Paths are the portals' own.
 */
import { ADMIN_NAV, isActive } from '@/partners/components/nav';
import { PARTNERS_ADMIN_HOME } from '@/lib/sso';

export const INTERNAL_HOME = '/live';
export const PARTNER_HOME = PARTNERS_ADMIN_HOME;

/** Projects tabs shown as "Team & hours" (components/layout/routes.js TEAM_TABS). */
const TEAM_TABS = ['team', 'cap', 'ts'];

/**
 * Internal portal pages, in the portal sidebar's order. `pj`: the Projects tab to open
 * ('first' = the first tab the viewer may see, like the portal sidebar's Projects link).
 */
export const INTERNAL_NAV = [
  { path: '/live', label: 'Live now' },
  { path: '/attendance', label: 'Attendance' },
  { path: '/reports', label: 'Reports' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/team-tasks', label: 'Team tasks' },
  { path: '/leads', label: 'Leads' },
  { path: '/follow-ups', label: 'Follow-ups' },
  { path: '/lead-setup', label: 'Lead setup' },
  { path: '/projects', label: 'Projects', pj: 'first' },
  { path: '/project-follow-ups', label: 'Project follow-ups' },
  { path: '/projects', label: 'Team & hours', pj: 'team' },
  { path: '/users', label: 'Users & roles' },
];

/** Partner admin console pages, as in its top dock. */
export const PARTNER_NAV = ADMIN_NAV.map((item) => ({ path: item.href, label: item.label }));

const under = (path, base) => path === base || path.startsWith(`${base}/`);

/** Is this internal portal item the open page? `pjTab`: the portal store's Projects tab. */
export function internalItemActive(item, path, pjTab) {
  const pathname = String(path || '').split(/[?#]/)[0];
  if (item.pj) return under(pathname, '/projects') && (item.pj === 'team') === TEAM_TABS.includes(pjTab);
  return under(pathname, item.path);
}

/** Is this partner admin item the open page? (Same rule as the partner app's dock.) */
export function partnerItemActive(item, path) {
  const pathname = String(path || '').split(/[?#]/)[0];
  const navItem = ADMIN_NAV.find((n) => n.href === item.path);
  return navItem ? isActive(navItem, pathname, ADMIN_NAV) : false;
}
