import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';

const FoundersRoot = lazy(() => import('./FoundersRoot'));

/** Path prefix of the Founders HQ inside the combined app. */
export const FOUNDERS_BASE = '/founders';

/**
 * Hook-up point for the host router: under /founders/* it renders the Founders HQ (which keeps its
 * own in-app navigation), anywhere else `children` unchanged. Must sit inside <BrowserRouter>.
 */
export default function FoundersRoutesGate({ children }) {
  const { pathname } = useLocation();
  const inFounders = pathname === FOUNDERS_BASE || pathname.startsWith(`${FOUNDERS_BASE}/`);
  if (!inFounders) return children;
  return (
    <Suspense fallback={null}>
      <FoundersRoot />
    </Suspense>
  );
}
