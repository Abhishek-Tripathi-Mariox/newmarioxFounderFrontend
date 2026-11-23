// What the signed-in partner admin's role may do, per admin console section. GET /me returns
// `perms: { pp_acq: { v, c, e, d }, … }` (Super Admin: everything). Partners have none. The API
// refuses the same things (403); this only hides pages and buttons the person can't use.
//   pp_overview · pp_acq (Acquisition) · pp_partners · pp_leads · pp_projects (& payouts)
//   pp_requests · pp_kit (Sales kit) · pp_settings

/** May this admin `act` ('v' | 'c' | 'e' | 'd') on section `mod`? */
export const ppCan = (user, mod, act = 'v') => user?.role === 'admin' && !!user.perms?.[mod]?.[act];

/** API paths the admin pages read → the section whose View they need (for prefetching). */
const PREFETCH_MOD = [['/admin/acquisition', 'pp_acq'], ['/leads', 'pp_leads'], ['/projects', 'pp_projects'], ['/requests', 'pp_requests'], ['/resources', 'pp_kit']];

/** Can this admin read the API path? (`/admin/users?role=partner` is the partner picker of Leads / Projects.) */
export function ppCanRead(user, path) {
  if (path.startsWith('/admin/users')) {
    return ppCan(user, 'pp_partners') || (path.includes('role=partner') && (ppCan(user, 'pp_leads') || ppCan(user, 'pp_projects')));
  }
  const hit = PREFETCH_MOD.find(([p]) => path.startsWith(p));
  return !hit || ppCan(user, hit[1]);
}

/** Admin page paths below /partners/admin → the section they belong to. */
export const ADMIN_PAGE_MOD = {
  '': 'pp_overview',
  '/acquisition': 'pp_acq',
  '/partners': 'pp_partners',
  '/partners/:id': 'pp_partners',
  '/leads': 'pp_leads',
  '/leads/:id': 'pp_leads',
  '/projects': 'pp_projects',
  '/requests': 'pp_requests',
  '/kit': 'pp_kit',
  '/settings': 'pp_settings',
};
