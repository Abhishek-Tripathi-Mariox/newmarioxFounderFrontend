import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import MoreNote from '@/founders/summary/components/ui/MoreNote';
import { daysBetween } from '@/founders/summary/lib/dates';
import { daysAgo, lakh } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';

const STATUS = { invited: ['Invited', 'warn'], disabled: ['Disabled', 'flat'] };

/** Every partner with leads, wins, commission and last activity (most recently active first). */
export default function PartnersTable({ roster, now }) {
  if (!roster) return null;
  const missing = roster.list.filter((x) => x.payoutDetailsMissing).length;
  return (
    <Card
      title="Partners"
      subtitle={`Most recently active first · showing ${roster.list.length} of ${roster.count}${missing ? ` · ${missing} shown missing payout details` : ''}`}
    >
      <div className={u.tableWrap}>
        <table className={u.table} style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th scope="col">Partner</th>
              <th scope="col" className={u.right}>Leads</th>
              <th scope="col" className={u.right}>Open</th>
              <th scope="col" className={u.right}>Won</th>
              <th scope="col" className={u.right}>Won value</th>
              <th scope="col" className={u.right}>Payable</th>
              <th scope="col" className={u.right}>Paid</th>
              <th scope="col">Last activity</th>
              <th scope="col">Payout details</th>
            </tr>
          </thead>
          <tbody>
            {roster.list.map((x) => {
              const status = STATUS[x.status];
              return (
                <tr key={x.id}>
                  <td>
                    <div className={u.stack}>
                      <span className={u.strong}>
                        {x.name}
                        {status && (
                          <>
                            {' '}
                            <Pill tone={status[1]}>{status[0]}</Pill>
                          </>
                        )}
                      </span>
                      <span className={u.sub}>{[x.company, x.code].filter(Boolean).join(' · ') || '—'}</span>
                    </div>
                  </td>
                  <td className={`${u.right} num`}>{x.leads}</td>
                  <td className={`${u.right} num`}>{x.openLeads}</td>
                  <td className={`${u.right} num`}>{x.wonLeads}</td>
                  <td className={`${u.right} ${u.strong} num`}>{lakh(x.wonValue)}</td>
                  <td className={`${u.right} num`} style={x.commissionPayable ? { color: 'var(--bad-fg)', fontWeight: 600 } : undefined}>
                    {lakh(x.commissionPayable)}
                  </td>
                  <td className={`${u.right} num`}>{lakh(x.commissionPaid)}</td>
                  <td style={{ color: 'var(--muted-2)', whiteSpace: 'nowrap' }}>{x.lastActivityAt ? daysAgo(daysBetween(x.lastActivityAt, now)) : '—'}</td>
                  <td>{x.payoutDetailsMissing ? <Pill tone="bad">Missing</Pill> : <Pill tone="good">Complete</Pill>}</td>
                </tr>
              );
            })}
            {roster.list.length === 0 && (
              <tr>
                <td colSpan={9} className={u.sub}>
                  No partners yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <MoreNote shown={roster.list.length} count={roster.count} suffix="partners in the partner portal" />
    </Card>
  );
}
