import { useState } from 'react';
import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import Segmented from '@/founders/summary/components/ui/Segmented';
import { dayMonth, inr, lakh, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const TABS = [
  ['toPay', 'To pay'],
  ['clientDue', 'Client payment due'],
  ['released', 'Released'],
];

function tabConfig(tab, payouts) {
  if (tab === 'clientDue') {
    return {
      rows: payouts.clientDue,
      note: `${plural(payouts.clientDue.length, 'client payment')} due · ${lakh(payouts.clientDueTotal)} commission once paid`,
      status: ['Client payment due', 'warn'],
      dateHead: 'Client pays by',
      date: (r) => (r.dueOn ? dayMonth(r.dueOn) : '—'),
      foot: 'Commission becomes payable once the client pays.',
      empty: 'No client payments due.',
    };
  }
  if (tab === 'released') {
    return {
      rows: payouts.released,
      note: `${lakh(payouts.releasedTotal)} released to partners so far`,
      status: ['Released', 'good'],
      dateHead: 'Released',
      date: (r) => [r.releasedOn ? dayMonth(r.releasedOn) : null, r.utr ? `UTR ${r.utr}` : null].filter(Boolean).join(' · ') || '—',
      foot: payouts.released.length ? `Showing the ${plural(payouts.released.length, 'most recent payout')}.` : '',
      empty: 'Nothing released yet.',
    };
  }
  return {
    rows: payouts.toPay,
    note: payouts.count ? `${plural(payouts.count, 'payout')} · ${inr(payouts.toPayTotal)} owed to partners` : 'Nothing owed to partners right now',
    status: ['To pay', 'bad'],
    dateHead: 'Payment due date',
    date: (r) => (r.dueOn ? dayMonth(r.dueOn) : '—'),
    foot: 'The client has paid these. Partners missing PAN or bank details can’t be paid until they add them.',
    empty: 'Nothing to pay right now.',
  };
}

export default function Payouts({ payouts }) {
  const [tab, setTab] = useState('toPay');
  const cfg = tabConfig(tab, payouts);

  return (
    <Card title="Commission payouts" subtitle={cfg.note} actions={<Segmented label="Payout status" options={TABS} value={tab} onChange={setTab} />}>
      <div className={u.tableWrap}>
        <table className={u.table} style={{ minWidth: 780 }}>
          <thead>
            <tr>
              <th scope="col">Partner</th>
              <th scope="col">Client payment</th>
              <th scope="col" className={u.right}>Payment</th>
              <th scope="col" className={u.right}>Commission</th>
              <th scope="col">Status</th>
              <th scope="col">{cfg.dateHead}</th>
            </tr>
          </thead>
          <tbody>
            {cfg.rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className={u.stack}>
                    <span className={u.strong}>{r.partner}</span>
                    <span className={u.sub}>{[r.company, r.code].filter(Boolean).join(' · ')}</span>
                  </div>
                </td>
                <td>
                  {r.client} · {r.label}
                </td>
                <td className={`${u.right} num`}>{inr(r.amount)}</td>
                <td className={`${u.right} ${u.strong} num`}>{inr(r.commission)}</td>
                <td>
                  <Pill tone={cfg.status[1]}>{cfg.status[0]}</Pill>
                </td>
                <td style={{ color: 'var(--muted-2)' }}>{cfg.date(r)}</td>
              </tr>
            ))}
            {cfg.rows.length === 0 && (
              <tr>
                <td colSpan={6} className={u.sub}>
                  {cfg.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {cfg.foot && <span className={p.foot}>{cfg.foot}</span>}
    </Card>
  );
}
