import { MUTED, RED } from '@/lib/color';
import { dLabel, sod, tLabel } from '@/lib/date';
import { money } from '@/lib/format';
import { companyOf } from '@/features/team-tasks/companies';
import { ownerOf, statusTone } from './leadUtils';

/**
 * Everything a lead card / table row displays (port of the original `leadRow`).
 * `companies`: useLeadCompanies() (our company chip).
 */
export function leadRowModel(l, ins, now, companies = []) {
  const nf = ins.nextOf[l.id];
  const od = nf && nf.due < now;
  const score = ins.scoreOf[l.id];
  return {
    lead: l,
    owner: ownerOf(l.owner),
    co: companyOf(companies, l.co),
    st: statusTone(l.status),
    score,
    sp: ins.scorePill(score),
    hot: ins.isHot(l),
    stale: ins.isStale(l),
    staleLabel: `No contact ${ins.daysSince(l.id)}d`,
    dup: !!ins.dupOf[l.id],
    valueLabel: money(l.value),
    createdLabel: dLabel(l.created),
    nextLabel: nf ? `${od ? 'Overdue · ' : ''}${nf.type} · ${dLabel(nf.due)} ${tLabel(nf.due)}` : '—',
    nextColor: !nf ? MUTED : od ? RED : sod(nf.due) === sod(now) ? 'oklch(0.48 0.17 265)' : 'oklch(0.35 0.015 265)',
  };
}
