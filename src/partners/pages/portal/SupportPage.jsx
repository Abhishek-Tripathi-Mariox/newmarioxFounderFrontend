import { RequestsView } from '@/partners/components/requests/RequestsView';
import { initials } from '@/partners/components/ui';
import { useApi } from '@/partners/hooks/useApi';

const digits = (s) => s.replace(/\D/g, '');

// Dark leadership card with direct contact buttons.
function LeaderCard({ c }) {
  return (
    <div className="leader">
      <div className="row" style={{ gap: 14 }}>
        <span className="big-av" style={{ background: 'rgba(255,255,255,.08)' }}>{initials(c.name || c.title)}</span>
        <div>
          <div style={{ font: '700 19px var(--display)', letterSpacing: '-.02em' }}>{c.name}</div>
          <div className="muted" style={{ fontSize: 13 }}>{c.role}, Mariox Software</div>
        </div>
      </div>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>{c.note}</p>
      <div className="g3" style={{ gap: 8 }}>
        <a className="btn wa" href={c.phone ? `https://wa.me/${digits(c.phone)}` : undefined} target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="btn o" href={c.email ? `mailto:${c.email}` : undefined}>Email</a>
        <a className="btn o" href={c.phone ? `tel:${c.phone}` : undefined}>Call</a>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const { data } = useApi('/settings');
  const contacts = data?.settings.contacts ?? [];

  return (
    <RequestsView
      kind="ticket"
      above={contacts.length > 0 && <div className="g3">{contacts.map(c => <LeaderCard key={c.title + c.name} c={c} />)}</div>}
    />
  );
}
