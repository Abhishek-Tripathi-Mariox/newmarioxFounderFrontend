import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import UsersPage from '@/features/users/UsersPage';
import ModalHost from '@/components/layout/ModalHost';
import DrawerHost from '@/components/layout/DrawerHost';
import NotificationStack from '@/components/layout/NotificationStack';
import SecretNote from '@/components/layout/SecretNote';
import { closePortalOverlays, connect, loadUsersData, usePortalBridge } from '../teamTasks/portalBridge';

const box = { background: '#fff', border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px', padding: '36px 16px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' };
const btn = { marginTop: '12px', height: '34px', border: '0', background: 'var(--acc, oklch(0.5 0.17 265))', color: '#fff', borderRadius: '9px', padding: '0 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };

/** Same rule as the portal's /users route and people loader: Super Admin, or a role that may view Users. */
const canManageUsers = (me) => !!me && ((me.role && me.role.id === 'r-super') || !!me.role?.perms?.users?.v);

/**
 * The internal portal's Users & roles page (/users) inside HQ → Companies → Mariox → Users & roles: the
 * same component, store and API (Users with invite / edit / role / reports-to / Founders HQ seat /
 * deactivate, Roles & permissions, Activity log). The user modal, toasts and the one-time invite /
 * set-password link note (SecretNote) render through hosts mounted here, as TeamTasksHost does.
 * The portal's top-bar "+ Invite user" button shows next to the title instead. "Preview as" is left
 * out: it switches the whole portal to another person's view.
 */
export default function UsersHost() {
  const status = usePortalBridge((x) => x.status);
  const error = usePortalBridge((x) => x.error);
  const me = useStore((x) => x.me);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let live = true;
    loadUsersData().then((ok) => { if (live && ok) setLoaded(true); });
    return () => {
      live = false;
      closePortalOverlays();
      useStore.setState({ secretNote: null });
    };
  }, []);

  if (status === 'denied') return <div style={box}>Your Mariox account can’t open the internal portal, so users aren’t available here.</div>;
  if (status === 'error') {
    return (
      <div style={box} role="alert">
        <div style={{ fontWeight: 600, color: 'oklch(0.3 0.015 265)' }}>Couldn’t load users</div>
        <div style={{ marginTop: '4px' }}>{error}</div>
        <button type="button" style={btn} onClick={() => { connect(); loadUsersData().then((ok) => ok && setLoaded(true)); }}>Try again</button>
      </div>
    );
  }
  if (status !== 'ready' || !loaded) return <div style={box} role="status">Loading users…</div>;
  if (!canManageUsers(me)) return <div style={box}>Your role can’t manage users and roles.</div>;
  return (
    <div className="hq-users">
      <SecretNote style={{ margin: '0 0 18px' }} />
      <UsersPage preview={false} invite />
      <DrawerHost />
      <ModalHost />
      <NotificationStack />
    </div>
  );
}
