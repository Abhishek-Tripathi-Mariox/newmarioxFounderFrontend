import { useState } from 'react';
import s from './LoginScreen.module.css';

function EyeIcon({ open }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M4 4l16 16" />}
    </svg>
  );
}

/** Password input for the sign-in screens, with a show / hide (eye) button. Other props go to the <input>. */
export default function PasswordField(props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={s.pwWrap}>
      <input {...props} className={`${s.input} ${s.pwInput}`} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        className={s.eye}
        onClick={() => setVisible((shown) => !shown)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        title={visible ? 'Hide password' : 'Show password'}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}
