const norm = (t) => (typeof t === 'string' ? { value: t, label: t, count: undefined } : t);

// Segmented control (".seg").
export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="seg" role="tablist">
      {tabs.map(norm).map(t => (
        <button key={t.value} type="button" role="tab" aria-selected={t.value === value} className={t.value === value ? 'on' : ''} onClick={() => onChange(t.value)}>
          {t.label}
          {!!t.count && <span className="c">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

// Pill filter row (".chips").
export function Chips({ tabs, value, onChange }) {
  return (
    <div className="chips">
      {tabs.map(norm).map(t => (
        <button key={t.value} type="button" className={`chip ${t.value === value ? 'on' : ''}`} onClick={() => onChange(t.value)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
