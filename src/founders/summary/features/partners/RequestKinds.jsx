import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import { REQUEST_KINDS, REQUEST_STATUS_TONE } from '@/founders/summary/domain/partners';
import { daysBetween } from '@/founders/summary/lib/dates';
import { clock, dayMonth, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const TITLES = { scope: 'Scope approvals', visit: 'Office visits', tech: 'Technical team', ticket: 'Support tickets' };

/** Open partner requests per kind, with the latest few of each. */
export default function RequestKinds({ kinds, now }) {
  if (!kinds) return null;
  const open = kinds.reduce((a, k) => a + k.open, 0);
  return (
    <Card title="Requests by kind" subtitle={`${plural(open, 'open request')} waiting on Mariox · latest first`}>
      <div className={p.cols4}>
        {kinds.map((k) => {
          const info = REQUEST_KINDS[k.kind] || { label: k.kind, tone: 'flat' };
          const waiting = k.oldestAt ? daysBetween(k.oldestAt, now) : 0;
          return (
            <div key={k.kind} className={p.box}>
              <div className={p.boxHead}>
                <span className={u.strong}>{TITLES[k.kind] || info.label}</span>
                <Pill tone={info.tone} square>
                  {info.label}
                </Pill>
              </div>
              <span className={`${p.boxNum} num`} style={k.open ? undefined : { color: 'var(--muted)' }}>
                {k.open}
              </span>
              <span className={u.sub}>
                {k.open ? [`oldest waiting ${waiting <= 0 ? 'since today' : plural(waiting, 'day')}`, k.escalated ? `${k.escalated} escalated` : null].filter(Boolean).join(' · ') : 'Nothing open'}
              </span>
              {k.latest.map((r) => (
                <div key={r.id} className={p.miniRow}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.title}</span>
                  <span className={u.sub}>
                    {[r.partner, r.scheduledAt ? `${dayMonth(r.scheduledAt)}, ${clock(r.scheduledAt)}` : `raised ${dayMonth(r.createdAt)}`].join(' · ')}{' '}
                    <Pill tone={REQUEST_STATUS_TONE[r.status] || 'flat'}>{r.status}</Pill>
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
