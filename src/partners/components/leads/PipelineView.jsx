import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DynamicForm } from '@/partners/components/forms/DynamicForm';
import { usePipeline } from '@/partners/components/SettingsProvider';
import { useUser } from '@/partners/components/UserProvider';
import { usePpCan } from '@/partners/hooks/usePpCan';
import { Button, Chips, Icon, Modal, PageHeader, Pagination, SearchInput, Select, Tabs, useToast } from '@/partners/components/ui';
import { useApi } from '@/partners/hooks/useApi';
import { useList } from '@/partners/hooks/useList';
import { useQueryFlag } from '@/partners/hooks/useQueryFlag';
import { api } from '@/partners/api';
import { DEFAULT_COMMISSION_RATE } from '@/partners/lib/constants';
import { todayISO } from '@/partners/lib/format';
import { earnings, pipeline } from '@/partners/lib/metrics';
import { LOST, WON, allStages, isOpen, stageName } from '@/partners/lib/pipeline';

import { LeadBoard } from './LeadBoard';
import { LeadTable } from './LeadTable';
import { leadFields } from './leadFields';
import { PipelineStats } from './PipelineStats';
import { TaskRow } from './TaskRow';

const addDays = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
const TASK_GROUPS = [
  { label: 'Overdue', color: 'var(--bad)', test: (d) => d < todayISO() },
  { label: 'Today', color: 'var(--warn)', test: (d) => d === todayISO() },
  { label: 'This week', color: 'var(--ink)', test: (d) => d > todayISO() && d <= addDays(7) },
  { label: 'Later', color: 'var(--ink)', test: (d) => d > addDays(7) },
];

