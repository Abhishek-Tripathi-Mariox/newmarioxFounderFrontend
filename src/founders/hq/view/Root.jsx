/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment, Suspense, lazy, useEffect, useState } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from './rt';
import AssistantPanel from './sections/AssistantPanel';
import Attendance from './sections/Attendance';
import Calendar from './sections/Calendar';
import Companies from './sections/Companies';
import Constitution from './sections/Constitution';
import Contracts from './sections/Contracts';
import Decisions from './sections/Decisions';
import Docs from './sections/Docs';
import Finance from './sections/Finance';
import Goals from './sections/Goals';
import GoalPanel from './sections/GoalPanel';
import Hiring from './sections/Hiring';
import Home from './sections/Home';
import Pipeline from './sections/Pipeline';
import Research from './sections/Research';
import WeeklyReview from './sections/WeeklyReview';
import Scorecard from './sections/Scorecard';
import Settings from './sections/Settings';
import FoundersSync from './sections/FoundersSync';
import TasksHub from './sections/TasksHub';
import MyTasks from './sections/MyTasks';
import MyTaskPanel from './sections/MyTaskPanel';
import { useAttendanceInCount, useOpenTeamTaskCount } from '../teamTasks/portalBridge';
import Vault from './sections/Vault';
import { useStore } from '@/store';
import { firstProjectsTab } from '@/domain/permissions';
import { INTERNAL_HOME, INTERNAL_NAV, PARTNER_HOME, PARTNER_NAV, internalItemActive, partnerItemActive } from '../portal/marioxNav';

// Mariox's portals open inside HQ on first use (they bring the portal's / partner app's own pages).
const InternalPortalHost = lazy(() => import('../portal/InternalPortalHost'));
const PartnersAdminEmbed = lazy(() => import('@/partners/embed/PartnersAdminEmbed'));
const hostBox = { background: '#fff', border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px', padding: '36px 16px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' };

/** Phone/tablet sidebar: hidden off-screen until the menu button opens it (see styles/responsive.css). */
function useMobileNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return {
    open,
    toggle: () => setOpen((value) => !value),
    close: () => setOpen(false),
    // Picking any item in the sidebar closes it.
    closeOnPick: (event) => {
      const picked = event.target.closest('button, a');
      if (picked && !picked.hasAttribute('data-nav-toggle')) setOpen(false);
    },
  };
}

/** Open / closed marker of a sidebar group. */
function Chevron({ open }) {
  return (
    <span aria-hidden="true" style={inlineStyle(`display:inline-block;font-size:10px;color:oklch(0.72 0.02 265);transition:transform .15s;transform:rotate(${open ? '90deg' : '0deg'})`)}>{'\u25B8'}</span>
  );
}

