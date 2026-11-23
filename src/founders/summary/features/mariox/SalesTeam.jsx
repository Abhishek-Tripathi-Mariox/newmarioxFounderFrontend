import Card from '@/founders/summary/components/ui/Card';
import Avatar from '@/founders/summary/components/ui/Avatar';
import Pill from '@/founders/summary/components/ui/Pill';
import { lakh } from '@/founders/summary/lib/format';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

export default function SalesTeam({ owners }) {
  return (
    <Card title="Sales team" subtitle="Open deals, pipeline and overdue follow-ups per owner">
      <div className={u.tableWrap}>
        <table className={u.table} style={{ minWidth: 480 }}>
          <thead>
            <tr>
              <th scope="col">Owner</th>
              <th scope="col" className={u.right}>Open</th>
              <th scope="col" className={u.right}>Pipeline</th>
              <th scope="col" className={u.right}>Won this month</th>
              <th scope="col" className={u.right}>Overdue</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((o) => (
              <tr key={o.id}>
                <td>
                  <span className={p.owner}>
                    <Avatar name={o.name} hue={o.hue} />
                    {o.name}
                  </span>
                </td>
                <td className={`${u.right} num`}>{o.open}</td>
                <td className={`${u.right} num`}>{lakh(o.value)}</td>
                <td className={`${u.right} ${u.strong} num`}>{lakh(o.wonMonth)}</td>
                <td className={u.right}>
                  <Pill tone={o.overdue ? 'bad' : 'flat'}>{o.overdue}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
