import p from '@/founders/summary/styles/page.module.css';

/** "+3 more …" under a capped list. Renders nothing when every item is shown. */
export default function MoreNote({ shown, count, suffix = 'in the portal' }) {
  const rest = (count || 0) - (shown || 0);
  if (rest <= 0) return null;
  return (
    <span className={p.foot}>
      +{rest} more {suffix}
    </span>
  );
}
