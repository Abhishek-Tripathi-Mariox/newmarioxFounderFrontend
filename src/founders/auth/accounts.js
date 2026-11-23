/**
 * Account helpers shared by the sign-in screens and the Accounts dialog. Accounts live on the server
 * (src/api/users.js); this file only holds the seat model and form checks.
 *
 * Founders HQ is built for two founders, so every account takes one of two seats. The seat ids are the
 * ones Founders HQ uses internally for its people ('rahul' = founder seat, 'saswat' = co-founder seat);
 * what people see is the account's own name.
 */
export const SEATS = [
  { id: 'rahul', label: 'Founder' },
  { id: 'saswat', label: 'Co-founder' },
];
export const seatLabel = (seatId) => SEATS.find((seat) => seat.id === seatId)?.label || '';

export function initialsOf(name) {
  return String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');
}

const normaliseEmail = (email) => String(email || '').trim().toLowerCase();

/** Seats nobody has taken yet. */
export const freeSeats = (accounts) => SEATS.filter((seat) => !accounts.some((account) => account.seat === seat.id));

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
