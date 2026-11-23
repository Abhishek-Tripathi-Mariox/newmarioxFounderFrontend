import { ppCan, ppCanRead } from '@/partners/lib/perms';

// match: extra paths that keep this item highlighted (e.g. the Toolkit sub-pages).
// sub: pages listed under the item in the sidebar while it is active (Toolkit).
// detail: the header title on a page below the item (e.g. one lead under Pipeline).
// prefetch: API URLs the page loads first; fetched on hover and when the app is idle so the page opens instantly.

export const TOOLKIT_TABS = [
  { value: '/partners/scope', label: 'Scope approvals' },
  { value: '/partners/visits', label: 'Office visits' },
  { value: '/partners/tech', label: 'Technical team' },
  { value: '/partners/kit', label: 'Sales kit' },
];

export const PARTNER_NAV = [
  { href: '/partners/dashboard', label: 'Home', icon: 'home', prefetch: ['/leads', '/projects'] },
  { href: '/partners/leads', label: 'Pipeline', icon: 'pipe', detail: 'Lead', prefetch: ['/leads'] },
  { href: '/partners/earnings', label: 'Earnings', icon: 'wallet', prefetch: ['/projects'] },
  { href: '/partners/projects', label: 'Projects', icon: 'layers', prefetch: ['/projects?page=1&limit=10&sort=-closedAt'] },
  { href: '/partners/scope', label: 'Toolkit', icon: 'tool', match: ['/partners/scope', '/partners/visits', '/partners/tech', '/partners/kit'], sub: TOOLKIT_TABS, prefetch: ['/requests/scope?page=1&limit=10&sort=-createdAt'] },
  { href: '/partners/support', label: 'Support', icon: 'help', prefetch: ['/requests/ticket?page=1&limit=10&sort=-createdAt'] },
];

// mod: the role permission (section) that shows the page; see lib/perms.js.
export const ADMIN_NAV = [
  { href: '/partners/admin', label: 'Overview', icon: 'grid', exact: true, mod: 'pp_overview', prefetch: ['/admin/users', '/admin/acquisition', '/leads', '/projects', '/requests/scope', '/requests/booking', '/requests/tech', '/requests/ticket'] },
  { href: '/partners/admin/acquisition', label: 'Acquisition', icon: 'target', mod: 'pp_acq', prefetch: ['/admin/acquisition'] },
  { href: '/partners/admin/partners', label: 'Partners', icon: 'users', detail: 'Partner', mod: 'pp_partners', prefetch: ['/admin/users?page=1&limit=25&sort=-createdAt'] },
  { href: '/partners/admin/leads', label: 'Leads', icon: 'pipe', detail: 'Lead', mod: 'pp_leads', prefetch: ['/leads', '/admin/users?role=partner'] },
  { href: '/partners/admin/projects', label: 'Projects', icon: 'layers', mod: 'pp_projects', prefetch: ['/projects?page=1&limit=10&sort=-closedAt', '/admin/users?role=partner'] },
  { href: '/partners/admin/requests', label: 'Requests', icon: 'fileCheck', mod: 'pp_requests', prefetch: ['/requests/scope?page=1&limit=25&sort=-createdAt'] },
  { href: '/partners/admin/kit', label: 'Sales kit', icon: 'file', mod: 'pp_kit' },
  { href: '/partners/admin/settings', label: 'Settings', icon: 'tool', mod: 'pp_settings' },
];

/**
 * The admin console pages this admin's role can view, with prefetches limited to what they may read.
 * Without a `user` (no /me yet) nothing is listed.
 */
export function adminNavFor(user) {
  return ADMIN_NAV.filter(n => ppCan(user, n.mod)).map(n => (n.prefetch ? { ...n, prefetch: n.prefetch.filter(p => ppCanRead(user, p)) } : n));
}

/** First admin page this admin can open ('/partners/admin/account' when none). */
export const firstAdminPage = (user) => adminNavFor(user)[0]?.href ?? '/partners/admin/account';

export function isActive(item, path, all) {
  const hits = (p) => path === p || path.startsWith(p + '/');
  if (item.exact) return path === item.href;
  if (item.match?.some(hits)) return true;
  // Most specific item wins, so "/partners/admin" is not active on "/partners/admin/partners".
  const best = all.filter(n => !n.exact && hits(n.href)).sort((a, b) => b.href.length - a.href.length)[0];
  return best?.href === item.href;
}
