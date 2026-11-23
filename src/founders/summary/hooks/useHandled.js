import { useCallback, useState } from 'react';

const keyFor = (now) => {
  const d = new Date(now);
  return `cofounder-mariox:handled:${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

/**
 * Alerts marked "handled" today, kept in this browser only. A new day starts with a clean list,
 * so anything still wrong shows up again.
 */
export function useHandled(now) {
  const key = keyFor(now);
  const [state, setState] = useState(() => ({ key, ids: read(key) }));
  const ids = state.key === key ? state.ids : read(key);

  const toggle = useCallback(
    (id) =>
      setState((s) => {
        const base = s.key === key ? s.ids : read(key);
        const next = { ...base };
        if (next[id]) delete next[id];
        else next[id] = Date.now();
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* storage unavailable: keep it in memory */
        }
        return { key, ids: next };
      }),
    [key],
  );

  return [ids, toggle];
}
