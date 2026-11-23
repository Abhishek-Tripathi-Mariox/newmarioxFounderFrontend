import { useEffect, useState } from 'react';
import { REQUESTS } from '@/partners/components/requests/config';
import { RequestsView } from '@/partners/components/requests/RequestsView';
import { PageHeader, Tabs } from '@/partners/components/ui';

const KINDS = Object.keys(REQUESTS);

export default function AdminRequestsPage() {
  const [kind, setKind] = useState('scope');
  const [initial, setInitial] = useState(null);

  // Deep link from overview tiles: /admin/requests?kind=ticket&status=requested,assigned
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const k = p.get('kind');
    if (k && k in REQUESTS) setKind(k);
    setInitial({ status: p.get('status') ?? undefined });
  }, []);

  const switchKind = (k) => {
    setInitial({});
    setKind(k);
  };
  return (
    <>
      <PageHeader eyebrow="Admin" title="Partner requests" subtitle="Click a row to approve, assign, reschedule or reply." />
      <div><Tabs tabs={KINDS.map(k => ({ value: k, label: REQUESTS[k].title }))} value={kind} onChange={switchKind} /></div>
      {initial && <RequestsView key={kind} kind={kind} admin embedded initialStatus={initial.status} />}
    </>
  );
}