export default function Root({ vm }) {
  const mobileNav = useMobileNav();
  const pjTab = useStore((x) => x.pj?.tab);
  const mariox = asList(vm.coNav).find((company) => company?.portals);
  const mxApp = (mariox && mariox.mxApp) || null; // portal whose page is open: 'internal' | 'partner' | null
  // Companies → Mariox opens and closes its two portals; each portal opens and closes its pages.
  // Whatever is open in the main area stays open in the sidebar.
  const [mxOpen, setMxOpen] = useState(!!mxApp);
  const [portalOpen, setPortalOpen] = useState(mxApp);
  useEffect(() => {
    if (!mxApp) return;
    setMxOpen(true);
    setPortalOpen(mxApp);
  }, [mxApp]);
  const togglePortal = (app, home) => {
    if (portalOpen === app) { setPortalOpen(null); return; }
    setPortalOpen(app);
    if (mxApp !== app) mariox.goMxPage(app, home);
  };
  const openPage = (app, item) => {
    if (item.pj) useStore.getState().setPj({ tab: item.pj === 'first' ? firstProjectsTab(useStore.getState()) : item.pj });
    mariox.goMxPage(app, item.path);
  };
  const teamTaskCount = useOpenTeamTaskCount(); // sidebar Tasks badge: my open team tasks, live from the portal store
  const attInCount = useAttendanceInCount(); // sidebar Attendance badge: portal store while fresh, else the founder summary
  const navCount = (item) => (item?.id === 'tasks' && teamTaskCount != null ? String(teamTaskCount)
    : item?.id === 'attendance' && attInCount != null ? attInCount + ' in' : item?.count);
  return (<>
    <div className="hq-shell" data-nav-open={mobileNav.open || undefined} style={inlineStyle(`display:flex;min-height:100vh;--acc:${attr(vm.theme?.acc)};--acc2:${attr(vm.theme?.acc2)};--side:${attr(vm.theme?.side)};--side2:${attr(vm.theme?.side2)};--side3:${attr(vm.theme?.side3)};zoom:${attr(vm.theme?.zoom)}`)}>
      {' '}
      <aside className="hq-sidebar" id="hq-sidebar" aria-label="Founders HQ menu" onClick={mobileNav.closeOnPick} style={{
          width: '228px',
          flexShrink: '0',
          background: 'var(--side, oklch(0.21 0.02 265))',
          color: 'oklch(0.9 0.01 265)',
          display: 'flex',
          flexDirection: 'column',
          padding: '18px 12px',
          position: 'sticky',
          top: '0',
          height: '100vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          scrollbarWidth: 'thin',
          scrollbarColor: 'oklch(0.4 0.02 265) transparent',
          boxSizing: 'border-box',
        }}>
        {' '}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 10px 24px' }}>
          {' '}
          <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'oklch(0.97 0.005 85)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: '700',
              color: 'var(--side, oklch(0.21 0.02 265))',
              fontSize: '12px',
            }}>
            {show(vm.theme?.ini)}
          </div>
          {' '}
          <div style={{ minWidth: '0' }}>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#fff' }}>
              {show(vm.theme?.name)}
            </div>
            <div style={{ fontSize: '11.5px', color: 'oklch(0.72 0.02 265)' }}>
              {show(vm.theme?.sub)}
            </div>
          </div>
          {' '}
        </div>
        {' '}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {' '}
          <div style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'oklch(0.62 0.02 265)',
              padding: '2px 10px 6px',
            }}>
            {'Companies'}
          </div>
          {' '}
          {asList(vm.coNav).map((company, index) => (<Fragment key={index}>
            {' '}
            {company?.portals ? (<>
              <button type="button" data-nav-toggle onClick={() => setMxOpen(!mxOpen)} aria-expanded={mxOpen} title={mxOpen ? 'Hide Mariox portals' : 'Show Mariox portals'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', border: '0', borderRadius: '8px', padding: '8px 10px', fontSize: '13.5px', fontWeight: '500', cursor: 'pointer', textAlign: 'left', color: 'oklch(0.9 0.01 265)', background: 'transparent' }} className="scp1">
                <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <span style={inlineStyle(`width:20px;height:20px;border-radius:5px;background:${attr(company?.bg)};display:grid;place-items:center;font-size:11px;font-weight:700;color:#fff`)}>
                    {show(company?.ini)}
                  </span>
                  {show(company?.name)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'oklch(0.78 0.08 150)' }}>
                  {'2 portals'}
                  <Chevron open={mxOpen} />
                </span>
              </button>
              {mxOpen ? [
                { app: 'internal', label: 'Internal portal', title: 'Mariox internal portal: live, attendance, sales, projects, team', home: INTERNAL_HOME, items: INTERNAL_NAV, active: (item) => internalItemActive(item, company?.mxPath, pjTab) },
                { app: 'partner', label: 'Partner portal', title: 'Mariox partner portal: partners, leads, projects, payouts, requests', home: PARTNER_HOME, items: PARTNER_NAV, active: (item) => partnerItemActive(item, company?.mxPath) },
              ].map((portal) => (
                <Fragment key={portal.app}>
                  <button type="button" data-nav-toggle onClick={() => togglePortal(portal.app, portal.home)} aria-expanded={portalOpen === portal.app} title={portal.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '0', borderRadius: '8px', margin: '2px 0', padding: '8px 10px 8px 39px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', color: mxApp === portal.app ? '#fff' : 'oklch(0.82 0.015 265)', background: 'transparent' }} className="scp1">
                    <span>{portal.label}</span>
                    <Chevron open={portalOpen === portal.app} />
                  </button>
                  {portalOpen === portal.app ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: '2px 0 8px 44px', paddingLeft: '8px', borderLeft: '1px solid oklch(1 0 0 / 0.12)' }}>
                      {portal.items.map((item) => {
                        const on = mxApp === portal.app && portal.active(item);
                        return (
                          <button type="button" key={item.label} onClick={() => openPage(portal.app, item)} aria-current={on ? 'page' : undefined} style={inlineStyle(`display:flex;align-items:center;border:0;border-radius:8px;padding:8px 10px;font-size:13px;font-weight:${on ? 600 : 500};line-height:1.25;cursor:pointer;text-align:left;color:${on ? '#fff' : 'oklch(0.76 0.015 265)'};background:${on ? attr(company?.activeBg) : 'transparent'}`)} className="scp1">
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </Fragment>
              )) : null}
            </>) : null}
            {company?.live ? (<>
              <a href={company?.href} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '13.5px',
                  fontWeight: '500',
                  color: 'oklch(0.9 0.01 265)',
                  textDecoration: 'none',
                }} className="scp0">
                <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <span style={inlineStyle(`width:20px;height:20px;border-radius:5px;background:${attr(company?.bg)};display:grid;place-items:center;font-size:11px;font-weight:700;color:#fff`)}>
                    {show(company?.ini)}
                  </span>
                  {show(company?.name)}
                </span>
                <span style={{ fontSize: '11.5px', color: 'oklch(0.78 0.08 150)' }}>
                  {'Open ↗'}
                </span>
              </a>
            </>) : null}
            {' '}
            {company?.soon ? (<>
              <div aria-disabled="true" title="Portal coming soon" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '13.5px',
                  fontWeight: '500',
                  cursor: 'default',
                  textAlign: 'left',
                  color: 'oklch(0.9 0.01 265)',
                  userSelect: 'none',
                }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <span style={inlineStyle(`width:20px;height:20px;border-radius:5px;background:${attr(company?.bg)};display:grid;place-items:center;font-size:11px;font-weight:700;color:#fff`)}>
                    {show(company?.ini)}
                  </span>
                  {show(company?.name)}
                </span>
                <span style={{ fontSize: '11.5px', color: 'oklch(0.65 0.02 265)' }}>
                  {'Soon'}
                </span>
              </div>
            </>) : null}
            {' '}
            {company?.hasPartner ? (<>
              <button onClick={vm.pt?.open} title="Mariox partner admin" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  border: '0',
                  borderRadius: '8px',
                  padding: '6px 10px 6px 39px',
                  fontSize: '12.5px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  background: 'transparent',
                  color: 'oklch(0.78 0.015 265)',
                }} className="scp1">
                <span>
                  {'Partner admin'}
                </span>
                {vm.pt?.hasN ? (<>
                  <span style={{
                      minWidth: '18px',
                      height: '18px',
                      padding: '0 5px',
                      borderRadius: '9px',
                      background: 'oklch(0.64 0.19 40)',
                      color: '#fff',
                      fontSize: '10.5px',
                      fontWeight: '700',
                      display: 'grid',
                      placeItems: 'center',
                    }}>
                    {show(vm.pt?.total)}
                  </span>
                </>) : null}
              </button>
            </>) : null}
            {' '}
          </Fragment>))}
          {' '}
          <button onClick={vm.goCompanies} style={{
              border: '0',
              background: 'none',
              textAlign: 'left',
              padding: '7px 10px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: 'oklch(0.72 0.02 265)',
              cursor: 'pointer',
            }} className="scp1">
            {show(vm.coTotal)}
          </button>
          {asList(vm.navGroups).map((group, index) => (<Fragment key={index}>
            {' '}
            <div style={inlineStyle(`font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:oklch(0.62 0.02 265);padding:${attr(group?.pad)} 10px 6px`)}>
              {show(group?.title)}
            </div>
            {' '}
            {asList(group?.items).map((navItem, index) => (<Fragment key={index}>
              {' '}
              <button onClick={navItem?.go} style={inlineStyle(`display:flex;align-items:center;justify-content:space-between;border:0;border-radius:8px;padding:9px 10px;font-size:13.5px;font-weight:500;cursor:pointer;text-align:left;background:${attr(navItem?.bg)};color:${attr(navItem?.fg)}`)}>
                <span>
                  {show(navItem?.label)}
                </span>
                <span style={{ fontSize: '11.5px', color: 'oklch(0.7 0.02 265)' }}>
                  {show(navCount(navItem))}
                </span>
              </button>
              {' '}
            </Fragment>))}
            {' '}
          </Fragment>))}
          {' '}
          {' '}
        </nav>
        {' '}
        <button onClick={vm.goSettings} style={inlineStyle(`margin-top:auto;margin-bottom:6px;display:flex;align-items:center;gap:9px;border:0;border-radius:8px;padding:9px 10px;font-size:13.5px;font-weight:500;cursor:pointer;text-align:left;background:${attr(vm.setNavBg)};color:oklch(0.85 0.01 265)`)} className="scp0">
          <span style={{ fontSize: '15px', lineHeight: '1' }}>
            {'⚙'}
          </span>
          {'Settings & customise'}
        </button>
        <button onClick={vm.openAccounts} style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '8px', padding: '9px 10px', fontSize: '13.5px', fontWeight: '500', cursor: 'pointer', textAlign: 'left', background: 'transparent', color: 'oklch(0.85 0.01 265)' }} className="scp0">
          <span style={{ fontSize: '15px', lineHeight: '1' }}>
            {'👥'}
          </span>
          {'Accounts'}
        </button>
        {' '}
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px',
            borderTop: '1px solid var(--side3, oklch(0.3 0.02 265))',
          }}>
          {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {' '}
            <div style={inlineStyle(`width:32px;height:32px;border-radius:50%;background:${attr(vm.me?.bg)};display:grid;place-items:center;font-size:11.5px;font-weight:600;color:#fff`)}>
              {show(vm.me?.ini)}
            </div>
            {' '}
            <div style={{ minWidth: '0' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>
                {show(vm.me?.name)}
              </div>
              <div style={{ fontSize: '11.5px', color: 'oklch(0.7 0.02 265)' }}>
                {show(vm.me?.role)}
              </div>
            </div>
            {' '}
          </div>
          {' '}
          <button onClick={vm.signOut} style={{
              border: '1px solid var(--side3, oklch(0.3 0.02 265))',
              borderRadius: '8px',
              padding: '6px 0',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              background: 'transparent',
              color: 'oklch(0.8 0.01 265)',
            }} className="scp0">
            {'Sign out'}
          </button>
          {' '}
        </div>
        {' '}
      </aside>
      {mobileNav.open ? <div className="hq-scrim" onClick={mobileNav.close} aria-hidden="true" /> : null}
      {' '}
      <main style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
        {' '}
        {vm.popOpen ? (<>
          <div onClick={vm.closePop} style={{ position: 'fixed', inset: '0', zIndex: '20' }} />
        </>) : null}
        {' '}
        <header className="hq-topbar" style={{
            height: '60px',
            borderBottom: '1px solid oklch(0.915 0.006 85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '0 28px',
            background: '#fff',
            position: 'sticky',
            top: '0',
            zIndex: '5',
          }}>
          {' '}
          <div className="hq-crumbs" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}>
            <button type="button" className="hq-menu-btn" onClick={mobileNav.toggle} aria-label={mobileNav.open ? 'Close menu' : 'Open menu'} aria-expanded={mobileNav.open} aria-controls="hq-sidebar">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
            <span className="hq-crumb-root" style={{ color: 'oklch(0.52 0.012 265)' }}>
              {show(vm.theme?.name)}
            </span>
            <span style={{ color: 'oklch(0.75 0.01 265)' }}>
              {'/'}
            </span>
            <span style={{ fontWeight: '600' }}>
              {show(vm.crumb)}
            </span>
          </div>
          {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {vm.aiOn ? (<><button onClick={vm.ai7?.open} title="Founders AI (⌘J)" style={{
                height: '32px',
                border: '0',
                background: 'oklch(0.24 0.035 265)',
                color: '#fff',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}>
              {'✦ Ask AI'}
            </button></>) : null}
            <button onClick={vm.cmd?.openIt} aria-label="Search or add" style={{
                height: '32px',
                border: '1px solid oklch(0.9 0.006 85)',
                background: 'oklch(0.985 0.003 85)',
                borderRadius: '8px',
                padding: '0 6px 0 12px',
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }} className="scp2 hq-search-btn">
              <svg className="hq-search-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <span className="hq-search-text">
                {'Search or add'}
              </span>
              <span className="hq-search-kbd" style={{
                  fontFamily: '\'JetBrains Mono\',monospace',
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  background: '#fff',
                  border: '1px solid oklch(0.92 0.005 85)',
                }}>
                {show(vm.cmd?.kbd)}
              </span>
            </button>
            <span className="hq-today" style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)', whiteSpace: 'nowrap' }}>
              {show(vm.todayLabel)}
            </span>
          </div>
          {' '}
        </header>
        {' '}
        <div className="hq-content" style={{ padding: '24px 28px 56px', display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
          {' '}
          {vm.isCompanies ? <Companies vm={vm} /> : null}
          {vm.isSummary ? (
            <Suspense fallback={<div style={hostBox} role="status">Loading…</div>}>
              {vm.mxApp === 'partner'
                ? <PartnersAdminEmbed key="partner" path={vm.mxPath || PARTNER_HOME} onPath={vm.setMxPath} />
                : <InternalPortalHost key="internal" path={vm.mxPath || INTERNAL_HOME} onPath={vm.setMxPath} />}
            </Suspense>
          ) : null}
          {' '}
          {vm.isConstitution ? <Constitution vm={vm} /> : null}
          {' '}
          {vm.isScore ? <Scorecard vm={vm} /> : null}
          {' '}
          {vm.isSync ? <FoundersSync vm={vm} /> : null}
          {' '}
          {vm.isContracts ? <Contracts vm={vm} /> : null}
          {' '}
          {vm.isPipeline ? <Pipeline vm={vm} /> : null}
          {' '}
          {vm.isCustomers ? (<>
            {' '}
            <div style={{
                display: 'flex',
                gap: '2px',
                padding: '3px',
                background: 'oklch(0.94 0.005 85)',
                borderRadius: '10px',
                width: 'fit-content',
                maxWidth: '100%',
                overflowX: 'auto',
              }}>
              {asList(vm.hub?.sales).map((hubLink, index) => (<Fragment key={index}>
                <button onClick={hubLink?.go} style={inlineStyle(`display:flex;align-items:center;gap:7px;border:0;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;background:${attr(hubLink?.bg)};color:${attr(hubLink?.fg)};box-shadow:${attr(hubLink?.sh)}`)}>
                  {show(hubLink?.label)}
                  {hubLink?.hasN ? (<>
                    <span style={inlineStyle(`font-size:11px;font-weight:700;padding:1px 6px;border-radius:8px;background:${attr(hubLink?.nBg)};color:${attr(hubLink?.nFg)}`)}>
                      {show(hubLink?.n)}
                    </span>
                  </>) : null}
                </button>
              </Fragment>))}
            </div>
            {' '}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
              }}>
              <div>
                <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.015em' }}>
                  {'Customers'}
                </h1>
                <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
                  {show(vm.cu?.sub)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input value={inputValue(vm.cu?.q)} onChange={vm.cu?.onQ} placeholder="Search customer or contact" style={{
                    height: '32px',
                    padding: '0 10px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    outline: 'none',
                    background: '#fff',
                    fontFamily: 'inherit',
                    width: '220px',
                  }} />
                <select value={inputValue(vm.cu?.co?.value)} onChange={vm.cu?.co?.onChange} style={{
                    height: '32px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '8px',
                    background: '#fff',
                    fontSize: '12.5px',
                    padding: '0 6px',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}>
                  {asList(vm.cu?.co?.opts).map((option, index) => (<Fragment key={index}>
                    <option value={inputValue(option?.v)}>
                      {show(option?.l)}
                    </option>
                  </Fragment>))}
                </select>
              </div>
            </div>
            {' '}
            <div style={{
                background: '#fff',
                border: '1px solid oklch(0.915 0.006 85)',
                borderRadius: '12px',
                overflow: 'auto',
              }}>
              <div style={{ minWidth: '880px' }}>
                {' '}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1.2fr) 110px 120px 120px 130px 150px',
                    gap: '12px',
                    padding: '9px 16px',
                    background: 'oklch(0.975 0.004 85)',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'oklch(0.5 0.012 265)',
                  }}>
                  <span>
                    {'Customer'}
                  </span>
                  <span>
                    {'Contact'}
                  </span>
                  <span>
                    {'Companies'}
                  </span>
                  <span>
                    {'Open pipeline'}
                  </span>
                  <span>
                    {'Won'}
                  </span>
                  <span>
                    {'Contracts'}
                  </span>
                  <span />
                </div>
                {' '}
                {asList(vm.cu?.rows).map((row, index) => (<Fragment key={index}>
                  <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1.2fr) 110px 120px 120px 130px 150px',
                      gap: '12px',
                      padding: '11px 16px',
                      borderBottom: '1px solid oklch(0.95 0.004 85)',
                      alignItems: 'center',
                      fontSize: '13px',
                    }}>
                    {' '}
                    <span style={{ minWidth: '0' }}>
                      <span style={{
                          display: 'block',
                          fontSize: '13.5px',
                          fontWeight: '600',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                        {show(row?.name)}
                      </span>
                      <span style={{ display: 'block', fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                        {show(row?.meta)}
                      </span>
                    </span>
                    {' '}
                    <span style={{
                        minWidth: '0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'oklch(0.38 0.012 265)',
                      }}>
                      {show(row?.contact)}
                    </span>
                    {' '}
                    <span style={{ display: 'flex', gap: '3px' }}>
                      {asList(row?.cos).map((coCell, index) => (<Fragment key={index}>
                        <span title={coCell?.name} style={inlineStyle(`width:20px;height:20px;border-radius:5px;background:${attr(coCell?.bg)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center`)}>
                          {show(coCell?.ini)}
                        </span>
                      </Fragment>))}
                    </span>
                    {' '}
                    <span style={{ fontWeight: '600' }}>
                      {show(row?.open)}
                    </span>
                    {' '}
                    <span style={inlineStyle(`font-weight:600;color:${attr(row?.wonC)}`)}>
                      {show(row?.won)}
                    </span>
                    {' '}
                    <span>
                      <span style={{ display: 'block' }}>
                        {show(row?.ct)}
                      </span>
                      <span style={inlineStyle(`font-size:11.5px;font-weight:600;color:${attr(row?.renC)}`)}>
                        {show(row?.ren)}
                      </span>
                    </span>
                    {' '}
                    <span style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button onClick={row?.goDeals} style={{
                          height: '28px',
                          border: '1px solid oklch(0.9 0.006 85)',
                          background: '#fff',
                          borderRadius: '7px',
                          padding: '0 9px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          color: 'oklch(0.35 0.012 265)',
                        }}>
                        {'Leads'}
                      </button>
                      <button onClick={row?.goCts} style={{
                          height: '28px',
                          border: '1px solid oklch(0.9 0.006 85)',
                          background: '#fff',
                          borderRadius: '7px',
                          padding: '0 9px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          color: 'oklch(0.35 0.012 265)',
                        }}>
                        {'Contracts'}
                      </button>
                    </span>
                    {' '}
                  </div>
                </Fragment>))}
                {' '}
                {vm.cu?.empty ? (<>
                  <div style={{
                      padding: '28px 16px',
                      fontSize: '13.5px',
                      color: 'oklch(0.5 0.012 265)',
                      position: 'sticky',
                      left: '0',
                      width: 'fit-content',
                      maxWidth: '560px',
                    }}>
                    {'Customers appear here automatically from your sales leads and customer contracts.'}
                  </div>
                </>) : null}
                {' '}
              </div>
            </div>
            {' '}
          </>) : null}
          {' '}
          {vm.ai7?.closed ? (<>
            {vm.aiOn ? (<><button onClick={vm.ai7?.open} title="Ask Founders AI (⌘J)" style={inlineStyle(`position:fixed;right:22px;bottom:${attr(vm.ai7?.fabB)};z-index:50;height:46px;border:0;border-radius:23px;padding:${attr(vm.ai7?.fabP)};background:oklch(0.24 0.035 265);color:#fff;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:9px;box-shadow:0 8px 28px oklch(0.2 0.03 265 / 0.3)`)} className="scpe">
              <span style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--acc, oklch(0.5 0.17 265))',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '13px',
                }}>
                {'✦'}
              </span>
              {vm.ai7?.fabFull ? (<>
                {'Ask AI'}
                <span style={{
                    fontFamily: '\'JetBrains Mono\',monospace',
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '5px',
                    background: 'oklch(1 0 0 / 0.12)',
                  }}>
                  {'⌘J'}
                </span>
              </>) : null}
            </button></>) : null}
          </>) : null}
          {' '}
          {vm.ai7?.isOpen ? <AssistantPanel vm={vm} /> : null}
          {' '}
          {vm.isSettings ? <Settings vm={vm} /> : null}
          {' '}
          {vm.isHome ? <Home vm={vm} /> : null}
          {' '}
          {vm.isGoals ? <Goals vm={vm} /> : null}
          {' '}
          {vm.isDecisions ? <Decisions vm={vm} /> : null}
          {' '}
          {vm.isReview ? <WeeklyReview vm={vm} /> : null}
          {' '}
          {vm.isTasks ? <TasksHub vm={vm} /> : null}
          {' '}
          {vm.isMyTasks ? <MyTasks vm={vm} /> : null}
          {vm.isUsers ? (
            <Suspense fallback={<div style={hostBox} role="status">Loading…</div>}>
              <InternalPortalHost key="users" path="/users" />
            </Suspense>
          ) : null}
          {' '}
          {vm.isResearch ? <Research vm={vm} /> : null}
          {' '}
          {vm.isFinance ? <Finance vm={vm} /> : null}
          {' '}
          {vm.isCal ? <Calendar vm={vm} /> : null}
          {' '}
          {vm.isAtt ? <Attendance vm={vm} /> : null}
          {' '}
          {vm.isHiring ? <Hiring vm={vm} /> : null}
          {' '}
          {vm.isDocs ? <Docs vm={vm} /> : null}
          {' '}
          {vm.isVault ? <Vault vm={vm} /> : null}
          {' '}
          {vm.isCo ? (<>
            {' '}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {' '}
              <div style={inlineStyle(`width:48px;height:48px;border-radius:12px;background:${attr(vm.co?.bg)};display:grid;place-items:center;font-weight:700;color:#fff;font-size:21px`)}>
                {show(vm.co?.ini)}
              </div>
              {' '}
              <div>
                <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.015em' }}>
                  {show(vm.co?.name)}
                </h1>
                <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
                  {'The '}{show(vm.co?.name)}{' team portal isn\'t built yet. Founder items for '}{show(vm.co?.name)}{' are below.'}
                </div>
              </div>
              {' '}
            </div>
            {' '}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
                gap: '12px',
                alignItems: 'start',
              }}>
              {' '}
              <div style={{
                  background: '#fff',
                  border: '1px solid oklch(0.915 0.006 85)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}>
                {' '}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderBottom: '1px solid oklch(0.94 0.005 85)',
                  }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {'Open tasks'}
                  </div>
                  <button onClick={vm.co?.goTasks} style={{
                      border: '0',
                      background: 'none',
                      color: 'var(--acc, oklch(0.5 0.17 265))',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}>
                    {'Manage →'}
                  </button>
                </div>
                {' '}
                {asList(vm.co?.tasks).map((task, index) => (<Fragment key={index}>
                  {' '}
                  <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '11px 16px',
                      borderBottom: '1px solid oklch(0.955 0.004 85)',
                    }}>
                    {' '}
                    <button onClick={task?.toggle} style={inlineStyle(`width:18px;height:18px;flex-shrink:0;border-radius:5px;border:1.5px solid ${attr(task?.checkBorder)};background:${attr(task?.checkBg)};color:#fff;font-size:11px;line-height:1;cursor:pointer;padding:0`)}>
                      {show(task?.mark)}
                    </button>
                    {' '}
                    <button type="button" onClick={task?.open} title="Open in Tasks" style={{ flex: '1', minWidth: '0', fontSize: '13.5px', border: '0', background: 'none', padding: '0', textAlign: 'left', cursor: 'pointer', color: 'inherit' }}>
                      {show(task?.title)}
                    </button>
                    {' '}
                    <span style={inlineStyle(`font-size:12.5px;font-weight:500;color:${attr(task?.dueColor)};white-space:nowrap`)}>
                      {show(task?.dueLabel)}
                    </span>
                    {' '}
                  </div>
                  {' '}
                </Fragment>))}
                {' '}
                {vm.co?.noTasks ? (<>
                  <div style={{
                      padding: '24px 16px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: 'oklch(0.52 0.012 265)',
                    }}>
                    {'No open tasks.'}
                  </div>
                </>) : null}
                {' '}
              </div>
              {' '}
              <div style={{
                  background: '#fff',
                  border: '1px solid oklch(0.915 0.006 85)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}>
                {' '}
                <div style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid oklch(0.94 0.005 85)',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>
                  {'Plan'}
                </div>
                {' '}
                {asList(vm.co?.stats).map((stat, index) => (<Fragment key={index}>
                  {' '}
                  <button onClick={stat?.go} style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      border: '0',
                      borderBottom: '1px solid oklch(0.955 0.004 85)',
                      background: '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }} className="scp13">
                    <span style={{ fontSize: '13.5px', color: 'oklch(0.42 0.012 265)' }}>
                      {show(stat?.label)}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>
                      {show(stat?.value)}
                    </span>
                  </button>
                  {' '}
                </Fragment>))}
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </>) : null}
          {' '}
        </div>
        {' '}
        {vm.hasGPeek ? <GoalPanel vm={vm} /> : null}
        {' '}
        {vm.toastOn ? (<>
          <div style={{
              position: 'fixed',
              left: '50%',
              bottom: '24px',
              transform: 'translateX(-50%)',
              zIndex: '80',
              background: 'oklch(0.24 0.015 265)',
              color: '#fff',
              borderRadius: '10px',
              padding: '10px 10px 10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '13.5px',
              boxShadow: '0 12px 32px oklch(0.2 0.02 265 / 0.3)',
            }}>
            <span>
              {show(vm.toastText)}
            </span>
            {vm.toastCanUndo ? (<>
              <button onClick={vm.toastUndo} style={{
                  height: '30px',
                  border: '0',
                  background: 'oklch(0.36 0.02 265)',
                  color: '#fff',
                  borderRadius: '7px',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }} className="scp2f">
                {show(vm.toastLabel || 'Undo')}
              </button>
            </>) : null}
            <button onClick={vm.toastClose} title="Dismiss" style={{
                border: '0',
                background: 'none',
                color: 'oklch(0.75 0.01 265)',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '0 4px',
              }}>
              {'×'}
            </button>
          </div>
        </>) : null}
        {' '}
        {vm.gx?.menuOpen ? (<>
          {' '}
          <div style={inlineStyle(`position:fixed;top:${attr(vm.gx?.popTop)};bottom:${attr(vm.gx?.popBottom)};left:${attr(vm.gx?.popX)};z-index:60;min-width:240px;max-height:320px;overflow-y:auto;background:#fff;border:1px solid oklch(0.9 0.006 85);border-radius:10px;box-shadow:0 12px 32px oklch(0.2 0.02 265 / 0.16);padding:5px;display:flex;flex-direction:column;gap:1px`)}>
            {' '}
            {vm.gx?.hasMenuTitle ? (<>
              <div style={{
                  fontSize: '11.5px',
                  fontWeight: '600',
                  color: 'oklch(0.52 0.012 265)',
                  padding: '6px 10px 4px',
                }}>
                {show(vm.gx?.menuTitle)}
              </div>
            </>) : null}
            {' '}
            {asList(vm.gx?.menu).map((menuItem, index) => (<Fragment key={index}>
              <button onClick={menuItem?.go} style={inlineStyle(`display:flex;align-items:center;justify-content:space-between;gap:12px;border:0;background:${attr(menuItem?.bg)};padding:8px 10px;border-radius:7px;font-size:13.5px;cursor:pointer;text-align:left`)} className="scp2d">
                <span style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: '0' }}>
                  {menuItem?.hasDot ? (<>
                    <span style={inlineStyle(`width:9px;height:9px;border-radius:50%;background:${attr(menuItem?.dot)};flex-shrink:0`)} />
                  </>) : null}
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}>
                    <span style={{
                        fontWeight: '500',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                      {show(menuItem?.label)}
                    </span>
                    {menuItem?.hasDesc ? (<>
                      <span style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                        {show(menuItem?.desc)}
                      </span>
                    </>) : null}
                  </span>
                </span>
                <span style={{ color: 'var(--acc, oklch(0.5 0.17 265))', fontSize: '13px', fontWeight: '700' }}>
                  {show(menuItem?.mark)}
                </span>
              </button>
            </Fragment>))}
            {' '}
          </div>
          {' '}
        </>) : null}
        {' '}
        {vm.pt?.isOpen ? (<>
          {' '}
          <div onClick={vm.pt?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.3)', zIndex: '60' }} />
          {' '}
          <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 'min(560px,calc(100% - 32px))',
              maxHeight: 'calc(100vh - 48px)',
              overflowY: 'auto',
              background: '#fff',
              borderRadius: '14px',
              zIndex: '61',
              boxShadow: '0 20px 60px oklch(0.2 0.02 265 / 0.25)',
              color: 'oklch(0.23 0.015 265)',
            }}>
            {' '}
            <div style={{
                padding: '18px 22px',
                borderBottom: '1px solid oklch(0.94 0.005 85)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
              <span style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9px',
                  background: 'oklch(0.64 0.19 40)',
                  color: '#fff',
                  fontWeight: '700',
                  display: 'grid',
                  placeItems: 'center',
                }}>
                {'M'}
              </span>
              <div style={{ flex: '1', minWidth: '0' }}>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  {'Mariox partner admin'}
                </div>
                <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
                  {show(vm.pt?.updated)}
                </div>
              </div>
              <button onClick={vm.pt?.close} style={{
                  width: '30px',
                  height: '30px',
                  border: '0',
                  background: 'none',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: 'oklch(0.5 0.012 265)',
                }} className="scp23">
                {'×'}
              </button>
            </div>
            {' '}
            <div style={{
                padding: '16px 22px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
                gap: '10px',
              }}>
              {' '}
              {asList(vm.pt?.rows).map((row, index) => (<Fragment key={index}>
                <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '10px 12px',
                    border: '1px solid oklch(0.92 0.005 85)',
                    borderRadius: '10px',
                  }}>
                  <span style={{ fontSize: '12.5px', color: 'oklch(0.45 0.012 265)' }}>
                    {show(row?.label)}
                  </span>
                  <input type="number" min="0" value={inputValue(row?.v)} onChange={row?.on} style={inlineStyle(`border:0;outline:none;font-size:22px;font-weight:600;padding:0;width:100%;font-family:inherit;color:${attr(row?.color)}`)} />
                </label>
              </Fragment>))}
              {' '}
            </div>
            {' '}
            <div style={{ padding: '0 22px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '600' }}>
                {'Partner admin link'}
              </span>
              <input value={inputValue(vm.pt?.url)} onChange={vm.pt?.onUrl} placeholder="Paste the published partner admin address" style={{
                  height: '34px',
                  padding: '0 10px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }} />
              <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
                {'These numbers show on Today, the Mariox card and Founders AI. Update them here until both portals share a server.'}
              </span>
            </div>
            {' '}
            <div style={{
                padding: '14px 22px',
                borderTop: '1px solid oklch(0.94 0.005 85)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
              }}>
              <button onClick={vm.pt?.close} style={{
                  height: '32px',
                  border: '1px solid oklch(0.88 0.008 85)',
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'Done'}
              </button>
              {vm.pt?.hasUrl ? (<>
                <a href={vm.pt?.url} target="_blank" rel="noopener" style={{
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'oklch(0.23 0.015 265)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}>
                  {'Open partner admin ↗'}
                </a>
              </>) : null}
            </div>
            {' '}
          </div>
          {' '}
        </>) : null}
        {' '}
        {' '}
        {vm.tk?.menuOpen ? (<>
          {' '}
          <div style={inlineStyle(`position:fixed;top:${attr(vm.tk?.popTop)};bottom:${attr(vm.tk?.popBottom)};left:${attr(vm.tk?.popX)};z-index:60;min-width:220px;background:#fff;border:1px solid oklch(0.9 0.006 85);border-radius:10px;box-shadow:0 12px 32px oklch(0.2 0.02 265 / 0.16);padding:5px;display:flex;flex-direction:column;gap:1px`)}>
            {' '}
            {vm.tk?.hasMenuTitle ? (<>
              <div style={{
                  fontSize: '11.5px',
                  fontWeight: '600',
                  color: 'oklch(0.52 0.012 265)',
                  padding: '6px 10px 4px',
                }}>
                {show(vm.tk?.menuTitle)}
              </div>
            </>) : null}
            {' '}
            {asList(vm.tk?.menu).map((menuItem, index) => (<Fragment key={index}>
              <button onClick={menuItem?.go} style={inlineStyle(`display:flex;align-items:center;justify-content:space-between;gap:12px;border:0;background:${attr(menuItem?.bg)};padding:8px 10px;border-radius:7px;font-size:13.5px;cursor:pointer;text-align:left`)} className="scp2d">
                <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  {menuItem?.hasDot ? (<>
                    <span style={inlineStyle(`width:9px;height:9px;border-radius:50%;background:${attr(menuItem?.dot)};flex-shrink:0`)} />
                  </>) : null}
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ fontWeight: '500' }}>
                      {show(menuItem?.label)}
                    </span>
                    {menuItem?.hasDesc ? (<>
                      <span style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                        {show(menuItem?.desc)}
                      </span>
                    </>) : null}
                  </span>
                </span>
                <span style={{ color: 'var(--acc, oklch(0.5 0.17 265))', fontSize: '13px', fontWeight: '700' }}>
                  {show(menuItem?.mark)}
                </span>
              </button>
            </Fragment>))}
            {' '}
          </div>
          {' '}
        </>) : null}
        {' '}
        {vm.hasTPeek ? <MyTaskPanel vm={vm} /> : null}
        {' '}
        {vm.cmd?.open ? (<>
          {' '}
          <div onClick={vm.cmd?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.35)', zIndex: '80' }} />
          {' '}
          <div style={{
              position: 'fixed',
              top: '11vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(660px,94vw)',
              maxHeight: '72vh',
              background: '#fff',
              borderRadius: '14px',
              boxShadow: '0 24px 64px oklch(0.15 0.02 265 / 0.35)',
              zIndex: '81',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
            {' '}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 16px',
                borderBottom: '1px solid oklch(0.93 0.005 85)',
              }}>
              {' '}
              <span style={{ fontSize: '16px', color: 'oklch(0.52 0.012 265)' }}>
                {'⌕'}
              </span>
              {' '}
              <input data-cmd="1" value={inputValue(vm.cmd?.q)} onChange={vm.cmd?.onQ} onKeyDown={vm.cmd?.onKey} placeholder="Type a task for you, or search… e.g. Call Infosys tomorrow #mariox !high" style={{ flex: '1', border: '0', outline: 'none', fontSize: '16px', padding: '4px 0', minWidth: '0' }} />
              {' '}
              <span style={{
                  fontFamily: '\'JetBrains Mono\',monospace',
                  fontSize: '11px',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  background: 'oklch(0.95 0.005 85)',
                  color: 'oklch(0.52 0.012 265)',
                }}>
                {'esc'}
              </span>
              {' '}
            </div>
            {' '}
            {vm.cmd?.hasChips ? (<>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '10px 16px 0' }}>
                {asList(vm.cmd?.chips).map((chip, index) => (<Fragment key={index}>
                  <span style={inlineStyle(`font-size:12px;font-weight:600;padding:3px 9px;border-radius:6px;background:${attr(chip?.bg)};color:${attr(chip?.fg)}`)}>
                    {show(chip?.label)}
                  </span>
                </Fragment>))}
              </div>
            </>) : null}
            {' '}
            <div style={{ overflowY: 'auto', padding: '6px' }}>
              {' '}
              {asList(vm.cmd?.items).map((item, index) => (<Fragment key={index}>
                {' '}
                {item?.isHead ? (<>
                  <div style={{
                      fontSize: '11.5px',
                      fontWeight: '600',
                      color: 'oklch(0.52 0.012 265)',
                      padding: '10px 10px 4px',
                    }}>
                    {show(item?.label)}
                  </div>
                </>) : null}
                {' '}
                {item?.isItem ? (<>
                  <button onClick={item?.run} onMouseEnter={item?.hover} style={inlineStyle(`width:100%;display:flex;align-items:center;gap:12px;border:0;border-radius:8px;padding:9px 10px;background:${attr(item?.bg)};cursor:pointer;text-align:left`)}>
                    {' '}
                    <span style={inlineStyle(`width:26px;height:26px;border-radius:7px;background:${attr(item?.iconBg)};color:${attr(item?.iconFg)};display:grid;place-items:center;font-size:12px;font-weight:700;flex-shrink:0`)}>
                      {show(item?.icon)}
                    </span>
                    {' '}
                    <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                        {show(item?.label)}
                      </span>
                      {item?.hasSub ? (<>
                        <span style={{
                            fontSize: '12px',
                            color: 'oklch(0.52 0.012 265)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                          {show(item?.sub)}
                        </span>
                      </>) : null}
                    </span>
                    {' '}
                    <span style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)', whiteSpace: 'nowrap' }}>
                      {show(item?.hint)}
                    </span>
                    {' '}
                  </button>
                </>) : null}
                {' '}
              </Fragment>))}
              {' '}
            </div>
            {' '}
            <div style={{
                display: 'flex',
                gap: '14px',
                flexWrap: 'wrap',
                padding: '10px 16px',
                borderTop: '1px solid oklch(0.94 0.005 85)',
                fontSize: '11.5px',
                color: 'oklch(0.52 0.012 265)',
                background: 'oklch(0.985 0.003 85)',
              }}>
              <span>
                {'Tasks are team tasks for you'}
              </span>
              <span>
                {'#mariox #hroo #arth'}
              </span>
              <span>
                {'!high !low'}
              </span>
              <span>
                {'today · tomorrow · fri · 15 nov · in 3 days'}
              </span>
              <span>
                {'↑↓ move · Enter run'}
              </span>
            </div>
            {' '}
          </div>
          {' '}
        </>) : null}
        {' '}
      </main>
    </div>
  </>);
}
