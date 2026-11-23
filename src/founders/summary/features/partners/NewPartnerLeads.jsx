import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import MoreNote from '@/founders/summary/components/ui/MoreNote';
import { daysBetween } from '@/founders/summary/lib/dates';
import { daysAgo, lakh, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

/** Partner leads created in the last 7 days, newest first. */
export default function NewPartnerLeads({ leads, now }) {
  if (!leads) return null;
  return (
    <Card title="New partner leads, last 7 days" subtitle={`${plural(leads.count, 'lead')} · ${lakh(leads.value)}`}>
      {leads.list.length === 0 ? (
        <p className={p.empty}>No new partner leads in the last 7 days.</p>
      ) : (
        <div>
          {leads.list.map((l) => (
            <div key={l.id} className={p.riskRow}>
              <div className={p.riskBody}>
                <span className={u.strong}>{l.company}</span>
                <span className={u.sub}>
                  {l.partner} · {daysAgo(daysBetween(l.createdAt, now))}
                </span>
              </div>
              <Pill tone={l.stage === 'won' ? 'good' : l.stage === 'lost' ? 'bad' : 'flat'}>{l.stageName}</Pill>
              <span className={`${u.strong} num`} style={{ minWidth: 72, textAlign: 'right' }}>
                {lakh(l.value)}
              </span>
            </div>
          ))}
        </div>
      )}
      <MoreNote shown={leads.list.length} count={leads.count} suffix="in the partner portal" />
    </Card>
  );
}
