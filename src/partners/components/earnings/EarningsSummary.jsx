import { StatCard, Stats } from '@/partners/components/ui';
import { inr } from '@/partners/lib/format';

// Released / processing / future commission tiles, shared by partner earnings, dashboard and admin overview.
export function EarningsStats({ e, releasedHint = 'Paid to your bank', active, onPick, hrefFor, rateLabel = 'commission rate' }) {
  const link = (f) =>
    hrefFor ? { href: hrefFor(f) } : onPick ? { onClick: () => onPick(active === f ? 'All' : f), active: active === f } : {};
  return (
    <Stats>
      <StatCard
        icon="check" tone="good" label="Released" value={inr(e.released)} hint={`${releasedHint} · TDS ${inr(e.tds)}`}
        info={`Client payments Mariox has received AND paid your commission on. Amount × ${rateLabel}. TDS shown at 2%.`}
        {...link('Released')}
      />
      <StatCard
        icon="refresh" tone="warn" label="Processing" value={inr(e.processing)} hint="Client paid, payout in progress"
        info={`Client has paid Mariox, your payout is not released yet. Amount × ${rateLabel}.`}
        {...link('Processing')}
      />
      <StatCard
        icon="cal" tone="mute" label="Future" value={inr(e.future)} hint="Released as clients pay"
        info={`Commission on payments the client has not made yet (due or upcoming milestones). Amount × ${rateLabel}.`}
        {...link('Upcoming')}
      />
      <StatCard
        icon="wallet" tone="info" label="Total potential" value={inr(e.potential)} hint={`On ${inr(e.deal)} of deals`}
        info="Released + Processing + Future: everything you can earn on deals already closed."
        {...link('All')}
      />
    </Stats>
  );
}
