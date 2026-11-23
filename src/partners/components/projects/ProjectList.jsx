import { Button, EmptyState, Pagination, SearchInput, Select, SkeletonCards } from '@/partners/components/ui';
import { useList } from '@/partners/hooks/useList';
import { PROJECT_STAGES } from '@/partners/lib/constants';

import { ProjectCard } from './ProjectCard';

const SORTS = [
  { value: '-closedAt', label: 'Recently closed' },
  { value: 'closedAt', label: 'Oldest first' },
  { value: '-deal', label: 'Deal value: high to low' },
  { value: 'deal', label: 'Deal value: low to high' },
  { value: 'client', label: 'Client A–Z' },
];

// Paginated project cards with search, stage and partner filters, and sort.
export function ProjectList({ partners, rate, ownerId, action, listRef }) {
  const list = useList(`/projects${ownerId ? `?owner=${ownerId}` : ''}`, 'projects', { sort: '-closedAt', limit: 10, urlState: !ownerId });
  listRef?.(list.reload);

  return (
    <>
      <div className="toolbar">
        <SearchInput value={list.q} onChange={list.setQ} placeholder="Search client, project or PM" width={360} />
        <div style={{ width: 180 }}>
          <Select options={PROJECT_STAGES.map((s, i) => ({ value: String(i), label: s }))} placeholder="All stages" value={list.filters.stage ?? ''} onChange={e => list.setFilter('stage', e.target.value)} aria-label="Stage" />
        </div>
        {partners && !ownerId && (
          <div style={{ width: 220 }}>
            <Select options={partners.map(p => ({ value: p.id, label: `${p.name} · ${p.partnerCode}` }))} placeholder="All partners" value={list.filters.owner ?? ''} onChange={e => list.setFilter('owner', e.target.value)} aria-label="Partner" />
          </div>
        )}
        <div style={{ width: 220 }}>
          <Select options={SORTS} value={list.sort} onChange={e => list.setSort(e.target.value)} aria-label="Sort" />
        </div>
        {list.filtered && <Button size="sm" variant="ghost" icon="x" onClick={list.clear}>Clear</Button>}
      </div>

      {list.loading && !list.items ? (
        <SkeletonCards />
      ) : list.items?.length ? (
        <div className="stack" style={{ gap: 20, opacity: list.loading ? 0.6 : 1 }}>
          {list.items.map(p => <ProjectCard key={p._id} project={p} rate={rate} action={action?.(p)} />)}
        </div>
      ) : (
        <EmptyState title={list.filtered ? 'No projects match your filters' : 'No projects yet'}>
          {!list.filtered && 'Won deals appear here once Mariox starts delivery.'}
        </EmptyState>
      )}
      <Pagination meta={list.meta} onPage={list.setPage} onLimit={list.setLimit} label="projects" />
    </>
  );
}
