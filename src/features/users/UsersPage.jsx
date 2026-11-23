import { useStore } from '@/store';
import { useNow } from '@/hooks/useNow';
import { Button, Tabs } from '@/components/ui';
import { useUsersModel } from './useUsersModel';
import UsersTab from './components/UsersTab';
import RolesTab from './components/RolesTab';
import ActivityLogTab from './components/ActivityLogTab';
import s from './UsersPage.module.css';

/**
 * Users & roles page: Users / Roles & permissions / Activity log. `preview` (default on) offers
 * "Preview as" in the users table; `invite` puts the "+ Invite user" button next to the title (in the
 * portal it sits in the top bar). Founders HQ, which hosts this page without the top bar, sets both.
 */
export default function UsersPage({ preview = true, invite = false }) {
  const now = useNow(60000);
  const model = useUsersModel(now);
  const setUs = useStore((st) => st.setUs);
  const openModal = useStore((st) => st.openModal);
  const { users, roles, audit, us, counts } = model;
  const tab = us.tab || 'users';

  const tabs = [
    { key: 'users', label: 'Users', count: users.length },
    { key: 'roles', label: 'Roles & permissions', count: roles.length },
    { key: 'log', label: 'Activity log', count: audit.length },
  ];

  return (
    <div className={s.page}>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Users &amp; roles</h1>
          <div className={s.summary}>
            {counts.Active} active · {counts.Invited} invited · {roles.length} roles
          </div>
        </div>
        {invite && <Button variant="primary" onClick={() => openModal('user', {})}>+ Invite user</Button>}
      </div>
      <Tabs tabs={tabs} value={tab} onChange={(k) => setUs({ tab: k })} />
      {tab === 'users' && <UsersTab model={model} now={now} preview={preview} />}
      {tab === 'roles' && <RolesTab model={model} />}
      {tab === 'log' && <ActivityLogTab audit={audit} />}
    </div>
  );
}
