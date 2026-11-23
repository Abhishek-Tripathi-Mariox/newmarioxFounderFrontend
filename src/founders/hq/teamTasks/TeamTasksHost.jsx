import { useEffect } from 'react';
import TeamTasksPage from '@/features/team-tasks/TeamTasksPage';
import ModalHost from '@/components/layout/ModalHost';
import DrawerHost from '@/components/layout/DrawerHost';
import NotificationStack from '@/components/layout/NotificationStack';
import { closePortalOverlays, connect, loadRest, refreshTeamTasks, usePortalBridge } from './portalBridge';

const box = { background: '#fff', border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px', padding: '36px 16px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' };
const btn = { marginTop: '12px', height: '34px', border: '0', background: 'var(--acc, oklch(0.5 0.17 265))', color: '#fff', borderRadius: '9px', padding: '0 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };

/**
 * The internal portal's Team tasks page (/team-tasks) inside HQ: the same component, store and API.
 * The portal App renders modals (New / Edit task), drawers (project / lead) and toasts through its
 * hosts, which don't exist under /founders, so they are mounted here too. Portal sidebar / top bar
 * (AppShell) are not used. `company`: the HQ company tab ('' = all companies).
 */
export default function TeamTasksHost({ company = '' }) {
  const status = usePortalBridge((x) => x.status);
  const error = usePortalBridge((x) => x.error);

  useEffect(() => {
    // Fresh tasks each time Tasks opens (people may have changed them in the portal meanwhile).
    connect().then((ok) => ok && refreshTeamTasks().catch(() => {}));
    loadRest();
    return closePortalOverlays;
  }, []);

  if (status === 'denied') return <div style={box}>Your Mariox account can’t open the internal portal, so team tasks aren’t available here.</div>;
  if (status === 'error') {
    return (
      <div style={box} role="alert">
        <div style={{ fontWeight: 600, color: 'oklch(0.3 0.015 265)' }}>Couldn’t load team tasks</div>
        <div style={{ marginTop: '4px' }}>{error}</div>
        <button type="button" style={btn} onClick={() => { connect(); loadRest(); }}>Try again</button>
      </div>
    );
  }
  if (status !== 'ready') return <div style={box} role="status">Loading team tasks…</div>;
  return (
    <div className="hq-team-tasks">
      <TeamTasksPage company={company} companyFilter={false} />
      <DrawerHost />
      <ModalHost />
      <NotificationStack />
    </div>
  );
}
