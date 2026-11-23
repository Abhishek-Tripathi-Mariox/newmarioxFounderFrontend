import Card from '@/founders/summary/components/ui/Card';
import Avatar from '@/founders/summary/components/ui/Avatar';
import BarList from '@/founders/summary/components/ui/BarList';
import Pill from '@/founders/summary/components/ui/Pill';
import MoreNote from '@/founders/summary/components/ui/MoreNote';
import { dayMonth, lakh, monthName, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

/** Leads created in the last 7 days, and this month's leads per source. */
export default function NewLeadsCard({ sales, now }) {
  const leads = sales.newLeads;
  if (!leads) return null;
  const sources = sales.sourcesMonth || [];
  return (
    <Card title="New leads, last 7 days" subtitle={`${plural(leads.count, 'lead')} · ${lakh(leads.value)} pipeline added`}>
      <div className={u.tableWrap}>
        <table className={u.table} style={{ minWidth: 440 }}>
          <thead>
            <tr>
              <th scope="col">Company</th>
              <th scope="col">Owner</th>
              <th scope="col" className={u.right}>Value</th>
              <th scope="col">Stage</th>
            </tr>
          </thead>
          <tbody>
            {leads.list.map((l) => (
              <tr key={l.id}>
                <td>
                  <div className={u.stack}>
                    <span className={u.strong}>{l.company}</span>
                    <span className={u.sub}>
                      {l.source} · {dayMonth(l.createdAt)}
                    </span>
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <span className={p.owner}>
                    <Avatar name={l.owner} hue={l.hue} size={24} />
                    {l.owner}
                  </span>
                </td>
                <td className={`${u.right} num`} style={{ whiteSpace: 'nowrap' }}>
                  {lakh(l.value)}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Pill tone={l.stage === 'Won' ? 'good' : l.stage === 'Lost' ? 'bad' : 'flat'}>{l.stage}</Pill>
                </td>
              </tr>
            ))}
            {leads.list.length === 0 && (
              <tr>
                <td colSpan={4} className={u.sub}>
                  No new leads in the last 7 days.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <MoreNote shown={leads.list.length} count={leads.count} suffix="in the internal portal" />
      <div className={p.block}>
        <h3 className={p.blockTitle}>Lead sources, {monthName(now)}</h3>
        {sources.length === 0 ? (
          <p className={p.empty}>No leads yet this month.</p>
        ) : (
          <BarList
            labelWidth={120}
            valueWidth={40}
            color="var(--mariox)"
            rows={sources.map((x) => ({ key: x.source, label: x.source, value: x.count, right: String(x.count) }))}
          />
        )}
      </div>
    </Card>
  );
}
