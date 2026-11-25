import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/store';
import { isPMof } from '@/domain/permissions';

/**
 * `(project) => boolean`: may the viewer manage (edit) this project? isPMof() reads the viewer's role
 * permissions (Projects → Edit + scope), so the roles list must be passed along with the users.
 */
export function useIsPM() {
  const s = useStore(useShallow((x) => ({ viewAs: x.viewAs, users: x.users, roles: x.roles })));
  return useCallback((p) => isPMof(s, p), [s]);
}
