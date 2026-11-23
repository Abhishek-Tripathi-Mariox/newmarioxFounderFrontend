import s from './ui.module.css';

/**
 * Opens another Mariox app (internal portal, partner admin). They share one sign-in and live in the
 * same site, so the link opens in this tab. Renders nothing when `href` isn't configured.
 */
export default function ExternalButton({ href, dark = false, children }) {
  if (!href) return null;
  return (
    <a href={href} className={`${s.btn} ${dark ? s.btnDark : s.btnPrimary}`}>
      {children}
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </a>
  );
}
