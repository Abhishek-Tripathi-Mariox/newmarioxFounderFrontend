export const nextTask = (l) =>
  l.tasks.filter(t => !t.done).sort((a, b) => ((a.due || '9') < (b.due || '9') ? -1 : 1))[0];

export const daysSince = (iso) => (iso ? Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 864e5)) : 0);
