import { useEffect, useState } from 'react';
import FoundersHQ from './logic/FoundersHQ';
import { loadWorkspace } from './sync/loadWorkspace';
import styles from './FoundersHQApp.module.css';

/** Loads the signed-in founder's workspace from the API, then mounts Founders HQ with it. */
export default function FoundersHQApp({ account, onSignOut }) {
  const [loaded, setLoaded] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    loadWorkspace()
      .then((result) => active && setLoaded(result))
      .catch((loadError) => active && setError(loadError));
    return () => {
      active = false;
    };
  }, [attempt]);

  function retry() {
    setError(null);
    setAttempt((count) => count + 1);
  }

  if (error) {
    return (
      <div className={styles.screen}>
        <div className={styles.box} role="alert">
          <p className={styles.title}>Founders HQ couldn’t load</p>
          <p className={styles.text}>{error.message}</p>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={retry}>
              Try again
            </button>
            <button type="button" className={styles.secondary} onClick={onSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!loaded) {
    return (
      <div className={styles.screen}>
        <p className={styles.text} role="status">
          Loading Founders HQ…
        </p>
      </div>
    );
  }
  return <FoundersHQ account={account} onSignOut={onSignOut} workspace={loaded.workspace} prefs={loaded.prefs} vault={loaded.vault} />;
}