// The CRM screen. Partners see their own leads; admins see every partner's, can filter by partner and add leads for them.
//  - Board and follow-ups load the whole (filtered) pipeline: a kanban has to show every column.
//  - List view is paginated, searched and sorted on the server.
export function PipelineView({ admin, partnerId }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { user } = useUser();
  // Admins: by their role's "Leads" permission (partners always work their own leads).
  const ppCan = usePpCan();
  const may = (act) => !admin || ppCan('pp_leads', act);
  const cfg = usePipeline();
  const [view, setView] = useState('board');
  const [adding, setAdding] = useState(false);
  useQueryFlag('new', () => setAdding(true));

  const embedded = !!partnerId;
  const list = useList(view === 'list' ? `/leads${partnerId ? `?owner=${partnerId}` : ''}` : null, 'leads', {
    sort: '-updatedAt',
    urlState: !embedded,
  });
  // Deep links from stat tiles elsewhere: /leads?view=list&stage=...
  useEffect(() => {
    const v = new URLSearchParams(search).get('view');
    if (v === 'list' || v === 'tasks') setView(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openKeys = cfg.stages.map(s => s.key).join(',');
  const closedKeys = `${WON},${LOST}`;
  const stageOptions = [
    { value: openKeys, label: 'All open stages' },
    { value: closedKeys, label: 'Closed (won + lost)' },
    ...allStages(cfg).map(s => ({ value: s.key, label: s.name })),
  ];

  // Stat tile → the leads behind the number, on this page.
  function pick(p) {
    if (p === 'tasks') return setView('tasks');
    setView('list');
    list.setFilter('stage', p === 'closed' ? closedKeys : p === 'won' ? WON : openKeys);
    list.setSort(p === 'open' ? '-updatedAt' : '-value');
  }
  const picked =
    view === 'tasks' ? 'tasks'
    : view !== 'list' ? null
    : list.filters.stage === closedKeys ? 'closed'
    : list.filters.stage === WON ? 'won'
    : list.filters.stage === openKeys ? 'open'
    : null;

  const owner = partnerId ?? list.filters.owner ?? '';
  const { data, reload, setData } = useApi(`/leads${owner ? `?owner=${owner}` : ''}`);
  const partners = useApi(admin ? '/admin/users?role=partner' : null);

  const base = admin ? '/partners/admin/leads' : '/partners/leads';
  const partnerList = partners.data?.users ?? [];
  const rateOf = (l) =>
    admin ? l.owner?.commissionRate ?? DEFAULT_COMMISSION_RATE : user?.commissionRate ?? DEFAULT_COMMISSION_RATE;

  // Board view applies the same toolbar filters in memory.
  const all = useMemo(() => data?.leads ?? [], [data]);
  const { q, filters } = list;
  const boardLeads = useMemo(() => {
    const term = q.trim().toLowerCase();
    return all.filter(
      l =>
        (!term || `${l.company} ${l.project} ${l.contact} ${l.email} ${l.city}`.toLowerCase().includes(term)) &&
        (!filters.source || l.source === filters.source) &&
        (!filters.priority || l.priority === filters.priority) &&
        (!filters.stage || filters.stage.split(',').includes(l.stage)),
    );
  }, [all, q, filters]);

  const pending = all
    .filter(l => isOpen(l.stage))
    .flatMap(l => l.tasks.filter(t => !t.done).map(t => ({ task: t, lead: l })))
    .sort((a, b) => ((a.task.due || '9') < (b.task.due || '9') ? -1 : 1));
  const overdue = pending.filter(p => p.task.due && p.task.due < todayISO()).length;

  const fields = [
    ...(admin ? [{ name: 'owner', label: 'Partner', type: 'select', options: partnerList.map(p => p.id), required: true, full: true }] : []),
    ...leadFields(cfg),
  ];

  async function create(values) {
    const { lead } = await api.post('/leads', values);
    navigate(`${base}/${lead._id}`);
  }

  // Commission so far, from the same (cached) projects data as Home and Earnings.
  const projects = useApi(admin && !ppCan('pp_projects') ? null : partnerId ? `/projects?owner=${partnerId}` : '/projects');
  const money = earnings(projects.data?.projects ?? [], user?.commissionRate ?? DEFAULT_COMMISSION_RATE);
  const commission = projects.data
    ? { released: money.released, processing: money.processing, future: money.future, href: admin ? '/partners/admin/projects' : '/partners/earnings', admin }
    : undefined;

  // Drag & drop on the board. The card moves at once; the server confirms (or it moves back).
  const toast = useToast();
  const [losing, setLosing] = useState(null);
  const [lostReason, setLostReason] = useState('');
  async function move(lead, stage, extra = {}) {
    if (stage === LOST && !extra.lostReason) {
      setLostReason(cfg.lostReasons[0] ?? 'Not specified');
      return setLosing(lead);
    }
    const before = data;
    if (data) setData({ ...data, leads: data.leads.map(l => (l._id === lead._id ? { ...l, stage, ...extra } : l)) });
    try {
      await api.patch(`/leads/${lead._id}`, { stage, ...extra });
      toast(`${lead.company} moved to ${stageName(cfg, stage)}`);
      reload();
      list.reload();
    } catch (e) {
      if (before) setData(before);
      toast(e.message, true);
    }
  }

  async function toggle(leadId, taskId) {
    await api.patch(`/leads/${leadId}`, { toggleTask: taskId });
    reload();
  }

  const viewTabs = (
    <Tabs
      tabs={[
        { value: 'board', label: <><Icon name="cols" size="s" />Board</> },
        { value: 'list', label: <><Icon name="list" size="s" />List</> },
        { value: 'tasks', label: <><Icon name="checkSq" size="s" />Follow-ups</>, count: overdue || undefined },
      ]}
      value={view}
      onChange={setView}
    />
  );

  return (
    <>
      {!embedded && (
        <PageHeader
          eyebrow={admin ? 'Admin · Sales CRM' : 'Sales CRM'}
          title={admin ? 'All leads' : 'Pipeline'}
          subtitle={admin ? "Every partner's pipeline. Open a lead to edit, move, reassign or delete it." : 'Track every lead, follow-up and conversation until the deal closes.'}
          actions={<>{viewTabs}{may('c') && <Button variant="fire" icon="plus" onClick={() => setAdding(true)}>Add lead</Button>}</>}
        />
      )}

      <PipelineStats s={pipeline(all, rateOf)} commission={commission} followUps={pending.length} overdue={overdue} onPick={pick} active={picked} />

      {view !== 'tasks' && (
        <div className="toolbar">
          <SearchInput value={list.q} onChange={list.setQ} placeholder="Search company, contact, email or city" width={380} />
          {admin && !embedded && (
            <div style={{ width: 220 }}>
              <Select options={partnerList.map(p => ({ value: p.id, label: `${p.name} · ${p.partnerCode}` }))} placeholder="All partners" value={list.filters.owner ?? ''} onChange={e => list.setFilter('owner', e.target.value)} aria-label="Partner" />
            </div>
          )}
          <div style={{ width: 180 }}>
            <Select options={stageOptions} placeholder="All stages" value={list.filters.stage ?? ''} onChange={e => list.setFilter('stage', e.target.value)} aria-label="Stage" />
          </div>
          <div style={{ width: 180 }}>
            <Select options={cfg.sources} placeholder="All sources" value={list.filters.source ?? ''} onChange={e => list.setFilter('source', e.target.value)} aria-label="Source" />
          </div>
          <Chips tabs={['All', ...cfg.priorities.map(p => p.name)]} value={list.filters.priority || 'All'} onChange={v => list.setFilter('priority', v === 'All' ? '' : v)} />
          {list.filtered && <Button size="sm" variant="ghost" icon="x" onClick={list.clear}>Clear</Button>}
          <span className="sub mono grow">{view === 'list' ? `${list.meta?.total ?? '…'} matching` : `${boardLeads.length} of ${all.length}`} leads</span>
          {embedded && viewTabs}
        </div>
      )}

      {view === 'board' && <LeadBoard leads={boardLeads} rate={rateOf} hrefBase={base} showOwner={admin && !embedded} onMove={may('e') ? move : undefined} />}
      {view === 'list' && (
        <LeadTable
          leads={list.items}
          loading={list.loading}
          hrefBase={base}
          showOwner={admin && !embedded}
          sort={list.sort}
          onSort={list.setSort}
          footer={<Pagination meta={list.meta} onPage={list.setPage} onLimit={list.setLimit} label="leads" />}
        />
      )}
      {view === 'tasks' && (
        <div className="g4" style={{ alignItems: 'start' }}>
          {TASK_GROUPS.map(g => {
            const items = pending.filter(p => p.task.due && g.test(p.task.due));
            return (
              <div key={g.label} className="card tight">
                <div className="between" style={{ marginBottom: 6 }}>
                  <b style={{ font: '700 16px var(--display)', color: g.color }}>{g.label}</b>
                  <span className="mono sub">{items.length}</span>
                </div>
                {items.length ? (
                  items.map(({ task, lead }) => (
                    <TaskRow key={task._id} task={task} company={admin ? `${lead.company} · ${lead.owner?.name ?? ''}` : lead.company} href={`${base}/${lead._id}`} onToggle={() => toggle(lead._id, task._id)} readOnly={!may('e')} />
                  ))
                ) : (
                  <div className="sub" style={{ padding: '12px 0' }}>Nothing here</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal open={!!losing} title={`Mark ${losing?.company ?? ''} as lost`} subtitle="Why was this deal lost?" onClose={() => setLosing(null)}>
        <div className="stack">
          <Select options={cfg.lostReasons} value={lostReason} onChange={e => setLostReason(e.target.value)} aria-label="Lost reason" />
          <div className="form-foot">
            <Button variant="ghost" onClick={() => setLosing(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { const l = losing; setLosing(null); move(l, LOST, { lostReason }); }}>Mark lost</Button>
          </div>
        </div>
      </Modal>

      <Modal open={adding} title={admin ? 'New lead for a partner' : 'New lead'} subtitle="A first call is scheduled for tomorrow automatically." onClose={() => setAdding(false)}>
        <DynamicForm
          fields={fields}
          columns={2}
          submitIcon="plus"
          initial={{ priority: cfg.priorities.find(p => p.name === 'Warm')?.name ?? cfg.priorities[0]?.name, ...(partnerId ? { owner: partnerId } : {}) }}
          optionLabel={{ owner: id => partnerList.find(p => p.id === id)?.name ?? id }}
          submitLabel="Save lead"
          onSubmit={create}
          onCancel={() => setAdding(false)}
        />
      </Modal>
    </>
  );
}
