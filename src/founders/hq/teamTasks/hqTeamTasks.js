/**
 * Team tasks are Founders HQ's only tasks.
 *
 * The internal portal's team tasks (loaded into the portal store by portalBridge) are read here in the
 * shape HQ's pages use, created from HQ ("Make it a task", Today's "Add a task", the command bar …) and
 * opened in HQ → Tasks with the task's drawer. They are never written into the HQ workspace; the
 * workspace only keeps `ttLinks` ({ [team task id]: { goal?, dec?, ctId?, deal?, res?, from? } }) so
 * goals, decisions, contracts … can list the tasks made from them.
 *
 * The founders' own tasks of the old HQ (workspace `data.tasks`) stay in storage but are no longer
 * shown or used.
 */
import { useStore } from '@/store';
import { toDay } from '@/api/client';
import { fromApiTeamTask, teamTasksApi } from '@/api/teamTasks';
import { DEFAULT_COMPANY } from '@/features/team-tasks/companies';
import { connect, refreshTeamTasks, setTasksCompany, usePortalBridge } from './portalBridge';

/** How often HQ re-reads team tasks while a page that shows them is open. */
export const TEAM_TASKS_REFRESH_MS = 2 * 60 * 1000;
/** HQ views that re-read team tasks when shown (and every few minutes while open). */
export const TEAM_TASK_VIEWS = ['home', 'calendar', 'brief', 'companies', 'co', 'goals', 'decisions', 'pipeline', 'sync', 'review'];
/** Hue of each team task status (dots in HQ lists). */
export const TEAM_STATUS_HUE = { 'To do': 265, 'In progress': 70, Reopened: 25, Done: 150 };

const first = (name) => String(name || '').trim().split(/\s+/)[0] || 'someone';
const COMPANY_ID = /^[a-z0-9-]{1,40}$/;

/** HQ company id → team task company ('all' / Founders and unknown ids → Mariox). */
export const teamCompanyOf = (co) => (co && co !== 'all' && COMPANY_ID.test(co) ? co : DEFAULT_COMPANY);

/** The portal user id of the signed-in founder (null until the portal session is there). */
const myUserId = () => {
  const me = useStore.getState().me;
  return (me && me.id) || null;
};

/**
 * One portal team task in HQ's task shape: { id, title, co, due 'YYYY-MM-DD' | '', done, status, pri,
 * notes, created, doneAt, canStatus, canEdit, mine, assignee / giver (names), team: { toMe, byMe, self,
 * other, otherFirst, who ('from Ravi' / 'to Priya' / 'my task') } }.
 */
function toHQTask(t, me) {
  const toMe = t.a === me, byMe = t.by === me;
  const other = toMe ? (byMe ? '' : t.byName) : t.aName;
  return {
    id: t.id,
    title: t.title || 'Untitled task',
    co: t.co || DEFAULT_COMPANY,
    due: t.due != null ? toDay(t.due) : '',
    done: t.status === 'Done',
    status: t.status,
    pri: t.prio,
    notes: t.notes || '',
    created: t.at || 0,
    doneAt: t.doneAt || null,
    canStatus: !!t.canStatus,
    canEdit: !!t.canEdit,
    mine: toMe || byMe,
    assignee: t.aName || '',
    giver: t.byName || '',
    team: {
      toMe,
      byMe,
      self: toMe && byMe,
      other: other || '',
      otherFirst: other ? first(other) : '',
      who: toMe ? (byMe ? 'my task' : 'from ' + first(t.byName)) : 'to ' + first(t.aName),
    },
  };
}

/** Every team task the founder can see, in HQ's shape. Empty until the portal session and tasks have loaded. */
export function hqTeamTasks() {
  if (usePortalBridge.getState().status !== 'ready') return [];
  const me = myUserId();
  if (!me) return [];
  return (useStore.getState().teamTasks || []).filter(Boolean).map((t) => toHQTask(t, me));
}

/** Calls `onChange(hqTeamTasks())` now and whenever the portal team tasks / session change. Returns unsubscribe. */
export function watchTeamTasks(onChange) {
  let last = null;
  const emit = () => {
    const st = useStore.getState();
    const key = [usePortalBridge.getState().status, st.me && st.me.id, st.teamTasks];
    if (last && key.every((v, i) => v === last[i])) return;
    last = key;
    onChange(hqTeamTasks());
  };
  const offStore = useStore.subscribe(emit);
  const offBridge = usePortalBridge.subscribe(emit);
  emit();
  return () => { offStore(); offBridge(); };
}

/** Connect (first time) and re-fetch team tasks; never throws. */
export function reloadTeamTasks() {
  return connect().then((ok) => (ok ? refreshTeamTasks() : null)).catch(() => null);
}

