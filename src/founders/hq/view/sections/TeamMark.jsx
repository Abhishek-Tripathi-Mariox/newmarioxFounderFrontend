/**
 * The other person on a team task row in Today and Calendar ("from Ravi" / "to Priya"). Every HQ task
 * is a team task, so there is no "Team" badge any more. `compact` (the calendar's month-grid chips):
 * nothing — the chip is too small; the day panel shows it.
 */
export default function TeamMark({ item, compact = false }) {
  if (!item || !item.isTeam || compact || !item.who) return null;
  return <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', whiteSpace: 'nowrap' }}>{item.who}</span>;
}
