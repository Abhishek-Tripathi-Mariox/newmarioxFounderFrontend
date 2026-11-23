import { useMemo } from 'react';
import { useSummaries } from '@/founders/summary/state/summaryContext';
import LoadState from '@/founders/summary/components/ui/LoadState';
import PageHeader from '@/founders/summary/components/layout/PageHeader';
import KpiCard from '@/founders/summary/components/ui/KpiCard';
import ExternalButton from '@/founders/summary/components/ui/ExternalButton';
import { marioxKpis } from '@/founders/summary/domain/mariox';
import { usePortalLinks } from '@/founders/summary/lib/portals';
import { withHealth } from '@/founders/summary/domain/projects';
import PipelineByStage from './PipelineByStage';
import SalesTeam from './SalesTeam';
import ProjectsTable from './ProjectsTable';
import TeamNow from './TeamNow';
import ReportsCard from './ReportsCard';
import TeamTasksCard from './TeamTasksCard';
import FollowUpsCard from './FollowUpsCard';
import NewLeadsCard from './NewLeadsCard';
import MilestonesCard from './MilestonesCard';
import BugsCard from './BugsCard';
import WaitingOnClients from './WaitingOnClients';
import HoursWeek from './HoursWeek';
import AttendanceWeek from './AttendanceWeek';
import p from '@/founders/summary/styles/page.module.css';

export default function MarioxPage() {
  const ctx = useSummaries();
  if (!ctx.mariox) return <LoadState source="mariox" />;
  return <Mariox mariox={ctx.mariox} now={ctx.loadedAt} />;
}

function Mariox({ mariox, now }) {
  const links = usePortalLinks();
  const projects = useMemo(() => withHealth(mariox.projects.list, now), [mariox, now]);
  const kpis = useMemo(() => marioxKpis(mariox, now), [mariox, now]);

  return (
    <div className={p.page}>
      <PageHeader
        backTo="/"
        eyebrow="Overview"
        mark="mariox"
        title="Mariox · Internal portal"
        lede="Direct sales and delivery: leads, follow-ups, projects, timesheets and attendance."
        actions={<ExternalButton href={links.internal}>Open internal portal app</ExternalButton>}
      />

      <section aria-label="Key numbers" className={p.kpis6}>
        {kpis.map(({ id, ...k }) => (
          <KpiCard key={id} compact {...k} />
        ))}
      </section>

      <div className={p.two}>
        <PipelineByStage sales={mariox.sales} quotes={mariox.quotes} />
        <SalesTeam owners={mariox.sales.owners} />
      </div>

      {(mariox.sales.followUps?.due || mariox.sales.newLeads) && (
        <div className={p.two}>
          <FollowUpsCard followUps={mariox.sales.followUps} now={now} />
          <NewLeadsCard sales={mariox.sales} now={now} />
        </div>
      )}

      {(mariox.reports || mariox.teamTasks) && (
        <div className={p.two}>
          <ReportsCard reports={mariox.reports} now={now} />
          <TeamTasksCard tasks={mariox.teamTasks} />
        </div>
      )}

      <ProjectsTable projects={projects} running={mariox.projects.running} onHold={mariox.projects.onHold} />

      {(mariox.projects.milestones || mariox.bugs.bySeverity) && (
        <div className={p.two}>
          <MilestonesCard milestones={mariox.projects.milestones} now={now} />
          <BugsCard bugs={mariox.bugs} now={now} />
        </div>
      )}

      {(mariox.changeRequests.list || mariox.hoursWeek) && (
        <div className={p.two}>
          <WaitingOnClients changeRequests={mariox.changeRequests} quotes={mariox.quotes} now={now} />
          <HoursWeek hours={mariox.hoursWeek} />
        </div>
      )}

      <TeamNow team={mariox.team} now={now} />
      <AttendanceWeek week={mariox.team.week} />
    </div>
  );
}
