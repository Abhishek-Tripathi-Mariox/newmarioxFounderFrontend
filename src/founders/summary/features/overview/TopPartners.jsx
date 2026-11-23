import { TabLink } from '@/founders/summary/lib/TabLink';
import Card from '@/founders/summary/components/ui/Card';
import { daysBetween } from '@/founders/summary/lib/dates';
import { daysAgo, inr, lakh } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';

export default function TopPartners({ partners, payouts, now }) {
  const dueByCode = new Map();
  for (const r of payouts.toPay) dueByCode.set(r.code, (dueByCode.get(r.code) || 0) + r.commission);
  const rows = [...partners.topPartners].sort((a, b) => b.won - a.won);

  return (
    <Card
      title="Top partners this month"
      subtitle="By revenue won"
      actions={
        <TabLink to="/partners" className={`${u.btn} ${u.btnOutline}`}>
          All partner activity
        </TabLink>
      }
    >
      <div className={u.tableWrap}>
        <table className={u.table} style={{ minWidth: 720 }}>
          <thead>
            <tr>
              <th scope="col">Partner</th>
              <th scope="col">Code</th>
              <th scope="col" className={u.right}>Open leads</th>
              <th scope="col" className={u.right}>Won</th>
              <th scope="col" className={u.right}>Commission to pay</th>
              <th scope="col">Last lead</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code}>
                <td>
                  <div className={u.stack}>
                    <span className={u.strong}>{r.name}</span>
                    <span className={u.sub}>{r.company}</span>
                  </div>
                </td>
                <td className="num" style={{ color: 'var(--muted-2)' }}>
                  {r.code}
                </td>
                <td className={`${u.right} num`}>{r.openLeads}</td>
                <td className={`${u.right} ${u.strong} num`}>{lakh(r.won)}</td>
                <td className={`${u.right} num`}>{dueByCode.get(r.code) ? inr(dueByCode.get(r.code)) : '—'}</td>
                <td style={{ color: 'var(--muted-2)' }}>{r.lastLeadAt ? daysAgo(daysBetween(r.lastLeadAt, now)) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
