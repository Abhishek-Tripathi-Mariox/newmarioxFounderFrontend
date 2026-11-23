import Pill from './Pill';
import StackedBar from './StackedBar';
import s from './ui.module.css';

const COMPANY = {
  both: ['Both', 'var(--muted-2)'],
  mariox: ['Internal', 'var(--mariox-ink)'],
  partners: ['Partners', 'var(--partners-ink)'],
};

/** A headline number with an optional company tag, Mariox/Partners split and change chip. */
export default function KpiCard({ label, value, sub, company, delta, split, valueColor, compact = false }) {
  const co = company && COMPANY[company];
  return (
    <div className={`${s.kpi} ${compact ? s.compact : ''}`}>
      <div className={s.kpiTop}>
        <span className={s.kpiLabel}>{label}</span>
        {co && (
          <span className={s.kpiCompany} style={{ color: co[1] }}>
            {co[0]}
          </span>
        )}
      </div>
      <span className={`${s.kpiValue} num`} style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </span>
      {sub && <span className={s.kpiSub}>{sub}</span>}
      {split && (
        <div className={s.kpiSplit}>
          <StackedBar segments={split.segments} />
          <div className={s.legend}>
            <span>{split.left}</span>
            <span>{split.right}</span>
          </div>
        </div>
      )}
      {delta && (
        <div className={s.kpiFoot}>
          <Pill tone={delta.tone} square>
            {delta.text}
          </Pill>
        </div>
      )}
    </div>
  );
}
