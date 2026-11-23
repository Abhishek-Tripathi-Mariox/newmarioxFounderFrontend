import { useState } from 'react';
import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import Segmented from '@/founders/summary/components/ui/Segmented';
import { needsAttention } from '@/founders/summary/domain/projects';
import { dayMonth, percent } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const FILTERS = [
  ['all', 'All'],
  ['attention', 'Needs attention'],
  ['ok', 'On track'],
];

const hoursColor = (used) => (used > 1 ? 'oklch(0.55 0.19 25)' : used > 0.9 ? 'oklch(0.68 0.15 65)' : 'var(--mariox)');

export default function ProjectsTable({ projects, running, onHold = [] }) {
  const [filter, setFilter] = useState('all');
  const attention = projects.filter(needsAttention).length;
  const rows = projects.filter((x) => filter === 'all' || (filter === 'attention' ? needsAttention(x) : !needsAttention(x)));

  return (
    <Card
      title="Projects"
      subtitle={`${running} running · ${attention} need attention${onHold.length ? ` · ${onHold.length} on hold` : ''} · showing ${rows.length} of ${projects.length} tracked`}
      actions={<Segmented label="Project filter" options={FILTERS} value={filter} onChange={setFilter} />}
    >
      <div className={u.tableWrap}>
        <table className={u.table} style={{ minWidth: 860 }}>
          <thead>
            <tr>
              <th scope="col">Project</th>
              <th scope="col">PM</th>
              <th scope="col">Current milestone</th>
              <th scope="col">Due</th>
              <th scope="col">Hours used</th>
              <th scope="col">Health</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>
                  <div className={u.stack}>
                    <span className={u.strong}>{x.name}</span>
                    <span className={u.sub}>
                      {x.id} · {x.client}
                    </span>
                  </div>
                </td>
                <td>{x.pm}</td>
                <td>
                  <div className={u.stack}>
                    <span>{x.milestone.n != null ? `M${x.milestone.n} · ${x.milestone.name}` : x.milestone.name}</span>
                    {x.note && (
                      <span className={u.sub} style={x.tone === 'good' ? undefined : { color: `var(--${x.tone}-fg)` }}>
                        {x.note}
                      </span>
                    )}
                  </div>
                </td>
                <td className="num">{x.milestone.due ? dayMonth(x.milestone.due) : '—'}</td>
                <td>
                  {x.hoursUsed == null ? (
                    <span className={u.sub}>No hour budget</span>
                  ) : (
                    <div className={p.hours}>
                      <div className={p.hoursTrack} aria-hidden="true">
                        <div className={p.hoursFill} style={{ width: `${Math.min(100, percent(x.hoursUsed, 1))}%`, background: hoursColor(x.hoursUsed) }} />
                      </div>
                      <span className={`${p.hoursPct} num`}>{percent(x.hoursUsed, 1)}%</span>
                    </div>
                  )}
                </td>
                <td>
                  <Pill tone={x.tone}>{x.health}</Pill>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className={u.sub}>
                  No projects match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {onHold.length > 0 && (
        <div className={p.block}>
          <h3 className={p.blockTitle}>On hold</h3>
          <div>
            {onHold.map((x) => (
              <div key={x.id} className={p.riskRow}>
                <span className={p.code}>{x.id}</span>
                <div className={p.riskBody}>
                  <span className={u.strong}>{x.name}</span>
                  <span className={u.sub}>
                    {[x.client, `PM ${x.pm}`, x.note].filter(Boolean).join(' · ')}
                  </span>
                </div>
                {x.since && <span className={u.sub}>since {dayMonth(x.since)}</span>}
                <Pill tone="warn">{x.reason || 'On hold'}</Pill>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
