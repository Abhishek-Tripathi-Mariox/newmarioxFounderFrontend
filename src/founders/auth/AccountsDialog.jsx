import { useCallback, useEffect, useRef, useState } from 'react';
import PasswordInput from './PasswordInput';
import { freeSeats, initialsOf, seatLabel, validateAccount, validatePassword } from './accounts';
import { changeOwnPassword } from '@/founders/api/auth';
import { createUser, listUsers, removeUser, setUserPassword, updateUser } from '@/founders/api/users';
import { LOGIN_PATH } from '@/lib/sso';
import styles from './AccountsDialog.module.css';

const SEAT_COLORS = { rahul: 'oklch(0.55 0.17 265)', saswat: 'oklch(0.56 0.12 175)' };
const EMPTY_FORM = { name: '', email: '', password: '' };
const NO_PASSWORD_FORM = { id: null, current: '', next: '' };

/**
 * Who holds a Founders HQ seat (docs/SSO.md). Every seat belongs to a Mariox account — the one
 * people sign in with everywhere:
 *  - add: creates a new Mariox account (Super Admin, title Founder / Co-founder) holding the free
 *    seat, with the password set here (an existing team member gets a seat from the internal
 *    portal: Users & roles → edit user → Founders HQ access);
 *  - edit details / change password: the Mariox account's name, email and password;
 *  - remove: takes the seat (HQ access) away; the Mariox account itself stays.
 * Your own password change asks for the current one (and signs out your other sessions); you
 * cannot remove your own seat.
 */
