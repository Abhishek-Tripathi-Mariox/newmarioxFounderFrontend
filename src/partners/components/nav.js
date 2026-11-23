// match: extra paths that keep this item highlighted (e.g. the Toolkit sub-pages).
// prefetch: API URLs the page loads first; fetched on hover and when the app is idle so the page opens instantly.

export const PARTNER_NAV = [
  { href: '/partners/dashboard', label: 'Home', icon: 'home', prefetch: ['/leads', '/projects'] },
  { href: '/partners/leads', label: 'Pipeline', icon: 'pipe', prefetch: ['/leads'] },
  { href: '/partners/earnings', label: 'Earnings', icon: 'wallet', prefetch: ['/projects'] },
  { href: '/partners/projects', label: 'Projects', icon: 'layers', prefetch: ['/projects?page=1&limit=10&sort=-closedAt'] },
  { href: '/partners/scope', label: 'Toolkit', icon: 'tool', match: ['/partners/scope', '/partners/visits', '/partners/tech', '/partners/kit'], prefetch: ['/requests/scope?page=1&limit=10&sort=-createdAt'] },
  { href: '/partners/support', label: 'Support', icon: 'help', prefetch: ['/requests/ticket?page=1&limit=10&sort=-createdAt'] },
];

// Shown in the phone tab bar; the rest live in the account menu.
export const PARTNER_TABS = ['/partners/dashboard', '/partners/leads', '/partners/earnings', '/partners/scope', '/partners/support'];

export const TOOLKIT_TABS = [
  { value: '/partners/scope', label: 'Scope approvals' },
  { value: '/partners/visits', label: 'Office visits' },
  { value: '/partners/tech', label: 'Technical team' },
  { value: '/partners/kit', label: 'Sales kit' },
];

export const ADMIN_NAV = [
  { href: '/partners/admin', label: 'Overview', icon: 'grid', exact: true, prefetch: ['/admin/users', '/admin/acquisition', '/leads', '/projects', '/requests/scope', '/requests/booking', '/requests/tech', '/requests/ticket'] },
  { href: '/partners/admin/acquisition', label: 'Acquisition', icon: 'target', prefetch: ['/admin/acquisition'] },
  { href: '/partners/admin/partners', label: 'Partners', icon: 'users', prefetch: ['/admin/users?page=1&limit=25&sort=-createdAt'] },
  { href: '/partners/admin/leads', label: 'Leads', icon: 'pipe', prefetch: ['/leads', '/admin/users?role=partner'] },
  { href: '/partners/admin/projects', label: 'Projects', icon: 'layers', prefetch: ['/projects?page=1&limit=10&sort=-closedAt', '/admin/users?role=partner'] },
  { href: '/partners/admin/requests', label: 'Requests', icon: 'fileCheck', prefetch: ['/requests/scope?page=1&limit=25&sort=-createdAt'] },
  { href: '/partners/admin/kit', label: 'Sales kit', icon: 'file' },
  { href: '/partners/admin/settings', label: 'Settings', icon: 'tool' },
];

export const ADMIN_TABS = ['/partners/admin', '/partners/admin/partners', '/partners/admin/leads', '/partners/admin/projects', '/partners/admin/requests'];

export function isActive(item, path, all) {
  const hits = (p) => path === p || path.startsWith(p + '/');
  if (item.exact) return path === item.href;
  if (item.match?.some(hits)) return true;
  // Most specific item wins, so "/partners/admin" is not active on "/partners/admin/partners".
  const best = all.filter(n => !n.exact && hits(n.href)).sort((a, b) => b.href.length - a.href.length)[0];
  return best?.href === item.href;
}
