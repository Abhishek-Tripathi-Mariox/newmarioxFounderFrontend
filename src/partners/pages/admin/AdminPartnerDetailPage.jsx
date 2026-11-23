import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { DeletePartnerDialog } from '@/partners/components/admin/DeletePartnerDialog';
import { DynamicForm } from '@/partners/components/forms/DynamicForm';
import { PipelineView } from '@/partners/components/leads/PipelineView';
import { ProjectList } from '@/partners/components/projects/ProjectList';
import { AttachmentList } from '@/partners/components/forms/FileUploader';
import { Button, Check, EmptyState, Icon, Input, Modal, StatCard, Stats, StatusBadge, Tabs, hue, initials, useToast, SkeletonCards } from '@/partners/components/ui';
import { useApi } from '@/partners/hooks/useApi';
import { api } from '@/partners/api';
import { date, inr, short } from '@/partners/lib/format';
import { earnings, pipeline } from '@/partners/lib/metrics';

import { R } from '@/partners/lib/validate';
import { usePpCan } from '@/partners/hooks/usePpCan';

const EDIT_FIELDS = [
  { name: 'name', label: 'Full name', required: true, rule: R.person },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'company', label: 'Company', rule: R.company },
  { name: 'city', label: 'City', rule: R.city },
  { name: 'commissionPct', label: 'Commission (%)', type: 'number', rule: v => (v && (+v < 0 || +v > 100) ? 'Commission is between 0 and 100%' : null) },
  { name: 'industries', label: 'Industries', full: true, placeholder: 'e.g. Healthcare, Retail, Logistics', rule: R.tags },
  { name: 'pan', label: 'PAN', placeholder: 'ABCDE1234F', rule: R.pan },
  { name: 'gstin', label: 'GSTIN', placeholder: 'Optional · 09ABCDE1234F1Z5', rule: R.gstin },
  { name: 'bankAccount', label: 'Bank account', placeholder: '9–18 digits', rule: R.bankAccount },
  { name: 'ifsc', label: 'IFSC', placeholder: 'HDFC0001234', rule: R.ifsc },
];

const KINDS = ['scope', 'booking', 'tech', 'ticket'];
const KIND_LABEL = { scope: 'Scope', booking: 'Office visit', tech: 'Tech request', ticket: 'Ticket' };

