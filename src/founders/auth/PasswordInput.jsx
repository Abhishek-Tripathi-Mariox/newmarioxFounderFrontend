import { useState } from 'react';
import styles from './auth.module.css';

function EyeIcon({ open }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M4 4l16 16" />}
    </svg>
  );
}

/** Password field with a show/hide button and a Caps Lock warning. */
export default function PasswordInput({ id, value, onChange, invalid, describedBy, autoComplete = 'current-password', placeholder, autoFocus }) {
  const [visible, setVisible] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const trackCapsLock = (event) => event.getModifierState && setCapsLockOn(event.getModifierState('CapsLock'));

  return (
    <>
      <div className={`${styles.passwordBox} ${invalid ? styles.invalid : ''}`}>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={trackCapsLock}
          onKeyUp={trackCapsLock}
          className={styles.input}
          aria-invalid={Boolean(invalid)}
          aria-describedby={describedBy}
          autoFocus={autoFocus}
        />
        <button
          type="button"
          className={styles.reveal}
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      {capsLockOn && <p className={styles.hint}>Caps Lock is on.</p>}
    </>
  );
}
