import { createContext, useContext } from 'react';

export const SummaryContext = createContext(null);

/**
 * `{ status: 'loading' | 'ready' | 'error', mariox, partners, error, loadedAt, sample, reload }`.
 * `loadedAt` is the Date the summaries were loaded; pages use it as "now" for time rules.
 */
export function useSummaries() {
  const value = useContext(SummaryContext);
  if (!value) throw new Error('useSummaries must be used inside <SummaryProvider>');
  return value;
}
