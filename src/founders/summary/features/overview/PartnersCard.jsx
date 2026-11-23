import { TabLink } from '@/founders/summary/lib/TabLink';
import Card from '@/founders/summary/components/ui/Card';
import CompanyMark from '@/founders/summary/components/ui/CompanyMark';
import StackedBar from '@/founders/summary/components/ui/StackedBar';
import Tile from '@/founders/summary/components/ui/Tile';
import { REQUEST_KINDS } from '@/founders/summary/domain/partners';
import { lakh, monthName, percent, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const REQUEST_LABELS = { ticket: 'Support tickets', scope: 'Scope approvals', visit: 'Office visits', tech: 'Tech team calls' };

export default function PartnersCard({ partners, payouts, now }) {
  const { counts, recruitment, attention, requests } = partners;
  const f = recruitment.funnel;
  const escalated = requests.filter((r) => r.escalated).length;

  const funnel = [
    { label: 'Contacted', value: f.contacted, note: `in ${monthName(now)}`, bg: 'var(--sunken)' },
    { label: 'Meetings', value: f.meeting, note: `${percent(f.meeting, f.contacted)}% of contacted`, bg: 'oklch(0.97 0.02 70)' },
    { label: 'Signed', value: f.signed, note: `${percent(f.signed, f.meeting)}% of meetings`, bg: 'var(--partners-tint)' },
    {
      label: 'Onboarding',
      value: f.onboarding,
      note: attention.signedNotOnboarding ? `${attention.signedNotOnboarding} signed, not started` : 'started',
      bg: 'var(--good-bg)',
    },
  ];

  const commission = [
    { label: 'Released', value: payouts.releasedTotal, color: 'oklch(0.55 0.12 150)' },
    { label: 'To pay', value: payouts.toPayTotal, color: 'oklch(0.62 0.17 40)' },
    { label: 'Client due', value: payouts.clientDueTotal, color: 'oklch(0.6 0.13 240)' },
    { label: 'Upcoming', value: payouts.upcomingTotal, color: 'oklch(0.84 0.03 265)' },
  ];
  const earned = commission.reduce((a, c) => a + c.value, 0);

  return (
    <Card
      lead={<CompanyMark company="partners" />}
      title="Partner portal"
      subtitle={`${counts.total} partners · ${counts.active} active`}
      actions={
        <TabLink to="/partners" className={`${u.btn} ${u.btnPartners}`}>
          View details
        </TabLink>
      }
    >
      <div className={p.block}>
        <div className={p.blockHead}>
          <h3 className={p.blockTitle}>Partner recruitment this month</h3>
          <span className={u.cardSub}>{percent(f.signed, f.contacted)}% contacted → signed</span>
        </div>
        <div className={p.tiles4}>
          {funnel.map((x) => (
            <Tile key={x.label} value={x.value} label={x.label} note={x.note} background={x.bg} />
          ))}
        </div>
      </div>

      <div className={p.block}>
        <div className={p.blockHead}>
          <h3 className={p.blockTitle}>Partner requests waiting</h3>
          <span className={u.cardSub}>
            {requests.length} open{escalated ? ` · ${escalated} escalated` : ''}
          </span>
        </div>
        <div className={p.tiles4}>
          {Object.keys(REQUEST_KINDS).map((k) => (
            <Tile key={k} outline value={requests.filter((r) => r.kind === k).length} label={REQUEST_LABELS[k]} />
          ))}
        </div>
      </div>

      <div className={p.block}>
        <div className={p.blockHead}>
          <h3 className={p.blockTitle}>Partner commission</h3>
          <span className={u.cardSub}>{lakh(earned)} earned to date</span>
        </div>
        <StackedBar segments={commission} height={12} />
        <div className={p.commissionLegend}>
          {commission.map((c) => (
            <div key={c.label} className={p.legendItem}>
              <span className={p.legendLabel}>
                <span aria-hidden="true" className={u.swatch} style={{ background: c.color }} />
                {c.label}
              </span>
              <span className={`${p.legendValue} num`}>{lakh(c.value)}</span>
            </div>
          ))}
        </div>
        <span className={p.foot}>
          {payouts.count ? `${plural(payouts.count, 'payout')} ready to pay · ${lakh(payouts.toPayTotal)}` : 'No commission owed right now'}
        </span>
      </div>
    </Card>
  );
}
