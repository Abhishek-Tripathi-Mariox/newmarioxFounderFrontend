import { isOpen } from '@/partners/lib/pipeline';

import { useApi } from './useApi';

// Client picker options, as in the original portal: clients you are delivering for,
// then your open leads, then "New prospect". Uses the same cached data as the dashboard.
export function useClientOptions() {
  const projects = useApi('/projects');
  const leads = useApi('/leads');
  const names = [
    ...(projects.data?.projects ?? []).map(p => p.client),
    ...(leads.data?.leads ?? []).filter(l => isOpen(l.stage)).map(l => l.company),
  ];
  return [...new Set(names.filter(Boolean)), 'New prospect'];
}
