import { useMemo } from 'react';
import { useSummaries } from '@/founders/summary/state/summaryContext';
import LoadState from '@/founders/summary/components/ui/LoadState';
import PageHeader from '@/founders/summary/components/layout/PageHeader';
import KpiCard from '@/founders/summary/components/ui/KpiCard';
import ExternalButton from '@/founders/summary/components/ui/ExternalButton';
import { partnerKpis, payoutSummary } from '@/founders/summary/domain/partners';
import { usePortalLinks } from '@/founders/summary/lib/portals';
import Payouts from './Payouts';
import RequestsQueue from './RequestsQueue';
import Recruitment from './Recruitment';
import Nudges from './Nudges';
import PartnerPipeline from './PartnerPipeline';
import Delivery from './Delivery';
import PartnersTable from './PartnersTable';
import NewPartnerLeads from './NewPartnerLeads';
import RequestKinds from './RequestKinds';
import PayoutsDue from './PayoutsDue';
import { RecruitmentAgenda, RecruitmentRecent } from './RecruitmentDetail';
import p from '@/founders/summary/styles/page.module.css';

export default function PartnersPage() {
  const ctx = useSummaries();
  if (!ctx.partners) return <LoadState source="partners" />;
  return <Partners partners={ctx.partners} now={ctx.loadedAt} />;
}

function Partners({ partners, now }) {
  const links = usePortalLinks();
  const payouts = useMemo(() => payoutSummary(partners, now), [partners, now]);
  const kpis = useMemo(() => partnerKpis(partners, payouts, now), [partners, payouts, now]);

  return (
    <div className={p.page}>
      <PageHeader
        backTo="/"
        eyebrow="Overview"
        mark="partners"
        title="Mariox · Partner portal"
        lede="Partner network: partners, partner leads, requests, commission and recruitment."
        actions={
          <ExternalButton dark href={links.partners}>
            Open partner portal app
          </ExternalButton>
        }
      />

      <section aria-label="Key numbers" className={p.kpis6}>
        {kpis.map(({ id, ...k }) => (
          <KpiCard key={id} compact {...k} />
        ))}
      </section>

      <PartnersTable roster={partners.roster} now={now} />

      <Payouts payouts={payouts} />

      {(partners.payoutsDue || partners.newLeads) && (
        <div className={p.two}>
          <PayoutsDue payouts={partners.payoutsDue} />
          <NewPartnerLeads leads={partners.newLeads} now={now} />
        </div>
      )}

      {(partners.pipeline?.stages || partners.delivery) && (
        <div className={p.two}>
          <PartnerPipeline pipeline={partners.pipeline} />
          <Delivery delivery={partners.delivery} />
        </div>
      )}

      <RequestKinds kinds={partners.requestKinds} now={now} />
      <RequestsQueue requests={partners.requests} now={now} />

      <div className={p.two}>
        <Recruitment recruitment={partners.recruitment} now={now} />
        <Nudges partners={partners} />
      </div>

      {(partners.recruitment.agenda || partners.recruitment.recent) && (
        <div className={p.two}>
          <RecruitmentAgenda agenda={partners.recruitment.agenda} />
          <RecruitmentRecent recent={partners.recruitment.recent} now={now} />
        </div>
      )}
    </div>
  );
}
