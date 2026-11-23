import { daysBetween } from '@/founders/summary/lib/dates';
import { percent, plural } from '@/founders/summary/lib/format';

const APPROVAL_WAIT_DAYS = 7;

/**
 * Health of a project from its current milestone:
 *  Late     — the milestone's due date has passed
 *  At risk  — more hours used than budgeted, or the client hasn't approved for 7+ days
 *  On track — otherwise
 */
export function projectHealth(p, now) {
  const lateBy = p.milestone && p.milestone.due ? daysBetween(p.milestone.due, now) : 0;
  const waiting = p.approvalAskedAt ? daysBetween(p.approvalAskedAt, now) : 0;
  if (lateBy > 0) return { health: 'Late', tone: 'bad', reason: 'late', note: `${plural(lateBy, 'day')} late`, lateBy, waiting };
  if (p.hoursUsed != null && p.hoursUsed > 1) return { health: 'At risk', tone: 'warn', reason: 'hours', note: 'Over hour budget', lateBy: 0, waiting };
  if (waiting >= APPROVAL_WAIT_DAYS)
    return { health: 'At risk', tone: 'warn', reason: 'approval', note: `Waiting on client approval, ${plural(waiting, 'day')}`, lateBy: 0, waiting };
  return { health: 'On track', tone: 'good', reason: null, note: p.note || '', lateBy: 0, waiting };
}

export const withHealth = (list, now) => list.map((p) => ({ ...p, ...projectHealth(p, now) }));

export const needsAttention = (p) => p.health !== 'On track';

/** One line on why a project needs attention. */
export function attentionText(p) {
  if (p.reason === 'late') return `“${p.milestone.name}” milestone ${p.note}`;
  if (p.reason === 'hours') return `${percent(p.hoursUsed, 1)}% of budgeted hours used`;
  if (p.reason === 'approval') return `Client approval pending ${plural(p.waiting, 'day')}`;
  return p.note;
}
