// Every status string used anywhere in the app, mapped to a label and colour (same wording as the original portal).
const STATUS = {
  // commissions & payments
  released: ['Released', 'good'], processing: ['Processing', 'warn'], due: ['Due soon', 'info'], upcoming: ['Upcoming', 'mute'],
  received: ['Received', 'good'],
  // scope
  review: ['In review', 'warn'], approved: ['Approved', 'good'], revised: ['Revised', 'violet'], rejected: ['Not approved', 'bad'],
  // bookings
  Requested: ['Requested', 'warn'], Confirmed: ['Confirmed', 'good'], Rescheduled: ['Rescheduled', 'violet'], Declined: ['Declined', 'bad'], Completed: ['Completed', 'mute'],
  // tech requests & tickets
  requested: ['Requested', 'warn'], assigned: ['Assigned', 'info'], completed: ['Completed', 'mute'], declined: ['Team unavailable', 'bad'],
  // users
  active: ['Active', 'good'], invited: ['Invited', 'info'], disabled: ['Disabled', 'bad'],
  // lead priority
  Hot: ['Hot', 'bad'], Warm: ['Warm', 'warn'], Cold: ['Cold', 'info'],
};

export function Badge({ children, tone = 'mute', dot = true, style }) {
  return <span className={`pill s-${tone} ${dot ? '' : 'nd'}`} style={style}>{children}</span>;
}

export function StatusBadge({ status, dot }) {
  if (!status) return null;
  const [label, tone] = STATUS[status] || [status, 'mute'];
  return <Badge tone={tone} dot={dot}>{label}</Badge>;
}

export const statusTone = (status) => STATUS[status]?.[1] ?? 'mute';
