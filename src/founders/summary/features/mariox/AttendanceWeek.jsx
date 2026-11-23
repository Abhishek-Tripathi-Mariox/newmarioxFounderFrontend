import Card from '@/founders/summary/components/ui/Card';
import Avatar from '@/founders/summary/components/ui/Avatar';
import Pill from '@/founders/summary/components/ui/Pill';
import { duration } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const SHOWN = 10;
const MIN = 60000;

/** Attendance this week per person: days present, late check-ins and time worked vs their shift. */
export default function AttendanceWeek({ week }) {
  if (!week) return null;
  const rows = week.people.slice(0, SHOWN);
  const late = week.people.reduce((a, x) => a + x.lateDays, 0);
  const absent = week.people.filter((x) => x.daysPresent === 0).length;
  return (
    <Card
      title="Attendance this week"
      subtitle={`${week.workdays} working ${week.workdays === 1 ? 'day' : 'days'} so far · ${late} late check-ins · ${absent} not in yet this week`}
    >
      <div className={u.tableWrap}>
        <table className={u.table} style={{ minWidth: 640 }}>
          <thead>
            <tr>
              <th scope="col">Person</th>
              <th scope="col" className={u.right}>Days present</th>
              <th scope="col" className={u.right}>Late</th>
              <th scope="col" className={u.right}>Worked</th>
              <th scope="col">Of shift hours</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => {
              const ratio = x.expectedMin ? x.workedMin / x.expectedMin : 0;
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
                    {x.daysPresent} / {week.workdays}
                  </td>
                  <td className={u.right}>
                    <Pill tone={x.lateDays ? 'warn' : 'flat'}>{x.lateDays}</Pill>
                  </td>
                  <td className={`${u.right} num`}>{duration(x.workedMin * MIN)}</td>
                  <td>
                    <div className={p.hours}>
                      <div className={p.hoursTrack} aria-hidden="true">
                        <div className={p.hoursFill} style={{ width: `${Math.min(100, ratio * 100)}%`, background: 'var(--mariox)' }} />
                      </div>
                      <span className={`${p.hoursPct} num`}>{Math.round(ratio * 100)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className={u.sub}>
                  Nobody on the team yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {week.people.length > SHOWN && <span className={p.foot}>+{week.people.length - SHOWN} more people in the internal portal</span>}
    </Card>
  );
}
