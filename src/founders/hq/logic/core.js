/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import React from 'react';
import { initialsOf, personColor } from '@/founders/auth/accounts';

/** AI features (Founders AI chat, Write my brief, Ask the constitution, Claude drafts). Off for now. */
export const AI_ON = false;

/** Mariox's two portal apps. Override with VITE_INTERNAL_PORTAL_URL / VITE_PARTNERS_ADMIN_URL. */
export const PORTAL_URLS = {
  internal: import.meta.env.VITE_INTERNAL_PORTAL_URL || '/',
  partners: import.meta.env.VITE_PARTNERS_ADMIN_URL || '/partners/admin',
};

/** Prefix of the per-browser view choices (task grouping, sort, layout …) kept in localStorage. */
export const KEY = 'founders-hq-v1';
/**
 * HQ people, keyed by HQ person id: every Founder / Co-founder account (any number; filled from the
 * accounts by applyAccountNames() before HQ renders) plus 'both' = "All founders" (the stored value
 * stays 'both' so older data keeps working). The two original ids ('rahul', 'saswat') always have an
 * entry so data that still names them renders even when nobody holds them any more.
 */
export const PEOPLE = {
  rahul: { name: 'Founder', first: 'Founder', role: 'Founder', ini: 'F', bg: 'oklch(0.55 0.17 265)' },
  saswat: { name: 'Co-founder', first: 'Co-founder', role: 'Co-founder', ini: 'C', bg: 'oklch(0.56 0.12 175)' },
  both: { name: 'All founders', first: 'All founders', ini: 'All', bg: 'oklch(0.45 0.03 265)' }
};
/** Label of the shared owner value 'both'. */
export const ALL_FOUNDERS = 'All founders';
/** Person ids of the current HQ members, founders first (the order GET /hq/users returns). */
export const MEMBERS = ['rahul', 'saswat'];
/** A person (or "All founders" for 'both' / unknown ids). */
export const personOf = id => PEOPLE[id] || PEOPLE.both;
/** Every member except `me`. */
export const othersOf = me => MEMBERS.filter(id => id !== me);
/** [id, first name, colour] for every member, optionally followed by 'both' (All founders). */
export const memberOpts = (withAll = true) => [
  ...MEMBERS.map(id => [id, PEOPLE[id].first, PEOPLE[id].bg]),
  ...(withAll ? [['both', ALL_FOUNDERS, PEOPLE.both.bg]] : [])
];
/** True when every current member is in `ids` (sign-offs / approvals that need all founders). */
export const allAgreed = ids => MEMBERS.length > 0 && MEMBERS.every(id => (ids || []).includes(id));
/** Members still missing from `ids`. */
export const missingFrom = ids => MEMBERS.filter(id => !(ids || []).includes(id));
/** "Name (Founder), Name (Co-founder), …": who runs Founders HQ, for assistant prompts. */
export const teamLine = () => MEMBERS.map(id => PEOPLE[id].name + ' (' + PEOPLE[id].role + ')').join(', ') || 'the founders';
/** "A", "A and B", "A, B and C" from first names. */
export const namesOf = ids => {
  const names = ids.map(id => personOf(id).first);
  return names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
};
/** The two original seats: their role names when nobody holds them any more. */
const LEGACY_PEOPLE = { rahul: { role: 'Founder' }, saswat: { role: 'Co-founder' } };
export const COS = [
  { id: 'mariox', name: 'Mariox', full: 'Mariox Software', ini: 'M', bg: 'oklch(0.6 0.17 265)', tint: 'oklch(0.95 0.03 265)', ink: 'oklch(0.42 0.15 265)', live: true, href: import.meta.env.VITE_INTERNAL_PORTAL_URL || '/' },
  { id: 'hroo', name: 'HROO', full: 'HROO', ini: 'H', bg: 'oklch(0.6 0.13 160)', tint: 'oklch(0.95 0.035 160)', ink: 'oklch(0.4 0.1 160)' },
  { id: 'arth', name: 'Arth', full: 'Arth', ini: 'A', bg: 'oklch(0.66 0.14 55)', tint: 'oklch(0.95 0.04 70)', ink: 'oklch(0.45 0.12 55)' }
];
export const GEN = { id: 'all', name: 'Founders', tint: 'oklch(0.94 0.005 265)', ink: 'oklch(0.4 0.012 265)' };
export const ALLCOS = [];
/** Looks a company up by id among active companies, then all companies; falls back to the "Founders" pseudo-company. */
export const coOf = id => COS.find(company => company.id === id) || ALLCOS.find(company => company.id === id) || GEN;
export const coColors = hue => ({
  bg: 'oklch(0.6 0.15 ' + hue + ')',
  tint: 'oklch(0.95 0.03 ' + hue + ')',
  ink: 'oklch(0.42 0.13 ' + hue + ')',
});

/** Seeds the company list (from the built-in COS) and the constitution when the saved data has none. */
export function ensureCos(data) {
  if (!data.companies || !data.companies.length) {
    data.companies = COS.map((company, position) => ({
      ...company,
      hue: [265, 160, 55][position] || 200,
      status: 'Active',
      country: 'India',
      entity: 'Private Limited',
      industry: company.id === 'mariox' ? 'Software services' : company.id === 'hroo' ? 'HR tech' : 'Fintech',
      owner: 'both',
      pin: true,
      legal: company.full,
      created: Date.now(),
      runs: {},
    }));
  }
  if (!data.constitution) data.constitution = seedConstitution();
  return data;
}

/** Refreshes the shared ALLCOS / COS / CO_OPTS lists in place from the saved companies (closed and archived ones are hidden). */
export function syncCos(data) {
  const list = (data.companies || []);
  ALLCOS.splice(0, ALLCOS.length, ...list);
  const activeCompanies = list.filter(company => company.status !== 'Closed' && !company.archived);
  COS.splice(0, COS.length, ...activeCompanies);
  if (typeof CO_OPTS !== 'undefined') {
    CO_OPTS.splice(0, CO_OPTS.length, ...activeCompanies.map(company => [company.id, company.name]), ['all', 'Founders']);
  }
  CO_OPTS.splice(0, CO_OPTS.length, ...activeCompanies.map(company => [company.id, company.name]), ['all', 'Founders']);
}
export const CO_OPTS = [['mariox', 'Mariox'], ['hroo', 'HROO'], ['arth', 'Arth'], ['all', 'Founders']];
/** [id, label] owner choices: every member, then 'both' (All founders). Rebuilt by applyAccountNames(). */
export const OWNER_OPTS = [['rahul', 'Founder'], ['saswat', 'Co-founder'], ['both', ALL_FOUNDERS]];

/**
 * Builds HQ's people from the accounts (`users` from GET /hq/users: any number of founders and
 * co-founders, each with a person id `seat` and a `role`): updates PEOPLE, MEMBERS, the owner options
 * and the default sidebar subtitle in place, like syncCos does for companies.
 */
