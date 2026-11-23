export const DAY = 864e5;

export function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** The given day at hh:mm local time. */
export function atTime(d, h, m = 0) {
  const x = startOfDay(d);
  x.setHours(h, m, 0, 0);
  return x;
}

/** Monday 00:00 of the week containing `d`. */
export function startOfWeek(d) {
  const x = startOfDay(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

/** Whole calendar days from `from` to `to` (positive when `to` is later). */
export const daysBetween = (from, to) => Math.round((startOfDay(to) - startOfDay(from)) / DAY);

export const hoursBetween = (from, to) => (new Date(to) - new Date(from)) / 36e5;

export const prevMonth = (d) => {
  const x = new Date(d);
  return new Date(x.getFullYear(), x.getMonth() - 1, 1);
};
