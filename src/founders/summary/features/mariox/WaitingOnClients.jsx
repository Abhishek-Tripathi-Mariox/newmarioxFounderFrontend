import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import MoreNote from '@/founders/summary/components/ui/MoreNote';
import { daysBetween } from '@/founders/summary/lib/dates';
import { dayMonth, lakh, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const waited = (from, now) => {
  const days = from ? daysBetween(from, now) : null;
  return days == null ? '—' : days <= 0 ? 'Today' : plural(days, 'day');
};

/** Change requests sent to clients and quotes the client hasn't answered yet. */
export default function WaitingOnClients({ changeRequests, quotes, now }) {
  const crs = changeRequests.list;
  const q = quotes?.waiting;
  if (!crs && !q?.list) return null;
  return (
    <Card
      title="Waiting on clients"
      subtitle={[`${plural(changeRequests.waitingOnClient, 'change request')} · ${lakh(changeRequests.value)}`, q && `${plural(q.count, 'quote')} · ${lakh(q.value)}`]
        .filter(Boolean)
        .join(' · ')}
    >
      {crs && (
        <div className={p.block}>
          <h3 className={p.blockTitle}>Change requests</h3>
          {crs.length === 0 ? (
            <p className={p.empty}>No change request is waiting on a client.</p>
          ) : (
            <div>
              {crs.map((c) => (
                <div key={c.id} className={p.riskRow}>
                  <div className={p.riskBody}>
                    <span className={u.strong}>{c.title}</span>
                    <span className={u.sub}>
                      {c.projectName} · {c.id} · sent {c.sentAt ? dayMonth(c.sentAt) : '—'}
                    </span>
                  </div>
                  <div className={p.rowEnd}>
                    <span className={`${u.strong} num`}>{lakh(c.amount)}</span>
                    <span className={u.sub}>waiting {waited(c.sentAt, now)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <MoreNote shown={crs.length} count={changeRequests.waitingOnClient} suffix="in the internal portal" />
        </div>
      )}
      {q?.list && (
        <div className={p.block}>
          <h3 className={p.blockTitle}>Quotes</h3>
          {q.list.length === 0 ? (
            <p className={p.empty}>No quote is waiting on a client.</p>
          ) : (
            <div>
              {q.list.map((x) => (
                <div key={x.id} className={p.riskRow}>
                  <div className={p.riskBody}>
                    <span className={u.strong}>{x.company}</span>
                    <span className={u.sub}>
                      {[x.id, x.sentAt && `sent ${dayMonth(x.sentAt)}`, x.viewedAt && `viewed ${dayMonth(x.viewedAt)}`].filter(Boolean).join(' · ')}
                    </span>
                  </div>
                  <Pill tone={x.status === 'Viewed' ? 'info' : 'flat'}>{x.status}</Pill>
                  <div className={p.rowEnd}>
                    <span className={`${u.strong} num`}>{lakh(x.total || x.amount)}</span>
                    <span className={u.sub}>waiting {waited(x.sentAt, now)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <MoreNote shown={q.list.length} count={q.count} suffix="in the internal portal" />
        </div>
      )}
    </Card>
  );
}
