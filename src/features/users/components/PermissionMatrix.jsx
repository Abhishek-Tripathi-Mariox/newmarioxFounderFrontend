import { useStore } from '@/store';
import { Fragment } from 'react';
import { MISSING_ACTION_NOTE, MODULES, MODULE_ACTIONS, MODULE_GROUPS, NO_SCOPE_MODULES } from '@/config/constants';
import { DATA_SCOPES, PERM_ACTIONS, permOf } from '../users.utils';
import s from './PermissionMatrix.module.css';

const lockedMsg = (role) => `${role.name} is a locked system role`;
const hasAction = (mod, act) => !MODULE_ACTIONS[mod] || MODULE_ACTIONS[mod].includes(act);
const missingNote = (mod, act, label) => {
  const n = MISSING_ACTION_NOTE[mod];
  return (typeof n === 'string' ? n : n && n[act]) || `Not used for ${label}`;
};
const groupAt = Object.fromEntries(MODULE_GROUPS.map(([title, first]) => [first, title]));

/** One View/Create/Edit/Delete checkbox cell. */
function PermCheck({ on, locked, tip, onToggle }) {
  return (
    <button
      type="button"
      title={tip}
      aria-pressed={on}
      className={[s.check, on && s.on, locked && s.locked].filter(Boolean).join(' ')}
      onClick={onToggle}
    >
      {on ? '✓' : ''}
    </button>
  );
}

/** All / Team / Own data-scope switch (dimmed while View is off). */
function ScopeSwitch({ value, enabled, onSelect }) {
  return (
    <div className={s.scope} style={{ opacity: enabled ? 1 : 0.4 }}>
      {DATA_SCOPES.map(([v, label, tip]) => (
        <button
          key={v}
          type="button"
          title={tip}
          className={value === v ? `${s.scopeBtn} ${s.scopeOn}` : s.scopeBtn}
          onClick={() => onSelect(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/**
 * Module × action permission matrix for a role. Guards (locked role, View
 * required for scope) flash exactly like the original; the cascade rules
 * (View off clears the rest, any action turns View on) are applied by the
 * store's `togglePerm`.
 */
export default function PermissionMatrix({ role }) {
  const flash = useStore((st) => st.flash);
  const togglePerm = useStore((st) => st.togglePerm);
  const setPermScope = useStore((st) => st.setPermScope);
  const locked = !!role.locked;

  const toggle = (mod, act) => {
    if (locked) return flash(lockedMsg(role));
    togglePerm(role.id, mod, act);
  };
  const setScope = (mod, p, scope) => {
    if (locked) return flash(lockedMsg(role));
    if (!p.v) return flash('Turn on View first');
    setPermScope(role.id, mod, scope);
  };

  return (
    <div className={s.wrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th className={s.modTh}>Module</th>
            {PERM_ACTIONS.map(([a, l]) => (
              <th key={a} className={s.actTh}>
                {l}
              </th>
            ))}
            <th className={s.scopeTh}>Data scope</th>
          </tr>
        </thead>
        <tbody>
          {MODULES.map(([k, label, hint]) => {
            const p = permOf(role, k);
            return (
              <Fragment key={k}>
                {groupAt[k] && (
                  <tr className={s.groupRow}>
                    <td colSpan={2 + PERM_ACTIONS.length}>{groupAt[k]}</td>
                  </tr>
                )}
                <tr>
                  <td className={s.modTd}>
                    <div className={s.modName}>{label}</div>
                    <div className={s.hint}>{hint}</div>
                  </td>
                  {PERM_ACTIONS.map(([a, actLabel]) => (
                    <td key={a} className={s.actTd}>
                      {!hasAction(k, a) ? <span className={s.hint} title={missingNote(k, a, label)}>—</span> : <PermCheck
                        on={!!p[a]}
                        locked={locked}
                        tip={locked ? 'System role cannot be changed' : `${actLabel} ${label}`}
                        onToggle={() => toggle(k, a)}
                      />}
                    </td>
                  ))}
                  <td className={s.scopeTd}>
                    {NO_SCOPE_MODULES.includes(k)
                      ? <span className={s.hint} title={`${label} has no data scope: partner records belong to partners, not to team members`}>—</span>
                      : <ScopeSwitch value={p.scope} enabled={p.v} onSelect={(v) => setScope(k, p, v)} />}
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
