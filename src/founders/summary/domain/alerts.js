import { daysBetween } from '@/founders/summary/lib/dates';
import { daysAgo, lakh, listNames, percent, plural } from '@/founders/summary/lib/format';
import { overdueFollowUps } from './mariox';
import { waitingDays, waitingHours } from './partners';

export const SEVERITY = {
  high: { label: 'Urgent', tone: 'bad', rank: 0 },
  med: { label: 'This week', tone: 'warn', rank: 1 },
  low: { label: 'FYI', tone: 'flat', rank: 2 },
};

/**
 * "Needs you today": rules over both summaries. Each alert has a stable id so it can be marked
 * handled, a company, a severity, a title + detail line and where to go next.
 */
export function buildAlerts({ mariox, partners, payouts, projects, now }) {
  const out = [];

  if (payouts.count) {
    out.push({
      id: 'commission-to-pay',
      company: 'partners',
      severity: 'high',
      title: `${lakh(payouts.toPayTotal)} partner commission ready to pay`,
      detail: `${plural(payouts.count, 'payout')}, client already paid · ${listNames([...new Set(payouts.toPay.map((r) => r.company || r.partner))])}`,
      action: 'Review payouts',
      to: '/partners',
    });
  }

  if (payouts.soonDue.length) {
    out.push({
      id: 'client-payments-due',
      company: 'partners',
      severity: 'med',
      title: `${plural(payouts.soonDue.length, 'client payment')} on partner deals due within 7 days`,
      detail: `${lakh(payouts.soonDueAmount)} to collect · ${listNames([...new Set(payouts.soonDue.map((r) => r.client))])}`,
      action: 'See payments',
      to: '/partners',
    });
  }

  for (const x of projects.filter((p) => p.reason === 'late')) {
    out.push({
      id: `late-${x.id}`,
      company: 'mariox',
      severity: 'high',
      title: `${x.id} ${x.name}: “${x.milestone.name}” milestone is ${plural(x.lateBy, 'day')} late`,
      detail: x.hoursUsed == null ? `PM ${x.pm}` : `PM ${x.pm} · ${percent(x.hoursUsed, 1)}% of budgeted hours used`,
      action: 'Open projects',
      to: '/mariox',
    });
  }

  const escalated = partners.requests.filter((r) => r.kind === 'ticket' && r.escalated);
  if (escalated.length) {
    const oldest = Math.max(...escalated.map((r) => waitingDays(r, now)));
    out.push({
      id: 'tickets-escalated',
      company: 'partners',
      severity: 'med',
      title: `${plural(escalated.length, 'escalated partner ticket')} still open`,
      detail: `${listNames([...new Set(escalated.map((r) => r.partner))])} · oldest waiting ${plural(oldest, 'day')}`,
      action: 'See requests',
      to: '/partners',
    });
  }

  const scopes = partners.requests
    .filter((r) => r.kind === 'scope' && waitingHours(r, now) > 48)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (scopes.length) {
    const o = scopes[0];
    out.push({
      id: 'scopes-waiting',
      company: 'partners',
      severity: 'med',
      title: `${plural(scopes.length, 'scope approval')} waiting more than 48 hours`,
      detail: `Oldest: ${o.title}${o.amount ? `, ${lakh(o.amount)}` : ''}, submitted ${daysAgo(waitingDays(o, now)).toLowerCase()}`,
      action: 'Review scopes',
      to: '/partners',
    });
  }

  for (const x of projects.filter((p) => p.reason === 'approval')) {
    out.push({
      id: `approval-${x.id}`,
      company: 'mariox',
      severity: 'med',
      title: `${x.id} ${x.name}: client has not approved milestone ${x.milestone.n} for ${plural(x.waiting, 'day')}`,
      detail: 'The next milestone is blocked until they sign off',
      action: 'Open projects',
      to: '/mariox',
    });
  }

  for (const x of projects.filter((p) => p.reason === 'hours')) {
    out.push({
      id: `hours-${x.id}`,
      company: 'mariox',
      severity: 'med',
      title: `${x.id} ${x.name} has used ${percent(x.hoursUsed, 1)}% of its budgeted hours`,
      detail: `Current milestone: ${x.milestone.name} · PM ${x.pm}`,
      action: 'Open projects',
      to: '/mariox',
    });
  }

  const overdue = overdueFollowUps(mariox);
  if (overdue) {
    out.push({
      id: 'followups-overdue',
      company: 'mariox',
      severity: 'med',
      title: `${plural(overdue, 'sales follow-up')} ${overdue === 1 ? 'is' : 'are'} overdue`,
      detail: mariox.sales.owners
        .filter((o) => o.overdue)
        .sort((a, b) => b.overdue - a.overdue)
        .map((o) => `${o.name} ${o.overdue}`)
        .join(' · '),
      action: 'See sales team',
      to: '/mariox',
    });
  }

  // End-of-day report blockers written today
  const todaysBlockers = (mariox.reports?.blockers || []).filter((b) => daysBetween(b.day, now) <= 0);
  if (todaysBlockers.length) {
    out.push({
      id: 'eod-blockers',
      company: 'mariox',
      severity: 'med',
      title: `${plural(todaysBlockers.length, 'blocker')} in today's end-of-day reports`,
      detail: todaysBlockers.map((b) => `${b.name}: ${b.text}`).slice(0, 2).join(' · '),
      action: 'See reports',
      to: '/mariox',
    });
  }

  const tt = mariox.teamTasks;
  if (tt?.overdue) {
    out.push({
      id: 'team-tasks-overdue',
      company: 'mariox',
      severity: 'med',
      title: `${plural(tt.overdue, 'team task')} overdue`,
      detail: (tt.overdueList || []).slice(0, 3).map((t) => `${t.title} (${t.assignee})`).join(' · '),
      action: 'See team tasks',
      to: '/mariox',
    });
  }

  const held = mariox.projects?.onHold || [];
  if (held.length) {
    out.push({
      id: 'projects-on-hold',
      company: 'mariox',
      severity: 'low',
      title: `${plural(held.length, 'project')} on hold`,
      detail: held.map((x) => `${x.name}${x.reason ? ` (${x.reason})` : ''}`).join(' · '),
      action: 'Open projects',
      to: '/mariox',
    });
  }

  const qw = mariox.quotes?.waiting;
  if (qw?.count && qw.oldestSentAt && daysBetween(qw.oldestSentAt, now) >= 7) {
    out.push({
      id: 'quotes-waiting',
      company: 'mariox',
      severity: 'low',
      title: `${lakh(qw.value)} in quotes waiting on clients`,
      detail: `${plural(qw.count, 'quote')} · oldest sent ${daysAgo(daysBetween(qw.oldestSentAt, now)).toLowerCase()}`,
      action: 'See sales',
      to: '/mariox',
    });
  }

  const a = partners.attention;
  if (a.missingPayout) {
    out.push({
      id: 'payout-details-missing',
      company: 'partners',
      severity: 'low',
      title: `${plural(a.missingPayout, 'partner')} can’t be paid yet`,
      detail: 'PAN, GSTIN or bank details missing on their profile',
      action: 'See partners',
      to: '/partners',
    });
  }

  const critical = mariox.bugs.critical;
  if (critical.length) {
    const oldest = Math.max(...critical.map((b) => daysBetween(b.openedAt, now)));
    const where = [...new Set(critical.map((b) => `${b.projectId} ${b.projectName}`))];
    out.push({
      id: 'critical-bugs',
      company: 'mariox',
      severity: 'low',
      title: `${plural(critical.length, 'critical bug')} open on ${listNames(where)}`,
      detail: `Oldest has been open ${plural(oldest, 'day')}`,
      action: 'Open projects',
      to: '/mariox',
    });
  }

  return out.sort((x, y) => SEVERITY[x.severity].rank - SEVERITY[y.severity].rank);
}
