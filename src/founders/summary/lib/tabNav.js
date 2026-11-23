import { createContext, useContext } from 'react';

/**
 * In-page navigation between the summary's tabs (Overview "/", Internal portal "/mariox", Partner
 * portal "/partners", and the hosted management pages Users & roles "/users" and Partners
 * "/partner-admin"). The summary lives inside the app's own router, so it can't run a router of
 * its own: tabs are plain state, and TabLink switches them.
 */
export const SUMMARY_TABS = ['/', '/mariox', '/partners', '/users', '/partner-admin'];

/** Tabs that host a portal's own management page instead of a summary. */
export const HOSTED_TABS = ['/users', '/partner-admin'];

/** A known tab for `to` (ignores any query/hash); unknown paths fall back to Overview. */
export const toTab = (to) => {
  const path = String(to || '/').split(/[?#]/)[0] || '/';
  return SUMMARY_TABS.includes(path) ? path : '/';
};

export const SummaryNav = createContext({ tab: '/', go: () => {} });
export const useSummaryNav = () => useContext(SummaryNav);
