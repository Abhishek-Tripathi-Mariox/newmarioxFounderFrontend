import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import MoreNote from '@/founders/summary/components/ui/MoreNote';
import { clock, dayMonth, monthName, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const STATUS_TONE = { Lead: 'flat', Meeting: 'info', 'Follow-up': 'warn', Converted: 'good', Onboarding: 'good', Rejected: 'bad' };

/** Partner recruitment: meetings and follow-ups due in the next 7 days. */
export function RecruitmentAgenda({ agenda }) {
  if (!agenda) return null;
  const overdue = agenda.list.filter((x) => x.overdue).length;
  return (
    <Card title="Recruitment: next 7 days" subtitle={`${plural(agenda.count, 'meeting or follow-up', 'meetings and follow-ups')}${overdue ? ` · ${overdue} overdue` : ''}`}>
      {agenda.list.length === 0 ? (
        <p className={p.empty}>No recruitment meetings or follow-ups in the next 7 days.</p>
      ) : (
        <div>
          {agenda.list.map((x) => (
            <div key={x.id} className={p.riskRow}>
              <div className={p.riskBody}>
                <span className={u.strong}>
                  {x.name}
                  {x.company ? ` · ${x.company}` : ''}
                </span>
                <span className={u.sub}>{[x.type, x.owner && `with ${x.owner}`].filter(Boolean).join(' · ')}</span>
              </div>
              <span className={u.sub}>{x.at ? (x.kind === 'meeting' ? `${dayMonth(x.at)}, ${clock(x.at)}` : dayMonth(x.at)) : '—'}</span>
              <Pill tone={x.overdue ? 'bad' : x.kind === 'meeting' ? 'info' : 'warn'}>{x.overdue ? 'Overdue' : x.kind === 'meeting' ? 'Meeting' : 'Follow-up'}</Pill>
            </div>
          ))}
        </div>
      )}
      <MoreNote shown={agenda.list.length} count={agenda.count} suffix="in partner recruitment" />
    </Card>
  );
}

/** Everyone first contacted this month in partner recruitment, newest first. */
export function RecruitmentRecent({ recent, now }) {
  if (!recent) return null;
  return (
    <Card title={`Contacted in ${monthName(now)}`} subtitle={`${plural(recent.count, 'prospective partner')} · newest first`}>
      {recent.list.length === 0 ? (
        <p className={p.empty}>Nobody contacted yet this month.</p>
      ) : (
        <div>
          {recent.list.map((x) => (
            <div key={x.id} className={p.riskRow}>
              <div className={p.riskBody}>
                <span className={u.strong}>
                  {x.name}
                  {x.company ? ` · ${x.company}` : ''}
                </span>
                <span className={u.sub}>{[x.owner || 'Unassigned', x.contactedAt && `contacted ${dayMonth(x.contactedAt)}`].filter(Boolean).join(' · ')}</span>
              </div>
              <Pill tone={STATUS_TONE[x.status] || 'flat'}>{x.status}</Pill>
            </div>
          ))}
        </div>
      )}
      <MoreNote shown={recent.list.length} count={recent.count} suffix="in partner recruitment" />
    </Card>
  );
}