export function applyAccountNames(users) {
  const list = (users || []).filter(user => user && user.seat);
  // Former members keep their entry (old data names them), but are no longer members.
  Object.keys(PEOPLE).forEach(id => { if (id !== 'both' && !LEGACY_PEOPLE[id] && !list.some(user => user.seat === id)) PEOPLE[id].former = true; });
  ['rahul', 'saswat'].forEach(id => {
    if (!list.some(user => user.seat === id)) Object.assign(PEOPLE[id], { name: LEGACY_PEOPLE[id].role, first: LEGACY_PEOPLE[id].role, ini: LEGACY_PEOPLE[id].role[0], former: true });
  });
  list.forEach(user => {
    const role = user.seatLabel || (user.role === 'founder' ? 'Founder' : 'Co-founder');
    const name = String(user.name || '').trim() || role;
    PEOPLE[user.seat] = {
      name, first: name.split(/\s+/)[0], role, ini: initialsOf(name) || role[0],
      bg: personColor(user.seat),
      hqRole: user.role || (user.seat === 'rahul' ? 'founder' : 'cofounder'), userId: user.userId || null, former: false
    };
  });
  MEMBERS.splice(0, MEMBERS.length, ...list.map(user => user.seat));
  OWNER_OPTS.splice(0, OWNER_OPTS.length, ...MEMBERS.map(id => [id, PEOPLE[id].first]), ['both', ALL_FOUNDERS]);
  const firsts = MEMBERS.map(id => PEOPLE[id].first);
  Object.assign(PEOPLE.both, {
    name: MEMBERS.length === 2 ? firsts.join(' & ') : ALL_FOUNDERS,
    first: ALL_FOUNDERS,
    ini: MEMBERS.length === 2 ? MEMBERS.map(id => PEOPLE[id].ini[0]).join('+') : 'All'
  });
  PF_DEF.sub = !MEMBERS.length ? 'Founders' : MEMBERS.length <= 3 ? namesOf(MEMBERS).replace(' and ', ' & ') : MEMBERS.length + ' founders';
}
/** Builds segmented-control buttons from [value, label] pairs; the current value gets the raised white look. */
export const segOf = (options, current, select) => options.map(([value, label]) => ({
  label,
  go: () => select(value),
  bg: current === value ? '#fff' : 'transparent',
  fg: current === value ? 'oklch(0.23 0.015 265)' : 'oklch(0.52 0.012 265)',
  sh: current === value ? '0 1px 2px oklch(0.2 0.02 265 / 0.12)' : 'none',
}));
export const ACCENTS = [
  ['indigo', 'Indigo', 'oklch(0.5 0.17 265)', 'oklch(0.42 0.17 265)'],
  ['teal', 'Teal', 'oklch(0.5 0.1 210)', 'oklch(0.42 0.1 210)'],
  ['green', 'Green', 'oklch(0.5 0.13 155)', 'oklch(0.42 0.13 155)'],
  ['saffron', 'Saffron', 'oklch(0.58 0.16 50)', 'oklch(0.5 0.16 50)'],
  ['plum', 'Plum', 'oklch(0.48 0.15 320)', 'oklch(0.4 0.15 320)'],
  ['graphite', 'Graphite', 'oklch(0.32 0.015 265)', 'oklch(0.24 0.015 265)'],
];
export const SIDES = [
  ['midnight', 'Midnight', 265, 0.02],
  ['charcoal', 'Charcoal', 60, 0.006],
  ['ocean', 'Ocean', 240, 0.05],
  ['forest', 'Forest', 160, 0.03],
  ['wine', 'Wine', 15, 0.045],
];
export const SIZES = [['0.92', 'Small'], ['1', 'Normal'], ['1.08', 'Large'], ['1.16', 'Extra large']];
export const PAGE_DEF = [
  ['home', 'Today'],
  ['tasks', 'Team tasks'],
  ['mytasks', 'My tasks'],
  ['users', 'Users & roles'],
  ['calendar', 'Calendar'],
  ['attendance', 'Attendance'],
  ['goals', 'Goals'],
  ['decisions', 'Decisions'],
  ['sync', 'Weekly rhythm'],
  ['pipeline', 'Sales'],
  ['research', 'Research'],
  ['finance', 'Finance'],
  ['hiring', 'Hiring'],
  ['docs', 'Docs & files'],
  ['vault', 'Vault'],
  ['companies', 'Companies'],
  ['constitution', 'Constitution'],
];
export const HUB_OF = {
  scorecard: 'sync',
  review: 'sync',
  contracts: 'pipeline',
  customers: 'pipeline',
  brief: 'home',
};
export const DEPTS = [
  ['tech', 'Product & Tech', 255],
  ['sales', 'Sales & Marketing', 150],
  ['ops', 'Ops-HR & Finance', 60],
  ['founder', 'Founder', 300],
];
export const DEPT_OF = Object.fromEntries(DEPTS.map(([id, label, hue]) => [id, {
  label,
  tint: 'oklch(0.955 0.03 ' + hue + ')',
  ink: 'oklch(0.4 0.11 ' + hue + ')',
  dot: 'oklch(0.62 0.13 ' + hue + ')',
}]));
/** My tasks table columns that can be shown or hidden (Settings → My tasks). */
export const COL_DEF = [
  ['status', 'Status'],
  ['dept', 'Department'],
  ['co', 'Company'],
  ['team', 'Team'],
  ['start', 'Start date'],
  ['due', 'Due date'],
  ['pri', 'Priority'],
];
export const PF_DEF = {
  acc: 'indigo',
  side: 'midnight',
  size: '1',
  name: 'Founders HQ',
  sub: 'Founders',
  start: 'home',
  money: '',
  pages: [],
  cols: { status: true, dept: true, co: true, team: true, start: true, due: true, pri: true },
};
export const PARTNER_DEF = { tickets: 0, approvals: 0, visits: 0, tech: 0, pay: 0, kyc: 0 };
export const PARTNER_ROWS = [
  ['tickets', 'Open support tickets'],
  ['approvals', 'Scope approvals'],
  ['visits', 'Office visits'],
  ['tech', 'Technical team requests'],
  ['pay', 'Payments & payouts due'],
  ['kyc', 'Partners pending KYC'],
];
export const te = new TextEncoder(), td = new TextDecoder();
/** ArrayBuffer -> base64 string. */
export const b64 = buffer => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};
/** Base64 string -> Uint8Array. */
export const unb64 = base64 => Uint8Array.from(atob(base64), char => char.charCodeAt(0));

/** Derives the vault's AES-GCM key from the master password (PBKDF2, 250k iterations). */
export async function deriveKey(password, salt) {
  const baseKey = await crypto.subtle.importKey('raw', te.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Encrypts the vault items with a fresh IV; returns the sealed blob `{ salt, iv, ct }` (base64) to store. */
export async function seal(key, salt, items) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherText = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, te.encode(JSON.stringify(items)));
  return { salt: b64(salt), iv: b64(iv), ct: b64(cipherText) };
}

/** Decrypts a sealed blob with the master password; rejects when the password is wrong. */
export async function unseal(password, sealed) {
  const salt = unb64(sealed.salt);
  const key = await deriveKey(password, salt);
  const plainText = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(sealed.iv) }, key, unb64(sealed.ct));
  return { key, salt, items: JSON.parse(td.decode(plainText)) };
}

/** Opens the IndexedDB database that stores uploaded file blobs (object store "f"). */
export const openDB = () => new Promise((resolve, reject) => {
  const request = indexedDB.open('founders-hq-files', 1);
  request.onupgradeneeded = () => request.result.createObjectStore('f');
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

/** Runs one operation on the file store and resolves with the request result once the transaction completes. */
export const idb = async (mode, operation) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('f', mode);
    const request = operation(transaction.objectStore('f'));
    transaction.oncomplete = () => resolve(request && request.result);
    transaction.onerror = () => reject(transaction.error);
  });
};
/** Minimal CSV parser (quoted fields, "" escapes, CRLF). Drops rows that are entirely blank. */
export function parseCSV(text) {
  text = text.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += char;
    }
    else if (char === '"') inQuotes = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    }
    else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter(cells => cells.some(cell => cell.trim()));
}

/** Converts a Notion-style date ("May 3, 2025 → May 5, 2025 (GMT)") to YYYY-MM-DD, or '' if unparseable. */
export const toIso = value => {
  if (!value) return '';
  const date = new Date(value.split('→')[0].replace(/\(.*\)/, '').trim());
  return isNaN(date) ? '' : iso(date);
};
/** Guesses the company id mentioned in a piece of text; defaults to 'all' (Founders). */
export const guessCo = text => {
  text = (text || '').toLowerCase();
  return text.includes('hroo') ? 'hroo' : text.includes('arth') ? 'arth' : text.includes('mariox') ? 'mariox' : 'all';
};
export const fmtSize = bytes => bytes > 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB';
export const STATUS_ORDER = ['In progress', 'Not started', 'Done'];
export const STATUS = {
  'Not started': { tint: 'oklch(0.97 0.003 265)', ink: 'oklch(0.38 0.012 265)', dot: 'oklch(0.68 0.01 265)', bd: 'oklch(0.88 0.006 265)' },
  'In progress': { tint: 'oklch(0.95 0.035 250)', ink: 'oklch(0.4 0.14 255)', dot: 'oklch(0.6 0.17 255)', bd: 'oklch(0.85 0.07 250)' },
  'Done': { tint: 'oklch(0.95 0.045 150)', ink: 'oklch(0.38 0.1 150)', dot: 'oklch(0.62 0.14 150)', bd: 'oklch(0.85 0.07 150)' }
};
export const STAGES = ['Planned', 'Sourcing', 'Interviewing', 'Offer', 'Hired'];
/** Local calendar date as YYYY-MM-DD (shifts by the timezone offset so toISOString does not roll the day). */
export const iso = value => {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};
/** Today plus `days`, as YYYY-MM-DD. */
export const plus = days => { const date = new Date(); date.setDate(date.getDate() + days); return iso(date); };
/** Whole days from today to an ISO date (negative = past); null when no date. */
export const dayDiff = isoDate => {
  if (!isoDate) return null;
  const target = new Date(isoDate + 'T00:00:00'), today = new Date(iso(new Date()) + 'T00:00:00');
  return Math.round((target - today) / 864e5);
};
export const uid = () => Math.random().toString(36).slice(2, 9);
export const INK_C = 'oklch(0.23 0.015 265)';
export const RED = 'oklch(0.52 0.19 25)', AMBER = 'oklch(0.55 0.13 65)', GREEN = 'oklch(0.5 0.13 150)', MUTED = 'oklch(0.52 0.012 265)';

