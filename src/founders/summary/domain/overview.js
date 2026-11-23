import { prevMonth } from '@/founders/summary/lib/dates';
import { change, lakh, monthName, plural } from '@/founders/summary/lib/format';
import { pipelineTotals } from './mariox';
import { needsAttention } from './projects';

const split = (m, p) => ({
  segments: [
    { value: m, color: 'var(--mariox)' },
    { value: p, color: 'var(--partners)' },
  ],
  left: `Internal ${lakh(m)}`,
  right: `Partners ${lakh(p)}`,
});

const PERIOD_WORD = { today: 'today', week: 'this week' };

/** The six headline numbers on the overview for 'today' | 'week' | 'month'. */
export function overviewKpis({ period, mariox: m, partners: p, payouts, projects, now }) {
  const vs = period === 'month' ? `vs ${monthName(prevMonth(now))}` : 'vs last week';
  const mw = m.sales.won[period];
  const pw = p.won[period];
  const won = mw.value + pw.value;
  const deals = mw.deals + pw.deals;

  let wonSub;
  let wonDelta = null;
  if (period === 'today') {
    wonSub = deals ? `${plural(deals, 'deal')} won today${pw.note ? ` · ${pw.note}` : ''}` : 'No deals won yet today';
    if (pw.value && !mw.value) wonDelta = { text: 'Brought in by a partner', tone: 'good' };
  } else {
    wonSub = `${plural(deals, 'deal')} ${period === 'week' ? 'this week' : `in ${monthName(now)}`}`;
    wonDelta = change(won, (mw.prev || 0) + (pw.prev || 0), vs);
  }

  const mOpen = pipelineTotals(m.sales.stages);
  const openCount = mOpen.count + p.pipeline.open;
  const newDeals = period === 'month' ? null : m.sales.newDeals[period] + p.newDeals[period];

  const cash = m.cash ? m.cash[period] : null;
  const attention = projects.filter(needsAttention).length;
  const late = projects.filter((x) => x.health === 'Late').length;
  const t = m.team;

  return [
    { id: 'won', label: 'Revenue won', company: 'both', value: lakh(won), sub: wonSub, delta: wonDelta, split: split(mw.value, pw.value) },
    {
      id: 'pipeline',
      label: 'Open pipeline',
      company: 'both',
      value: lakh(mOpen.value + p.pipeline.value),
      sub: newDeals == null ? plural(openCount, 'open deal') : `${plural(openCount, 'open deal')} · ${newDeals} new ${PERIOD_WORD[period]}`,
      split: split(mOpen.value, p.pipeline.value),
    },
    cash
      ? {
          id: 'cash',
          label: 'Cash collected',
          company: 'both',
          value: lakh(cash.value),
          sub: period === 'month' ? `${lakh(m.cash.outstanding)} still to collect` : `${plural(cash.payments, 'client payment')} received`,
          delta: period === 'today' ? { text: `${lakh(m.cash.outstanding)} still to collect`, tone: 'flat' } : change(cash.value, cash.prev, vs),
        }
      : { id: 'cash', label: 'Cash collected', company: 'mariox', value: '—', sub: 'Client payments aren’t recorded in the internal portal yet' },
    {
      id: 'commission',
      label: 'Commission to pay',
      company: 'partners',
      value: lakh(payouts.toPayTotal),
      sub: payouts.count
        ? `${plural(payouts.count, 'payout')}, client already paid`
        : 'Nothing owed to partners right now',
      delta: payouts.soonDue.length ? { text: `${lakh(payouts.soonDueAmount)} client payments due in 7 days`, tone: 'flat' } : null,
    },
    { id: 'projects', label: 'Projects running', company: 'mariox', value: String(m.projects.running), sub: `${attention} need attention · ${late} late` },
    {
      id: 'team',
      label: 'Team in today',
      company: 'mariox',
      value: `${t.in} / ${t.size}`,
      sub: [`${t.onBreak} on break`, t.left ? `${t.left} left` : null, `${t.notIn} not checked in`].filter(Boolean).join(' · '),
      delta: t.late ? { text: `${t.late} came in after 10:30`, tone: 'flat' } : null,
    },
  ];
}

/** Weekly revenue won, both companies side by side. */
export function weeklyTrend(m, p) {
  const byWeek = new Map(p.weekly.map((w) => [w.weekOf, w.value]));
  return m.weekly.map((w) => ({ weekOf: w.weekOf, mariox: w.value, partners: byWeek.get(w.weekOf) || 0 }));
}
