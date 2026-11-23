import { useNavigate } from 'react-router-dom';
import { usePipeline } from '@/partners/components/SettingsProvider';
import { Avatar, Badge, DataTable } from '@/partners/components/ui';
import { date, short } from '@/partners/lib/format';
import { LOST, WON, isOpen, priorityTone, stageColor, stageName } from '@/partners/lib/pipeline';

import { dueLabel } from './TaskRow';
import { nextTask } from './stages';

export function LeadTable({ leads, loading, showOwner, hrefBase = '/partners/leads', sort, onSort, footer }) {
  const navigate = useNavigate();
  const cfg = usePipeline();
  const columns = [
    {
      key: 'lead', header: 'Lead', width: 'minmax(0,1.7fr)', sort: 'company',
      render: l => (
        <div className="row" style={{ minWidth: 0 }}>
          <Avatar name={l.company} size="s" />
          <div style={{ minWidth: 0 }}>
            <div className="strong">{l.company}</div>
            <div className="sub" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{[l.project, (l.contact || '').split(',')[0]].filter(Boolean).join(' · ')}</div>
          </div>
        </div>
      ),
    },
    ...(showOwner ? [{ key: 'owner', header: 'Partner', width: '150px', render: (l) => <span className="sub">{l.owner?.name ?? '—'}</span> }] : []),
    { key: 'stage', header: 'Stage', width: '150px', render: l => <span className="row" style={{ gap: 7, fontSize: 13.5 }}><i style={{ width: 8, height: 8, borderRadius: 3, background: stageColor(cfg, l.stage) }} />{stageName(cfg, l.stage)}</span> },
    { key: 'value', header: 'Value', width: '100px', sort: 'value', render: l => <span className="num strong">{short(l.value)}</span> },
    { key: 'source', header: 'Source', width: '130px', render: l => <span className="sub">{l.source || '—'}</span> },
    { key: 'close', header: 'Close', width: '90px', sort: 'expectedClose', render: l => <span className="sub">{date(l.expectedClose)}</span> },
    {
      key: 'next', header: 'Next follow-up', width: 'minmax(0,1.6fr)',
      render: l => {
        const nt = isOpen(l.stage) ? nextTask(l) : undefined;
        if (!nt) return <span className="sub">{l.stage === WON ? 'Closed won' : l.stage === LOST ? `Lost · ${l.lostReason || ''}` : 'No follow-up set'}</span>;
        const d = dueLabel(nt.due);
        return (
          <span className="row" style={{ gap: 8, minWidth: 0 }}>
            <Badge tone={d.tone === 'bad' ? 'bad' : d.tone === 'warn' ? 'warn' : 'mute'} dot={false}>{d.text}</Badge>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--ink-2)', fontSize: 13 }}>{nt.text}</span>
          </span>
        );
      },
    },
    { key: 'pri', header: 'Priority', width: '90px', render: l => l.priority && <Badge tone={priorityTone(cfg, l.priority)}>{l.priority}</Badge> },
  ];
  return (
    <div className="card" style={{ padding: '10px 18px' }}>
      <DataTable rows={leads} loading={loading} columns={columns} rowKey={l => l._id} onRowClick={l => navigate(`${hrefBase}/${l._id}`)} empty="No leads match these filters." minWidth={1000} sort={sort} onSort={onSort} footer={footer} />
    </div>
  );
}
