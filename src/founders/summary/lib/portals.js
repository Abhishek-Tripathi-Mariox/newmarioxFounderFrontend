import { createContext, useContext } from 'react';

/** Mariox's two portal apps. Founders HQ passes the links saved on Companies → Mariox; these are the fallbacks. */
export const DEFAULT_PORTAL_LINKS = {
  internal: import.meta.env.VITE_INTERNAL_PORTAL_URL || '/',
  partners: import.meta.env.VITE_PARTNERS_ADMIN_URL || '/partners/admin',
};

export const PortalLinks = createContext(DEFAULT_PORTAL_LINKS);
export const usePortalLinks = () => useContext(PortalLinks);
