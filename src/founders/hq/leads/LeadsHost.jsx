import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import LeadsPage from '@/features/leads/LeadsPage';
import ModalHost from '@/components/layout/ModalHost';
import DrawerHost from '@/components/layout/DrawerHost';
import NotificationStack from '@/components/layout/NotificationStack';
import { closeLeadOverlays, connect, loadSalesData, useLeadsCompany, usePortalBridge } from '../teamTasks/portalBridge';

const box = { background: '#fff', border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px', padding: '36px 16px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' };
const btn = { marginTop: '12px', height: '34px', border: '0', background: 'var(--acc, oklch(0.5 0.17 265))', color: '#fff', borderRadius: '9px', padding: '0 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };

/**
 * The internal portal's Leads page (/leads) inside HQ → Sales → Pipeline: the same component, store and
 * API (new lead, edit, stage moves incl. drag, follow-ups, activity, quotes, import / export, filters,
 * hot leads, duplicates, Board / Table). Its drawers (lead, project), modals (lead, follow-up, quote,
 * import) and toasts render through the portal hosts, mounted here like TeamTasksHost does.
 * `company`: the HQ company tab ('' = all companies). `drawerExtra(lead)`: extra actions in the lead
 * drawer's header (HQ's "Create contract" / "Open contract").
 */
export default function LeadsHost({ company = '', drawerExtra = null }) {
  const status = usePortalBridge((x) => x.status);
  const error = usePortalBridge((x) => x.error);
  const rest = usePortalBridge((x) => x.rest);
  const restError = usePortalBridge((x) => x.restError);
  const pendingLead = useLeadsCompany((x) => x.open);
  const pendingModal = useLeadsCompany((x) => x.modal);
  const leads = useStore((x) => x.leads);
  const ready = status === 'ready' && rest === 'ready';

  useEffect(() => {
    // Fresh leads each time the pipeline opens (people may have changed them in the portal meanwhile).
    connect().then((ok) => ok && loadSalesData());
    return closeLeadOverlays;
  }, []);

  // The drawer reads the latest HQ actions through a stable function.
  const extraRef = useRef(drawerExtra);
  extraRef.current = drawerExtra;
  const extra = useCallback((lead) => (extraRef.current ? extraRef.current(lead) : null), []);
  useEffect(() => {
    useStore.setState({ leadDrawerExtra: extra });
    return () => useStore.setState({ leadDrawerExtra: null });
  }, [extra]);

  // A lead / form asked for from elsewhere in HQ (openLeadInHQ, newLeadInHQ) opens once the page is up.
  useEffect(() => {
    if (!ready || !pendingLead || !(leads || []).some((l) => l.id === pendingLead)) return;
    useLeadsCompany.setState({ open: null });
    useStore.getState().selectLead(pendingLead);
  }, [ready, pendingLead, leads]);
  useEffect(() => {
    if (!ready || !pendingModal) return;
    useLeadsCompany.setState({ modal: null });
    useStore.getState().openModal(pendingModal[0], pendingModal[1] || {});
  }, [ready, pendingModal]);

  if (status === 'denied') return <div style={box}>Your Mariox account can’t open the internal portal, so leads aren’t available here.</div>;
  if (status === 'error' || rest === 'error') {
    return (
      <div style={box} role="alert">
        <div style={{ fontWeight: 600, color: 'oklch(0.3 0.015 265)' }}>Couldn’t load the leads</div>
        <div style={{ marginTop: '4px' }}>{status === 'error' ? error : restError}</div>
        <button type="button" style={btn} onClick={() => { connect().then((ok) => ok && loadSalesData()); }}>Try again</button>
      </div>
    );
  }
  if (!ready) return <div style={box} role="status">Loading leads…</div>;
  return (
    <div className="hq-leads">
      <LeadsPage company={company} companyFilter={false} newLead />
      <DrawerHost />
      <ModalHost />
      <NotificationStack />
    </div>
  );
}
