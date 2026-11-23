import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import { daysBetween } from '@/founders/summary/lib/dates';
import { daysAgo } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

/** Today's end-of-shift reports and the blockers people wrote in them (today and yesterday). */
export default function ReportsCard({ reports, now }) {
  if (!reports) return null;
  const { checkedIn, submitted, blockers = [] } = reports;
  return (
    <Card title="End-of-day reports" subtitle={`${submitted} of ${checkedIn} people in today have sent their report`}>
      <div className={p.block}>
        <h3 className={p.blockTitle}>Blockers</h3>
        {blockers.length === 0 ? (
          <p className={p.empty}>Nobody reported a blocker.</p>
        ) : (
          <div>
            {blockers.map((b, i) => {
              const days = daysBetween(b.day, now);
              return (
                <div key={`${b.who}-${i}`} className={p.riskRow}>
                  <div className={p.riskBody}>
                    <span className={u.strong}>{b.name}</span>
                    <span className={u.sub}>{b.text}</span>
                  </div>
                  <Pill tone={days <= 0 ? 'warn' : 'flat'}>{daysAgo(days)}</Pill>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
