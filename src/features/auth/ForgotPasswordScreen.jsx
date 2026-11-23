import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, ApiError } from '@/api/client';
import { Field } from '@/components/ui';
import { LOGIN_PATH, signInQuery } from '@/lib/sso';
import s from './LoginScreen.module.css';
import PasswordField from './PasswordField';

const MIN = 8;
const MAX = 128;
const STEPS = {
  email: { n: 1, title: 'Forgot your password?', sub: 'Enter the email you sign in with. We’ll email you a 6-digit code.' },
  code: { n: 2, title: 'Check your email', sub: null },
  password: { n: 3, title: 'Set a new password', sub: 'Choose a new password. You’ll be signed out on every device.' },
};

const message = (e, fallback) => (e instanceof ApiError ? e.message : fallback);
const waitOf = (e) => (e instanceof ApiError && e.status === 429 ? Number(/wait (\d+) seconds/.exec(e.message)?.[1]) || 0 : 0);

/**
 * Public page /forgot-password — self-service reset for every account (team, founders, clients,
 * partners), in the sign-in page's style: email → 6-digit code → new password → back to /login
 * with `?reset=1`, keeping `?next=`. `?email=` pre-fills step 1.
 */
export default function ForgotPasswordScreen() {
  const [params] = useSearchParams();
  const goTo = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState(() => params.get('email') || '');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const codeRef = useRef(null);
  const headRef = useRef(null);
  const first = useRef(true);

  // One-second countdown for "Send a new code".
  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // Each new step: move focus to its heading so screen readers announce it.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headRef.current?.focus();
  }, [step]);

  const run = async (fn) => {
    if (busy) return;
    setBusy(true);
    setErr('');
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const sendCode = (again = false) => run(async () => {
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return setErr('Enter a valid email address.');
    try {
      const r = await api.post('/auth/forgot', { email: value });
      setResendIn(r.resendIn || 60);
      setNote(again ? 'A new code is on its way. Only the newest code works.' : '');
    } catch (e) {
      const wait = waitOf(e);
      if (!wait) return setErr(message(e, 'Couldn’t send the code — try again.'));
      // A code was sent less than a minute ago: it still works, so go on to enter it.
      setResendIn(wait);
      setNote(`A code was sent less than a minute ago. Use it, or ask for a new one in ${wait} s.`);
    }
    setCode('');
    setStep('code');
  });

  const verify = () => run(async () => {
    if (!/^\d{6}$/.test(code)) return setErr('Enter the 6-digit code from the email.');
    try {
      const r = await api.post('/auth/forgot/verify', { email: email.trim(), code });
      setToken(r.token);
      setNote('');
      setStep('password');
    } catch (e) {
      setErr(message(e, 'Couldn’t check the code — try again.'));
      setCode('');
      codeRef.current?.focus();
    }
  });

  const save = () => run(async () => {
    if (pw.length < MIN) return setErr(`Use at least ${MIN} characters.`);
    if (pw.length > MAX) return setErr(`Use at most ${MAX} characters.`);
    if (pw !== pw2) return setErr('The two passwords don’t match.');
    try {
      await api.post('/auth/forgot/reset', { token, password: pw });
    } catch (e) {
      return setErr(message(e, 'Couldn’t save your password — try again.'));
    }
    goTo(`${LOGIN_PATH}${signInQuery(params, { reset: '1', email: email.trim() })}`, { replace: true });
  });

  const restart = () => {
    setStep('email');
    setCode('');
    setToken('');
    setPw('');
    setPw2('');
    setErr('');
    setNote('');
  };

  const S = STEPS[step];
  const expired = /expired|Start again/i.test(err);
  const rules = [
    [pw.length >= MIN && pw.length <= MAX, `${MIN} to ${MAX} characters`],
    [!!pw && pw === pw2, 'Both passwords match'],
  ];

  return (
    <div className={s.screen}>
      <div className={s.col}>
        <div className={s.brand}>
          <div className={s.mark} aria-hidden="true">M</div>
          <div>
            <div className={s.brandName}>Mariox Software</div>
            <div className={s.brandSub}>Reset password</div>
          </div>
        </div>

        <form
          className={s.card}
          noValidate
          aria-labelledby="fp-title"
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 'email') sendCode();
            else if (step === 'code') verify();
            else save();
          }}
        >
          <div>
            <div className={s.step}>Step {S.n} of 3</div>
            <h1 id="fp-title" className={s.title} ref={headRef} tabIndex={-1}>{S.title}</h1>
            <div className={s.sub}>
              {step === 'code'
                ? <>If <strong>{email.trim()}</strong> has a Mariox account, we’ve emailed it a 6-digit code. It works for 10 minutes.</>
                : S.sub}
            </div>
          </div>

          {note && <div className={s.note} role="status">{note}</div>}

          {step === 'email' && (
            <Field label="Email">
              <input
                className={s.input}
                type="email"
                autoComplete="username"
                autoFocus
                value={email}
                placeholder="name@company.com"
                aria-invalid={!!err || undefined}
                aria-describedby={err ? 'fp-err' : undefined}
                onChange={(e) => { setEmail(e.target.value); setErr(''); }}
              />
            </Field>
          )}

          {step === 'code' && (
            <Field label="6-digit code">
              <input
                ref={codeRef}
                className={`${s.input} ${s.code}`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={6}
                autoFocus
                value={code}
                placeholder="••••••"
                aria-invalid={!!err || undefined}
                aria-describedby={err ? 'fp-err' : undefined}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setErr(''); }}
              />
            </Field>
          )}

          {step === 'password' && (
            <>
              <input type="email" value={email.trim()} autoComplete="username" readOnly hidden />
              <Field label="New password">
                <PasswordField
                  autoComplete="new-password"
                  autoFocus
                  value={pw}
                  maxLength={MAX}
                  aria-invalid={!!err || undefined}
                  aria-describedby={err ? 'fp-rules fp-err' : 'fp-rules'}
                  onChange={(e) => { setPw(e.target.value); setErr(''); }}
                />
              </Field>
              <Field label="Confirm new password">
                <PasswordField
                  autoComplete="new-password"
                  value={pw2}
                  maxLength={MAX}
                  aria-invalid={!!err || undefined}
                  onChange={(e) => { setPw2(e.target.value); setErr(''); }}
                />
              </Field>
              <ul id="fp-rules" className={s.rules} aria-label="Password rules">
                {rules.map(([met, label]) => (
                  <li key={label} className={met ? s.ruleMet : undefined}>
                    <span aria-hidden="true">{met ? '✓' : '•'}</span> {label}<span className={s.srOnly}>{met ? ' (done)' : ''}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {err && <div id="fp-err" className={s.err} role="alert">{err}</div>}

          {step === 'password' && expired ? (
            <button type="button" className={s.submit} onClick={restart}>Start again</button>
          ) : (
            <button type="submit" className={s.submit} disabled={busy} aria-busy={busy}>
              {step === 'email' && (busy ? 'Sending…' : 'Email me a code')}
              {step === 'code' && (busy ? 'Checking…' : 'Continue')}
              {step === 'password' && (busy ? 'Saving…' : 'Save new password')}
            </button>
          )}

          {step === 'code' && (
            <div className={s.row}>
              <button type="button" className={s.link} onClick={restart}>Use a different email</button>
              {resendIn > 0 ? (
                <span className={s.muted} aria-live="off">Send a new code in {resendIn} s</span>
              ) : (
                <button type="button" className={s.link} disabled={busy} onClick={() => sendCode(true)}>Send a new code</button>
              )}
            </div>
          )}
        </form>

        <div className={s.foot}>
          Remembered it?{' '}
          <Link className={s.footLink} to={`${LOGIN_PATH}${signInQuery(params, { email: email.trim() })}`}>Back to log in</Link>
        </div>
      </div>
    </div>
  );
}
