import { useMemo } from 'react';
import { useStore } from '@/store';
import { useProjectsModel } from '@/hooks/useProjectsModel';
import { Button, DataTable, Pagination, SegmentedControl, usePagination } from '@/components/ui';
import { INK, RED, projectColor } from '@/lib/color';
import { dLabel } from '@/lib/date';
import { hh } from '@/lib/format';
import { MiniAvatar } from '../components/TaskCard';
import { memberAvatar } from '../workItems';
import { useScoped } from '@/hooks/useScoped';
import { internalEntries } from '@/features/attendance/shared/internalWork';
import s from './WorkTabs.module.css';

const INT_HUE = 'oklch(0.72 0.14 70)';
const VIEWS = [['entries', 'Entries'], ['matrix', 'Member × project'], ['internal', 'Internal work']];

/**
 * Timesheets tab: filtered entries (paginated, deletable) or a member × project
 * matrix whose cells drill into the matching entries. Exports CSV.
 */
export default function TimesheetsTab() {
  const pj = useStore((st) => st.pj);
  const setPj = useStore((st) => st.setPj);
  const delLog = useStore((st) => st.delLog);
  const exportTimesheets = useStore((st) => st.exportTimesheets);
  const flash = useStore((st) => st.flash);
  const { LF, inR, pF, memF, g, hk, MEM, PRJ, MSS, info, periodLabel } = useProjectsModel();
  const view = ['matrix', 'internal'].includes(pj.tsView) ? pj.tsView : 'entries';
  const reports = useScoped().reports;

  // Internal (non-project) work from end-of-shift reports, for the members in the filter.
  const intRows = useMemo(() => {
    const mem = new Set(memF.map((m) => m.id));
    return internalEntries(reports).filter((e) => mem.has(e.who) && inR(e.d));
  }, [reports, memF, inR]);
  const intTotal = useMemo(() => intRows.reduce((x, e) => x + e.h, 0), [intRows]);

  const ents = useMemo(
    () => LF.filter((l) => inR(l.d)).sort((a, b) => b.d - a.d || ((MEM[a.m] || {}).name || '').localeCompare((MEM[b.m] || {}).name || '')),
    [LF, inR, MEM],
  );
  const total = useMemo(() => ents.reduce((x, l) => x + l.h, 0), [ents]);

  const mx = useMemo(() => {
    const cell = (m, p) => g(`pm:${p.id}:${m.id}`).range;
    const cols = pF.filter((p) => g(hk(p)).range > 0);
    // Internal (non-project) hours per member, from end-of-shift reports — shown as the last column.
    const intBy = {};
    intRows.forEach((e) => { intBy[e.who] = (intBy[e.who] || 0) + e.h; });
    const mems = memF.filter((m) => cols.some((p) => cell(m, p) > 0) || intBy[m.id] > 0);
    let max = 0;
    mems.forEach((m) => cols.forEach((p) => { max = Math.max(max, cell(m, p)); }));
    const rows = mems.map((m) => {
      const proj = cols.reduce((x, p) => x + cell(m, p), 0);
      const int = intBy[m.id] || 0;
      return { m, proj, int, total: proj + int, cells: cols.map((p) => ({ p, v: cell(m, p) })) };
    });
    const totals = cols.map((p) => mems.reduce((x, m) => x + cell(m, p), 0));
    // Hours budget per project and hours assigned per member (all time), to flag overruns in red.
    const budgets = cols.map((p) => {
      const { budget, used } = info(p);
      return { budget: budget > 0 ? budget : 0, used, over: budget > 0 && used > budget + 1e-9 };
    });
    rows.forEach((row) => row.cells.forEach((c) => {
      const assigned = +((c.p.alloc || {})[row.m.id]) || 0;
      const used = g(`pm:${c.p.id}:${row.m.id}`).all;
      Object.assign(c, { assigned, used, over: assigned > 0 && used > assigned + 1e-9 });
    }));
    const projGrand = totals.reduce((a, b) => a + b, 0);
    const intGrand = rows.reduce((x, r) => x + r.int, 0);
    return { cols, rows, totals, budgets, projGrand, intGrand, grand: projGrand + intGrand, max };
  }, [pF, memF, g, hk, intRows, info]);

  const openP = (id) => setPj({ selP: id, selM: null, exp: null, exp2: null, pDay: null });
  const openM = (id) => setPj({ selM: id, selP: null, mDay: null, exp: null, exp2: null });
  const drill = (mid, pid) => {
    const cur = useStore.getState().pj;
    setPj({ tsView: 'entries', f: { ...cur.f, member: mid, project: pid } });
  };

  const drillInt = (mid) => {
    const cur = useStore.getState().pj;
    setPj({ tsView: 'internal', f: { ...cur.f, member: mid } });
  };

  const exportCsv = async () => {
    if (await exportTimesheets(pj.f)) flash(`Exported ${ents.length} entries`);
  };

  const columns = [
    {
      key: 'd', label: 'Date', render: (l) => (
        <div className={s.nowrap}>
          <div className={s.b500}>{dLabel(l.d)}</div>
          <div className={s.muted} style={{ fontSize: 12 }}>{new Date(l.d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
        </div>
      ),
    },
    {
      key: 'm', label: 'Member', render: (l) => {
        const av = memberAvatar(MEM[l.m]);
        return (
          <button type="button" className={s.linkBtn} onClick={(e) => { e.stopPropagation(); openM(l.m); }}>
            <MiniAvatar av={av} /><span className={s.b500}>{av.name}</span>
          </button>
        );
      },
    },
    {
      key: 'p', label: 'Project', render: (l) => (
        <button type="button" className={s.linkBtn} onClick={(e) => { e.stopPropagation(); openP(l.p); }}>
          <span className={s.sq8} style={{ background: projectColor(PRJ[l.p]) }} />{PRJ[l.p] ? PRJ[l.p].name : '—'}
        </button>
      ),
    },
    { key: 'ms', label: 'Milestone', render: (l) => <span className={s.nowrap} style={{ color: 'oklch(0.4 0.012 265)' }}>{MSS[l.ms] ? MSS[l.ms].name : '—'}</span> },
    { key: 'note', label: 'Work done', render: (l) => <span style={{ color: 'oklch(0.4 0.012 265)' }}>{l.note || '—'}</span> },
    { key: 'h', label: 'Hours', align: 'right', render: (l) => <span className={s.b600}>{hh(l.h)}</span> },
    {
      key: 'del', label: '', align: 'right', render: (l) => (
        <button type="button" className={s.delBtn} title="Delete entry" onClick={(e) => { e.stopPropagation(); delLog(l.id); }}>✕</button>
      ),
    },
  ];

  const intColumns = [
    columns[0],
    { ...columns[1], render: (e) => columns[1].render({ m: e.who }) },
    { key: 'cat', label: 'Type', render: (e) => <span className={s.nowrap} style={{ fontWeight: 500 }}>{e.cat}</span> },
    { key: 'note', label: 'Work done', render: (e) => <span style={{ color: 'oklch(0.4 0.012 265)', whiteSpace: 'pre-wrap' }}>{e.note || '—'}</span> },
    { key: 'h', label: 'Hours', align: 'right', render: (e) => <span className={s.b600}>{hh(e.h)}</span> },
  ];

  // Matrix rows (members) are paginated; the Total row still sums every member in the filter.
  const mxPager = usePagination(mx.rows);
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <SegmentedControl options={VIEWS} value={view} onChange={(v) => setPj({ tsView: v })} />
        <div className={s.group}>
          {view === 'internal' ? (
            <div className={s.summary}><span className={s.strong}>{hh(intTotal)}</span> internal · {intRows.length} entries · {periodLabel.toLowerCase()}</div>
          ) : (
            <>
              <div className={s.summary}>
                <span className={s.strong}>{hh(total)}</span> · {ents.length} entries
                {view === 'matrix' && intTotal > 0 && <> · <span className={s.strong}>{hh(intTotal)}</span> internal</>} · {periodLabel.toLowerCase()}
              </div>
              <Button variant="secondary" onClick={exportCsv}>Export timesheet CSV</Button>
            </>
          )}
        </div>
      </div>

      {view === 'internal' ? (
        <div>
          <DataTable itemLabel="entries" columns={intColumns} rows={intRows} rowKey={(e) => e.id} minWidth={820} empty="No internal work in end-of-shift reports for these filters." />
          <div className={s.hint}>Internal work comes from each person&apos;s end-of-shift report (not counted in project hours).</div>
        </div>
      ) : view === 'entries' ? (
        <div>
          <DataTable itemLabel="entries" columns={columns} rows={ents} rowKey={(l) => l.id} minWidth={960} empty="No hours logged for these filters." />
        </div>
      ) : (
        <>
          <div className={s.tableWrap}>
            <div className={s.tableScroll}>
            <table className={s.table} style={{ width: 'auto', minWidth: '100%' }}>
              <thead>
                <tr>
                  <th className={s.stickyHead}>Member</th>
                  {mx.cols.map((p, i) => {
                    const b = mx.budgets[i];
                    return (
                      <th
                        key={p.id}
                        className={s.mxTh}
                        title={b.budget ? `${p.name}: ${hh(b.used)} used of ${hh(b.budget)} budget (all time)${b.over ? ` · ${hh(b.used - b.budget)} over` : ''}` : `${p.name}: no hours budget set`}
                        style={b.over ? { color: RED } : undefined}
                      >
                        <div className={s.mxThInner}>
                          <span className={s.sq} style={{ background: b.over ? RED : projectColor(p) }} />
                          <span className={s.nowrap}>{p.name}</span>
                          {b.budget > 0 && <span className={s.nowrap} style={{ fontWeight: 600, color: b.over ? RED : 'var(--muted)' }}>[{hh(b.budget)}]</span>}
                        </div>
                      </th>
                    );
                  })}
                  <th className={`${s.mxTh} ${s.right}`} title="Internal (non-project) work from end-of-shift reports">
                    <div className={s.mxThInner} style={{ justifyContent: 'flex-end' }}><span className={s.sq} style={{ background: INT_HUE }} /><span className={s.nowrap}>Internal work</span></div>
                  </th>
                  <th className={s.right} title="Project hours + internal work">Total</th>
                </tr>
              </thead>
              <tbody>
                {mxPager.pageItems.map((r) => {
                  const av = memberAvatar(r.m);
                  return (
                    <tr key={r.m.id}>
                      <td className={s.sticky} style={{ padding: '8px 14px' }}>
                        <button type="button" className={s.linkBtn} onClick={() => openM(r.m.id)}><MiniAvatar av={av} /><span className={s.b500}>{av.name}</span></button>
                      </td>
                      {r.cells.map(({ p, v, assigned, used, over }) => {
                        const ratio = mx.max ? v / mx.max : 0;
                        const tip = `${r.m.name} on ${p.name}: ${hh(v)}`
                          + (assigned ? ` · ${hh(used)} logged of ${hh(assigned)} assigned (all time)${over ? ` · ${hh(used - assigned)} over` : ''}` : '');
                        return (
                          <td key={p.id} className={s.mxTd}>
                            <button
                              type="button"
                              className={s.mxCell}
                              title={tip}
                              onClick={() => drill(r.m.id, p.id)}
                              style={{
                                fontWeight: v ? 600 : 400,
                                background: over ? 'oklch(0.94 0.05 25)' : v ? `oklch(0.6 0.15 265 / ${(0.07 + ratio * 0.38).toFixed(2)})` : 'transparent',
                                color: over ? RED : v ? INK : 'oklch(0.75 0.01 265)',
                                boxShadow: over ? `inset 0 0 0 1px ${RED}` : undefined,
                              }}
                            >
                              {v ? hh(v) : '·'}
                              {assigned > 0 && <span style={{ marginLeft: 4, fontWeight: 500, color: over ? RED : 'var(--muted)' }}>[{hh(assigned)}]</span>}
                            </button>
                          </td>
                        );
                      })}
                      <td className={s.mxTd}>
                        <button
                          type="button"
                          className={s.mxCell}
                          title={`${r.m.name} · internal work: ${hh(r.int)}`}
                          onClick={() => drillInt(r.m.id)}
                          style={{
                            fontWeight: r.int ? 600 : 400,
                            background: r.int ? 'oklch(0.75 0.13 70 / 0.22)' : 'transparent',
                            color: r.int ? INK : 'oklch(0.75 0.01 265)',
                          }}
                        >
                          {r.int ? hh(r.int) : '·'}
                        </button>
                      </td>
                      <td className={`${s.right} ${s.b600}`} style={{ padding: '8px 14px' }} title={`Projects ${hh(r.proj)} + internal ${hh(r.int)}`}>{hh(r.total)}</td>
                    </tr>
                  );
                })}
                <tr className={s.totalRow}>
                  <td className={s.stickyHead}>Total</td>
                  {mx.totals.map((t, i) => {
                    const b = mx.budgets[i];
                    return (
                      <td key={mx.cols[i].id} style={b.over ? { color: RED } : undefined} title={b.budget ? `${hh(b.used)} used of ${hh(b.budget)} budget (all time)` : undefined}>
                        {hh(t)}
                        {b.budget > 0 && <span style={{ marginLeft: 4, fontWeight: 500, color: b.over ? RED : 'var(--muted)' }}>/ {hh(b.budget)}</span>}
                      </td>
                    );
                  })}
                  <td>{hh(mx.intGrand)}</td>
                  <td style={{ fontWeight: 700 }}>{hh(mx.grand)}</td>
                </tr>
              </tbody>
            </table>
            </div>
            {mx.rows.length === 0 && <div className={s.empty}>No hours logged for these filters.</div>}
            <Pagination {...mxPager} label="members" />
          </div>
          <div className={s.hint}>Click any cell to see the entries behind it. [h] next to a project = its hours budget; [h] in a cell = hours assigned to that member. Red = more hours logged than budgeted or assigned (all time). Internal work comes from end-of-shift reports; Total = project hours + internal work.</div>
        </>
      )}
    </div>
  );
}
