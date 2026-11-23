import s from './ui.module.css';

/**
 * Labelled horizontal bars, scaled to the largest value.
 * rows: [{ key, label, value, right, color? }]
 */
export default function BarList({ rows, color, labelWidth = 108, valueWidth = 100, height = 10 }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className={s.barList}>
      {rows.map((r) => (
        <div key={r.key} className={s.barRow} style={{ gridTemplateColumns: `${labelWidth}px minmax(0, 1fr) ${valueWidth}px` }}>
          <span>{r.label}</span>
          <div className={s.track} style={{ height }} aria-hidden="true">
            <div className={s.fill} style={{ width: `${(r.value / max) * 100}%`, background: r.color || color }} />
          </div>
          <span className={`${s.barRight} num`}>{r.right}</span>
        </div>
      ))}
    </div>
  );
}
