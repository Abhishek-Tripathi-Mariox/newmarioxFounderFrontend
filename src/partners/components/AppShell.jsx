import { Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { FOUNDERS_HOME, signOut } from '@/lib/sso';
import { prefetchApi } from '@/partners/hooks/useApi';
import { Icon, ToastProvider, initials, useToast } from './ui';
import { UserProvider, useUser } from './UserProvider';
import { SettingsProvider } from './SettingsProvider';
import { isActive } from './nav';

// The partner app's frame, laid out like the internal portal (components/layout/AppShell):
// a dark left sidebar (brand, sections, account, other apps, who's signed in, log out) and a
// sticky white header with "Section / Page" on the left and today's date on the right.
// Below 760px the sidebar becomes a drawer opened from the header's menu button.
// Styles: styles/shell.css.

const prefetch = (n) => n.prefetch?.forEach(prefetchApi);

/**
 * The other Mariox apps this person can open (docs/SSO.md app switcher). Partner admins are team
 * members, so the team portal is always one; Founders HQ when `/me` says they hold a seat.
 * Plain links: each app is its own page load with its own session check.
 */
function otherApps(user) {
  if (user?.role !== 'admin') return [];
  const apps = [{ href: '/', label: 'Team portal' }];
  if (user.apps?.founders) apps.push({ href: FOUNDERS_HOME, label: 'Founders HQ' });
  return apps;
}

/** Account links carry an optional `?tab=`; one is current when both the path and the tab match. */
function accountActive(item, path, search) {
  const [base, query = ''] = item.href.split('?');
  if (path !== base) return false;
  return (new URLSearchParams(query).get('tab') ?? '') === (new URLSearchParams(search).get('tab') ?? '');
}

/** Header crumb and title for the current page: "Partner portal / Pipeline", "Toolkit / Office visits"… */
function pageOf({ nav, account, subtitle }, path, search) {
  const acct = account.find(a => accountActive(a, path, search)) ?? account.find(a => a.href.split('?')[0] === path);
  if (acct) return { crumb: subtitle, title: acct.label };
  const item = nav.find(n => isActive(n, path, nav));
  if (!item) return { crumb: subtitle, title: '' };
  const sub = item.sub?.find(s => path === s.value || path.startsWith(`${s.value}/`));
  if (sub) return { crumb: item.label, title: sub.label };
  if (path !== item.href && item.detail) return { crumb: item.label, title: item.detail };
  return { crumb: subtitle, title: item.label };
}

function NavLink({ item, on, onPick }) {
  return (
    <Link
      to={item.href}
      className={`sx-item${on ? ' on' : ''}`}
      aria-current={on ? 'page' : undefined}
      onClick={onPick}
      onMouseEnter={() => prefetch(item)}
      onFocus={() => prefetch(item)}
    >
      {item.icon && <Icon name={item.icon} size="s" />}
      <span className="sx-t">{item.label}</span>
    </Link>
  );
}

function Sidebar({ nav, account, home, subtitle, open, onPick }) {
  const { pathname: path, search } = useLocation();
  const { user } = useUser();
  const apps = otherApps(user);
  const role = user?.role === 'admin' ? 'Mariox admin' : [user?.partnerCode, user?.company].filter(Boolean).join(' · ');

  return (
    <aside id="pp-sidebar" className={`sx-side${open ? ' open' : ''}`} aria-label="Main navigation">
      <Link className="sx-brand" to={home} onClick={onPick} aria-label="Mariox Partners home">
        <span className="sx-mark" aria-hidden="true">M</span>
        <span>
          <span className="sx-name">Mariox</span>
          <span className="sx-subt">{subtitle}</span>
        </span>
      </Link>

      <nav className="sx-nav" aria-label="Sections">
        {nav.map(n => {
          const on = isActive(n, path, nav);
          return (
            <div key={n.href} className="sx-grp">
              <NavLink item={n} on={on} onPick={onPick} />
              {on && n.sub && (
                <div className="sx-subs">
                  {n.sub.map(s => {
                    const here = path === s.value || path.startsWith(`${s.value}/`);
                    return (
                      <Link key={s.value} to={s.value} className={`sx-sub${here ? ' on' : ''}`} aria-current={here ? 'page' : undefined} onClick={onPick}>
                        {s.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="sx-sec">Account</div>
        {account.map(a => <NavLink key={a.href} item={a} on={accountActive(a, path, search)} onPick={onPick} />)}

        {apps.length > 0 && (
          <>
            <div className="sx-sec">Apps</div>
            {apps.map(a => (
              <a key={a.href} href={a.href} className="sx-item" title={`Open ${a.label}`}>
                <span className="sx-t">{a.label}</span>
                <span className="sx-meta" aria-hidden="true">↗</span>
              </a>
            ))}
          </>
        )}
      </nav>

      <div className="sx-foot">
        <div className="sx-who">
          <span className="sx-ava" aria-hidden="true">{user ? initials(user.name) : ''}</span>
          <span style={{ minWidth: 0 }}>
            <span className="sx-whoname">{user?.name ?? ''}</span>
            <span className="sx-role">{role}</span>
          </span>
        </div>
        <button type="button" className="sx-out" onClick={signOut}>Log out</button>
      </div>
    </aside>
  );
}

function Header({ page, open, onMenu }) {
  const [today] = useState(() => new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
  return (
    <header className="sx-hdr">
      <button type="button" className="sx-menu" onClick={onMenu} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="pp-sidebar">
        <Icon name="menu" />
      </button>
      <div className="sx-crumbs">
        <span className="sx-crumb">{page.crumb}</span>
        {page.title && <span className="sx-sep" aria-hidden="true">/</span>}
        <span className="sx-title" aria-current="page">{page.title}</span>
      </div>
      <span className="sx-today">{today}</span>
    </header>
  );
}

// Shows API failures (server down, DB unreachable…) as a toast, at most once every few seconds.
function ApiErrors() {
  const toast = useToast();
  useEffect(() => {
    let last = '', at = 0;
    const on = (e) => {
      const msg = e.detail || 'Request failed';
      if (msg === last && Date.now() - at < 8000) return;
      last = msg;
      at = Date.now();
      toast(`Could not load data: ${msg}`, true);
    };
    window.addEventListener('mariox-api-error', on);
    return () => window.removeEventListener('mariox-api-error', on);
  }, [toast]);
  return null;
}

function Shell({ nav: navProp, account, home, subtitle, children }) {
  const { pathname, search } = useLocation();
  // `nav` may be a function of the signed-in user (the admin console lists the sections their role can view).
  const { user } = useUser();
  const nav = useMemo(() => (typeof navProp === 'function' ? navProp(user) : navProp), [navProp, user]);
  const page = pageOf({ nav, account, subtitle }, pathname, search);

  // Phone drawer. It remembers the page it was opened on, so moving to another page closes it
  // (picking a link closes it too); so do Escape and the scrim. The page behind does not scroll meanwhile.
  const where = pathname;
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === where;
  const setOpen = (v) => setOpenAt(v ? where : null);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpenAt(null); };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('pp-lock');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('pp-lock');
    };
  }, [open]);

  // Once the current page has settled, quietly load every section's first data
  // so moving between sections shows content immediately.
  useEffect(() => {
    const t = setTimeout(() => nav.forEach(prefetch), 1200);
    return () => clearTimeout(t);
  }, [nav]);

  useEffect(() => {
    document.title = page.title ? `${page.title} · Mariox Partners` : 'Mariox Partners';
  }, [page.title]);

  return (
    <div className="sx">
      <a href="#pp-main" className="sx-skip">Skip to content</a>
      <Sidebar nav={nav} account={account} home={home} subtitle={subtitle} open={open} onPick={() => setOpen(false)} />
      {open && <div className="sx-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div className="sx-main">
        <Header page={page} open={open} onMenu={() => setOpen(!open)} />
        <main id="pp-main" className="main" tabIndex={-1}>
          <section className="view">{children}</section>
        </main>
      </div>
      <ApiErrors />
    </div>
  );
}

/**
 * The signed-in frame of the partner side and the admin console.
 * nav: sections (components/nav.js), or a function user → sections; account: account links shown under "Account";
 * home: where the brand links; subtitle: "Partner portal" / "Admin console".
 */
export function AppShell(props) {
  return (
    <UserProvider>
      <SettingsProvider>
        <ToastProvider>
          <Shell {...props} />
        </ToastProvider>
      </SettingsProvider>
    </UserProvider>
  );
}
