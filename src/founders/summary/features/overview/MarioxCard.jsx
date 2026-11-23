import { TabLink } from '@/founders/summary/lib/TabLink';
import Card from '@/founders/summary/components/ui/Card';
import CompanyMark from '@/founders/summary/components/ui/CompanyMark';
import BarList from '@/founders/summary/components/ui/BarList';
import Pill from '@/founders/summary/components/ui/Pill';
import Tile from '@/founders/summary/components/ui/Tile';
import { overdueFollowUps, pipelineTotals } from '@/founders/summary/domain/mariox';
import { attentionText, needsAttention } from '@/founders/summary/domain/projects';
import { lakh, plural } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

export default function MarioxCard({ mariox, projects }) {
  const { sales, changeRequests, bugs } = mariox;
  const open = pipelineTotals(sales.stages);
  const overdue = overdueFollowUps(mariox);
  const attention = projects.filter(needsAttention);

  return (
    <Card
      lead={<CompanyMark company="mariox" />}
      title="Internal portal"
      subtitle="Direct sales and delivery"
      actions={
        <TabLink to="/mariox" className={`${u.btn} ${u.btnMariox}`}>
          View details
        </TabLink>
      }
    >
      <div className={p.block}>
        <div className={p.blockHead}>
          <h3 className={p.blockTitle}>Open pipeline by stage</h3>
          <span className={u.cardSub}>
            {plural(open.count, 'deal')} · {lakh(open.value)}
          </span>
        </div>
        <BarList
          color="var(--mariox)"
          rows={sales.stages.map((s) => ({ key: s.key, label: s.name, value: s.value, right: `${s.count} · ${lakh(s.value)}` }))}
        />
      </div>

      <div className={p.tiles3}>
        <Tile value={overdue} label="Follow-ups overdue" alert={overdue > 0} />
        <Tile value={changeRequests.waitingOnClient} label={`Change requests with clients · ${lakh(changeRequests.value)}`} />
        <Tile value={bugs.critical.length} label="Critical bugs open" alert={bugs.critical.length > 0} />
      </div>

      <div className={p.block}>
        <h3 className={p.blockTitle}>Projects that need attention</h3>
        {attention.length === 0 ? (
          <p className={p.empty}>All listed projects are on track.</p>
        ) : (
          <div>
            {attention.map((x) => (
              <div key={x.id} className={p.riskRow}>
                <span className={p.code}>{x.id}</span>
                <div className={p.riskBody}>
                  <span className={u.strong}>{x.name}</span>
                  <span className={u.sub}>{attentionText(x)}</span>
                </div>
                <Pill tone={x.tone}>{x.health}</Pill>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
