import s from './ui.module.css';

/** Horizontal bar split into segments sized by `value`. Decorative: show the numbers next to it. */
export default function StackedBar({ segments, height = 8, gap = 2 }) {
  const total = segments.reduce((a, x) => a + (x.value || 0), 0);
  return (
    <div className={s.bar} style={{ height, gap }} aria-hidden="true">
      {total > 0 &&
        segments.map((x, i) => (x.value > 0 ? <div key={i} style={{ flex: `${x.value} 1 0`, background: x.color }} /> : null))}
    </div>
  );
}
