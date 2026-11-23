import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchSummary, usingSampleData } from '@/founders/summary/api/summary';
import { SummaryContext } from './summaryContext';

const REFRESH_MS = 5 * 60 * 1000;
const SOURCES = ['mariox', 'partners'];
const initialSource = { data: null, error: null, loading: true };

/**
 * Loads the internal-portal and partner-portal summaries independently, so one portal being down
 * never hides the other's numbers. Refreshes every 5 minutes; a failed refresh keeps the last good data.
 *
 * Context value: { mariox, partners (data or null), sources: { mariox|partners: { status, error } },
 *                  status (overall), error, loadedAt, sample, reload }
 */
export default function SummaryProvider({ children }) {
  const [sources, setSources] = useState({ mariox: initialSource, partners: initialSource });
  const [loadedAt, setLoadedAt] = useState(null);
  const controllerRef = useRef(null);

  const load = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const results = await Promise.allSettled(SOURCES.map((name) => fetchSummary(name, { signal: controller.signal })));
    if (controller.signal.aborted) return;

    setSources((previous) => {
      const next = {};
      SOURCES.forEach((name, position) => {
        const result = results[position];
        next[name] =
          result.status === 'fulfilled'
            ? { data: result.value, error: null, loading: false }
            : { data: previous[name].data, error: result.reason?.message || 'Could not load these numbers.', loading: false };
      });
      return next;
    });
    setLoadedAt(new Date());
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      clearInterval(timer);
      controllerRef.current?.abort();
    };
  }, [load]);

  const reload = useCallback(() => {
    setSources((previous) => {
      const next = {};
      for (const name of SOURCES) next[name] = previous[name].data ? previous[name] : { ...previous[name], loading: true, error: null };
      return next;
    });
    return load();
  }, [load]);

  const value = useMemo(() => {
    const sourceStatus = (source) => (source.data ? 'ready' : source.loading ? 'loading' : 'error');
    const statuses = Object.fromEntries(SOURCES.map((name) => [name, { status: sourceStatus(sources[name]), error: sources[name].error }]));
    const anyReady = SOURCES.some((name) => statuses[name].status === 'ready');
    const anyLoading = SOURCES.some((name) => statuses[name].status === 'loading');
    return {
      mariox: sources.mariox.data,
      partners: sources.partners.data,
      sources: statuses,
      status: anyReady ? 'ready' : anyLoading ? 'loading' : 'error',
      error: SOURCES.map((name) => sources[name].error).find(Boolean) || null,
      loadedAt: loadedAt || new Date(),
      sample: usingSampleData,
      reload,
    };
  }, [sources, loadedAt, reload]);

  return <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>;
}