export default function PartnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const can = usePpCan();
  // Each tab needs its own section's View (the API refuses the rest).
  const seeLeads = can('pp_leads');
  const seeProjects = can('pp_projects');
  const seeReqs = can('pp_requests');
  const mayEdit = can('pp_partners', 'e');
  const { data, setData } = useApi(`/admin/users/${id}`);
  const leads = useApi(seeLeads ? `/leads?owner=${id}` : null);
  const projects = useApi(seeProjects ? `/projects?owner=${id}` : null);
  const reqs = {
    scope: useApi(seeReqs ? `/requests/scope?owner=${id}` : null),
    booking: useApi(seeReqs ? `/requests/booking?owner=${id}` : null),
    tech: useApi(seeReqs ? `/requests/tech?owner=${id}` : null),
    ticket: useApi(seeReqs ? `/requests/ticket?owner=${id}` : null),
  };
  const [tabPicked, setTab] = useState(null);
  const [editing, setEditing] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [emailPw, setEmailPw] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const u = data?.user;
  if (!u) return <SkeletonCards count={2} height={200} />;

  const mine = (projects.data?.projects ?? []).filter(p => (typeof p.owner === 'object' ? p.owner._id : p.owner) === id);
  const m = earnings(mine, u.commissionRate);
  const pipe = pipeline(leads.data?.leads ?? [], u.commissionRate);
  const myReqs = KINDS.flatMap(k => (reqs[k].data?.items ?? []).filter(r => (typeof r.owner === 'object' ? r.owner._id : r.owner) === id).map(r => ({ r, kind: k })));

  async function patch(body, msg) {
    try {
      const res = await api.patch(`/admin/users/${id}`, body);
      setData({ user: res.user });
      if (res.mail && !res.mail.sent) toast(`${msg}, but the email failed: ${res.mail.error}`, true);
      else toast(res.mail ? `${msg} · emailed to ${res.mail.to}` : msg);
      return res;
    } catch (e) {
      toast(e.message, true);
    }
  }

  const suspended = u.status === 'disabled';
  const tabs = [
    seeLeads && { value: 'leads', label: 'Leads', count: leads.data?.leads.length },
    seeProjects && { value: 'projects', label: 'Projects', count: mine.length },
    seeReqs && { value: 'requests', label: 'Requests', count: myReqs.length },
  ].filter(Boolean);
  const tab = tabPicked ?? tabs[0]?.value;

  return (
    <>
      <div className="row wrap" style={{ gap: 8 }}>
        <Link className="more" to="/partners/admin/partners"><Icon name="chevL" size="s" />All partners</Link>
        <span className="spacer" />
        {mayEdit && <Button size="sm" icon="note" onClick={() => setEditing(true)}>Edit details</Button>}
        {mayEdit && <Button size="sm" icon="shield" onClick={() => setPwOpen(true)}>Set password</Button>}
        {!mayEdit ? null : suspended ? (
          <Button size="sm" variant="good" icon="check" onClick={() => patch({ status: 'active' }, 'Partner reactivated')}>Reactivate</Button>
        ) : (
          <Button size="sm" variant="danger" icon="alert" onClick={() => confirm(`Suspend ${u.name}? They are signed out at once and can't log in.`) && patch({ status: 'disabled' }, 'Partner suspended')}>Suspend</Button>
        )}
        {can('pp_partners', 'd') && <Button size="sm" variant="danger" icon="trash" onClick={() => setDeleting(true)}>Delete</Button>}
      </div>

      <div className="ccard" style={{ ['--glow']: `hsla(${hue(u.name)},70%,55%,.55)`, padding: 26 }}>
        <div className="between wrap" style={{ alignItems: 'flex-start', gap: 18 }}>
          <div className="row" style={{ gap: 14 }}>
            <span className="big-av" style={{ background: `hsl(${hue(u.name)} 52% 46%)` }}>{initials(u.name)}</span>
            <div>
              <div className="row" style={{ gap: 10 }}>
                <div style={{ font: '700 30px/1.05 var(--display)', letterSpacing: '-.035em' }}>{u.name}</div>
                <StatusBadge status={u.status} />
              </div>
              <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
                {[u.partnerCode, u.company, u.city, u.email, u.phone].filter(Boolean).join(' · ')}
              </div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
                Joined {date(u.createdAt)} via {u.source} · last login {u.lastLoginAt ? date(u.lastLoginAt) : 'never'}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="lbl">Commission</div>
            <div style={{ font: '700 30px var(--display)', letterSpacing: '-.03em' }}>{Math.round(u.commissionRate * 100)}%</div>
          </div>
        </div>
      </div>

      {(seeLeads || seeProjects) && <Stats>
        {seeLeads && <StatCard icon="pipe" tone="fire" label="Open pipeline" value={short(pipe.openValue)} hint={`${pipe.open} leads`} onClick={() => setTab('leads')} active={tab === 'leads'}
          info="This partner's leads that are not Won or Lost." />}
        {seeLeads && <StatCard icon="trophy" tone="good" label="Deals won" value={short(pipe.wonValue)} hint={`${pipe.won} won · ${pipe.winRate}% win rate`} onClick={() => setTab('leads')}
          info="Won leads. Win rate = Won ÷ (Won + Lost)." />}
        {seeProjects && <StatCard icon="check" tone="good" label="Commission released" value={inr(m.released)} hint={`${mine.length} projects`} good onClick={() => setTab('projects')} active={tab === 'projects'}
          info={`Received client payments with payout released × ${Math.round(u.commissionRate * 100)}%.`} />}
        {seeProjects && <StatCard icon="refresh" tone="warn" label="Pending payout" value={inr(m.processing)} hint="Client paid, not yet released" onClick={() => setTab('projects')}
          info="Client has paid Mariox but the partner's commission is not released yet. Release it from the project's payment schedule." />}
      </Stats>}

      {tabs.length > 0 && (
        <div>
          <Tabs tabs={tabs} value={tab} onChange={setTab} />
        </div>
      )}

      {tab === 'leads' && <PipelineView admin partnerId={id} />}
      {tab === 'projects' && <ProjectList ownerId={id} rate={u.commissionRate} />}
      {tab === 'requests' && (
        <div className="card">
          {myReqs.length ? (
            myReqs.map(({ r, kind }) => (
              <Link key={r._id} to="/partners/admin/requests" className="li btn-li">
                <div>
                  <div className="li-t">{String(r.project || r.subject || r.type || r.client)}</div>
                  <div className="sub">{KIND_LABEL[kind]} · {String(r.client ?? r.category ?? '')} · {date(r.createdAt)}</div>
                </div>
                <span className="row" style={{ gap: 10 }}>
                  {Array.isArray(r.attachments) && r.attachments.length > 0 && <AttachmentList files={r.attachments} compact />}
                  <StatusBadge status={r.status} />
                </span>
              </Link>
            ))
          ) : (
            <div className="empty">No requests from this partner</div>
          )}
        </div>
      )}

      <Modal open={editing} title={`Edit ${u.name}`} onClose={() => setEditing(false)} wide>
        <DynamicForm
          fields={EDIT_FIELDS}
          initial={{ ...u, commissionPct: Math.round(u.commissionRate * 100) }}
          submitLabel="Save partner"
          onCancel={() => setEditing(false)}
          onSubmit={async v => {
            const { commissionPct, ...rest } = v;
            const body = Object.fromEntries(EDIT_FIELDS.filter(f => f.name !== 'commissionPct').map(f => [f.name, rest[f.name] ?? '']));
            const res = await api.patch(`/admin/users/${id}`, { ...body, commissionRate: Number(commissionPct) / 100 });
            setData({ user: res.user });
            setEditing(false);
            toast('Partner updated');
          }}
        />
      </Modal>

      <Modal open={pwOpen} title="Set a new password" onClose={() => setPwOpen(false)}>
        <form
          className="stack"
          onSubmit={async e => {
            e.preventDefault();
            if ((await patch({ password, emailPassword: emailPw }, 'Password updated')) !== undefined) {
              setPwOpen(false);
              setPassword('');
            }
          }}
        >
          <Input label="New password" type="text" minLength={8} required hint="At least 8 characters. Signs the partner out of every device." value={password} onChange={e => setPassword(e.target.value)} />
          <Check checked={emailPw} onChange={setEmailPw}>Email the portal link, email and new password to {u.email}</Check>
          <div className="form-foot">
            <Button type="button" variant="ghost" onClick={() => setPwOpen(false)}>Cancel</Button>
            <Button variant="fire">Save password</Button>
          </div>
        </form>
      </Modal>

      {deleting && <DeletePartnerDialog partner={{ id, name: u.name, email: u.email }} onClose={() => setDeleting(false)} onDeleted={() => { toast('Partner deleted'); navigate('/partners/admin/partners'); }} />}
    </>
  );
}
