import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import SummaryProvider from './state/SummaryProvider';
import { useSummaries } from './state/summaryContext';
import OverviewPage from './features/overview/OverviewPage';
import MarioxPage from './features/mariox/MarioxPage';
import PartnersPage from './features/partners/PartnersPage';
import { minutesAgo } from './lib/format';
import { DEFAULT_PORTAL_LINKS, PortalLinks } from './lib/portals';
import { ViewerName } from './lib/viewer';
import { HOSTED_TABS, SummaryNav, toTab, useSummaryNav } from './lib/tabNav';
import './styles/summary.css';
import s from './SummaryPage.module.css';

// The management pages load on first use (they bring the portal's / partner app's own screens).
const UsersHost = lazy(() => import('../hq/users/UsersHost'));
const PartnersAdminEmbed = lazy(() => import('@/partners/embed/PartnersAdminEmbed'));

const hostBox = { background: '#fff', border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px', padding: '36px 16px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' };

/**
 * Founders HQ → Companies → Mariox. Mariox runs two portals, both shown here (tabs are in-page
 * state, not URLs, because the HQ runs inside the combined app's router):
 *   /          Overview: both portals together
 *   /mariox    Internal portal (internal-portal: sales, projects, team)
 *   /partners  Partner portal (mariox-saas: partners, commission, requests)
 *   /users          Users & roles: the internal portal's /users page itself (hq/users/UsersHost)
 *   /partner-admin  Partners: the partner admin's Partners list + partner detail (partners/embed)
 * The two management tabs render outside `.mx-summary`, so the summary's scoped styles and tokens
 * don't reach the hosted pages (each brings its own).
 * `tab` comes from the sidebar; `onTab` tells HQ when the tab changes inside the page;
 * `links` are the portal addresses saved on Companies → Mariox; `viewerName` is the signed-in founder's first name.
 */
export default function SummaryPage({ tab = '/', onTab, links, viewerName = '' }) {
  const [current, setCurrent] = useState(() => toTab(tab));

  // The sidebar can switch the tab from outside.
  useEffect(() => setCurrent(toTab(tab)), [tab]);

  const go = useCallback(
    (to) => {
      const next = toTab(to);
      setCurrent(next);
      if (onTab) onTab(next);
    },
    [onTab],
  );
  const nav = useMemo(() => ({ tab: current, go }), [current, go]);
  const hosted = HOSTED_TABS.includes(current);
  const Page = current === '/mariox' ? MarioxPage : current === '/partners' ? PartnersPage : OverviewPage;

  return (
    <div>
      <div className="mx-summary">
        <ViewerName.Provider value={viewerName}>
        <PortalLinks.Provider value={{ ...DEFAULT_PORTAL_LINKS, ...(links || {}) }}>
          <SummaryProvider>
            <SummaryNav.Provider value={nav}>
              <Tabs />
              {hosted ? null : <Page />}
            </SummaryNav.Provider>
          </SummaryProvider>
        </PortalLinks.Provider>
        </ViewerName.Provider>
      </div>
      {hosted ? (
        <Suspense fallback={<div style={hostBox} role="status">Loading…</div>}>
          {current === '/users' ? <UsersHost /> : <PartnersAdminEmbed />}
        </Suspense>
      ) : null}
    </div>
  );
}

const TABS = [
  ['/', 'Overview'],
  ['/mariox', 'Internal portal'],
  ['/partners', 'Partner portal'],
  ['/users', 'Users & roles'],
  ['/partner-admin', 'Partners'],
];

function Tabs() {
  const ctx = useSummaries();
  const { tab, go } = useSummaryNav();
  const loaded = [ctx.mariox, ctx.partners].filter(Boolean);
  const stillLoading = Object.values(ctx.sources).some((source) => source.status === 'loading');
  const synced = ctx.sample
    ? 'Sample data'
    : loaded.length
      ? `Synced ${minutesAgo(Math.min(...loaded.map((summary) => new Date(summary.syncedAt))))}`
      : stillLoading
        ? 'Loading…'
        : 'Not synced';
  return (
    <div className={s.bar}>
      <nav aria-label="Mariox portals" className={s.tabs}>
        {TABS.map(([to, label]) => (
          <a
            key={to}
            href={`#summary${to}`}
            aria-current={tab === to ? 'page' : undefined}
            className={`${s.tab} ${tab === to ? s.active : ''}`}
            onClick={(event) => {
              event.preventDefault();
              go(to);
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      {/* Sync status is about the summaries; the hosted management pages show live data. */}
      {HOSTED_TABS.includes(tab) ? null : (
        <div className={s.status}>
          {ctx.sources.partners.error && <span className={s.err}>Partner portal not responding</span>}
          {ctx.sources.mariox.error && <span className={s.err}>Internal portal not responding</span>}
          <span>{synced}</span>
          <button type="button" className={s.refresh} onClick={ctx.reload}>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
