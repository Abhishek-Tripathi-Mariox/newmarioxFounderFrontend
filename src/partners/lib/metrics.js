import { TDS_RATE } from './constants';
import { LOST, WON, isOpen } from './pipeline';

// Pure functions, safe to use on server and client.

// The rate for one project: its own locked rate, else the partner's current rate, else the fallback.
export const projectRate = (pr, fallback) =>
  pr.commissionRate ?? (typeof pr.owner === 'object' && pr.owner?.commissionRate != null ? pr.owner.commissionRate : fallback);

export function commissionState(p) {
  if (p.status === 'received') return p.releasedAt ? 'released' : 'processing';
  return p.status === 'due' ? 'due' : 'upcoming';
}

export function earnings(projects, fallbackRate) {
  let deal = 0, received = 0, released = 0, processing = 0, future = 0;
  const ledger = [];

  for (const pr of projects) {
    const rate = projectRate(pr, fallbackRate);
    deal += pr.deal || 0;
    for (const p of pr.payments || []) {
      const commission = p.amount * rate;
      const state = commissionState(p);
      if (p.status === 'received') received += p.amount;
      if (state === 'released') released += commission;
      else if (state === 'processing') processing += commission;
      else future += commission;
      ledger.push({ ...p, commission, state, client: pr.client, projectId: pr._id });
    }
  }
  ledger.sort((a, b) => ((a.due || '') < (b.due || '') ? -1 : 1));
  const potential = released + processing + future;
  return { deal, received, released, processing, future, potential, tds: released * TDS_RATE, ledger };
}

// Pipeline numbers. Expected commission = value of WON leads × commission rate
// (rate per lead, so admin totals respect each partner's own rate). No probability-based forecast.
export function pipeline(leads, rate) {
  const rateOf = typeof rate === 'function' ? rate : () => rate;
  const open = leads.filter(l => isOpen(l.stage));
  const won = leads.filter(l => l.stage === WON);
  const lost = leads.filter(l => l.stage === LOST);
  const closed = won.length + lost.length;
  return {
    open: open.length,
    openValue: open.reduce((a, l) => a + l.value, 0),
    won: won.length,
    wonValue: won.reduce((a, l) => a + l.value, 0),
    expected: won.reduce((a, l) => a + l.value * rateOf(l), 0),
    lost: lost.length,
    winRate: closed ? Math.round((won.length / closed) * 100) : 0,
  };
}
