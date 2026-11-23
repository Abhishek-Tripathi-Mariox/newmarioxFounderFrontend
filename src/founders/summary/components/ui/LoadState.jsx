import { useSummaries } from '@/founders/summary/state/summaryContext';
import s from './ui.module.css';

const SOURCE_LABELS = { mariox: 'internal portal', partners: 'partner portal' };

/**
 * Loading or error state for one portal's numbers (`source`), or for the whole page when no source
 * is given. Shown only while there is nothing to display.
 */
export default function LoadState({ source }) {
  const ctx = useSummaries();
  const { status, error } = source ? ctx.sources[source] : ctx;
  if (status === 'error') {
    return (
      <div className={s.state} role="alert">
        <p className={s.stateTitle}>Couldn’t load the {source ? SOURCE_LABELS[source] : ''} numbers</p>
        <p>{error}</p>
        <button type="button" className={`${s.btn} ${s.btnDark}`} onClick={ctx.reload}>
          Try again
        </button>
      </div>
    );
  }
  return (
    <div className={s.state} role="status">
      Loading the latest numbers…
    </div>
  );
}
