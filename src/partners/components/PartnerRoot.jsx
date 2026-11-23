import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PortalHostContext } from '@/partners/lib/portalHost';
import { ensurePartnerFonts } from '@/partners/lib/fonts';
import '@/partners/styles/isolation.css';
import '@/partners/styles/theme.css';
import '@/partners/styles/globals.css';
import '@/partners/styles/acquire.css';
import '@/partners/styles/skin.css';
import '@/partners/styles/shell.css';

const TITLE = 'Mariox Partners';
const DESCRIPTION = 'Mariox partner portal: pipeline, commissions, projects and sales toolkit.';

/** The Next root layout's <head>: page title, description and the partner fonts, restored on leave. */
function useDocumentHead() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = TITLE;
    const meta = document.querySelector('meta[name="description"]') ?? Object.assign(document.createElement('meta'), { name: 'description' });
    const prevDescription = meta.content;
    meta.content = DESCRIPTION;
    if (!meta.isConnected) document.head.appendChild(meta);
    ensurePartnerFonts();
    return () => {
      document.title = prevTitle;
      meta.content = prevDescription;
    };
  }, []);
}

/** Next scrolled to the top on every page change (but not for #hash links); the router does not. */
function useScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
}

/**
 * Root of the partner app. Everything it renders sits inside `.pp-root`, which scopes the partner
 * stylesheets. Light only, like the internal portal and Founders HQ: `data-theme="light"` keeps
 * theme.css's dark token blocks (system dark mode) from applying under the portal skin (skin.css).
 * Overlays portal into this same element (see lib/portalHost.js), so children mount once the
 * element exists.
 */
export default function PartnerRoot() {
  const [host, setHost] = useState(null);
  useDocumentHead();
  useScrollToTopOnNavigate();

  return (
    <div ref={setHost} className="pp-root" data-theme="light">
      {host && (
        <PortalHostContext.Provider value={host}>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </PortalHostContext.Provider>
      )}
    </div>
  );
}
