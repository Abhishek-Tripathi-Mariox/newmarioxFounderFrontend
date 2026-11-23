import Card from '@/founders/summary/components/ui/Card';
import Avatar from '@/founders/summary/components/ui/Avatar';
import Pill from '@/founders/summary/components/ui/Pill';
import MoreNote from '@/founders/summary/components/ui/MoreNote';
import { daysBetween } from '@/founders/summary/lib/dates';
import { clock, dayMonth } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

/** Open sales follow-ups that are overdue or due today, earliest first. */
export default function FollowUpsCard({ followUps, now }) {
  const due = followUps?.due;
  if (!due) return null;
  const today = due.count - due.overdue;
  return (
    <Card title="Follow-ups" subtitle={`${due.overdue} overdue · ${today} still due today`}>
      {due.list.length === 0 ? (
        <p className={p.empty}>No follow-ups overdue or due today.</p>
      ) : (
        <div>
          {due.list.map((f) => {
            const late = daysBetween(f.dueAt, now);
            return (
              <div key={f.id} className={p.riskRow}>
                <Avatar name={f.owner} hue={f.hue} />
                <div className={p.riskBody}>
                  <span className={u.strong}>{f.company || f.title}</span>
                  <span className={u.sub}>{[f.type, f.company ? f.title : null, f.owner].filter(Boolean).join(' · ')}</span>
                </div>
                <span className={`${u.sub} num`}>{late > 0 ? `${dayMonth(f.dueAt)}, ${clock(f.dueAt)}` : clock(f.dueAt)}</span>
                <Pill tone={f.overdue ? 'bad' : 'warn'}>{f.overdue ? (late > 0 ? `${late}d overdue` : 'Overdue') : 'Today'}</Pill>
              </div>
            );
          })}
        </div>
      )}
      <MoreNote shown={due.list.length} count={due.count} suffix="in the internal portal" />
    </Card>
  );
}
