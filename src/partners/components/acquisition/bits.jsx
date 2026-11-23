import { Icon } from '@/partners/components/ui';
import { hue, initials } from '@/partners/components/ui/Avatar';
import { ST, TEMP, add, countdown, fdt, overdue, platform, rel, t12, theirTime, today, won,  } from '@/partners/lib/acquisition';

// Small building blocks of the acquisition page, matching Mariox Control (v12) markup and classes.

export const avBg = (s) => ({ background: `hsl(${hue(s)} 52% 46%)` });

export function Av({ name, size = 's', className = 'av' }) {
  return <span className={`${className} ${size}`} style={avBg(name)} title={name}>{initials(name)}</span>;
}

export const Pill = ({ s }) => (
  <span className="rqs" style={{ '--c': ST[s][1] }}><i />{ST[s][0]}</span>
);

export function TempBadge({ t }) {
  if (!t || !TEMP[t]) return null;
  const [label, c, e] = TEMP[t];
  return <span className="tmp" style={{ '--c': c }}>{e ? e + ' ' : ''}{label}</span>;
}

export function Avs({ names, max = 4 }) {
  if (!names?.length) return null;
  return (
    <span className="tav2">
      {names.slice(0, max).map(n => <Av key={n} name={n} size="xs" />)}
      {names.length > max && <span className="more">+{names.length - max}</span>}
    </span>
  );
}

// Meeting countdown chip; `now` comes from the page's 20-second tick so it stays live.
export function CdChip({ l, now }) {
  const [t, st] = countdown(l, now);
  if (!t) return null;
  return <span className={`cd ${st}`}>{st === 'live' ? <i /> : <Icon name="clock" size="s" />}{t}</span>;
}

// "What happens next" for a lead (list row, drawer).
export function NextTxt({ l, now }) {
  const od = overdue(l), t = today();
  if (l.status === 'meeting')
    return (
      <>
        <span className={`nx2 big ${od ? 'bad' : l.meet.date === t ? 'now' : ''}`}>
          <Icon name="cal" size="s" />
          {od ? `Meeting was ${rel(l.meet.date).toLowerCase()} · update it` : rel(l.meet.date) + (l.meet.time ? ' · ' + t12(l.meet.time) : '')}
        </span>
        <span className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          {!od && <CdChip l={l} now={now} />}
          <Avs names={l.meet.attendees} max={3} />
          <small>{platform(l.meet.link) || 'No link yet'}{theirTime(l) && !od ? ' · ' + theirTime(l) : ''}</small>
        </span>
      </>
    );
  if (l.status === 'followup')
    return (
      <>
        <span className={`nx2 ${od ? 'bad' : l.next === t ? 'now' : ''}`}><Icon name="clock" size="s" />Follow-up {l.next ? rel(l.next).toLowerCase() : 'not set'}</span>
        <small>{l.steps.filter(s => s.k === 'followup').length} done so far</small>
      </>
    );
  if (l.status === 'contacted')
    return (
      <>
        <span className={`nx2 ${od ? 'bad' : (l.next || '') === t ? 'now' : ''}`}><Icon name="send" size="s" />Arrange the meeting{l.next ? ' · ' + rel(l.next).toLowerCase() : ''}</span>
        <small>Contacted {rel(l.contactedAt).toLowerCase()} on {l.channel || '—'}</small>
      </>
    );
  if (l.status === 'onboarding')
    return (
      <>
        <span className="nx2 good"><Icon name="rocket" size="s" />Onboarding since {fdt(l.onboardAt || l.convertedAt)}</span>
        <small>{partnerLine(l)}</small>
      </>
    );
  if (won(l))
    return (
      <>
        <span className="nx2 good"><Icon name="check" size="s" />Converted {fdt(l.convertedAt)}</span>
        <small>{Math.round((Date.parse(l.convertedAt) - Date.parse(l.contactedAt)) / 864e5)} days · now in Partners</small>
      </>
    );
  return (
    <>
      <span className="nx2 bad"><Icon name="x" size="s" />{l.reason || 'Rejected'}</span>
      <small>{fdt(l.rejectedAt)}</small>
    </>
  );
}

export function Field({ label, children, span, error }) {
  return (
    <label className={`field ${error ? 'has-err' : ''}`} style={span ? { gridColumn: '1/-1' } : undefined}>
      <span>{label}</span>{children}
      {error && <small className="field-err" role="alert">{error}</small>}
    </label>
  );
}

export const G2 = ({ children }) => (
  <div className="grid-f" style={{ gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>{children}</div>
);

// Quick date picks + a date input.
export function DateQuick({ value, onChange }) {
  return (
    <div className="dq">
      {([[1, 'Tomorrow'], [3, 'In 3 days'], [7, 'Next week']]).map(([n, l]) => {
        const d = add(today(), n);
        return <button key={n} type="button" className={`chip sm ${value === d ? 'on' : ''}`} onClick={() => onChange(d)}>{l}</button>;
      })}
      <input type="date" className="inp sm" min={today()} max="2100-12-31" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

// Pick several (team attending, services).
export function Multi({ options, value, onChange, small = true }) {
  return (
    <div className={`pk wrap ${small ? 'mt' : ''}`}>
      {options.map(o => (
        <label key={o}>
          {/* Picked values are kept in the list's order, like v14. */}
          <input type="checkbox" checked={value.includes(o)} onChange={e => onChange(options.filter(x => (x === o ? e.target.checked : value.includes(x))))} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

// Pick one, styled as chips (rejection reasons, missed / rescheduled).
export function Radios({ options, value, onChange, wrap }) {
  return (
    <div className={`pk ${wrap ? 'wrap' : ''}`}>
      {options.map(([v, l]) => (
        <label key={v}>
          <input type="radio" checked={value === v} onChange={() => onChange(v)} />
          <span>{l}</span>
        </label>
      ))}
    </div>
  );
}

export function TempPick({ value, onChange }) {
  return (
    <div className="pk tp">
      {(Object.entries(TEMP)).map(([k, [l, c, e]]) => (
        <label key={k}>
          <input type="radio" checked={value === k} onChange={() => onChange(k)} />
          <span style={{ '--c': c }}>{e ? e + ' ' : ''}{l}</span>
        </label>
      ))}
    </div>
  );
}

// One option of the update dialog / add form: radio header, fields shown when picked.
export function Option({ name, value, picked, onPick, icon, iconClass, title, children }) {
  return (
    <div className="uo">
      <label className="uo-h">
        <input type="radio" name={name} value={value} checked={picked} onChange={onPick} />
        <span className={`uo-i ${iconClass}`}><Icon name={icon} size="s" /></span>
        <b>{title}</b>
      </label>
      {children && <div className="uo-f">{children}</div>}
    </div>
  );
}

// Converted / onboarding partner: code and account state, e.g. "MX-P-243-7 · account invited".
export function partnerLine(l) {
  const p = typeof l.partner === 'object' && l.partner ? l.partner : null;
  return p ? `${p.partnerCode ?? 'Partner'} · account ${p.status ?? 'created'}` : 'Continues in Partners';
}
