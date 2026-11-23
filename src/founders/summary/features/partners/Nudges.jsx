import Card from '@/founders/summary/components/ui/Card';
import StackedBar from '@/founders/summary/components/ui/StackedBar';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const TONE = {
  bad: ['var(--bad-bg)', 'var(--bad-fg)'],
  warn: ['var(--warn-bg)', 'var(--warn-fg)'],
  info: ['var(--info-bg)', 'var(--info-fg)'],
  flat: ['var(--flat-bg)', 'var(--flat-fg)'],
};

/** Partners who need a follow-up from the partner team, plus the status mix of all partners. */
export default function Nudges({ partners }) {
  const a = partners.attention;
  const c = partners.counts;
  const nudges = [
    a.missingPayout && {
      n: a.missingPayout,
      tone: 'bad',
      title: 'Can’t be paid yet',
      sub: `PAN, GSTIN or bank details missing.${a.missingPayoutWithDue ? ` ${a.missingPayoutWithDue} of them have commission due this week.` : ''}`,
    },
    a.invitedNotSetUp && {
      n: a.invitedNotSetUp,
      tone: 'warn',
      title: 'Invited but never set a password',
      sub: `Oldest invite is ${a.oldestInviteDays} days old. Invite links expire after 7 days, so resend them.`,
    },
    a.noLead30d && { n: a.noLead30d, tone: 'flat', title: 'No new lead in 30 days', sub: 'Worth a call from the partner team.' },
    a.signedNotOnboarding && {
      n: a.signedNotOnboarding,
      tone: 'info',
      title: 'Signed, onboarding not started',
      sub: 'They converted in partner recruitment but onboarding hasn’t begun.',
    },
  ].filter(Boolean);

  const mix = [
    { label: 'Active', value: c.active, color: 'oklch(0.55 0.12 150)' },
    { label: 'Invited, not set up', value: c.invited, color: 'oklch(0.7 0.14 70)' },
    { label: 'Disabled', value: c.disabled, color: 'oklch(0.8 0.02 265)' },
  ];

  return (
    <Card title="Partners who need a nudge" subtitle={`${c.total} partners in total`}>
      <div>
        {nudges.length === 0 && <p className={p.empty}>Every partner is set up and active.</p>}
        {nudges.map((x) => (
          <div key={x.title} className={p.nudge}>
            <span className={`${p.nudgeNum} num`} style={{ background: TONE[x.tone][0], color: TONE[x.tone][1] }}>
              {x.n}
            </span>
            <div className={u.stack} style={{ gap: 3 }}>
              <span className={u.strong} style={{ fontSize: 14 }}>
                {x.title}
              </span>
              <span className={u.sub}>{x.sub}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={p.panel}>
        <span className={p.panelTitle}>Partner status</span>
        <StackedBar segments={mix} height={10} />
        <div className={p.statusLegend}>
          {mix.map((m) => (
            <span key={m.label}>
              <span aria-hidden="true" className={u.swatch} style={{ background: m.color }} />
              {m.label} {m.value}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
