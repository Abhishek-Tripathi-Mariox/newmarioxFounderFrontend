import { clock, duration } from '@/founders/summary/lib/format';

const LATE_AFTER_MIN = 10 * 60 + 30; // checked in after 10:30 counts as late (same rule as the internal portal)

/** Late flag from the API when present, else worked out from the check-in time (browser clock). */
function isLate(person, inAt) {
  if (typeof person.late === 'boolean') return person.late;
  return inAt.getHours() * 60 + inAt.getMinutes() > LATE_AFTER_MIN;
}

/** { key: in | break | left | out, label, tone, when } for one person right now. */
export function personStatus(person, now) {
  if (!person.checkInAt) {
    return { key: 'out', label: 'Not in', tone: 'bad', when: person.expectedAt ? `Not checked in · expected ${clock(person.expectedAt)}` : 'Not checked in' };
  }
  const inAt = new Date(person.checkInAt);
  const late = isLate(person, inAt);
  if (person.break) {
    const used = Math.max(0, Math.round((now - new Date(person.break.startedAt)) / 60000));
    const plan = person.break.plannedMin ? ` of ${person.break.plannedMin}` : '';
    return { key: 'break', label: 'On break', tone: 'info', when: `${person.break.kind || 'Break'} · ${used}${plan} min` };
  }
  if (person.checkOutAt) {
    return { key: 'left', label: 'Left', tone: 'flat', when: `${clock(inAt)} – ${clock(person.checkOutAt)}` };
  }
  return {
    key: 'in',
    label: late ? 'In · late' : 'In',
    tone: late ? 'warn' : 'good',
    when: late ? `In at ${clock(inAt)} · late` : `In since ${clock(inAt)}`,
  };
}

export function personActivity(person, now) {
  const t = person.timer;
  if (t) return `Timer ${duration(now - new Date(t.startedAt))} · ${t.task}${t.projectId ? ` (${t.projectId})` : ''}`;
  return person.activity || '';
}
