import { useCallback } from 'react';
import { useUser } from '@/partners/components/UserProvider';
import { ppCan } from '@/partners/lib/perms';

/** `can(mod, act)` for the signed-in admin's role (lib/perms.js); always false for partners. */
export function usePpCan() {
  const { user } = useUser();
  return useCallback((mod, act = 'v') => ppCan(user, mod, act), [user]);
}
