import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import Tile from '@/founders/summary/components/ui/Tile';
import { dayMonth } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const PRIORITY_TONE = { High: 'bad', Medium: 'warn', Low: 'flat' };

/** Tasks assigned to the team in the internal portal (Team tasks). */
export default function TeamTasksCard({ tasks }) {
  if (!tasks) return null;
  const list = tasks.overdueList || [];
  return (
    <Card title="Team tasks" subtitle="Tasks assigned to people in the internal portal">
      <div className={p.tiles3}>
        <Tile value={tasks.open} label="Open" />
        <Tile value={tasks.overdue} label="Overdue" alert={tasks.overdue > 0} />
        <Tile value={tasks.doneWeek} label="Done this week" />
      </div>
      <div className={p.block}>
        <h3 className={p.blockTitle}>Overdue</h3>
        {list.length === 0 ? (
          <p className={p.empty}>Nothing overdue.</p>
        ) : (
          <div>
            {list.map((t) => (
              <div key={t.id} className={p.riskRow}>
                <div className={p.riskBody}>
                  <span className={u.strong}>{t.title}</span>
                  <span className={u.sub}>
                    {t.assignee} · due {t.due ? dayMonth(t.due) : '—'}
                  </span>
                </div>
                <Pill tone={PRIORITY_TONE[t.priority] || 'flat'}>{t.priority}</Pill>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
