import { companyChipStyle } from '@/features/team-tasks/companies';
import s from './LeadTags.module.css';

/** Small inline markers used on lead cards / rows: Hot, No contact Nd, Duplicate?. */
export function HotTag({ children = 'Hot' }) {
  return <span className={`${s.tag} ${s.hot}`}>{children}</span>;
}
export function StaleTag({ children }) {
  return <span className={`${s.tag} ${s.stale}`}>{children}</span>;
}
export function DupTag() {
  return <span className={`${s.tag} ${s.dup}`}>Duplicate?</span>;
}
/** Our company the lead is for (tinted chip like Founders HQ's); `co` = { name, hue }. */
export function CompanyTag({ co }) {
  return <span className={s.tag} style={companyChipStyle(co.hue)}>{co.name}</span>;
}
/** Lead score pill; `sp` = scorePill(score) → {bg, fg}. */
export function ScoreTag({ sp, children, table = false }) {
  return (
    <span className={table ? s.scoreTable : s.tag} style={{ background: sp.bg, color: sp.fg }}>
      {children}
    </span>
  );
}
