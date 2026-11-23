import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import Tile from '@/founders/summary/components/ui/Tile';
import { daysBetween } from '@/founders/summary/lib/dates';
import { plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const SEVERITIES = ['Critical', 'Major', 'Minor', 'Trivial'];

/** Open bugs by severity and every open critical bug with its age. */
export default function BugsCard({ bugs, now }) {
  if (!bugs.bySeverity) return null;
  const critical = bugs.critical || [];
  return (
    <Card title="Bugs" subtitle={`${bugs.open} open across all projects`}>
      <div className={p.tiles4}>
        {SEVERITIES.map((s) => (
          <Tile key={s} value={bugs.bySeverity[s] || 0} label={s} alert={s === 'Critical' && bugs.bySeverity[s] > 0} />
        ))}
      </div>
      <div className={p.block}>
        <h3 className={p.blockTitle}>Critical, oldest first</h3>
        {critical.length === 0 ? (
          <p className={p.empty}>No critical bugs open.</p>
        ) : (
          <div>
            {critical.slice(0, 10).map((b) => {
              const days = daysBetween(b.openedAt, now);
              return (
                <div key={b.id} className={p.riskRow}>
                  <span className={p.code}>{b.id}</span>
                  <div className={p.riskBody}>
                    <span className={u.strong}>{b.title || b.projectName}</span>
                    <span className={u.sub}>
                      {b.projectName} · {b.projectId}
                    </span>
                  </div>
                  <Pill tone={days >= 2 ? 'bad' : 'warn'}>{days <= 0 ? 'Opened today' : `Open ${plural(days, 'day')}`}</Pill>
                </div>
              );
            })}
          </div>
        )}
        {critical.length > 10 && <span className={p.foot}>+{critical.length - 10} more critical bugs</span>}
      </div>
    </Card>
  );
}
