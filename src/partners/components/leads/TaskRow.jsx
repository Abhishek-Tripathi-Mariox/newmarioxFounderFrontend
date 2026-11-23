import { Link } from 'react-router-dom';
import { Check } from '@/partners/components/ui';
import { date, todayISO } from '@/partners/lib/format';

export function dueLabel(due) {
  if (!due) return { text: 'No date', tone: '' };
  const today = todayISO();
  if (due < today) return { text: 'Overdue', tone: 'bad' };
  if (due === today) return { text: 'Today', tone: 'warn' };
  return { text: date(due), tone: '' };
}

// One follow-up with the animated checkbox; used on home and in the lead view.
export function TaskRow({ task, company, href, onToggle, readOnly }) {
  const d = dueLabel(task.due);
  const body = (
    <>
      <b style={task.done ? { textDecoration: 'line-through', color: 'var(--muted)' } : undefined}>{task.text}</b>
      <span className={d.tone === 'bad' && !task.done ? 'od' : ''}>{[company, d.text].filter(Boolean).join(' · ')}</span>
    </>
  );
  return (
    <div className="task">
      {!readOnly && <Check checked={task.done} onChange={() => onToggle?.()} label={`Mark done: ${task.text}`} />}
      {href ? <Link className="task-b" to={href}>{body}</Link> : <div className="task-b">{body}</div>}
    </div>
  );
}