export default function AccountsDialog({ currentAccountId, onClose, onAccountsChanged }) {
  const [accounts, setAccounts] = useState(null); // null while loading
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [passwordForm, setPasswordForm] = useState(NO_PASSWORD_FORM);
  const [editing, setEditing] = useState(null); // { id, name, email }
  const [message, setMessage] = useState({ text: '', tone: 'info' });
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef(null);

  const seats = freeSeats(accounts || []);

  const reload = useCallback(async () => {
    const next = await listUsers();
    setAccounts(next);
    onAccountsChanged?.(next);
  }, [onAccountsChanged]);

  useEffect(() => {
    reload().catch((error) => setMessage({ text: error.message, tone: 'bad' }));
  }, [reload]);

  useEffect(() => {
    dialogRef.current?.focus();
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  /** Runs one server change, then reloads the list and reports `successText` (or the server's error). */
  async function run(change, successText) {
    setBusy(true);
    try {
      await change();
      setMessage({ text: successText, tone: 'good' });
      await reload();
      return true;
    } catch (error) {
      setMessage({ text: error.message, tone: 'bad' });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleAdd(event) {
    event.preventDefault();
    const problem = validateAccount(form, accounts);
    if (problem) return setMessage({ text: problem, tone: 'bad' });
    const added = await run(
      () => createUser({ ...form, seat: seats[0].id }),
      `${form.name.trim()} can now sign in at ${window.location.origin}${LOGIN_PATH} with ${form.email.trim()}.`,
    );
    if (added) {
      setForm(EMPTY_FORM);
      setAdding(false);
    }
  }

  async function handlePassword(event, account) {
    event.preventDefault();
    const isSelf = account.id === currentAccountId;
    if (isSelf && !passwordForm.current) return setMessage({ text: 'Enter your current password.', tone: 'bad' });
    const problem = validatePassword(passwordForm.next);
    if (problem) return setMessage({ text: problem, tone: 'bad' });
    const change = isSelf ? () => changeOwnPassword(passwordForm.current, passwordForm.next) : () => setUserPassword(account.id, passwordForm.next);
    const successText = isSelf ? 'Your password was changed. Your other sessions were signed out.' : `Password changed for ${account.name}.`;
    if (await run(change, successText)) setPasswordForm(NO_PASSWORD_FORM);
  }

  async function handleSaveDetails(event) {
    event.preventDefault();
    const problem = validateAccount(editing, accounts, editing.id);
    if (problem) return setMessage({ text: problem, tone: 'bad' });
    if (await run(() => updateUser(editing.id, editing), 'Details saved.')) setEditing(null);
  }

  async function handleRemove(account) {
    const question = `Remove ${account.name}’s Founders HQ access? Their ${seatLabel(account.seat).toLowerCase()} seat is freed. Their Mariox account stays: they can still sign in to the other Mariox apps.`;
    if (!window.confirm(question)) return;
    await run(() => removeUser(account.id), `${account.name} no longer has access to Founders HQ.`);
  }

  const togglePasswordForm = (accountId) => setPasswordForm(passwordForm.id === accountId ? NO_PASSWORD_FORM : { ...NO_PASSWORD_FORM, id: accountId });

  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="accounts-title" className={styles.dialog}>
        <header className={styles.head}>
          <div>
            <h2 id="accounts-title" className={styles.title}>
              Accounts
            </h2>
            <p className={styles.subtitle}>Mariox accounts with a Founders HQ seat.</p>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        {message.text && (
          <p role="status" className={`${styles.message} ${styles[message.tone]}`}>
            {message.text}
          </p>
        )}

        {!accounts && !message.text && <p className={styles.meta}>Loading accounts…</p>}

        <ul className={styles.list}>
          {(accounts || []).map((account) => (
            <li key={account.id} className={styles.row}>
              <div className={styles.person}>
                <span className={styles.avatar} style={{ background: SEAT_COLORS[account.seat] }} aria-hidden="true">
                  {initialsOf(account.name)}
                </span>
                <div className={styles.personText}>
                  <span className={styles.name}>
                    {account.name}
                    {account.id === currentAccountId && <span className={styles.you}>You</span>}
                  </span>
                  <span className={styles.meta}>
                    {account.email} · {seatLabel(account.seat)}
                  </span>
                </div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() => setEditing(editing?.id === account.id ? null : { id: account.id, name: account.name, email: account.email })}
                  >
                    Edit
                  </button>
                  <button type="button" className={styles.secondary} onClick={() => togglePasswordForm(account.id)}>
                    Change password
                  </button>
                  {account.id !== currentAccountId && (
                    <button type="button" className={styles.danger} onClick={() => handleRemove(account)}>
                      Remove access
                    </button>
                  )}
                </div>
              </div>
              {editing?.id === account.id && (
                <form className={styles.inlineForm} onSubmit={handleSaveDetails} noValidate>
                  <div className={styles.grid}>
                    <label className={styles.label}>
                      Name
                      <input className={styles.input} value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} autoFocus />
                    </label>
                    <label className={styles.label}>
                      Email
                      <input className={styles.input} type="email" value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} />
                    </label>
                  </div>
                  <div className={styles.formActions}>
                    <button type="button" className={styles.secondary} onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                    <button type="submit" className={styles.primary} disabled={busy}>
                      Save
                    </button>
                  </div>
                </form>
              )}
              {passwordForm.id === account.id && (
                <form className={styles.inlineForm} onSubmit={(event) => handlePassword(event, account)} noValidate>
                  {account.id === currentAccountId && (
                    <>
                      <label htmlFor="current-password" className={styles.label}>
                        Your current password
                      </label>
                      <PasswordInput
                        id="current-password"
                        value={passwordForm.current}
                        onChange={(event) => setPasswordForm({ ...passwordForm, current: event.target.value })}
                        autoFocus
                      />
                    </>
                  )}
                  <label htmlFor={`new-password-${account.id}`} className={styles.label}>
                    New password for {account.name}
                  </label>
                  <div className={styles.inlineRow}>
                    <div className={styles.grow}>
                      <PasswordInput
                        id={`new-password-${account.id}`}
                        autoComplete="new-password"
                        value={passwordForm.next}
                        onChange={(event) => setPasswordForm({ ...passwordForm, next: event.target.value })}
                        placeholder="At least 8 characters"
                        autoFocus={account.id !== currentAccountId}
                      />
                    </div>
                    <button type="submit" className={styles.primary} disabled={busy}>
                      Save
                    </button>
                  </div>
                </form>
              )}
            </li>
          ))}
        </ul>

        {seats.length > 0 &&
          (adding ? (
            <form className={styles.addForm} onSubmit={handleAdd} noValidate>
              <h3 className={styles.formTitle}>Add {seatLabel(seats[0].id).toLowerCase()}</h3>
              <div className={styles.grid}>
                <label className={styles.label}>
                  Name
                  <input className={styles.input} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoFocus />
                </label>
                <label className={styles.label}>
                  Email
                  <input
                    className={styles.input}
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="name@company.com"
                  />
                </label>
              </div>
              <label htmlFor="add-password" className={styles.label}>
                Password
              </label>
              <PasswordInput
                id="add-password"
                autoComplete="new-password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="At least 8 characters. Share it with them privately."
              />
              <p className={styles.meta}>
                Creates a new Mariox account (Super Admin) with this seat. Already on the team? Give them the seat from the internal portal instead: Users &amp; roles → edit user → Founders HQ access.
              </p>
              <div className={styles.formActions}>
                <button type="button" className={styles.secondary} onClick={() => setAdding(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primary} disabled={busy}>
                  {busy ? 'Adding…' : 'Add account'}
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className={styles.addButton} onClick={() => setAdding(true)}>
              + Add {seatLabel(seats[0].id).toLowerCase()}
            </button>
          ))}

        <p className={styles.footnote}>
          Founders HQ has two seats: founder and co-founder. Each founder signs in once, at {LOGIN_PATH}, with their own Mariox email and password — the same password for every Mariox app.
        </p>
      </section>
    </div>
  );
}
