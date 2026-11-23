import { lazy, Suspense, useMemo } from 'react';
import { useStore } from '@/store';
import { COS } from '../../logic/core';
import { setTasksCompany, usePortalBridge, useTasksCompany } from '../../teamTasks/portalBridge';

const TeamTasksHost = lazy(() => import('../../teamTasks/TeamTasksHost'));

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

/**
 * HQ → Tasks: the internal portal's Team tasks page (HQ's only tasks), with a tab per HQ company
 * (All / Mariox / HROO / Arth / companies the founders added). A tab shows that company's team tasks
 * and new tasks default to it. Counts = open team tasks the founder can see.
 */
export default function TasksHub() {
  const co = useTasksCompany((x) => x.co);
  const ready = usePortalBridge((x) => x.status === 'ready');
  const teamTasks = useStore((x) => x.teamTasks);
  const open = useMemo(() => (teamTasks || []).filter((t) => t && t.status !== 'Done'), [teamTasks]);
  const count = (id) => (ready ? String(id === 'all' ? open.length : open.filter((t) => t.co === id).length) : '');
  // A company that was closed / archived while its tab was selected falls back to All.
  const current = co === 'all' || COS.some((c) => c.id === co) ? co : 'all';
  const tabs = [{ id: 'all', name: 'All', dot: '' }].concat(COS.map((c) => ({ id: c.id, name: c.name, dot: c.bg || `oklch(0.6 0.15 ${c.hue ?? 265})` })));
  return (<>
    <div role="tablist" aria-label="Company" style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', borderBottom: '1px solid oklch(0.92 0.005 85)' }}>
      {tabs.map((tab) => (
        <button key={tab.id} type="button" role="tab" aria-selected={current === tab.id} onClick={() => setTasksCompany(tab.id)} style={tabStyle(current === tab.id)}>
          {tab.dot ? <span aria-hidden style={{ width: '8px', height: '8px', borderRadius: '3px', background: tab.dot }} /> : null}
          <span>{tab.name}</span>
          {count(tab.id) ? <span style={{ fontSize: '12px', fontWeight: '500', color: 'oklch(0.52 0.012 265)' }}>{count(tab.id)}</span> : null}
        </button>
      ))}
    </div>
    <Suspense fallback={<div role="status" style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' }}>Loading team tasks…</div>}>
      <TeamTasksHost company={current === 'all' ? '' : current} />
    </Suspense>
  </>);
}
