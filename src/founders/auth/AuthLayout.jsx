import styles from './auth.module.css';

const HIGHLIGHTS = [
  { title: 'Today', text: 'What is late, due and waiting on you, in one view.' },
  { title: 'Tasks, goals and decisions', text: 'One shared list for the founders, with owners and dates.' },
  { title: 'Numbers that matter', text: 'Sales, delivery, finance and hiring at a glance.' },
];

function CheckIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Two-panel frame shared by the sign-in and first-account screens. */
export default function AuthLayout({ children }) {
  return (
    <div className={styles.page}>
      <aside className={styles.brandPanel}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            FH
          </span>
          <div className={styles.brandName}>Founders HQ</div>
        </div>

        <div className={styles.pitch}>
          <h2 className={styles.headline}>Run every company from one place.</h2>
          <ul className={styles.highlights}>
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className={styles.highlight}>
                <span className={styles.check}>
                  <CheckIcon />
                </span>
                <span>
                  <span className={styles.highlightTitle}>{item.title}</span>
                  <span className={styles.highlightText}>{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className={styles.formPanel}>{children}</main>
    </div>
  );
}
