import { matchRoutes, useLocation, useRoutes } from 'react-router-dom';
import { partnerRoutes } from './routes';

function PartnerApp() {
  return useRoutes(partnerRoutes);
}

/**
 * Hook-up point for the host app's router: under /partners/* it renders the partner portal,
 * anywhere else it renders `children` (the internal portal) unchanged. Must sit inside the
 * host's <BrowserRouter>.
 */
export default function PartnerRoutesGate({ children }) {
  const location = useLocation();
  return matchRoutes(partnerRoutes, location) ? <PartnerApp /> : children;
}
