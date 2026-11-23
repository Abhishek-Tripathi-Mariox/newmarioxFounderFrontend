import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '@/store';
import { Field } from '@/components/ui';
import { FOUNDERS_HOME, PARTNERS_HOME, areaOf, safeNext, signInQuery } from '@/lib/sso';
import s from './LoginScreen.module.css';

/** Heading copy per area the person is signing in to (from `?next=`); the portal's is the default. */
const COPY = {
  portal: { sub: 'Logging in starts your workday. Logging out ends it.', submit: <>Log in &amp; start my day</> },
  partners: { sub: 'Sign in to the Partner portal with your Mariox account.', submit: 'Log in' },
  'partners-admin': { sub: 'Sign in to the Partners admin console with your work account.', submit: 'Log in' },
  founders: { sub: 'Sign in to Founders HQ with your Mariox account.', submit: 'Log in' },
};

/**
 * "Who are you signing in as?" — shown first when nothing says where the person is headed.
 * The choice only decides where to land (`next`) and the wording: everyone has one account, and
 * someone who picks an area they can't open lands on their own home instead.
 */
const AUDIENCES = [
  { id: 'founders', label: 'Founder / Co-founder', hint: 'Founders HQ: every company in one place', next: FOUNDERS_HOME, brand: 'Founders HQ' },
  { id: 'team', label: 'Team', hint: 'Team portal: leads, projects, tasks, your workday', next: '/', brand: 'Team portal' },
  { id: 'partner', label: 'Partner', hint: 'Partner portal: your leads, earnings and requests', next: PARTNERS_HOME, brand: 'Partner portal' },
];
/** Small line icons for the three boxes (24×24, currentColor). */
const ICONS = {
  founders: 'M3 18h18M4 8l4 4 4-7 4 7 4-4-2 10H6z',
  team: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  partner: 'M11 17l2 2a1.4 1.4 0 0 0 2-2M13 15l2.5 2.5a1.4 1.4 0 0 0 2-2l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1.4 1.4 0 0 1-2-2l2.8-2.8a3 3 0 0 1 3.5-.5L21 9M3 8l4-1 6 6M3 8v7l3 3M21 9v6l-2 2',
};
const AREA_AUDIENCE = { founders: 'founders', partners: 'partner', 'partners-admin': 'team', portal: 'team' };

/**
 * The one sign-in page for everyone (docs/SSO.md): team, clients, partners and founders. After
 * sign-in the store sends people to `?next=` or their home; staff landing in the portal are checked
 * in for the day. `?email=` pre-fills the email and `?reset=1` confirms a password reset. "Forgot
 * your password?" opens /forgot-password with the same `?as=` / `?next=`.
 */
export default function LoginScreen() {
  const login = useStore((x) => x.login);
  const [params, setParams] = useSearchParams();
  const next = safeNext(params.get('next'));
  const area = next ? areaOf(new URL(next, window.location.origin).pathname) : 'portal';
  const copy = COPY[area];
  // Coming from a page that needs sign-in (`next`) already says where; otherwise ask first.
  const audience = AUDIENCES.find((a) => a.id === (params.get('as') || (next ? AREA_AUDIENCE[area] : null)));
  const [email, setEmail] = useState(() => params.get('email') || '');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  /** Pick (or clear, with null) who is signing in; keeps ?email= / ?reset= as they were. */
  const choose = (choice) =>
    setParams((current) => {
      const updated = new URLSearchParams(current);
      updated.delete('as');
      updated.delete('next');
      if (choice) {
        updated.set('as', choice.id);
        if (choice.next) updated.set('next', choice.next);
      }
      return updated;
    });

  const go = async (e, p) => {
    if (busy) return;
    if (!e.trim() || !p) return setErr('Enter your work email and password.');
    setBusy(true);
    // On success the store signs in, loads the portal data, checks the user in and routes to the first allowed page.
    const msg = await login(e, p, audience ? audience.id : null);
    setBusy(false);
    if (msg) setErr(msg);
  };

  return (
    <div className={s.screen}>
      <div className={`${s.col} ${audience ? '' : s.colWide}`}>
        <div className={s.brand}>
          <div className={s.mark} aria-hidden="true">M</div>
          <div>
            <div className={s.brandName}>Mariox Software</div>
            <div className={s.brandSub}>{audience ? audience.brand : 'Sign in'}</div>
          </div>
        </div>

        {!audience ? (
          <div className={s.chooser} role="group" aria-labelledby="choose-title">
            <div>
              <h1 id="choose-title" className={s.chooseTitle}>Who are you signing in as?</h1>
              <div className={s.chooseSub}>One Mariox account for everything. Pick your box, then log in.</div>
            </div>
            <div className={s.boxes}>
              {AUDIENCES.map((choice) => (
                <button key={choice.id} type="button" className={s.box} onClick={() => choose(choice)}>
                  <span className={s.boxIcon} aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[choice.id]} /></svg>
                  </span>
                  <span className={s.boxLabel}>{choice.label}</span>
                  <span className={s.boxHint}>{choice.hint}</span>
                  <span className={s.boxGo}>Log in <span aria-hidden="true">→</span></span>
                </button>
              ))}
            </div>
          </div>
        ) : (
        <form
          className={s.card}
          noValidate
          aria-labelledby="login-title"
          onSubmit={(e) => {
            e.preventDefault();
            go(email, pw);
          }}
        >
          <div>
            <div className={s.as}>
              <span>Signing in as <strong>{audience.label}</strong></span>
              <button type="button" className={s.link} onClick={() => choose(null)}>Change</button>
            </div>
            <h1 id="login-title" className={s.title}>Log in</h1>
            <div className={s.sub}>{audience.id === 'team' && !next ? COPY.portal.sub : copy.sub}</div>
          </div>
          {params.get('reset') && <div className={s.note} role="status">Password changed. Sign in with your new password.</div>}
          <Field label="Work email">
            <input
              className={s.input}
              type="email"
              autoComplete="username"
              autoFocus={!email}
              value={email}
              placeholder="name@marioxsoftware.com"
              aria-invalid={!!err || undefined}
              onChange={(e) => {
                setEmail(e.target.value);
                setErr('');
              }}
            />
          </Field>
          <Field label="Password">
            <input
              className={s.input}
              type="password"
              autoComplete="current-password"
              autoFocus={!!email}
              value={pw}
              placeholder="••••••••"
              aria-invalid={!!err || undefined}
              onChange={(e) => {
                setPw(e.target.value);
                setErr('');
              }}
            />
          </Field>
          {err && <div className={s.err} role="alert">{err}</div>}
          <button type="submit" className={s.submit} disabled={busy} aria-busy={busy}>{busy ? 'Signing in…' : copy.submit}</button>
        </form>
        )}

        <div className={s.foot}>
          Forgot your password?{' '}
          <Link className={s.footLink} to={`/forgot-password${signInQuery(params, { email: email.trim() })}`}>Reset it here</Link>
        </div>

      </div>
    </div>
  );
}
