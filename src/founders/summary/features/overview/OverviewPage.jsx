import { useMemo, useState } from 'react';
import { useSummaries } from '@/founders/summary/state/summaryContext';
import LoadState from '@/founders/summary/components/ui/LoadState';
import PageHeader from '@/founders/summary/components/layout/PageHeader';
import Segmented from '@/founders/summary/components/ui/Segmented';
import KpiCard from '@/founders/summary/components/ui/KpiCard';
import { useHandled } from '@/founders/summary/hooks/useHandled';
import { buildAlerts } from '@/founders/summary/domain/alerts';
import { overviewKpis, weeklyTrend } from '@/founders/summary/domain/overview';
import { payoutSummary } from '@/founders/summary/domain/partners';
import { withHealth } from '@/founders/summary/domain/projects';
import { longDate } from '@/founders/summary/lib/format';
import { useViewerName } from '@/founders/summary/lib/viewer';
import { EMPTY_MARIOX, EMPTY_PARTNERS } from '@/founders/summary/data/empty';
import AlertsList from './AlertsList';
import MarioxCard from './MarioxCard';
import PartnersCard from './PartnersCard';
import RevenueTrend from './RevenueTrend';
import TopPartners from './TopPartners';
import p from '@/founders/summary/styles/page.module.css';

const PERIODS = [
  ['today', 'Today'],
  ['week', 'This week'],
  ['month', 'This month'],
];
const COMPANIES = [
  ['both', 'Both'],
  ['mariox', 'Internal'],
  ['partners', 'Partners'],
];
function greeting(now, name) {
  const h = now.getHours();
  const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${part}, ${name}` : part;
}

export default function OverviewPage() {
  const ctx = useSummaries();
  if (!ctx.mariox && !ctx.partners) return <LoadState />;
  // A portal that didn't load is shown as empty, with a note, so the other portal's numbers still show.
  const missing = ['mariox', 'partners'].filter((name) => !ctx[name] && ctx.sources[name].status === 'error');
  return (
    <Overview
      mariox={ctx.mariox || EMPTY_MARIOX}
      partners={ctx.partners || EMPTY_PARTNERS}
      hasMariox={Boolean(ctx.mariox)}
      hasPartners={Boolean(ctx.partners)}
      missing={missing.map((name) => ({ name, error: ctx.sources[name].error }))}
      now={ctx.loadedAt}
    />
  );
}

const PORTAL_NAMES = { mariox: 'Internal portal', partners: 'Partner portal' };

function Overview({ mariox, partners, hasMariox, hasPartners, missing, now }) {
  const viewerName = useViewerName();
  const [period, setPeriod] = useState('month');
  const [company, setCompany] = useState('both');
  const [handled, toggleHandled] = useHandled(now);

  const projects = useMemo(() => withHealth(mariox.projects.list, now), [mariox, now]);
  const payouts = useMemo(() => payoutSummary(partners, now), [partners, now]);
  const alerts = useMemo(() => buildAlerts({ mariox, partners, payouts, projects, now }), [mariox, partners, payouts, projects, now]);
  const kpis = useMemo(
    () => overviewKpis({ period, mariox, partners, payouts, projects, now }),
    [period, mariox, partners, payouts, projects, now],
  );
  const weeks = useMemo(() => weeklyTrend(mariox, partners), [mariox, partners]);

  const showMariox = company !== 'partners' && hasMariox;
  const showPartners = company !== 'mariox' && hasPartners;
  const visibleAlerts = alerts.filter((a) => (a.company === 'mariox' ? showMariox : showPartners));

  return (
    <div className={p.page}>
      <PageHeader
        eyebrow={longDate(now)}
        title={greeting(now, viewerName)}
        lede="Mariox: internal portal and partner portal in one place."
        actions={
          <>
            <Segmented label="Period" options={PERIODS} value={period} onChange={setPeriod} />
            <Segmented label="Company" options={COMPANIES} value={company} onChange={setCompany} />
          </>
        }
      />

      {missing.map(({ name, error }) => (
        <p key={name} role="status" className={p.notice}>
          <strong>{PORTAL_NAMES[name]} numbers didn’t load.</strong> {error} The rest of this page shows the other portal only.
        </p>
      ))}

      <AlertsList alerts={visibleAlerts} handled={handled} onToggle={toggleHandled} />

      <section aria-label="Key numbers" className={p.kpis3}>
        {kpis.filter((k) => (k.company === 'mariox' ? hasMariox : k.company === 'partners' ? hasPartners : true)).map(({ id, ...k }) => (
          <KpiCard key={id} {...k} />
        ))}
      </section>

      <div className={p.two}>
        {showMariox && <MarioxCard mariox={mariox} projects={projects} />}
        {showPartners && <PartnersCard partners={partners} payouts={payouts} now={now} />}
      </div>

      <RevenueTrend weeks={weeks} />
      {hasPartners && <TopPartners partners={partners} payouts={payouts} now={now} />}
    </div>
  );
}
