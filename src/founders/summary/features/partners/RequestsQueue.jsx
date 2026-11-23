import { useState } from 'react';
import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import Segmented from '@/founders/summary/components/ui/Segmented';
import { REQUEST_KINDS, REQUEST_STATUS_TONE, waitingDays } from '@/founders/summary/domain/partners';
import { clock, dayMonth, lakh, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';

function detailOf(r) {
  if (r.scheduledAt) return `${dayMonth(r.scheduledAt)}, ${clock(r.scheduledAt)} · ${r.where}`;
  if (r.amount) return `${lakh(r.amount)} submitted · ${r.detail}`;
  return r.detail;
}

/** Every open partner request, oldest first. */
export default function RequestsQueue({ requests, now }) {
  const [kind, setKind] = useState('all');
  const sorted = [...requests].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const rows = sorted.filter((r) => kind === 'all' || r.kind === kind);
  const tabs = [
    ['all', `All ${requests.length}`],
    ...Object.entries(REQUEST_KINDS).map(([k, v]) => [k, `${v.plural} ${requests.filter((r) => r.kind === k).length}`]),
  ];

  return (
    <Card
      title="Partner requests"
      subtitle={`Oldest first · ${plural(rows.length, 'request')}`}
      actions={<Segmented label="Request type" options={tabs} value={kind} onChange={setKind} />}
    >
      <div className={u.tableWrap}>
        <table className={u.table} style={{ minWidth: 820 }}>
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Request</th>
              <th scope="col">Partner</th>
              <th scope="col">Waiting</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const days = waitingDays(r, now);
              const kindInfo = REQUEST_KINDS[r.kind];
              return (
                <tr key={r.id}>
                  <td>
                    <Pill tone={kindInfo.tone} square>
                      {kindInfo.label}
                    </Pill>
                  </td>
                  <td>
                    <div className={u.stack}>
                      <span className={u.strong}>{r.title}</span>
                      <span className={u.sub}>{detailOf(r)}</span>
                    </div>
                  </td>
                  <td>{r.partner}</td>
                  <td className="num" style={days >= 3 ? { color: 'var(--bad-fg)', fontWeight: 600 } : undefined}>
                    {days === 0 ? 'Today' : plural(days, 'day')}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Pill tone={REQUEST_STATUS_TONE[r.status] || 'flat'}>{r.status}</Pill>
                    {r.escalated && (
                      <>
                        {' '}
                        <Pill tone="bad">Escalated</Pill>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
