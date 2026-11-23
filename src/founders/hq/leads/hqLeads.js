/**
 * Portal leads are Founders HQ's only sales pipeline.
 *
 * The internal portal's leads (loaded into the portal store by the bridge, see teamTasks/portalBridge)
 * are read here in the shape HQ's pages use (Today, the brief, Customers, Contracts, the sidebar badge,
 * the AI context), and opened / created in HQ → Sales → Pipeline, which hosts the portal's Leads page.
 * The founders' own deals of the old HQ (workspace `data.deals`) stay in storage but are no longer shown
 * or used.
 */
import { useStore } from '@/store';
import { DEFAULT_COMPANY } from '@/features/team-tasks/companies';
import { teamCompanyOf } from '../teamTasks/hqTeamTasks';
import { connect, loadSalesData, setLeadsCompany, useLeadsCompany, usePortalBridge } from '../teamTasks/portalBridge';

/** How often HQ re-reads the leads while a page that shows them is open. */
export const LEADS_REFRESH_MS = 3 * 60 * 1000;
/** HQ views that show leads; opening one re-reads them. */
export const LEAD_VIEWS = ['home', 'brief', 'pipeline', 'customers', 'contracts'];

const CLOSED = ['Won', 'Lost'];
const pad = (n) => String(n).padStart(2, '0');
const ymd = (t) => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

/**
 * One portal lead in HQ's shape: { id, name (client company), acct, contact, email, phone, co, value,
 * stage (portal stage), open, won, lost, owner (name), ownerId, seat ('rahul' | 'saswat' | null: the
 * founder who owns it), source, services, next / nextDate / nextAt (earliest open follow-up), created,
 * updated (last activity), wonAt }.
 */
function toHQLead(l, { ownerName, seatOf, nextOf }) {
  const acts = l.acts || [];
  const last = acts.reduce((max, a) => Math.max(max, a.t || 0), l.created || 0);
  const wonAct = acts.filter((a) => a.kind === 'status' && /→ Won$/.test(a.text || '')).pop();
  const nf = nextOf.get(l.id);
  return {
    id: l.id,
    name: l.company || l.contact || l.id,
    acct: l.company || '',
    contact: l.contact || '',
    email: l.email || '',
    phone: l.phone || '',
    co: l.co || DEFAULT_COMPANY,
    value: Number(l.value) || 0,
    stage: l.status,
    open: !CLOSED.includes(l.status),
    won: l.status === 'Won',
    lost: l.status === 'Lost',
    owner: ownerName.get(l.owner) || 'Unassigned',
    ownerId: l.owner || null,
    seat: seatOf.get(l.owner) || null,
    source: l.source || '',
    services: l.service || '',
    next: nf ? nf.type + ' · ' + nf.title : '',
    nextDate: nf ? ymd(nf.due) : '',
    nextAt: nf ? nf.due : null,
    created: l.created || 0,
    updated: last,
    wonAt: l.status === 'Won' ? (wonAct ? wonAct.t : last) : null,
  };
}

/** Every lead the founder can see, in HQ's shape. Empty until the portal session and sales data have loaded. */
export function hqLeads() {
  const bridge = usePortalBridge.getState();
  if (bridge.status !== 'ready' || bridge.rest !== 'ready') return [];
  const st = useStore.getState();
  const ownerName = new Map((st.owners || []).map((o) => [o.id, o.name]));
  const seatOf = new Map((st.users || []).filter((u) => u.ownerId && u.hqSeat).map((u) => [u.ownerId, u.hqSeat]));
  const nextOf = new Map();
  (st.fus || []).filter((f) => f.leadId && !f.done).sort((a, b) => a.due - b.due)
    .forEach((f) => { if (!nextOf.has(f.leadId)) nextOf.set(f.leadId, f); });
  return (st.leads || []).filter(Boolean).map((l) => toHQLead(l, { ownerName, seatOf, nextOf }));
}

/** Calls `onChange(hqLeads())` now and whenever the portal leads / follow-ups / people change. Returns unsubscribe. */
export function watchLeads(onChange) {
  let last = null;
  const emit = () => {
    const st = useStore.getState();
    const b = usePortalBridge.getState();
    const key = [b.status, b.rest, st.leads, st.fus, st.owners, st.users];
    if (last && key.every((v, i) => v === last[i])) return;
    last = key;
    onChange(hqLeads());
  };
  const offStore = useStore.subscribe(emit);
  const offBridge = usePortalBridge.subscribe(emit);
  emit();
  return () => { offStore(); offBridge(); };
}

/** Connect (first time) and load / re-read the leads; never throws. */
export function reloadLeads() {
  return connect().then((ok) => (ok ? loadSalesData() : null)).catch(() => null);
}

/** HQ → Sales → Pipeline with this lead's drawer open (its company tab, unless All is showing). `hq` is the HQ component. */
export function openLeadInHQ(hq, id) {
  const lead = (useStore.getState().leads || []).find((l) => l.id === id);
  const tab = useLeadsCompany.getState().co;
  if (lead && tab !== 'all' && tab !== lead.co) setLeadsCompany(lead.co || DEFAULT_COMPANY);
  // The hosted page opens it once it is up (leaving another hosted page closes its overlays first).
  useLeadsCompany.setState({ open: id });
  hq.setState({ pop: null });
  hq.go('pipeline');
}

/**
 * HQ → Sales → Pipeline with the "New lead" form open. `preset`: { co (HQ company id), client (client
 * company), contact, value, notes }. The owner defaults to the signed-in founder.
 */
export function newLeadInHQ(hq, preset = {}) {
  const co = preset.co && preset.co !== 'all' && preset.co !== 'any' ? teamCompanyOf(preset.co) : '';
  if (co) setLeadsCompany(co);
  const tab = useLeadsCompany.getState().co;
  const company = co || (tab !== 'all' ? tab : '');
  const props = { ...(company ? { company } : {}) };
  ['client', 'contact', 'value', 'notes'].forEach((k) => { if (preset[k]) props[k] = preset[k]; });
  useLeadsCompany.setState({ modal: ['lead', props] });
  hq.setState({ pop: null });
  hq.go('pipeline');
}

/** HQ → Sales → Pipeline searching for `q` across every company (Customers → "Leads"). */
export function searchLeadsInHQ(hq, q) {
  useStore.getState().setLf({ q: q || '' });
  setLeadsCompany('all');
  hq.go('pipeline');
}

/** Add a note to a lead's activity (Founders AI). Resolves true when saved. */
export async function noteOnLead(id, text) {
  const st = useStore.getState();
  if (!(st.leads || []).some((l) => l.id === id) || !String(text || '').trim()) return false;
  await st.logAct(id, 'note', String(text).trim());
  return true;
}
