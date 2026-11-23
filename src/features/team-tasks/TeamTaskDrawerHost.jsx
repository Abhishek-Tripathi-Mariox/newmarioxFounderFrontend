import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/store';
import { useNow } from '@/hooks/useNow';
import { sod } from '@/lib/date';
import { makeUploaderLabel, viewerId, visibleTasks } from './model';
import { companyList, companyOf } from './companies';
import TaskDrawer from './TaskDrawer';

/**
 * The team task drawer on its own, for pages other than Team tasks (e.g. Founders HQ → Calendar):
 * open one with `useStore.getState().openTeamTaskDrawer(id)`. Same drawer, data and actions as on
 * the Team tasks page.
 */
export default function TeamTaskDrawerHost() {
  const T = sod(useNow(60000));
  const st = useStore(useShallow((x) => ({ teamTasks: x.teamTasks, users: x.users, roles: x.roles, viewAs: x.viewAs, auth: x.auth, me: x.me, ttCompanies: x.ttCompanies, ttDrawer: x.ttDrawer })));
  const close = useStore((x) => x.openTeamTaskDrawer);
  const me = viewerId(st);
  const allTasks = useMemo(() => visibleTasks(st), [st]);
  const task = st.ttDrawer ? allTasks.find((t) => t.id === st.ttDrawer) : null;
  if (!task) return null;
  const companies = companyList(st.ttCompanies, allTasks);
  return <TaskDrawer key={task.id} t={task} me={me} T={T} co={companyOf(companies, task.co)} uploader={makeUploaderLabel(st.users, me)} onClose={() => close(null)} />;
}
