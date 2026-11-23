import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import MoreNote from '@/founders/summary/components/ui/MoreNote';
import { daysBetween } from '@/founders/summary/lib/dates';
import { dayMonth } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const STATUS_TONE = { 'Not started': 'flat', 'In progress': 'info', 'In review': 'violet' };

function MilestoneRows({ block, now, empty, overdue }) {
  if (block.list.length === 0) return <p className={p.empty}>{empty}</p>;
  return (
    <div>
      {block.list.map((m) => {
        const days = daysBetween(now, m.due);
        return (
          <div key={m.id} className={p.riskRow}>
            <div className={p.riskBody}>
              <span className={u.strong}>
                {m.projectName} · M{m.n} {m.name}
              </span>
              <span className={u.sub}>
                {m.projectId} · {m.client} · due {dayMonth(m.due)}
              </span>
            </div>
            <span className={p.pills}>
              <Pill tone={STATUS_TONE[m.status] || 'flat'}>{m.status}</Pill>
              {m.approvalPending && <Pill tone="warn">Approval pending</Pill>}
              <Pill tone={overdue ? 'bad' : days <= 1 ? 'warn' : 'flat'}>
                {overdue ? `${-days}d late` : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days}d`}
              </Pill>
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Milestones of running projects that are overdue or due in the next 7 days. */
export default function MilestonesCard({ milestones, now }) {
  if (!milestones) return null;
  const { overdue, dueSoon } = milestones;
  return (
    <Card title="Milestones" subtitle={`${overdue.count} overdue · ${dueSoon.count} due in the next 7 days`}>
      <div className={p.block}>
        <h3 className={p.blockTitle}>Overdue</h3>
        <MilestoneRows block={overdue} now={now} overdue empty="No milestone is overdue." />
        <MoreNote shown={overdue.list.length} count={overdue.count} suffix="overdue" />
      </div>
      <div className={p.block}>
        <h3 className={p.blockTitle}>Due in the next 7 days</h3>
        <MilestoneRows block={dueSoon} now={now} empty="Nothing due in the next 7 days." />
        <MoreNote shown={dueSoon.list.length} count={dueSoon.count} suffix="due this week" />
      </div>
    </Card>
  );
}
