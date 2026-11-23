import { Navigate } from 'react-router-dom';
import { useUser } from './UserProvider';
import { firstAdminPage } from './nav';
import { ppCan } from '@/partners/lib/perms';

/**
 * An admin console page that needs View on a section (`mod`, see lib/perms.js). Without it the
 * admin is taken to the first page their role can open (the API refuses the data anyway).
 * Renders nothing until GET /me has answered.
 */
export function SectionGate({ mod, children }) {
  const { user } = useUser();
  if (!user) return null;
  if (!mod || ppCan(user, mod)) return children;
  return <Navigate to={firstAdminPage(user)} replace />;
}

