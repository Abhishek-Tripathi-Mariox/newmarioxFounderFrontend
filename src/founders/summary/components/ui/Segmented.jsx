import s from './ui.module.css';

/** Pill-style toggle group. `options` is a list of [value, label]. */
export default function Segmented({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className={s.seg}>
      {options.map(([v, text]) => (
        <button key={v} type="button" aria-pressed={value === v} className={s.segBtn} onClick={() => onChange(v)}>
          {text}
        </button>
      ))}
    </div>
  );
}
