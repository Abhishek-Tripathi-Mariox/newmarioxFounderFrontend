import { Link } from 'react-router-dom';
import { Announcement } from '@/partners/components/Announcement';
import { CommissionHero } from '@/partners/components/earnings/CommissionHero';
import { TaskRow } from '@/partners/components/leads/TaskRow';
import { MiniPartnerCard } from '@/partners/components/PartnerCard';
import { useUser } from '@/partners/components/UserProvider';
import { Avatar, ButtonLink, Card, MoreLink, Note, PageHeader, Progress, StatCard, Steps } from '@/partners/components/ui';
import { useApi } from '@/partners/hooks/useApi';
import { api } from '@/partners/api';
import { DEFAULT_COMMISSION_RATE, PROJECT_STAGES } from '@/partners/lib/constants';
import { isOpen, stageColor } from '@/partners/lib/pipeline';
import { usePipeline } from '@/partners/components/SettingsProvider';
import { date, inr, pct, short, todayISO } from '@/partners/lib/format';
import { earnings, pipeline } from '@/partners/lib/metrics';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export default function DashboardPage() {
  const { user } = useUser();
  const cfg = usePipeline();
  const leads = useApi('/leads');
  const projects = useApi('/projects');

  const rate = user?.commissionRate ?? DEFAULT_COMMISSION_RATE;
  const allLeads = leads.data?.leads ?? [];
  const allProjects = projects.data?.projects ?? [];
  const m = earnings(allProjects, rate);
  const pipe = pipeline(allLeads, rate);
  const upcoming = m.ledger.filter(x => x.state === 'due' || x.state === 'upcoming');

  const tasks = allLeads
    .filter(l => isOpen(l.stage))
    .flatMap(l => l.tasks.filter(t => !t.done).map(t => ({ task: t, lead: l })))
    .sort((a, b) => ((a.task.due || '9') < (b.task.due || '9') ? -1 : 1));
  const overdue = tasks.filter(t => t.task.due && t.task.due < todayISO()).length;

  const funnel = cfg.stages.map(st => {
    const ls = allLeads.filter(l => l.stage === st.key);
    return { st, n: ls.length, v: ls.reduce((a, l) => a + l.value, 0) };
  });
  const fmax = Math.max(...funnel.map(f => f.v), 1);

  const sample = allProjects[0];
  const samplePaid = sample ? sample.payments.filter(p => p.status === 'received').reduce((a, p) => a + p.amount, 0) : 0;

  async function toggleTask(leadId, taskId) {
    await api.patch(`/leads/${leadId}`, { toggleTask: taskId });
    leads.reload();
  }

  if (!user) return null;
  const first = user.name.split(' ')[0];
  const ratePct = Math.round(rate * 100);

  return (
    <>
      <PageHeader
        big
        eyebrow={<><span className="dot" />{user.company || 'Mariox partner'} · {ratePct}% commission partner</>}
        title={<>{greeting()}, {first}.<br /><em>{m.processing ? `${short(m.processing)} is on its way to you.` : 'Every payout is up to date.'}</em></>}
        actions={
          <>
            <ButtonLink href="/partners/leads?new=1" icon="plus">Add lead</ButtonLink>
            <ButtonLink href="/partners/scope?new=1" icon="fileCheck">Submit scope</ButtonLink>
            <ButtonLink href="/partners/visits?new=1" icon="cal" variant="ink">Book office visit</ButtonLink>
          </>
        }
      />

      <Announcement />

      <div className="bento">
        <CommissionHero e={m} bankLabel={user.bankAccount ? `${user.ifsc?.slice(0, 4) || 'Bank'} ••${user.bankAccount.slice(-4)}` : undefined} />

        <div className="c4 stack" style={{ gap: 16 }}>
          <MiniPartnerCard user={user} />
          <Card
            title="Follow-ups"
            subtitle={<>{tasks.length} open{overdue ? <> · <span style={{ color: 'var(--bad)' }}>{overdue} overdue</span></> : null}</>}
            action={<MoreLink href="/partners/leads">All</MoreLink>}
            style={{ flex: 1 }}
          >
            {tasks.length ? (
              tasks.slice(0, 3).map(({ task, lead }) => (
                <TaskRow key={task._id} task={task} company={lead.company} href={`/partners/leads/${lead._id}`} onToggle={() => toggleTask(lead._id, task._id)} />
              ))
            ) : (
              <div className="empty">You’re all caught up.</div>
            )}
          </Card>
        </div>

        <div className="c4 kpi-w">
          <StatCard icon="building" tone="info" label="Total deal value" value={short(m.deal)} hint={`${allProjects.length} clients closed`} href="/partners/projects"
            info="Contract value of every project Mariox is delivering for your clients." />
        </div>
        <div className="c4 kpi-w">
          <StatCard icon="check" tone="good" label="Received from clients" value={short(m.received)} hint={`${pct(m.received, m.deal)}% collected`} extra={<Progress value={pct(m.received, m.deal)} />}
            href="/partners/earnings?status=Released" info="Client payments Mariox has received, across all your projects." />
        </div>
        <div className="c4 kpi-w">
          <StatCard icon="clock" tone="warn" label="Pending from clients" value={short(m.deal - m.received)} hint={`Next due ${upcoming[0] ? date(upcoming[0].due) : '—'}`}
            href="/partners/earnings?status=Upcoming" info="Total deal value minus what clients have paid so far." />
        </div>

        {sample && (
          <Card className="c7" title="How your commission is calculated" subtitle={`${sample.client} · ${sample.title}`}>
            <div className="g3" style={{ gap: 10, alignItems: 'stretch' }}>
              <Note label="Deal closed" value={short(sample.deal)} href={`/partners/projects#p-${sample._id}`} />
              <Note label="Paid to Mariox" value={short(samplePaid)} href={`/partners/projects#p-${sample._id}`} info="Sum of this project's client payments marked received." />
              <Note label={`Your ${ratePct}%`} value={short(samplePaid * rate)} good href="/partners/earnings?status=Released" info={`Paid to Mariox × ${ratePct}%.`} />
            </div>
            <div style={{ margin: '18px 0 10px' }}><Progress value={pct(samplePaid, sample.deal)} tone="fire" size="lg" /></div>
            <p className="sub">The remaining {short((sample.deal - samplePaid) * rate)} is released as the client pays the next milestones.</p>
          </Card>
        )}

        <Card className={sample ? 'c5' : 'c12'} title="Pipeline" subtitle={`${short(pipe.openValue)} open · ${short(pipe.wonValue)} won (${pipe.won} deal${pipe.won === 1 ? '' : 's'})`} action={<MoreLink href="/partners/leads">Open</MoreLink>}>
          <div className="stack" style={{ gap: 10 }}>
            {funnel.map(f => (
              <Link key={f.st.key} to={`/partners/leads?view=list&stage=${f.st.key}`} className="funnel-row" title={`${f.n} lead(s) in ${f.st.name}`}>
                <span style={{ color: 'var(--muted)' }}>{f.st.name}</span>
                <div className="bar"><i style={{ width: `${Math.max(3, (f.v / fmax) * 100)}%`, background: stageColor(cfg, f.st.key) }} /></div>
                <span className="num strong" style={{ textAlign: 'right' }}>{f.n ? short(f.v) : '—'}</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="c6" title="Upcoming client payments" action={<MoreLink href="/partners/earnings">All commissions</MoreLink>}>
          {upcoming.length ? (
            upcoming.slice(0, 4).map(u => (
              <div className="li" key={`${u.projectId}-${u._id}`}>
                <div className="row" style={{ minWidth: 0 }}>
                  <Avatar name={u.client} size="s" />
                  <div style={{ minWidth: 0 }}>
                    <div className="li-t">{u.client}</div>
                    <div className="sub">{u.label} · due {date(u.due)}</div>
                  </div>
                </div>
                <div className="li-r">
                  <span className="num strong">{inr(u.amount)}</span>
                  <span className="earn num" style={{ fontSize: 12.5 }}>You earn {inr(u.commission)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">No upcoming payments</div>
          )}
        </Card>

        <Card className="c6" title="Projects" action={<MoreLink href="/partners/projects">Project status</MoreLink>}>
          {allProjects.length ? (
            allProjects.map(p => (
              <a key={p._id} className="li btn-li" href={`/partners/projects#p-${p._id}`} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                <div className="between">
                  <div style={{ minWidth: 0 }}>
                    <div className="li-t">{p.title}</div>
                    <div className="sub">{p.client}</div>
                  </div>
                  <span className="pill s-fire">{PROJECT_STAGES[p.stage]}</span>
                </div>
                <Steps total={PROJECT_STAGES.length} current={p.stage} />
              </a>
            ))
          ) : (
            <div className="empty">Won deals appear here once delivery starts.</div>
          )}
        </Card>
      </div>
    </>
  );
}
