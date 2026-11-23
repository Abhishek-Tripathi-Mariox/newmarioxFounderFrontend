import { Link, useNavigate } from 'react-router-dom';
import { EarningsStats } from '@/partners/components/earnings/EarningsSummary';
import { Avatar, Card, DataTable, MoreLink, PageHeader, StatCard, Stats } from '@/partners/components/ui';
import { WON } from '@/partners/lib/pipeline';
import { useApi } from '@/partners/hooks/useApi';
import { usePipeline } from '@/partners/components/SettingsProvider';
import { DEFAULT_COMMISSION_RATE } from '@/partners/lib/constants';
import { short } from '@/partners/lib/format';
import { earnings, pipeline } from '@/partners/lib/metrics';
import { ST, STATUSES, overdue, today } from '@/partners/lib/acquisition';

const KINDS = [
  { kind: 'scope', label: 'Scope reviews', icon: 'fileCheck', open: ['review'] },
  { kind: 'booking', label: 'Office visits', icon: 'cal', open: ['Requested'] },
  { kind: 'tech', label: 'Tech requests', icon: 'code', open: ['requested'] },
  { kind: 'ticket', label: 'Support tickets', icon: 'help', open: ['requested', 'assigned'] },
];

export default function AdminOverview() {
  const cfg = usePipeline();
  const navigate = useNavigate();
  const users = useApi('/admin/users');
  const leads = useApi('/leads');
  const projects = useApi('/projects');
  const acq = useApi('/admin/acquisition');
  const reqs = {
    scope: useApi('/requests/scope'),
    booking: useApi('/requests/booking'),
    tech: useApi('/requests/tech'),
    ticket: useApi('/requests/ticket'),
  };

  const partners = (users.data?.users ?? []).filter(u => u.role === 'partner');
  const allLeads = leads.data?.leads ?? [];
  const pipe = pipeline(allLeads, l => l.owner?.commissionRate ?? DEFAULT_COMMISSION_RATE);
  const openKeys = cfg.stages.map(s => s.key).join(',');
  const money = earnings(projects.data?.projects ?? [], DEFAULT_COMMISSION_RATE);

  // Per-partner leaderboard.
  const board = partners
    .map(p => {
      const mine = allLeads.filter(l => l.owner?._id === p.id);
      const theirProjects = (projects.data?.projects ?? []).filter(pr => (typeof pr.owner === 'object' ? pr.owner._id : pr.owner) === p.id);
      // Each partner's commission uses their own rate (and each project's locked rate).
      const e = earnings(theirProjects, p.commissionRate);
      return { ...p, ...pipeline(mine, p.commissionRate), released: e.released, processing: e.processing, future: e.future };
    })
    .sort((a, b) => b.wonValue - a.wonValue || b.openValue - a.openValue);

  return (
    <>
      <PageHeader eyebrow="Admin" title="Overview" subtitle="All partners, pipeline and payouts across Mariox." />
      <Stats>
        <StatCard icon="users" tone="info" label="Partners" value={partners.length} hint={`${partners.filter(p => p.status === 'active').length} active`}
          href="/partners/admin/partners?status=active" info="All partner accounts. Opens the active partners." />
        <StatCard icon="pipe" tone="fire" label="Open pipeline" value={short(pipe.openValue)} hint={`${pipe.open} leads`}
          href={`/partners/admin/leads?view=list&stage=${openKeys}&sort=-value`} info="Deal value of every lead, across all partners, that is not Won or Lost." />
        <StatCard icon="trophy" tone="good" label="Won" value={short(pipe.wonValue)} hint={`${pipe.won} deals · ${pipe.winRate}% win rate`} good
          href={`/partners/admin/leads?view=list&stage=${WON}&sort=-value`} info="Deal value of Won leads. Win rate = Won ÷ (Won + Lost)." />
      </Stats>
      <div className="eyebrow" style={{ marginTop: 4 }}>Waiting on Mariox</div>
      <Stats>
        {KINDS.map(k => (
          <StatCard key={k.kind} icon={k.icon} tone="warn" label={k.label}
            value={(reqs[k.kind].data?.items ?? []).filter(i => k.open.includes(i.status)).length}
            hint={`Status: ${k.open.join(' or ')}`}
            href={`/partners/admin/requests?kind=${k.kind}&status=${k.open.join(',')}`}
            info={`${k.label} whose status is ${k.open.join(' or ')}: still need a decision or reply from Mariox.`} />
        ))}
        {acq.data && (
          <StatCard icon="target" tone="bad" label="Leads overdue" value={acq.data.leads.filter(overdue).length}
            hint="Partner acquisition" href="/partners/admin/acquisition"
            info="Acquisition leads whose meeting or follow-up date has passed: the team needs to update them." />
        )}
      </Stats>
      {acq.data && <AcquisitionCard leads={acq.data.leads} />}
      <div className="eyebrow" style={{ marginTop: 4 }}>Partner commissions</div>
      <EarningsStats e={money} releasedHint="Paid to partners" rateLabel="each partner's rate" hrefFor={() => '/partners/admin/projects'} />

      <Card title="Partner leaderboard" subtitle="Each partner at their own commission rate · Released = paid out · Pending = client paid, payout not released yet" action={<MoreLink href="/partners/admin/partners">Manage</MoreLink>}>
        <DataTable
          rows={board}
          rowKey={p => p.id}
          onRowClick={p => navigate(`/partners/admin/partners/${p.id}`)}
          empty="No partners yet"
          minWidth={980}
          columns={[
            { key: 'name', header: 'Partner', width: 'minmax(0,2fr)', render: p => <div className="row" style={{ minWidth: 0 }}><Avatar name={p.name} size="s" /><div><div className="strong">{p.name}</div><div className="sub">{p.company} · {p.partnerCode}</div></div></div> },
            { key: 'pct', header: 'Rate', width: '70px', align: 'right', render: p => <span className="num strong">{Math.round(p.commissionRate * 100)}%</span> },
            { key: 'open', header: 'Open', align: 'right', render: p => <span className="num">{p.open} · {short(p.openValue)}</span> },
            { key: 'won', header: 'Won', align: 'right', render: p => <span className="num">{p.won} · {short(p.wonValue)}</span> },
            { key: 'rel', header: 'Released', align: 'right', render: p => <span className="num">{short(p.released)}</span> },
            { key: 'proc', header: 'Pending payout', align: 'right', render: p => <span className="num" style={p.processing ? { color: 'var(--warn)', fontWeight: 600 } : undefined}>{short(p.processing)}</span> },
            { key: 'win', header: 'Win rate', width: '80px', align: 'right', render: p => `${p.winRate}%` },
          ]}
        />
      </Card>
    </>
  );
}

// Partner acquisition at a glance: how many people sit in each status, overdue and meetings today.
function AcquisitionCard({ leads }) {
  const od = leads.filter(overdue).length;
  const meetings = leads.filter(l => l.status === 'meeting' && l.meet?.date === today()).length;
  return (
    <Card title="Partner acquisition" subtitle={`${od} overdue · ${meetings} meeting${meetings === 1 ? '' : 's'} today`} action={<MoreLink href="/partners/admin/acquisition">Open</MoreLink>}>
      <div className="acq">
        <div className="ofun">
          {STATUSES.map(k => (
            <Link key={k} to="/partners/admin/acquisition" className="ofun-s"><span className="lbl">{ST[k][0]}</span><b className="num">{leads.filter(l => l.status === k).length}</b></Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