/**
 * Create a team task from HQ, assigned to the signed-in founder.
 * `fields`: { title, co (HQ company id), due ('YYYY-MM-DD' | ''), pri ('High' | 'Medium' | 'Low'), notes, from
 * (what it was made from, e.g. 'deal “Acme website”' — added to the description), status? ('To do' |
 * 'In progress' | 'Done'), forName? (give it to the active portal user with this name instead, e.g. the
 * other founder; falls back to me when there is none) }.
 * Resolves the new task (portal store shape); rejects with a readable message.
 */
export async function createTeamTask({ title, co, due, pri, notes, from, status, forName }) {
  if (!(await connect())) throw new Error('Team tasks aren’t available — the internal portal didn’t respond.');
  const wanted = String(forName || '').trim().toLowerCase();
  const named = wanted && (useStore.getState().users || []).find((u) => u.status === 'Active' && String(u.name || '').trim().toLowerCase() === wanted);
  const assigneeId = (named && named.id) || myUserId();
  if (!assigneeId) throw new Error('Sign in again to add team tasks.');
  const description = [String(notes || '').trim(), from ? 'Created in Founders HQ from ' + from + '.' : ''].filter(Boolean).join('\n\n');
  const res = await teamTasksApi.create({
    title: String(title || '').trim().slice(0, 300) || 'Untitled task',
    notes: description,
    priority: ['High', 'Medium', 'Low'].includes(pri) ? pri : 'Medium',
    dueDate: /^\d{4}-\d{2}-\d{2}$/.test(due || '') ? due : null,
    companyId: teamCompanyOf(co),
    assigneeId,
    ...(['In progress', 'Done'].includes(status) ? { status } : {}),
  });
  const saved = fromApiTeamTask(res);
  useStore.setState((s) => ({ teamTasks: [saved].concat((s.teamTasks || []).filter((x) => x.id !== saved.id)) }));
  return saved;
}

/**
 * Mark a team task Done (or open it when it can't be ticked here: already done — reopening needs a
 * reason — or the founder can't change its status). `hq` is the HQ component.
 */
export async function toggleTeamTask(hq, task) {
  if (task.done || !task.canStatus) { openTeamTaskInHQ(hq, task.id); return; }
  if (await useStore.getState().updateTeamTask(task.id, { status: 'Done' })) hq.toastMsg('Marked as done');
}

/** Move a team task's due date ('YYYY-MM-DD'); opens the task when the founder can't edit it. Resolves true when saved. */
export async function setTeamTaskDue(hq, task, due) {
  if (!task.canEdit) { openTeamTaskInHQ(hq, task.id); return false; }
  try {
    const saved = fromApiTeamTask(await teamTasksApi.update(task.id, { dueDate: due || null }));
    useStore.setState((s) => ({ teamTasks: (s.teamTasks || []).map((x) => (x.id === saved.id ? saved : x)) }));
    return true;
  } catch (error) {
    hq.toastMsg('Couldn’t move the task: ' + ((error && error.message) || 'try again'));
    return false;
  }
}

/** HQ → Tasks with this task's drawer open. `hq` is the HQ component. */
export function openTeamTaskInHQ(hq, id) {
  useStore.getState().openTeamTask(id);
  hq.setState({ pop: null });
  hq.go('tasks');
}

/**
 * The full "New task" form (the portal's Team task form) right where you are, e.g. on the Calendar,
 * with company / due date prefilled and the founder as assignee. The page must mount
 * TaskModalHost so the form can render. `preset`: { co (HQ company id), due ('YYYY-MM-DD') }.
 */
export async function openNewTeamTaskHere(preset = {}) {
  const co = preset.co && preset.co !== 'all' ? teamCompanyOf(preset.co) : '';
  if (!(await connect())) return;
  useStore.getState().openModal('tt', { ...(co ? { company: co } : {}), ...(preset.due ? { due: preset.due } : {}), assignee: myUserId() || '' });
}

/**
 * HQ → Tasks with the "New task" form open (assignee: the founder picks; company / due prefilled).
 * `preset`: { co (HQ company id), due ('YYYY-MM-DD') }.
 */
export function newTeamTaskInHQ(hq, preset = {}) {
  const co = preset.co && preset.co !== 'all' ? teamCompanyOf(preset.co) : '';
  if (co) setTasksCompany(co);
  hq.setState({ pop: null });
  hq.go('tasks');
  useStore.getState().openModal('tt', { ...(co ? { company: co } : {}), ...(preset.due ? { due: preset.due } : {}), assignee: myUserId() || '' });
}

/** HQ → Tasks showing one company's team tasks ('all' = every company). */
export function openCompanyTasksInHQ(hq, co) {
  setTasksCompany(co || 'all');
  hq.go('tasks');
}