export const TYPES = [
  ['p', 'Text'],
  ['h1', 'Heading 1'],
  ['h2', 'Heading 2'],
  ['h3', 'Heading 3'],
  ['bullet', 'Bulleted list'],
  ['num', 'Numbered list'],
  ['todo', 'To-do'],
  ['quote', 'Quote'],
  ['divider', 'Divider'],
];
export const BST = {
  p: { fs: '15.5px', fw: '400', lh: '1.6', mt: '1px', ls: '0' },
  h1: { fs: '29px', fw: '700', lh: '1.25', mt: '24px', ls: '-0.015em' },
  h2: { fs: '22px', fw: '650', lh: '1.3', mt: '18px', ls: '-0.01em' },
  h3: { fs: '18px', fw: '600', lh: '1.35', mt: '12px', ls: '0' },
  bullet: { fs: '15.5px', fw: '400', lh: '1.6', mt: '1px', ls: '0' },
  num: { fs: '15.5px', fw: '400', lh: '1.6', mt: '1px', ls: '0' },
  todo: { fs: '15.5px', fw: '400', lh: '1.6', mt: '1px', ls: '0' },
  quote: { fs: '15.5px', fw: '400', lh: '1.6', mt: '6px', ls: '0' },
  divider: { fs: '15.5px', fw: '400', lh: '1.6', mt: '4px', ls: '0' }
};
export const SHORT = [[/^### /, 'h3'], [/^## /, 'h2'], [/^# /, 'h1'], [/^[-*] /, 'bullet'], [/^1[.)] /, 'num'], [/^\[ ?\] /, 'todo'], [/^> /, 'quote']];
/** Converts Markdown text into editor blocks (one block per non-empty line). */
export function mdToBlocks(text) {
  const blocks = [];
  (text || '').split(/\r?\n/).forEach(rawLine => {
    const line = rawLine.replace(/\s+$/, '');
    let match;
    if (!line.trim()) return;
    if ((match = line.match(/^\s*[-*]\s+\[( |x|X)\]\s*(.*)$/))) blocks.push({ type: 'todo', text: match[2], checked: match[1].toLowerCase() === 'x' });
    else if ((match = line.match(/^###+\s+(.*)$/))) blocks.push({ type: 'h3', text: match[1] });
    else if ((match = line.match(/^##\s+(.*)$/))) blocks.push({ type: 'h2', text: match[1] });
    else if ((match = line.match(/^#\s+(.*)$/))) blocks.push({ type: 'h1', text: match[1] });
    else if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) blocks.push({ type: 'divider', text: '' });
    else if ((match = line.match(/^\s*[-*+]\s+(.*)$/))) blocks.push({ type: 'bullet', text: match[1] });
    else if ((match = line.match(/^\s*\d+[.)]\s+(.*)$/))) blocks.push({ type: 'num', text: match[1] });
    else if ((match = line.match(/^>\s?(.*)$/))) blocks.push({ type: 'quote', text: match[1] });
    else blocks.push({ type: 'p', text: line.replace(/\*\*(.*?)\*\*/g, '$1') });
  });
  if (!blocks.length) blocks.push({ type: 'p', text: '' });
  return blocks.map(block => ({ id: uid(), checked: false, ...block }));
}

/** Prepends an entry to the activity feed (newest first, capped at 400 entries). */
export const act = (data, by, text, co) => {
  data.activity = data.activity || [];
  data.activity.unshift({ id: uid(), at: Date.now(), by, text, co: co || 'all' });
  if (data.activity.length > 400) data.activity.length = 400;
};
export const GST = {
  'Achieved': { tint: 'oklch(0.94 0.05 150)', ink: 'oklch(0.38 0.1 150)', dot: 'oklch(0.58 0.14 150)' },
  'On track': { tint: 'oklch(0.95 0.04 160)', ink: 'oklch(0.4 0.1 160)', dot: 'oklch(0.62 0.13 160)' },
  'At risk': { tint: 'oklch(0.95 0.06 80)', ink: 'oklch(0.45 0.11 65)', dot: 'oklch(0.75 0.15 70)' },
  'Behind': { tint: 'oklch(0.95 0.035 25)', ink: 'oklch(0.48 0.17 25)', dot: 'oklch(0.62 0.19 25)' },
  'Overdue': { tint: 'oklch(0.95 0.035 25)', ink: 'oklch(0.48 0.17 25)', dot: 'oklch(0.62 0.19 25)' },
  'In progress': { tint: 'oklch(0.95 0.035 250)', ink: 'oklch(0.4 0.14 255)', dot: 'oklch(0.6 0.17 255)' },
  'Not started': { tint: 'oklch(0.96 0.003 265)', ink: 'oklch(0.4 0.012 265)', dot: 'oklch(0.7 0.01 265)' }
};
export const DST = {
  'Proposed': { tint: 'oklch(0.95 0.06 80)', ink: 'oklch(0.45 0.11 65)', dot: 'oklch(0.75 0.15 70)' },
  'Decided': { tint: 'oklch(0.94 0.05 150)', ink: 'oklch(0.38 0.1 150)', dot: 'oklch(0.58 0.14 150)' },
  'Revisit': { tint: 'oklch(0.95 0.035 250)', ink: 'oklch(0.4 0.14 255)', dot: 'oklch(0.6 0.17 255)' },
  'Dropped': { tint: 'oklch(0.95 0.003 265)', ink: 'oklch(0.45 0.012 265)', dot: 'oklch(0.72 0.01 265)' }
};
export const DST_LABEL = { Proposed: 'Needs decision', Decided: 'Decided', Revisit: 'Revisit', Dropped: 'Not doing' };
export const IMPACT = {
  High: { tint: 'oklch(0.95 0.035 25)', ink: 'oklch(0.48 0.17 25)', dot: 'oklch(0.6 0.2 25)' },
  Medium: { tint: 'oklch(0.96 0.04 80)', ink: 'oklch(0.47 0.1 65)', dot: 'oklch(0.75 0.14 70)' },
  Low: { tint: 'oklch(0.96 0.004 265)', ink: 'oklch(0.45 0.012 265)', dot: 'oklch(0.75 0.01 265)' },
};
export const RST = {
  'Open': { tint: 'oklch(0.96 0.004 265)', ink: 'oklch(0.4 0.012 265)', dot: 'oklch(0.7 0.01 265)' },
  'In progress': { tint: 'oklch(0.95 0.05 80)', ink: 'oklch(0.45 0.11 65)', dot: 'oklch(0.75 0.15 70)' },
  'Concluded': { tint: 'oklch(0.94 0.05 150)', ink: 'oklch(0.38 0.1 150)', dot: 'oklch(0.58 0.14 150)' },
  'Parked': { tint: 'oklch(0.95 0.03 300)', ink: 'oklch(0.42 0.1 300)', dot: 'oklch(0.62 0.1 300)' },
};
export const HX_DEF = {
  q: '',
  co: 'any',
  owner: 'any',
  pri: 'any',
  type: 'any',
  loc: 'any',
  when: 'any',
  sort: 'due',
  view: 'board',
};
export const CSTAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
export const CST = {
  Applied: 'oklch(0.7 0.01 265)',
  Screening: 'oklch(0.6 0.13 255)',
  Interview: 'oklch(0.75 0.15 70)',
  Offer: 'oklch(0.6 0.15 300)',
  Hired: 'oklch(0.58 0.14 150)',
  Rejected: 'oklch(0.62 0.17 25)',
};
export const STG = {
  Planned: 'oklch(0.7 0.01 265)',
  Sourcing: 'oklch(0.6 0.13 255)',
  Interviewing: 'oklch(0.75 0.15 70)',
  Offer: 'oklch(0.6 0.15 300)',
  Hired: 'oklch(0.58 0.14 150)',
};
export const RX_DEF = {
  q: '',
  co: 'any',
  status: 'any',
  owner: 'any',
  pri: 'any',
  tag: 'any',
  when: 'any',
  sort: 'updated',
  group: 'status',
  view: 'list',
};
export const DX_DEF = {
  q: '',
  status: 'all',
  co: 'any',
  by: 'any',
  impact: 'any',
  when: 'any',
  sort: 'newest',
  group: 'status',
};
/**
 * Progress and pace for a goal. Progress comes from a numeric target or from linked tasks;
 * status compares it with the share of the start→target window that has elapsed ("expected" %).
 */
export function goalCalc(goal, tasks) {
  const linked = tasks.filter(task => task.goal === goal.id), doneCount = linked.filter(task => task.done).length;
  let pct, basis;
  if (goal.measure === 'number') {
    const targetValue = Number(goal.goalVal) || 0, currentValue = Number(goal.current) || 0;
    const unitSuffix = goal.unit ? ' ' + goal.unit : '';
    pct = targetValue ? Math.min(100, Math.round(currentValue / targetValue * 100)) : 0;
    basis = targetValue
      ? currentValue.toLocaleString('en-IN') + ' of ' + targetValue.toLocaleString('en-IN') + unitSuffix
      : 'Set a target number';
  }
  else {
    pct = linked.length ? Math.round(doneCount / linked.length * 100) : 0;
    basis = linked.length ? doneCount + ' of ' + linked.length + ' tasks done' : 'No tasks linked yet';
  }
  let status, expectedPct = null, now = Date.now();
  const startMs = goal.start ? new Date(goal.start + 'T00:00:00').getTime() : (goal.created || now);
  const targetMs = goal.target ? new Date(goal.target + 'T23:59:59').getTime() : null;
  if (targetMs) expectedPct = Math.round(Math.max(0, Math.min(1, (now - startMs) / Math.max(1, targetMs - startMs))) * 100);
  // Within 10 points of the expected pace is "On track", within 30 is "At risk".
  if (pct >= 100) status = 'Achieved';
  else if (!targetMs) status = pct > 0 ? 'In progress' : 'Not started';
  else if (now > targetMs) status = 'Overdue';
  else status = pct >= expectedPct - 10 ? 'On track' : pct >= expectedPct - 30 ? 'At risk' : 'Behind';
  const daysLeft = goal.target ? dayDiff(goal.target) : null;
  let explain;
  if (status === 'Achieved') explain = 'Goal reached. Nice work.';
  else if (!targetMs) explain = 'Add a target date to see if you are on pace.';
  else if (status === 'Overdue') explain = 'Target date passed ' + (-daysLeft) + ' day' + (daysLeft === -1 ? '' : 's') + ' ago at ' + pct + '%. Move the date or close it out.';
  else if (status === 'On track') explain = 'At ' + pct + '%. By today you would expect about ' + expectedPct + '%, so you are on pace.';
  else explain = 'At ' + pct + '%, but by today you would expect about ' + expectedPct + '%. ' + (status === 'Behind' ? 'Needs a push.' : 'Slightly behind.');
  return { pct, basis, linked, doneN: doneCount, status, exp: expectedPct, daysLeft, explain };
}
export const WD = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/**
 * Parses quick-add task text such as "Call bank @rahul #mariox !high fri" (@<first name>, @<person id> or @all).
 * Each recognised token is removed from the title; only the first matching date form is used.
 */
export function parseQuick(text) {
  let rest = ' ' + text + ' ', owner = null, co = null, pri = null, due = null;
  /** If `pattern` matches, hands the match to `apply` and cuts the matched text out of `rest`. */
  const take = (pattern, apply) => {
    const match = rest.match(pattern);
    if (match) { apply(match); rest = rest.replace(match[0], ' '); }
  };
  // @<first name>, @<person id>, @all or @both. Longest match first, so "@ann" does not take "@anna".
  const handles = [['all', 'both'], ['both', 'both'], ...MEMBERS.flatMap(id => [[id, id], [PEOPLE[id].first.toLowerCase(), id]])]
    .filter(([handle]) => /^[a-z0-9-]+$/.test(handle)).sort((a, b) => b[0].length - a[0].length);
  if (handles.length) {
    take(new RegExp('\\s@(' + handles.map(([handle]) => handle).join('|') + ')(?![a-z0-9-])', 'i'), match => {
      owner = handles.find(([handle]) => handle === match[1].toLowerCase())[1];
    });
  }
  // #company: a built-in or founder-added company id (#founders = the Founders pseudo-company).
  const companyIds = ['mariox', 'hroo', 'arth', ...ALLCOS.map(company => company.id)];
  const companyTag = (rest.match(/\s#([a-z0-9-]+)(?=\s)/gi) || []).map(tag => tag.trim().slice(1).toLowerCase())
    .find(tag => tag === 'founders' || companyIds.includes(tag));
  if (companyTag) take(new RegExp('\\s#' + companyTag + '(?=\\s)', 'i'), () => co = companyTag === 'founders' ? 'all' : companyTag);
  take(/\s!(high|medium|low|p1|p2|p3|urgent)\b/i, match => {
    const word = match[1].toLowerCase();
    pri = word === 'high' || word === 'p1' || word === 'urgent' ? 'High' : word === 'low' || word === 'p3' ? 'Low' : 'Medium';
  });
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysFromToday = days => { const date = new Date(today); date.setDate(date.getDate() + days); return iso(date); };
  take(/\s(today|tonight)\b/i, () => due = daysFromToday(0));
  if (!due) take(/\s(tomorrow|tmrw|tom)\b/i, () => due = daysFromToday(1));
  if (!due) take(/\snext week\b/i, () => due = daysFromToday(7));
  if (!due) take(/\sin (\d{1,3}) (day|days|week|weeks)\b/i, match => due = daysFromToday(Number(match[1]) * (/week/i.test(match[2]) ? 7 : 1)));
  // Weekday name: the next occurrence, never today.
  if (!due) take(/\s(?:on |by )?(sun|mon|tue|wed|thu|fri|sat)[a-z]*\b/i, match => {
    const weekday = WD.indexOf(match[1].toLowerCase());
    let offset = (weekday - today.getDay() + 7) % 7;
    if (offset === 0) offset = 7;
    due = daysFromToday(offset);
  });
  // "12 Mar" / "Mar 12": dates already past roll over to next year.
  if (!due) take(/\s(?:on |by )?(\d{1,2})(?:st|nd|rd|th)? (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i, match => {
    const date = new Date(today.getFullYear(), MON.indexOf(match[2].toLowerCase()), Number(match[1]));
    if (date < today) date.setFullYear(date.getFullYear() + 1);
    due = iso(date);
  });
  if (!due) take(/\s(?:on |by )?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* (\d{1,2})\b/i, match => {
    const date = new Date(today.getFullYear(), MON.indexOf(match[1].toLowerCase()), Number(match[2]));
    if (date < today) date.setFullYear(date.getFullYear() + 1);
    due = iso(date);
  });
  // Day/month[/year] (Indian order).
  if (!due) take(/\s(?:on |by )?(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/, match => {
    let year = match[3] ? Number(match[3]) : today.getFullYear();
    if (year < 100) year += 2000;
    const date = new Date(year, Number(match[2]) - 1, Number(match[1]));
    if (!match[3] && date < today) date.setFullYear(date.getFullYear() + 1);
    due = iso(date);
  });
  return { title: rest.replace(/\s+/g, ' ').trim(), owner, co, pri, due };
}
/** Starting data for a new workspace: empty lists (no demo tasks, research, finance or roles). */
export function seed() {
  return { tasks: [], research: [], fin: {}, roles: [] };
}
export const DOC_TPL = [
  ['Meeting notes', 'Agenda, notes, decisions, next steps', '# Agenda\n- \n# Notes\n- \n# Decisions\n- \n# Next steps\n- [ ] '],
  ['Project brief', 'Goal, scope, timeline, owners', '# Goal\nWhat are we trying to achieve?\n# Scope\n- In:\n- Out:\n# Timeline\n1. \n# Owners\n- \n# Risks\n- '],
  ['SOP / How-to', 'Step-by-step process anyone can follow', '# Purpose\nWhen to use this.\n# Steps\n1. \n2. \n3. \n# Checklist\n- [ ] \n# Owner\n'],
  ['Client proposal', 'Problem, solution, pricing, timeline', '# The problem\n\n# Our solution\n\n# Scope of work\n- \n# Pricing\n- \n# Timeline\n1. \n# Next steps\n- [ ] '],
  ['1:1 notes', 'Wins, blockers, feedback, actions', '# Wins\n- \n# Blockers\n- \n# Feedback\n- \n# Actions\n- [ ] '],
  ['Client onboarding', 'Kick-off checklist for new clients', '# Kick-off\n- [ ] Contract signed\n- [ ] Invoice sent\n- [ ] Access shared\n- [ ] Kick-off call booked\n# Contacts\n- \n# Notes\n']
];
export const FTYPES = [['pdf', 'PDF', /pdf$/i], ['img', 'Images', /(png|jpe?g|gif|webp|svg|heic)$/i], ['doc', 'Documents', /(docx?|txt|md|rtf|odt|pages)$/i], ['sheet', 'Spreadsheets', /(xlsx?|csv|numbers|ods)$/i], ['slide', 'Presentations', /(pptx?|key|odp)$/i], ['zip', 'Archives', /(zip|rar|7z|tar|gz)$/i]];
/** File-type bucket ('pdf', 'img', 'doc', …) from a file name's extension. */
export const ftypeOf = fileName => {
  const extension = (fileName.split('.').pop() || '').toLowerCase();
  const fileType = FTYPES.find(entry => entry[2].test(extension));
  return fileType ? fileType[0] : 'other';
};
export const FT_C = {
  pdf: ['oklch(0.95 0.035 25)', 'oklch(0.48 0.17 25)'],
  img: ['oklch(0.95 0.035 300)', 'oklch(0.45 0.13 300)'],
  doc: ['oklch(0.95 0.03 255)', 'oklch(0.42 0.13 255)'],
  sheet: ['oklch(0.95 0.04 150)', 'oklch(0.4 0.11 150)'],
  slide: ['oklch(0.96 0.045 70)', 'oklch(0.47 0.12 60)'],
  zip: ['oklch(0.95 0.005 265)', 'oklch(0.42 0.012 265)'],
  other: ['oklch(0.95 0.005 265)', 'oklch(0.42 0.012 265)'],
};
/** Editor blocks -> Markdown (inverse of mdToBlocks). */
export const blocksToMd = blocks => (blocks || []).map(block =>
  block.type === 'h1' ? '# ' + block.text
    : block.type === 'h2' ? '## ' + block.text
      : block.type === 'h3' ? '### ' + block.text
        : block.type === 'bullet' ? '- ' + block.text
          : block.type === 'num' ? '1. ' + block.text
            : block.type === 'todo' ? '- [' + (block.checked ? 'x' : ' ') + '] ' + block.text
              : block.type === 'quote' ? '> ' + block.text
                : block.type === 'divider' ? '---'
                  : block.text
).join('\n');

/** Starter constitution: the 8 setup playbooks, no articles or rules yet (founders write their own). */
export function seedConstitution() {
  /**
   * Template owners 'rahul' / 'saswat' mean "a founder" / "a co-founder": the first current member with
   * that role (the original seat when it is still held), else all founders.
   */
  const seedOwner = owner => {
    if (owner !== 'rahul' && owner !== 'saswat') return owner || 'both';
    if (MEMBERS.includes(owner)) return owner;
    const wanted = owner === 'rahul' ? 'founder' : 'cofounder';
    return MEMBERS.find(id => PEOPLE[id].hqRole === wanted) || 'both';
  };
  /** Playbook section; each step is a plain string or [text, owner, days, must, help]. */
  const section = (title, steps) => ({
    id: uid(),
    title,
    steps: steps.map(step => {
      const [text, owner, days, must, help] = Array.isArray(step) ? step : [step];
      return { id: uid(), text, owner: seedOwner(owner), days: days || 0, must: must !== false, help: help || '' };
    }),
  });
  return {
    articles: [],
    // An empty list tells XmigrateCons not to pre-fill the sample rules.
    rules: [],
    playbooks: [
      { id: uid(), name: 'Company formation · India (Pvt Ltd)', cat: 'Legal', country: 'India', desc: 'Register a Private Limited company in India and get tax and compliance in place.', sections: [
        section('Name & structure', [['Check name availability on MCA (RUN)', 'rahul', 2], ['Agree shareholding split between founders', 'both', 3], ['Get DSC (digital signature) for all directors', 'both', 3], ['Apply DIN for directors', 'rahul', 3]]),
        section('Incorporation', [['File SPICe+ incorporation form', 'rahul', 7], ['Draft MoA and AoA', 'rahul', 3], ['Receive Certificate of Incorporation, PAN and TAN', 'rahul', 10], ['Open a current bank account', 'saswat', 5]]),
        section('Tax & compliance', [['GST registration', 'saswat', 7], ['Shops & Establishment / Professional tax', 'saswat', 7], ['Udyam (MSME) registration', 'saswat', 1, false], ['Appoint first auditor within 30 days (ADT-1)', 'rahul', 30], ['Set up compliance calendar (ROC, GST, TDS dates)', 'saswat', 2]]),
        section('Protection', [['File trademark for name and logo', 'rahul', 3], ['Founders\' agreement and IP assignment signed', 'both', 7], ['Startup India (DPIIT) recognition', 'rahul', 10, false]])
      ] },
      { id: uid(), name: 'Company formation · USA (Delaware C-Corp)', cat: 'Legal', country: 'USA', desc: 'Set up a US company that can raise money and sell to US customers. Confirm current rules with a US lawyer or CPA.', sections: [
        section('Formation', [['Choose entity: Delaware C-Corp (for investors) or LLC (simpler)', 'both', 2], ['Incorporate via Stripe Atlas, Clerky or a registered agent', 'rahul', 7], ['Adopt bylaws and issue founder stock with vesting', 'both', 5], ['File 83(b) elections within 30 days of stock grant', 'both', 30, true, 'Strict deadline. Missing it can cost a lot in tax later.']]),
        section('Tax & IDs', [['Get EIN from the IRS', 'rahul', 10], ['Register in the state where you operate (if not Delaware)', 'rahul', 10, false], ['Check BOI reporting requirement (FinCEN)', 'rahul', 2, true, 'Rules have changed recently. Check the current requirement.'], ['Form 5472 if foreign-owned', 'saswat', 0, true], ['Calendar Delaware franchise tax and annual report (due 1 March)', 'saswat', 1]]),
        section('Banking & payments', [['Open US bank account (e.g. Mercury, Brex)', 'saswat', 7], ['Set up Stripe for payments', 'saswat', 3], ['Accounting software and bookkeeper', 'saswat', 7]]),
        section('Legal basics', [['Register trademark with USPTO', 'rahul', 5, false], ['Standard contracts: MSA, NDA, Terms, Privacy policy', 'rahul', 7]])
      ] },
      { id: uid(), name: 'Company formation · UAE (Free Zone)', cat: 'Legal', country: 'UAE', desc: 'Free zone company for Middle East clients. Choose the zone based on activity and visa needs.', sections: [
        section('Setup', [['Pick free zone and business activity', 'both', 3], ['Reserve trade name', 'rahul', 2], ['Submit licence application and documents', 'rahul', 10], ['Receive trade licence', 'rahul', 10]]),
        section('After licence', [['Establishment card and visas', 'rahul', 14], ['Corporate bank account', 'saswat', 21], ['Register for UAE corporate tax and VAT if needed', 'saswat', 7]])
      ] },
      { id: uid(), name: 'Brand & UI quality standard', cat: 'Quality', country: 'Any', desc: 'Every company looks professional and every screen meets a high bar.', sections: [
        section('Brand kit', [['Final name, logo, colours and fonts in one brand kit', 'both', 7], ['Tone of voice: 5 do\'s and don\'ts', 'saswat', 2], ['Email signature, letterhead, invoice template', 'saswat', 2]]),
        section('UI standard', [['Design system: components, spacing, type scale', 'team', 10], ['Every screen works on mobile and desktop', 'team', 0], ['Accessibility: contrast, readable sizes, keyboard use', 'team', 0], ['Copy is clear and simple, reviewed by a founder', 'both', 0], ['Founder sign-off before each launch', 'both', 0]]),
        section('Online presence', [['Domain bought in company name', 'rahul', 1], ['Website live with SSL and analytics', 'team', 10], ['LinkedIn page and social handles reserved', 'saswat', 1]])
      ] },
      { id: uid(), name: 'Tech & security baseline', cat: 'Security', country: 'Any', desc: 'Accounts and data are safe and owned by the company.', sections: [
        section('Accounts', [['Google Workspace / email on company domain', 'rahul', 1], ['Shared password manager set up', 'rahul', 1], ['2FA on every account', 'both', 2], ['GitHub organisation owned by the company', 'rahul', 1], ['Cloud accounts (AWS / GCP) in company name', 'rahul', 1]]),
        section('Safety', [['Backups for code and data', 'team', 2], ['Uptime and error monitoring', 'team', 2], ['Offboarding checklist: remove access same day', 'saswat', 1]])
      ] },
      { id: uid(), name: 'Finance & control', cat: 'Money', country: 'Any', desc: 'Clean books and clear spending rules from day one.', sections: [
        section('Setup', [['Separate company bank account. No personal mixing', 'saswat', 1], ['Accounting software and chart of accounts', 'saswat', 3], ['Payroll and TDS / tax withholding set up', 'saswat', 5], ['Spend approval rules from the Constitution shared with team', 'both', 1]]),
        section('Rhythm', [['Books closed by the 10th each month', 'saswat', 0], ['Monthly actuals entered in Finance', 'saswat', 0], ['Annual budget approved by both founders', 'both', 5]])
      ] },
      { id: uid(), name: 'People & first hires', cat: 'People', country: 'Any', desc: 'Contracts, policies and onboarding ready before the first hire joins.', sections: [
        section('Paperwork', [['Offer letter and appointment letter templates', 'saswat', 2], ['NDA and IP assignment for everyone', 'rahul', 1], ['Employee handbook and leave policy', 'saswat', 5], ['PF / ESI registration when required (India)', 'saswat', 7, false]]),
        section('Onboarding', [['Onboarding checklist and buddy', 'saswat', 1], ['Laptop, accounts and access ready on day one', 'rahul', 1]])
      ] },
      { id: uid(), name: 'Launch & go-to-market', cat: 'Growth', country: 'Any', desc: 'From zero to first paying customers.', sections: [
        section('Ready to sell', [['Ideal customer profile written down', 'both', 2], ['Pricing decided and logged in Decisions', 'both', 3], ['Sales deck and one-pager', 'saswat', 5], ['Landing page with signup and analytics', 'team', 7]]),
        section('First customers', [['List of first 50 target customers', 'saswat', 3], ['First 10 conversations booked', 'saswat', 14], ['First paying customer', 'both', 30]])
      ] }
    ],
    log: [{ at: Date.now(), by: 'both', text: 'Constitution created with 8 playbooks' }]
  };
}
export const CN_CATS = [
  'Quality',
  'Legal',
  'Money',
  'Control',
  'Security',
  'People',
  'Rhythm',
  'Decisions',
  'Brand',
  'Growth',
  'Other',
];
export const CT_TYPES = [
  'Customer',
  'Vendor',
  'Employment',
  'NDA',
  'Partnership',
  'Lease',
  'Shareholder / investor',
  'IP assignment',
  'Consultant',
  'Other',
];
export const CT_ST = {
  Draft: ['oklch(0.95 0.005 265)', 'oklch(0.42 0.012 265)'],
  'Under review': ['oklch(0.95 0.03 265)', 'oklch(0.42 0.13 265)'],
  Active: ['oklch(0.95 0.05 150)', 'oklch(0.4 0.11 150)'],
  Renewing: ['oklch(0.96 0.05 85)', 'oklch(0.45 0.12 65)'],
  Expired: ['oklch(0.95 0.035 25)', 'oklch(0.48 0.17 25)'],
  Terminated: ['oklch(0.95 0.005 265)', 'oklch(0.5 0.012 265)'],
};
export const SC_SUGG = [
  ['Revenue this week', '₹', 'up', 'manual'],
  ['New customers', '#', 'up', 'manual'],
  ['Sales pipeline', '₹', 'up', 'manual'],
  ['Cash in bank', '₹', 'up', 'manual'],
  ['Tasks done', '#', 'up', 'tasks_done'],
  ['Tasks slipped', '#', 'down', 'tasks_slipped'],
  ['Decisions made', '#', 'up', 'decisions'],
  ['Customer complaints', '#', 'down', 'manual'],
  ['Website leads', '#', 'up', 'manual'],
  ['Team headcount', '#', 'up', 'manual'],
];
export const SY_STEPS = [
  ['Check-in', 5, 'One personal and one business win each. Keep it short.'],
  ['Scorecard', 5, 'Only talk about numbers that are off goal. Anything that needs a real conversation goes to Issues.'],
  ['Goals', 5, 'Goals that are behind or overdue.'],
  ['Tasks', 5, 'Overdue tasks. Finish them, move them, or turn them into an issue.'],
  ['Decisions & approvals', 10, 'Open decisions and constitution items waiting for a founder.'],
  ['Issues', 15, 'Work through the most important issues first. Solve each one by making it a task or a decision.'],
  ['Wrap-up', 5, 'Check the new tasks, rate the meeting and save it.'],
];
/** Live mm:ss timer for the weekly sync; turns orange once `props.target` minutes have passed. */
export function SyncClock(props) {
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => tick(count => count + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  const elapsedSec = Math.max(0, Math.floor((Date.now() - props.start) / 1000));
  const overTime = props.target && elapsedSec > props.target * 60;
  return React.createElement(
    'span',
    { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 500, color: overTime ? 'oklch(0.78 0.15 50)' : '#fff' } },
    String(Math.floor(elapsedSec / 60)).padStart(2, '0') + ':' + String(elapsedSec % 60).padStart(2, '0'),
  );
}
export const XCH = [
  ['phi', 'PHI', 'Founders\' Philosophy', 'Our vision, mission, values and business philosophy'],
  ['gov', 'GOV', 'Founder Governance', 'Roles, responsibilities, authority and accountability'],
  ['cre', 'CRE', 'Company Creation Rules', 'How to evaluate, approve and launch a new company'],
  ['prd', 'PRD', 'Product Creation Rules', 'How to identify, validate, build and launch products'],
  ['str', 'STR', 'Business Strategy', 'How we set goals, select markets and grow businesses'],
  ['fin', 'FIN', 'Financial Constitution', 'Budgets, investments, spending and financial discipline'],
  ['ppl', 'PPL', 'Hiring & People', 'Hiring philosophy, leadership and organisational culture'],
  ['dec', 'DEC', 'Decision-Making Framework', 'Who decides what, approvals and disagreements'],
  ['exe', 'EXE', 'Execution Standards', 'Tasks, deadlines, reviews and accountability'],
  ['tec', 'TEC', 'Technology & AI Policy', 'Technology choices, automation, AI adoption and security'],
  ['mkt', 'MKT', 'Sales & Marketing Standards', 'Customer acquisition, pricing and brand positioning'],
  ['leg', 'LEG', 'Legal & Compliance', 'Company registration, contracts, IP and compliance'],
  ['rsk', 'RSK', 'Risk Management', 'Business risks, cash protection and contingency planning'],
  ['con', 'CON', 'Conflict & Dispute Resolution', 'How founders handle disagreements and deadlocks'],
  ['amd', 'AMD', 'Amendments & Exceptions', 'How constitutional rules can be changed or waived'],
];
export const XRULE_SEED = [
  ['phi', 'Build fast, validate early, invest based on evidence', 'Every company and product in the group is built quickly, tested with real customers early, and gets further investment only when the evidence supports it.'],
  ['phi', 'One constitution for every company', 'Every company under the group follows this constitution, so each new company starts from an established framework instead of from scratch.'],
  ['phi', 'Write down our vision, mission and values', 'The founders record the group vision, mission, values and business philosophy here and review them every year.', 'R', 1, 'both', 'Draft'],
  ['gov', 'Level 1 · Independent authority', 'Routine operational decisions are made by the responsible founder or delegated manager within approved budgets and limits.'],
  ['gov', 'Level 2 · Joint approval', 'New company launches, major investments, borrowing, ownership changes, large commitments and strategic pivots need approval from both founders.'],
  ['gov', 'Level 3 · Reserved matters', 'Matters requiring formal approval under shareholder agreements, board rules or applicable law. No founder should assume unilateral authority over these matters.'],
  ['gov', 'Every area has a designated owner', 'Company operations have a designated company owner, product strategy a designated product owner and hiring a designated hiring owner, so small decisions do not wait for both founders.', 'M', 2],
  ['cre', 'No major commitment without an approved proposal', 'No new company should receive significant capital or incur major commitments without a documented business proposal and the required founder approvals.'],
  ['cre', 'Every new company passes the 7-stage process', 'Opportunity identification, market research, business feasibility, founders\' approval, business setup, launch plan and review. No stage is skipped.', 'M', 2],
  ['cre', 'Every proposal answers the 11 mandatory questions', 'Company name, business opportunity, problem, target market, revenue model, initial investment, ownership, team requirement, 12-month target, risk analysis and exit criteria.', 'M', 2],
  ['cre', 'Review every new company at 30, 60 and 90 days', 'At each review the founders decide whether to continue, pivot, invest more or stop.', 'M', 2],
  ['prd', 'No product without a defined customer problem', 'No product should be built without a defined customer problem.'],
  ['prd', 'Every product has a Product Owner', 'Every product must have a Product Owner.'],
  ['prd', 'Every product has a defined target market', 'Every product must have a defined target market.'],
  ['prd', 'MVP scope is clearly defined', 'MVP scope must be clearly defined.'],
  ['prd', 'Product development has a budget and deadline', 'Product development must have a budget and deadline.'],
  ['prd', 'Customer feedback shapes product decisions', 'Customer feedback must influence product decisions.'],
  ['prd', 'Every product has measurable success KPIs', 'Every product must have measurable success KPIs.'],
  ['prd', 'AI and automation from day one', 'AI and automation should be considered from day one.', 'R'],
  ['prd', 'Validate demand before adding features', 'Avoid building unnecessary features before validating demand.', 'R'],
  ['prd', 'Every product has a commercialisation strategy', 'Every product must have a commercialisation strategy.'],
  ['prd', 'Every product follows the 10-stage process', 'Idea, research, validation, business model, PRD, MVP, testing, launch, growth and review.', 'M', 2],
  ['str', 'Yearly goals for every company', 'Each company sets yearly goals and chooses its markets deliberately. Goals are tracked in Goals and reviewed every quarter.', 'R', 2, 'both', 'Draft'],
  ['fin', 'Every company keeps its own financial records', 'Every company must have its own financial records.'],
  ['fin', 'Approved annual budget', 'Every company must maintain an approved annual budget.'],
  ['fin', 'Expenses have a business purpose', 'Expenses must have a legitimate business purpose.'],
  ['fin', 'Major investments need a business case', 'Major investments require a documented business case.'],
  ['fin', 'Monthly financial reporting', 'Monthly financial reporting is mandatory.'],
  ['fin', 'Monthly cash-flow review', 'Cash flow must be reviewed every month.'],
  ['fin', 'Company and personal money stay separate', 'Company money and personal money must remain separate.'],
  ['fin', 'Inter-company transactions are documented', 'Inter-company transactions must be documented.'],
  ['fin', 'Financial feasibility for every new product', 'Every new product must have a financial feasibility assessment.'],
  ['fin', 'Loss-making products get a continuation decision', 'Loss-making products must have a defined review and continuation decision.'],
  ['fin', 'Monthly report by the fifth working day', 'Every company must submit a monthly financial report by the fifth working day.', 'M', 2],
  ['ppl', 'Hire for capability and need', 'Hire based on capability and business requirements.'],
  ['ppl', 'Every position has a job description', 'Every position must have a defined job description.'],
  ['ppl', 'Every employee has measurable KPIs', 'Every employee must have measurable KPIs.'],
  ['ppl', 'Managers are accountable for team performance', 'Managers must be accountable for team performance.'],
  ['ppl', 'Performance reviews are documented', 'Performance reviews should be documented.'],
  ['ppl', 'Leadership roles have defined authority', 'Leadership positions should have clearly defined authority.'],
  ['ppl', 'Stay within the approved manpower budget', 'No department should hire beyond its approved manpower budget.'],
  ['ppl', 'Security and confidentiality for everyone', 'Every employee must follow company security and confidentiality policies.'],
  ['ppl', 'AI-first workforce', 'Build an AI-first workforce wherever practical.', 'R'],
  ['ppl', 'Reward performance and ownership', 'Reward performance, ownership and responsible behaviour.', 'R'],
  ['dec', 'Record every significant decision', 'If a decision affects company strategy, finance, people, product or long-term commitments, it must be recorded in Founder OS.'],
  ['dec', 'Every decision record is complete', 'Every decision contains: title, related company, category, discussion summary, options considered, final decision, decision owner, approvers, implementation deadline and review date.', 'M', 2],
  ['exe', 'Every task has one owner and a due date', 'Work agreed in a meeting becomes a task in Founders HQ with a single owner and a due date.', 'R', 2],
  ['tec', 'Approved AI tools for company data', 'Company data goes only into AI tools the founders have approved for that purpose.', 'R', 2, 'both', 'Draft'],
  ['mkt', 'Pricing decisions are logged', 'Pricing for every product is decided with founder approval and logged in Decisions.', 'R', 2, 'both', 'Draft'],
  ['leg', 'This is an internal framework', 'This constitution is an internal governance framework. It does not replace articles of association, shareholder agreements, board resolutions or statutory policies; those are aligned with professional legal advice.'],
  ['rsk', 'A contingency plan for every company', 'Each company keeps a short plan for its top risks, such as losing a key customer, a key person or cash.', 'R', 2, 'both', 'Draft'],
  ['con', 'Disagreements are written down', 'When founders disagree on a Level 2 matter, each writes their position and the options in Decisions. If there is no agreement within 7 days, the matter waits until both agree or a mutually chosen advisor is consulted.', 'R', 1, 'both', 'Draft'],
  ['amd', 'No one silently overwrites a rule', 'A founder proposes a change, the reason is recorded, the other founders review it, approval is obtained, the new version becomes effective and the previous version stays in history.'],
  ['amd', 'Exceptions are documented and expire', 'Temporary deviations from a rule are documented, approved by both founders and given an expiry date in the exception register.']
];
export const XAUTH_DEF = { limit: 500000, emergency: 'In an emergency that threatens cash, people, customers or legal standing, any founder may act at once to protect the business, then records the action in Decisions within 24 hours for the other founders to review.', absence: 'If a founder cannot be reached for more than 3 working days, the other founders may take Level 1 decisions in their area. Level 2 matters wait unless emergency authority applies.',
  matrix: [['Overall group vision', 'All founders', 2], ['New company proposals', 'All founders', 2], ['Strategic investments', 'All founders', 2], ['Company operations', 'Designated company owner', 1], ['Product strategy', 'Designated product owner', 1], ['Hiring leadership', 'Designated hiring owner', 1], ['Finance planning', 'Finance owner + founder oversight', 1], ['Major business decisions', 'All founders where reserved', 2]].map(([area, who, lvl], position) => ({ id: 'm' + position, area, who, lvl })) };
export const XMATTERS = [
  ['ops', 'Routine operational spend or decision', 1],
  ['hire', 'Hiring within approved manpower budget', 1],
  ['hireover', 'Hiring beyond approved budget', 2],
  ['company', 'Launching a new company', 2],
  ['invest', 'Major investment', 2],
  ['borrow', 'Borrowing or debt', 2],
  ['commit', 'Large long-term commitment', 2],
  ['pivot', 'Strategic pivot', 2],
  ['own', 'Ownership or shareholding change', 2],
  ['reserved', 'Matter reserved by shareholder agreement, board or law', 3],
];
export const XCST = [
  ['Opportunity', 'What problem are we solving? Who needs this business? Why now?'],
  ['Market research', 'Market size, customer demand, competitors, pricing and business opportunity.'],
  ['Feasibility', 'Revenue model, expected costs, investment requirement, profitability and risks.'],
  ['Founders\' approval', 'The founders review the proposal, discuss responsibilities and approve or reject it.'],
  ['Business setup', 'Name, ownership, legal structure, registration, banking, domain, brand and initial team.'],
  ['Launch plan', '90-day roadmap, budget, team, customers and measurable milestones.'],
  ['Review', 'Review performance at 30, 60 and 90 days. Decide whether to continue, pivot, invest more or stop.'],
];
export const XPST = [
  ['Idea', 'Document the problem and proposed solution'],
  ['Research', 'Analyse customers and competitors'],
  ['Validation', 'Speak to potential customers'],
  ['Business model', 'Decide pricing and monetisation'],
  ['PRD', 'Prepare product requirement document'],
  ['MVP', 'Build minimum viable product'],
  ['Testing', 'QA and real-user testing'],
  ['Launch', 'Controlled market launch'],
  ['Growth', 'Track adoption and revenue'],
  ['Review', 'Improve, pivot or discontinue'],
];
export const XCFLD = [
  ['opp', 'Business opportunity', 'What are we building?'],
  ['problem', 'Problem', 'What problem will we solve?'],
  ['market', 'Target market', 'India, USA, UAE, etc.'],
  ['revenue', 'Revenue model', 'How will we earn?'],
  ['invest', 'Initial investment', 'Capital required'],
  ['own', 'Ownership', 'Shareholding and founder roles'],
  ['team', 'Team requirement', 'Initial team'],
  ['target', '12-month target', 'Revenue and business milestones'],
  ['risk', 'Risk analysis', 'What can go wrong?'],
  ['exit', 'Exit criteria', 'When should we stop or pivot?'],
];
export const XPFLD = [
  ['problem', 'Customer problem', 'What problem does the customer have?'],
  ['solution', 'Proposed solution', 'What will we build?'],
  ['po', 'Product owner', 'Who owns this product?'],
  ['market', 'Target market', 'Who buys it, and where?'],
  ['mvp', 'MVP scope', 'What is in and out of the first version?'],
  ['budget', 'Budget', 'How much can we spend to reach MVP?'],
  ['deadline', 'Deadline', 'When must the MVP be ready?'],
  ['kpis', 'Success KPIs', 'How will we measure success?'],
  ['ai', 'AI & automation', 'How AI and automation are used from day one'],
  ['comm', 'Commercialisation', 'Pricing and how it reaches customers'],
];
export const XRST = {
  Draft: ['oklch(0.95 0.005 265)', 'oklch(0.42 0.012 265)'],
  Pending: ['oklch(0.96 0.05 85)', 'oklch(0.45 0.12 65)'],
  Active: ['oklch(0.95 0.05 150)', 'oklch(0.4 0.11 150)'],
  Archived: ['oklch(0.95 0.012 25)', 'oklch(0.5 0.07 25)'],
};
export const XSTL = { Draft: 'Draft', Pending: 'Pending approval', Active: 'Active', Archived: 'Archived' };
export const XLVL = { 1: 'L1 · Constitution', 2: 'L2 · Group policy', 3: 'L3 · Playbook' };
export const XEXC = {
  Active: ['oklch(0.96 0.05 85)', 'oklch(0.45 0.12 65)'],
  Pending: ['oklch(0.95 0.03 265)', 'oklch(0.42 0.13 265)'],
  Expired: ['oklch(0.95 0.005 265)', 'oklch(0.5 0.012 265)'],
  Revoked: ['oklch(0.95 0.025 25)', 'oklch(0.5 0.15 25)'],
};
export const XAITAG = {
  'APPROVED RULE': ['oklch(0.95 0.05 150)', 'oklch(0.38 0.11 150)', 'An active, mandatory rule covers it.'],
  'RECOMMENDED PRACTICE': ['oklch(0.95 0.03 230)', 'oklch(0.4 0.1 230)', 'An active rule recommends it, but it is not mandatory.'],
  'PENDING PROPOSAL': ['oklch(0.96 0.05 85)', 'oklch(0.45 0.12 65)', 'Only a draft, pending rule or amendment covers it. Not binding yet.'],
  'MISSING RULE': ['oklch(0.95 0.035 25)', 'oklch(0.48 0.17 25)', 'Nothing covers it. The founders need to decide.'],
};
export const CX_HUES = [265, 160, 55, 25, 300, 210, 120, 340, 85, 190];
export const XfmtL = ms => new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const XfmtIso = isoDate => isoDate ? XfmtL(new Date(isoDate + 'T00:00:00')) : '—';

/** Next rule code for a chapter, e.g. "FIN-007" (one more than the highest existing number). */
export function XnextCode(rules, chapterId) {
  const prefix = (XCH.find(chapter => chapter[0] === chapterId) || XCH[0])[1];
  const usedNumbers = rules
    .filter(rule => (rule.code || '').startsWith(prefix + '-'))
    .map(rule => parseInt(rule.code.split('-')[1], 10) || 0);
  const nextNumber = Math.max(0, ...usedNumbers) + 1;
  return prefix + '-' + String(nextNumber).padStart(3, '0');
}

/**
 * Upgrades an older constitution in place: builds `rules` from XRULE_SEED plus the legacy articles
 * (articles signed by both founders become Active), and fills in any missing collections.
 */
export function XmigrateCons(constitution) {
  if (!constitution) return constitution;
  if (!constitution.rules) {
    const now = Date.now(), rules = [], today = iso(new Date());
    const addRule = (chapterId, title, text, kind, level, owner, status, sign) => {
      const ruleStatus = status || 'Pending';
      rules.push({
        id: uid(),
        code: XnextCode(rules, chapterId),
        ch: chapterId,
        title,
        text,
        kind,
        level: level || 1,
        scope: 'all',
        owner: owner || 'both',
        effective: ruleStatus === 'Active' ? today : '',
        status: ruleStatus,
        sign: sign || [],
        v: 1,
        versions: ruleStatus === 'Active' ? [{ v: 1, title, text, at: now, by: 'both', reason: 'Original wording' }] : [],
        docs: [],
        by: 'both',
        created: now,
      });
    };
    XRULE_SEED.forEach(([chapterId, title, text, kindCode, level, owner, status]) =>
      addRule(chapterId, title, text, kindCode === 'R' ? 'Recommended' : 'Mandatory', level, owner, status));
    const chapterOfCategory = { Quality: 'prd', Legal: 'leg', Control: 'leg', Money: 'fin', Security: 'tec', People: 'ppl', Rhythm: 'exe', Decisions: 'dec', Brand: 'mkt', Growth: 'str', Other: 'phi' };
    (constitution.articles || []).forEach(legacyArticle => {
      const signedByBoth = ['rahul', 'saswat'].every(person => (legacyArticle.sign || []).includes(person));
      addRule(
        /runway/i.test(legacyArticle.title) ? 'rsk' : chapterOfCategory[legacyArticle.cat] || 'phi',
        legacyArticle.title,
        legacyArticle.text,
        legacyArticle.must ? 'Mandatory' : 'Recommended',
        1,
        'both',
        signedByBoth ? 'Active' : 'Pending',
        signedByBoth ? ['rahul', 'saswat'] : (legacyArticle.sign || []),
      );
    });
    constitution.rules = rules;
  }
  if (!constitution.amendments) constitution.amendments = [];
  if (!constitution.exceptions) constitution.exceptions = [];
  if (!constitution.ventures) constitution.ventures = [];
  if (!constitution.asks) constitution.asks = [];
  if (!constitution.authority) constitution.authority = JSON.parse(JSON.stringify(XAUTH_DEF));
  if (!constitution.version) constitution.version = '1.0';
  return constitution;
}
export const CO_STATUS = {
  'Idea': 'oklch(0.7 0.01 265)',
  'Setting up': 'oklch(0.75 0.15 70)',
  'Active': 'oklch(0.58 0.14 150)',
  'Paused': 'oklch(0.6 0.1 300)',
  'Closed': 'oklch(0.62 0.17 25)',
};
export const COUNTRIES = ['India', 'USA', 'UAE', 'UK', 'Singapore', 'Other'];
export const ENTITIES = {
  India: ['Private Limited', 'LLP', 'OPC', 'Partnership'],
  USA: ['Delaware C-Corp', 'LLC', 'S-Corp'],
  UAE: ['Free Zone LLC', 'Mainland LLC'],
  UK: ['Private Ltd'],
  Singapore: ['Pte Ltd'],
  Other: ['Company'],
};
/** Weekly reviews were once stored as plain strings; normalise to an object. */
export const normRv = review => typeof review === 'string' ? { summary: review } : (review || {});
/** Workspace data ready for HQ: `saved` (from the server) back-filled, or empty starting data when there is none. */
export function load(saved) { return ensureCos(load0(saved)); }

/** Back-fills fields added since `saved` was written; falls back to empty starting data when it is missing or unusable. */
export function load0(saved) {
  try {
    // `tasks` are the founders' own tasks (My tasks); HQ's Team tasks come from the internal portal.
    // It also marks a usable saved workspace.
    if (saved && saved.tasks) {
      saved.pages = (saved.pages || []).map(page => page.blocks
        ? page
        : { ...page, blocks: mdToBlocks(page.body || ''), created: page.created || page.updated });
      saved.files = saved.files || [];
      saved.goals = saved.goals || [];
      saved.decisions = saved.decisions || [];
      saved.activity = saved.activity || [];
      saved.reviews = saved.reviews || {};
      saved.roles.forEach(role => { role.notes = role.notes || ''; });
      saved.tasks.forEach(task => {
        if (!task.status) task.status = task.done ? 'Done' : 'Not started';
        task.start = task.start || '';
      });
      return saved;
    }
  } catch {
    // Missing or corrupt data: fall through to the empty starting data below.
  }
  const data = seed();
  data.pages = [];
  data.files = [];
  data.goals = [];
  data.decisions = [];
  data.activity = [];
  data.reviews = {};
  data.tasks.forEach(task => { task.status = task.status || 'Not started'; task.start = task.start || ''; });
  return data;
}
