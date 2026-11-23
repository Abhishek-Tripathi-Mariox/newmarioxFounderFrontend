/**
 * Account helpers shared by the sign-in screens and the Accounts dialog. Accounts live on the server
 * (src/api/users.js); this file only holds the member model and form checks.
 *
 * Founders HQ has any number of members, each a Founder or a Co-founder (`role`). Every member has a
 * stable HQ person id (`seat`) that HQ data uses for owners, sign-offs and prefs: the first two
 * founders kept the original ids ('rahul', 'saswat'); later members get one from their user id.
 * What people see is the account's own name.
 */
export const ROLES = [
  { id: 'founder', label: 'Founder' },
  { id: 'cofounder', label: 'Co-founder' },
];
export const roleLabel = (role) => ROLES.find((item) => item.id === role)?.label || 'Co-founder';
/** The account's role label (older servers sent only `seatLabel`). */
export const accountRoleLabel = (account) => account?.seatLabel || roleLabel(account?.role);

/** A member's colour, stable per person id (the two original seats keep their colours). */
const LEGACY_COLORS = { rahul: 'oklch(0.55 0.17 265)', saswat: 'oklch(0.56 0.12 175)' };
const MEMBER_HUES = [30, 330, 140, 60, 210, 0, 290, 100, 240, 160];
export function personColor(personId) {
  if (LEGACY_COLORS[personId]) return LEGACY_COLORS[personId];
  const hash = [...String(personId || '')].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return 'oklch(0.56 0.14 ' + MEMBER_HUES[hash % MEMBER_HUES.length] + ')';
}

export function initialsOf(name) {
  return String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');
}

const normaliseEmail = (email) => String(email || '').trim().toLowerCase();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;

/** Password rule shared by every form; returns an error message or ''. */
export function validatePassword(password) {
  return String(password || '').length < MIN_PASSWORD_LENGTH ? `Use at least ${MIN_PASSWORD_LENGTH} characters for the password.` : '';
}

/**
 * Quick checks before calling the server (which checks again); returns an error message or ''.
 * Pass `password` only when the form has one.
 */
export function validateAccount({ name, email, password }, accounts = [], editingId = null) {
  if (!String(name || '').trim()) return 'Enter a name.';
  if (!EMAIL_PATTERN.test(normaliseEmail(email))) return 'Enter a valid email.';
  if (accounts.some((account) => account.email === normaliseEmail(email) && account.id !== editingId)) return 'An account with this email already exists.';
  if (password !== undefined) return validatePassword(password);
  return '';
}
