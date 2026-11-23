import Card from '@/founders/summary/components/ui/Card';
import BarList from '@/founders/summary/components/ui/BarList';
import { clock, dayMonth, monthName, percent } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const STAGES = [
  ['contacted', 'Contacted', 'oklch(0.82 0.03 265)'],
  ['meeting', 'Meeting', 'oklch(0.8 0.1 70)'],
  ['followup', 'Follow-up', 'oklch(0.76 0.13 65)'],
  ['signed', 'Signed', 'oklch(0.68 0.16 55)'],
  ['onboarding', 'Onboarding', 'oklch(0.58 0.12 150)'],
  ['rejected', 'Rejected', 'oklch(0.62 0.17 25)'],
];

/** Partner acquisition funnel for the month, and who on the team is recruiting. */
export default function Recruitment({ recruitment, now }) {
  const f = recruitment.funnel;
  return (
    <Card title={`Partner recruitment, ${monthName(now)}`} subtitle={`${percent(f.signed, f.contacted)}% contacted → signed`}>
      <BarList
        height={14}
        labelWidth={96}
        valueWidth={40}
        rows={STAGES.map(([key, label, color]) => ({ key, label, color, value: f[key] || 0, right: String(f[key] || 0) }))}
      />
      <div className={u.tableWrap}>
        <table className={u.table} style={{ minWidth: 360 }}>
          <thead>
            <tr>
              <th scope="col">Team member</th>
              <th scope="col" className={u.right}>Contacted</th>
              <th scope="col" className={u.right}>Meetings</th>
              <th scope="col" className={u.right}>Signed</th>
            </tr>
          </thead>
          <tbody>
            {recruitment.team.map((t) => (
              <tr key={t.name}>
                <td style={{ fontWeight: 500 }}>{t.name}</td>
                <td className={`${u.right} num`}>{t.contacted}</td>
                <td className={`${u.right} num`}>{t.meetings}</td>
                <td className={`${u.right} ${u.strong} num`}>{t.signed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {recruitment.upcoming && (
        <div className={p.block}>
          <h3 className={p.blockTitle}>Recruitment meetings this week</h3>
          {recruitment.upcoming.length === 0 ? (
            <p className={p.empty}>No meetings booked for the next 7 days.</p>
          ) : (
            <div>
              {recruitment.upcoming.map((m, i) => (
                <div key={`${m.name}-${i}`} className={p.riskRow}>
                  <div className={p.riskBody}>
                    <span className={u.strong}>
                      {m.name}
                      {m.company ? ` · ${m.company}` : ''}
                    </span>
                    <span className={u.sub}>{[m.type, m.owner && `with ${m.owner}`].filter(Boolean).join(' · ')}</span>
                  </div>
                  <span className={u.sub}>{m.at ? `${dayMonth(m.at)}, ${clock(m.at)}` : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {recruitment.rejectReasons.length > 0 && (
        <span className={p.foot}>Why rejected: {recruitment.rejectReasons.map((r) => `${r.reason.toLowerCase()} ${r.count}`).join(' · ')}</span>
      )}
    </Card>
  );
}
