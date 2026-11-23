/**
 * Pure helpers for "today" live data, shared by Live now and the
 * End-of-shift modal.
 */
import { today } from '@/lib/date';

/** Fill in defaults for the live object (original `lBase`). */
export const liveBase = (live) => ({ date: today(), att: {}, timers: {}, idle: {}, feed: [], ...(live || {}) });

/**
 * Check in / break / timer / check out controls for one person (features/live/components/PersonControls),
 * from the live data: same rules as the Live now rows. `sales`: sales people have no task timers.
 */
export function liveControls(S, pid, sales) {
  const LV = liveBase(S.live);
  const a = LV.att[pid];
  const tm = LV.timers[pid];
  const PRJ = Object.fromEntries((S.projects || []).map((p) => [p.id, p]));
  const tasks = sales ? [] : (S.tasks || [])
    .filter((t) => t.a === pid && t.st !== 'Done')
    .slice(0, 15)
    .map((t) => ({ value: t.id, label: `${t.title} · ${(PRJ[t.p] || {}).name || ''}` }));
  return {
    id: pid,
    canIn: !a, canOut: !!a && !a.out, canBreak: !!a && !a.out, brkLabel: a && a.brk ? 'Resume' : 'Break',
    hasTimer: !!tm, canStart: !sales && !!a && !a.out && !a.brk && !tm, tasks,
  };
}

/**
 * Lead activity since `T`: lead activity entries (owner = lead owner) plus
 * live-feed entries that reference a lead (owner = the person who did it).
 * Each item: `{t, kind, text, lead, owner, fromFeed?}`.
 */
export function actsSince(leads, feed, T) {
  const byId = {};
  leads.forEach((l) => { byId[l.id] = l; });
  const out = [];
  leads.forEach((l) => (l.acts || []).forEach((a) => {
    if (a.t >= T) out.push({ t: a.t, kind: a.kind, text: a.text, lead: l, owner: l.owner });
  }));
  (feed || []).forEach((e) => {
    if (e.lead && byId[e.lead]) out.push({ t: e.t, kind: e.kind, text: e.text, lead: byId[e.lead], owner: e.who, fromFeed: true });
  });
  return out;
}
