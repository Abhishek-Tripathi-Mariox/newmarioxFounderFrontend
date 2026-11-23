import { DynamicForm } from '@/partners/components/forms/DynamicForm';
import { VisitingCard } from '@/partners/components/PartnerCard';
import { useUser } from '@/partners/components/UserProvider';
import { PasswordCard, SessionsCard } from '@/partners/components/account/SecurityCard';
import { Card, Icon, Note, PageHeader, Tabs, useToast } from '@/partners/components/ui';
import { useAccountTab } from '@/partners/hooks/useAccountTab';
import { useApi } from '@/partners/hooks/useApi';
import { api } from '@/partners/api';
import { date, short } from '@/partners/lib/format';
import { earnings, pipeline } from '@/partners/lib/metrics';
import { LOST, WON } from '@/partners/lib/pipeline';

import { R } from '@/partners/lib/validate';

const FIELDS = [
  { name: 'name', label: 'Full name', required: true, rule: R.person },
  { name: 'company', label: 'Company', rule: R.company },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'city', label: 'City', rule: R.city },
  { name: 'industries', label: 'Industries you sell into', full: true, placeholder: 'e.g. Healthcare, Retail, Logistics', rule: R.tags },
  { name: 'pan', label: 'PAN', placeholder: 'ABCDE1234F', rule: R.pan },
  { name: 'gstin', label: 'GSTIN', placeholder: 'Optional · 09ABCDE1234F1Z5', rule: R.gstin },
  { name: 'bankAccount', label: 'Bank account number', placeholder: '9–18 digits', rule: R.bankAccount },
  { name: 'ifsc', label: 'IFSC', placeholder: 'HDFC0001234', rule: R.ifsc },
];

export default function ProfilePage() {
  const { user, reload } = useUser();
  const toast = useToast();
  const [tab, setTab] = useAccountTab();
  const leads = useApi('/leads');
  const projects = useApi('/projects');
  if (!user) return null;

  const m = earnings(projects.data?.projects ?? [], user.commissionRate);
  const p = pipeline(leads.data?.leads ?? [], user.commissionRate);

  return (
    <>
      <PageHeader eyebrow="Partner profile" title={user.name} subtitle={`${user.company || 'Mariox partner'} · Certified Mariox partner since ${date(user.createdAt)}`} />
      <div><Tabs tabs={[{ value: 'profile', label: <><Icon name="idcard" size="s" />Profile</> }, { value: 'security', label: <><Icon name="shield" size="s" />Password & security</> }]} value={tab} onChange={setTab} /></div>
      {tab === 'security' ? (
        <div className="split">
          <PasswordCard />
          <div className="stack stick" style={{ gap: 16 }}>
            <SessionsCard user={user} />
          </div>
        </div>
      ) : (
      <div className="split pf">
        <div className="stack" style={{ gap: 18 }}>
          <VisitingCard user={user} />
          <div className="g4" style={{ gap: 10 }}>
            <Note label="Clients closed" value={projects.data?.projects.length ?? 0} href="/partners/projects" />
            <Note label="Business won" value={short(m.deal)} href="/partners/projects" info="Contract value of all your projects." />
            <Note label="Lifetime potential" value={short(m.potential)} good href="/partners/earnings" info="Released + processing + future commission on closed deals." />
            <Note label="Win rate" value={p.won + p.lost ? `${p.winRate}%` : '—'} href={`/partners/leads?view=list&stage=${WON},${LOST}`} info="Won ÷ (Won + Lost) leads." />
          </div>
        </div>
        <Card title="Details and payout account" subtitle={`${user.email} · ${user.partnerCode}`}>
          <DynamicForm
            key={user.id}
            fields={FIELDS}
            initial={user}
            submitLabel="Save profile"
            onSubmit={async v => {
              await api.patch('/me', Object.fromEntries(FIELDS.map(f => [f.name, v[f.name] ?? ''])));
              await reload();
              toast('Profile saved');
            }}
          />
        </Card>
      </div>
      )}
    </>
  );
}
