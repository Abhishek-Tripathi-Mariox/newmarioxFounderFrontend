/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment, lazy, Suspense, useMemo } from 'react';
import { useStore } from '@/store';
import { show, attr, inlineStyle, asList } from '../rt';
import { COS } from '../../logic/core';
import { setLeadsCompany, useLeadsCompany, usePortalBridge } from '../../teamTasks/portalBridge';

const LeadsHost = lazy(() => import('../../leads/LeadsHost'));

const tabStyle = (on) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  border: '0',
  background: 'none',
  padding: '8px 12px 10px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  color: on ? 'oklch(0.23 0.015 265)' : 'oklch(0.52 0.012 265)',
  borderBottom: `2px solid ${on ? 'var(--acc, oklch(0.5 0.17 265))' : 'transparent'}`,
  marginBottom: '-1px',
});

const extraBtn = {
  height: '32px', border: '1px solid oklch(0.88 0.04 150)', background: 'oklch(0.97 0.03 150)', color: 'oklch(0.4 0.12 150)',
  borderRadius: '8px', padding: '0 12px', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
};

/**
 * HQ → Sales → Pipeline: the internal portal's Leads page (HQ's only sales pipeline) with a tab per HQ
 * company (All / Mariox / HROO / Arth / companies the founders added). A tab shows that company's leads
 * and new leads default to it. Counts = open leads (not Won / Lost) the founder can see. A won lead's
 * drawer offers "Create contract" (or opens the contract made from it).
 */
export default function Pipeline({ vm }) {
  const co = useLeadsCompany((x) => x.co);
  const ready = usePortalBridge((x) => x.status === 'ready' && x.rest === 'ready');
  const leads = useStore((x) => x.leads);
  const open = useMemo(() => (leads || []).filter((l) => l && l.status !== 'Won' && l.status !== 'Lost'), [leads]);
  const count = (id) => (ready ? String(id === 'all' ? open.length : open.filter((l) => (l.co || 'mariox') === id).length) : '');
  // A company that was closed / archived while its tab was selected falls back to All.
  const current = co === 'all' || COS.some((c) => c.id === co) ? co : 'all';
  const tabs = [{ id: 'all', name: 'All', dot: '' }].concat(COS.map((c) => ({ id: c.id, name: c.name, dot: c.bg || `oklch(0.6 0.15 ${c.hue ?? 265})` })));
  const contractFor = vm.pp?.contractFor;
  const drawerExtra = (lead) => {
    const action = contractFor ? contractFor(lead.id) : null;
    return action ? <button type="button" style={extraBtn} onClick={action.run}>{action.label}</button> : null;
  };
  return (<>
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
      {asList(vm.hub?.sales).map((hubTab, index) => (<Fragment key={index}>
        <button onClick={hubTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:7px;border:0;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;background:${attr(hubTab?.bg)};color:${attr(hubTab?.fg)};box-shadow:${attr(hubTab?.sh)}`)}>
          {show(hubTab?.label)}
          {hubTab?.hasN ? (<>
            <span style={inlineStyle(`font-size:11px;font-weight:700;padding:1px 6px;border-radius:8px;background:${attr(hubTab?.nBg)};color:${attr(hubTab?.nFg)}`)}>
              {show(hubTab?.n)}
            </span>
          </>) : null}
        </button>
      </Fragment>))}
    </div>
    <div role="tablist" aria-label="Company" style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', borderBottom: '1px solid oklch(0.92 0.005 85)' }}>
      {tabs.map((tab) => (
        <button key={tab.id} type="button" role="tab" aria-selected={current === tab.id} onClick={() => setLeadsCompany(tab.id)} style={tabStyle(current === tab.id)}>
          {tab.dot ? <span aria-hidden style={{ width: '8px', height: '8px', borderRadius: '3px', background: tab.dot }} /> : null}
          <span>{tab.name}</span>
          {count(tab.id) ? <span style={{ fontSize: '12px', fontWeight: '500', color: 'oklch(0.52 0.012 265)' }}>{count(tab.id)}</span> : null}
        </button>
      ))}
    </div>
    <Suspense fallback={<div role="status" style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' }}>Loading leads…</div>}>
      <LeadsHost company={current === 'all' ? '' : current} drawerExtra={drawerExtra} />
    </Suspense>
  </>);
}
