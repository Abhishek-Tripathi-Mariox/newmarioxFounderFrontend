import { TabLink } from '@/founders/summary/lib/TabLink';
import Card from '@/founders/summary/components/ui/Card';
import Pill from '@/founders/summary/components/ui/Pill';
import { SEVERITY } from '@/founders/summary/domain/alerts';
import u from '@/founders/summary/components/ui/ui.module.css';
import p from '@/founders/summary/styles/page.module.css';

const COMPANY = { mariox: 'Internal', partners: 'Partners' };

/** "Needs you today": open alerts first, handled ones greyed out below. */
export default function AlertsList({ alerts, handled, onToggle }) {
  const open = alerts.filter((a) => !handled[a.id]);
  const done = alerts.filter((a) => handled[a.id]);

  return (
    <Card title="Needs you today" actions={<span className={u.cardSub}>{open.length ? `${open.length} open` : 'All clear'}</span>}>
      {alerts.length === 0 ? (
        <p className={p.empty}>Nothing needs you right now.</p>
      ) : (
        <ul className={p.alertList}>
          {[...open, ...done].map((a) => {
            const isDone = Boolean(handled[a.id]);
            const sev = SEVERITY[a.severity];
            return (
              <li key={a.id} className={`${p.alert} ${isDone ? p.alertDone : ''}`}>
                <Pill tone={isDone ? 'good' : sev.tone} className={p.alertSev}>
                  {isDone ? 'Handled' : sev.label}
                </Pill>
                <div className={p.alertBody}>
                  <div className={p.alertTitleRow}>
                    <Pill tone={a.company} square>
                      {COMPANY[a.company]}
                    </Pill>
                    <span className={p.alertTitle}>{a.title}</span>
                  </div>
                  <span className={u.sub}>{a.detail}</span>
                </div>
                <div className={p.alertActions}>
                  <TabLink to={a.to} className={`${u.btn} ${u.btnOutline}`}>
                    {a.action}
                  </TabLink>
                  <button type="button" className={`${u.btn} ${isDone ? u.btnSoft : u.btnDark}`} onClick={() => onToggle(a.id)}>
                    {isDone ? 'Undo' : 'Mark handled'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
