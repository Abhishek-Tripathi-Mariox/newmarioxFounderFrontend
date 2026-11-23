const IN = new Intl.NumberFormat('en-IN');
const trim = (x, digits) => String(Number(x.toFixed(digits)));

/** ₹8,40,000 */
export const inr = (n) => `₹${IN.format(Math.round(n || 0))}`;

/** Indian short money: ₹24.1 L, ₹1.42 Cr, ₹84,000 below a lakh. */
export function lakh(n) {
  const v = Math.abs(n || 0);
  const sign = n < 0 ? '−' : '';
  if (v >= 1e7) return `${sign}₹${trim(v / 1e7, 2)} Cr`;
  if (v >= 1e5) return `${sign}₹${trim(v / 1e5, 1)} L`;
  return sign + inr(v);
}

/** Amount in lakh as a bare number string: 9.8 */
export const lakhShort = (n) => ((n || 0) / 1e5).toFixed(1);

export const percent = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);

export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Change vs a previous value as a chip: { text: '+12% vs October', tone: 'good' }. */
export function change(cur, prev, vs, upIsGood = true) {
  if (!prev) return null;
  const d = Math.round(((cur - prev) / prev) * 100);
  if (d === 0) return { text: `Same as ${vs.replace(/^vs /, '')}`, tone: 'flat' };
  return { text: `${d > 0 ? '+' : '−'}${Math.abs(d)}% ${vs}`, tone: d > 0 === upIsGood ? 'good' : 'bad' };
}

export const dayMonth = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
export const longDate = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const monthName = (d) => new Date(d).toLocaleDateString('en-IN', { month: 'long' });
export const clock = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

/** 1h 12m / 48m */
export function duration(ms) {
  const m = Math.max(0, Math.round(ms / 60000));
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

export function daysAgo(days) {
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const w = Math.floor(days / 7);
  return w === 1 ? '1 week ago' : `${w} weeks ago`;
}

export function minutesAgo(iso, now = Date.now()) {
  const m = Math.round((now - new Date(iso)) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h} h ago` : `${Math.round(h / 24)} d ago`;
}

/** "A, B, C +2 more" */
export const listNames = (names, max = 3) =>
  names.length <= max ? names.join(', ') : `${names.slice(0, max).join(', ')} +${names.length - max} more`;

export const initials = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
