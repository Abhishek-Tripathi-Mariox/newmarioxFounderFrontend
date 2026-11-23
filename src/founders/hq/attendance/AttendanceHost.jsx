import { useEffect } from 'react';
import AttendancePage from '@/features/attendance/AttendancePage';
import ModalHost from '@/components/layout/ModalHost';
import DrawerHost from '@/components/layout/DrawerHost';
import NotificationStack from '@/components/layout/NotificationStack';
import { closePortalOverlays, loadAttendanceData, pollAttendance, usePortalBridge } from '../teamTasks/portalBridge';

/** Same cadence as the portal's live refresh (App.jsx useReminderPolling). */
const POLL_MS = 20000;

const box = { background: '#fff', border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px', padding: '36px 16px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' };
const btn = { marginTop: '12px', height: '34px', border: '0', background: 'var(--acc, oklch(0.5 0.17 265))', color: '#fff', borderRadius: '9px', padding: '0 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };

/**
 * The internal portal's Attendance page (/attendance) inside HQ: the same component, store and API.
 * Toasts (CSV export) and any portal modal / drawer render through hosts mounted here, and are closed
 * when the page is left. The live refresh runs only while this is mounted (and the tab is visible).
 */
export default function AttendanceHost() {
  const status = usePortalBridge((x) => x.status);
  const error = usePortalBridge((x) => x.error);
  const att = usePortalBridge((x) => x.att);
  const attError = usePortalBridge((x) => x.attError);

  useEffect(() => {
    loadAttendanceData();
    const iv = setInterval(() => { if (!document.hidden) pollAttendance(); }, POLL_MS);
    return () => {
      clearInterval(iv);
      closePortalOverlays();
    };
  }, []);

  if (status === 'denied') return <div style={box}>Your Mariox account can’t open the internal portal, so attendance isn’t available here.</div>;
  if (status === 'error' || att === 'error') {
    return (
      <div style={box} role="alert">
        <div style={{ fontWeight: 600, color: 'oklch(0.3 0.015 265)' }}>Couldn’t load attendance</div>
        <div style={{ marginTop: '4px' }}>{status === 'error' ? error : attError}</div>
        <button type="button" style={btn} onClick={() => loadAttendanceData()}>Try again</button>
      </div>
    );
  }
  if (status !== 'ready' || att !== 'ready') return <div style={box} role="status">Loading attendance…</div>;
  return (
    <div className="hq-attendance">
      <AttendancePage />
      <DrawerHost />
      <ModalHost />
      <NotificationStack />
    </div>
  );
}
