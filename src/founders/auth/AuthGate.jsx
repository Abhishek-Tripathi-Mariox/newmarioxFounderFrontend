import { useEffect, useState } from 'react';
import AuthLayout from './AuthLayout';
import { fetchCurrentUser } from '@/founders/api/auth';
import { signOut } from '@/lib/sso';
import styles from './auth.module.css';

/** Full-width card on the sign-in layout: no HQ seat, or the server could not be reached. */
function GateMessage({ title, text, children }) {
  return (
    <AuthLayout>
      <div className={styles.card} role="alert">
        <div className={styles.cardHead}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{text}</p>
        </div>
        {children}
      </div>
    </AuthLayout>
  );
}

/**
 * Founders HQ for the signed-in Mariox account: `children(account, signOut)`.
 * There is no HQ sign-in of its own (docs/SSO.md): the session is the shared Mariox cookie, so on
 * load we ask the server who is signed in. No session (401) → /login?next=<here> (the API client
 * redirects); signed in without a Founders HQ seat (403) → a "no access" screen.
 */
export default function AuthGate({ children }) {
  const [state, setState] = useState({ status: 'checking' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetchCurrentUser()
      .then((account) => active && setState({ status: 'in', account }))
      .catch((error) => {
        if (!active || error.status === 401) return; // the client is already on its way to /login
        setState(error.status === 403 ? { status: 'denied' } : { status: 'error', message: error.message });
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  if (state.status === 'in') return children(state.account, signOut);
  if (state.status === 'denied') {
    return (
      <GateMessage title="No access to Founders HQ" text="Founders HQ is open to the Founder and Co-founder seats. Your Mariox account doesn’t hold one.">
        <a className={styles.submit} href="/">
          Back to Mariox
        </a>
        <button type="button" className={styles.linkButton} onClick={signOut}>
          Sign in with another account
        </button>
      </GateMessage>
    );
  }
  if (state.status === 'error') {
    return (
      <GateMessage title="Founders HQ couldn’t load" text={state.message}>
        <button
          type="button"
          className={styles.submit}
          onClick={() => {
            setState({ status: 'checking' });
            setAttempt((count) => count + 1);
          }}
        >
          Try again
        </button>
      </GateMessage>
    );
  }
  return <div className={styles.loading} role="status" aria-label="Loading" />;
}
