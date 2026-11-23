import { toTab, useSummaryNav } from './tabNav';

/** Drop-in for react-router's <Link> inside the summary: switches the tab instead of the URL. */
export function TabLink({ to, children, ...rest }) {
  const { go } = useSummaryNav();
  return (
    <a
      href={`#summary${toTab(to)}`}
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        go(to);
      }}
    >
      {children}
    </a>
  );
}
