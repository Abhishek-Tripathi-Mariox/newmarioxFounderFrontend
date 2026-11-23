// type: Intro call / Demo / …; prep: what to bring; invited: the invite went out (WhatsApp, email, calendar).

// Team member name → email, so they get calendar invites too.

export const ACQ_DEFAULTS = {
  sources: ['LinkedIn', 'Email', 'Job portal', 'Referral', 'Website', 'Event', 'Other'],
  channels: ['WhatsApp', 'Call', 'LinkedIn', 'Email', 'Other'],
  reasons: ['Not interested', 'Commission / terms', 'No time right now', 'Not a fit', 'No response', 'Went with someone else', 'Other'],
  team: ['Ritika', 'Aman', 'Neha', 'Karan'],
  services: ['IT consulting', 'Digital marketing agency', 'Recruitment / staffing', 'Business consulting', 'CA / accounting', 'Real estate', 'Freelance developer', 'Sales consultant', 'Other'],
  countries: ['India', 'UAE', 'USA', 'UK', 'Saudi Arabia', 'Qatar', 'Singapore', 'Canada', 'Australia', 'Germany', 'Other'],
};
export const ACQ_LIST_KEYS = Object.keys(ACQ_DEFAULTS);
export const withDefaults = (s) =>
  Object.fromEntries(ACQ_LIST_KEYS.map(k => [k, s?.[k]?.length ? s[k] : ACQ_DEFAULTS[k]]));

export const HOME = 'India';
export const TZ = { India: 5.5, UAE: 4, USA: -5, UK: 0, 'Saudi Arabia': 3, Qatar: 3, Singapore: 8, Canada: -5, Australia: 10, Germany: 1 };
const FLAG = { India: '🇮🇳', UAE: '🇦🇪', USA: '🇺🇸', UK: '🇬🇧', 'Saudi Arabia': '🇸🇦', Qatar: '🇶🇦', Singapore: '🇸🇬', Canada: '🇨🇦', Australia: '🇦🇺', Germany: '🇩🇪' };
export const flag = (c) => FLAG[c || ''] || '🌐';
export const mkt = (l) => ((l.country || HOME) === HOME ? 'domestic' : 'international');
export const loc = (l) => [l.city, l.country].filter(Boolean).join(', ') || '—';

export const TEMP = { hot: ['Hot', 'var(--bad)', '🔥'], warm: ['Warm', 'var(--warn)', ''], cold: ['Cold', 'var(--info)', ''] };
export const ST = {
  contacted: ['Lead', 'var(--info)'],
  meeting: ['Meeting', 'var(--violet)'],
  followup: ['Follow-up', 'var(--warn)'],
  converted: ['Converted', 'var(--good)'],
  onboarding: ['Onboarding', 'var(--accent)'],
  rejected: ['Rejected', 'var(--bad)'],
};
// Converted and onboarding both count as won.
export const won = (l) => l.status === 'converted' || l.status === 'onboarding';
export const MTYPE = ['Intro call', 'Demo', 'Client presentation', 'Follow-up call'];
export const PREP = ['Product demo', 'Client PPT', 'Commission plan', 'Case studies', 'Agreement'];
export const LENGTHS = [15, 30, 45, 60, 90];
export const STATUSES = Object.keys(ST);
export const OPEN = ['contacted', 'meeting', 'followup'];
export const LAB = { onboarding: 'Onboarding started', contacted: 'Contacted', meeting: 'Meeting arranged', done: 'Meeting done', moved: 'Meeting moved', missed: 'Meeting missed', followup: 'Followed up', converted: 'Converted', rejected: 'Rejected' };

