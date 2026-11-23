import { Link, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FOUNDERS_HOME, signOut } from '@/lib/sso';
import { prefetchApi } from '@/partners/hooks/useApi';
import { Icon, ToastProvider, initials, useToast } from './ui';
import { UserProvider, useUser } from './UserProvider';
import { SettingsProvider } from './SettingsProvider';
import { isActive } from './nav';
import { ThemeSwitch } from './account/ThemeSwitch';

// Floating glass dock with a sliding indicator under the active item.
function Dock({ nav }) {
  const path = useLocation().pathname;
  const ref = useRef(null);
  const [ind, setInd] = useState({ width: 0, x: 0 });

  useLayoutEffect(() => {
    const on = ref.current?.querySelector('a.on');
    setInd(on ? { width: on.offsetWidth, x: on.offsetLeft } : { width: 0, x: 0 });
  }, [path]);

  // Once the current page has settled, quietly load every section's first data
  // so moving between sections shows content immediately.
  useEffect(() => {
    const t = setTimeout(() => nav.forEach(n => n.prefetch?.forEach(prefetchApi)), 1200);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <nav className="dock" ref={ref} aria-label="Sections">
      <span className="dock-ind" style={{ width: ind.width, transform: `translateX(${ind.x}px)` }} />
      {nav.map(n => {
        const on = isActive(n, path, nav);
        return (
          <Link key={n.href} to={n.href} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined} onMouseEnter={() => n.prefetch?.forEach(prefetchApi)} onFocus={() => n.prefetch?.forEach(prefetchApi)}>
            <Icon name={n.icon} />
            <span className="t">{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The other Mariox apps this person can open (docs/SSO.md app switcher). Partner admins are team
 * members, so the team portal is always one; Founders HQ when `/me` says they hold a seat.
 * Plain links: each app is its own page load with its own session check.
 */
function otherApps(user) {
  if (user?.role !== 'admin') return [];
  const apps = [{ href: '/', label: 'Team portal', icon: 'users' }];
  if (user.apps?.founders) apps.push({ href: FOUNDERS_HOME, label: 'Founders HQ', icon: 'building' });
  return apps;
}

/** Header links to the other apps (desktop; on phones they sit in the account menu). */
function AppLinks() {
  const { user } = useUser();
  return otherApps(user).map(a => (
    <a key={a.href} href={a.href} className="btn ghost sm hide-m app-link" title={`Open ${a.label}`} aria-label={`Open ${a.label}`}>
      <Icon name={a.icon} size="s" />
      <span className="t">{a.label}</span>
    </a>
  ));
}

function AccountMenu({ items }) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const path = useLocation().pathname;
  useEffect(() => setOpen(false), [path]);
  const apps = otherApps(user);

  return (
    <div className="acct">
      <button className="ava" onClick={() => setOpen(o => !o)} aria-label="Account menu" aria-expanded={open}>
        {user ? initials(user.name) : ''}
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 84 }} onClick={() => setOpen(false)} />
          <div className="menu" role="menu">
            <div className="who">
              <b>{user?.name}</b>
              <span className="sub">{user?.role === 'admin' ? 'Mariox admin' : `${user?.partnerCode ?? ''} · ${user?.company ?? ''}`}</span>
            </div>
            <hr />
            {items.map(i => (
              <Link key={i.href} to={i.href} role="menuitem">
                <Icon name={i.icon} size="s" />
                {i.label}
              </Link>
            ))}
            {apps.length > 0 && (
              <>
                <hr />
                <div className="mh">Switch to</div>
                {apps.map(a => (
                  <a key={a.href} href={a.href} role="menuitem">
                    <Icon name={a.icon} size="s" />
                    {a.label}
                  </a>
                ))}
              </>
            )}
            <hr />
            <div className="mh">Theme</div>
            <ThemeSwitch />
            <hr />
            <button onClick={signOut} role="menuitem">
              <Icon name="x" size="s" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function TabBar({ nav, tabs }) {
  const path = useLocation().pathname;
  return (
    <nav className="tabbar" aria-label="Primary">
      {nav
        .filter(n => tabs.includes(n.href))
        .map(n => (
          <Link key={n.href} to={n.href} className={`tab ${isActive(n, path, nav) ? 'on' : ''}`}>
            <Icon name={n.icon} />
            {n.label}
          </Link>
        ))}
    </nav>
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

function Shell({ nav, tabs, home, subtitle, menu, children }) {
  return (
    <>
      <header className="top">
        <div className="top-in">
          <Link className="brand" to={home} aria-label="Mariox Partners home">
            <span className="mark"><b>M</b></span>
            <span className="brand-t">
              <b>Mariox</b>
              <span>{subtitle}</span>
            </span>
          </Link>
          <Dock nav={nav} />
          <div className="top-r">
            <AppLinks />
            <AccountMenu items={menu} />
          </div>
        </div>
      </header>
      <main className="main">
        <section className="view">{children}</section>
      </main>
      <TabBar nav={nav} tabs={tabs} />
      <ApiErrors />
    </>
  );
}

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
