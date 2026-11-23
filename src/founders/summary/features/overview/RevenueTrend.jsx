import Card from '@/founders/summary/components/ui/Card';
import { dayMonth, lakh, lakhShort, percent } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const BAR_MAX_PX = 168;

/** Weekly revenue won, Mariox direct stacked under partner-sourced. */
export default function RevenueTrend({ weeks }) {
  const totals = weeks.map((w) => w.mariox + w.partners);
  const max = Math.max(1, ...totals);
  const sumM = weeks.reduce((a, w) => a + w.mariox, 0);
  const sumP = weeks.reduce((a, w) => a + w.partners, 0);
  const label = (w, i) => (i === weeks.length - 1 ? 'This week' : dayMonth(w.weekOf));

  return (
    <Card
      title={`Revenue won, last ${weeks.length} weeks`}
      subtitle={`${lakh(sumM + sumP)} total · partners brought ${percent(sumP, sumM + sumP)}%`}
      actions={
        <div className={p.legendInline}>
          <span>
            <span aria-hidden="true" className={u.swatch} style={{ background: 'var(--mariox)' }} />
            Mariox direct
          </span>
          <span>
            <span aria-hidden="true" className={u.swatch} style={{ background: 'var(--partners)' }} />
            Via partners
          </span>
        </div>
      }
    >
      <figure className={p.chart}>
        <div className={p.bars} aria-hidden="true">
          {weeks.map((w, i) => (
            <div key={w.weekOf} className={p.barCol} title={`Week of ${dayMonth(w.weekOf)}: Mariox ${lakh(w.mariox)}, partners ${lakh(w.partners)}`}>
              <span className={`${p.barVal} num`}>{lakhShort(totals[i])}</span>
              <div className={p.barP} style={{ height: (w.partners / max) * BAR_MAX_PX }} />
              <div className={p.barM} style={{ height: (w.mariox / max) * BAR_MAX_PX }} />
            </div>
          ))}
        </div>
        <div className={p.axis} aria-hidden="true">
          {weeks.map((w, i) => (
            <span key={w.weekOf}>{label(w, i)}</span>
          ))}
        </div>
        <figcaption className={p.caption}>Weekly revenue won, in lakh rupees. Hover a bar for the split.</figcaption>
        <table className="sr-only">
          <caption>Revenue won per week</caption>
          <thead>
            <tr>
              <th scope="col">Week</th>
              <th scope="col">Mariox direct</th>
              <th scope="col">Via partners</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w, i) => (
              <tr key={w.weekOf}>
                <th scope="row">{label(w, i)}</th>
                <td>{lakh(w.mariox)}</td>
                <td>{lakh(w.partners)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </Card>
  );
}
