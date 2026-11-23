import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '@/store';
import { Field } from '@/components/ui';
import { signInQuery } from '@/lib/sso';
import s from './LoginScreen.module.css';
import PasswordField from './PasswordField';

/**
 * The one sign-in page for everyone (docs/SSO.md): team, clients, partners and founders. A plain
 * email + password form; after sign-in the store sends each account to its own place (`landingFor`:
 * a safe `?next=` they may open, else founder seat → Founders HQ, partner → Partners, others → the
 * portal, where staff are checked in for the day). `?email=` pre-fills the email and `?reset=1`
 * confirms a password reset. Old `?as=` links are ignored. "Forgot your password?" opens
 * /forgot-password with the same `?next=`.
 */
export default function LoginScreen() {
  const login = useStore((x) => x.login);
  const [params] = useSearchParams();
  const [email, setEmail] = useState(() => params.get('email') || '');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const go = async (e, p) => {
    if (busy) return;
    if (!e.trim() || !p) return setErr('Enter your email and password.');
    setBusy(true);
    // On success the store signs in and routes to ?next= or the account's own home (leaving the page
    // for /founders or /partners, or loading the portal and checking staff in).
    const msg = await login(e, p);
    setBusy(false);
    if (msg) setErr(msg);
  };

  return (
    <div className={s.screen}>
      <div className={s.col}>
        <div className={s.brand}>
          <div className={s.mark} aria-hidden="true">M</div>
          <div className={s.brandName}>Mariox Software</div>
        </div>

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
            <h1 id="login-title" className={s.title}>Sign in</h1>
            <div className={s.sub}>Use your Mariox account email and password.</div>
          </div>
          {params.get('reset') && <div className={s.note} role="status">Password changed. Sign in with your new password.</div>}
          <Field label="Email">
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
            <PasswordField
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
          <button type="submit" className={s.submit} disabled={busy} aria-busy={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
        </form>

        <div className={s.foot}>
          Forgot your password?{' '}
          <Link className={s.footLink} to={`/forgot-password${signInQuery(params, { email: email.trim() })}`}>Reset it here</Link>
        </div>

      </div>
    </div>
  );
}
