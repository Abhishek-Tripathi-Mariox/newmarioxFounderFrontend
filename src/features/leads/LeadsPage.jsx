import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/store';
import { can } from '@/domain/permissions';
import { Button, FilterChips, KanbanBoard, SegmentedControl } from '@/components/ui';
import { useLeadStatusNames } from '@/store/masters';
import { range } from '@/lib/date';
import { money } from '@/lib/format';
import { useLeadInsights } from './useLeadInsights';
import { leadRowModel } from './leadRow';
import { useLeadCompanies } from './leadCompanies';
import { toApiLeadQuery } from '@/api/sales';
import { ownerOf, statusOrder, statusTone, sumValue, val } from './leadUtils';
import LeadsFilters from './components/LeadsFilters';
import LeadFlags from './components/LeadFlags';
import BulkBar from './components/BulkBar';
import LeadsTable from './components/LeadsTable';
import LeadCard from './components/LeadCard';
import s from './LeadsPage.module.css';

const VIEW_OPTIONS = [['kanban', 'Board'], ['table', 'Table']];

/**
 * Leads pipeline: filters, flags, status chips, board / table views, bulk actions, CSV export.
 * Founders HQ hosts this page (HQ → Sales → Pipeline) and passes `company` (its company tab, '' = all:
 * only that company's leads, and new leads default to it), `companyFilter={false}` (HQ's tabs replace
 * the "All companies" filter) and `newLead` (a "+ New lead" button; the portal has it in its header).
 */
export default function LeadsPage({ company = '', companyFilter = true, newLead = false }) {
  const stageNames = useLeadStatusNames();
  const { leads, ins, now } = useLeadInsights();
  const lf = useStore((st) => st.lf);
  const openModal = useStore((st) => st.openModal);
  const canCreate = useStore((st) => can(st, 'leads', 'c'));
  const canImport = canCreate;
  const sort = useStore((st) => st.sort);
  const leadView = useStore((st) => st.leadView);
  const selIds = useStore((st) => st.selIds);
  const setLf = useStore((st) => st.setLf);
  const setLeadView = useStore((st) => st.setLeadView);
  const selectLead = useStore((st) => st.selectLead);
  const setLead = useStore((st) => st.setLead);
  const flash = useStore((st) => st.flash);
  const exportLeads = useStore((st) => st.exportLeads);
  const staleDays = useStore((st) => st.staleDays);
  const companies = useLeadCompanies();
  // HQ's company tab, else the page's own "All companies" filter.
  const co = company || (companyFilter ? lf.co : '') || '';

  // Everything except the status filter (status chips count against this).
  const base = useMemo(() => {
    const rg = range(lf.date, lf.from, lf.to);
    const q = (lf.q || '').trim().toLowerCase();
    return leads.filter((l) =>
      (!rg || (l.created >= rg[0] && l.created < rg[1]))
      && (!lf.owner || l.owner === lf.owner)
      && (!lf.source || l.source === lf.source)
      && (!lf.service || (l.service || '').split(', ').includes(lf.service))
      && (!co || l.co === co)
      && (!q || `${l.company} ${l.contact} ${l.email} ${l.id}`.toLowerCase().includes(q))
      && (!lf.flag || (lf.flag === 'hot' ? ins.isHot(l) : lf.flag === 'stale' ? ins.isStale(l) : !!ins.dupOf[l.id])));
  }, [leads, lf, co, ins]);

  const shown = useMemo(() => {
    const list = lf.status ? base.filter((l) => l.status === lf.status) : base.slice();
    const { k, d } = sort;
    const key = (l) => (k === 'score' ? ins.scoreOf[l.id]
      : k === 'status' ? statusOrder(l.status)
        : k === 'owner' ? ownerOf(l.owner).name
          : k === 'next' ? (ins.nextOf[l.id] ? ins.nextOf[l.id].due : Infinity)
            : typeof l[k] === 'string' ? l[k].toLowerCase() : l[k]);
    return list.sort((a, b) => {
      const x = key(a);
      const y = key(b);
      return (x > y ? 1 : x < y ? -1 : 0) * d;
    });
  }, [base, lf.status, sort, ins]);

  const rows = useMemo(() => shown.map((l) => leadRowModel(l, ins, now, companies)), [shown, ins, now, companies]);

  const columns = useMemo(() => stageNames.map((k) => {
    const items = base.filter((l) => l.status === k);
    return {
      key: k, name: k, dot: statusTone(k).dot, count: items.length, meta: money(sumValue(items)),
      items: items.map((l) => leadRowModel(l, ins, now, companies)),
    };
  }), [stageNames, base, ins, now, companies]);

  const chips = useMemo(() => [
    { key: '', label: 'All', count: base.length, dot: 'oklch(0.7 0.01 265)' },
    ...stageNames.map((k) => ({ key: k, label: k, count: base.filter((l) => l.status === k).length, dot: statusTone(k).dot })),
  ], [stageNames, base]);

  const open = useCallback((id) => selectLead(id), [selectLead]);

  // Deep link /leads?lead=MX-1001 (e.g. from Founders HQ): open that lead's panel once it is loaded.
  const [searchParams, setSearchParams] = useSearchParams();
  const linkedLead = searchParams.get('lead');
  useEffect(() => {
    if (!linkedLead || !leads.some((l) => l.id === linkedLead)) return;
    selectLead(linkedLead);
    setSearchParams((params) => { params.delete('lead'); return params; }, { replace: true });
  }, [linkedLead, leads, selectLead, setSearchParams]);
  /** Selected leads as CSV from the server (`ids=` — scope still applies). */
  const exportSelected = () => exportLeads({ ids: selIds.join(','), staleDays });
  const [exporting, setExporting] = useState(false);
  /** Current view as CSV from the server (same filters, sort and scope). */
  const exportShown = async () => {
    setExporting(true);
    await exportLeads(toApiLeadQuery({ ...lf, co }, sort, range(lf.date, lf.from, lf.to), staleDays));
    setExporting(false);
  };
  const onMove = async (id, to) => {
    const ld = leads.find((l) => l.id === id);
    if (ld && ld.status !== to) {
      flash(`${ld.company} → ${to}`);
      await setLead(id, 'status', to);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Leads</h1>
          <div className={s.summary}>{shown.length} leads · {money(sumValue(shown))} total value</div>
        </div>
        <div className={s.actions}>
          {newLead && canCreate && <Button variant="primary" onClick={() => openModal('lead', co ? { company: co } : {})}>+ New lead</Button>}
          {canImport && <Button onClick={() => openModal('leadImport', co ? { company: co } : {})}>Import CSV</Button>}
          <Button onClick={exportShown} disabled={exporting} aria-busy={exporting}>Export CSV</Button>
          <SegmentedControl options={VIEW_OPTIONS} value={leadView} onChange={(v) => setLeadView(val(v))} />
        </div>
      </div>

      <LeadsFilters companies={companyFilter && !company ? companies : null} />

      <FilterChips items={chips} value={lf.status} onChange={(v) => setLf({ status: val(v) })} tone="dark" />

      <LeadFlags leads={leads} ins={ins} />

      <BulkBar onExport={exportSelected} />

      {leadView === 'table' ? (
        <LeadsTable rows={rows} onOpen={open} />
      ) : (
        <KanbanBoard
          columns={columns}
          getId={(r) => r.lead.id}
          renderCard={(r) => <LeadCard row={r} onOpen={open} />}
          onMove={onMove}
          minColWidth={260}
        />
      )}
    </div>
  );
}
