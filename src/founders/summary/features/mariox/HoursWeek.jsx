import Card from '@/founders/summary/components/ui/Card';
import Avatar from '@/founders/summary/components/ui/Avatar';
import BarList from '@/founders/summary/components/ui/BarList';
import { percent } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const SHOWN = 10;
const fillColor = (ratio) => (ratio >= 0.9 ? 'var(--mariox)' : ratio >= 0.6 ? 'oklch(0.68 0.15 65)' : 'oklch(0.55 0.19 25)');

/** Time logged this week (Monday to today) by project and by person, against their shift hours. */
export default function HoursWeek({ hours }) {
  if (!hours) return null;
  const people = hours.people.slice(0, SHOWN);
  return (
    <Card
      title="Hours logged this week"
      subtitle={`${hours.total} h of ${hours.expected} h expected · ${percent(hours.total, hours.expected)}% over ${hours.workdays} working ${hours.workdays === 1 ? 'day' : 'days'}`}
    >
      <div className={p.block}>
        <h3 className={p.blockTitle}>Top projects</h3>
        {hours.projects.list.length === 0 ? (
          <p className={p.empty}>No time logged this week yet.</p>
        ) : (
          <BarList
            labelWidth={150}
            valueWidth={56}
            color="var(--mariox)"
            rows={hours.projects.list.map((x) => ({ key: x.id, label: x.name, value: x.hours, right: `${x.hours} h` }))}
          />
        )}
        {hours.projects.count > hours.projects.list.length && (
          <span className={p.foot}>+{hours.projects.count - hours.projects.list.length} more projects</span>
        )}
      </div>
      <div className={p.block}>
        <h3 className={p.blockTitle}>By person</h3>
        <div className={u.tableWrap}>
          <table className={u.table} style={{ minWidth: 420 }}>
            <thead>
              <tr>
                <th scope="col">Person</th>
                <th scope="col" className={u.right}>Logged</th>
                <th scope="col">Of expected</th>
              </tr>
            </thead>
            <tbody>
              {people.map((x) => {
                const ratio = x.expected ? x.hours / x.expected : 0;
                return (
                  <tr key={x.id}>
                    <td>
                      <span className={p.owner}>
                        <Avatar name={x.name} hue={x.hue} size={24} />
                        <span className={u.stack}>
                          <span>{x.name}</span>
                          <span className={u.sub}>{x.team}</span>
                        </span>
                      </span>
                    </td>
                    <td className={`${u.right} num`}>
                      {x.hours} / {x.expected} h
                    </td>
                    <td>
                      <div className={p.hours}>
                        <div className={p.hoursTrack} aria-hidden="true">
                          <div className={p.hoursFill} style={{ width: `${Math.min(100, ratio * 100)}%`, background: fillColor(ratio) }} />
                        </div>
                        <span className={`${p.hoursPct} num`}>{Math.round(ratio * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {people.length === 0 && (
                <tr>
                  <td colSpan={3} className={u.sub}>
                    Nobody on the delivery team yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {hours.people.length > SHOWN && <span className={p.foot}>+{hours.people.length - SHOWN} more people</span>}
      </div>
    </Card>
  );
}
