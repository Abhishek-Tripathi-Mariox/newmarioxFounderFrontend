import { createContext, useContext } from 'react';

/**
 * The partner app's root element (`.pp-root`). Modals, drawers, dropdown menus and the file viewer
 * portal into it instead of <body>: the partner stylesheet is scoped under `.pp-root`, so anything
 * rendered outside it would lose its styles and theme. PartnerRoot mounts its children only once
 * this element exists, so the value is never null inside the app.
 */
export const PortalHostContext = createContext(null);

export const usePortalHost = () => useContext(PortalHostContext);
