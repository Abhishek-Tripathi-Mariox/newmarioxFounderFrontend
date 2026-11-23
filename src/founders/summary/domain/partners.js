import { daysBetween, hoursBetween, prevMonth } from '@/founders/summary/lib/dates';
import { change, lakh, monthName, plural } from '@/founders/summary/lib/format';

const sumOf = (rows, key = 'commission') => rows.reduce((a, r) => a + (r[key] || 0), 0);

export const REQUEST_KINDS = {
  ticket: { label: 'Ticket', plural: 'Tickets', tone: 'violet' },
  scope: { label: 'Scope', plural: 'Scopes', tone: 'warn' },
  visit: { label: 'Office visit', plural: 'Visits', tone: 'info' },
  tech: { label: 'Tech call', plural: 'Tech calls', tone: 'good' },
};

export const REQUEST_STATUS_TONE = { Requested: 'flat', Assigned: 'info', 'In review': 'warn', Rescheduled: 'warn', Confirmed: 'good' };

export const waitingDays = (r, now) => Math.max(0, daysBetween(r.createdAt, now));
export const waitingHours = (r, now) => hoursBetween(r.createdAt, now);

/**
 * Commission totals. Each row carries its own `commission` (payment × that project's rate);
 * `partners.rate` is only a fallback for rows without one.
 *   toPay     client has paid, partner not paid yet  → owed now
 *   clientDue client payment is due                   → commission follows when the client pays
 *   released  paid out
 */
export function payoutSummary(partners, now) {
  const { rate = 0, commission: c } = partners;
  const fill = (rows = []) => rows.map((r) => ({ ...r, commission: r.commission ?? Math.round((r.amount || 0) * rate) }));
  const byDue = (a, b) => new Date(a.dueOn || 8.64e15) - new Date(b.dueOn || 8.64e15);
  const toPay = fill(c.toPay).sort(byDue);
  const clientDue = fill(c.clientDue).sort(byDue);
  const released = fill(c.recentReleased);
  const soonDue = clientDue.filter((r) => r.dueOn && daysBetween(now, r.dueOn) <= 7);
  return {
    toPay,
    clientDue,
    released,
    toPayTotal: sumOf(toPay),
    count: toPay.length,
    clientDueTotal: sumOf(clientDue),
    soonDue,
    soonDueAmount: sumOf(soonDue, 'amount'),
    releasedTotal: c.released || 0,
    upcomingTotal: c.upcoming || 0,
  };
}

export function partnerKpis(pt, payouts, now) {
  const c = pt.counts;
  const escalated = pt.requests.filter((r) => r.escalated).length;
  const won = pt.won.month;
  return [
    { id: 'active', label: 'Active partners', value: String(c.active), sub: `of ${c.total} · ${c.invited} invited, not set up` },
    { id: 'pipeline', label: 'Partner pipeline', value: lakh(pt.pipeline.value), sub: plural(pt.pipeline.open, 'open deal') },
    { id: 'won', label: 'Won via partners', value: lakh(won.value), sub: `${plural(won.deals, 'deal')} in ${monthName(now)}`, delta: change(won.value, won.prev, `vs ${monthName(prevMonth(now))}`) },
    {
      id: 'topay',
      label: 'Commission to pay',
      value: lakh(payouts.toPayTotal),
      sub: payouts.count ? `${plural(payouts.count, 'payout')} · client already paid` : 'Nothing owed right now',
      valueColor: payouts.toPayTotal ? 'var(--red)' : undefined,
    },
    { id: 'requests', label: 'Open requests', value: String(pt.requests.length), sub: escalated ? plural(escalated, 'escalated ticket') : 'None escalated' },
    { id: 'signed', label: 'New partners', value: String(pt.recruitment.funnel.signed), sub: `signed in ${monthName(now)}` },
  ];
}
