import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import Tile from '@/founders/summary/components/ui/Tile';
import MoreNote from '@/founders/summary/components/ui/MoreNote';
import { dayMonth, inr, lakh, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

function PayoutRows({ block, empty, hold }) {
  if (block.list.length === 0) return <p className={p.empty}>{empty}</p>;
  return (
    <div>
      {block.list.map((r) => (
        <div key={r.id} className={p.riskRow}>
          <div className={p.riskBody}>
            <span className={u.strong}>{r.partner}</span>
            <span className={u.sub}>
              {[r.client, r.project, r.milestone].filter(Boolean).join(' · ')}
              {r.clientPaidOn ? ` · client payment ${dayMonth(r.clientPaidOn)}` : ''}
            </span>
          </div>
          {hold && <Pill tone="bad">{r.reason}</Pill>}
          <div className={p.rowEnd}>
            <span className={`${u.strong} num`}>{inr(r.commission)}</span>
            <span className={u.sub}>of {inr(r.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Commission the client has already paid for: ready to release, or on hold (and why). */
export default function PayoutsDue({ payouts }) {
  if (!payouts) return null;
  const { payable, onHold } = payouts;
  return (
    <Card title="Payouts due" subtitle="Client has paid · commission not released yet">
      <div className={p.tiles3} style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <Tile value={lakh(payable.total)} label="Ready to pay" note={plural(payable.count, 'payout')} />
        <Tile value={lakh(onHold.total)} label="On hold" note={plural(onHold.count, 'payout')} alert={onHold.count > 0} />
      </div>
      <div className={p.block}>
        <h3 className={p.blockTitle}>Ready to pay</h3>
        <PayoutRows block={payable} empty="Nothing ready to pay." />
        <MoreNote shown={payable.list.length} count={payable.count} suffix="ready to pay" />
      </div>
      <div className={p.block}>
        <h3 className={p.blockTitle}>On hold</h3>
        <PayoutRows block={onHold} hold empty="No payout is on hold." />
        <MoreNote shown={onHold.list.length} count={onHold.count} suffix="on hold" />
      </div>
    </Card>
  );
}
