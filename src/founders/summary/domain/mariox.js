import { prevMonth } from '@/founders/summary/lib/dates';
import { change, lakh, monthName, plural } from '@/founders/summary/lib/format';

export const pipelineTotals = (stages) =>
  stages.reduce((a, s) => ({ count: a.count + s.count, value: a.value + s.value }), { count: 0, value: 0 });

export const overdueFollowUps = (mariox) => mariox.sales.owners.reduce((a, o) => a + (o.overdue || 0), 0);

export function marioxKpis(m, now) {
  const won = m.sales.won.month;
  const open = pipelineTotals(m.sales.stages);
  const overdue = overdueFollowUps(m);
  const critical = m.bugs.critical.length;
  return [
    { id: 'won', label: 'Won this month', value: lakh(won.value), sub: plural(won.deals, 'deal'), delta: change(won.value, won.prev, `vs ${monthName(prevMonth(now))}`) },
    { id: 'pipeline', label: 'Open pipeline', value: lakh(open.value), sub: plural(open.count, 'deal') },
    { id: 'winrate', label: 'Win rate', value: `${Math.round(m.sales.winRateQuarter * 100)}%`, sub: 'Deals closed this quarter' },
    { id: 'followups', label: 'Follow-ups overdue', value: String(overdue), sub: `${m.sales.followUps.dueToday} due today`, valueColor: overdue ? 'var(--red)' : undefined },
    { id: 'cr', label: 'Change requests', value: lakh(m.changeRequests.value), sub: `${m.changeRequests.waitingOnClient} waiting on clients` },
    { id: 'bugs', label: 'Critical bugs', value: String(critical), sub: `${m.bugs.open} open in total`, valueColor: critical ? 'var(--red)' : undefined },
  ];
}
