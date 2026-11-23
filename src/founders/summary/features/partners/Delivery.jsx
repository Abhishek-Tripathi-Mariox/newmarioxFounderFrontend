import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import Tile from '@/founders/summary/components/ui/Tile';
import { dayMonth, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

/** Partner deals Mariox is delivering, by delivery stage, and the ones still in progress. */
export default function Delivery({ delivery }) {
  if (!delivery) return null;
  const list = delivery.list || [];
  return (
    <Card title="Partner deals in delivery" subtitle={plural(delivery.projects, 'project')}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${delivery.stages.length}, minmax(0, 1fr))`, gap: 8 }}>
        {delivery.stages.map((s) => (
          <Tile key={s.name} outline value={s.count} label={s.name} />
        ))}
      </div>
      <div className={p.block}>
        <h3 className={p.blockTitle}>In progress</h3>
        {list.length === 0 ? (
          <p className={p.empty}>No partner projects in progress.</p>
        ) : (
          <div>
            {list.map((x, i) => (
              <div key={`${x.client}-${i}`} className={p.riskRow}>
                <div className={p.riskBody}>
                  <span className={u.strong}>
                    {x.client}
                    {x.title ? ` · ${x.title}` : ''}
                  </span>
                  <span className={u.sub}>{[x.partner, x.update, x.nextDate ? `next stage ${dayMonth(x.nextDate)}` : null].filter(Boolean).join(' · ')}</span>
                </div>
                <Pill tone="info">{x.stage}</Pill>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
