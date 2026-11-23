import { useState } from 'react';
import Card from '@/founders/summary/components/ui/Card';
import Avatar from '@/founders/summary/components/ui/Avatar';
import Pill from '@/founders/summary/components/ui/Pill';
import Segmented from '@/founders/summary/components/ui/Segmented';
import { personActivity, personStatus } from '@/founders/summary/domain/team';
import p from '@/founders/summary/styles/page.module.css';

const FILTERS = [
  ['all', 'All'],
  ['in', 'In'],
  ['break', 'On break'],
  ['left', 'Left'],
  ['out', 'Not in'],
];

export default function TeamNow({ team, now }) {
  const [filter, setFilter] = useState('all');
  const people = team.people.map((m) => ({ ...m, status: personStatus(m, now), doing: personActivity(m, now) }));
  const visible = people.filter((m) => filter === 'all' || m.status.key === filter);

  return (
    <Card
      title="Team right now"
      subtitle={[`${team.in} in`, `${team.onBreak} on break`, team.left ? `${team.left} left` : null, `${team.notIn} not checked in`, `${team.hoursToday} h logged today`]
        .filter(Boolean)
        .join(' · ')}
      actions={<Segmented label="Team filter" options={FILTERS} value={filter} onChange={setFilter} />}
    >
      <div className={p.cols}>
        {visible.map((m) => (
          <div key={m.id} className={p.person}>
            <Avatar name={m.name} hue={m.hue} size={34} />
            <div className={p.personBody}>
              <div className={p.personTop}>
                <span className={p.personName}>{m.name}</span>
                <Pill tone={m.status.tone}>{m.status.label}</Pill>
              </div>
              <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                {m.team} · {m.status.when}
              </span>
              {m.doing && <span className={p.personDoing}>{m.doing}</span>}
            </div>
          </div>
        ))}
      </div>
      <span className={p.foot}>
        Showing {visible.length} of {team.size} people.
      </span>
    </Card>
  );
}
