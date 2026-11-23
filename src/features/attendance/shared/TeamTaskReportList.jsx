import s from './InternalWorkList.module.css';

const hx = (x) => `${Math.round(x * 100) / 100}h`;

/**
 * Team tasks from an end-of-shift report: ✓ Completed / Worked on · title · hours · note.
 * Hours were also added to the project timesheet or internal work (`to`).
 */
export default function TeamTaskReportList({ items, compact = false }) {
  if (!items || !items.length) return null;
  const done = items.filter((x) => x.done).length;
  return (
    <div className={compact ? s.wrapCompact : s.wrap}>
      <div className={s.head}>
        <span className={s.title}>Team tasks</span>
        <span className={s.ttTotal}>{done ? `${done} completed` : 'worked on'}</span>
      </div>
      {items.map((x) => (
        <div key={x.id} className={s.line}>
          <span className={x.done ? s.ttDone : s.ttOpen}>{x.done ? '✓ Completed' : 'Worked on'}</span>
          <span className={s.ttTitle}>{x.title}</span>
          {x.h > 0 && <span className={s.h} title={x.to === 'timesheet' ? 'Added to the project timesheet' : 'Added to internal work'}>{hx(x.h)}</span>}
          {x.note && <span className={s.note}>{x.note}</span>}
        </div>
      ))}
    </div>
  );
}