/* ------------------------------------------------------------------ dates (YYYY-MM-DD strings, local day) */
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
export const isDay = (s) => typeof s === 'string' && /^\d{4}-\d\d-\d\d$/.test(s);
export const dd = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
export const add = (s, n) => { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
export const fdt = (s) => { if (!s || !/^\d{4}-\d\d-\d\d/.test(s)) return s || '—'; return +s.slice(8, 10) + ' ' + MON[+s.slice(5, 7) - 1] + (s.slice(0, 4) !== today().slice(0, 4) ? ' ' + s.slice(0, 4) : ''); };
export const rel = (s) => { if (!s) return ''; const n = dd(today(), s); return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n === -1 ? 'Yesterday' : n < 0 ? `${-n} days ago` : n < 7 ? `In ${n} days` : fdt(s); };
export const pctN = (a, b) => (b ? Math.round((a / b) * 100) : 0);
export function toISO(v) {
  if (v == null || v === '') return '';
  if (v instanceof Date) return new Date(v.getTime() - v.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  if (typeof v === 'number' && v > 20000 && v < 80000) return add('1899-12-30', Math.round(v)); // Excel serial date
  const s = String(v).trim();
  if (/^\d{4}-\d\d-\d\d/.test(s)) return s.slice(0, 10);
  const m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(s);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  const t = Date.parse(s);
  return isNaN(t) ? '' : toISO(new Date(t));
}

/* ------------------------------------------------------------------ the date that matters for each lead */
export const focus = (l) =>
  l.status === 'meeting' ? l.meet?.date : l.status === 'followup' ? l.next : l.status === 'contacted' ? l.next || l.contactedAt
  : l.status === 'onboarding' ? l.onboardAt || l.convertedAt : won(l) ? l.convertedAt : l.rejectedAt;
export const overdue = (l) => OPEN.includes(l.status) && (focus(l) || '9') < today();

export const isUrl = (s) => /^https?:\/\//i.test(s || '');
export const platform = (u) => (/zoom\.us/i.test(u || '') ? 'Zoom' : /teams\.microsoft|teams\.live/i.test(u || '') ? 'Teams' : /meet\.google/i.test(u || '') ? 'Google Meet' : u ? 'Meeting link' : '');
export const waHref = (l, text = '') => `https://wa.me/${String(l.phone || '').replace(/\D/g, '')}${text ? '?text=' + encodeURIComponent(text) : ''}`;
// 16:00 → "4:00 PM"
export const t12 = (s) => {
  if (!s || !/^\d\d?:\d\d/.test(s)) return s || '';
  const [h, m] = s.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const dow = (s) => DOW[new Date(s + 'T00:00:00Z').getUTCDay()];
export const theirTime = (l) => {
  const tz = TZ[l.country || ''];
  if (tz == null || l.country === HOME || !l.meet?.time) return '';
  const [h, m] = l.meet.time.split(':').map(Number);
  const mins = (((h * 60 + m - (TZ[HOME] - tz) * 60) % 1440) + 1440) % 1440;
  return `${t12(String(Math.floor(mins / 60)).padStart(2, '0') + ':' + String(Math.round(mins % 60)).padStart(2, '0'))} their time`;
};
export const startAt = (l) => (l.meet?.date ? new Date(`${l.meet.date}T${l.meet.time || '09:00'}:00`) : null);

// Live meeting countdown: [text, state] where state is '', 'today', 'soon', 'live' or 'over'.
export function countdown(l, now = Date.now()) {
  const s = startAt(l);
  if (!s) return ['', ''];
  const dur = (+(l.meet.duration ?? 30) || 30) * 6e4, ms = s.getTime() - now;
  if (ms > 0) {
    const m = Math.round(ms / 6e4), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
    return [d ? `in ${d}d ${h}h` : h ? `in ${h}h ${mm}m` : `in ${mm}m`, m <= 60 ? 'soon' : d ? '' : 'today'];
  }
  if (now - s.getTime() < dur) return ['Live now', 'live'];
  const ago = Math.round((now - s.getTime()) / 6e4);
  return [ago < 120 ? `ended ${ago}m ago` : ago < 2880 ? `ended ${Math.round(ago / 60)}h ago` : `was ${Math.round(ago / 1440)}d ago`, 'over'];
}

// Second-by-second timer for the Today panel. long: "00:24:10"; short: "in 24m 10s" / "Live · 5m".
export function tick(l, mode = 'short', now = Date.now()) {
  const s = startAt(l);
  if (!s) return ['', ''];
  const ms = s.getTime() - now, dur = (+(l.meet.duration ?? 30) || 30) * 6e4;
  const f = (x) => {
    x = Math.max(0, Math.floor(x / 1000));
    const h = Math.floor(x / 3600), m = Math.floor((x % 3600) / 60), sec = x % 60;
    return mode === 'long' ? [h, m, sec].map(v => String(v).padStart(2, '0')).join(':') : h ? `${h}h ${m}m` : m >= 10 ? `${m}m` : `${m}m ${String(sec).padStart(2, '0')}s`;
  };
  if (ms > 0) return [mode === 'long' ? f(ms) : 'in ' + f(ms), ms <= 36e5 ? 'soon' : 'later'];
  if (-ms < dur) return [mode === 'long' ? f(-ms) : 'Live · ' + f(-ms), 'live'];
  return ['Ended', 'over'];
}
export const TLBL = { soon: 'starts in', later: 'starts in', live: 'in progress', over: 'ended · add the result' };

/* ------------------------------------------------------------------ invites: WhatsApp, email, Google Calendar, .ics */
const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const endAt = (l) => new Date(startAt(l).getTime() + (+(l.meet.duration ?? 30) || 30) * 6e4);
export const teamMails = (l, emails) => (l.meet?.attendees || []).map(n => emails[n]).filter(Boolean);
export const guests = (l, emails) => [l.email, ...teamMails(l, emails)].filter(Boolean);
export function inviteText(l) {
  const m = l.meet, tt = theirTime(l);
  return `Hi ${l.name.split(' ')[0]}, here are the details for our ${(m.type || 'call').toLowerCase()} with Mariox Software:\n\n📅 ${dow(m.date)}, ${fdt(m.date)}\n🕓 ${t12(m.time)} IST${tt ? ' (' + tt + ')' : ''} · ${+(m.duration ?? 30) || 30} min${m.link ? '\n🔗 ' + m.link : ''}${m.agenda ? '\n\nAgenda: ' + m.agenda : ''}\n\nFrom our side: ${(m.attendees || []).join(', ') || 'the Mariox team'}.\nSee you there!`;
}
const enc = encodeURIComponent;
export const gcalHref = (l, emails) =>
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + enc(`Mariox × ${l.name} · ${l.meet.type || 'Call'}`) + '&dates=' + stamp(startAt(l)) + '/' + stamp(endAt(l)) + '&details=' + enc(inviteText(l)) + (l.meet.link ? '&location=' + enc(l.meet.link) : '') + (guests(l, emails).length ? '&add=' + enc(guests(l, emails).join(',')) : '');
export const mailHref = (l, emails) =>
  `mailto:${enc(l.email || '')}?${teamMails(l, emails).length ? 'cc=' + enc(teamMails(l, emails).join(',')) + '&' : ''}subject=${enc(`Mariox × ${l.company || l.name} · ${l.meet.type || 'Call'} on ${fdt(l.meet.date)}`)}&body=${enc(inviteText(l))}`;
export function ics(l, emails) {
  const e = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mariox//Acquisition//EN', 'METHOD:REQUEST', 'BEGIN:VEVENT', `UID:${l.code}-${l.meet.date}@mariox`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(startAt(l))}`, `DTEND:${stamp(endAt(l))}`,
    `SUMMARY:${e(`Mariox × ${l.name} · ${l.meet.type || 'Call'}`)}`, `DESCRIPTION:${e(inviteText(l))}`, l.meet.link ? `LOCATION:${e(l.meet.link)}` : '', l.email ? `ATTENDEE;CN=${e(l.name)};RSVP=TRUE:mailto:${l.email}` : '',
    ...(l.meet.attendees || []).filter(n => emails[n]).map(n => `ATTENDEE;CN=${e(n)}:mailto:${emails[n]}`),
    'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', 'DESCRIPTION:Meeting in 15 minutes', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
}

/* ------------------------------------------------------------------ filters */

export const RANGES = [['today', 'Today'], ['week', '7 days'], ['month', '30 days'], ['all', 'All time'], ['custom', 'Custom']];
// from / to (YYYY-MM-DD) are used when range is 'custom'.

export const DEFAULT_QUERY = { range: 'today', from: '', to: '', who: 'all', q: '', temp: 'all', svc: 'all', where: 'all' };

// Custom range, with the two dates in order (either may be left empty = open-ended).
export const customSpan = (Q) => {
  const a = Q.from || '0000', b = Q.to || '9999';
  return a <= b ? [a, b] : [b, a];
};
export const rangeLabel = (Q) =>
  Q.from && Q.to ? `${fdt(customSpan(Q)[0])} – ${fdt(customSpan(Q)[1])}` : Q.from ? `From ${fdt(Q.from)}` : Q.to ? `Until ${fdt(Q.to)}` : 'Any date';

const span = (Q) => {
  const t = today(), range = Q.range;
  return range === 'today' ? [t, t] : range === 'week' ? [add(t, -7), add(t, 7)] : range === 'month' ? [add(t, -30), add(t, 30)] : range === 'custom' ? customSpan(Q) : ['0000', '9999'];
};
// Team member, temperature, service and location filters (no date range).
export const matches = (l, Q) =>
  (Q.who === 'all' || l.owner === Q.who || (l.meet?.attendees || []).includes(Q.who)) &&
  (Q.temp === 'all' || l.temp === Q.temp) &&
  (Q.svc === 'all' || (l.services || []).includes(Q.svc)) &&
  (Q.where === 'all' || (Q.where === 'domestic' || Q.where === 'international' ? mkt(l) === Q.where : (l.country || HOME) === Q.where));

// On the board: in the selected date range (open leads that are overdue always show) + filters + search.
// A custom range shows exactly the leads whose next/decision date or first contact falls inside it.
export function inView(l, Q) {
  const [a, b] = span(Q), f = focus(l) || '';
  const inRange = Q.range === 'custom'
    ? (f >= a && f <= b) || (l.contactedAt >= a && l.contactedAt <= b)
    : Q.range === 'all' || (f >= a && f <= b) || overdue(l) || (Q.range !== 'today' && l.contactedAt >= a && l.contactedAt <= b);
  const q = Q.q.trim().toLowerCase();
  return (
    inRange &&
    matches(l, Q) &&
    (!q || [l.name, l.company, l.source, l.owner, l.reason, l.email, l.city, l.country, l.phone].join(' ').toLowerCase().includes(q))
  );
}

// Board order: overdue first, then by the date that matters; closed leads newest first.
export const order = (l) =>
  OPEN.includes(l.status)
    ? (overdue(l) ? '0' : '1') + ((l.status === 'meeting' && startAt(l) ? startAt(l).toISOString() : focus(l)) || '9')
    : '2' + (9e15 - Date.parse(focus(l) || '2000-01-01'));

/* ------------------------------------------------------------------ analytics */
export function measure(leads, Q, services, a, b) {
  const L = leads.filter(l => matches(l, Q));
  const inR = (d) => !!d && d >= a && d <= b;
  const added = L.filter(l => inR(l.contactedAt));
  const held = L.flatMap(l => l.steps.filter(s => s.k === 'done' && inR(s.date))).length;
  const missed = L.flatMap(l => l.steps.filter(s => s.k === 'moved' && s.missed && inR(s.date))).length;
  const conv = L.filter(l => won(l) && inR(l.convertedAt));
  const rej = L.filter(l => l.status === 'rejected' && inR(l.rejectedAt));
  const dec = [...conv, ...rej];
  const days = conv.map(l => dd(l.contactedAt, l.convertedAt)).filter(n => n >= 0);
  const rate = (arr, f) => { const d = arr.filter(f); return [d.filter(won).length, d.length]; };
  return {
    added: added.length,
    held,
    missed,
    show: held + missed ? pctN(held, held + missed) : null,
    conv: conv.length,
    rej: rej.length,
    win: dec.length ? pctN(conv.length, dec.length) : null,
    days: days.length ? Math.round(days.reduce((x, y) => x + y, 0) / days.length) : null,
    why: Object.entries(rej.reduce((m, l) => ((m[l.reason || 'Other'] = (m[l.reason || 'Other'] || 0) + 1), m), {})).sort((x, y) => y[1] - x[1]),
    svc: services.map(s => [s, ...rate(dec, l => (l.services || []).includes(s))]).filter(x => x[2]).sort((x, y) => y[1] - x[1] || y[1] / y[2] - x[1] / x[2]),
    temp: (Object.keys(TEMP)).map(t => [t, ...rate(dec, l => l.temp === t)]),
    mkt: (['domestic', 'international']).map(m => [m, ...rate(dec, l => mkt(l) === m), added.filter(l => mkt(l) === m).length]),
    loc: Object.entries(added.reduce((m, l) => { const k = l.country || HOME; m[k] = m[k] || [0, 0]; m[k][0]++; if (won(l)) m[k][1]++; return m; }, {})).sort((x, y) => y[1][0] - x[1][0]),
  };
}

// Outcome sheet of the Excel export (v12 outcomes()): only the team member filter applies;
// Today looks back 30 days, 7 / 30 days span either side of today.
export function outcomes(leads, Q, services) {
  const t = today();
  const [a, b] = Q.range === 'today' ? [add(t, -30), t] : span(Q);
  const L = leads.filter(l => Q.who === 'all' || l.owner === Q.who);
  const inR = (d) => !!d && d >= a && d <= b;
  const conv = L.filter(l => won(l) && inR(l.convertedAt)), rej = L.filter(l => l.status === 'rejected' && inR(l.rejectedAt));
  const why = {};
  rej.forEach(l => (why[l.reason || 'Other'] = (why[l.reason || 'Other'] || 0) + 1));
  const contacted = L.filter(l => inR(l.contactedAt));
  const days = conv.map(l => dd(l.contactedAt, l.convertedAt)).filter(n => n >= 0);
  const held = L.flatMap(l => l.steps.filter(s => s.k === 'done' && inR(s.date))).length;
  const missed = L.flatMap(l => l.steps.filter(s => s.k === 'moved' && s.missed && inR(s.date))).length;
  const decided = [...conv, ...rej];
  const rate = (f) => { const d = decided.filter(f); return [d.filter(won).length, d.length]; };
  return {
    label: Q.range === 'today' ? 'Last 30 days' : Q.range === 'all' ? 'All time' : Q.range === 'custom' ? rangeLabel(Q) : RANGES.find(r => r[0] === Q.range)[1].replace('days', 'days around today'),
    contacted: contacted.length, held, missed, show: held + missed ? pctN(held, held + missed) : null,
    conv: conv.length, rej: rej.length, rate: decided.length ? pctN(conv.length, decided.length) : null,
    days: days.length ? Math.round(days.reduce((x, y) => x + y, 0) / days.length) : null,
    why: Object.entries(why).sort((x, y) => y[1] - x[1]),
    bySvc: services.map(s => [s, ...rate(l => (l.services || []).includes(s))]).filter(x => x[2]).sort((x, y) => y[1] - x[1] || y[1] / y[2] - x[1] / x[2]),
    byTemp: (Object.keys(TEMP)).map(k => [k, ...rate(l => l.temp === k)]),
    byMkt: (['domestic', 'international']).map(m => [m, ...rate(l => mkt(l) === m), L.filter(l => mkt(l) === m && inR(l.contactedAt)).length]),
    byLoc: Object.entries(contacted.reduce((m, l) => { const k = l.country || HOME; m[k] = m[k] || [0, 0, 0]; m[k][0]++; if (won(l)) m[k][1]++; if (won(l) || l.status === 'rejected') m[k][2]++; return m; }, {})).sort((x, y) => y[1][0] - x[1][0]),
  };
}

/* ------------------------------------------------------------------ messages to send (Copy / WhatsApp / Email) */
export function message(l, ratePct) {
  const first = l.name.split(' ')[0];
  if (l.status === 'meeting') return `Hi ${first}, looking forward to our chat ${rel(l.meet.date).toLowerCase()}${l.meet.time ? ' at ' + l.meet.time : ''}.${l.meet.link ? ' Link: ' + l.meet.link : ''} See you there!`;
  if (l.status === 'contacted') return `Hi ${first}, thanks for connecting. Mariox partners introduce clients, we build the software, and partners earn ${ratePct}% of every payment. Could we do a 20-minute call this week? Share a time that suits you.`;
  return `Hi ${first}, thanks again for your time. Quick recap: you introduce clients, Mariox delivers, and you earn ${ratePct}% of every payment. Shall I send the partner agreement so you can start this week?`;
}

/* ------------------------------------------------------------------ update dialog options per status */

export const OPTS = {
  // Converted straight from Contacted is a saas addition (v12 required a meeting or follow-up first).
  contacted: [['meet', 'Meeting arranged', 'cal'], ['later', 'Still talking · follow up later', 'clock'], ['convert', 'Converted', 'trophy'], ['reject', 'Rejected', 'x']],
  meeting: [['done', 'Meeting done · follow up next', 'check'], ['convert', 'Converted', 'trophy'], ['move', 'Meeting didn’t happen · new date', 'cal'], ['reject', 'Rejected', 'x']],
  followup: [['again', 'Followed up · next follow-up', 'send'], ['meet', 'Arrange another meeting', 'cal'], ['convert', 'Converted', 'trophy'], ['reject', 'Rejected', 'x']],
};
// Drag a card to another column → the update dialog opens with that step picked.
export const MOVE = {
  contacted: { meeting: 'meet', followup: 'later', converted: 'convert', rejected: 'reject' },
  meeting: { followup: 'done', converted: 'convert', rejected: 'reject', meeting: 'move' },
  followup: { meeting: 'meet', followup: 'again', converted: 'convert', rejected: 'reject' },
};

/* ------------------------------------------------------------------ import: header aliases */
export const ALIAS = {
  name: ['name', 'partner name', 'full name', 'lead name', 'contact'],
  company: ['company', 'company name', 'organisation', 'organization'],
  source: ['source', 'found on', 'lead source'],
  channel: ['contacted by', 'channel'],
  owner: ['added by', 'owner', 'lead owner'],
  email: ['email', 'email address'],
  phone: ['phone', 'mobile', 'whatsapp', 'phone / whatsapp'],
  linkedin: ['linkedin', 'linkedin url', 'profile', 'url', 'linkedin / url'],
  cdate: ['contacted on', 'contacted date', 'lead date', 'date'],
  mdate: ['meeting date', 'discussion date'],
  mtime: ['meeting time', 'time'],
  mlink: ['meeting link', 'link', 'discussion link / place'],
  notes: ['notes', 'note'],
  country: ['country', 'location country'],
  city: ['city', 'location'],
};
